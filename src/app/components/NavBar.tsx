"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
//import search from "../assets/Search.png";
//import cart8 from "../assets/Shopping--cart.png";
import user1 from "../assets/User--avatar.png";
//import menu from "../assets/Menu.png";
import Link from "next/link";
//import wish2 from "../assets/wish2.png";
import { useAppContext } from "@/context";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  //DialogDescription,
  //DialogHeader,
  //DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { auth } from "../firebase/config";
import { LucideSearch , Menu , FolderHeart , ShoppingCart , User   } from "lucide-react";

import { useRouter } from "next/navigation";


interface ProductSummary {
  _id: string;
  name: string;
  slug: string;
  imageUrl: string;
  price: number;
  quantity: number;
  tags: string[];
  description: string;
  features: string[];
  dimensions: {
    depth?: number;
    width?: number;
    height?: number;
  };
  category: {
    name: string;
    slug: string;
  };
}


const Navbar = ({ product }: { product: ProductSummary[] }) => {
  const [imageUrl, setImageUrl] = useState<string>("/placeholder.svg");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
if(isAuthenticated){console.log("done")}
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setImageUrl(user.photoURL || user1.src);
        setIsAuthenticated(true);
      } else {
        setImageUrl(user1.src);
        setIsAuthenticated(false);
      }
    });

    return () => unsubscribe();
  }, []);
  const { wishlist, RemoveFromWish, AddToCart , cart } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<ProductSummary[]>([]);
  const [Quantity, setQuantity] = useState(0);
  useEffect(() => {
    setQuantity(wishlist.length);
   
  }, [wishlist])
  
  const [cartnum, setcartnum] = useState(0);
  useEffect(() => {
   setcartnum(  cart.length);
  }, [cart])
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchTerm(query);

    if (query.trim() !== "") {
      const filtered = product.filter((item) =>
        item.name.toLowerCase().includes(query)
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  };
  const route = useRouter();
  const [user] = useAuthState(auth);

  return (
    <div className="h-auto w-auto flex sticky sm:relative z-50 top-0 sm:bg-white bg-gradient-to-b from-white/70 to-white/5  backdrop-blur-sm text-nowrap flex-col gap-[20px] px-[28px] pt-[20px] pb-[20px]">
      <div className="flex justify-between items-center">
        <Popover>
          <PopoverTrigger>
            <LucideSearch
              
            
              className="w-[17px] h-[17px] sm:block  "
            />
          </PopoverTrigger>
          <PopoverContent>
            <div className="mt-4">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search products..."
                className="border rounded px-4 py-2 w-full"
              />
            </div>
            {searchTerm.trim() !== "" && (
              <div className="mt-4 ">
                {filteredProducts.length > 0 ? (
                  <ul className="grid grid-cols-1 font-clash gap-4">
                    {filteredProducts.map((item) => (
                      <Link key={item._id} href={`../productpages/${item.slug}`}>
                        <li
                          key={item._id}
                          className="border flex gap-2 p-4 rounded shadow"
                        >
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            width={900}
                            height={800}
                            className="h-[50px] w-[50px] object-fill bg-cover bg-center"
                          />
                          <div className="flex flex-col justify-between">
                            <h2 className="font-normal text-[17px]">{item.name}</h2>
                            <p className="text-gray-600 font-normal">
                              ${item.price}
                            </p>
                          </div>
                        </li>
                      </Link>
                    ))}
                  </ul>
                ) : (
                  <p>No products found.</p>
                )}
              </div>
            )}
          </PopoverContent>
        </Popover>

        <h1 className="font-clash text-[24px]">
          <Link href="/">Avion</Link>
        </h1>

        <div className="gap-[20px] flex justify-center sm:hidden">
        <Sheet>
  <SheetTrigger>
    <span className="flex items-center gap-1">
    <FolderHeart className="h-4 w-4 block transition-all duration-300 ease-in-out transform hover:scale-110 sm:hidden" />
    <span className="font-clash text-[12px]">{Quantity}</span></span>
  </SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle className="text-[24px] font-normal font-clash">Saved Items</SheetTitle>
      <SheetDescription className="space-y-3">
        {/* Conditional Rendering for Empty Wishlist */}
        {wishlist.length === 0 ? (
          <div className="flex flex-col items-center font-clash justify-center text-center py-10">
            {/* New Icon: Shopping Bag */}
            
            <h1 className="text-[24px] font-normal text-gray-900 mt-4">
              Your Wishlist is Empty
            </h1>
            <p className="text-gray-600 mt-2">
              You havent saved any items yet. Start exploring and add items to your wishlist!
            </p>
            <Link href={"../allproducts"}>
            <button

              //onClick={() => router.push("/allproducts")} // Redirect to product listing page
              className="inline-flex items-center px-3 py-3 border border-transparent text-[12px] font-medium  shadow-sm text-white bg-[#2A254B] hover:bg-[#2f2668]   mt-4"
            >
              Start Shopping
            </button></Link>
          </div>
        ) : (
          // Render Wishlist Items if Not Empty
          wishlist.map((elem) => {
            return (
              <div
                key={elem._id}
                className="space-y-2 bg-white p-4 rounded-lg shadow-lg transition-transform transform hover:-translate-y-2 hover:shadow-2xl duration-300 ease-in-out"
              >
                <Image
                  src={elem.imageUrl}
                  alt="product image"
                  height={300}
                  width={300}
                  className="w-[300px] h-[100px] rounded-lg object-cover bg-center"
                />
                <div>
                  <p className="font-clash font-bold text-black">
                    ${elem.name}
                  </p>
                  <p>${elem.price}</p>
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => RemoveFromWish(elem._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md shadow-md transition-all duration-200 ease-in-out"
                  >
                    Remove
                  </button>
                  <button
                    onClick={() => {
                      AddToCart(elem);
                      RemoveFromWish(elem._id);
                    }}
                    className="bg-[#2A254B] hover:bg-[#3f3870] text-white px-4 py-2 rounded-md shadow-md transition-all duration-200 ease-in-out"
                  >
                    ADD TO CART
                  </button>
                </div>
              </div>
            );
          })
        )}
      </SheetDescription>
    </SheetHeader>
  </SheetContent>
        </Sheet>
          <Sheet>
            <SheetTrigger>
              <Menu  className="w-[16px] h-[16px]" />
            </SheetTrigger>
            <SheetContent>
              <SheetHeader className="space-y-5">
                <SheetTitle>
                  <span className="flex space-x-4 items-center">
                    <span>NavBar</span>{" "}
                    <span className="flex items-center gap-1">
                      <Link href={"../cart"}>
                        <ShoppingCart
                          
                          className="w-[16px] h-[16px] transition-all duration-300 ease-in-out
        transform hover:scale-125 "
                        />
                      </Link>
                      <span className="font-clash font-normal text-[12px]">{cartnum}</span></span>
                      <Dialog>
  <DialogTrigger>
    <User className="w-[16px] h-[16px]" />
  </DialogTrigger>
  <DialogContent className="p-6 bg-white rounded-lg shadow-md max-w-xs sm:max-w-sm">
    <div className="flex flex-col items-center">
      {imageUrl == user1.src ? (
        <User className="h-12 w-12 text-gray-500" />
      ) : (
        <Image
          src={imageUrl}
          alt="Profile Picture"
          width={80}
          height={80}
          className="rounded-full mb-4"
        />
      )}
      <h2 className="text-xl font-semibold text-gray-800 mb-1">
        {user?.displayName || "Guest User"}
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        {user?.email || "No email available"}
      </p>
      {user == null ? (
        <button
          className="w-full bg-[#2A254B] hover:bg-[#423980] text-white font-medium py-2 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-[#423980]"
          onClick={() => route.push("../sign-in")}
        >
          Sign In
        </button>
      ) : (
        <div className="flex flex-col gap-2 w-full">
          <button
            className="w-full bg-[#2A254B] hover:bg-[#423980] text-white font-medium py-2 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-[#423980]"
            onClick={() => signOut(auth)}
          >
            Log Out
          </button>
          <Link href={"../orderhistory"} className="w-full">
            <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md transition duration-200">
              Order History
            </button>
          </Link>
        </div>
      )}
    </div>
  </DialogContent>
</Dialog>

                  </span>
                </SheetTitle>
                <SheetDescription>
                  <span className="self-center h-auto w-auto gap-[2.75rem] space-y-3 text-[#726E8D] flex flex-col  ">
                    <span
                      id="sign-up"
                      className="space-x-3 flex justify-center"
                    >
                      {!user ? (
                        <>
                          <Link href={"../sign-up"}>
                            <button className="bg-gray-300 p-1 font-clash rounded-sm font-normal leading-4 tracking-[0.5px] text-[12px] transition-transform transform hover:scale-95 hover:bg-gray-400 active:scale-95 active:bg-gray-500">
                              SIGNUP
                            </button>
                          </Link>

                          <Link href={"../sign-in"}>
                            <button className="bg-[#2A254B] rounded-sm p-1 font-clash font-normal leading-4 tracking-[0.5px] text-white text-[12px] transition-transform transform hover:scale-95 hover:bg-[#3f3870] active:scale-95 active:bg-[#241e4d]">
                              LOGIN
                            </button>
                          </Link>
                        </>
                      ) : (
                        <>
                          {/* Login Data only here */}
                          <span className="flex gap-2 items-center">
                            <span className="text-sm font-clash  uppercase tracking-[0.8px] cursor-defspant font-semibold">
                              {user.displayName}
                            </span>
                            <button
                              onClick={() => signOut(auth)}
                              className="bg-[#2A254B] rounded-sm p-1 font-clash font-normal leading-4 tracking-[0.5px] text-white text-[12px] transition-transform transform hover:scale-95 hover:bg-[#3f3870] active:scale-95 active:bg-[#241e4d]"
                            >
                              LOGOUT
                            </button>
                          </span>
                        </>
                      )}
                    </span>
                    {product.slice(1, 8).map((elem: ProductSummary) => {
                      const categorySlug = elem.category?.slug || "";
                      return (
                        <Link
                          href={`../category/${categorySlug}`}
                          key={elem._id}
                          className=""
                        >
                          <button className=" transition-all duration-300 ease-in-out
        transform hover:scale-125 ">{elem.category.name}</button>
                        </Link>
                      );
                    })}
                  </span>
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>

        <div className="sm:flex gap-[16px] items-center hidden">
          <div id="sign-up" className="space-x-3 flex justify-center">
            {!user ? (
              <>
                <Link href={"../sign-up"}>
                  <button className="bg-gray-300 p-1 font-clash rounded-sm font-normal leading-4 tracking-[0.5px] text-[12px] transition-transform transform hover:scale-95 hover:bg-gray-400 active:scale-95 active:bg-gray-500">
                    SIGNUP
                  </button>
                </Link>

                <Link href={"../sign-in"}>
                  <button className="bg-[#2A254B] rounded-sm p-1 font-clash font-normal leading-4 tracking-[0.5px] text-white text-[12px] transition-transform transform hover:scale-95 hover:bg-[#3f3870] active:scale-95 active:bg-[#241e4d]">
                    LOGIN
                  </button>
                </Link>
              </>
            ) : (
              <>
                {/* Login Data only here */}
                <div className="flex gap-2 items-center">
                  <p className="text-sm font-clash  uppercase tracking-[0.8px] cursor-default font-semibold">
                    {user.displayName}
                  </p>
                  <button
                    onClick={() => signOut(auth)}
                    className="bg-[#2A254B] rounded-sm p-1 font-clash font-normal leading-4 tracking-[0.5px] text-white text-[12px] transition-transform transform hover:scale-95 hover:bg-[#3f3870] active:scale-95 active:bg-[#241e4d]"
                  >
                    LOGOUT
                  </button>
                </div>
              </>
            )}
          </div>
          <Sheet>
  <SheetTrigger>
    <span className="flex items-center gap-1">
    <FolderHeart  className="h-4 w-4 transition-all duration-300 ease-in-out transform hover:scale-125 " />
    <span className="font-clash text-[12px]">{Quantity}</span></span>
  </SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle className="text-[24px] font-normal font-clash">Saved Items</SheetTitle>
      <SheetDescription className="space-y-3">
        {/* Conditional Rendering for Empty Wishlist */}
        {wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center font-clash text-center py-10">
            {/* New Icon: Shopping Bag */}
            
            <h1 className="text-[24px] font-normal text-gray-900 mt-4">
              Your Wishlist is Empty
            </h1>
            <p className="text-gray-600 mt-2">
              You havent saved any items yet. Start exploring and add items to your wishlist!
            </p>
            <Link href={"../allproducts"}>
            <button
               // Redirect to product listing page
              className="inline-flex items-center px-3 py-3 border border-transparent text-[12px] font-medium  shadow-sm text-white bg-[#2A254B] hover:bg-[#2f2668]  mt-4"
            >
              Start Shopping
            </button></Link>
          </div>
        ) : (
          // Render Wishlist Items if Not Empty
          wishlist.map((elem) => {
            return (
              <div
                key={elem._id}
                className="space-y-2 bg-white p-4 rounded-lg shadow-lg transition-transform transform hover:-translate-y-2 hover:shadow-2xl duration-300 ease-in-out"
              >
                <Image
                  src={elem.imageUrl}
                  alt="product image"
                  height={300}
                  width={300}
                  className="w-[300px] h-[100px] rounded-lg object-cover bg-center"
                />
                <div>
                  <p className="font-clash font-bold text-black">
                    ${elem.name}
                  </p>
                  <p>${elem.price}</p>
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => RemoveFromWish(elem._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md shadow-md transition-all duration-200 ease-in-out"
                  >
                    Remove
                  </button>
                  <button
                    onClick={() => {
                      AddToCart(elem);
                      RemoveFromWish(elem._id);
                    }}
                    className="bg-[#2A254B] hover:bg-[#3f3870] text-white px-4 py-2 rounded-md shadow-md transition-all duration-200 ease-in-out"
                  >
                    ADD TO CART
                  </button>
                </div>
              </div>
            );
          })
        )}
      </SheetDescription>
    </SheetHeader>
  </SheetContent>
        </Sheet> 
          {/*<Sheet>
            <SheetTrigger>
              <Image src={wish2} alt="" className="h-4 w-4 transition-all duration-300 ease-in-out
        transform hover:scale-125 " />
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Saved item</SheetTitle>
                <SheetDescription className="space-y-3">
                  {wishlist.map((elem) => {
                    return (
                      <div
                        key={elem._id}
                        className="space-y-2 bg-white p-4 rounded-lg shadow-lg transition-transform transform hover:-translate-y-2 hover:shadow-2xl duration-300 ease-in-out"
                      >
                        <Image
                          src={elem.imageUrl}
                          alt="product image"
                          height={300}
                          width={300}
                          className="w-[300px] h-[100px] rounded-lg object-cover bg-center"
                        />
                        <div>
                          <p className="font-clash font-bold text-black">
                            ${elem.name}
                          </p>
                          <p>${elem.price}</p>
                        </div>
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => RemoveFromWish(elem._id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md shadow-md transition-all duration-200 ease-in-out"
                          >
                            Remove
                          </button>
                          <button 
                            onClick={() => {
                              AddToCart(elem);
                              RemoveFromWish(elem._id);
                            }}
                            className="bg-[#2A254B] hover:bg-[#3f3870] text-white px-4 py-2 rounded-md shadow-md transition-all duration-200 ease-in-out"
                          >
                            ADD TO CART
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>*/}
          <span className="flex items-center gap-1">
          <Link href={"../cart"}>
            <ShoppingCart  className="w-[16px] h-[16px] transition-all duration-300 ease-in-out
        transform hover:scale-125 " />
          </Link>
          <span className="font-clash text-[12px]">{cartnum}</span></span>

          <Dialog>
  <DialogTrigger>
    <User className="w-[16px] h-[16px]" />
  </DialogTrigger>
  <DialogContent className="p-6 bg-white rounded-lg shadow-md max-w-xs sm:max-w-sm">
    <div className="flex flex-col items-center">
      {imageUrl == user1.src ? (
        <User className="h-12 w-12 text-gray-500" />
      ) : (
        <Image
          src={imageUrl}
          alt="Profile Picture"
          width={80}
          height={80}
          className="rounded-full mb-4"
        />
      )}
      <h2 className="text-xl font-semibold text-gray-800 mb-1">
        {user?.displayName || "Guest User"}
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        {user?.email || "No email available"}
      </p>
      {user == null ? (
        <button
          className="w-full bg-[#2A254B] hover:bg-[#423980] text-white font-medium py-2 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-[#423980]"
          onClick={() => route.push("../sign-in")}
        >
          Sign In
        </button>
      ) : (
        <div className="flex flex-col gap-2 w-full">
          <button
            className="w-full bg-[#2A254B] hover:bg-[#423980] text-white font-medium py-2 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-[#423980]"
            onClick={() => signOut(auth)}
          >
            Log Out
          </button>
          <Link href={"../orderhistory"} className="w-full">
            <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md transition duration-200">
              Order History
            </button>
          </Link>
        </div>
      )}
    </div>
  </DialogContent>
</Dialog>

        </div>
      </div>

      <div className="border border-[#0000001A] sm:flex hidden"></div>
      <ul className="self-center h-auto w-auto gap-[2.75rem] text-[#726E8D] sm:flex hidden">
        {product.slice(1, 8).map((elem: ProductSummary) => {
          const categorySlug = elem.category?.slug || "";
          return (
            <Link className="transition-all duration-300 ease-in-out
        transform hover:scale-125 
          " href={`../category/${categorySlug}`} key={elem._id}>
              {elem.category.name}
            </Link>
          );
        })}
      </ul>
    </div>
  );
};

export default Navbar;
