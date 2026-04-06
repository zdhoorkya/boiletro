export const sampleProduct = {
  id: "zdh-banarasi-001",
  name: "Royal Gulnaar Banarasi Saree",
  price: 18990
};

export const calculateAmount = ({ productId, fallPico = "yes", quantity = 1 }) => {
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

export const readJsonBody = async (req) => {
  if (req.body && typeof req.body === "object") {
    return req.body;
  }

  const chunks = [];

  for await (const chunk of req) {
    chunks.push(chunk);
  }

  if (!chunks.length) {
    return {};
  }

  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
};

