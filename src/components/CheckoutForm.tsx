import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Props {
    totalAmount: number;
    setCart: (cart: any[]) => void;
}

const CheckoutForm = ({ totalAmount, setCart }: Props) => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) return;

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
            } else if (result.paymentIntent?.status === "succeeded") {
                alert("Payment successful 🎉");
                setCart([]);
                navigate("/orders");
            }
        } catch (error) {
            console.error("Payment error:", error);
            alert("Payment failed. Please try again.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="border p-3 rounded mb-3">
                <CardElement />
            </div>

            <button
                type="submit"
                className="w-full bg-primary text-white py-2 rounded"
                disabled={!stripe}
            >
                Pay with Card
            </button>
        </form>
    );
};

export default CheckoutForm;