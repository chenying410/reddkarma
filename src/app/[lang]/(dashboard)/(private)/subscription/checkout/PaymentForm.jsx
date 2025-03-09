"use client"

import { useState, useEffect } from "react";
import { useRouter, useParams } from 'next/navigation'
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { getSession, useSession } from 'next-auth/react'
import { ToastContainer, toast } from 'react-toastify';

const PaymentForm = ({ onReady, plan }) => {
        const stripe = useStripe();
        const elements = useElements();
        const router = useRouter();
        const params = useParams();
        const { lang: locale } = params;
        const [message, setMessage] = useState(null);
        const { data: session, update } = useSession();
        const user = session?.user;
        useEffect(() => {
            if (onReady) {
            onReady(handleSubmit);
            }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [onReady]);

        const handleSubmit = async (e) => {
        if (e) e.preventDefault();
    
        if (!stripe || !elements) {
            return;
        }

        const data = {user, plan}
      
        const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
            return_url: "http://localhost:3000/success",
        },
        redirect: 'if_required',
        });
    
        if (error) {
        setMessage(error.message || "An unexpected error occurred.");
        } 

        const res = await fetch('/api/subscription', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: 'include',
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
        router.push(`/${locale}/subscription`);

        };
    
        return (
        <form id="payment-form" onSubmit={handleSubmit}>
            <PaymentElement id="payment-element" options={{ layout: "accordion" }} />
            {message && <div id="payment-message">{message}</div>}
        </form>
        );
    };

  export default PaymentForm;