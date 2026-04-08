import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import App from './App.tsx'
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <PayPalScriptProvider options={{
    clientId: "AWTygkQ_lvn1JWKQEyrXMi_6zX7YCJwjsQazIyoeftI4nyblBK8xYKK1AdPe9E5cOGwoLiWwuul3Tdt8"
  }}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </PayPalScriptProvider>
);