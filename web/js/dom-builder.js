import { PARAGRAPHS } from './text-content.js';

export function buildTextDOM(container) {
    const spans = [];

    for (const text of PARAGRAPHS) {
        const p = document.createElement('p');
        const words = text.split(/( )/);

        for (const token of words) {
            if (token === ' ') {
                p.appendChild(document.createTextNode(' '));
                continue;
            }

            const wordSpan = document.createElement('span');
            wordSpan.className = 'word';

            for (const ch of token) {
                const span = document.createElement('span');
                span.className = 'c';
                span.textContent = ch;
                wordSpan.appendChild(span);
                spans.push(span);
            }

            p.appendChild(wordSpan);
        }

        container.appendChild(p);
    }

    return spans;
}
