import { calculateAmount, readJsonBody, sampleProduct } from "./_shared.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed." });
    return;
  }

  const keyId = process.env.RAZORPAY_KEY_ID || "";
  const keySecret = process.env.RAZORPAY_KEY_SECRET || "";

  if (!keyId || !keySecret) {
    res.status(500).json({ error: "Missing Razorpay server credentials." });
    return;
  }

  try {
    const body = await readJsonBody(req);
    const { amount, breakdown } = calculateAmount(body);

    const razorpayResponse = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`
      },
      body: JSON.stringify({
        amount,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        notes: {
          product_id: body.productId || sampleProduct.id,
          fall_pico: body.fallPico || "yes"
        }
      })
    });

    const order = await razorpayResponse.json();

    if (!razorpayResponse.ok) {
      res.status(razorpayResponse.status).json({
        error: order.error?.description || "Failed to create Razorpay order."
      });
      return;
    }

    res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      breakdown
    });
  } catch (error) {
    res.status(500).json({
      error: error.message || "Unable to create order."
    });
  }
}

