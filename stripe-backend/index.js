require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const Stripe = require('stripe');
const admin = require('firebase-admin');
const cors = require('cors'); // For handling CORS with your React app

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

const app = express();
app.use(cors({ origin: process.env.REACT_APP_FRONTEND_URL }));

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// IMPORTANT: Webhook middleware must parse the raw body and come BEFORE express.json()
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      const subscriptionId = session.subscription;
      const customerId = session.customer;
      const userId = session.metadata.userId;

      if (subscriptionId && userId) {
        try {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);

          let subscriptionExpiresDate; // Use a distinct variable name for the JS Date object

          // Ensure subscription.current_period_end exists and is a number before converting
          if (typeof subscription.current_period_end === 'number' && subscription.current_period_end > 0) {
            subscriptionExpiresDate = new Date(subscription.current_period_end * 1000);
          } else {
            // Fallback: Calculate subscription end date based on start_date and plan interval
            const startDate = new Date(subscription.start_date * 1000);
            subscriptionExpiresDate = new Date(startDate); // Clone the date to modify it

            const interval = subscription.plan.interval;
            const intervalCount = subscription.plan.interval_count;

            if (interval === 'day') {
              subscriptionExpiresDate.setDate(subscriptionExpiresDate.getDate() + intervalCount);
            } else if (interval === 'week') {
              subscriptionExpiresDate.setDate(subscriptionExpiresDate.getDate() + (intervalCount * 7));
            } else if (interval === 'month') {
              subscriptionExpiresDate.setMonth(subscriptionExpiresDate.getMonth() + intervalCount);
            } else if (interval === 'year') {
              subscriptionExpiresDate.setFullYear(subscriptionExpiresDate.getFullYear() + intervalCount);
            }
            console.warn(`Stripe 'current_period_end' was missing or invalid. Calculated 'subscriptionExpiresDate' based on 'start_date' and plan interval: ${subscriptionExpiresDate}`);
          }

          // Use admin.firestore.Timestamp.fromDate() for robust date saving
          const firestoreSubscriptionExpires = admin.firestore.Timestamp.fromDate(subscriptionExpiresDate);

          await db.collection('users').doc(userId).set({
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscription.id,
            subscriptionStatus: subscription.status,
            subscriptionExpires: firestoreSubscriptionExpires, // Use the Firestore Timestamp object
            planId: subscription.items.data[0].price.id,
            isSubscribed: true,
            isFree: false,
            freePrompts: 0,
            chatPrompts: 0,
            imagePrompts: 0
          }, { merge: true });
        } catch (error) {
          console.error('Error updating user subscription (checkout.session.completed):', error);
        }
      } else {
        console.warn(`Missing subscriptionId or userId for checkout.session.completed: session.subscription=${subscriptionId}, session.metadata.userId=${userId}`);
      }
      break;

    case 'customer.subscription.updated':
    case 'invoice.paid':
      const eventData = event.data.object;
      let subscriptionIdForLookup;
      let actualSubscriptionObject;

      if (event.type === 'invoice.paid') {
        subscriptionIdForLookup = eventData.subscription;
        try {
          actualSubscriptionObject = await stripe.subscriptions.retrieve(subscriptionIdForLookup);
        } catch (error) {
          console.error(`Error retrieving subscription for invoice.paid event ${event.id}: ${error.message}`);
          return res.status(500).send('Error processing webhook');
        }
      } else {
        subscriptionIdForLookup = eventData.id;
        actualSubscriptionObject = eventData;
      }

      const usersRef = db.collection('users');
      const querySnapshot = await usersRef.where('stripeSubscriptionId', '==', subscriptionIdForLookup).get();

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userId = userDoc.id;

        if (actualSubscriptionObject) {
          let currentPeriodEndForUpdate; // Use a distinct variable name
          if (typeof actualSubscriptionObject.current_period_end === 'number' && actualSubscriptionObject.current_period_end > 0) {
            currentPeriodEndForUpdate = new Date(actualSubscriptionObject.current_period_end * 1000);
          } else {
            // Fallback for current_period_end calculation if missing from updated/paid event
            const startDate = new Date(actualSubscriptionObject.start_date * 1000); // Or retrieve from Firestore if 'start_date' isn't on event object
            currentPeriodEndForUpdate = new Date(startDate);
            const interval = actualSubscriptionObject.plan.interval;
            const intervalCount = actualSubscriptionObject.plan.interval_count;

            if (interval === 'day') {
              currentPeriodEndForUpdate.setDate(currentPeriodEndForUpdate.getDate() + intervalCount);
            } else if (interval === 'week') {
              currentPeriodEndForUpdate.setDate(currentPeriodEndForUpdate.getDate() + (intervalCount * 7));
            } else if (interval === 'month') {
              currentPeriodEndForUpdate.setMonth(currentPeriodEndForUpdate.getMonth() + intervalCount);
            } else if (interval === 'year') {
              currentPeriodEndForUpdate.setFullYear(currentPeriodEndForUpdate.getFullYear() + intervalCount);
            }
            console.warn(`'current_period_end' was missing or invalid for ${event.type}. Calculated date based on 'start_date' and plan interval.`);
          }

          const firestoreCurrentPeriodEnd = admin.firestore.Timestamp.fromDate(currentPeriodEndForUpdate);

          const updateData = {
            subscriptionStatus: actualSubscriptionObject.status,
            subscriptionExpires: firestoreCurrentPeriodEnd, // Use Firestore Timestamp
            planId: actualSubscriptionObject.items.data[0].price.id
          };

          if (actualSubscriptionObject.status === 'active' || actualSubscriptionObject.status === 'trialing') {
            updateData.isSubscribed = true;
            updateData.isFree = false;
            updateData.freePrompts = 0;
          } else {
            updateData.isSubscribed = false;
            updateData.isFree = true;
          }

          await db.collection('users').doc(userId).set(updateData, { merge: true });
        } else {
          console.error(`Actual subscription object is null for event type ${event.type} and subscription ID ${subscriptionIdForLookup}`);
        }
      } else {
        console.warn(`No user found in Firestore for subscription ID: ${subscriptionIdForLookup} from event type ${event.type}`);
      }
      break;

    case 'customer.subscription.deleted':
      const deletedSubscription = event.data.object;
      const usersQuerySnapshot = await db.collection('users')
        .where('stripeSubscriptionId', '==', deletedSubscription.id)
        .get();

      if (!usersQuerySnapshot.empty) {
        const userDoc = usersQuerySnapshot.docs[0];
        const userId = userDoc.id;
        await db.collection('users').doc(userId).set({
          subscriptionStatus: 'canceled',
          subscriptionExpires: null,
          planId: null,
          isSubscribed: false,
          isFree: true,
          freePrompts: 12,
          chatPrompts: 0,
          imagePrompts: 0
        }, { merge: true });
      } else {
        console.warn(`No user found for deleted subscription ID: ${deletedSubscription.id}`);
      }
      break;

    case 'invoice.payment_failed':
      const failedInvoice = event.data.object;

      const usersFailedPaymentQuerySnapshot = await db.collection('users')
        .where('stripeSubscriptionId', '==', failedInvoice.subscription)
        .get();

      if (!usersFailedPaymentQuerySnapshot.empty) {
        const userDoc = usersFailedPaymentQuerySnapshot.docs[0];
        const userId = userDoc.id;
        await db.collection('users').doc(userId).set({
          subscriptionStatus: 'past_due',
          isSubscribed: true,
          isFree: false
        }, { merge: true });
      }
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

