import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

function Landing() {
  return (
    
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/vid.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <Navbar></Navbar>
    
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-center text-white px-6 flex-grow">
        <p className="uppercase tracking-widest text-sm mb-2">Exclusive Deals</p>
        <h2 className="text-4xl md:text-6xl font-extrabold mb-4">
          Start Your Shopping Journey
        </h2>
        <p className="text-lg md:text-xl mb-6">
          Discover the best products at unbeatable prices
        </p>
        <Link
          to="/login"
          className="px-8 py-3 bg-blue-600 rounded-lg font-semibold hover:bg-red-700 transition"
        >
          Shop Now
        </Link>
      </div>

      <Footer />
    </div>
  );
}

export default Landing;