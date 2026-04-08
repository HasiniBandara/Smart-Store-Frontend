import Navbar from "../components/Navbar";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

const Payment = ({ cart, setCart }: any) => {
    const navigate = useNavigate();

    // ✅ calculate total amount
    const totalAmount = useMemo(() => {
        return cart.reduce(
            (sum: number, item: any) =>
                sum + Number(item.price) * item.quantity,
            0
        );
    }, [cart]);

    return (
        <div className="min-h-screen bg-[#f5f0f2] px-10">
            <Navbar />

            <h1 className="text-3xl font-bold text-primary text-center mb-10">
                Payment
            </h1>

            <div className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow">
                <h2 className="text-lg font-semibold mb-4">
                    Total: Rs. {totalAmount}
                </h2>

                {/* ✅ PAYPAL BUTTON */}
                <PayPalButtons
                    style={{ layout: "vertical" }}

                    createOrder={(data, actions) => {
                        return actions.order.create({
                            intent: "CAPTURE", // ✅ REQUIRED

                            purchase_units: [
                                {
                                    amount: {
                                        currency_code: "USD", // ✅ REQUIRED
                                        value: totalAmount.toString(), // ✅ MUST be string
                                    },
                                },
                            ],
                        });
                    }}

                    onApprove={(data, actions) => {
                        return actions.order!.capture().then((details) => {
                            alert("Payment successful 🎉");
                            setCart([]); // ✅ Clear cart only after payment
                            navigate("/success"); // ✅ Navigate to success page
                        });
                    }}
                />

                {/* OPTIONAL: Cash option */}
                <button className="w-full border border-primary py-2 rounded-full mt-4">
                    Cash on Pickup
                </button>
            </div>
        </div>
    );
};

export default Payment;
