with open('/home/hiago/Área de trabalho/dentista/style.css', 'r', encoding='utf-8') as f:
    content = f.read()

# Add flex-shrink: 0 to header and footer to prevent them from shrinking or moving
header_rule = ".concierge-modal-header {\n  background-color: var(--bg-canvas);"
if "flex-shrink: 0;" not in header_rule and header_rule in content:
    content = content.replace(header_rule, ".concierge-modal-header {\n  flex-shrink: 0;\n  background-color: var(--bg-canvas);")

footer_rule = ".concierge-modal-footer {\n  padding: 1rem 1.25rem;"
if "flex-shrink: 0;" not in footer_rule and footer_rule in content:
    content = content.replace(footer_rule, ".concierge-modal-footer {\n  flex-shrink: 0;\n  padding: 1rem 1.25rem;")

# Also make sure the body scroll lock works on PC (sometimes body { overflow: hidden } doesn't lock if html is scrolling)
if "html.modal-open" not in content:
    content = content.replace("body.modal-open {\n  overflow: hidden;\n}", "html.modal-open, body.modal-open {\n  overflow: hidden;\n}")

with open('/home/hiago/Área de trabalho/dentista/style.css', 'w', encoding='utf-8') as f:
    f.write(content)
