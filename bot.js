const { Telegraf, Markup } = require('telegraf');

const token = process.env.TELEGRAM_BOT_TOKEN || '9275005127:AAFLgDgCiAn-dddYqtD7PcS6K6DEyhvk1kQ';
const webAppUrl = process.env.WEB_APP_URL || 'https://alisadriy.github.io/Poputiy-yuk/';

const bot = new Telegraf(token);

bot.start((ctx) => {
    const firstName = ctx.from.first_name || 'Foydalanuvchi';
    ctx.reply(`Assalomu alaykum, *${firstName}*!\n\n"Poputniy Yuk" botiga xush kelibsiz. Bo'sh qaytayotgan mashinalar va yuklarni topish va joylash uchun pastdagi tugmani bosing:`, {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
            [Markup.button.webApp('🚀 Ilovani ochish (Mini App)', webAppUrl)],
            [
                Markup.button.callback('📦 Yuk joylash', 'add_load'),
                Markup.button.callback('🚛 Bo\'sh reys qo\'shish', 'add_trip')
            ]
        ])
    });
});

bot.action('add_load', (ctx) => {
    ctx.reply('Yuk qo\'shish uchun quyidagi tugma orqali Mini App\'ni oching:', Markup.inlineKeyboard([
        [Markup.button.webApp('📱 Mini App\'ni ochish', webAppUrl)]
    ]));
});

bot.action('add_trip', (ctx) => {
    ctx.reply('Bo\'sh reys qo\'shish uchun quyidagi tugma orqali Mini App\'ni oching:', Markup.inlineKeyboard([
        [Markup.button.webApp('📱 Mini App\'ni ochish', webAppUrl)]
    ]));
});

bot.launch().then(() => {
    console.log('Telegraf bot successfully started and running...');
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
