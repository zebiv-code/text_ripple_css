import { buildTextDOM } from './dom-builder.js';
import { createRippleEngine } from './ripple.js';

const container = document.getElementById('text-body');
const spans = buildTextDOM(container);
const engine = createRippleEngine(spans);

let raf = 0;
let pendingX = 0, pendingY = 0;
let hasPending = false;

function onPointer(clientX, clientY) {
    pendingX = clientX;
    pendingY = clientY;
    if (!hasPending) {
        hasPending = true;
        raf = requestAnimationFrame(() => {
            engine.applyRipple(pendingX, pendingY);
            hasPending = false;
        });
    }
}

document.addEventListener('mousemove', (e) => onPointer(e.clientX, e.clientY));

document.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const t = e.touches[0];
    onPointer(t.clientX, t.clientY);
}, { passive: false });

document.addEventListener('touchstart', (e) => {
    const t = e.touches[0];
    onPointer(t.clientX, t.clientY);
}, { passive: true });

window.addEventListener('resize', () => engine.invalidate());
window.addEventListener('scroll', () => engine.invalidate());
