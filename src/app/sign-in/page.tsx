"use client";
import React, { useState } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "../firebase/config";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";

const Page: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const route = useRouter();

  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);
  if (user) {
    console.log("");
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload
    try {
      const res = await signInWithEmailAndPassword(email, password);
      if (res?.user) {
        // Check if email is verified
        if (!res.user.emailVerified) {
          await signOut(auth); // Sign out user if not verified
          alert("Please verify your email before logging in.");
          return;
        }

        console.log("Logged in user:");
        setEmail("");
        setPassword("");
        route.push("/"); // Redirect to homepage
      } else {
        console.error("Invalid credentials.");
      }
    } catch (e) {
      console.error("Login error:", e); // Log any error
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-clash items-center justify-center p-4">
      <div className="bg-white text-gray-900 rounded-lg shadow-md w-full max-w-md p-6 sm:p-8">
        <h2 className="text-2xl font-semibold mb-6 text-center text-[#2A254B]">
          Log In
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-md bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2A254B] focus:border-[#2A254B] border border-gray-300"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-md bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2A254B] focus:border-[#2A254B] border border-gray-300"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#2A254B] hover:bg-[#423980] text-white font-medium py-2 px-4 rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-[#423980]"
            disabled={loading} // Disable the button while logging in
          >
            {loading ? "Logging In..." : "Log In"}
          </button>
        </form>

        {error && (
          <p className="text-sm text-red-500 mt-2 text-center">
            {error.message || "Invalid email or password"}
          </p>
        )}

        <p className="text-sm text-gray-500 mt-4 text-center">
          Don&apos;t have an account?{" "}
          <a href="../sign-up" className="text-[#2A254B] hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Page;
