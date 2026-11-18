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
            res.on('end', () => {
                try {
                    resolve(JSON.parse(resData));
                } catch(e) {
                    reject(new Error('Invalid JSON: ' + resData));
                }
            });
        });
        req.on('error', reject);
        req.write(body);
        req.end();
    });
}

async function run() {
    console.log('Clearing webhook with drop_pending_updates: false...');
    await apiCall('deleteWebhook', { drop_pending_updates: false });

    let offset = 0;
    // Get initial offset from latest update if any
    try {
        const initial = await new Promise((resolve) => {
            https.get(`https://api.telegram.org/bot${TOKEN}/getUpdates?offset=-1`, res => {
                let d = '';
                res.on('data', c => d += c);
                res.on('end', () => resolve(JSON.parse(d)));
            });
        });
        if (initial.ok && initial.result && initial.result.length > 0) {
            offset = initial.result[initial.result.length - 1].update_id + 1;
            console.log('Set starting offset to:', offset);
        }
    } catch(e) {}

    console.log('Raw bot polling started successfully...');

    while (true) {
        try {
            const response = await apiCall('getUpdates', { offset, timeout: 30 });
            if (response.ok && response.result) {
                for (const update of response.result) {
                    offset = update.update_id + 1;
                    const message = update.message || (update.callback_query && update.callback_query.message);
                    const chatId = message && message.chat && message.chat.id;

                    if (chatId) {
                        console.log(`Sending WebApp button to chat ${chatId}`);
                        const res = await apiCall('sendMessage', {
                            chat_id: chatId,
                            text: '🚀 "Poputniy Yuk" ilovasini ochish uchun quyidagi tugmani bosing:',
                            reply_markup: {
                                inline_keyboard: [
                                    [{ text: '📱 Ilovani ochish (Mini App)', web_app: { url: WEB_APP_URL } }]
                                ]
                            }
                        });
                        console.log('sendMessage response:', res);
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
