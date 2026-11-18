const { Telegraf, Markup } = require('telegraf');

const token = process.env.TELEGRAM_BOT_TOKEN || '9275005127:AAFLgDgCiAn-dddYqtD7PcS6K6DEyhvk1kQ';
const webAppUrl = process.env.WEB_APP_URL || 'https://alisadriy.github.io/Poputiy-yuk/';

const bot = new Telegraf(token);

bot.start((ctx) => {
    ctx.reply('Assalomu alaykum! Poputniy Yuk botiga xush kelibsiz.', Markup.inlineKeyboard([
        [Markup.button.webApp('🚀 Ilovani ochish', webAppUrl)]
    ]));
});

bot.on('text', (ctx) => {
    ctx.reply('Ilovani ochish uchun quyidagi tugmani bosing:', Markup.inlineKeyboard([
        [Markup.button.webApp('🚀 Ilovani ochish', webAppUrl)]
    ]));
});

bot.launch().then(() => {
    console.log('Bot successfully started with simplified handler.');
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
