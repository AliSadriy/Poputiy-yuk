# Poputniy Yuk Telegram Bot (Standalone Server)

Bu loyiha **Poputniy Yuk** platformasining rasmiy Telegram boti bo'lib, uni Render, Railway yoki istalgan Node.js serverida alohida ishga tushirish uchun mo'ljallangan.

## 🚀 Serverga o'rnatish qo'llanmasi (Render / Railway / Fly.io):

1. **Repository**ni o'zingizning GitHub hisobingizga yuklang (GitHub da `AliSadriy/Poputiy-yuk`).
2. **Render.com** yoki **Railway.app** saytiga kiring va GitHub profilingiz bilan kiring.
3. Yangi **Web Service** yoki **Background Worker** yarating va ushbu repository'ni tanlang.
4. **Environment Variables** (Muhit o'zgaruvchilari) bo'limiga quyidagilarni qo'shing:
   - `TELEGRAM_BOT_TOKEN` = `9275005127:AAFLgDgCiAn-dddYqtD7PcS6K6DEyhvk1kQ`
   - `WEB_APP_URL` = `https://alisadriy.github.io/Poputiy-yuk/`
5. **Start Command** sifatida quyidagini yozing:
   ```bash
   node working-bot.js
   ```
6. **Deploy** tugmasini bosing! Shu bilan botingiz bulutli serverda 24/7 ishlay boshlaydi.
