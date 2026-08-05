// import React, { useMemo, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   FiArrowLeft,
//   FiArrowRight,
//   FiCheckCircle,
//   FiClock,
//   FiLock,
//   FiMail,
//   FiMapPin,
//   FiShield,
//   FiShoppingBag,
//   FiUser,
//   FiZap,
// } from "react-icons/fi";
// import heroImg from "../assets/hero.png";
// import banner1 from "../assets/bg-img/banner1.png";
// import banner2 from "../assets/bg-img/banner2.png";

// const authStyles = `
// .auth-wallpaper {
//   background-size: cover;
//   background-position: center;
//   animation: auth-kenburns 18s ease-in-out infinite alternate;
// }

// .auth-aurora {
//   background:
//     radial-gradient(circle at 20% 30%, rgba(249, 115, 22, 0.38), transparent 32%),
//     radial-gradient(circle at 78% 22%, rgba(88, 28, 135, 0.34), transparent 30%),
//     radial-gradient(circle at 48% 82%, rgba(255, 255, 255, 0.42), transparent 34%);
//   filter: blur(10px);
//   animation: auth-aurora 12s ease-in-out infinite alternate;
// }

// .auth-panel {
//   animation: auth-rise 760ms cubic-bezier(.2,.7,.2,1) both;
// }

// .auth-card {
//   animation: auth-card-in 900ms cubic-bezier(.16,.9,.24,1) 120ms both;
//   transform-style: preserve-3d;
// }

// .auth-form-row {
//   animation: auth-row-in 620ms cubic-bezier(.16,.9,.24,1) both;
// }

// .auth-float-a {
//   animation: auth-float-a 5.8s ease-in-out infinite;
// }

// .auth-float-b {
//   animation: auth-float-b 7.2s ease-in-out infinite;
// }

// .auth-float-c {
//   animation: auth-float-c 6.4s ease-in-out infinite;
// }

// .auth-orbit {
//   animation: auth-orbit 12s linear infinite;
// }

// .auth-orbit-reverse {
//   animation: auth-orbit 16s linear infinite reverse;
// }

// .auth-shine {
//   position: relative;
//   overflow: hidden;
// }

// .auth-shine::after {
//   content: "";
//   position: absolute;
//   inset: -40% -120%;
//   background: linear-gradient(110deg, transparent 42%, rgba(255,255,255,.5) 50%, transparent 58%);
//   transform: translateX(-45%);
//   animation: auth-shine 3.6s ease-in-out infinite;
// }

// .auth-input {
//   transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease;
// }

// .auth-input:focus-within {
//   border-color: rgb(249 115 22);
//   box-shadow: 0 18px 38px rgba(249, 115, 22, .18);
//   transform: translateY(-2px);
// }

// .auth-spark {
//   animation: auth-spark 2.4s ease-in-out infinite;
// }

// .auth-bg-card {
//   animation: auth-bg-card 9s ease-in-out infinite alternate;
// }

// @keyframes auth-kenburns {
//   from { transform: scale(1.02) translate3d(0,0,0); }
//   to { transform: scale(1.12) translate3d(-18px, 12px, 0); }
// }

// @keyframes auth-aurora {
//   from { transform: translate3d(-2%, -1%, 0) rotate(0deg) scale(1); opacity: .78; }
//   to { transform: translate3d(2%, 2%, 0) rotate(4deg) scale(1.08); opacity: .98; }
// }

// @keyframes auth-rise {
//   from { opacity: 0; transform: translateY(26px); }
//   to { opacity: 1; transform: translateY(0); }
// }

// @keyframes auth-card-in {
//   from { opacity: 0; transform: perspective(1100px) rotateX(9deg) rotateY(-7deg) translateY(36px); }
//   to { opacity: 1; transform: perspective(1100px) rotateX(0) rotateY(0) translateY(0); }
// }

// @keyframes auth-row-in {
//   from { opacity: 0; transform: translateX(18px); }
//   to { opacity: 1; transform: translateX(0); }
// }

// @keyframes auth-float-a {
//   0%, 100% { transform: translate3d(0, 0, 0) rotate(-2deg); }
//   50% { transform: translate3d(12px, -18px, 0) rotate(3deg); }
// }

