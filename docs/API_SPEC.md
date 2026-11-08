# 📡 توثيق الـ API (API Specifications)

قائمة كاملة بجميع نقاط النهاية (Endpoints) لخدمات الباك إند مع هياكل الطلبات والاستجابات:

---

## 🔐 1. مسارات المصادقة والمستخدم (`/api/auth`)

### 1.1 تسجيل حساب جديد (Register)
* **المسار:** `POST /api/auth/register`
* **الوصول:** عام (Public)
* **جسم الطلب (Request Body):**
```json
{
  "name": "أحمد محمود",
  "email": "ahmed@example.com",
  "password": "Password123"
}
```
* **الاستجابة الناجحة (201 Created):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5...",
  "user": {
    "id": "6645a...",
    "name": "أحمد محمود",
    "email": "ahmed@example.com",
    "plan": "free",
    "aiCredits": 3
  }
}
```

---

### 1.2 تسجيل الدخول (Login)
* **المسار:** `POST /api/auth/login`
* **الوصول:** عام (Public)
* **جسم الطلب:**
```json
{
  "email": "ahmed@example.com",
  "password": "Password123"
}
```
* **الاستجابة الناجحة (200 OK):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5...",
  "user": {
    "id": "6645a...",
    "name": "أحمد محمود",
    "email": "ahmed@example.com",
    "plan": "free",
    "aiCredits": 3,
    "purchasedTemplates": []
  }
}
```

---

### 1.3 استرجاع بيانات المستخدم الحالي (Get Current User)
* **المسار:** `GET /api/auth/me`
* **الترويسة (Headers):** `Authorization: Bearer <token>`
* **الاستجابة الناجحة (200 OK):**
```json
{
  "success": true,
  "user": {
    "id": "6645a...",
    "name": "أحمد محمود",
    "email": "ahmed@example.com",
    "plan": "free",
    "aiCredits": 3,
    "purchasedTemplates": [],
    "createdAt": "2026-11-01T12:00:00.000Z"
  }
}
```

---

### 1.4 ترقية الباقة أو شراء رصيد (Upgrade / Purchase)
* **المسار:** `POST /api/auth/upgrade`
* **الترويسة:** `Authorization: Bearer <token>`
* **جسم الطلب:**
```json
{
  "plan": "pro",
  "addCredits": 25,
  "templateId": "executive-gold"
}
```

---

## 📝 2. مسارات إدارة السير الذاتية (`/api/cv`)

جميع مسارات السير الذاتية تتطلب الترويسة: `Authorization: Bearer <token>`.

### 2.1 جلب كل السير الذاتية للمستخدم
* **المسار:** `GET /api/cv`
* **الاستجابة:** مصفوفة من السير الذاتية الخاصة بالمستخدم مرتبة من الأحدث للأقدم.

### 2.2 إنشاء سيرة ذاتية جديدة
* **المسار:** `POST /api/cv`
* **جسم الطلب (مثال):**
```json
{
  "title": "سيرة ذاتية - مهندس برمجيات",
  "templateId": "modern-vibrant",
  "themeColor": "#2563eb",
  "fontFamily": "IBM Plex Sans Arabic",
  "language": "ar",
  "personalInfo": {
    "fullName": "أحمد محمود",
    "jobTitle": "مطور واجهات أمامية وتطبيقات",
    "email": "ahmed@example.com",
    "phone": "+970599000000",
    "address": "فلسطين - رام الله",
    "photo": "data:image/jpeg;base64,...",
    "summary": "مطور برمجيات ذو شغف كبير بتصميم واجهات عصرية وتجربة مستخدم سلسة..."
  },
  "experiences": [
    {
      "company": "شركة التقنية المتقدمة",
      "position": "Senior Frontend Developer",
      "location": "عن بُعد",
      "startDate": "2022-01",
      "endDate": "2024-05",
      "isCurrent": false,
      "description": "تطوير تطبيقات الويب باستخدام Angular وتحديث البنية التحتية بنسبة 40%."
    }
  ],
  "education": [
    {
      "institution": "جامعة النجاح الوطنية",
      "degree": "بكالوريوس",
      "fieldOfStudy": "هندسة الحاسوب",
      "graduationYear": "2021",
      "grade": "امتياز مع مرتبة الشرف"
    }
  ],
  "skills": [
    { "name": "Angular", "level": "خبير" },
    { "name": "Node.js", "level": "متقدم" },
    { "name": "TypeScript", "level": "خبير" }
  ],
  "languages": [
    { "name": "العربية", "proficiency": "اللغة الأم" },
    { "name": "الإنجليزية", "proficiency": "طلاقة" }
  ]
}
```

> **ملاحظة حول حدود الباقات (Plan Enforcement):**
> - **اللغات المدعومة (`language`)**: الحسابات المجانية تدعم لغتي العربية (`ar`) والإنجليزية (`en`) فقط. اختيار لغات إضافية مثل الفرنسية (`fr`) أو الألمانية (`de`) أو الإسبانية (`es`) أو التركية (`tr`) يتطلب باقة **Pro** (يُرجع الخطأ `403` مع `requireUpgrade: true`).
> - **عدد السير الذاتية**: الحساب المجاني مقتصر على سيرة ذاتية واحدة فقط.
> - **قائمة اللغات المنطوقة (`languages`)**: مسموح بلغتين مجاناً، وإضافة لغات إضافية يطلب الترقية.
> - **الصورة الشخصية (`photo`)**: مدعومة ومضغوطة تلقائياً في المتصفح (< 80KB) وتُعرض في جميع القوالب مع خيار الحذف والتبديل الفوري.
```

### 2.3 جلب سيرة ذاتية بالتفصيل
* **المسار:** `GET /api/cv/:id`

### 2.4 تحديث سيرة ذاتية
* **المسار:** `PUT /api/cv/:id`

### 2.5 حذف سيرة ذاتية
* **المسار:** `DELETE /api/cv/:id`

### 2.6 نسخ وتكرار سيرة ذاتية (Duplicate)
* **المسار:** `POST /api/cv/:id/duplicate`

---

## 🤖 3. مسارات الذكاء الاصطناعي (`/api/ai`)

### 3.1 رفع وتحليل السيرة الذاتية (Parse Resume via AI)
* **المسار:** `POST /api/ai/parse-resume`
* **الترويسة:** `Authorization: Bearer <token>`, `Content-Type: multipart/form-data`
* **FormData:** `file: [PDF / Text file]`
* **الاستجابة:** كائن JSON يحتوي البيانات المنظمة مهيأة للتعبئة المباشرة في معالج الـ Builder مع خصم رصيد ذكاء اصطناعي واحد للحسابات المجانية (وغير محدود للباقات الاحترافية).

### 3.2 تحسين الصياغة المهنية (Enhance Text)
* **المسار:** `POST /api/ai/enhance-text`
* **جسم الطلب:**
```json
{
  "text": "عملت على مشاريع الويب وكنت مسؤول عن حل المشاكل",
  "type": "experience"
}
```
* **الاستجابة:** نص مُعاد صياغته بأسلوب احترافي ATS-Friendly مع أفعال إنجاز قوية.
