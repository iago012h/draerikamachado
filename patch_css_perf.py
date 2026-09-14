with open('/home/hiago/Área de trabalho/dentista/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

animations = """
/* ==========================================================================
   SCROLL REVEAL & ANIMATIONS
   ========================================================================== */
.reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: opacity, transform;
}

.reveal.active {
  opacity: 1;
  transform: translateY(0);
}

/* Stagger directory rows */
.directory-row:nth-child(1) { transition-delay: 0.1s; }
.directory-row:nth-child(2) { transition-delay: 0.2s; }
.directory-row:nth-child(3) { transition-delay: 0.3s; }
.directory-row:nth-child(4) { transition-delay: 0.4s; }
.directory-row:nth-child(5) { transition-delay: 0.5s; }
.directory-row:nth-child(6) { transition-delay: 0.6s; }

@keyframes pulse-attention {
  0% { box-shadow: 0 0 0 0 rgba(197, 155, 99, 0.4); }
  70% { box-shadow: 0 0 0 15px rgba(197, 155, 99, 0); }
  100% { box-shadow: 0 0 0 0 rgba(197, 155, 99, 0); }
}

@keyframes float-subtle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}
"""

if ".reveal {" not in css:
    css = css + animations

# Add pulse animation to the trigger button
trigger_rule = ".concierge-trigger-editorial {\n  position: fixed;"
if "animation: float-subtle 4s ease-in-out infinite;" not in css:
    css = css.replace(trigger_rule, ".concierge-trigger-editorial {\n  position: fixed;\n  animation: float-subtle 4s ease-in-out infinite;")

# Let's add pulse to the dot indicator inside the trigger
dot_rule = ".concierge-trigger-editorial .dot-indicator {\n  width: 8px;"
if "animation: pulse-attention 2.5s infinite;" not in css:
    css = css.replace(dot_rule, ".concierge-trigger-editorial .dot-indicator {\n  width: 8px;\n  animation: pulse-attention 2.5s infinite;")

with open('/home/hiago/Área de trabalho/dentista/style.css', 'w', encoding='utf-8') as f:
    f.write(css)
print("CSS patched.")
