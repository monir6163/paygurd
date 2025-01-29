import axios from "axios";

// ✅ Get PayPal Access Token
export const getAccessToken = async () => {
  try {
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error("Missing PayPal credentials");
    }

    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");

    const res = await axios.post(
      `${process.env.PAYPAL_SANDBOX_URL}/v1/oauth2/token`,
      params.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${auth}`,
        },
      }
    );

    return res.data.access_token;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Failed to get access token:",
        error.response?.data || error
      );
    } else {
      console.error("Failed to get access token:", error);
    }
    throw new Error("Failed to get access token");
  }
};
