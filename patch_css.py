with open('/home/hiago/Área de trabalho/dentista/style.css', 'r', encoding='utf-8') as f:
    content = f.read()

# Add .modal-open to body
if '.modal-open' not in content:
    reset_index = content.find('body {')
    content = content[:reset_index] + "body.modal-open {\n  overflow: hidden;\n}\n\n" + content[reset_index:]

# Fix mobile modal
old_modal = """/* Modal Window */
.concierge-modal {
  position: fixed;
  bottom: 5.5rem;
  left: 1.75rem;
  width: 370px;
  max-width: calc(100vw - 2.5rem);
  height: 520px;
  max-height: calc(100vh - 7rem);"""

new_modal = """/* Modal Window */
.concierge-modal {
  position: fixed;
  bottom: 5.5rem;
  left: 1.75rem;
  width: 370px;
  max-width: calc(100vw - 2.5rem);
  height: 520px;
  max-height: calc(100vh - 7rem);"""

# Add media query for mobile at the end of the file
mobile_fix = """
@media (max-width: 640px) {
  .concierge-modal {
    bottom: 0;
    left: 0;
    width: 100vw;
    max-width: 100vw;
    height: 100vh;
    height: 100dvh; /* dynamic viewport for iOS */
    max-height: 100vh;
    max-height: 100dvh;
    border-radius: 0;
    z-index: 1000;
  }
  .concierge-close-btn {
    padding: 8px;
    background: rgba(0,0,0,0.05);
    border-radius: 50%;
  }
}
"""
content += mobile_fix

with open('/home/hiago/Área de trabalho/dentista/style.css', 'w', encoding='utf-8') as f:
    f.write(content)
