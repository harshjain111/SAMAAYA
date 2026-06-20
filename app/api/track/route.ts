import { NextResponse } from "next/server";
import { getVerifiedOrder } from "@/lib/data/orders";

/** Guest order lookup: order number + matching phone/email. */
export async function POST(req: Request) {
  let body: { orderNumber?: string; contact?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const orderNumber = body.orderNumber?.trim();
  const contact = body.contact?.trim();
  if (!orderNumber || !contact) {
    return NextResponse.json(
      { error: "Enter your order number and phone or email." },
      { status: 400 },
    );
  }

  const details = await getVerifiedOrder(orderNumber, contact);
  if (!details) {
    return NextResponse.json(
      { error: "No order matches those details." },
      { status: 404 },
    );
  }

  return NextResponse.json({ details });
}
