# إرشادات المساهمة - Thmanyah

شكراً لاهتمامك بالمساهمة في مشروع Thmanyah! هذا الملف يحتوي على إرشادات للمساهمة في المشروع.

## كيفية المساهمة

### 1. Fork المشروع
1. اذهب إلى صفحة المشروع على GitHub
2. اضغط على زر "Fork" في أعلى الصفحة
3. سيتم إنشاء نسخة من المشروع في حسابك

### 2. Clone المشروع
```bash
git clone https://github.com/YOUR_USERNAME/thmanyah.git
cd thmanyah
```

### 3. إنشاء Branch جديد
```bash
git checkout -b feature/amazing-feature
# أو
git checkout -b fix/bug-fix
```

### 4. إجراء التغييرات
- قم بالتعديلات المطلوبة
- تأكد من اختبار التغييرات محلياً
- اتبع معايير الكود المذكورة أدناه

### 5. Commit التغييرات
```bash
git add .
git commit -m "Add amazing feature"
```

### 6. Push التغييرات
```bash
git push origin feature/amazing-feature
```

### 7. إنشاء Pull Request
1. اذهب إلى صفحة المشروع الأصلي
2. اضغط على "Compare & pull request"
3. املأ النموذج واشرح التغييرات
4. اضغط على "Create pull request"

## معايير الكود

### TypeScript
- استخدم TypeScript لجميع الملفات الجديدة
- حدد أنواع البيانات بوضوح
- تجنب استخدام `any` قدر الإمكان

### NestJS (Backend)
```typescript
// مثال على Service
@Injectable()
export class ExampleService {
  constructor(
    @InjectRepository(ExampleEntity)
    private exampleRepository: Repository<ExampleEntity>,
  ) {}

  async findAll(): Promise<ExampleEntity[]> {
    return this.exampleRepository.find();
  }
}
```

### Next.js (Frontend)
```typescript
// مثال على Component
interface ExampleProps {
  title: string;
  description?: string;
}

export default function ExampleComponent({ title, description }: ExampleProps) {
  return (
    <div className="example-component">
      <h1>{title}</h1>
      {description && <p>{description}</p>}
    </div>
  );
}
```

### Tailwind CSS
- استخدم classes من Tailwind CSS
- تجنب كتابة CSS مخصص إلا عند الضرورة
- استخدم responsive classes عند الحاجة

### Git Commit Messages
استخدم format التالي:
```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: ميزة جديدة
- `fix`: إصلاح خطأ
- `docs`: تحديث التوثيق
- `style`: تغييرات في التنسيق
- `refactor`: إعادة هيكلة الكود
- `test`: إضافة أو تحديث الاختبارات
- `chore`: تحديثات في البناء أو الأدوات

**مثال:**
```
feat(search): add advanced search filters

- Add genre filter
- Add country filter
- Add explicit content filter

Closes #123
```

## اختبار التغييرات

### Backend Testing
```bash
cd backend
npm run test
npm run test:e2e
```

### Frontend Testing
```bash
cd frontend
npm run test
npm run lint
```

### Full Project Testing
```bash
# تشغيل جميع الاختبارات
npm run test:all

# تشغيل المشروع للتطوير
npm run dev
```

## إرشادات إضافية

### 1. التوثيق
- اكتب تعليقات واضحة للكود المعقد
- حدث README.md إذا لزم الأمر
- أضف JSDoc للدوال المهمة

### 2. الأمان
- لا تضع معلومات حساسة في الكود
- استخدم متغيرات البيئة للمعلومات الحساسة
- تأكد من validation للمدخلات

### 3. الأداء
- تجنب العمليات المكلفة في loops
- استخدم caching عند الحاجة
- احسن استعلامات قاعدة البيانات

### 4. Accessibility
- استخدم semantic HTML
- أضف alt text للصور
- تأكد من keyboard navigation

## الإبلاغ عن الأخطاء

### كيفية الإبلاغ عن خطأ
1. اذهب إلى صفحة Issues
2. اضغط على "New Issue"
3. اختر "Bug report"
4. املأ النموذج بالتفاصيل التالية:

**معلومات مطلوبة:**
- وصف الخطأ
- خطوات إعادة إنتاج الخطأ
- السلوك المتوقع
- السلوك الفعلي
- معلومات النظام (OS, Browser, etc.)
- لقطة شاشة (إذا كان مناسباً)

## طلب ميزات جديدة

### كيفية طلب ميزة
1. اذهب إلى صفحة Issues
2. اضغط على "New Issue"
3. اختر "Feature request"
4. املأ النموذج بالتفاصيل التالية:

**معلومات مطلوبة:**
- وصف الميزة المطلوبة
- سبب الحاجة للميزة
- اقتراحات للتنفيذ
- أمثلة على الاستخدام

## التواصل

إذا كان لديك أسئلة أو تحتاج مساعدة:
- افتح Issue جديد
- اكتب في Discussions
- تواصل مع الفريق عبر البريد الإلكتروني

## شكراً لك!

شكراً لمساهمتك في تطوير Thmanyah! كل مساهمة تساعد في تحسين المشروع. 