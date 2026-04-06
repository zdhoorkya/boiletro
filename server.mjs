import crypto from "node:crypto";
import http from "node:http";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const envPath = resolve(process.cwd(), ".env.server");
const env = {};

if (existsSync(envPath)) {
  const raw = readFileSync(envPath, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }
    const separator = trimmed.indexOf("=");
    if (separator === -1) {
      continue;
    }
    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim();
    env[key] = value;
  }
}

const PORT = Number(env.PORT || 8787);
const RAZORPAY_KEY_ID = env.RAZORPAY_KEY_ID || "";
const RAZORPAY_KEY_SECRET = env.RAZORPAY_KEY_SECRET || "";

const sampleProduct = {
  id: "zdh-banarasi-001",
  name: "Royal Gulnaar Banarasi Saree",
  price: 18990
};

const sendJson = (res, status, payload) => {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  });
  res.end(JSON.stringify(payload));
};

const getBody = (req) =>
  new Promise((resolveBody, rejectBody) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      if (!body) {
        resolveBody({});
        return;
      }
      try {
        resolveBody(JSON.parse(body));
      } catch (error) {
        rejectBody(error);
      }
    });
    req.on("error", rejectBody);
  });

const calculateAmount = ({ productId, fallPico = "yes", quantity = 1 }) => {
  if (productId !== sampleProduct.id) {
    throw new Error("Unknown product.");
  }

  const qty = Math.max(1, Number(quantity) || 1);
  const baseAmount = sampleProduct.price * qty;
  const fallPicoCharge = fallPico === "yes" ? 50 * qty : 0;

  return {
    amount: (baseAmount + fallPicoCharge) * 100,
    breakdown: {
      baseAmount,
      fallPicoCharge,
      total: baseAmount + fallPicoCharge
    }
  };
};

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    sendJson(res, 204, {});
    return;
  }

  if (req.method === "POST" && req.url === "/api/create-order") {
    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      sendJson(res, 500, { error: "Missing Razorpay server credentials in .env.server." });
      return;
    }

    try {
      const body = await getBody(req);
      const { amount, breakdown } = calculateAmount(body);

      const razorpayResponse = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString("base64")}`
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
        sendJson(res, razorpayResponse.status, { error: order.error?.description || "Failed to create Razorpay order." });
        return;
      }

      sendJson(res, 200, {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        breakdown
      });
    } catch (error) {
      sendJson(res, 500, { error: error.message || "Unable to create order." });
    }
    return;
  }

  if (req.method === "POST" && req.url === "/api/verify-payment") {
    if (!RAZORPAY_KEY_SECRET) {
      sendJson(res, 500, { error: "Missing Razorpay secret for verification." });
      return;
    }

    try {
      const body = await getBody(req);
      const signature = crypto
        .createHmac("sha256", RAZORPAY_KEY_SECRET)
        .update(`${body.razorpay_order_id}|${body.razorpay_payment_id}`)
        .digest("hex");

      sendJson(res, 200, {
        verified: signature === body.razorpay_signature
      });
    } catch (error) {
      sendJson(res, 500, { error: error.message || "Unable to verify payment." });
    }
    return;
  }

  sendJson(res, 404, { error: "Not found." });
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Razorpay server running at http://127.0.0.1:${PORT}`);
});
