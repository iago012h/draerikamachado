with open('/home/hiago/Área de trabalho/dentista/script.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Make the typing delay feel more human (slightly longer)
js = js.replace('const delay = 400 + Math.random() * 400;', 'const delay = 800 + Math.random() * 700;')
js = js.replace('const delay = 500 + Math.random() * 500;', 'const delay = 1000 + Math.random() * 1000;')

with open('/home/hiago/Área de trabalho/dentista/script.js', 'w', encoding='utf-8') as f:
    f.write(js)
print("JS delays patched.")
