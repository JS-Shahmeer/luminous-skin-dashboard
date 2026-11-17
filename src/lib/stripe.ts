import Stripe from "stripe";

// Constructed lazily, not at module scope — Stripe's constructor throws on an
// empty key, which would crash the build (page-data collection runs this
// module) whenever STRIPE_SECRET_KEY isn't set yet, e.g. a preview deploy.
let stripeClient: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeClient) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");
  }
  return stripeClient;
}

export const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
