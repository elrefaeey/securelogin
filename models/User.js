const mongoose = require("mongoose");

// تعريف نموذج المستخدم
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// تصدير النموذج
module.exports = mongoose.model("User", UserSchema);