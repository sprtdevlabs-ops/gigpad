// ===============================
// Mobile Sidebar
// ===============================

const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");

menuBtn.addEventListener("click", () => {
  sidebar.classList.toggle("open");
});

// Close sidebar when clicking a link (mobile)
document.querySelectorAll(".sidebar a").forEach((link) => {
  link.addEventListener("click", () => {
    if (window.innerWidth <= 850) {
      sidebar.classList.remove("open");
    }
  });
});

// Close sidebar when clicking outside
document.addEventListener("click", (e) => {
  if (
    window.innerWidth <= 850 &&
    sidebar.classList.contains("open") &&
    !sidebar.contains(e.target) &&
    e.target !== menuBtn
  ) {
    sidebar.classList.remove("open");
  }
});

// ===============================
// Dark Mode
// ===============================

const themeBtn = document.getElementById("themeBtn");

// Restore saved theme
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  themeBtn.textContent = "☀️";
}

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  const dark = document.body.classList.contains("dark");

  themeBtn.textContent = dark ? "☀️" : "🌙";

  localStorage.setItem("theme", dark ? "dark" : "light");
});

// ===============================
// Copy Code Buttons
// ===============================

document.querySelectorAll(".copy").forEach((button) => {
  button.addEventListener("click", () => {
    const code = button.parentElement.querySelector("code").innerText;

    navigator.clipboard.writeText(code);

    const original = button.textContent;

    button.textContent = "Copied!";

    setTimeout(() => {
      button.textContent = original;
    }, 1500);
  });
});

// ===============================
// Active Sidebar Link
// ===============================

document.querySelectorAll(".sidebar a").forEach((link) => {
  link.addEventListener("click", () => {
    document
      .querySelectorAll(".sidebar a")
      .forEach((item) => item.classList.remove("active"));

    link.classList.add("active");
  });
});

// ===============================
// Smooth TOC Navigation
// ===============================

document.querySelectorAll(".toc a").forEach((link) => {
  link.addEventListener("click", (e) => {
    const href = link.getAttribute("href");

    if (!href.startsWith("#")) return;

    e.preventDefault();

    const section = document.querySelector(href);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
      });
    }
  });
});

// ===============================
// Scroll Progress Bar
// ===============================

const progress = document.createElement("div");

progress.style.position = "fixed";
progress.style.top = "0";
progress.style.left = "0";
progress.style.height = "3px";
progress.style.width = "0%";
progress.style.background = "#1976d2";
progress.style.zIndex = "5000";

document.body.appendChild(progress);

window.addEventListener("scroll", () => {
  const scrollTop = document.documentElement.scrollTop;

  const height =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;

  progress.style.width = (scrollTop / height) * 100 + "%";
});

// ===============================
// Search Filter
// ===============================

const search = document.querySelector(".search");

if (search) {
  search.addEventListener("input", () => {
    const value = search.value.toLowerCase();

    document.querySelectorAll(".sidebar a").forEach((link) => {
      const text = link.textContent.toLowerCase();

      link.style.display = text.includes(value) ? "block" : "none";
    });
  });
}

// ===============================
// ESC closes sidebar
// ===============================

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && sidebar.classList.contains("open")) {
    sidebar.classList.remove("open");
  }
});
