const TelegramBot = require('node-telegram-bot-api');

const token = '9275005127:AAFLgDgCiAn-dddYqtD7PcS6K6DEyhvk1kQ';
const webAppUrl = process.env.WEB_APP_URL || 'https://poputniy.uz'; 

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const firstName = msg.from.first_name || 'Foydalanuvchi';

    bot.sendMessage(chatId, `Assalomu alaykum, *${firstName}*!\n\n"Poputniy Yuk" botiga xush kelibsiz. Bo'sh qaytayotgan mashinalar va yuklarni topish va joylash uchun pastdagi tugmani bosing:`, {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: '🚀 Ilovani ochish (Mini App)',
                        web_app: { url: webAppUrl }
                    }
                ],
                [
                    {
                        text: '📦 Yuk joylash',
                        callback_data: 'add_load'
                    },
                    {
                        text: '🚛 Bo\'sh reys qo\'shish',
                        callback_data: 'add_trip'
                    }
                ]
            ]
        }
    });
});

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    if (query.data === 'add_load') {
        bot.sendMessage(chatId, `Yuk qo'shish uchun Mini App'dagi formasidan foydalaning:`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '📱 Mini App\'ni ochish', web_app: { url: webAppUrl } }]
                ]
            }
        });
    } else if (query.data === 'add_trip') {
        bot.sendMessage(chatId, `Bo'sh reys qo'shish uchun Mini App'dan foydalaning:`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '📱 Mini App\'ni ochish', web_app: { url: webAppUrl } }]
                ]
            }
        });
    }
});

console.log('Telegram Bot started with Mini App web_app support...');
