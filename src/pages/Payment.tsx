import Navbar from "../components/Navbar";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CheckoutForm from "../components/CheckoutForm";

const Payment = ({ cart, setCart }: { cart: any[]; setCart: any }) => {
    const [method, setMethod] = useState("paypal");
    const [usdRate, setUsdRate] = useState<number | null>(null);
    const [rateLoading, setRateLoading] = useState(true);
    const [rateError, setRateError] = useState(false);
    const [mintpayLoading, setMintpayLoading] = useState(false);
    const [mintpayError, setMintpayError] = useState("");
    const [kokoLoading, setKokoLoading] = useState(false);
    const [kokoError, setKokoError] = useState("");

    const navigate = useNavigate();

    const totalLKR = useMemo(() =>
        cart.reduce((sum: number, item: any) => sum + Number(item.price) * item.quantity, 0),
        [cart]
    );

    useEffect(() => {
        const fetchRate = async () => {
            try {
                setRateLoading(true);
                setRateError(false);
                const res = await fetch("https://open.er-api.com/v6/latest/LKR");
                const data = await res.json();
                if (data?.rates?.USD) setUsdRate(data.rates.USD);
                else throw new Error("Invalid rate data");
            } catch {
                setRateError(true);
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

    // Mintpay handler
    const handleMintpay = async () => {
        if (totalLKR <= 0) return;
        setMintpayLoading(true);
        setMintpayError("");
        try {
            const orderId = `ORD-${Date.now()}`;
            const customerEmail = "customer@example.com"; // replace with actual user email from auth

            const res = await fetch("http://localhost:3000/payment/mintpay", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: totalLKR, orderId, customerEmail }),
            });

            if (!res.ok) throw new Error("Failed to initiate Mintpay payment");

            const data = await res.json();

            if (data.redirectUrl) {
                window.location.href = data.redirectUrl; // redirect to Mintpay hosted page
            } else {
                throw new Error("No redirect URL returned from Mintpay");
            }
        } catch (err: any) {
            setMintpayError(err.message || "Something went wrong with Mintpay");
        } finally {
            setMintpayLoading(false);
        }
    };

    const handleKoko = async () => {
        if (totalLKR <= 0) return;

        setKokoLoading(true);
        setKokoError("");

        try {
            const orderId = `ORD-${Date.now()}`;

            const res = await fetch("http://localhost:3000/payment/simulate/koko", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: totalLKR,
                    orderId
                }),
            });

            if (!res.ok) throw new Error("Koko simulation failed");

            const data = await res.json();

            alert(
                `Koko Payment Successful 🎉\n\n` +
                `Installments: ${data.installments}\n` +
                `Monthly: Rs. ${data.monthlyAmount}`
            );

            setCart([]);
            navigate("/orders");

        } catch (err: any) {
            setKokoError(err.message || "Koko payment failed");
        } finally {
            setKokoLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f5f0f2] px-10">
            <Navbar />

            <h1 className="text-3xl font-bold text-primary text-center mb-10">
                Payment
            </h1>

            <div className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow">

                {/* Total */}
                <div className="mb-4">
                    <h2 className="text-lg font-semibold">
                        Total: Rs. {totalLKR.toLocaleString()}
                    </h2>
                    <div className="mt-1 text-sm text-gray-500">
                        {rateLoading ? (
                            <span className="italic">Fetching USD rate...</span>
                        ) : rateError ? (
                            <span className="text-amber-600">⚠ Using fallback rate · ≈ ${totalUSD.toFixed(2)} USD</span>
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

                {/* Payment method tabs */}
                <div className="flex gap-2 mb-4">
                    {["paypal", "stripe", "mintpay", "koko"].map((m) => (<button
                        key={m}
                        onClick={() => setMethod(m)}
                        className={`flex-1 py-2 rounded-full border capitalize ${method === m ? "bg-primary text-white" : "border-primary"
                            }`}
                    >
                        {m === "mintpay" ? "Mintpay" : m.charAt(0).toUpperCase() + m.slice(1)}
                    </button>
                    ))}
                </div>

                {/* PayPal */}
                {method === "paypal" && (
                    totalLKR > 0 ? (
                        rateLoading ? (
                            <div className="text-center py-6 text-gray-400 italic">Loading exchange rate...</div>
                        ) : (
                            <>
                                <p className="text-xs text-gray-400 text-center mb-2">
                                    PayPal will charge <strong>${totalUSD.toFixed(2)} USD</strong> (converted from Rs. {totalLKR.toLocaleString()})
                                </p>
                                <PayPalButtons
                                    style={{ layout: "vertical" }}
                                    createOrder={(_data, actions) =>
                                        actions.order.create({
                                            intent: "CAPTURE",
                                            purchase_units: [{ amount: { currency_code: "USD", value: totalUSD.toFixed(2) } }],
                                        })
                                    }
                                    onApprove={(_data, actions) =>
                                        actions.order!.capture().then(() => {
                                            alert("Payment successful 🎉");
                                            setCart([]);
                                            navigate("/orders");
                                        })
                                    }
                                />
                            </>
                        )
                    ) : (
                        <div className="text-center p-4 bg-red-50 text-red-600 rounded-lg">
                            Your cart is empty. Add items to proceed with PayPal.
                        </div>
                    )
                )}

                {/* Stripe */}
                {method === "stripe" && (
                    totalLKR > 0 ? (
                        <CheckoutForm totalAmount={totalLKR} setCart={setCart} />
                    ) : (
                        <div className="text-center p-4 bg-red-50 text-red-600 rounded-lg">
                            Your cart is empty. Add items to proceed with Card payment.
                        </div>
                    )
                )}

                {/* Mintpay */}
                {method === "mintpay" && (
                    totalLKR > 0 ? (
                        <div>
                            <p className="text-sm text-gray-500 text-center mb-3">
                                Pay Rs. {totalLKR.toLocaleString()} with Mintpay — Pay Now or split into 3 interest-free instalments.
                            </p>
                            <button
                                onClick={handleMintpay}
                                disabled={mintpayLoading}
                                className={`w-full py-2 rounded-full font-semibold text-white transition ${mintpayLoading ? "bg-gray-400 cursor-not-allowed" : "bg-[#0066FF] hover:bg-[#0052CC]"
                                    }`}
                            >
                                {mintpayLoading ? "Redirecting to Mintpay..." : "Pay with Mintpay"}
                            </button>
                            {mintpayError && (
                                <p className="text-red-500 text-sm text-center mt-2">{mintpayError}</p>
                            )}
                        </div>
                    ) : (
                        <div className="text-center p-4 bg-red-50 text-red-600 rounded-lg">
                            Your cart is empty. Add items to proceed with Mintpay.
                        </div>
                    )
                )}

                {/* Koko (Simulation) */}
                {method === "koko" && (
                    totalLKR > 0 ? (
                        <div>
                            <p className="text-sm text-gray-500 text-center mb-3">
                                Pay Rs. {totalLKR.toLocaleString()} with Koko — Pay in 3 interest-free instalments.
                            </p>

                            <div className="text-center text-xs text-gray-400 mb-2">
                                Rs. {(totalLKR / 3).toLocaleString()} × 3 months
                            </div>

                            <button
                                onClick={handleKoko}
                                disabled={kokoLoading}
                                className={`w-full py-2 rounded-full font-semibold text-white transition ${kokoLoading
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-purple-600 hover:bg-purple-700"
                                    }`}
                            >
                                {kokoLoading ? "Processing..." : "Pay with Koko"}
                            </button>

                            {kokoError && (
                                <p className="text-red-500 text-sm text-center mt-2">
                                    {kokoError}
                                </p>
                            )}
                        </div>
                    ) : (
                        <div className="text-center p-4 bg-red-50 text-red-600 rounded-lg">
                            Your cart is empty. Add items to proceed with Koko.
                        </div>
                    )
                )}

                {/* Cash */}
                <button className="w-full border border-primary py-2 rounded-full mt-4">
                    Cash on Pickup
                </button>
            </div>
        </div>
    );
};

export default Payment;