with open('/home/hiago/Área de trabalho/dentista/script.js', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("document.body.classList.add('modal-open');", "document.body.classList.add('modal-open');\n        document.documentElement.classList.add('modal-open');")
content = content.replace("document.body.classList.remove('modal-open');", "document.body.classList.remove('modal-open');\n        document.documentElement.classList.remove('modal-open');")

with open('/home/hiago/Área de trabalho/dentista/script.js', 'w', encoding='utf-8') as f:
    f.write(content)
