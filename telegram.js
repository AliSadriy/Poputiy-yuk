const TELEGRAM_BOT_TOKEN = '9275005127:AAFLgDgCiAn-dddYqtD7PcS6K6DEyhvk1kQ';
const TELEGRAM_CHAT_ID = '';

async function sendTelegramNotification(message) {
  if (!TELEGRAM_BOT_TOKEN) return;
  try {
    let chatId = TELEGRAM_CHAT_ID;
    if (!chatId) {
      const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates`);
      const data = await res.json();
      if (data.ok && data.result.length > 0) {
        const lastMsg = data.result[data.result.length - 1];
        chatId = lastMsg.message?.chat?.id || lastMsg.edited_message?.chat?.id;
      }
    }

    if (!chatId) return;

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'Markdown' })
    });
  } catch (err) {
    console.error('Telegram notification error:', err);
  }
}

module.exports = { sendTelegramNotification };
