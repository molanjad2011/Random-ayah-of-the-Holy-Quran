# Random Ayah of the Holy Quran

یک اپلیکیشن **گرافیکی با GTK3** که هر بار یک **آیه تصادفی از قرآن** را نمایش می‌دهد.
این برنامه با **Python 3** و کتابخانه‌های **PyGObject (GTK)** و **Requests** ساخته شده است.
فونت استفاده شده: **Estedad**

---

## ویژگی‌ها

* نمایش **آیه تصادفی** از کل قرآن
* نمایش **نام سوره و شماره آیه**
* **ریسپانسیو** و قابل تغییر اندازه پنجره

---

## پیش‌نیازها

* Python 3
* GTK 3
* کتابخانه‌های Python:

```bash
pip install requests
```

* نصب PyGObject (GTK 3) در لینوکس:

```bash
sudo apt update
sudo apt install python3-gi python3-gi-cairo gir1.2-gtk-3.0
```

---

## نصب فونت Estedad

برای نمایش صحیح فارسی، فونت **Estedad** را نصب کنید.
می‌توانید آن را از [اینجا](https://github.com/aminabedi68/Estedad) دانلود و نصب کنید.

---

## اجرای برنامه

```bash
python3 main.py
```

* پنجره برنامه باز می‌شود.
* با زدن دکمه **Next** یک آیه جدید نمایش داده می‌شود.

---

## ساختار پروژه

```
.
├── main.py         
├── README.md    
```
