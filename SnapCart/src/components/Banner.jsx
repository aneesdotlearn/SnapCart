import banner1 from "../assets/bg-img/banner1.png";
import banner2 from "../assets/bg-img/banner2.png";

const Banner = () => {
  return (
    <section className="max-w-10xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-1">

        <div className="overflow-hidden rounded-3xl">
          <img
            src={banner1}
            alt="Banner 1"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="overflow-hidden rounded-3xl">
          <img
            src={banner2}
            alt="Banner 2"
            className="w-full h-full object-cover"
          />
        </div>

      </div>
    </section>
  );
};

export default Banner;