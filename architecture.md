# "Poputniy Yuk" (Bo'sh qaytayotgan mashinalar platformasi) - Arxitektura va Texnik Talablar

## 1. Kirish
"Poputniy Yuk" — bu yuk tashuvchi haydovchilarning bo'sh qayrayotgan reyslarini yuk egalari bilan bog'lovchi onlayn platforma (Web / Telegram Mini App).

## 2. Foydalanuvchi Rollari va Imkoniyatlar
- **Yuk egasi (Заказчик):**
  - Yuk qo'shish (qayerdan, qayerga, vazni, hajmi, turi, narxi/kelishilgan holda).
  - E'lonlarni boshqarish va haydovchilar takliflarini ko'rish.
  - Haydovchi bilan to'g'ridan-to'g'ri aloqa qilish.
- **Haydovchi (Водитель):**
  - Bo'sh reys yo'nalishini kiritish (masalan, Toshkent -> Samarqand, sana).
  - Mavjud yuklarni qidirish va taklif yuborish.
  - Buyurtmalarni qabul qilish va statusini o'zgartirish.

## 3. Texnologik Stek (Tech Stack)
- **Frontend / Mini App:** React, Tailwind CSS, TypeScript, Telegram WebApp SDK.
- **Backend:** Node.js (Express) yoki Python (FastAPI).
- **Ma'lumotlar bazasi:** PostgreSQL + Prisma ORM.
- **Xarita va Geolyokatsiya:** Yandex Maps API yoki OpenStreetMap.
- **Xabarnomalar:** Telegram Bot API.

## 4. Ma'lumotlar Bazasi Tuzilmasi (Database Schema - Prisma)
```prisma
model User {
  id        String   @id @default(uuid())
  phone     String   @unique
  name      String
  role      Role     @default(OWNER) // OWNER, DRIVER
  createdAt DateTime @default(now())
  loads     Load[]
  trips     Trip[]
}

model Load {
  id          String   @id @default(uuid())
  ownerId     String
  owner       User     @relation(fields: [ownerId], references: [id])
  origin      String
  destination String
  weight      Float
  description String?
  price       Decimal?
  status      Status   @default(ACTIVE)
  createdAt   DateTime @default(now())
}

model Trip {
  id          String   @id @default(uuid())
  driverId    String
  driver      User     @relation(fields: [driverId], references: [id])
  origin      String
  destination String
  date        DateTime
  status      Status   @default(ACTIVE)
  createdAt   DateTime @default(now())
}

enum Role {
  OWNER
  DRIVER
}

enum Status {
  ACTIVE
  IN_PROGRESS
  COMPLETED
  CANCELLED
}
```
