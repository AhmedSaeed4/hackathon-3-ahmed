"use client";
import { StaticImageData } from "next/image";
import { createContext, useState, useContext, useEffect } from "react";

export interface CartItem {
  _id: string;
  imageUrl: string | StaticImageData;
  name: string;
  description: string;
  price: number;
  quantity: number; // Quantity remains only for cart
}

export interface WishlistItem {
  _id: string;
  imageUrl: string | StaticImageData;
  name: string;
  description: string;
  price: number;
  quantity: number;
}

interface AppContextType {
  cart: CartItem[];
  wishlist: WishlistItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  setWishlist: React.Dispatch<React.SetStateAction<WishlistItem[]>>;
  AddToCart: (product: CartItem) => void;
  RemoveFromCart: (id: string) => void;
  AddToWish: (product: WishlistItem) => void;
  RemoveFromWish: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  // Initial Load: Retrieve cart and wishlist data from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    const savedWishlist = localStorage.getItem("wishlist");

    // Retrieve cart data
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error parsing cart data from localStorage", error);
      }
    }

    // Retrieve wishlist data
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (error) {
        console.error("Error parsing wishlist data from localStorage", error);
      }
    }
  }, []); // Empty dependency array ensures this runs only on initial load

  // Save cart data to localStorage only when cart changes
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  // Save wishlist data to localStorage only when wishlist changes
  useEffect(() => {
    if (wishlist.length > 0) {
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
    }
  }, [wishlist]);

  const AddToCart = (product: CartItem) => {
    const existingProduct = cart.find((item) => item._id === product._id);

    let updatedCart;
    if (existingProduct) {
      updatedCart = cart.map((item) =>
        item._id === product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedCart = [...cart, { ...product, quantity: 1 }];
    }

    setCart(updatedCart);
  };

  const RemoveFromCart = (id: string) => {
    const existingProduct = cart.find((item) => item._id === id);

    let updatedCart;
    if (existingProduct && existingProduct.quantity > 1) {
      updatedCart = cart.map((item) =>
        item._id === id ? { ...item, quantity: item.quantity - 1 } : item
      );
    } else {
      updatedCart = cart.filter((item) => item._id !== id);
    }

    setCart(updatedCart);
  };

  const AddToWish = (product: WishlistItem) => {
    const existingProduct = wishlist.find((item) => item._id === product._id);

    if (!existingProduct) {
      const updatedWishlist = [...wishlist, product];
      setWishlist(updatedWishlist);
    }
  };

  const RemoveFromWish = (id: string) => {
    const updatedWishlist = wishlist.filter((item) => item._id !== id);
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist)); // Ensure immediate update
  };

  return (
    <AppContext.Provider
      value={{
        cart,
        wishlist,
        setCart,
        setWishlist,
        AddToCart,
        RemoveFromCart,
        AddToWish,
        RemoveFromWish,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be used within an AppWrapper");
  }

  return context;
}
