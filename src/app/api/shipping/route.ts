import { NextResponse } from "next/server";
import ShipEngine from "shipengine";

const shipengine = new ShipEngine(process.env.SHIPENGINE_API_KEY as string);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fromAddress, toAddress, parcel } = body;

    // Validate input
    if (!fromAddress || !toAddress || !parcel) {
      return NextResponse.json({ error: "Incomplete shipping details" }, { status: 400 });
    }

    console.log("Request Body:", body); // Log the request body for debugging

    const rateResponse = await shipengine.getRatesWithShipmentDetails({
      rateOptions: {
        carrierIds: [process.env.NEXT_PUBLIC_CARRIER_ID as string], // Optional: Remove if no specific carrier ID
      },
      shipment: {
        shipFrom: fromAddress,
        shipTo: toAddress,
        packages: [
          {
            weight: {
              value: parcel.weight,
              unit: "pound",
            },
            dimensions: {
              unit: "inch",
              length: parcel.length,
              width: parcel.width,
              height: parcel.height,
            },
          },
        ],
      },
    });

    console.log("Rate Response:", rateResponse); // Log the response for debugging

    return NextResponse.json(rateResponse);
  } catch (error) {
    console.error("Error in /api/shipping:", error); // Log the exact error
    return NextResponse.json({ error: error }, { status: 500 });
  }
}