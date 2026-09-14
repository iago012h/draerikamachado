with open('/home/hiago/Área de trabalho/dentista/script.js', 'r', encoding='utf-8') as f:
    js = f.read()

observer_code = """
  /* ---------- 4. Scroll Reveal Animations ---------- */
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0) {
    const revealOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          return;
        } else {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, revealOptions);

    revealElements.forEach(el => {
      revealOnScroll.observe(el);
    });
  }
});"""

if "Scroll Reveal Animations" not in js:
    # Replace the last `});` with the observer code
    js = js[:js.rfind("});")] + observer_code
    with open('/home/hiago/Área de trabalho/dentista/script.js', 'w', encoding='utf-8') as f:
        f.write(js)
    print("JS patched.")
