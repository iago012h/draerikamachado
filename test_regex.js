const detectIntent = (text) => {
    const rawLower = text.toLowerCase();
    const lower = rawLower.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    const patterns = [
      { keys: ['q', 'que'], faq: 'confuso' },
      { keys: ['oi', 'ola'], faq: 'greetings' },
      { keys: ['agendar', 'consulta'], faq: 'agendar' },
    ];

    for (const pattern of patterns) {
      for (const key of pattern.keys) {
        const regex = new RegExp(`\\b${key}\\b`, 'i');
        if (regex.test(lower)) {
            console.log(`Matched '${key}' in '${text}'`);
            return pattern.faq;
        }
      }
    }
    return 'fallback';
}

console.log(detectIntent('quero agendar uma consulta'));
console.log(detectIntent('oi?'));
console.log(detectIntent('q'));
console.log(detectIntent('estou com dor'));
