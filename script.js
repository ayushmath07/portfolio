document.addEventListener("DOMContentLoaded", () => {
  // Mobile Navigation Toggle
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  const navItems = document.querySelectorAll(".nav-links a");

  if (hamburger) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      navLinks.classList.toggle("active");
    });
  }

  // Close mobile menu when clicking a link
  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      if (hamburger.classList.contains("active")) {
        hamburger.classList.remove("active");
        navLinks.classList.remove("active");
      }
    });
  });

  // Scroll Reveal Animation
  const revealElements = document.querySelectorAll(".reveal");

  const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    const revealPoint = 100;

    revealElements.forEach((el) => {
      const revealTop = el.getBoundingClientRect().top;
      if (revealTop < windowHeight - revealPoint) {
        el.classList.add("active");
      }
    });
  };

  // Initial check and scroll listener
  revealOnScroll();
  window.addEventListener("scroll", revealOnScroll);

  // Navbar scroll effect
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        navbar.style.background = "rgba(25, 25, 25, 0.8)";
        navbar.style.boxShadow = "0 4px 30px rgba(0, 0, 0, 0.1)";
      } else {
        navbar.style.background = "transparent";
        navbar.style.boxShadow = "none";
      }
    });
  }

  // Highlight active nav link on scroll
  const sections = document.querySelectorAll("section");

  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollY >= sectionTop - 200) {
        current = section.getAttribute("id");
      }
    });

    navItems.forEach((a) => {
      a.classList.remove("active");
      if (a.getAttribute("href").includes(current)) {
        a.classList.add("active");
      }
    });
  });
});
