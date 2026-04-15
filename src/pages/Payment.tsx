import Navbar from "../components/Navbar";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import CheckoutForm from "../components/CheckoutForm";

const Payment = ({ cart, setCart }: { cart: any[], setCart: any }) => {
    const [method, setMethod] = useState("paypal");

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

                {/* 🔀 PAYMENT METHOD SELECT */}
                <div className="flex gap-2 mb-4">
                    <button
                        onClick={() => setMethod("paypal")}
                        className={`flex-1 py-2 rounded-full border ${method === "paypal"
                            ? "bg-primary text-white"
                            : "border-primary"
                            }`}
                    >
                        PayPal
                    </button>

                    <button
                        onClick={() => setMethod("stripe")}
                        className={`flex-1 py-2 rounded-full border ${method === "stripe"
                            ? "bg-primary text-white"
                            : "border-primary"
                            }`}
                    >
                        Card
                    </button>
                </div>

                {/* 🟡 PAYPAL */}
                {method === "paypal" && (
                    <PayPalButtons
                        style={{ layout: "vertical" }}
                        createOrder={(_data, actions) => {
                            return actions.order.create({
                                intent: "CAPTURE",
                                purchase_units: [
                                    {
                                        amount: {
                                            currency_code: "USD", // changed back to USD as PayPal LKR support is limited in some integrations, but label says Rs.
                                            value: totalAmount.toString(),
                                        },
                                    },
                                ],
                            });
                        }}
                        onApprove={(_data, actions) => {
                            return actions.order!.capture().then(() => {
                                alert("Payment successful 🎉");
                                setCart([]);
                                navigate("/orders");
                            });
                        }}
                    />
                )}

                {/* 💳 STRIPE */}
                {method === "stripe" && (
                    totalAmount > 0 ? (
                        <CheckoutForm totalAmount={totalAmount} setCart={setCart} />
                    ) : (
                        <div className="text-center p-4 bg-red-50 text-red-600 rounded-lg">
                            Your cart is empty. Add items to proceed with Card payment.
                        </div>
                    )
                )}


                {/* 💵 CASH */}
                <button className="w-full border border-primary py-2 rounded-full mt-4">
                    Cash on Pickup
                </button>
            </div>
        </div>
    );
};


export default Payment;
