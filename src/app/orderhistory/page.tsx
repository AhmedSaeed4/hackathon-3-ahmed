"use client";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import Link from "next/link";
import { Timestamp } from 'firebase/firestore';
import Image from "next/image"; // Import the Image component

interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string; // Add imageUrl to the CartItem interface
}

interface Order {
  id: string;
  timestamp: Timestamp;
  status: string;
  paymentMethod: string;
  shippingInfo: {
    address1: string;
    city: string;
    fname: string;
    lname: string;
    postal: string;
  };
  cart?: CartItem[];
  shippingCost: number; // ✅ Ab hum cart ka use karenge
}

export default function OrderHistory() {
  const [orders, setOrders] = useState<Order[] | null>(null); // Initial state is null
  const [user, loadingUser] = useAuthState(auth); // Use loadingUser to check if user is loading
  const [loading, setLoading] = useState<boolean>(true); // Loading state for orders

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        // If no user is logged in, stop loading and return
        setLoading(false);
        return;
      }
      try {
        const ordersRef = collection(db, "users", user.uid, "orders");
        const snapshot = await getDocs(ordersRef);
        const ordersData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Order[];

        // Sort orders by timestamp in descending order (newest first)
        ordersData.sort((a, b) => {
          const timeA = a.timestamp.seconds * 1000; // Convert seconds to milliseconds
          const timeB = b.timestamp.seconds * 1000;
          return timeB - timeA; // Descending order
        });

        setOrders(ordersData); // Set sorted orders
      } catch (error) {
        console.error("Error fetching orders: ", error);
      } finally {
        setLoading(false); // Stop loading after data is fetched or an error occurs
      }
    };
    fetchOrders();
  }, [user]);

  // If the user is still loading, show a loading message
  if (loadingUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-[#2A254B] rounded-full animate-bounce delay-100"></div>
          <div className="w-3 h-3 bg-[#2A254B] rounded-full animate-bounce delay-200"></div>
          <div className="w-3 h-3 bg-[#2A254B] rounded-full animate-bounce delay-300"></div>
        </div>
      </div>
    );
  }

  // If loading orders, show loading message
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-[#2A254B] rounded-full animate-bounce delay-100"></div>
          <div className="w-3 h-3 bg-[#2A254B] rounded-full animate-bounce delay-200"></div>
          <div className="w-3 h-3 bg-[#2A254B] rounded-full animate-bounce delay-300"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-clash bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Order History</h1>

        {/* Go to Home Button */}
        <Link href="/">
          <button className="w-full sm:w-auto px-6 py-2 my-3 bg-[#2A254B] text-white text-sm font-medium rounded-md hover:bg-[#493f85]">
            Go to Home
          </button>
        </Link>

        {/* Orders State */}
        {!user ? (
          <div className="text-center mt-6">
            <p className="text-gray-500 mb-4">Please sign up to view your order history.</p>
            <Link href="/sign-up">
              <button className="px-6 py-2 bg-[#2A254B] text-white text-sm font-medium rounded-md hover:bg-[#493f85]">
                Sign Up
              </button>
            </Link>
          </div>
        ) : orders === null ? null : orders.length === 0 ? (
          <div className="text-center mt-6">
            <p className="text-gray-500 mb-4">You have no orders yet.</p>
            <p className="text-lg font-semibold mb-2">Create your first order!</p>
            <Link href="/allproducts">
              <button className="px-6 py-2 bg-[#2A254B] text-white text-sm font-medium rounded-md hover:bg-[#493f85]">
                Browse Products
              </button>
            </Link>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg p-6">
            <ul>
              {orders.map((order, index) => {
                // ✅ Total Price Calculation Fix (Now using `cart`)
                const shippingprice = order.shippingCost || 0;
                const totalPrice = (order.cart || []).reduce(
                  (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
                  0
                );
                return (
                  <li key={order.id} className="border-b-2 border-gray-200 py-4 hover:bg-gray-50 transition duration-200">
                    {/* 🟢 Order Basic Info */}
                    <div className="mb-2 flex gap-2">
                      <p className="font-bold">{index + 1} .</p>
                      <div>
                        <p className="font-medium">Order ID: {order.id}</p>
                        <p className="text-sm text-gray-500">Status: {order.status}</p>
                        <p className="text-sm text-gray-500">Payment: {order.paymentMethod}</p>
                        <p className="text-sm text-gray-500">
                          Date: {new Date(order.timestamp.seconds * 1000).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {/* 🟢 Shipping Information */}
                    <div className="border-t pt-2">
                      <h3 className="text-sm font-medium text-gray-900">Shipping Address:</h3>
                      <p className="text-sm text-gray-700">
                        {order.shippingInfo.fname} {order.shippingInfo.lname}
                      </p>
                      <p className="text-sm text-gray-700">
                        {order.shippingInfo.address1}, {order.shippingInfo.city}, {order.shippingInfo.postal}
                      </p>
                    </div>
                    {/* 🟢 Order Items (Fetching from `cart`) */}
                    <div className="border-t pt-2">
                      <h3 className="text-sm font-medium text-gray-900">Items:</h3>
                      <ul className="text-sm text-gray-700">
                        {(order.cart || []).map((item, index) => (
                          <li key={index} className="flex items-center justify-between py-1 hover:bg-gray-100 transition duration-200">
                            <div className="flex items-center">
                              <Image
                                src={item.imageUrl}
                                alt={item.name}
                                width={50} // Set the desired width
                                height={50} // Set the desired height
                                className="rounded-md mr-2" // Add some margin and rounding
                              />
                              <span>
                                {item.name} (x{item.quantity})
                              </span>
                            </div>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {/* 🟢 Summary Section */}
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-medium text-gray-900">
                        <span>Shipping Cost:</span>
                        <span>${shippingprice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-medium text-gray-900">
                        <span>Total Price:</span>
                        <span>${(shippingprice + totalPrice).toFixed(2)}</span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
