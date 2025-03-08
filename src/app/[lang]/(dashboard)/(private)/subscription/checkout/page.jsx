'use client'
import { useState, useEffect } from 'react'
import { useRouter,useSearchParams, useParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid2'
import MenuItem from '@mui/material/MenuItem'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'

// Third-party Imports
import classnames from 'classnames'
import { ToastContainer, toast } from 'react-toastify';

// Component Imports
import CustomInputHorizontal from '@core/components/custom-inputs/Horizontal'
import PricingDialog from '@components/dialogs/pricing'
import OpenDialogOnElementClick from '@components/dialogs/OpenDialogOnElementClick'
import DirectionalIcon from '@components/DirectionalIcon'
import { useSettings } from '@core/hooks/useSettings'
import CustomTextField from '@core/components/mui/TextField'

import { getSession, useSession } from 'next-auth/react'
import Image from 'next/image';
import {
  PaymentElement,
  useStripe,
  useElements,
  Elements
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
// Styles Imports
import frontCommonStyles from '../front-styles.module.css'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

// Data
const cardData = [
  {
    title: (
      <div className='flex items-center gap-4'>
        <Avatar
          variant='rounded'
          className='is-[58px] bs-[34px]'
          sx={theme => ({
            backgroundColor: 'var(--mui-palette-action-hover)',
            ...theme.applyStyles('dark', {
              backgroundColor: 'var(--mui-palette-common-white)'
            })
          })}
        >
          <Image src='/images/logos/visa.png' alt='plan' className='bs-3' width="40" height="40" />
        </Avatar>
        <Typography color='text.primary' className='font-medium'>
          Credit Card
        </Typography>
      </div>
    ),
    value: 'credit-card',
    isSelected: true
  },
  {
    title: (
      <div className='flex items-center gap-4'>
        <Avatar
          variant='rounded'
          className='is-[58px] bs-[34px]'
          sx={theme => ({
            backgroundColor: 'var(--mui-palette-action-hover)',
            ...theme.applyStyles('dark', {
              backgroundColor: 'var(--mui-palette-common-white)'
            })
          })}
        >
          <Image src='/images/logos/paypal.png' alt='plan' className='bs-5' width="20" height="20" />
        </Avatar>
        <Typography color='text.primary' className='font-medium'>
          Paypal
        </Typography>
      </div>
    ),
    value: 'paypal'
  }
]

const countries = ['Australia', 'Brazil', 'Canada', 'India', 'United Arab Emirates', 'United Kingdom', 'United States']

const Payment = ({ data }) => {
  
  const searchParams = useSearchParams()
  const planId = searchParams.get('planId')

  const router = useRouter();
  const params = useParams();
  const { lang: locale } = params;
  const [errorState, setErrorState] = useState([]);
  const [plan, setPlan] = useState({});
  const { data: session, status } = useSession();

  useEffect(()=> {
   
    async function fetchPlan() {
      const res = await fetch('/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
        credentials: 'include',
      });
      const obj = await res.json();
      const plan = obj.data;
      setPlan(plan);
    }
    fetchPlan();
  },[planId]);

  const pay = async (data) => {
    if (session) {
      const userId = session.user?.id;
      const data = {
        userId: userId,
        amount: 0,
        description: 'Payment'
      }
      const res = await fetch('/api/payment', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
      });
      const obj = await res.json();
      if (res && res.ok) {
        toast.success(obj.success.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
      else {
        const error = obj.error;
        setErrorState(error);
        return;
      }
    }
  }

  const handleSubscriptionAction = async (user, plan) => {

    const data = { user, plan }
    const res = await fetch('/api/subscription', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    });
    const obj = await res.json();
    if (res && res.ok) {
      toast.success(obj.success.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
    else {
      const error = obj.error;
      setErrorState(error);
    }
  }
 
  const handlePayment = async () => {
    // const user = session?.user;
    // const res = await fetch('/api/plan');

    if (res && res.ok) {
      const obj = await res.json();
      const plans = obj.data;
      const plan_array = plans.filter(plan => plan.id === Number(planId));
      const plan = plan_array[0];
      await pay('');
      await handleSubscriptionAction(user, plan);
      session.user.subscription.planId = plan.id;
      const url = `/${locale}/subscription`;
      router.push(url);
    }
  }

  const initialSelected = cardData.filter(item => item.isSelected)[cardData.filter(item => item.isSelected).length - 1]
    .value

  // States
  const [selectCountry, setSelectCountry] = useState('Brazil')
  const [selectInput, setSelectInput] = useState(initialSelected)

  // Hooks
  const { updatePageSettings } = useSettings()

  const handleCountryChange = event => {
    setSelectCountry(event.target.value)
  }

  const handlePaymentChange = prop => {
    if (typeof prop === 'string') {
      setSelectInput(prop)
    } else {
      setSelectInput(prop.target.value)
    }
  }

  // For Page specific settings
  useEffect(() => {
    return updatePageSettings({
      skin: 'default'
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
              <Grid container spacing={4}>
                {cardData.map((item, index) => (
                  <CustomInputHorizontal
                    key={index}
                    type='radio'
                    name='paymemt-method'
                    data={item}
                    selected={selectInput}
                    handleChange={handlePaymentChange}
                    gridProps={{ size: { xs: 12, sm: 6 } }}
                  />
                ))}
              </Grid>
              <div>
                <Typography variant='h4' className='mbe-6'>
                  Billing Details
                </Typography>
                <Grid container spacing={5}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <CustomTextField fullWidth label='Email Address' placeholder='john.deo@gmail.com' type='email' />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <CustomTextField
                      fullWidth
                      type='password'
                      id='password-input'
                      label='Password'
                      placeholder='Password'
                    />
                  </Grid>
                  {/* <Grid size={{ xs: 12, sm: 6 }}>
                    <CustomTextField
                      select
                      fullWidth
                      label='Billing Country'
                      name='country'
                      variant='outlined'
                      value={selectCountry}
                      onChange={handleCountryChange}
                    >
                      {countries.map((item, index) => (
                        <MenuItem key={index} value={item}>
                          {item}
                        </MenuItem>
                      ))}
                    </CustomTextField>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <CustomTextField
                      label='Billing Zip / Postal Code'
                      id='postal-code-input'
                      placeholder='Billing Zip / Postal Code'
                      fullWidth
                      type='number'
                    />
                  </Grid> */}
                </Grid>
              </div>
              {selectInput === 'credit-card' && (
                <div>
                  <Typography variant='h4' className='mbe-6'>
                    Credit Card Info
                  </Typography>
                  <Grid container spacing={5}>
                    <Grid size={{ xs: 12 }}>
                      <CustomTextField
                        fullWidth
                        id='card-number-input'
                        placeholder='8763 2345 3478'
                        label='Card Number'
                        type='number'
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 5 }}>
                      <CustomTextField fullWidth id='card-holder-name' placeholder='Gilves Gonzalez' label='Card Holder' />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <CustomTextField
                        fullWidth
                        id='expiry-date'
                        placeholder='05/2026'
                        label='EXP. date'
                        type='date'
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 3 }}>
                      <CustomTextField fullWidth id='cvv' placeholder='734' label='CVV' type='number' />
                    </Grid>
                  </Grid>
                </div>
              )}
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
                {/* <div>
                  <div className='flex gap-2 items-center justify-between mbe-2'>
                    <Typography>Subscription</Typography>
                    <Typography color='text.primary' className='font-medium'>
                      $85.99
                    </Typography>
                  </div>
                  <div className='flex gap-2 items-center justify-between'>
                    <Typography>Tax</Typography>
                    <Typography color='text.primary' className='font-medium'>
                      $4.99
                    </Typography>
                  </div>
                  <Divider className='mlb-4' />
                  <div className='flex gap-2 items-center justify-between'>
                    <Typography>Total</Typography>
                    <Typography color='text.primary' className='font-medium'>
                      $90.98
                    </Typography>
                  </div>
                </div> */}
                <Button
                  variant='contained'
                  color='success'
                  onClick={handlePayment}
                  endIcon={<DirectionalIcon ltrIconClass='tabler-arrow-right' rtlIconClass='tabler-arrow-left' />}
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
  )
}

export default Payment
