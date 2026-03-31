const RIPPLE_RADIUS = 120;
const MAX_DISPLACEMENT = 30;
const MAX_ROTATION = 20;
const MAX_SCALE_OFFSET = 0.3;

export function createRippleEngine(spans) {
    const rects = new Float64Array(spans.length * 2);
    let stale = true;

    function cachePositions() {
        for (let i = 0; i < spans.length; i++) {
            const r = spans[i].getBoundingClientRect();
            rects[i * 2] = r.left + r.width / 2;
            rects[i * 2 + 1] = r.top + r.height / 2;
        }
        stale = false;
    }

    function invalidate() {
        stale = true;
    }

    function applyRipple(mx, my) {
        if (stale) cachePositions();

        const r2 = RIPPLE_RADIUS * RIPPLE_RADIUS;

        for (let i = 0; i < spans.length; i++) {
            const cx = rects[i * 2];
            const cy = rects[i * 2 + 1];
            const dx = cx - mx;
            const dy = cy - my;
            const dist2 = dx * dx + dy * dy;

            if (dist2 > r2) continue;

            const dist = Math.sqrt(dist2);
            const t = 1 - dist / RIPPLE_RADIUS;
            const ease = t * t * (3 - 2 * t);

            const angle = Math.atan2(dy, dx);
            const push = ease * MAX_DISPLACEMENT;
            const tx = Math.cos(angle) * push;
            const ty = Math.sin(angle) * push;
            const rot = (Math.random() - 0.5) * ease * MAX_ROTATION;
            const scale = 1 + (Math.random() - 0.3) * ease * MAX_SCALE_OFFSET;
            const duration = 0.8 + (1 - ease) * 1.2;

            const span = spans[i];
            span.style.transform = `translate(${tx}px, ${ty}px) rotate(${rot}deg) scale(${scale})`;
            span.style.setProperty('--return-duration', `${duration}s`);
        }
    }

    function clearRipple() {
        for (const span of spans) {
            span.style.transform = '';
        }
    }

    return { applyRipple, clearRipple, invalidate };
}
