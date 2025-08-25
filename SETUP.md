# إرشادات تشغيل مشروع Thmanyah

## المتطلبات الأساسية

قبل البدء، تأكد من تثبيت المتطلبات التالية:

### 1. Node.js
- **الإصدار المطلوب:** Node.js 18 أو أحدث
- **التحقق من التثبيت:** `node --version`
- **التحميل:** https://nodejs.org/

### 2. npm أو yarn
- **التحقق من التثبيت:** `npm --version`
- **التحميل:** يأتي مع Node.js

### 3. Docker
- **التحقق من التثبيت:** `docker --version`
- **التحميل:** https://www.docker.com/

### 4. Docker Compose
- **التحقق من التثبيت:** `docker-compose --version`
- **التحميل:** يأتي مع Docker Desktop

## طريقة التشغيل

### الخطوة 1: استنساخ المشروع
```bash
git clone <repository-url>
cd thmanyah
```

### الخطوة 2: تثبيت التبعيات

#### تثبيت تبعيات المشروع الرئيسي:
```bash
npm install
```

#### تثبيت تبعيات Backend:
```bash
cd backend && npm install && cd ..
```

#### تثبيت تبعيات Frontend:
```bash
cd frontend && npm install && cd ..
```

### الخطوة 3: إعداد قاعدة البيانات

#### تشغيل PostgreSQL باستخدام Docker:
```bash
# تشغيل PostgreSQL باستخدام Docker
docker-compose up -d

# التحقق من تشغيل الحاوية
docker ps
```

### الخطوة 4: إعداد متغيرات البيئة

#### إنشاء ملف .env للـ Backend:
```bash
# في مجلد backend
cp backend/env.example backend/.env
```

#### محتوى ملف .env:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=thmanyah_db
```

### الخطوة 5: تشغيل المشروع

#### تشغيل Backend و Frontend معاً:
```bash
npm run dev
```

#### أو تشغيل كل منهما منفصلاً:

**تشغيل Backend فقط:**
```bash
npm run dev:backend
```

**تشغيل Frontend فقط:**
```bash
npm run dev:frontend
```

### الخطوة 6: الوصول للتطبيق

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001

## اختبار التطبيق

### 1. اختبار API مباشرة
```bash
# اختبار البحث
curl "http://localhost:3001/api/search?q=فنجان"

# اختبار البحثات الحديثة
curl "http://localhost:3001/api/search/recent"
```

### 2. اختبار الواجهة
1. افتح المتصفح واذهب إلى http://localhost:3000
2. اكتب مصطلح البحث مثل "فنجان" أو "Thmanyah"
3. اضغط على زر البحث
4. تحقق من ظهور النتائج

## استكشاف الأخطاء

### مشكلة: لا يمكن الاتصال بقاعدة البيانات
```bash
# التحقق من تشغيل PostgreSQL
docker ps | grep postgres

# إعادة تشغيل الحاوية
docker-compose restart
```

### مشكلة: Backend لا يعمل
```bash
# التحقق من الأخطاء
cd backend
npm run start:dev

# التحقق من ملف .env
cat .env
```

### مشكلة: Frontend لا يعمل
```bash
# التحقق من الأخطاء
cd frontend
npm run dev

# التحقق من التبعيات
npm list
```

### مشكلة: خطأ في تثبيت التبعيات
```bash
# حذف node_modules وإعادة التثبيت
cd backend
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
npm install

cd ../frontend
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
npm install

cd ..
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
npm install
```

### مشكلة: CORS errors
تأكد من أن Backend يعمل على المنفذ 3001 وأن Frontend يعمل على المنفذ 3000.

### مشكلة: Docker لا يعمل
```bash
# التحقق من حالة Docker
docker --version
docker-compose --version

# إعادة تشغيل Docker Desktop
# ثم تشغيل الحاوية مرة أخرى
docker-compose up -d
```

## بنية المشروع

```
thmanyah/
├── backend/                 # NestJS Backend
│   ├── src/
│   │   ├── entities/        # TypeORM Entities
│   │   ├── search/          # Search Controller & Service
│   │   ├── app.module.ts    # Main Module
│   │   └── main.ts          # Application Entry Point
│   ├── package.json
│   └── .env                 # Environment Variables
├── frontend/                # Next.js Frontend
│   ├── app/
│   │   ├── components/      # React Components
│   │   ├── types/           # TypeScript Types
│   │   ├── page.tsx         # Main Page
│   │   ├── layout.tsx       # Root Layout
│   │   └── globals.css      # Global Styles
│   ├── public/              # Static Files
│   ├── package.json
│   └── README.md
├── docker-compose.yml       # Database Configuration
├── package.json            # Root Package
└── README.md              # Project Documentation
```

## API Endpoints

### البحث في البودكاستات
```
GET /api/search?q={search_term}
```

**مثال:**
```bash
curl "http://localhost:3001/api/search?q=فنجان"
```

### الحصول على البحثات الحديثة
```
GET /api/search/recent
```

**مثال:**
```bash
curl "http://localhost:3001/api/search/recent"
```

### البحث حسب مصطلح محدد
```
GET /api/search/by-term?q={search_term}
```

**مثال:**
```bash
curl "http://localhost:3001/api/search/by-term?q=Thmanyah"
```

## إيقاف المشروع

### إيقاف جميع الخدمات:
```bash
# إيقاف Backend و Frontend
Ctrl + C

# إيقاف قاعدة البيانات
docker-compose down
```

### إيقاف قاعدة البيانات فقط:
```bash
docker-compose down
```

## إعادة تشغيل المشروع

### إعادة تشغيل كامل:
```bash
# إيقاف جميع الخدمات
docker-compose down

# إعادة تشغيل قاعدة البيانات
docker-compose up -d

# إعادة تشغيل التطبيق
npm run dev
```

### إعادة تشغيل Backend فقط:
```bash
cd backend
npm run start:dev
```

### إعادة تشغيل Frontend فقط:
```bash
cd frontend
npm run dev
```

## ملاحظات مهمة

1. **قاعدة البيانات:** تأكد من تشغيل PostgreSQL قبل تشغيل Backend
2. **المنافذ:** تأكد من أن المنافذ 3000 و 3001 و 5432 متاحة
3. **البيئة:** تأكد من وجود ملف .env في مجلد backend
4. **التبعيات:** تأكد من تثبيت جميع التبعيات في كل مجلد
5. **Docker:** تأكد من تشغيل Docker Desktop

## الدعم

إذا واجهت أي مشاكل، راجع:
1. ملف `DOCUMENTATION.md` للحصول على تفاصيل تقنية
2. ملف `README.md` للحصول على نظرة عامة على المشروع
3. سجلات الأخطاء في Terminal 