# Poputniy Yuk - Deploy & Production Guide

Bu qo'llanma **Poputniy Yuk** ilovasini production muhitida (VPS yoki Cloud serverda) ishga tushirish uchun mo'ljallangan.

## 1. Talablar
- Node.js (v18+)
- PostgreSQL (14+)
- Telegram Bot Token

## 2. O'rnatish va Sozlash

1. Serverga kodni clone qilish:
   ```bash
   git clone https://github.com/AliSadriy/Poputiy-yuk.git
   cd Poputiy-yuk
   ```

2. Bog'liqliklarni o'rnatish:
   ```bash
   npm install
   ```

3. `.env` faylini yaratish:
   ```env
   PORT=3000
   DATABASE_URL=postgresql://user:password@localhost:5432/poputniy_yuk
   TELEGRAM_BOT_TOKEN=sizning_bot_tokeningiz
   ```

## 3. PM2 orqali fonda ishga tushirish
Ilovani doimiy ishlashi uchun PM2 dan foydalaning:
```bash
npm install -g pm2
pm2 start index.js --name "poputniy-yuk"
pm2 startup
pm2 save
```

## 4. NGINX Reverse Proxy va SSL (Domen ulash)
`poputniy.uz` domeningizni server IP manziliga yo'naltirgandan so'ng NGINX sozlamasi:
```nginx
server {
    listen 80;
    server_name poputniy.uz www.poputniy.uz;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
Certbot orqali SSL sertifikat olish:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d poputniy.uz -d www.poputniy.uz
```
