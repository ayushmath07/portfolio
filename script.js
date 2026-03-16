/* ═══════════════════════════════════════════════════════════
   AYUSHMAN MATH — PORTFOLIO INTERACTIVITY
   Particles, GSAP Animations, Typewriter, Nav, Counters
   ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    // ── Particle System ──────────────────────────────────
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    const PARTICLE_COUNT = 70;
    const CONNECTION_DIST = 120;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.radius = Math.random() * 1.5 + 0.5;
            this.opacity = Math.random() * 0.4 + 0.1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(6, 182, 212, ${this.opacity})`;
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(new Particle());
        }
    }

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < CONNECTION_DIST) {
                    const alpha = (1 - dist / CONNECTION_DIST) * 0.08;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        drawConnections();
        requestAnimationFrame(animateParticles);
    }

    resizeCanvas();
    initParticles();
    animateParticles();

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            resizeCanvas();
            initParticles();
        }, 200);
    });

    // ── Typewriter Effect ────────────────────────────────
    const typewriterEl = document.getElementById('typewriter');
    const titles = [
        'scalable systems.',
        'intelligent backends.',
        'production-grade APIs.',
        'things that think.',
    ];
    let titleIdx = 0, charIdx = 0, isDeleting = false;

    function typewrite() {
        const current = titles[titleIdx];
        if (!isDeleting) {
            typewriterEl.textContent = current.substring(0, charIdx + 1);
            charIdx++;
            if (charIdx === current.length) {
                isDeleting = true;
                setTimeout(typewrite, 2000);
                return;
            }
            setTimeout(typewrite, 80);
        } else {
            typewriterEl.textContent = current.substring(0, charIdx - 1);
            charIdx--;
            if (charIdx === 0) {
                isDeleting = false;
                titleIdx = (titleIdx + 1) % titles.length;
                setTimeout(typewrite, 500);
                return;
            }
            setTimeout(typewrite, 40);
        }
    }

    setTimeout(typewrite, 1000);

    // ── Navbar Scroll ────────────────────────────────────
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ── Active Nav Link ──────────────────────────────────
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(s => {
            if (window.scrollY >= s.offsetTop - 200) {
                current = s.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    // ── Mobile Menu ──────────────────────────────────────
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // ── GSAP Animations ──────────────────────────────────
    gsap.registerPlugin(ScrollTrigger);

    // Hero
    gsap.to('.gsap-hero', {
        opacity: 1, y: 0, duration: 0.8, stagger: 0.15,
        ease: 'power3.out', delay: 0.3,
    });

    gsap.to('.gsap-hero-card', {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.8,
    });

    // Section headings
    gsap.utils.toArray('.gsap-section').forEach(el => {
        gsap.to(el, {
            scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
            opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
        });
    });

    // Cards (stagger within each section)
    document.querySelectorAll('section').forEach(section => {
        const cards = section.querySelectorAll('.gsap-card');
        if (cards.length > 0) {
            gsap.to(cards, {
                scrollTrigger: { trigger: section, start: 'top 75%', toggleActions: 'play none none none' },
                opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'power3.out',
            });
        }
    });

    // ── Counter Animation ────────────────────────────────
    const statNumbers = document.querySelectorAll('.stat-number');

    statNumbers.forEach(el => {
        const target = parseFloat(el.dataset.target);
        const decimals = parseInt(el.dataset.decimals) || 0;
        const suffix = el.dataset.suffix || '';

        if (!target && target !== 0) return;

        ScrollTrigger.create({
            trigger: el,
            start: 'top 85%',
            once: true,
            onEnter: () => {
                gsap.to({ val: 0 }, {
                    val: target,
                    duration: 1.5,
                    ease: 'power2.out',
                    onUpdate: function () {
                        el.textContent = this.targets()[0].val.toFixed(decimals) + suffix;
                    },
                });
            },
        });
    });
});
