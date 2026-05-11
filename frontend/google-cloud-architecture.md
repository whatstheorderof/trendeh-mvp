# Google Cloud Architecture for Trendeh

Yes, you can build the entire backend infrastructure for authentication and subscription management using the Google Cloud ecosystem. Here is how it works:

## 1. Authentication: Google Cloud Identity Platform (Firebase Auth)
Google Cloud offers **Identity Platform** (which powers Firebase Authentication). It is the perfect, native way to handle authentication in a React SPA.
*   **Features:** Supports Email/Password, Google, GitHub, Apple, and Magic Link logins.
*   **Integration:** You use the Firebase JS SDK on the frontend. It securely manages JWT tokens and sessions.
*   **Cost:** Generous free tier (up to 50,000 monthly active users free).

## 2. Payments: Stripe + Google Cloud Functions
Google Cloud **does not** have a native SaaS subscription billing engine (like Stripe or Paddle). Google Pay is a payment method, not a subscription manager. To handle Pro plan payments on Google Cloud, you use a hybrid approach:
*   **Payment Gateway:** Use **Stripe Checkout** or **Stripe Payment Links** to handle the actual credit card processing and subscription logic.
*   **Webhook Handler:** Create a **Google Cloud Function** (Node.js/TypeScript) to listen for Stripe webhooks (e.g., `invoice.payment_succeeded`, `customer.subscription.deleted`).
*   **Database:** Use **Firestore** (Google Cloud's NoSQL database) to store the user's profile. When the Cloud Function receives a successful payment webhook from Stripe, it updates the user's Firestore document (`isPro: true`).

## 3. The Flow
1. User clicks "Upgrade to Pro" in the React app.
2. React app redirects user to a Stripe Checkout URL.
3. User pays on Stripe.
4. Stripe sends a webhook to your Google Cloud Function.
5. Cloud Function verifies the webhook and updates the user's `isPro` status in Firestore.
6. The React app (listening to Firestore in real-time) instantly unlocks the Pro features.

*Note: The code updates in this patch implement the frontend React Context scaffolding for this Auth and Pro-status flow.*
