document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("token")) {
      window.location.href = "tasks.html";
      return;
    }
    document
      .getElementById("login-form")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
  
        const credentials = {
          username: document.getElementById("username").value,
          password: document.getElementById("password").value,
        };
  
        try {
          const response = await fetch("http://localhost:5000/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
          });
  
          const data = await response.json();
  
          if (response.ok) {
            localStorage.setItem("token", data.token);
            window.location.href = "tasks.html";
          } else {
            document.getElementById("errer-message").textContent = data.error;
          }
        } catch {
          console.log("Login error", error);
          document.getElementById("errer-message").textContent =
            "Login failed. Please try again.";
        }
      });
  
    // Dark mode functionality
    const themeToggle = document.getElementById("theme-toggle");
    const themeIcon = themeToggle.querySelector("i");
  
    if (localStorage.getItem("darkMode") === "true");
    {
      document.body.classList.add("dark-mode");
      themeIcon.classList.remove("fa-moon");
      themeIcon.classList.add("fa-sun");
    }
  
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      if (document.body.classList.contains("dark-mode")) {
        themeIcon.classList.remove("fa-moon");
        themeIcon.classList.add("fa-sun");
        localStorage.setItem("darkMode", "true");
      } else {
        themeIcon.classList.remove("fa-sun");
        themeIcon.classList.add("fa-moon");
        localStorage.setItem("darkMode", "false");
      }
    });
  });