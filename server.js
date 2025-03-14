const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

// إنشاء التطبيق
const app = express();
app.use(express.json()); // للسماح بقراءة JSON
app.use(cors()); // للسماح بالطلبات من الفرونت

// الاتصال بقاعدة البيانات
mongoose.connect("mongodb://localhost:27017/mydatabase", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("✅ تم الاتصال بقاعدة البيانات"))
.catch((error) => console.error("❌ خطأ في الاتصال بقاعدة البيانات:", error));

// إنشاء نموذج المستخدم
const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String
});

const User = mongoose.model("User", UserSchema);

// ✅ تسجيل مستخدم جديد
app.post("/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "❌ يرجى ملء جميع الحقول" });
        }

        // تشفير كلمة المرور
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ username, email, password: hashedPassword });

        await newUser.save();
        res.status(201).json({ message: "✅ تم تسجيل المستخدم بنجاح", user: newUser });
    } catch (error) {
        res.status(500).json({ message: "❌ حدث خطأ في السيرفر", error });
    }
});

// ✅ تسجيل الدخول وإنشاء التوكن
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "❌ يرجى ملء جميع الحقول" });
        }

        // البحث عن المستخدم
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "❌ المستخدم غير موجود" });
        }

        // التحقق من كلمة المرور
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "❌ كلمة المرور غير صحيحة" });
        }

        // إنشاء التوكن
        const token = jwt.sign({ userId: user._id }, "secretKey", { expiresIn: "1h" });

        res.status(200).json({ message: "✅ تم تسجيل الدخول بنجاح", token });
    } catch (error) {
        res.status(500).json({ message: "❌ حدث خطأ في السيرفر", error });
    }
});

// ✅ الوصول للصفحة الشخصية (يحتاج إلى توكن)
app.get("/profile", async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "❌ غير مصرح لك بالوصول" });
        }

        const decoded = jwt.verify(token, "secretKey");

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "❌ المستخدم غير موجود" });
        }

        res.status(200).json({ message: "✅ تم جلب بيانات المستخدم", user });
    } catch (error) {
        res.status(500).json({ message: "❌ حدث خطأ في السيرفر", error });
    }
});

// ✅ تشغيل السيرفر
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 السيرفر يعمل على http://localhost:${PORT}`));
