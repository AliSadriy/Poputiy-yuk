require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');

const TOKEN = process.env.TELEGRAM_BOT_TOKEN || '9275005127:AAFLgDgCiAn-dddYqtD7PcS6K6DEyhvk1kQ';
const WEB_APP_URL = process.env.WEB_APP_URL || 'https://alisadriy.github.io/Poputiy-yuk/';

const bot = new Telegraf(TOKEN);

bot.start((ctx) => {
    ctx.reply('🚛 *Poputniy Yuk* botiga xush kelibsiz!\n\nBo\'sh mashinalar va yuklarni topish uchun quyidagi tugmani bosing:', {
        parse_mode: 'Markdown',
        ...Markup.keyboard([
            [Markup.button.webApp('🚀 Ilovani ochish (Mini App)', WEB_APP_URL)]
        ]).resize()
    });
});

bot.on('text', (ctx) => {
    ctx.reply('Quyidagi tugma orqali ilovani oching:', {
        ...Markup.keyboard([
            [Markup.button.webApp('🚀 Ilovani ochish (Mini App)', WEB_APP_URL)]
        ]).resize()
    });
});

bot.launch().then(() => {
    console.log('Standalone Telegram Bot started successfully!');
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
