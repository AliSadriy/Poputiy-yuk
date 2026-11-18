const { Telegraf, Markup } = require('telegraf');

const TOKEN = process.env.TELEGRAM_BOT_TOKEN || '9275005127:AAFLgDgCiAn-dddYqtD7PcS6K6DEyhvk1kQ';
// Ngrok yoki lokal testing uchun yoki veb server URL
const WEB_APP_URL = process.env.WEB_APP_URL || 'https://alisadriy.github.io/Poputiy-yuk/';

const bot = new Telegraf(TOKEN);

bot.start((ctx) => {
    console.log('START command received from:', ctx.from.id);
    return ctx.reply('Assalomu alaykum! "Poputniy Yuk" platformasiga xush kelibsiz. Bo\'sh mashinalar va yuklarni topish uchun quyidagi tugmani bosing:', {
        reply_markup: {
            inline_keyboard: [
                [{ text: '🚀 Ilovani ochish (Mini App)', web_app: { url: WEB_APP_URL } }]
            ]
        }
    });
});

bot.on('message', (ctx) => {
    console.log('Message received:', ctx.message && ctx.message.text);
    return ctx.reply('Ilovani ochish uchun quyidagi tugmani bosing:', {
        reply_markup: {
            inline_keyboard: [
                [{ text: '🚀 Ilovani ochish (Mini App)', web_app: { url: WEB_APP_URL } }]
            ]
        }
    });
});

async function start() {
    try {
        await bot.telegram.deleteWebhook({ drop_pending_updates: true });
        console.log('Webhook deleted successfully. Starting polling...');
        await bot.launch();
        console.log('Telegraf bot is running!');
    } catch (err) {
        console.error('Bot launch error:', err);
    }
}

start();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
