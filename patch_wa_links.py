with open('/home/hiago/Área de trabalho/dentista/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace general links with text
html = html.replace('"https://wa.me/message/VBLJFW3FEOGOK1"', '"https://wa.me/message/VBLJFW3FEOGOK1?text=Oi%20Dra.%20Erika!%20Vim%20pelo%20site%20e%20gostaria%20de%20conversar."')

with open('/home/hiago/Área de trabalho/dentista/index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("WhatsApp links updated in HTML.")
