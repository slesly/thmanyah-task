# Thmanyah Frontend

Frontend لمشروع Thmanyah باستخدام Next.js و TypeScript و Tailwind CSS.

## المميزات

- 🎨 واجهة مستخدم حديثة
- 📱 تصميم متجاوب
- ⚡ أداء محسن مع Next.js
- 🔒 Type safety مع TypeScript
- 🎨 Styling مع Tailwind CSS

## التشغيل

### المتطلبات
- Node.js 18+
- npm أو yarn

### التثبيت
```bash
npm install
```

### تشغيل التطوير
```bash
npm run dev
```

### تشغيل الإنتاج
```bash
npm run build
npm run start
```

### Linting
```bash
npm run lint
```

## البنية

```
app/
├── components/        # React Components
├── types/            # TypeScript Types
├── page.tsx          # Main Page
├── layout.tsx        # Root Layout
└── globals.css       # Global Styles
```

## المكونات

### SearchForm
مكون نموذج البحث مع validation و loading states.

### PodcastCard
مكون بطاقة البودكاست لعرض معلومات البودكاست.

## الأنماط

يستخدم المشروع Tailwind CSS للأنماط مع:
- Responsive design
- Dark mode support
- Custom color palette
- Component-based styling

## API Integration

يتواصل Frontend مع Backend عبر:
- Axios للـ HTTP requests
- Error handling شامل
- Loading states
- Type-safe API calls

## البيئة

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
``` 