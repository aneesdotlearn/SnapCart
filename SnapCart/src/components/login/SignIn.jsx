import React, { useMemo, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheckCircle,
  FiClock,
  FiLock,
  FiMail,
  FiMapPin,
  FiShield,
  FiShoppingBag,
  FiUser,
  FiZap,
} from "react-icons/fi";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../features/user/userSlice";
import { GoogleLogin } from "@react-oauth/google";
// import heroImg from "../assets/hero.png";
// import banner1 from "../assets/bg-img/banner1.png";
// import banner2 from "../assets/bg-img/banner2.png";

const fieldBase =
  "flex items-center gap-3 rounded-lg border border-orange-100 bg-white/90 px-4 py-3 text-purple-950 shadow-sm";

const SignIn = () => {
  const isSignup = false;
  const navigate = useNavigate();
  const location = useLocation();

  const returnTo =
    new URLSearchParams(location.search).get("returnTo") || "/";
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [submitted, setSubmitted] = useState(false);

    // 1. Create a state variable for each input field
  // 2. Use that state variable as the value of the input field
  // 3. Create a handleSubmit function for that form
  // 4. Make axios post request to the backend with the input field values

  const page = useMemo(
    () => ({
      title: isSignup ? "Create your SnapCart account" : "Welcome back to SnapCart",
      kicker: isSignup ? "Fresh starts, faster carts" : "Your cart is waiting",
      copy: isSignup
        ? "Join SnapCart for bright deals, saved favorites, and checkout that moves at market speed."
        : "Pick up where you left off with favorites, carts, and quick grocery runs ready in a snap.",
      action: isSignup ? "Create account" : "Login",
      switchText: isSignup ? "Already shopping with us?" : "New to SnapCart?",
      switchAction: isSignup ? "Login" : "Sign up",
      switchPath: isSignup ? "/login" : "/signup",
      // image: isSignup ? banner2 : banner1,
      success: isSignup
        ? "Welcome to SnapCart. Your first cart is ready."
        : "Welcome back. Your saved cart is ready.",
    }),
    [isSignup]
  );

  const handleGoogleLogin = async (credentialResponse) => {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/users/google-login`,
            {
                credential: credentialResponse.credential,
            }
        );

        if (response.data.success) {
            dispatch(
                loginSuccess({
                    user: response.data.user,
                    token: response.data.token,
                })
            );

            navigate(returnTo, { replace: true });
        }
    } catch (error) {
        console.error(
            "Google login failed:",
            error.response?.data || error.message
        );
    }
};

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res =await axios.post(`${import.meta.env.VITE_BACKEND_URL}/users/login`,{
        email,
        password
      });
      console.log("Response:", res.data.token);
      console.log("Response:",res.data.user);
      console.log(res.data);
      if (res.data.success) {
          setSubmitted(true);
      }

      if (res.data.token) {
        dispatch(
          loginSuccess({
            user: res.data.user,
            token: res.data.token,
          }),
        );
      }

      const isAdmin = res.data.user?.role === "admin";
      const nextPath = isAdmin
        ? returnTo.startsWith("/admin") ? returnTo : "/admin/products"
        : returnTo.startsWith("/admin") ? "/" : returnTo;

      navigate(nextPath, { replace: true });
    } catch(err) {
      console.log(err);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-orange-50 text-purple-950">
      
      <div
        // className="absolute inset-0 opacity-45"
        // style={{
        //   backgroundImage: `linear-gradient(110deg, rgba(255,247,237,.92), rgba(255,255,255,.76), rgba(88,28,135,.2)), url(${page.image})`,
        // }}
      />
      <div className="absolute inset-0" />
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,.9)_0%,rgba(255,247,237,.8)_42%,rgba(88,28,135,.16)_100%)]" />

      <section className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8">
        <div className="grid w-full max-w-6xl gap-6 lg:grid-cols-[1.06fr_.94fr]  bg-orange-500">
          <div className="relative hidden min-h-[620px] overflow-hidden rounded-lg border border-white/70 bg-white/35 shadow-[0_30px_90px_rgba(88,28,135,.2)] backdrop-blur lg:block">
            {/* <img
              src={page.image}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-60"
            /> */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-950/82 via-purple-900/48 to-orange-500/62" />

            <button
              type="button"
              onClick={() => navigate("/")}
              className="absolute left-6 top-6 z-[9999] flex items-center gap-2 rounded-lg bg-white/90 px-4 py-2 font-semibold text-purple-900 shadow-lg transition hover:bg-orange-500 hover:text-white"
            >
              <FiArrowLeft />
              Home
            </button>

            <div className="relative z-10 flex h-full flex-col justify-between p-8 text-white">
              <div className="mt-16 max-w-xl">
                <p className="mb-3 inline-flex items-center gap-2 rounded-lg bg-white/15 px-3 py-2 text-sm font-semibold backdrop-blur">
                  <FiZap className="text-orange-200" />
                  {page.kicker}
                </p>
                <h1 className="text-5xl font-black leading-[1.02] pt-20">
                  Groceries, deals, and checkout in one glowing SnapCart.
                </h1>
                <p className="mt-5 max-w-lg text-lg font-medium text-orange-50">
                  {page.copy}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg border border-white/25 bg-white/15 p-4 backdrop-blur">
                  <FiClock className="mb-3 text-2xl text-orange-400" />
                  <p className="text-2xl font-black">10 min</p>
                  <p className="text-sm text-orange-50">Quick picks</p>
                </div>
                <div className="rounded-lg border border-white/25 bg-white/15 p-4 backdrop-blur">
                  <FiShield className="mb-3 text-2xl text-orange-400" />
                  <p className="text-2xl font-black">Fresh</p>
                  <p className="text-sm text-orange-50">Daily quality</p>
                </div>
                <div className="rounded-lg border border-white/25 bg-white/15 p-4 backdrop-blur">
                  <FiMapPin className="mb-3 text-2xl text-orange-400" />
                  <p className="text-2xl font-black">Nearby</p>
                  <p className="text-sm text-orange-50">Local stores</p>
                </div>
              </div>
            </div>

            <div className="absolute right-10 top-24 z-10 rounded-lg bg-white p-4 text-purple-900 shadow-2xl">
              <p className="text-sm font-semibold text-orange-500">Today</p>
              <p className="text-2xl font-black">Flat 10% OFF</p>
            </div>

            {/* <div className="absolute top-36 left-8 z-10 flex items-center gap-3 rounded-lg bg-orange-500 px-4 py-3 font-bold text-white shadow-2xl">
              <FiShoppingBag className="text-2xl" />
              Rs 0 fees
            </div> */}

            {/* <div className="absolute bottom-20 right-16 z-10 rounded-lg bg-white/95 p-3 shadow-2xl">
              <img src={heroImg} alt="" className="h-20 w-20 object-contain" />
            </div> */}
          </div>

          <div className="relative rounded-lg border border-white/80 bg-white/90 p-5 shadow-[0_30px_90px_rgba(88,28,135,.22)] backdrop-blur md:p-8">
            <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-lg bg-orange-400/20" />
            <div className="pointer-events-none absolute -bottom-8 -left-8 h-28 w-28 rounded-lg bg-purple-800/15" />

            <div className="relative">
              <div className="mb-8 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600 transition hover:bg-orange-500 hover:text-white"
                  aria-label="Go home"
                >
                  <FiArrowLeft />
                </button>
                <Link
                  to={page.switchPath}
                  className="rounded-lg border border-orange-200 px-4 py-2 text-sm font-bold text-orange-600 transition hover:border-orange-500 hover:bg-orange-50"
                >
                  {page.switchAction}
                </Link>
              </div>

              <div className="mb-7">
                <p className="mb-2 flex items-center gap-2 text-sm font-bold uppercase text-orange-500">
                  <FiShoppingBag />
                  SnapCart
                </p>
                <h2 className="text-4xl font-black leading-tight text-purple-950">
                  {page.title}
                </h2>
                <p className="mt-3 text-base font-medium text-gray-600">
                  {page.copy}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {isSignup && (
                  <label className="block">
                    <span className="mb-2 block text-sm font-bold text-purple-900">
                      Full name
                    </span>
                    <span className={fieldBase}>
                      <FiUser className="text-xl text-orange-500" />
                      <input
                        type="text"
                        required
                        placeholder="Your name"
                        className="w-full bg-transparent text-base outline-none placeholder:text-gray-400"
                      />
                    </span>
                  </label>
                )}

                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-purple-900">
                    Email address
                  </span>
                  <span className={fieldBase}>
                    <FiMail className="text-xl text-orange-500" />
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      className="w-full bg-transparent text-base outline-none placeholder:text-gray-400"
                      value={email}
                      onChange={(event)=> setEmail(event.target.value)}
                    />
                  </span>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-purple-900">
                    Password
                  </span>
                  <span className={fieldBase}>
                    <FiLock className="text-xl text-orange-500" />
                    <input
                      type="password"
                      required
                      placeholder={isSignup ? "Create a strong password" : "Enter your password"}
                      className="w-full bg-transparent text-base outline-none placeholder:text-gray-400"
                      value={password}
                      onChange={(event)=> setPassword(event.target.value)}
                    />
                  </span>
                </label>

                {isSignup && (
                  <label className="block">
                    <span className="mb-2 block text-sm font-bold text-purple-900">
                      Delivery area
                    </span>
                    <span className={fieldBase}>
                      <FiMapPin className="text-xl text-orange-500" />
                      <input
                        type="text"
                        required
                        placeholder="Street, city"
                        className="w-full bg-transparent text-base outline-none placeholder:text-gray-400"
                      />
                    </span>
                  </label>
                )}

                <div className="flex items-center justify-between gap-4 text-sm">
                  <label className="flex items-center gap-2 font-semibold text-gray-600">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-orange-300 text-orange-500 focus:ring-orange-500"
                    />
                    {isSignup ? "Send fresh deal alerts" : "Remember me"}
                  </label>
                  {!isSignup && (
                    <a href="#" className="font-bold text-orange-500 hover:text-purple-900">
                      Forgot?
                    </a>
                  )}
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-3 rounded-lg bg-orange-500 px-5 py-4 text-lg font-black text-white shadow-[0_16px_36px_rgba(249,115,22,.35)] transition hover:bg-purple-900"
                >
                  {page.action}
                  <FiArrowRight />
                </button>

                <div className="my-5 flex items-center gap-3">
                    <div className="h-px flex-1 bg-gray-200" />
                    <span className="text-sm font-semibold text-gray-400">
                        OR
                    </span>
                    <div className="h-px flex-1 bg-gray-200" />
                </div>

                <div className="flex justify-center flex w-full items-center justify-center gap-3 rounded-lg px-5 py-4 text-lg font-black">
                    <GoogleLogin
                        onSuccess={handleGoogleLogin}
                        onError={() => {
                            console.log("Google Login Failed");
                        }}
                    />
                </div>
              </form>

              {submitted && (
                <div className="mt-5 flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-700">
                  <FiCheckCircle className="mt-0.5 text-xl" />
                  <span>{page.success}</span>
                </div>
              )}

              <p className="mt-7 text-center text-sm font-semibold text-gray-600">
                {page.switchText}{" "}
                <Link to={page.switchPath} className="text-orange-500 hover:text-purple-900">
                  {page.switchAction}
                </Link>
              </p>

              <div className="pointer-events-none absolute right-5 top-28 hidden h-28 w-28 rounded-full border border-orange-200/80 md:block">
                <span className="absolute left-1/2 top-1/2 h-2 w-2 origin-[0_56px] rounded-full bg-orange-500" />
                <span className="absolute left-1/2 top-1/2 h-2 w-2 origin-[0_56px] rounded-full bg-purple-800" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SignIn;
