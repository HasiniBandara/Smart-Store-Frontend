import Navbar from "../components/Navbar";

const Payment = () => {
    return (
        <div className="min-h-screen bg-[#f5f0f2] px-10">
            <Navbar />

            <h1 className="text-3xl font-bold text-primary text-center mb-10">
                Payment
            </h1>

            <div className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow">
                <h2 className="text-lg font-semibold mb-4">Select Payment Method</h2>

                <button className="w-full bg-primary text-white py-2 rounded-full mb-3">
                    Pay with Card
                </button>

                <button className="w-full border border-primary py-2 rounded-full">
                    Cash on Pickup
                </button>
            </div>
        </div>
    );
};

export default Payment;


{/* <h2 className="font-bold mb-4">To Pickup</h2>

          <p className="text-sm mb-2">📍 12A, High Level Road, Nugegoda</p>
          <p className="text-sm mb-2">📅 20/01/2026</p>
          <p className="text-sm mb-4">⏰ 10:00 AM</p> */}