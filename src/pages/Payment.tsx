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

    const saveOrder = async (status: string) => {
        try {
            const res = await fetch("http://localhost:3000/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: 1, // Hardcoded for now as per schema requirements
                    totalPrice: totalLKR,
                    status: status,
                    cartItems: cart.map(item => ({
                        productId: item.id,
                        quantity: item.quantity,
                        price: item.price
                    }))
                })
            });
            if (!res.ok) console.error("Failed to save order");
        } catch (e) {
            console.error("Error saving order:", e);
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

            await saveOrder("paid");
            setCart([]);
            navigate("/orders");

        } catch (err: any) {
            setKokoError(err.message || "Koko payment failed");
        } finally {
            setKokoLoading(false);
        }
    };

    return (
        <div className="bg-[#f6f2f3] min-h-screen px-8 md:px-16 py-10 font-sans">
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
                        onClick={() => setMethod("cash")}
                        className={`border rounded-xl p-5 mb-4 cursor-pointer flex justify-between items-center
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
                        {["paypal", "stripe", "mintpay", "koko"].map((m) => (
                            <div
                                key={m}
                                onClick={() => setMethod(m)}
                                className={`border rounded-xl p-4 cursor-pointer flex justify-between items-center
                                ${method === m ? "border-primary bg-red-50" : "bg-white"}`}
                            >
                                <span className="capitalize">
                                    {m === "mintpay" ? "Mintpay" : m}
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
                                    {rateLoading ? (
                                        <span className="italic">Fetching exchange rate...</span>
                                    ) : rateError ? (
                                        <span className="text-amber-600">
                                            ⚠ Using fallback rate · ≈ ${totalUSD.toFixed(2)} USD
                                        </span>
                                    ) : (
                                        <span>
                                            Pay <strong>${totalUSD.toFixed(2)} USD</strong>
                                            <span className="ml-2 text-xs text-gray-400">
                                                (live rate)
                                            </span>
                                        </span>
                                    )}
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
                                            actions.order!.capture().then(async () => {
                                                await saveOrder("paid");
                                                alert("Payment successful 🎉");
                                                setCart([]);
                                                navigate("/orders");
                                            })
                                        }
                                    />
                                )}
                            </>
                        )}

                        {/* STRIPE */}
                        {method === "stripe" && totalLKR > 0 && (
                            <CheckoutForm totalAmount={totalLKR} cart={cart} setCart={setCart} />
                        )}

                        {/* MINTPAY */}
                        {method === "mintpay" && totalLKR > 0 && (
                            <div>
                                <button
                                    onClick={handleMintpay}
                                    disabled={mintpayLoading}
                                    className={`w-full py-3 rounded-full text-white ${mintpayLoading ? "bg-gray-400" : "bg-blue-600"
                                        }`}
                                >
                                    {mintpayLoading ? "Redirecting..." : "Pay with Mintpay"}
                                </button>

                                {mintpayError && (
                                    <p className="text-red-500 text-sm mt-2 text-center">
                                        {mintpayError}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* KOKO */}
                        {method === "koko" && totalLKR > 0 && (
                            <div>
                                <button
                                    onClick={handleKoko}
                                    disabled={kokoLoading}
                                    className={`w-full py-3 rounded-full text-white ${kokoLoading ? "bg-gray-400" : "bg-purple-600"
                                        }`}
                                >
                                    {kokoLoading ? "Processing..." : "Pay with Koko"}
                                </button>

                                {kokoError && (
                                    <p className="text-red-500 text-sm mt-2 text-center">
                                        {kokoError}
                                    </p>
                                )}
                            </div>
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