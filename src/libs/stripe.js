import Stripe from 'stripe';

export const stripe_auth= new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);


