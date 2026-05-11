// Count animation
(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function animateCount(el, to, { duration = 500, easeFn } = {}) {
        const start = 0;
        const startTime = performance.now();
        const ease = easeFn || ((t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)));

        function frame(now) {
            const p = Math.min(1, (now - startTime) / duration);
            const val = Math.round(start + (to - start) * ease(p));
            el.textContent = val.toLocaleString();
            if (p < 1) requestAnimationFrame(frame);
            else el.textContent = to.toLocaleString();
        }
        requestAnimationFrame(frame);
    }

    function initCounters() {
        const nums = document.querySelectorAll('.stat .num[data-target]');
        if (!nums.length) return;

        const run = (el) => {
            const target = Number(el.getAttribute('data-target')) || 0;
            if (prefersReduced) {
                el.textContent = target.toLocaleString();
                return;
            }
            if (el.dataset.animated) return;
            el.dataset.animated = '1';
            animateCount(el, target, { duration: 1800 });
        };

        const stats = document.querySelector('.stats');
        if (!stats || !('IntersectionObserver' in window)) {
            nums.forEach(run);
            return;
        }

        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.querySelectorAll('.num[data-target]').forEach(run);
                io.unobserve(entry.target);
            });
        }, { rootMargin: '0px 0px -10% 0px', threshold: 0.15 });

        io.observe(stats);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCounters);
    } else {
        initCounters();
    }
})();

// Year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Active link highlight on scroll
(() => {
    const sections = [...document.querySelectorAll('section, main.hero')];
    const navLinks = [...document.querySelectorAll('.nav .link')];
    if (!sections.length || !navLinks.length || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const id = entry.target.id || 'home';
            navLinks.forEach((a) => {
                a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
            });
        });
    }, { rootMargin: '-42% 0px -48% 0px', threshold: 0.01 });

    sections.forEach((section) => observer.observe(section));
})();

// Split date ranges into two lines on timeline labels
function initTimelineDateLabels() {
    document.querySelectorAll('.timeline .t-item').forEach((el) => {
        const raw = (el.dataset.date || '').trim();
        const m = raw.match(/^(\d{4})\s*[\u2013\u2014-]\s*(\d{4})$/);
        if (m) {
            el.classList.add('range');
            el.dataset.from = m[1];
            el.dataset.to = m[2];
        } else {
            el.classList.remove('range');
            delete el.dataset.from;
            delete el.dataset.to;
        }
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTimelineDateLabels);
} else {
    initTimelineDateLabels();
}

// Back to top
const toTop = document.getElementById('toTop');

if (toTop) {
    window.addEventListener('scroll', () => {
        toTop.classList.toggle('visible', window.scrollY > 600);
    }, { passive: true });

    toTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}
