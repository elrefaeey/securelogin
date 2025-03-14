document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "index.html"; // إذا لم يكن هناك توكن، ارجع لتسجيل الدخول
        return;
    }

    // جلب بيانات المستخدم
    try {
        const response = await fetch("http://localhost:5000/profile", {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        });

        const result = await response.json();
        if (response.ok) {
            document.getElementById("username").textContent = result.user.username;
        } else {
            alert(result.message);
            window.location.href = "index.html";
        }
    } catch (error) {
        console.error("Error:", error);
    }

    // تسجيل الخروج
    document.getElementById("logoutButton").addEventListener("click", () => {
        localStorage.removeItem("token");
        window.location.href = "index.html";
    });
});