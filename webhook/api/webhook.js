// api/order-webhook.js
export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  console.log("Received webhook:", req.body); // log to verify

  const order = req.body;

  try {
    const response = await fetch("https://onesignal.com/api/v1/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Basic " + process.env.ONESIGNAL_API_KEY,
      },
      body: JSON.stringify({
        app_id: process.env.ONESIGNAL_APP_ID,
        included_segments: ["All"],
        contents: { en: 🍽️ New order received: ${order.id} },
        data: order,
      }),
    });

    const result = await response.json();
    console.log("OneSignal response:", result);
    return res.status(200).json({ status: "Notification sent", result });
  } catch (error) {
    console.error("Error sending notification:", error);
    return res.status(500).json({ error: "Failed to send notification" });
  }
}
