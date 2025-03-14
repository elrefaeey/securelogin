// تسجيل مستخدم جديد
document.getElementById("signupForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password })
    });

    const result = await response.json();
    if (response.ok) {
        alert(result.message);
        window.location.href = "index.html"; // الانتقال إلى صفحة تسجيل الدخول
    } else {
        document.getElementById("signup-error-message").textContent = result.message;
    }
});

// تسجيل الدخول
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const result = await response.json();
    if (response.ok) {
        localStorage.setItem("token", result.token); // حفظ التوكن
        window.location.href = "dashboard.html"; // الانتقال إلى لوحة التحكم
    } else {
        document.getElementById("error-message").textContent = result.message;
    }
});