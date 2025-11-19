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
            else el.textContent = to.toLocaleString(); // snap exact
        }
        requestAnimationFrame(frame);
    }

    function initCounters() {
        const nums = document.querySelectorAll('.stat .num[data-target]');
        if (!nums.length) return;

        const run = (el) => {
            const target = Number(el.getAttribute('data-target')) || 0;
            if (prefersReduced) { el.textContent = target.toLocaleString(); return; }
            // guard: only run once
            if (el.dataset.animated) return;
            el.dataset.animated = '1';
            animateCount(el, target, { duration: 2500 });
        };

        // Trigger when stats section is visible
        const io = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) {
                    e.target.querySelectorAll('.num[data-target]').forEach(run);
                    io.unobserve(e.target);
                }
            });
        }, { rootMargin: '0px 0px -10% 0px', threshold: 0.15 });

        // Observe the whole stats grid
        const stats = document.querySelector('.stats');
        if (stats) io.observe(stats);
        else nums.forEach(run); // fallback if .stats not found
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCounters);
    } else {
        initCounters();
    }
})();

// Border Animation Citation Counts
(() => {
    const supportsHas = CSS.supports?.('selector(:has(*))');

    function armPerCardAnimation() {
        const cards = document.querySelectorAll('.stats .stat');
        if (!cards.length) return;

        // Each card gets its own observer -> separate triggers
        cards.forEach((card) => {
            const io = new IntersectionObserver((entries) => {
                entries.forEach((e) => {
                    if (!e.isIntersecting) return;
                    // Start the appear+sweep once per card
                    card.classList.add('is-animating');
                    // Stop observing this card after first run
                    io.unobserve(card);
                });
            }, { threshold: 0.3 });
            io.observe(card);
        });

        // Fallback re-trigger on hover for browsers without :has()
        if (!supportsHas) {
            cards.forEach((card) => {
                const num = card.querySelector('.num');
                if (!num) return;
                num.addEventListener('mouseenter', () => {
                    card.classList.remove('is-animating');
                    // force reflow to restart animation
                    void card.offsetWidth;
                    card.classList.add('is-animating');
                });
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', armPerCardAnimation);
    } else {
        armPerCardAnimation();
    }
})();

// Year (safe lookup)
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Active link highlight on scroll
const sections = [...document.querySelectorAll('section, main.hero')];
const navLinks = [...document.querySelectorAll('.nav .link')];
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.id || 'home';
            navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
        }
    });
}, { rootMargin: '-40% 0px -50% 0px', threshold: 0.01 });
sections.forEach(s => observer.observe(s));

// Split date ranges into two lines on timeline labels
function initTimelineDateLabels() {
    document.querySelectorAll('.timeline .t-item').forEach(el => {
        const raw = (el.dataset.date || '').trim();
        const m = raw.match(/^(\d{4})\s*[\u2013\u2014-]\s*(\d{4})$/); // YYYY–YYYY
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

function init() {
    initTimelineDateLabels();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ---- Minimal tests (console) ----
(function runTests() {
    const pubs = document.getElementById('count-pubs');
    const cites = document.getElementById('count-cites');
    const teach = document.getElementById('count-teach');
    console.assert(!!pubs && !!cites, 'Pubs & Cites counters should exist');
    console.assert(!teach, 'Courses counter should NOT exist anymore');
    console.assert(Number(pubs?.dataset.target) === 8, 'Publications target should be 8');
    console.assert(Number(cites?.dataset.target) === 100, 'Citations target should be 100');


    // Publications (now tinted): cards should differ from working paper cards (border color)
    const pubCard = document.querySelector('#publications .card');
    const wpCard = document.querySelector('#working-papers .card');
    if (pubCard && wpCard) {
        const pubStyle = getComputedStyle(pubCard);
        const wpStyle = getComputedStyle(wpCard);
        console.assert(pubStyle.borderColor !== wpStyle.borderColor, 'Publications cards should have a distinct (accent) border color');
    }

    // Status chips
    const statusChips = [...document.querySelectorAll('#working-papers .chip.status')];
    console.assert(statusChips.length >= 2, 'There should be status chips for working papers');

    // Additional: ensure no speckle canvas remains
    console.assert(!document.getElementById('bg-speckles'), 'Speckle canvas should not exist');

    // New test: background contains at least one radial-gradient (side lights)
    const bodyStyle = getComputedStyle(document.body).backgroundImage || '';
    console.assert(/radial-gradient\(/.test(bodyStyle), 'Background should include radial-gradient side lights');

    // Thumbs structure present (we don't require the image to load)
    console.assert(document.querySelector('#publications .thumb') && document.querySelector('#projects .thumb'), 'Thumbnail containers should exist in publications and projects');
})();

// Back to Top Script
const toTop = document.getElementById('toTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 600) {
        toTop.classList.add('visible');
    } else {
        toTop.classList.remove('visible');
    }
});

toTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
