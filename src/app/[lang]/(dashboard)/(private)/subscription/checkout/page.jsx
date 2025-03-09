'use client'
import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid2'

// Third-party Imports
import classnames from 'classnames'

// Component Imports
import DirectionalIcon from '@components/DirectionalIcon'

import { getSession, useSession } from 'next-auth/react'

import { Elements } from '@stripe/react-stripe-js'

import { loadStripe } from '@stripe/stripe-js'
import PaymentForm from './PaymentForm'

// Styles Imports
import frontCommonStyles from '../front-styles.module.css'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

const Payment = ({ data }) => {
  const searchParams = useSearchParams();
  const planId = searchParams.get('planId');
  const clientSecret = searchParams.get('clientSecret');
  const params = useParams();
  const { lang: locale } = params;
  const [plan, setPlan] = useState({});
  const { data: session, status } = useSession();

  const paymentFormRef = useRef(null);

  useEffect(() => {
    async function fetchPlan() {
      const res = await fetch('/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
        credentials: 'include',
      });
      const obj = await res.json();
      setPlan(obj.data);
    }
    fetchPlan();
  }, [planId]);

  const appearance = {
    theme: 'stripe',
    variables: {
      colorBackground: '#ffffff',
      colorText: '#323343',
    },
  };

  return (
    <section className={classnames('md:plb-[30px] plb-6', frontCommonStyles.layoutSpacing)}>
      <Card>
        <Grid container>
          <Grid size={{ md: 12, lg: 7 }}>
            <CardContent className='flex flex-col max-sm:gap-y-5 gap-y-8 sm:p-8 border-be lg:border-be-0 lg:border-e bs-full'>
              <div className='flex flex-col gap-2'>
                <Typography variant='h4'>Checkout</Typography>
                <Typography>
                  All plans include 40+ advanced tools and features to boost your product. Choose the best plan to fit
                  your needs.
                </Typography>
              </div>
              <Elements stripe={stripePromise} options={{ appearance, clientSecret }}>
                <PaymentForm onReady={(handleSubmit) => (paymentFormRef.current = handleSubmit)} plan={plan}/>
              </Elements>
            </CardContent>
          </Grid>
          <Grid size={{ md: 12, lg: 5 }}>
            <CardContent className='flex flex-col gap-8 sm:p-8'>
              <div className='flex flex-col gap-2'>
                <Typography variant='h4'>Order Summary</Typography>
                <Typography>
                  It can help you manage and service orders before, during, and after fulfillment.
                </Typography>
              </div>
              <div className='flex flex-col gap-5'>
                <div className='flex flex-col gap-4 p-6 bg-actionHover rounded'>
                  <Typography>A simple start for everyone</Typography>
                  <div className='flex items-baseline'>
                    <Typography variant='h1'>${plan.price}</Typography>
                    <Typography component='sub'> / {plan.durationDays} Days</Typography>
                  </div>
                </div>
                <Button
                  variant='contained'
                  color='success'
                  endIcon={<DirectionalIcon ltrIconClass='tabler-arrow-right' rtlIconClass='tabler-arrow-left' />}
                  onClick={() => paymentFormRef.current && paymentFormRef.current()}
                >
                  Proceed With Payment
                </Button>
              </div>
              <Typography>
                By continuing, you accept to our Terms of Services and Privacy Policy. Please note that payments are
                non-refundable.
              </Typography>
            </CardContent>
          </Grid>
        </Grid>
      </Card>
    </section>
  );
};

export default Payment;
