const FCM = require("fcm-node");
const fcm = new FCM(process.env.FCM_SERVER_KEY);


async function sendNotification(tokens, title, body, data = {}) {
  if (!tokens || tokens.length === 0) return;

  const message = {
    registration_ids: tokens,
    notification: {
      title,
      body,
    },
    data, // extra payload if needed
  };

  return new Promise((resolve, reject) => {
    fcm.send(message, (err, response) => {
      if (err) {
        console.error("❌ FCM Error:", err);
        reject(err);
      } else {
        console.log("✅ FCM Notification Sent:", response);
        resolve(response);
      }
    });
  });
}

module.exports = { sendNotification };
