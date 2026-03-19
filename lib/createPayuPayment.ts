import axios from "axios";

export async function createPayuPayment(payload: {
  bookingId: string;
  amount: number;
  name: string;
  email: string;
  phone: string;
}) {
  const isTest = process.env.PAYU_ENV === "TEST";
  
  // PayU Endpoints based on environment
  const authUrl = isTest 
    ? "https://uat-accounts.payu.in/oauth/token"
    : "https://accounts.payu.in/oauth/token";
    
  const paymentLinkUrl = isTest
    ? "https://test.payu.in/api/v2/payment-links" // Note: Double check the base URL in your PayU Dashboard
    : "https://api.payu.in/api/v2/payment-links";

  try {
    // 1. Get OAuth Access Token
    const authData = new URLSearchParams({
      client_id: process.env.PAYU_CLIENT_ID!,
      client_secret: process.env.PAYU_CLIENT_SECRET!,
      grant_type: "client_credentials",
    });

    const authResponse = await axios.post(authUrl, authData.toString(), {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const accessToken = authResponse.data.access_token;

    // 2. Generate Payment Link
    const linkPayload = {
      txnid: payload.bookingId,
      amount: payload.amount.toString(),
      productinfo: "Skin Consultation",
      firstname: payload.name.split(" ")[0] || "User",
      email: payload.email,
      phone: payload.phone,
      surl: `${process.env.FRONTEND_URL}/booking/success?bookingId=${payload.bookingId}`,
      furl: `${process.env.FRONTEND_URL}/booking/failed`,
      validationPeriod: 15, // Link expires in 15 mins (matches your booking expiry)
    };

    const linkResponse = await axios.post(paymentLinkUrl, linkPayload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

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
      console.error("PayU API Error Response:", error.response?.data);
      throw new Error(`PayU API error: ${error.response?.data?.message || error.message}`);
    }
    throw error;
  }
}