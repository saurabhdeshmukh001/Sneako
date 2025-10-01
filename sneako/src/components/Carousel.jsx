import React, { useState, useEffect, useRef } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

// Mock data for the carousel slides (Original data remains the same)
const originalSlides = [
    {
        id: 1,
        title: "Iconic Airs",
        subtitle: "New Jordan Collection Drops Now!",
        description: "Experience premium leather and legendary design. Limited stock available.",
        imageUrl: "https://images.unsplash.com/photo-1693400652052-884f8dd3dfd9?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        link: "/product/11", 
        buttonText: "Shop the Collection",
        color: "text-white",
        bg: "bg-black/30",
    },
    {
        id: 2,
        title: "Max Comfort Runs",
        subtitle: "Adidas Ultraboost: 25% Off All Running Gear",
        description: "The lightweight bounce and energy return you need for your next run.",
        imageUrl: "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        link: "/product/16",
        buttonText: "Find Your Fit",
        color: "text-gray-200",
        bg: "bg-white/10",
    },
    {
        id: 3,
        title: "Vans Classics",
        subtitle: "The Timeless Skate Look",
        description: "Durable canvas and original waffle outsole. Built for the grind.",
        imageUrl: "https://images.unsplash.com/photo-1608454883429-cb31c212d0da?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        link: "/product/12",
        buttonText: "Browse Skate",
        color: "text-white",
        bg: "bg-black/20",
    },
];

// Combine original slides with a clone of the first slide at the end
const slidesWithClones = [
    ...originalSlides, 
    { ...originalSlides[0], id: 'clone' } // Clone of the first slide
];

const Carousel = () => {
    const navigate = useNavigate();
    // currentSlide ranges from 0 to slidesWithClones.length - 1
    const [currentSlide, setCurrentSlide] = useState(0); 
    const [isTransitioning, setIsTransitioning] = useState(true);
    const timeoutRef = useRef(null);
    
    const totalSlides = originalSlides.length; // 3
    const containerRef = useRef(null);

    // --- Core Logic Functions ---

    const handleTransitionEnd = () => {
        // This function executes when the CSS transition is finished.
        if (currentSlide === totalSlides) {
            // If we landed on the clone slide (index 3), immediately jump back to the first slide (index 0)
            // by setting isTransitioning to false for one tick.
            setIsTransitioning(false);
            setCurrentSlide(0);
        }
    };

    const resetTimeout = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    };

    // --- Auto-slide effect ---
    useEffect(() => {
        resetTimeout();
        timeoutRef.current = setTimeout(() => {
            nextSlide();
        }, 5000); // Change slide every 5 seconds (5000ms)
        
        return () => resetTimeout();
    }, [currentSlide]);

    // --- Navigation Handlers ---

    const nextSlide = () => {
        if (currentSlide === totalSlides) return; // Prevent navigation during reset

        setIsTransitioning(true);
        setCurrentSlide((prev) => prev + 1);
    };

    const prevSlide = () => {
        // For infinite loop right-to-left, we jump from the real first slide (0) back to the clone (totalSlides)
        if (currentSlide === 0) {
            setIsTransitioning(false);
            setCurrentSlide(totalSlides);
            
            // Allow the browser to register the jump before initiating the reverse transition
            setTimeout(() => {
                setIsTransitioning(true);
                setCurrentSlide(totalSlides - 1);
            }, 50); // Small delay
        } else {
            setIsTransitioning(true);
            setCurrentSlide((prev) => prev - 1);
        }
    };
    
    // Allows dot navigation without complex loop handling, but ensures transition is enabled
    const goToSlide = (index) => {
        setIsTransitioning(true);
        setCurrentSlide(index);
    };


    // --- Render Component ---

    return (
        // Changed from relative w-full max-w-7xl mx-auto ... to relative w-full h-[500px] sm:h-[600px] overflow-hidden shadow-2xl
        <div className="relative w-full h-[500px] sm:h-[600px] overflow-hidden shadow-2xl">
            {/* Slides Container */}
            <div
                ref={containerRef}
                className="flex h-full"
                // Toggle CSS transition property based on state for instantaneous reset
                style={{
                    transform: `translateX(-${currentSlide * 100}%)`,
                    transition: isTransitioning ? 'transform 0.7s ease-in-out' : 'none',
                }}
                onTransitionEnd={handleTransitionEnd}
            >
                {/* Renders 3 real slides + 1 clone slide */}
                {slidesWithClones.map((slide) => (
                    <div
                        key={slide.id + (slide.id === 'clone' ? '-c' : '')} // Unique key for the clone
                        className="w-full flex-shrink-0 h-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${slide.imageUrl})` }}
                    >
                        {/* Overlay and Text Content */}
                        <div className={`flex items-center justify-start h-full p-8 sm:p-16 ${slide.bg}`}>
                            <div className={`max-w-md ${slide.color}`}>
                                <h2 className="text-sm font-bold uppercase tracking-widest mb-2">
                                    {slide.subtitle}
                                </h2>
                                <h1 className="text-4xl sm:text-6xl font-extrabold mb-4 leading-tight">
                                    {slide.title}
                                </h1>
                                <p className="text-base sm:text-lg mb-6 max-w-xs">
                                    {slide.description}
                                </p>
                                <button
                                    onClick={() => navigate(slide.link)}
                                    className="px-6 py-3 font-bold text-lg rounded-lg shadow-lg transition duration-300
                                               bg-white text-black hover:bg-gray-200 border-2 border-transparent hover:border-black"
                                >
                                    {slide.buttonText}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition z-20"
                aria-label="Previous Slide"
            >
                <FiChevronLeft size={24} />
            </button>
            <button
                onClick={nextSlide}
                className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition z-20"
                aria-label="Next Slide"
            >
                <FiChevronRight size={24} />
            </button>

            {/* Indicator Dots - Uses originalSlides length for correct indexing */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
                {originalSlides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        // Highlight dot if currentSlide is the index OR if it's on the clone of that index
                        className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                            currentSlide === index || (currentSlide === totalSlides && index === 0) 
                                ? "bg-black scale-125" 
                                : "bg-gray-400/80 hover:bg-gray-300"
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default Carousel;