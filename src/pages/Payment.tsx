import Navbar from "../components/Navbar";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CheckoutForm from "../components/CheckoutForm";
import { saveOrderToBackend } from "../utils/api";

const Payment = ({ cart, setCart }: { cart: any[]; setCart: any }) => {
    const [method, setMethod] = useState("paypal");
    const [usdRate, setUsdRate] = useState<number | null>(null);
    const [rateLoading, setRateLoading] = useState(true);
    // const [rateError, setRateError] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const navigate = useNavigate();

    const saveOrder = async (status: string, transactionId?: string, paymentGateway?: string) => {
        try {
            await saveOrderToBackend({
                totalPrice: totalLKR,
                status: status,
                cartItems: cart.map(item => ({
                    productId: item.id,
                    quantity: item.quantity,
                    price: item.price
                })),
                transactionId,
                paymentGateway
            });
            return true;
        } catch (e: any) {
            console.error("Error saving order:", e);
            alert(e.message || "Failed to save order.");
            return false;
        }
    };

    const totalLKR = useMemo(() =>
        cart.reduce((sum: number, item: any) => sum + Number(item.price) * item.quantity, 0),
        [cart]
    );

    useEffect(() => {
        const fetchRate = async () => {
            try {
                setRateLoading(true);
                // setRateError(false);
                const res = await fetch("https://open.er-api.com/v6/latest/LKR");
                const data = await res.json();
                if (data?.rates?.USD) setUsdRate(data.rates.USD);
                else throw new Error("Invalid rate data");
            } catch {
                // setRateError(true);
                setUsdRate(0.0031);
            } finally {
                setRateLoading(false);
            }
        };
        fetchRate();
    }, []);

    const totalUSD = useMemo(() => {
        if (!usdRate) return 0;
        return Math.max(totalLKR * usdRate, 0.5);
    }, [totalLKR, usdRate]);


    return (
        <div className="bg-[#f6f2f3] min-h-screen px-8 md:px-16 py-10 font-sans transition-opacity duration-500 opacity-100">
            <Navbar />

            {/* HEADER */}
            <div className="px-10 lg:px-24 py-10">
                <p className="text-sm tracking-widest text-primary mb-2">
                    CHECKOUT JOURNEY
                </p>

                <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                    Complete Your Order
                </h1>

                <p className="text-gray-600 max-w-xl">
                    Please select your preferred payment method to secure your selection from our freshly baked batch.
                </p>
            </div>

            {/* MAIN GRID */}
            <div className="grid lg:grid-cols-[2fr_1fr] gap-10 px-10 lg:px-24 pb-20">

                {/* LEFT SIDE */}
                <div>
                    <h2 className="text-lg font-semibold mb-4">
                        Select Payment Method
                    </h2>

                    {/* CASH OPTION */}
                    <div
                        onClick={() => !isProcessing && setMethod("cash")}
                        className={`border rounded-xl p-5 mb-4 flex justify-between items-center
                        ${isProcessing ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                        ${method === "cash" ? "border-primary bg-red-50" : "bg-white"}`}
                    >
                        <div>
                            <p className="font-semibold">Cash on Pickup</p>
                            <p className="text-sm text-gray-500">
                                Pay when you collect your order
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                                No 100, High level road, Maharagama
                            </p>
                        </div>

                        <div className={`w-5 h-5 rounded-full border-2 ${method === "cash" ? "border-primary bg-primary" : "border-gray-400"}`} />
                    </div>

                    {/* OTHER METHODS GRID */}
                    <div className="grid grid-cols-2 gap-4">
                        {["paypal", "stripe"].map((m) => (
                            <div
                                key={m}
                                onClick={() => !isProcessing && setMethod(m)}
                                className={`border rounded-xl p-4 flex justify-between items-center
                                ${isProcessing ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                                ${method === m ? "border-primary bg-red-50" : "bg-white"}`}
                            >
                                <span className="capitalize">
                                    {m}
                                </span>
                                <div className={`w-4 h-4 rounded-full border ${method === m ? "bg-primary border-primary" : ""}`} />
                            </div>
                        ))}
                    </div>

                    {/* PAYMENT UI */}
                    <div className="mt-6 bg-white p-6 rounded-xl shadow-sm">

                        {/* PAYPAL */}
                        {method === "paypal" && totalLKR > 0 && (
                            <>
                                <div className="text-sm text-gray-500 mb-3">
                                    <span className="italic">Processing in LKR...</span>
                                </div>

                                {!rateLoading && (
                                    <PayPalButtons
                                        style={{ layout: "vertical" }}
                                        createOrder={(_data, actions) =>
                                            actions.order.create({
                                                intent: "CAPTURE",
                                                purchase_units: [{
                                                    amount: {
                                                        currency_code: "USD",
                                                        value: totalUSD.toFixed(2)
                                                    }
                                                }],
                                            })
                                        }
                                        onApprove={(_data, actions) =>
                                            actions.order!.capture().then(async (details) => {
                                                setIsProcessing(true);
                                                const saved = await saveOrder("paid", details.id, "paypal");
                                                setIsProcessing(false);
                                                if (saved) {
                                                    alert("Payment successful 🎉");
                                                    setCart([]);
                                                    navigate("/orders");
                                                }
                                            })
                                        }
                                        disabled={isProcessing}
                                    />
                                )}
                            </>
                        )}

                        {/* STRIPE */}
                        {method === "stripe" && totalLKR > 0 && (
                            <CheckoutForm totalAmount={totalLKR} cart={cart} setCart={setCart} />
                        )}

                    </div>
                </div>

                {/* RIGHT SIDE - SUMMARY */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden h-fit">

                    {/* IMAGE HEADER */}
                    <div className="bg-primary text-white p-6">
                        <h3 className="text-xl font-semibold">
                            Order Summary
                        </h3>
                    </div>

                    {/* ORDER DETAILS */}
                    <div className="p-6">

                        <div className="space-y-2 text-sm text-gray-600">
                            {cart.map((item) => (
                                <div key={item.id} className="flex justify-between">
                                    <span>
                                        {item.name} (x{item.quantity})
                                    </span>
                                    <span>
                                        Rs. {(item.price * item.quantity).toFixed(2)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="border-t my-4" />

                        <div className="flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span className="text-primary">
                                Rs. {totalLKR.toFixed(2)}
                            </span>
                        </div>

                        <p className="text-xs text-gray-400 text-center mt-3">
                            Encrypted & secure transaction
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payment;