// @keyframes auth-float-b {
//   0%, 100% { transform: translate3d(0, 0, 0) rotate(3deg); }
//   50% { transform: translate3d(-14px, 16px, 0) rotate(-4deg); }
// }

// @keyframes auth-float-c {
//   0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
//   50% { transform: translate3d(0, -14px, 0) scale(1.04); }
// }

// @keyframes auth-orbit {
//   to { transform: rotate(360deg); }
// }

// @keyframes auth-shine {
//   0%, 48% { transform: translateX(-55%); }
//   72%, 100% { transform: translateX(55%); }
// }

// @keyframes auth-spark {
//   0%, 100% { opacity: .55; transform: scale(.92); }
//   50% { opacity: 1; transform: scale(1.12); }
// }

// @keyframes auth-bg-card {
//   from { transform: translate3d(0, 0, 0) rotate(-1deg); }
//   to { transform: translate3d(8px, -8px, 0) rotate(1deg); }
// }

// @media (prefers-reduced-motion: reduce) {
//   .auth-wallpaper,
//   .auth-aurora,
//   .auth-panel,
//   .auth-card,
//   .auth-form-row,
//   .auth-float-a,
//   .auth-float-b,
//   .auth-float-c,
//   .auth-orbit,
//   .auth-orbit-reverse,
//   .auth-shine::after,
//   .auth-spark,
//   .auth-bg-card {
//     animation: none !important;
//   }
// }
// `;

// const fieldBase =
//   "auth-input flex items-center gap-3 rounded-lg border border-orange-100 bg-white/90 px-4 py-3 text-purple-950 shadow-sm";

// const AuthPage = ({ mode = "login" }) => {
//   const isSignup = mode === "signup";
//   const navigate = useNavigate();
//   const [submitted, setSubmitted] = useState(false);

//   const page = useMemo(
//     () => ({
//       title: isSignup ? "Create your SnapCart account" : "Welcome back to SnapCart",
//       kicker: isSignup ? "Fresh starts, faster carts" : "Your cart is waiting",
//       copy: isSignup
//         ? "Join SnapCart for bright deals, saved favorites, and checkout that moves at market speed."
//         : "Pick up where you left off with favorites, carts, and quick grocery runs ready in a snap.",
//       action: isSignup ? "Create account" : "Login",
//       switchText: isSignup ? "Already shopping with us?" : "New to SnapCart?",
//       switchAction: isSignup ? "Login" : "Sign up",
//       switchPath: isSignup ? "/login" : "/signup",
//       // image: isSignup ? banner2 : banner1,
//       success: isSignup
//         ? "Welcome to SnapCart. Your first cart is ready."
//         : "Welcome back. Your saved cart is ready.",
//     }),
//     [isSignup]
//   );

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     setSubmitted(true);
//   };

//   return (
//     <main className="relative min-h-screen overflow-hidden bg-orange-50 text-purple-950">
//       <style>{authStyles}</style>

//       <div
//         className="auth-wallpaper absolute inset-0 opacity-45"
//         style={{
//           backgroundImage: `linear-gradient(110deg, rgba(255,247,237,.92), rgba(255,255,255,.76), rgba(88,28,135,.2)), url(${page.image})`,
//         }}
//       />
//       <div className="auth-aurora absolute inset-0" />
//       <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,.9)_0%,rgba(255,247,237,.8)_42%,rgba(88,28,135,.16)_100%)]" />

//       <section className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8">
//         <div className="grid w-full max-w-6xl gap-6 lg:grid-cols-[1.06fr_.94fr]  bg-orange-500">
//           <div className="auth-panel relative hidden min-h-[620px] overflow-hidden rounded-lg border border-white/70 bg-white/35 shadow-[0_30px_90px_rgba(88,28,135,.2)] backdrop-blur lg:block">
//             <img
//               src={page.image}
//               alt=""
//               className="absolute inset-0 h-full w-full object-cover opacity-60"
//             />
//             <div className="absolute inset-0 bg-gradient-to-br from-purple-950/82 via-purple-900/48 to-orange-500/62" />

//             <button
//               type="button"
//               onClick={() => navigate("/")}
//               className="absolute left-6 top-6 z-10 flex items-center gap-2 rounded-lg bg-white/90 px-4 py-2 font-semibold text-purple-900 shadow-lg transition hover:bg-orange-500 hover:text-white"
//             >
//               <FiArrowLeft />
//               Home
//             </button>

