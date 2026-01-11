import React from "react";
function SignIn() {

  const handleGitHubSignIn = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const loginUrl = `${backendUrl}/api/v1/auth/github/login`;
    window.location.href = loginUrl;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
       
        <div className="flex justify-center mb-6">
          <img
            src="./images/logo1.png"
            alt="DevEx Logo"
            className="h-10"
          />
        </div>

       
        <h2 className="text-2xl font-bold text-center mb-2">
          Sign in to DevEx Monitor
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Track developer productivity, save time & cost.
        </p>

       
        <button
          onClick={handleGitHubSignIn}
          className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
        >
          Sign in with GitHub
        </button>

       
        <p className="text-xs text-gray-500 text-center mt-6">
          By signing in, you agree to our{" "}
          <span className="underline cursor-pointer">Terms</span> &{" "}
          <span className="underline cursor-pointer">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
}

export default SignIn;
