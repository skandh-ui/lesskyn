import axios from "axios";
// Service to create a payment link using BulkPe payment gateway for a booking. This will be called when user initiates payment for a booking, and it will return the redirect URL to the BulkPe payment page where user can complete the payment. The service also handles errors gracefully and ensures that all necessary information is sent to BulkPe for successful payment processing.
const BULKPE_API_URL = "https://api.bulkpe.in/client/createPGCollection";
const BULKPE_API_KEY = process.env.BULKPE_API_KEY!;

export async function createBulkpePayment(payload: {
  bookingId: string;
  amount: number;
  name: string;
  email: string;
  phone: string;
}) {
  const { bookingId, amount, name, email, phone } = payload;

  const requestBody = {
    reference_id: bookingId,
    amount: amount,
    name,
    phone,
    email,
    success_url: `${process.env.FRONTEND_URL}/booking/success?bookingId=${bookingId}`,
    failure_url: `${process.env.FRONTEND_URL}/booking/failed`,
  };

  try {
    const response = await axios.post(BULKPE_API_URL, requestBody, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${BULKPE_API_KEY}`,
      },
      timeout: 10000,
    });

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
