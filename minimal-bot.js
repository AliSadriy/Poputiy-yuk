const { Telegraf, Markup } = require('telegraf');

const token = '9275005127:AAFLgDgCiAn-dddYqtD7PcS6K6DEyhvk1kQ';
const webAppUrl = 'https://alisadriy.github.io/Poputiy-yuk/';

const bot = new Telegraf(token);

bot.start((ctx) => {
    console.log('Received /start from user:', ctx.from.id);
    return ctx.reply('Poputniy Yuk ilovasini ochish uchun pastdagi tugmani bosing:', {
        reply_markup: {
            inline_keyboard: [
                [{ text: '🚀 Ilovani ochish (Mini App)', web_app: { url: webAppUrl } }]
            ]
        }
    });
});

bot.on('message', (ctx) => {
    console.log('Received message:', ctx.message.text);
    return ctx.reply('Ilovani ochish uchun quyidagi tugmani bosing:', {
        reply_markup: {
            inline_keyboard: [
                [{ text: '🚀 Ilovani ochish (Mini App)', web_app: { url: webAppUrl } }]
            ]
        }
    });
});

async function run() {
    await bot.telegram.deleteWebhook({ drop_pending_updates: true });
    console.log('Webhook cleared. Starting polling...');
    await bot.launch();
}

run().catch(console.error);

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
