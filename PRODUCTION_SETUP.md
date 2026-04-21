# 🚀 Production Setup & Post-Remediation TODO

To fully activate the secure booking and notification system, follow this checklist to configure your environment variables and external services.

## 1. 📧 Email Notifications (Nodemailer + Gmail)
Used for automated traveler confirmations and real-time admin alerts.

- [ ] **Get Gmail App Password**:
    1. Go to [Google App Passwords](https://myaccount.google.com/apppasswords).
    2. Create a new password named "Website" and copy the **16-character code**.
- [ ] **Set Variables**: 
    - `EMAIL_USER`: Your Gmail address (e.g., `guruwangchuk1234@gmail.com`).
    - `EMAIL_APP_PASSWORD`: The 16-character code from step above.
    - `ADMIN_NOTIFICATION_EMAIL`: Comma-separated list of emails to receive alerts.

## 2. 💳 Card Payments (Stripe)
Required for secure checkout and automated booking verification.

### **Phase A: Testing Mode (Safe Testing)**
- [ ] **Set Secret Key**: Copy **Secret key** (`sk_test_...`) from Stripe Dashboard.
- [ ] **Set Payment Link**: Create a **Test Mode Payment Link** in Stripe and set it as `NEXT_PUBLIC_STRIPE_PAYMENT_LINK`.
- [ ] **Configure Webhook**:
    - [ ] Add endpoint: `https://yourdomain.com/api/webhooks/stripe`.
    - [ ] Select event: `checkout.session.completed`.
    - [ ] Copy **Signing Secret** (`whsec_...`) and set as `STRIPE_WEBHOOK_SECRET`.

### **Phase B: Switching to "Real World" (Taking Money)**
When you have finished testing and are ready for real customers:
- [ ] **Live Keys**: Swap `sk_test_...` with your **live** Secret Key (`sk_live_...`).
- [ ] **Live Link**: Update `NEXT_PUBLIC_STRIPE_PAYMENT_LINK` to your **live** Payment Link.
- [ ] **Live Webhook**: Ensure your Webhook in Stripe is pointing to your live URL and you have updated the `STRIPE_WEBHOOK_SECRET` with the the **Live Signing Secret**.

## 4. 🔑 Supabase Authentication
To prevent redirects to `localhost:3000` in production:

1.  **Find your URL**: Open your live deployment (e.g., `https://saidpiece-travel.vercel.app`) in your browser.
2.  **Open Supabase Dashboard** -> Your Project -> **Authentication** -> **URL Configuration**.
3.  **Site URL**: Set this to your current deployment URL (e.g., `https://saidpiece-travel.vercel.app`).
4.  **Redirect URLs**: Add your deployment URL with the callback path and wildcard:
    *   `https://saidpiece-travel.vercel.app/auth/callback*`
    *   **Note**: If you use a custom domain later, you must update these URLs here.

---

## 🛠 Vercel Implementation
1. Go to **Vercel Dashboard** -> **saidpiece-travel** project -> **Settings** -> **Environment Variables**.
2. Add all the keys defined above.
3. **Important**: Set `NEXT_PUBLIC_APP_URL` to your current `.vercel.app` URL (no trailing slash).
4. **Re-deploy** the project in Vercel to activate the new keys.

## 📂 Database Activation
- [ ] Run the SQL migration in `supabase/migrations/20260409_production_bookings.sql` using the Supabase SQL Editor to ensure the `bookings` table is production-ready.

---
*Status: Fully Functional & Secured. Ready for Deployment.*
