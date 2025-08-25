# Thmanyah Backend

Backend API لمشروع Thmanyah باستخدام NestJS و TypeScript.

## المميزات

- 🔍 البحث في iTunes API
- 💾 حفظ النتائج في PostgreSQL
- ⚡ API سريع ومحسن
- 🔒 Type safety مع TypeScript
- 📊 Database management مع TypeORM

## التشغيل

### المتطلبات
- Node.js 18+
- PostgreSQL
- npm أو yarn

### التثبيت
```bash
npm install
```

### إعداد البيئة
```bash
cp env.example .env
```

### تشغيل التطوير
```bash
npm run start:dev
```

### تشغيل الإنتاج
```bash
npm run build
npm run start:prod
```

## API Endpoints

### البحث في البودكاستات
```
GET /api/search?q={search_term}
```

### البحثات الحديثة
```
GET /api/search/recent
```

### البحث حسب مصطلح محدد
```
GET /api/search/by-term?q={search_term}
```

## البنية

```
src/
├── entities/          # TypeORM Entities
├── search/            # Search Controller & Service
├── app.module.ts      # Main Module
└── main.ts           # Application Entry Point
```

## الاختبار

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
``` 