//             <div className="relative z-10 flex h-full flex-col justify-between p-8 text-white">
//               <div className="mt-16 max-w-xl">
//                 <p className="mb-3 inline-flex items-center gap-2 rounded-lg bg-white/15 px-3 py-2 text-sm font-semibold backdrop-blur">
//                   <FiZap className="text-orange-200" />
//                   {page.kicker}
//                 </p>
//                 <h1 className="text-5xl font-black leading-[1.02] pt-20">
//                   Groceries, deals, and checkout in one glowing SnapCart.
//                 </h1>
//                 <p className="mt-5 max-w-lg text-lg font-medium text-orange-50">
//                   {page.copy}
//                 </p>
//               </div>

//               <div className="grid grid-cols-3 gap-3">
//                 <div className="rounded-lg border border-white/25 bg-white/15 p-4 backdrop-blur">
//                   <FiClock className="mb-3 text-2xl text-orange-200" />
//                   <p className="text-2xl font-black">10 min</p>
//                   <p className="text-sm text-orange-50">Quick picks</p>
//                 </div>
//                 <div className="rounded-lg border border-white/25 bg-white/15 p-4 backdrop-blur">
//                   <FiShield className="mb-3 text-2xl text-orange-200" />
//                   <p className="text-2xl font-black">Fresh</p>
//                   <p className="text-sm text-orange-50">Daily quality</p>
//                 </div>
//                 <div className="rounded-lg border border-white/25 bg-white/15 p-4 backdrop-blur">
//                   <FiMapPin className="mb-3 text-2xl text-orange-200" />
//                   <p className="text-2xl font-black">Nearby</p>
//                   <p className="text-sm text-orange-50">Local stores</p>
//                 </div>
//               </div>
//             </div>

//             <div className="auth-float-a absolute right-10 top-24 z-10 rounded-lg bg-white p-4 text-purple-900 shadow-2xl">
//               <p className="text-sm font-semibold text-orange-500">Today</p>
//               <p className="text-2xl font-black">Flat 10% OFF</p>
//             </div>

//             {/* <div className="auth-float-b absolute top-36 left-8 z-10 flex items-center gap-3 rounded-lg bg-orange-500 px-4 py-3 font-bold text-white shadow-2xl">
//               <FiShoppingBag className="text-2xl" />
//               Rs 0 fees
//             </div> */}

//             {/* <div className="auth-float-c absolute bottom-20 right-16 z-10 rounded-lg bg-white/95 p-3 shadow-2xl">
//               <img src={heroImg} alt="" className="h-20 w-20 object-contain" />
//             </div> */}
//           </div>

//           <div className="auth-card relative rounded-lg border border-white/80 bg-white/90 p-5 shadow-[0_30px_90px_rgba(88,28,135,.22)] backdrop-blur md:p-8">
//             <div className="auth-bg-card pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-lg bg-orange-400/20" />
//             <div className="auth-bg-card pointer-events-none absolute -bottom-8 -left-8 h-28 w-28 rounded-lg bg-purple-800/15" />

//             <div className="relative">
//               <div className="mb-8 flex items-center justify-between gap-4">
//                 <button
//                   type="button"
//                   onClick={() => navigate("/")}
//                   className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600 transition hover:bg-orange-500 hover:text-white"
//                   aria-label="Go home"
//                 >
//                   <FiArrowLeft />
//                 </button>
//                 <Link
//                   to={page.switchPath}
//                   className="rounded-lg border border-orange-200 px-4 py-2 text-sm font-bold text-orange-600 transition hover:border-orange-500 hover:bg-orange-50"
//                 >
//                   {page.switchAction}
//                 </Link>
//               </div>

//               <div className="mb-7">
//                 <p className="mb-2 flex items-center gap-2 text-sm font-bold uppercase text-orange-500">
//                   <FiShoppingBag />
//                   SnapCart
//                 </p>
//                 <h2 className="text-4xl font-black leading-tight text-purple-950">
//                   {page.title}
//                 </h2>
//                 <p className="mt-3 text-base font-medium text-gray-600">
//                   {page.copy}
//                 </p>
//               </div>

