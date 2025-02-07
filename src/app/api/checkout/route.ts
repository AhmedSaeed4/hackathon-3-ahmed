import { StaticImageData } from "next/image";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export interface CartItem {
  _id: string;
  imageUrl: string | StaticImageData;
  name: string;
  description: string;
  price: number;
  quantity: number; // Quantity remains only for cart
}

// POST handler
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { cart, shippingCost } = body;

    if (!cart || cart.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Create line items for the cart
    const lineItems = cart.map((item: CartItem) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          images: [item.imageUrl],
        },
        unit_amount: item.price * 100, // Convert price to cents
      },
      quantity: item.quantity,
    }));

    // Add shipping cost as a separate line item
    if (shippingCost && shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "Shipping Cost",
          },
          unit_amount: shippingCost * 100, // Convert shipping cost to cents
        },
        quantity: 1,
      });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${req.headers.get("origin")}/order-confirmation`,
      cancel_url: `${req.headers.get("origin")}/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

// Method Not Allowed for other HTTP methods
export async function GET() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}