import re

with open('/home/hiago/Área de trabalho/dentista/script.js', 'r', encoding='utf-8') as f:
    content = f.read()

# I will find the // 3. ESTÉTICA block and insert the new block right before it.
insert_marker = "      // ==========================================\n      // 3. ESTÉTICA, PROCEDIMENTOS E DÚVIDAS ESPECÍFICAS"

new_block = """      // ==========================================
      // 2.5. SOBRE A DRA. ERIKA E O ATENDIMENTO
      // ==========================================
      { keys: ['quem e a dra', 'quem e a doutora', 'quem e erika', 'fala sobre a dra', 'formacao', 'curriculo', 'estudou onde', 'qual faculdade', 'especialidade', 'especialista em que'], response: {
        answer: "A Dra. Erika Machado (CROSP 115717) é Cirurgiã-Dentista e tem o título de Mestra em Odontologia Restauradora! 🎓\\n\\nO grande diferencial dela é fazer uma odontologia muito conservadora, ou seja, ela faz de tudo para preservar seu dente natural e evitar desgastes desnecessários, usando materiais de ponta.",
        waMessage: "Oi Dra. Erika! Estava lendo sobre você no site e gostaria de agendar."
      }},
      { keys: ['como funciona o atendimento', 'como e a consulta', 'como voce atende', 'e rapido', 'demora', 'tempo de consulta', 'um paciente por vez'], response: {
        answer: "O atendimento aqui é bem diferente de clínicas populares! A Dra. Erika atende rigorosamente 1 paciente por horário. 🕰️\\n\\nIsso significa que você não vai ficar mofando na sala de espera e a Dra. vai ter tempo de sobra pra te ouvir, examinar cada detalhe e fazer o procedimento com muita calma e capricho.",
        waMessage: "Oi Dra. Erika! Adorei a forma como você atende e queria marcar."
      }},
      { keys: ['telefone', 'whatsapp', 'whats', 'zap', 'contato', 'numero', 'ligar', 'celular', 'falar com ela'], response: {
        answer: "Você pode falar com a clínica direto pelo WhatsApp! O número é (12) 99684-1633.\\n\\nSe preferir, é só clicar no botão verde aqui embaixo que já te jogo lá na nossa conversa! 👇",
        waMessage: "Oi! Peguei o contato pelo site."
      }},
      { keys: ['redes sociais', 'instagram', 'insta', 'facebook', 'face', 'tiktok', 'ver fotos', 'ver trabalhos', 'portfolio'], response: {
        answer: "Você pode ver muitos casos reais, antes e depois, e o dia a dia da clínica no Instagram da doutora! 📸\\n\\nSegue lá: @dra.erika.machado",
        waMessage: "Oi Dra. Erika! Vi o seu Instagram e o site e queria agendar."
      }},
      { keys: ['ela e boa', 'posso confiar', 'garantia', 'durabilidade', 'dura muito', 'vale a pena', 'material bom'], response: {
        answer: "Pode confiar de olhos fechados! ✨ Como a Dra. Erika tem formação de Mestrado, tudo o que ela faz tem base científica forte.\\n\\nEla só usa resinas e porcelanas premium. O objetivo dela é que o tratamento dure muitos anos na sua boca com saúde e beleza.",
        waMessage: "Oi Dra. Erika! Gostaria de agendar uma avaliação."
      }},

"""

if insert_marker in content and "2.5. SOBRE A DRA. ERIKA" not in content:
    content = content.replace(insert_marker, new_block + insert_marker)
    with open('/home/hiago/Área de trabalho/dentista/script.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Patch applied successfully.")
else:
    print("Marker not found or already patched.")
