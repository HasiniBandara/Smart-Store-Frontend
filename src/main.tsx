import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import App from './App.tsx'
import './index.css';

// Replace with your actual publishable key
const stripePromise = loadStripe("pk_test_51TKcQtRr0slnGo2H9xO6VbsCZdtpEfXLqMqaSo1bipXQ49aNAgaLmsLdnv44UKSiZGzmm12qI4px3w9lJdcfaoqO00V1JSTePG");


ReactDOM.createRoot(document.getElementById('root')!).render(
  <PayPalScriptProvider options={{
    clientId: "AWTygkQ_lvn1JWKQEyrXMi_6zX7YCJwjsQazIyoeftI4nyblBK8xYKK1AdPe9E5cOGwoLiWwuul3Tdt8"
  }}>
    <Elements stripe={stripePromise}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Elements>
  </PayPalScriptProvider>
);