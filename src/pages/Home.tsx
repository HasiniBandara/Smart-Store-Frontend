import Navbar from "../components/Navbar";

const Home = () => {

  return (
    <div className="bg-primary min-h-screen text-light font-poppins">
      
      <Navbar />

      <div className="flex items-center justify-between px-16 py-16">
        
        <div id="home" className="max-w-lg ml-20 -mt-16">
          <h1 className="text-5xl font-semibold mb-8">
            Welcome to <span className="font-lily text-7xl">c & c</span>
          </h1>

          <p className="mb-4 text-lg ">
            We make delicious cookies and cakes that bring a smile to every bite. 
            Freshly baked, sweet, and made with love perfect for any occasion or just because.
          </p>

          <h2 className="text-xl font-semibold">
            Sweet treats, Happy moments.
          </h2>

        </div>

        <div>
          <img
            src="/cookie.png" 
            className="w-[400px] h-[430px] object-cover rounded-[150px] mr-20"
          />
        </div>

      </div>
    </div>
  );
};

export default Home;