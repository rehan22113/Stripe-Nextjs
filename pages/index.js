import React,{useEffect} from 'react'
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import {loadStripe} from '@stripe/stripe-js'
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from './checkout';
export default function Home() {
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  const [clientSecret, setClientSecret] = React.useState("");
  const CreatePaymentIntent = async()=>{
    const res =await fetch("/api/payment",{
      method:"POST",
    headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        "price":150
      })
    })
    if(res.status!=400){
      
      const {clientSecret} =await res.json();

      setClientSecret(clientSecret)
    }
  }
  useEffect(() => {
    CreatePaymentIntent()
  }, []);

  const appearance = {
    theme: 'stripe',
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (

    <div className={styles.container}>
      <Head>
        <title>Stripe payment integration</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1 className={styles.title} >
          Welcome to <a href="https://mrehan.vercel.app">Rehan Developing Zone!</a>
        </h1>
        <div>
        {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm clientSecret={clientSecret}/>
        </Elements>
      )}
        </div>
      </main>
      <style jsx>{`
        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }
        * {
          box-sizing: border-box;
        }
        .payment{
          width:400px;
          height:400px
        }
      `}</style>
    </div>
  )
}
