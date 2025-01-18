import React from 'react';

const SectionTitle = ({ title }) => (
  <h2 className="text-base font-bold text-xl leading-6">{title}</h2>
);

const AgreementPoint = ({ label, children }) => (
  <article>
  <p style={{ fontWeight: label ? 'normal' : 'bold' }}>{label && <span className="font-semibold">{label}:</span>} {children}</p>
</article>

);

const PrivacyPolicy = () => (
  <div className='max-md:p-2 p-4'>
      <h1 className="flex justify-center my-4 text-5xl font-semibold leading-[63.84px] text-zinc-900">Privacy Policy</h1>
  <header className="mb-4">
        <h1 className="self-stretch text-sm leading-5 underline text-zinc-900">
          Welcome to PracticePartner.ai's Privacy Policy!
        </h1>
        <p>
        This policy outlines how PracticePartner.ai ("we," "us," or "our") collects, uses, discloses, and protects your personal 
        information. Please read this policy carefully to understand how your information will be treated when you use our services.

        </p>
      </header>
    <section>
      <SectionTitle title="1. Nature of Our Business" />
      <AgreementPoint label="At PracticePartner.ai, our primary mission is to assist professionals in launching their private practice by providing a conversational AI business coach and advisory service. Our services encompass a wide range of support, including logo generation, website design advice, technology-related information, and guidance on various aspects of launching and managing a private practice. It is important to note that while our application may generate legal documents, PracticePartner.ai does not provide legal advice. Users are strongly encouraged to consult with their legal counsel for specific situations related to their business." />
    </section>
    <br />

    <section>
      <SectionTitle title="2. Data Collection" />
      <AgreementPoint label="a. Account Information">
        When you create an account with us, we collect information associated with your account. This includes your name, contact information, account credentials, payment card information, and transaction history (collectively, 'Account Information').
      </AgreementPoint>
      <AgreementPoint label="b. User Content">
        When you use our Services, we collect Personal Information included in the input, file uploads, or feedback that you provide to our Services ('Content').
      </AgreementPoint>
      <AgreementPoint label="c. Communication Information">
        If you communicate with us, we collect your name, contact information, and the contents of any messages you send ('Communication Information').
      </AgreementPoint>
      <AgreementPoint label="d. Social Media Information">
        We maintain a presence on various social media sites, such as Instagram, Facebook, Medium, Twitter, YouTube, and LinkedIn. When you interact with our social media pages, we may collect Personal Information that you choose to provide, such as your contact details ('Social Information'). Additionally, the companies hosting our social media pages may provide us with aggregate information and analytics about our social media activity.
      </AgreementPoint>
      <AgreementPoint label="e. Other Information You Provide">
        We may collect other information that you voluntarily provide to us, such as when you participate in our events or surveys or provide information to establish your identity ('Other Information You Provide').
      </AgreementPoint>
    </section>
    <br />

    <section>
      <SectionTitle title="3. Consent for Data Collection" />
      <AgreementPoint label="By using our services, you agree to the terms and conditions, including the collection and processing of your data as described in this Privacy Policy. We obtain your consent through a checkbox agreement to our terms and conditions during the account creation process." />
    </section>
    <br />

    <section>
      <SectionTitle title="4. Data Storage and Security" />
      <AgreementPoint label="We are committed to safeguarding your personal information and employ commercially reasonable technical, administrative, and organizational measures to protect it from loss, misuse, and unauthorized access. While we take significant steps to ensure the security of your data, please be aware that no Internet or email transmission is entirely secure. Therefore, it is important to exercise caution and use discretion when sharing information with us." />
    </section>
    <br />

    <section>
      <SectionTitle title="5. Data Retention" />
      <AgreementPoint label="We retain your Personal Information only for as long as necessary to fulfill the purposes for which it was collected or as required by law. How long we retain your Personal Information depends on various factors, including the nature and sensitivity of the information, the potential risk of harm from unauthorized use or disclosure, our purpose for processing the information, and any legal obligations." />
    </section>
    <br />

    <section>
      <SectionTitle title="6. Data Usage" />
      <AgreementPoint label="a. Purposes of Data Usage">
        We use Personal Information for a variety of purposes, including:
        - To provide, administer, maintain, and analyze our Services.
        - To improve our Services and conduct research to enhance user experiences.
        - To communicate with you, including sending information about our Services and events.
        - To develop new programs and services.
        - To prevent fraud, criminal activity, or misuses of our Services and protect the security of our IT systems, architecture, and networks.
        - To facilitate business transfers, if applicable.
        - To comply with legal obligations and legal processes and protect our rights, privacy, safety, property, and that of our affiliates, you, or other third parties.
      </AgreementPoint>
      <AgreementPoint label="b. Aggregated or De-Identified Information">
        We may aggregate or de-identify Personal Information to analyze the effectiveness of our Services, improve and add features, conduct research, and for other similar purposes. Additionally, we may analyze the general behavior and characteristics of users of our Services, sharing aggregated information like general user statistics with third parties, publishing such information, or making it generally available. We collect aggregated information through the Services, cookies, and other means described in this Privacy Policy. De-identified information is maintained and used in anonymous or de-identified form, and we will not attempt to reidentify the information unless required by law.
      </AgreementPoint>
    </section>
    <br />

    <section>
  <SectionTitle title="7. Sharing with Third Parties" />
  <AgreementPoint label="In certain circumstances, we may share your Personal Information with third parties without further notice to you, unless required by law. These circumstances include, but are not limited to:">
    a. Vendors and Service Providers: To assist us in meeting our business operations needs and performing certain services and functions, we may provide Personal Information to vendors and service providers. These entities may include providers of hosting services, customer service vendors, cloud services, email communication software, web analytics services, and other information technology providers, among others. These parties will access, process, or store Personal Information only in the course of performing their duties to us, pursuant to our instructions.
    b. Business Transfers:  If we are involved in strategic transactions, reorganization, bankruptcy, receivership, or transition of service to another provider (collectively, a "Transaction"), your Personal Information and other information may be disclosed in the diligence process with counterparties and others assisting with the Transaction. Additionally, your information may be transferred to a successor or affiliate as part of that Transaction, along with other assets.
    c. Legal Requirements:  We may share your Personal Information, including information about your interaction with our Services, with government authorities, industry peers, or other third parties in the following circumstances:
      - If required by law or in good faith belief that such action is necessary to comply with a legal obligation.
      - To protect and defend our rights or property.
      - If we determine, in our sole discretion, that there is a violation of our terms, policies, or the law.
      - To detect or prevent fraud or other illegal activity.
      - To protect the safety, security, and integrity of our products, employees, or users, or the public.
      - To protect against legal liability.
    d. Affiliates:  We may disclose Personal Information to our affiliates, which are entities that control, are controlled by, or are under common control with PracticePartner.ai. Our affiliates will use the Personal Information we share in a manner consistent with this Privacy Policy.
    e. Business Account Administrators:  When you join PracticePartners, administrators of that account may access and control your account. 
    f. Other Users and Third Parties You Share Information With:  Certain features of our services allow you to display or share information with other users or third parties. For example, you may share conversations with other users via shared links or send information to third-party applications via custom actions for GPTs. We strongly encourage you to trust any user or third party with whom you share information and to exercise discretion when doing so.
    g. Affiliate Links:  In some cases, the chat responses generated by our service may include affiliate links for recommended services. These links may provide incentives back to PracticePartner.ai in the event a user makes a purchase with the third party.
  </AgreementPoint>
</section>
<br />

<section>
  <SectionTitle title="8. User Rights" />
  <AgreementPoint label="Access, Modification, and Deletion">
    We respect your right to access, modify, or delete your personal data. You can do this through your account settings or by contacting us. We will respond promptly to address your requests.
  </AgreementPoint>
</section>
<br />

<section>
  <SectionTitle title="9. Privacy Compliance" />
  <AgreementPoint label="We are committed to complying with relevant data protection laws and regulations. It is important to note that GDPR and HIPAA do not apply to this business model." />
</section>
<br />

<section>
  <SectionTitle title="10. Data Security Measures" />
  <AgreementPoint label="We take data security seriously and implement a range of technical and organizational measures to protect user data. In the event of data breaches, we will notify affected parties as required by applicable law." />
</section>
<br />

<section>
  <SectionTitle title="11. User Support and Contact Information" />
  <AgreementPoint label="If you have privacy-related concerns or queries, please don't hesitate to contact us at Info@PracticePartner.AI. We aim to respond as quickly as feasible to provide accurate and applicable responses." />
</section>
<br />

<section>
  <SectionTitle title="12. Terms and Conditions" />
  <AgreementPoint label="Please review our Terms and Conditions for additional details on your rights and obligations when using our services." />
</section>
<br />

<section>
  <SectionTitle title="13. Legal Jurisdiction" />
  <AgreementPoint label="This Privacy Policy and our Terms and Conditions are governed by the laws of the United States." />
</section>
<br />

<section>
  <SectionTitle title="14. Updates and Notifications" />
  <AgreementPoint label="a. Notification of Changes">
    We will notify users of any material changes to our Privacy Policy through a prominent notice on our website or via email, where applicable.
  </AgreementPoint>
  <AgreementPoint label="b. Frequency of Updates">
    We anticipate updating our Privacy Policy less than once a year, unless significant changes to our practices require more frequent updates.
  </AgreementPoint>
</section>
<br />

<section>
  <SectionTitle title="15. User Education" />
  <AgreementPoint label="We are committed to educating our users about the importance of privacy and data security. We will provide information and resources to help users understand how their data is handled and how to protect their privacy." />
</section>
<br />

<section>
  <SectionTitle title="16. Data Analytics and Insights" />
  <AgreementPoint label="Use of Aggregated and Anonymized Data">
    While we are considering the use of aggregated and anonymized data for analytics or research purposes, this will depend on the specific business case. Rest assured that we will take all necessary measures to ensure user privacy in any such context.
  </AgreementPoint>
</section>
<br />


  </div>
);

export default PrivacyPolicy;
