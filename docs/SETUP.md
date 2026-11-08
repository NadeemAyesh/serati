# 🛠️ دليل التثبيت والتشغيل السريع (Setup & Run Guide)

لإعداد وتشغيل منصة **سيرتي (Seerati AI)** محلياً، اتبع الخطوات التالية:

---

## 📋 المتطلبات الأساسية
* **Node.js**: الإصدار 18 أو أحدث (المثبت حالياً v24).
* **MongoDB**: أن يكون خادم MongoDB قيد التشغيل محلياً على المنفذ `27017` (أو اتصال سحابي عبر MongoDB Atlas).
* **Angular CLI**: الإصدار 17+ (المثبت حالياً v22).

---

## 1️⃣ تشغيل خادم الباك إند (Backend Server)
```bash
cd server
npm install
npm run dev
```
* سيعمل الخادم على: `http://localhost:5000`
* نقطة التحقق من الصحة: `http://localhost:5000/api/health`

---

## 2️⃣ تشغيل تطبيق الواجهة الأمامية (Angular Frontend)
```bash
cd client
npm install
ng serve -o
```
* سيفتح المتصفح تلقائياً على: `http://localhost:4200`

---

## 🔑 تفعيل ميزات الذكاء الاصطناعي (Gemini AI - اختياري)
في ملف `server/.env`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
> **ملاحظة:** المنصة مزودة بمُحلل نصوص ذكي تلقائي (Heuristic Smart Parser) مدمج يعمل محلياً بكفاءة عالية حتى لو لم تقم بإدخال مفتاح Gemini، مع الترقية التلقائية للدقة القصوى بمجرد إضافة المفتاح.