app.use(express.json());

// Endpoint to create a Stripe Checkout Session
app.post('/create-checkout-session', async (req, res) => {
  const { priceId, userId } = req.body;

  if (!priceId || !userId) {
    return res.status(400).json({ error: 'Missing priceId or userId' });
  }

  try {
    let customerId;
    const userDoc = await db.collection('users').doc(userId).get();
    if (userDoc.exists && userDoc.data().stripeCustomerId) {
      customerId = userDoc.data().stripeCustomerId;
    } else {
      const customer = await stripe.customers.create({
        metadata: {
          firebaseUid: userId
        }
      });
      customerId = customer.id;
      await db.collection('users').doc(userId).set({ stripeCustomerId: customerId }, { merge: true });
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.REACT_APP_FRONTEND_URL}/payment-success?payment_status=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.REACT_APP_FRONTEND_URL}/payment-cancel`,
      metadata: {
        userId: userId,
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint for Customer Portal
app.post('/create-customer-portal-session', async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'Missing userId' });
  }

  try {
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists || !userDoc.data().stripeCustomerId) {
      return res.status(404).json({ error: 'Stripe Customer ID not found for this user.' });
    }

    const customerId = userDoc.data().stripeCustomerId;

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.REACT_APP_FRONTEND_URL}/account`,
    });

    res.json({ url: portalSession.url });
  } catch (error) {
    console.error('Error creating customer portal session:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint for image generation (assuming it's related to subscription access)
app.post('/generate-image', async (req, res) => {
  const { userId, prompt } = req.body;

  if (!userId || !prompt) {
    return res.status(400).json({ error: 'Missing userId or prompt' });
  }

  try {
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return res.status(403).json({ error: 'User not found.' });
    }

    const userData = userDoc.data();
    const { subscriptionStatus, subscriptionExpires, freePrompts, chatPrompts, imagePrompts } = userData;

    // Access check logic (from subscriptionService.js)
    let hasAccess = false;
    let message = 'No active subscription or free prompts remaining.';
    let currentPrompts = 0; // Default to 0 prompts if no access

    if ((subscriptionStatus === 'active' && subscriptionExpires && subscriptionExpires.toDate() > new Date()) || subscriptionStatus === 'trialing') {
      hasAccess = true;
      message = 'Access granted!';
      currentPrompts = chatPrompts; // Or imagePrompts depending on the type of prompt
    } else if (freePrompts > 0) {
      hasAccess = true;
      message = `You have ${freePrompts} free prompts remaining.`;
      currentPrompts = freePrompts;
    } else if (subscriptionStatus === 'past_due') {
      message = 'Your payment is past due. Please update your payment method.';
    } else if (subscriptionStatus === 'canceled' || (subscriptionExpires && subscriptionExpires.toDate() <= new Date())) {
      message = 'Your subscription has ended or is canceled.';
    }

    if (!hasAccess || currentPrompts <= 0) {
      return res.status(403).json({ error: message });
    }

    // --- Deduct prompt logic (if applicable) ---
    // This is where you would decrement 'chatPrompts' or 'imagePrompts'
    // For subscribed users, you'd decrement based on their plan's limits
    // For free users, you'd decrement 'freePrompts'

    // Example for freePrompts (assuming this endpoint uses freePrompts)
    // if (userData.isFree && userData.freePrompts > 0) {
    //     await db.collection('users').doc(userId).update({ freePrompts: admin.firestore.FieldValue.increment(-1) });
    // } else if (userData.isSubscribed && userData.chatPrompts > 0) { // Example for paid chat prompts
    //     await db.collection('users').doc(userId).update({ chatPrompts: admin.firestore.FieldValue.increment(-1) });
    // }


    // Implement your image generation logic here
    const generatedImage = `Generated image for "${prompt}"`; // Placeholder
    res.json({ image: generatedImage });

  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));