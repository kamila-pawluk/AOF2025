document
  .getElementById("register-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    const errorElement = document.getElementById("error-message");

    if (password !== confirmPassword) {
      errorElement.textContent = "Password do not match";
      return;
    }
    if (password.length < 6) {
      errorElement.textContent = "Password must be at least 6 characters long.";
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        window.location.href = "index.html";
      } else {
        errorElement.textContent = data.error || "Registration failed...";
      }
    } catch (error) {
      console.log("Registration error:", error);
      errorElement.textContent = "Registration failed. Please try again..";
    }
  });
