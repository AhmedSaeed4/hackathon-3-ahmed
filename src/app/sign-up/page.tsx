"use client";
import React, { useState } from "react";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import {
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "../firebase/config";
import { useRouter } from "next/navigation";

const SignUpPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const route = useRouter();

  const [createUserWithEmailAndPassword, userCredential, loading, error] =
    useCreateUserWithEmailAndPassword(auth);
  if (userCredential) {
    route.push("../sign-in");
  }

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
if (user) {
  console.log("")
}
      console.log("Google Sign In successful:");
      route.push("/"); // Redirect to home page after successful login
    } catch (err) {
      console.error("Error with Google Sign In:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      try {
        const userCredentialResult = await createUserWithEmailAndPassword(
          email,
          password
        );
        if (userCredentialResult && userCredentialResult.user) {
          const user = userCredentialResult.user;

          // Update profile with full name
          await updateProfile(user, {
            displayName: fullName,
          });

          // Send email verification
          await sendEmailVerification(user);
          alert("Signup successful! Please check your email for verification.");

          // Sign out the user after successful signup
          auth.signOut();

          route.push("/sign-in"); // Redirect to login page
        }
      } catch (err) {
        console.error("Error creating user:", err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-clash items-center justify-center p-4">
      <div className="bg-white text-gray-900 rounded-lg shadow-md w-full max-w-md p-6 sm:p-8">
        <h2 className="text-2xl font-semibold mb-6 text-center text-[#2A254B]">
          Sign Up
        </h2>

        {/* Google Sign-In Button */}
        <button
          onClick={handleGoogleSignIn}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md transition duration-300 mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Sign Up with Google
        </button>

        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="px-2 text-sm text-gray-400">or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2A254B] focus:border-[#2A254B] border border-gray-300"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              className="w-full px-4 py-2 rounded-md bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2A254B] focus:border-[#2A254B] border border-gray-300"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#2A254B] hover:bg-[#423980] text-white font-medium py-2 px-4 rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-[#423980]"
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        {error && (
          <p className="text-sm text-red-500 mt-2 text-center">{error.message}</p>
        )}

        <p className="text-sm text-gray-500 mt-4 text-center">
          Already have an account?{" "}
          <a href="../sign-in" className="text-[#2A254B] hover:underline">
            Log In
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
