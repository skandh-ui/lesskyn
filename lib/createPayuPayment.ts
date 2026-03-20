import axios from "axios";

export async function createPayuPayment(payload: {
  bookingId: string;
  amount: number;
  name: string;
  email: string;
  phone: string;
}) {
  const isTest = process.env.PAYU_ENV === "TEST";

  const authUrl = isTest
    ? "https://uat-accounts.payu.in/oauth/token"
    : "https://accounts.payu.in/oauth/token";

  const paymentLinkUrl = isTest
    ? "https://uatoneapi.payu.in/payment-links"
    : "https://oneapi.payu.in/payment-links";

  try {
    // 1. Get OAuth Access Token
    const authData = new URLSearchParams({
      client_id: process.env.PAYU_CLIENT_ID!,
      client_secret: process.env.PAYU_CLIENT_SECRET!,
      grant_type: "client_credentials",
      scope: "create_payment_links",
    });

    console.log("Requesting PayU access token...");

    const authResponse = await axios.post(authUrl, authData.toString(), {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    console.log("Auth response:", JSON.stringify(authResponse.data, null, 2));

    if (!authResponse.data?.access_token) {
      throw new Error("Failed to obtain PayU access token.");
    }

    const accessToken = authResponse.data.access_token;

    // 2. Generate Payment Link
    // Convert to IST (UTC+5:30)
const expiryDate = new Date(Date.now() + 15 * 60 * 1000 + (5.5 * 60 * 60 * 1000))
  .toISOString()
  .replace("T", " ")
  .slice(0, 19);

    const linkPayload = {
      subAmount: payload.amount.toFixed(2),
      isPartialPaymentAllowed: false,
      description: "Skin Consultation Booking",
      source: "API",
      invoiceNumber: payload.bookingId.slice(-16), // last 16 chars
      customerName: payload.name,
      customerPhone: payload.phone.replace(/^\+/, ""),
      customerEmail: payload.email,
      surl: `${process.env.FRONTEND_URL}/booking/success?bookingId=${payload.bookingId}`,
      furl: `${process.env.FRONTEND_URL}/booking/failed?bookingId=${payload.bookingId}`,
      expiryDate,
    };

    console.log("Generating PayU payment link...");
    console.log("linkPayload:", linkPayload);

    const linkResponse = await axios.post(paymentLinkUrl, linkPayload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        merchantId: process.env.PAYU_MERCHANT_ID!,
      },
    });

    console.log("PayU payment link response:", JSON.stringify(linkResponse.data, null, 2));

    if (!linkResponse.data?.result?.paymentLink) {
      throw new Error("PayU did not return a valid payment link.");
    }

    return {
      redirectUrl: linkResponse.data.result.paymentLink,
      referenceId: payload.bookingId,
      gatewayOrderId: linkResponse.data.result.id || "",
    };

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("PayU API Error Status:", error.response?.status);
      console.error("PayU API Error Response:", JSON.stringify(error.response?.data, null, 2));
      throw new Error(`PayU API error: ${JSON.stringify(error.response?.data) || error.message}`);
    }
    throw error;
  }
}