import Navbar from "../components/Navbar";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CheckoutForm from "../components/CheckoutForm";

const Payment = ({ cart, setCart }: { cart: any[], setCart: any }) => {
    const [method, setMethod] = useState("paypal");
    const [usdRate, setUsdRate] = useState<number | null>(null);
    const [rateLoading, setRateLoading] = useState(true);
    const [rateError, setRateError] = useState(false);

    const navigate = useNavigate();

    // ✅ Calculate total in LKR
    const totalLKR = useMemo(() => {
        return cart.reduce(
            (sum: number, item: any) =>
                sum + Number(item.price) * item.quantity,
            0
        );
    }, [cart]);

    // 💱 Fetch live LKR → USD exchange rate
    useEffect(() => {
        const fetchRate = async () => {
            try {
                setRateLoading(true);
                setRateError(false);
                const res = await fetch("https://open.er-api.com/v6/latest/LKR");
                const data = await res.json();
                if (data?.rates?.USD) {
                    setUsdRate(data.rates.USD);
                } else {
                    throw new Error("Invalid rate data");
                }
            } catch {
                setRateError(true);
                // Fallback: approximate rate (update periodically)
                setUsdRate(0.0031);
            } finally {
                setRateLoading(false);
            }
        };

        fetchRate();
    }, []);

    // 💵 Convert LKR → USD (min $0.50 required by PayPal)
    const totalUSD = useMemo(() => {
        if (!usdRate) return 0;
        const converted = totalLKR * usdRate;
        return Math.max(converted, 0.5); // PayPal minimum
    }, [totalLKR, usdRate]);

    return (
        <div className="min-h-screen bg-[#f5f0f2] px-10">
            <Navbar />

            <h1 className="text-3xl font-bold text-primary text-center mb-10">
                Payment
            </h1>

            <div className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow">

                {/* 💰 TOTAL DISPLAY */}
                <div className="mb-4">
                    <h2 className="text-lg font-semibold">
                        Total: Rs. {totalLKR.toLocaleString()}
                    </h2>

                    {/* USD equivalent */}
                    <div className="mt-1 text-sm text-gray-500">
                        {rateLoading ? (
                            <span className="italic">Fetching USD rate...</span>
                        ) : rateError ? (
                            <span className="text-amber-600">
                                ⚠ Using fallback rate · ≈ ${totalUSD.toFixed(2)} USD
                            </span>
                        ) : (
                            <span>
                                ≈ ${totalUSD.toFixed(2)} USD
                                <span className="ml-2 text-xs text-gray-400">
                                    (1 LKR = ${usdRate?.toFixed(6)} USD · live rate)
                                </span>
                            </span>
                        )}
                    </div>
                </div>

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
                    totalLKR > 0 ? (
                        rateLoading ? (
                            <div className="text-center py-6 text-gray-400 italic">
                                Loading exchange rate...
                            </div>
                        ) : (
                            <>
                                <p className="text-xs text-gray-400 text-center mb-2">
                                    PayPal will charge <strong>${totalUSD.toFixed(2)} USD</strong> (converted from Rs. {totalLKR.toLocaleString()})
                                </p>
                                <PayPalButtons
                                    style={{ layout: "vertical" }}
                                    createOrder={(_data, actions) => {
                                        return actions.order.create({
                                            intent: "CAPTURE",
                                            purchase_units: [
                                                {
                                                    amount: {
                                                        currency_code: "USD",
                                                        value: totalUSD.toFixed(2), // ✅ Converted from LKR
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
                            </>
                        )
                    ) : (
                        <div className="text-center p-4 bg-red-50 text-red-600 rounded-lg">
                            Your cart is empty. Add items to proceed with PayPal.
                        </div>
                    )
                )}

                {/* 💳 STRIPE */}
                {method === "stripe" && (
                    totalLKR > 0 ? (
                        <CheckoutForm totalAmount={totalLKR} setCart={setCart} />
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
