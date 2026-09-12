with open('/home/hiago/Área de trabalho/dentista/script.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the toggle logic
old_toggle = """    conciergeTrigger.addEventListener('click', () => {
      conciergeModal.classList.toggle('is-open');
      if (conciergeModal.classList.contains('is-open')) {
        conciergeInput?.focus();
      }
    });
    conciergeClose?.addEventListener('click', () => {
      conciergeModal.classList.remove('is-open');
    });"""

new_toggle = """    conciergeTrigger.addEventListener('click', () => {
      conciergeModal.classList.toggle('is-open');
      if (conciergeModal.classList.contains('is-open')) {
        document.body.classList.add('modal-open');
        conciergeInput?.focus();
      } else {
        document.body.classList.remove('modal-open');
      }
    });
    conciergeClose?.addEventListener('click', () => {
      conciergeModal.classList.remove('is-open');
      document.body.classList.remove('modal-open');
    });"""

content = content.replace(old_toggle, new_toggle)

with open('/home/hiago/Área de trabalho/dentista/script.js', 'w', encoding='utf-8') as f:
    f.write(content)
