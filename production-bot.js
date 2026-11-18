const { Telegraf } = require('telegraf');

const token = process.env.TELEGRAM_BOT_TOKEN || '9275005127:AAFLgDgCiAn-dddYqtD7PcS6K6DEyhvk1kQ';
const webAppUrl = process.env.WEB_APP_URL || 'https://alisadriy.github.io/Poputiy-yuk/';

if (!token) {
    console.error('Bot token is required!');
    process.exit(1);
}

const bot = new Telegraf(token);

bot.start((ctx) => {
    const name = ctx.from.first_name || 'Foydalanuvchi';
    console.log(`[BOT] /start received from ${name} (${ctx.from.id})`);
    return ctx.reply(`Assalomu alaykum, ${name}!\n\n"Poputniy Yuk" platformasiga xush kelibsiz. Bo'sh mashinalar va yuklarni topish uchun quyidagi tugmani bosing:`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: '🚀 Ilovani ochish (Mini App)', web_app: { url: webAppUrl } }]
            ]
        }
    });
});

bot.on('message', (ctx) => {
    if (ctx.message && ctx.message.text) {
        console.log(`[BOT] Message received: ${ctx.message.text}`);
    }
    return ctx.reply('Ilovani ochish uchun quyidagi tugmani bosing:', {
        reply_markup: {
            inline_keyboard: [
                [{ text: '🚀 Ilovani ochish (Mini App)', web_app: { url: webAppUrl } }]
            ]
        }
    });
});

async function main() {
    try {
        await bot.telegram.deleteWebhook({ drop_pending_updates: true });
        console.log('[BOT] Webhook cleared successfully.');
        await bot.launch();
        console.log('[BOT] Bot is up and running via Long Polling.');
    } catch (err) {
        console.error('[BOT] Error starting bot:', err);
    }
}

main();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