//               <form onSubmit={handleSubmit} className="space-y-4">
//                 {isSignup && (
//                   <label className="auth-form-row block" style={{ animationDelay: "80ms" }}>
//                     <span className="mb-2 block text-sm font-bold text-purple-900">
//                       Full name
//                     </span>
//                     <span className={fieldBase}>
//                       <FiUser className="text-xl text-orange-500" />
//                       <input
//                         type="text"
//                         required
//                         placeholder="Your name"
//                         className="w-full bg-transparent text-base outline-none placeholder:text-gray-400"
//                       />
//                     </span>
//                   </label>
//                 )}

//                 <label className="auth-form-row block" style={{ animationDelay: "150ms" }}>
//                   <span className="mb-2 block text-sm font-bold text-purple-900">
//                     Email address
//                   </span>
//                   <span className={fieldBase}>
//                     <FiMail className="text-xl text-orange-500" />
//                     <input
//                       type="email"
//                       required
//                       placeholder="you@example.com"
//                       className="w-full bg-transparent text-base outline-none placeholder:text-gray-400"
//                     />
//                   </span>
//                 </label>

//                 <label className="auth-form-row block" style={{ animationDelay: "220ms" }}>
//                   <span className="mb-2 block text-sm font-bold text-purple-900">
//                     Password
//                   </span>
//                   <span className={fieldBase}>
//                     <FiLock className="text-xl text-orange-500" />
//                     <input
//                       type="password"
//                       required
//                       placeholder={isSignup ? "Create a strong password" : "Enter your password"}
//                       className="w-full bg-transparent text-base outline-none placeholder:text-gray-400"
//                     />
//                   </span>
//                 </label>

//                 {isSignup && (
//                   <label className="auth-form-row block" style={{ animationDelay: "290ms" }}>
//                     <span className="mb-2 block text-sm font-bold text-purple-900">
//                       Delivery area
//                     </span>
//                     <span className={fieldBase}>
//                       <FiMapPin className="text-xl text-orange-500" />
//                       <input
//                         type="text"
//                         required
//                         placeholder="Street, city"
//                         className="w-full bg-transparent text-base outline-none placeholder:text-gray-400"
//                       />
//                     </span>
//                   </label>
//                 )}

//                 <div className="auth-form-row flex items-center justify-between gap-4 text-sm" style={{ animationDelay: "360ms" }}>
//                   <label className="flex items-center gap-2 font-semibold text-gray-600">
//                     <input
//                       type="checkbox"
//                       className="h-4 w-4 rounded border-orange-300 text-orange-500 focus:ring-orange-500"
//                     />
//                     {isSignup ? "Send fresh deal alerts" : "Remember me"}
//                   </label>
//                   {!isSignup && (
//                     <a href="#" className="font-bold text-orange-500 hover:text-purple-900">
//                       Forgot?
//                     </a>
//                   )}
//                 </div>

//                 <button
//                   type="submit"
//                   className="auth-shine flex w-full items-center justify-center gap-3 rounded-lg bg-orange-500 px-5 py-4 text-lg font-black text-white shadow-[0_16px_36px_rgba(249,115,22,.35)] transition hover:bg-purple-900"
//                 >
//                   {page.action}
//                   <FiArrowRight />
//                 </button>
//               </form>

//               {submitted && (
//                 <div className="mt-5 flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-700">
//                   <FiCheckCircle className="auth-spark mt-0.5 text-xl" />
//                   <span>{page.success}</span>
//                 </div>
//               )}

//               <p className="mt-7 text-center text-sm font-semibold text-gray-600">
//                 {page.switchText}{" "}
//                 <Link to={page.switchPath} className="text-orange-500 hover:text-purple-900">
//                   {page.switchAction}
//                 </Link>
//               </p>

//               <div className="pointer-events-none absolute right-5 top-28 hidden h-28 w-28 rounded-full border border-orange-200/80 md:block">
//                 <span className="auth-orbit absolute left-1/2 top-1/2 h-2 w-2 origin-[0_56px] rounded-full bg-orange-500" />
//                 <span className="auth-orbit-reverse absolute left-1/2 top-1/2 h-2 w-2 origin-[0_56px] rounded-full bg-purple-800" />
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// };

// export default AuthPage;
