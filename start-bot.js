const { Telegraf, Markup } = require('telegraf');

const token = process.env.TELEGRAM_BOT_TOKEN || '9275005127:AAFLgDgCiAn-dddYqtD7PcS6K6DEyhvk1kQ';
const webAppUrl = process.env.WEB_APP_URL || 'https://alisadriy.github.io/Poputiy-yuk/';

if (!token) {
    console.error('TELEGRAM_BOT_TOKEN is missing!');
    process.exit(1);
}

const bot = new Telegraf(token);

bot.catch((err, ctx) => {
    console.error(`Error for ${ctx.updateType}:`, err);
});

bot.start(async (ctx) => {
    try {
        const firstName = ctx.from.first_name || 'Foydalanuvchi';
        console.log(`Received /start from ${firstName} (${ctx.from.id})`);
        await ctx.reply(`Assalomu alaykum, *${firstName}*!\n\n"Poputniy Yuk" botiga xush kelibsiz. Bo'sh qaytayotgan mashinalar va yuklarni topish va joylash uchun pastdagi tugmani bosing:`, {
            parse_mode: 'Markdown',
            ...Markup.inlineKeyboard([
                [Markup.button.webApp('🚀 Ilovani ochish (Mini App)', webAppUrl)],
                [
                    Markup.button.callback('📦 Yuk joylash', 'add_load'),
                    Markup.button.callback('🚛 Bo\'sh reys qo\'shish', 'add_trip')
                ]
            ])
        });
    } catch (e) {
        console.error('Error in /start handler:', e);
    }
});

bot.action('add_load', async (ctx) => {
    try {
        await ctx.answerCbQuery();
        await ctx.reply('Yuk qo\'shish uchun quyidagi tugma orqali Mini App\'ni oching:', Markup.inlineKeyboard([
            [Markup.button.webApp('📱 Mini App\'ni ochish', webAppUrl)]
        ]));
    } catch (e) {
        console.error('Error in add_load action:', e);
    }
});

bot.action('add_trip', async (ctx) => {
    try {
        await ctx.answerCbQuery();
        await ctx.reply('Bo\'sh reys qo\'shish uchun quyidagi tugma orqali Mini App\'ni oching:', Markup.inlineKeyboard([
            [Markup.button.webApp('📱 Mini App\'ni ochish', webAppUrl)]
        ]));
    } catch (e) {
        console.error('Error in add_trip action:', e);
    }
});

async function startBot() {
    try {
        await bot.telegram.deleteWebhook({ drop_pending_updates: true });
        console.log('Webhook deleted successfully.');
        await bot.launch();
        console.log('Telegraf bot is running and polling for updates...');
    } catch (e) {
        console.error('Failed to start bot:', e);
    }
}

startBot();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
