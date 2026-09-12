with open('/home/hiago/Área de trabalho/dentista/style.css', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("z-index: 90;", "z-index: 998;") # Trigger
content = content.replace("z-index: 95;", "z-index: 999;") # Modal

with open('/home/hiago/Área de trabalho/dentista/style.css', 'w', encoding='utf-8') as f:
    f.write(content)
