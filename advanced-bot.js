const { Telegraf, Markup } = require('telegraf');

const token = process.env.TELEGRAM_BOT_TOKEN || '9275005127:AAFLgDgCiAn-dddYqtD7PcS6K6DEyhvk1kQ';
const webAppUrl = process.env.WEB_APP_URL || 'https://alisadriy.github.io/Poputiy-yuk/';

const bot = new Telegraf(token);

// 1. /start buyrug'i - Asosiy menyu va Mini App tugmasi
bot.start((ctx) => {
    const firstName = ctx.from.first_name || 'Foydalanuvchi';
    ctx.reply(
        `Assalomu alaykum, *${firstName}*!\n\n"Poputniy Yuk" — Bo'sh qaytayotgan mashinalar va yuklar platformasining rasmiy botiga xush kelibsiz.`,
        {
            parse_mode: 'Markdown',
            ...Markup.inlineKeyboard([
                [Markup.button.webApp('🚀 Ilovani ochish (Mini App)', webAppUrl)],
                [
                    Markup.button.callback('📦 Yuk qidirish', 'search_loads'),
                    Markup.button.callback('🚛 Bo\'sh reyslar', 'search_trips')
                ],
                [Markup.button.callback('ℹ️ Yordam va Qo\'llanma', 'help_info')]
            ])
        }
    );
});

// 2. Inline tugmalar (Callbacks)
bot.action('search_loads', async (ctx) => {
    try {
        await ctx.answerCbQuery();
        await ctx.reply(
            '📦 *Yuklarni topish va joylash:*\n\nBarcha yuklar ro\'yxatini ko\'rish va o\'z yukingizni qo\'shish uchun quyidagi tugmani bosing:',
            {
                parse_mode: 'Markdown',
                ...Markup.inlineKeyboard([
                    [Markup.button.webApp('📦 Mini App\'da Yuklarni Ko\'rish', webAppUrl)]
                ])
            }
        );
    } catch (e) {
        console.error(e);
    }
});

bot.action('search_trips', async (ctx) => {
    try {
        await ctx.answerCbQuery();
        await ctx.reply(
            '🚛 *Bo\'sh reyslar va haydovchilar:*\n\nBo\'sh qaytayotgan mashinalarni topish yoki o\'z reysingizni qo\'shish uchun quyidagi tugmani bosing:',
            {
                parse_mode: 'Markdown',
                ...Markup.inlineKeyboard([
                    [Markup.button.webApp('🚛 Mini App\'da Reyslarni Ko\'rish', webAppUrl)]
                ])
            }
        );
    } catch (e) {
        console.error(e);
    }
});

bot.action('help_info', async (ctx) => {
    try {
        await ctx.answerCbQuery();
        await ctx.reply(
            `ℹ️ *Poputniy Yuk platformasi haqida:*

Bu bot orqali siz:
• Shaharlararo bo'sh qaytayotgan yuk mashinalarini osongina topishingiz;
• O'z yukingizni e'lon qilishingiz va haydovchilar bilan bog'lanishingiz;
• Tezkor yuklar va maxsus avtotransport turlari bo'yicha filterlashingiz mumkin.

Savollar bo'yicha: @admin`,
            { parse_mode: 'Markdown' }
        );
    } catch (e) {
        console.error(e);
    }
});

// 3. /help buyrug'i
bot.help((ctx) => {
    ctx.reply(
        '🤖 *Bot buyruqlari:*\n\n/start - Botni qayta ishga tushirish va asosiy menyu\n/help - Yordam olish',
        { parse_mode: 'Markdown' }
    );
});

// 4. Matnli xabarlar uchun javob
bot.on('text', (ctx) => {
    ctx.reply(
        'Quyidagi tugma orqali ilovani ochib, yuk yoki bo\'sh reyslarni boshqarishingiz mumkin:',
        Markup.inlineKeyboard([
            [Markup.button.webApp('🚀 Ilovani ochish', webAppUrl)]
        ])
    );
});

async function startBot() {
    try {
        await bot.telegram.deleteWebhook({ drop_pending_updates: true });
        console.log('Webhook deleted successfully.');
        await bot.launch();
        console.log('Advanced Telegram bot is running and polling...');
    } catch (e) {
        console.error('Failed to start bot:', e);
    }
}

startBot();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
