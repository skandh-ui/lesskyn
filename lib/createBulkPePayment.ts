import axios from "axios";

const BULKPE_API_URL = "https://api.bulkpe.in/client/createPGCollection";
const BULKPE_API_KEY = process.env.BULKPE_API_KEY!;

export async function createBulkpePayment(payload: {
  bookingId: string;
  amount: number; // 👈 Make it explicit - amount in paise
  name: string;
  email: string;
  phone: string;
}) {
  const { bookingId, amount, name, email, phone } = payload;

  try {
    const response = await axios.post(
      BULKPE_API_URL,
      {
        reference_id: bookingId,
        amount: amount, // 👈 No multiplication - already in paise
        name,
        phone,
        email,
        success_url: `${process.env.FRONTEND_URL}/booking/success?bookingId=${bookingId}`,
        failure_url: `${process.env.FRONTEND_URL}/booking/failed`,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${BULKPE_API_KEY}`,
        },
        timeout: 10000,
      },
    );

    // Check if API returned success status
    if (!response.data?.status) {
      throw new Error(
        response.data?.message || "Bulkpe payment link creation failed",
      );
    }

    // Verify redirect URL exists
    if (!response.data?.data?.redirectUrl) {
      throw new Error("No redirect URL returned from Bulkpe");
    }

    return {
      redirectUrl: response.data.data.redirectUrl,
      pgOrderId: response.data.data.pg_order_id, // Might be useful
      referenceId: response.data.data.reference_id,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle network/timeout errors
      throw new Error(
        `Bulkpe API error: ${error.response?.data?.message || error.message}`,
      );
    }
    throw error;
  }
}
