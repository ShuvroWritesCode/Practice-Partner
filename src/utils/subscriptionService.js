// src/utils/subscriptionUtils.js
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../utlis/firebase';

export const checkSubscriptionStatus = async (userId) => {
  const user = auth.currentUser;

  if (!user || user.uid !== userId) { // Added a check to ensure the passed userId matches the current user
    console.warn("Attempted to check subscription for a non-matching or null user.");
    return { hasAccess: false, message: 'Authentication required.', status: 'none', prompts: 0 };
  }

  const userDocRef = doc(db, 'users', userId);
  const userDocSnap = await getDoc(userDocRef);

  if (userDocSnap.exists()) {
    const userData = userDocSnap.data();
    const { subscriptionStatus, subscriptionExpires, freePrompts } = userData;

    if ((subscriptionStatus === 'active' && subscriptionExpires && subscriptionExpires.toDate() > new Date()) || subscriptionStatus === 'trialing') {
      return { hasAccess: true, message: 'Access granted!', status: subscriptionStatus, prompts: freePrompts };
    } else if (freePrompts > 0) {
      return { hasAccess: true, message: `You have ${freePrompts} free prompts remaining.`, status: 'free', prompts: freePrompts };
    } else if (subscriptionStatus === 'past_due') {
      return { hasAccess: false, message: 'Your payment is past due. Please update your payment method.', status: subscriptionStatus, prompts: freePrompts };
    } else if (subscriptionStatus === 'canceled' || (subscriptionExpires && subscriptionExpires.toDate() <= new Date())) {
      return { hasAccess: false, message: 'Your subscription has ended or is canceled.', status: subscriptionStatus, prompts: freePrompts };
    }
  }
  return { hasAccess: false, message: 'No active subscription found. Please subscribe.', status: 'none', prompts: 0 };
};