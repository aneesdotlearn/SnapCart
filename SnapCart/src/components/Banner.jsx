import { useState, useEffect } from "react";
import banner1 from "../assets/bg-img/banner1.png";
import banner2 from "../assets/bg-img/banner2.png";
import banner3 from "../assets/bg-img/banner3.png";
import banner4 from "../assets/bg-img/banner4.png";
import banner_bg from "../assets/bg-img/banner_bg.png"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Banner = () => {
  const banners = [banner3, banner1, banner2, banner4];

  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto slide every 4.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [banners.length]);

  // Previous slide
  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + banners.length) % banners.length
    );
  };

  // Next slide
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  return (
    <section className="max-w-10xl mx-auto px-4 py-6 bg-cover bg-center bg-opacity-10"
      style={{ backgroundImage: `url(${banner_bg})` }}>
      {/* Desktop View */}
      <div className="hidden md:grid grid-cols-2 gap-4">
        {/* Banner 1 */}
        <div className="overflow-hidden rounded-3xl shadow-md hover:shadow-xl transition">
          <img
            src={banner3}
            alt="Promotion Banner 1"
            className="w-full h-full object-cover aspect-[21/10.5]"
          />
        </div>

        {/* Banner 2 */}
        <div className="overflow-hidden rounded-3xl shadow-md hover:shadow-lg transition">
          <img
            src={banner2}
            alt="Promotion Banner 2"
            className="w-full h-full object-cover aspect-[21/9]"
          />
        </div>
      </div>

      {/* Mobile / Tablet View */}
      <div className="relative md:hidden overflow-hidden rounded-2xl shadow-md aspect-[16/9] w-full">
        {/* Slides Container */}
        <div
          className="flex transition-transform duration-500 ease-out h-full"
          style={{
            transform: `translateX(-${currentSlide * 100}%)`,
          }}
        >
          {banners.map((banner, index) => (
            <div
              key={index}
              className="w-full h-full flex-shrink-0"
            >
              <img
                src={banner}
                alt={`Promotion Banner ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Previous Button */}
        <button
          onClick={prevSlide}
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition focus:outline-none"
          aria-label="Previous slide"
        >
          <FaChevronLeft size={14} />
        </button>

        {/* Next Button */}
        <button
          onClick={nextSlide}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition focus:outline-none"
          aria-label="Next slide"
        >
          <FaChevronRight size={14} />
        </button>

        {/* Slide Indicator Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${currentSlide === index
                ? "w-5 bg-orange-500"
                : "w-2 bg-white/70"
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Banner;