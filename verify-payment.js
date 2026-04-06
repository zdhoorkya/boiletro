import crypto from "node:crypto";
import { readJsonBody } from "./_shared.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed." });
    return;
  }

  const keySecret = process.env.RAZORPAY_KEY_SECRET || "";

  if (!keySecret) {
    res.status(500).json({ error: "Missing Razorpay secret for verification." });
    return;
  }

  try {
    const body = await readJsonBody(req);
    const signature = crypto
      .createHmac("sha256", keySecret)
      .update(`${body.razorpay_order_id}|${body.razorpay_payment_id}`)
      .digest("hex");

    res.status(200).json({
      verified: signature === body.razorpay_signature
    });
  } catch (error) {
    res.status(500).json({
      error: error.message || "Unable to verify payment."
    });
  }
}

