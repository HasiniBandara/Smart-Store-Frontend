import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { saveOrderToBackend } from "../utils/api";
import { useState } from "react";

interface Props {
    totalAmount: number;
    cart: any[];
    setCart: (cart: any[]) => void;
}

const CheckoutForm = ({ totalAmount, cart, setCart }: Props) => {
    const [isLoading, setIsLoading] = useState(false);
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!stripe || !elements || isLoading) return;

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) return;

        setIsLoading(true);
        try {
            const { data } = await axios.post("http://localhost:3000/payment", {
                amount: totalAmount,
            });

            const result = await stripe.confirmCardPayment(data.clientSecret, {
                payment_method: {
                    card: cardElement,
                },
            });

            if (result.error) {
                alert(result.error.message);
                setIsLoading(false);
            } else if (result.paymentIntent?.status === "succeeded") {
                try {
                    await saveOrderToBackend({
                        totalPrice: totalAmount,
                        status: "paid",
                        cartItems: cart.map(item => ({
                            productId: item.id,
                            quantity: item.quantity,
                            price: item.price
                        })),
                        transactionId: result.paymentIntent.id,
                        paymentGateway: "stripe"
                    });
                } catch (e: any) {
                    console.error("Order save failed:", e);
                    alert(e.message || "Order persistence failed. Please contact support.");
                    setIsLoading(false);
                    return;
                }

                alert("Payment successful 🎉");
                setCart([]);
                navigate("/orders");
            }
        } catch (error) {
            console.error("Payment error:", error);
            alert("Payment failed. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="border p-3 rounded mb-3">
                <CardElement />
            </div>

            <button
                type="submit"
                className="w-full bg-primary text-white py-2 rounded disabled:opacity-50"
                disabled={!stripe || isLoading}
            >
                {isLoading ? "Processing..." : "Pay with Card"}
            </button>
        </form>
    );
};

export default CheckoutForm;
