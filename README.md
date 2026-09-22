# DolphinPark Website

واجهة موقع عربية RTL ومتجاوبة لمنتزه خليج الدولفين في الحديدة، مبنية على Next.js + TypeScript.

## التشغيل

```bash
npm install
npm run dev
```

ثم افتح http://localhost:3000
npx localtunnel --port 3000  
 رابط عام

## الإنتاج

```bash
npm run build
npm start
```

## قبل الرفع

- استبدل رقم الهاتف والبريد التجريبيين.
- استبدل رابط خرائط Google برابط المنتزه الفعلي.
- استبدل صور Unsplash بصور المنتزه الحقيقية عند توفرها.
- نموذج التواصل الحالي Frontend فقط، وسيُربط لاحقًا بالـ API.
- الموقع الخارجي لا يتصل مباشرة بـ SQL Server الداخلي.
