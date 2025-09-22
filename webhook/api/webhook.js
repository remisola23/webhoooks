// api/order-webhook.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const order = req.body; // Cloud Waitress webhook payload

  try {
    // Forward to OneSignal
    const response = await fetch("https://onesignal.com/api/v1/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Basic " + process.env.ONESIGNAL_API_KEY, // use Vercel env vars
      },
      body: JSON.stringify({
        app_id: process.env.ONESIGNAL_APP_ID,
        included_segments: ["All"], // notify all users OR use player IDs
        contents: { en: 🍽️ New order received: ${order.id} },
        data: order // attach full order details for app to use
      }),
    });

    const result = await response.json();
    return res.status(200).json({ status: "Notification sent", result });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to send notification" });
  }
}