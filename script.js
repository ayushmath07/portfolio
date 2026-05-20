document.addEventListener("DOMContentLoaded", () => {
    const nav = document.getElementById("navbar");
    const menuButton = document.getElementById("hamburger");
    const menu = document.getElementById("mobile-menu");
    const navLinks = [...document.querySelectorAll(".nav-link")];

    const setNavState = () => {
        nav.classList.toggle("scrolled", window.scrollY > 24);
    };

    setNavState();
    window.addEventListener("scroll", setNavState, { passive: true });

    if (menuButton && menu) {
        menuButton.addEventListener("click", () => {
            const isOpen = menu.classList.toggle("active");
            menuButton.classList.toggle("active", isOpen);
            menuButton.setAttribute("aria-expanded", String(isOpen));
        });

        menu.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                menu.classList.remove("active");
                menuButton.classList.remove("active");
                menuButton.setAttribute("aria-expanded", "false");
            });
        });
    }

    const sections = [...document.querySelectorAll("main section[id]")];
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            navLinks.forEach((link) => {
                link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
            });
        });
    }, { rootMargin: "-35% 0px -55% 0px", threshold: 0 });

    sections.forEach((section) => sectionObserver.observe(section));

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("in-view");
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll(".reveal").forEach((el, index) => {
        el.style.transitionDelay = `${Math.min(index % 5, 4) * 55}ms`;
        revealObserver.observe(el);
    });

    const metricObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const value = Number.parseFloat(entry.target.dataset.target);
            if (!Number.isFinite(value)) return;

            const decimals = Number.parseInt(entry.target.dataset.decimals || "0", 10);
            const suffix = entry.target.dataset.suffix || "";
            const duration = 900;
            const start = performance.now();

            const tick = (now) => {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = value * eased;
                entry.target.textContent = `${current.toFixed(decimals)}${suffix}`;

                if (progress < 1) {
                    requestAnimationFrame(tick);
                } else {
                    entry.target.textContent = `${value.toFixed(decimals)}${suffix}`;
                }
            };

            requestAnimationFrame(tick);
            metricObserver.unobserve(entry.target);
        });
    }, { threshold: 0.65 });

    document.querySelectorAll("[data-target]").forEach((el) => metricObserver.observe(el));

    initSignalCanvas();
});

function initSignalCanvas() {
    const canvas = document.getElementById("signal-canvas");
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = canvas.getContext("2d");
    const pointer = { x: 0.72, y: 0.34 };
    let width = 0;
    let height = 0;
    let frame = 0;
    let rafId = 0;

    const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
        frame += prefersReducedMotion ? 0 : 0.012;
        ctx.clearRect(0, 0, width, height);

        const spacing = Math.max(28, Math.min(58, width / 24));
        const cols = Math.ceil(width / spacing) + 2;
        const rows = Math.ceil(height / spacing) + 2;

        ctx.lineWidth = 1;

        for (let y = -1; y < rows; y += 1) {
            ctx.beginPath();
            for (let x = -1; x < cols; x += 1) {
                const px = x * spacing;
                const py = y * spacing;
                const dx = px / width - pointer.x;
                const dy = py / height - pointer.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const bend = Math.max(0, 1 - distance * 2.35);
                const wave = Math.sin(x * 0.82 + y * 0.38 + frame) * 5;
                const ox = Math.cos(frame + y * 0.5) * bend * 18;
                const oy = wave + Math.sin(frame + x * 0.35) * bend * 15;

                if (x === -1) {
                    ctx.moveTo(px + ox, py + oy);
                } else {
                    ctx.lineTo(px + ox, py + oy);
                }
            }

            ctx.strokeStyle = y % 3 === 0 ? "rgba(255, 90, 61, 0.13)" : "rgba(17, 20, 17, 0.055)";
            ctx.stroke();
        }

        ctx.fillStyle = "rgba(95, 127, 72, 0.28)";
        const pulse = prefersReducedMotion ? 1 : 1 + Math.sin(frame * 3) * 0.12;
        ctx.beginPath();
        ctx.arc(pointer.x * width, pointer.y * height, 5 * pulse, 0, Math.PI * 2);
        ctx.fill();

        if (!prefersReducedMotion) {
            rafId = requestAnimationFrame(draw);
        }
    };

    resize();
    draw();

    window.addEventListener("resize", () => {
        resize();
        if (prefersReducedMotion) draw();
    }, { passive: true });

    window.addEventListener("pointermove", (event) => {
        pointer.x = event.clientX / Math.max(width, 1);
        pointer.y = event.clientY / Math.max(height, 1);
        if (prefersReducedMotion) draw();
    }, { passive: true });

    window.addEventListener("beforeunload", () => cancelAnimationFrame(rafId));
}
