import db from '../config/db.js';

export async function sendPushNotification(userId, { title, body, data }) {
  const user = await db('users').where({ id: userId }).select('push_token').first();
  if (!user?.push_token) return;

  try {
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: user.push_token,
        title,
        body,
        data: data || {},
        sound: 'default',
      }),
    });

    if (!response.ok) {
      console.warn(`Push notification failed for user ${userId}:`, response.status);
    }
  } catch (err) {
    console.warn(`Push notification error for user ${userId}:`, err.message);
  }
}
