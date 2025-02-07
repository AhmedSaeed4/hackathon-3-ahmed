"use client";
import Image from "next/image";
import { CheckCircle  } from "lucide-react";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase/config";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; 
import Link from "next/link";
import { useAppContext } from "@/context";

interface Item {
  _id: string;
  name: string;
  quantity: number;
  price: number;
  imageUrl?: string;
}

interface OrderDetails {
  shippingInfo: {
    fname: string;
    lname: string;
    address1: string;
    city: string;
    postal: string;
    
  };
  cart: Item[];
  paymentMethod: string;
  shippingCost : number;
}

export default function OrderConfirmation() {
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const router = useRouter();
   const { setCart } = useAppContext();

  const fetchLatestOrder = async () => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const ordersRef = collection(db, "users", user.uid, "orders");
          const q = query(ordersRef, orderBy("timestamp", "desc"), limit(1)); // Fetch latest order
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const latestOrder = querySnapshot.docs[0].data() as OrderDetails;
            setOrderDetails(latestOrder);
          } else {
            console.log("No recent orders found.");
          }
        } catch (error) {
          console.error("Error fetching order:", error);
        }
      }
    });
  };

  useEffect(() => {
    fetchLatestOrder();
     // Clear cart
     setCart([]);
     localStorage.removeItem("cart");
  }, []);

  if (!orderDetails) {
    return <div className="flex justify-center items-center h-screen">
    <div className="flex space-x-2">
      <div className="w-3 h-3 bg-[#2A254B] rounded-full animate-bounce delay-100"></div>
      <div className="w-3 h-3 bg-[#2A254B] rounded-full animate-bounce delay-200"></div>
      <div className="w-3 h-3 bg-[#2A254B] rounded-full animate-bounce delay-300"></div>
    </div>
  </div>;
  }

  const { shippingInfo, cart, paymentMethod, shippingCost } = orderDetails;

  // Calculate total price
  const totalPrice = cart?.reduce(
    (sum: number, item: Item) => sum + (item.price || 0) * (item.quantity || 0),
    0
  );

  return (
    <div className="min-h-screen font-clash bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Order Confirmed
              </h3>
            </div>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Thank you for your purchase, {shippingInfo?.fname} {shippingInfo?.lname}!
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Payment Method</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {paymentMethod || "N/A"}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Shipping Address</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {`${shippingInfo?.address1}, ${shippingInfo?.city}, ${shippingInfo?.postal}`}
                </dd>
              </div>
            </dl>
          </div>
          <div className="px-4 py-5 sm:px-6">
            <h4 className="text-lg leading-6 font-medium text-gray-900 mb-4">Order Items</h4>
            <ul className="divide-y divide-gray-200">
              {cart?.map((item: Item) => (
                <li key={item._id} className="py-4 flex items-center">
                  <Image
                    src={item.imageUrl || "/placeholder.svg"}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="w-20 h-20 object-cover rounded-md mr-4"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.name}
                    </p>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          {/* Total Price Section */}
          <div className="px-4 py-5 sm:px-6">
            <h4 className="text-lg leading-6 font-medium text-gray-900">
              Total Price: ${(shippingCost + totalPrice).toFixed(2) || "0.00"}
            </h4>
          </div>
          {/* Home Button */}
          <div className="px-4 py-4 flex justify-between sm:px-6">
            <button
              onClick={() => router.push("/")} // Redirect to home page
              className="w-full sm:w-auto px-6 py-2 bg-[#2A254B] text-white text-sm font-medium rounded-md hover:bg-[#493f85]"
            >
              Go to Home
            </button>
            <Link href="../orderhistory">
            <button
              className="w-full sm:w-auto px-6 py-2 text-black border-2 border-gray-400 text-sm font-medium rounded-md hover:bg-gray-100 hover:scale-105 transform transition-all duration-200"
            >
              Order history
            </button></Link>
          </div>
        </div>
      </div>
    </div>
  );
}
