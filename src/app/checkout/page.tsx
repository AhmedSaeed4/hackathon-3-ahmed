"use client";
import { useState } from "react";
import { DollarSign, Package } from "lucide-react";
import { useAppContext } from "@/context";
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
//import { useRouter } from "next/navigation";

export default function Checkout() {
  const { cart } = useAppContext();
  const [fname, setfname] = useState("");
  const [lname, setlname] = useState("");
  const [address1, setaddress1] = useState("");
  const [city, setcity] = useState("");
  const [state, setState] = useState("CA"); // Dynamic state/province
  const [postal, setpostal] = useState("");
  const [shippingCost, setShippingCost] = useState<number | null>(null);
  const [loadingShipping, setLoadingShipping] = useState(false);
  const [user] = useAuthState(auth);

  // Calculate subtotal
  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // Function to calculate shipping rates
  const calculateShipping = async () => {
    if (!address1 || !city || !postal) {
      alert("Please fill in all shipping details.");
      return;
    }

    // Validate address and postal code
    if (!/^\d+[\s\w]+$/.test(address1)) {
      alert("Please enter a valid street address.");
      return;
    }

    if (!/^\d{5}$/.test(postal)) {
      alert("Please enter a valid 5-digit ZIP code.");
      return;
    }

    setLoadingShipping(true);

    try {
      const response = await fetch("/api/shipping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromAddress: {
            name: "Your Company Name",
            phone: "123-456-7890",
            addressLine1: "123 Main St",
            cityLocality: "New York",
            stateProvince: "NY",
            postalCode: "10001",
            countryCode: "US",
          },
          toAddress: {
            name: `${fname} ${lname}`,
            phone: "123-456-7890",
            addressLine1: address1.replace(/[^a-zA-Z0-9\s]/g, ""), // Clean special characters
            cityLocality: city,
            stateProvince: state,
            postalCode: postal,
            countryCode: "US",
          },
          parcel: {
            weight: 5, // Adjust based on your product
            length: 10,
            width: 8,
            height: 6,
          },
        }),
      });

      const responseBody = await response.text(); // Read response once
      console.log("Shipping API Response Status:" );
      console.log("Shipping API Response Body:");

      if (!response.ok) throw new Error("Failed to calculate shipping rates");

      const data = JSON.parse(responseBody);

      // Check if rates are available
      if (!data.rateResponse?.rates || data.rateResponse.rates.length === 0) {
        throw new Error("No shipping options available for this address.");
      }

      // Log the first rate object for debugging
      //console.log("First Rate Object:", data.rateResponse.rates[0]);

      // Access the shipping cost
      const rate = data.rateResponse.rates[0]?.shippingAmount?.amount;
      const rounded = Math.round(rate);
      if (rate) {
        setShippingCost(rounded);
      } else {
        alert("No shipping rates available.");
      }
    } catch (error) {
      console.error("Error calculating shipping:", error);
      alert(error || "Failed to calculate shipping rates. Please try again.");
    } finally {
      setLoadingShipping(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (shippingCost === null) {
      alert("Please calculate shipping rates before proceeding.");
      return;
    }

    try {
      // Save order to Firebase
      if (user) {
        const ordersRef = collection(db, "users", user.uid, "orders");
        await addDoc(ordersRef, {
          cart,
          shippingInfo: { fname, lname, address1, city, postal },
          paymentMethod: "stripe",
          timestamp: new Date(),
          status: "pending",
          shippingCost,
        });
      }

      // Process Stripe payment
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart, shippingCost }),
      });

      if (!response.ok) throw new Error("Payment failed");

      const data = await response.json();
      window.location.href = data.url;
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Checkout failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen font-clash bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto">
        <h1 className="text-3xl font-semibold text-[#2A254B] mb-8 text-center">
          Checkout
        </h1>
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-xl p-8 space-y-6"
        >
          {/* Shipping Address Section */}
          <div>
            <h2 className="text-xl font-medium text-gray-900 mb-4">
              Shipping Address
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={fname}
                  onChange={(e) => setfname(e.target.value)}
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#5A4AE3] focus:border-[#5A4AE3] py-2 px-3"
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={lname}
                  onChange={(e) => setlname(e.target.value)}
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#5A4AE3] focus:border-[#5A4AE3] py-2 px-3"
                />
              </div>
            </div>
            <div className="mt-4">
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                 Address
              </label>
              <input
                type="text"
                id="address"
                value={address1}
                onChange={(e) => setaddress1(e.target.value)}
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#5A4AE3] focus:border-[#5A4AE3] py-2 px-3"
              />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-700"
                >
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  value={city}
                  onChange={(e) => setcity(e.target.value)}
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#5A4AE3] focus:border-[#5A4AE3] py-2 px-3"
                />
              </div>
              <div>
                <label
                  htmlFor="state"
                  className="block text-sm font-medium text-gray-700"
                >
                  State
                </label>
                <select
                  id="state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#5A4AE3] focus:border-[#5A4AE3] py-2 px-3"
                >
                  <option value="CA">California</option>
                  <option value="NY">New York</option>
                  {/* Add more states as needed */}
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label
                htmlFor="postalCode"
                className="block text-sm font-medium text-gray-700"
              >
                Postal Code
              </label>
              <input
                type="text"
                id="postalCode"
                value={postal}
                onChange={(e) => setpostal(e.target.value)}
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#5A4AE3] focus:border-[#5A4AE3] py-2 px-3"
              />
            </div>
            {/* Disclaimer */}
            <p className="text-sm text-gray-500 mt-2">
              Please ensure all information provided is accurate and valid for
              your state.
            </p>
          </div>

          {/* Calculate Shipping Button */}
          <button
            type="button"
            onClick={calculateShipping}
            disabled={loadingShipping}
            className="w-full flex justify-center py-3 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-[#5A4AE3] hover:bg-[#4A3FC6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5A4AE3] transition-colors duration-300"
          >
            {loadingShipping ? (
              <span>Calculating...</span>
            ) : (
              <>
                <Package className="w-5 h-5 mr-2" />
                Calculate Shipping
              </>
            )}
          </button>

          {/* Display Shipping Cost */}
          {shippingCost !== null && (
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-lg font-medium text-gray-900">
                Shipping Cost
              </span>
              <span className="text-lg font-bold text-gray-900">
                ${shippingCost.toFixed(2)}
              </span>
            </div>
          )}

          {/* Order Summary */}
          <div className="border-b border-gray-200 py-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-gray-900">
                Subtotal
              </span>
              <span className="text-lg font-bold text-gray-900">
                ${subtotal.toFixed(2)}
              </span>
            </div>
            {shippingCost !== null && (
              <div className="flex justify-between items-center mt-2">
                <span className="text-lg font-medium text-gray-900">
                  Total
                </span>
                <span className="text-lg font-bold text-gray-900">
                  ${(subtotal + shippingCost).toFixed(2)}
                </span>
              </div>
            )}
          </div>
          {/* Secure Payment Section */}
          <div className=" p-6 rounded-lg  mb-8 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Secure Payment
            </h3>
            <p className="text-gray-600 mt-2">
              Your payment is processed securely via Stripe. We ensure your
              data is protected.
            </p>
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-[#2A254B] hover:bg-[#352d6d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5A4AE3] transition-colors duration-300"
          >
            <DollarSign className="w-5 h-5 mr-2" />
            Proceed to Payment
          </button>
        </form>
      </div>
    </div>
  );
}
