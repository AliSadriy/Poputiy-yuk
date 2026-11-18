const https = require('https');

const TOKEN = '9275005127:AAFLgDgCiAn-dddYqtD7PcS6K6DEyhvk1kQ';
const WEB_APP_URL = 'https://alisadriy.github.io/Poputiy-yuk/';

function apiCall(method, data) {
    return new Promise((resolve, reject) => {
        const body = JSON.stringify(data);
        const req = https.request({
            hostname: 'api.telegram.org',
            path: `/bot${TOKEN}/${method}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(body)
            }
        }, (res) => {
            let resData = '';
            res.on('data', chunk => resData += chunk);
            res.on('end', () => resolve(JSON.parse(resData)));
        });
        req.on('error', reject);
        req.write(body);
        req.end();
    });
}

async function run() {
    console.log('Deleting webhook...');
    await apiCall('deleteWebhook', { drop_pending_updates: true });

    let offset = 0;
    console.log('Starting raw long polling loop...');
    while (true) {
        try {
            const response = await apiCall('getUpdates', { offset, timeout: 30 });
            if (response.ok && response.result) {
                for (const update of response.result) {
                    offset = update.update_id + 1;
                    if (update.message && update.message.text) {
                        const chatId = update.message.chat.id;
                        const text = update.message.text;
                        console.log(`Received message "${text}" from chat ${chatId}`);

                        await apiCall('sendMessage', {
                            chat_id: chatId,
                            text: 'Assalomu alaykum! Poputniy Yuk platformasiga xush kelibsiz. Ilovani ochish uchun quyidagi tugmani bosing:',
                            reply_markup: {
                                inline_keyboard: [
                                    [{ text: '🚀 Ilovani ochish (Mini App)', web_app: { url: WEB_APP_URL } }]
                                ]
                            }
                        });
                        console.log(`Sent reply to chat ${chatId}`);
                    }
                }
            }
        } catch (err) {
            console.error('Polling error:', err.message);
            await new Promise(r => setTimeout(r, 3000));
        }
    }
}

run();
