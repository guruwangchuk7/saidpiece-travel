# 🚀 Production Setup & Post-Remediation TODO

To fully activate the secure booking and notification system, follow this checklist to configure your environment variables and external services.

## 1. 📧 Email Notifications (Resend)
Used for automated traveler confirmations and admin alerts.

- [ ] **Get API Key**: Log in to [Resend](https://resend.com) -> API Keys -> Create API Key.
- [ ] **Verify Domain**: Go to "Domains" tab and verify `saidpiecetravels.com`.
- [ ] **Set Variable**: `RESEND_API_KEY`

## 2. 💳 Card Payments (Stripe)
Required for secure checkout and automated verification.

- [ ] **Get Secret Key**: Log in to [Stripe Dashboard](https://dashboard.stripe.com) -> Developers -> API Keys -> Copy **Secret key** (`sk_...`).
- [ ] **Set Variable**: `STRIPE_SECRET_KEY`
- [ ] **Configure Webhook**:
    - [ ] Go to Developers -> Webhooks.
    - [ ] Add endpoint: `https://your-production-url.com/api/webhooks/stripe`.
    - [ ] Select event: `checkout.session.completed`.
    - [ ] Copy the **Signing Secret** (`whsec_...`).
- [ ] **Set Variable**: `STRIPE_WEBHOOK_SECRET`

## 3. 🌐 Application Settings
- [ ] **Production URL**: Ensure `NEXT_PUBLIC_APP_URL` is set to your live domain (e.g., `https://saidpiecetravels.com`).
- [ ] **Admin Alert**: Set `ADMIN_NOTIFICATION_EMAIL` to the email where you want to receive new booking alerts.

---

## 🛠 Deployment Checklist

### Local Testing
Create or update `.env.local` in your project root:
```bash
# Email Notifications
RESEND_API_KEY=re_your_key_here
ADMIN_NOTIFICATION_EMAIL=saidpiece@gmail.com

# Stripe Payments
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Vercel Production
1. Go to **Vercel Dashboard** -> **saidpiece-travel** project.
2. Go to **Settings** -> **Environment Variables**.
3. Add the keys above.
4. **Redeploy** the project to apply changes.

### Database Activation
- [ ] Run the SQL migration in `supabase/migrations/20260409_production_bookings.sql` using the Supabase SQL Editor.

---
*Remediation completed by Antigravity AI (Google DeepMind).*
