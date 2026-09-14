import re

with open('/home/hiago/Área de trabalho/dentista/script.js', 'r', encoding='utf-8') as f:
    content = f.read()

old_detect_intent = content[content.find("  const detectIntent = (text) => {"):content.find("  // Formulário de pergunta livre")]

new_detect_intent = """  const detectIntent = (text) => {
    const rawLower = text.toLowerCase();
    const lower = rawLower.normalize('NFD').replace(/[\\u0300-\\u036f]/g, '');

    // 0. CAPTURA DE NOME
    const nameMatch = lower.match(/(?:meu nome e|chamo|sou o|sou a|aqui e o|aqui e a|falo com o|falo com a)\\s+([a-z]+)/);
    if (nameMatch) {
      const name = nameMatch[1];
      const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
      return { type: 'custom', data: {
        answer: `Prazer em te conhecer, ${capitalized}! 😊\\n\\nEu sou a assistente virtual da Dra. Erika. Pode me fazer qualquer pergunta sobre o consultório, tratamentos, ou se quiser agendar uma consulta. Como posso te ajudar hoje?`,
        waMessage: `Oi Dra. Erika! Meu nome é ${capitalized} e queria uma informação.`
      }};
    }

    // Mapeamento de palavras-chave para respostas (ORDENADO POR PRIORIDADE)
    const patterns = [
      // ==========================================
      // 1. URGÊNCIAS E SINTOMAS (Prioridade Máxima)
      // ==========================================
      { keys: ['dor', 'doi', 'doendo', 'inchado', 'inflamado', 'urgencia', 'emergencia', 'sangue', 'sangrando', 'pus', 'socorro', 'muita dor', 'caiu', 'soltou', 'provisorio', 'urgente', 'agonia', 'nao aguento', 'morrendo de dor'], faq: 'dor' },
      { keys: ['choque', 'pontada', 'latejando', 'pulsar', 'frio', 'gelado', 'doce', 'sensibilidade', 'sensivel', 'arrepiando'], response: {
        answer: "Sentir choque ao beber água gelada ou comer doce pode ser desde uma retração na gengiva até uma cárie profunda chegando no nervo.\\n\\nNão deixa isso piorar! Agende uma avaliação pra Dra. Erika proteger esse dente antes que precise de canal.",
        waMessage: "Oi Dra. Erika! Estou com muita sensibilidade/pontadas no dente."
      }},
      { keys: ['mole', 'caindo', 'balancando'], response: {
        answer: "Dente mole em adulto é sinal de alerta máximo (pode ser problema periodontal sério ou trauma)!\\n\\nMande mensagem pra gente IMEDIATAMENTE no WhatsApp pra Dra. Erika avaliar e tentar salvar o seu dente.",
        waMessage: "Oi Dra. Erika! Estou com um dente mole e preciso de avaliação urgente."
      }},

      // ==========================================
      // 2. AGENDAMENTO, LOGÍSTICA E REGRAS
      // ==========================================
      { keys: ['agendar', 'marcar', 'consulta', 'agenda', 'horario', 'vaga', 'queria ir', 'marcar um', 'reservar', 'agendamento', 'agende', 'ir ai', 'passar com ela', 'ver a dra', 'fazer uma visita', 'tem horario', 'disponibilidade'], faq: 'agendar' },
      { keys: ['hoje', 'agora', 'ainda hoje', 'pra hj', 'vaga hoje', 'tem vaga hoje'], response: {
        answer: "Para vagas no mesmo dia, você precisa confirmar rapidinho no nosso WhatsApp, pois a agenda da Dra. Erika é bem concorrida e trabalhamos com 1 paciente por horário.\\n\\nClica abaixo e pergunta se teve alguma desistência pra hoje!",
        waMessage: "Oi Dra. Erika! Teria alguma vaga para hoje?"
      }},
      { keys: ['sabado', 'fds', 'fim de semana', 'domingo'], response: {
        answer: "Aos sábados o consultório funciona das 9h às 13h! Mas os horários de sábado costumam esgotar bem rápido.\\n\\nManda mensagem no Whats pra garantir o seu!",
        waMessage: "Oi Dra. Erika! Gostaria de agendar um horário para o Sábado."
      }},
      { keys: ['onde', 'endereco', 'shopping', 'localiza', 'como chego', 'mapa', 'fica', 'rua', 'bairro', 'cidade', 'gps', 'waze', 'maps', 'qual a rua', 'perto de', 'sao jose', 'sjc'], faq: 'local' },
      { keys: ['estacionamento', 'parar o carro', 'vaga de carro', 'carro', 'moto'], response: {
        answer: "Fica super tranquilo! O consultório fica dentro do Shopping Centro (SJC), então tem estacionamento coberto e seguro bem no local. É só parar e subir para a Sala 57 no 2º andar.",
        waMessage: "Oi Dra. Erika! Gostaria de agendar uma consulta."
      }},
      { keys: ['crianca', 'infantil', 'pediatria', 'odontopediatria', 'bebe', 'dente de leite', 'meu filho', 'minha filha', 'menino', 'menina'], response: {
        answer: "A especialidade da Dra. Erika é focada em adultos (Odontologia Restauradora e Estética). Para crianças (odontopediatria), ela pode te recomendar colegas excelentes!\\n\\nChama no Whats que ela te passa os contatos de confiança.",
        waMessage: "Oi Dra. Erika! Você atende criança ou indica algum odontopediatra?"
      }},
      { keys: ['idoso', 'velho', 'terceira idade', 'cadeirante', 'escada', 'elevador', 'acessibilidade', 'dificuldade'], response: {
        answer: "O consultório tem total acessibilidade! Ficamos no 2º andar do Shopping Centro, que conta com elevadores espaçosos, rampas e estrutura completa para cadeirantes ou pessoas com dificuldade de locomoção. Pode vir tranquilo(a)!",
        waMessage: "Oi Dra. Erika! Gostaria de agendar e saber sobre acessibilidade."
      }},
      { keys: ['medo', 'fobia', 'pavor', 'agulha', 'injecao', 'anestesia', 'trauma', 'choro', 'panico', 'ansiedade'], response: {
        answer: "Olha, você não está sozinho(a)! Muita gente tem trauma de dentista. A Dra. Erika atende exatamente pensando nisso: é um paciente por vez, num ambiente calmo, sem barulho de sala de espera cheia e com muita conversa antes de qualquer procedimento.\\n\\nEla tem uma mão super leve. Manda mensagem e fala que você tem medo, ela vai te acolher com o maior carinho!",
        waMessage: "Oi Dra. Erika! Queria agendar, mas tenho muito medo/trauma de dentista..."
      }},

      // ==========================================
      // 3. ESTÉTICA, PROCEDIMENTOS E DÚVIDAS ESPECÍFICAS
      // ==========================================
      { keys: ['gengiva', 'sangra na escova', 'limpeza', 'tartaro', 'profilaxia', 'halito', 'fedor', 'cheiro', 'fluor', 'boca amarga', 'boca seca', 'gengivite'], response: {
        answer: "A Dra. Erika faz a profilaxia clínica (limpeza completa) detalhada, ideal pra tirar o tártaro, limpar por baixo da gengiva e evitar mau hálito e perda óssea.\\n\\nO ideal é fazer de 6 em 6 meses! Quer agendar a sua?",
        waMessage: "Oi Dra. Erika! Quero agendar uma limpeza/avaliação de gengiva."
      }},
      { keys: ['diastema', 'espaco', 'separado', 'espaco entre', 'dente separado', 'abertura', 'vazado', 'fresta', 'vaozinho', 'buraco entre os dentes'], faq: 'diastema' },
      { keys: ['clareamento', 'clarear', 'branco', 'amarelo', 'branquear', 'dente escuro', 'mancha', 'cafe', 'cigarro', 'dente sujo', 'clareamento caseiro', 'clareamento a laser'], faq: 'clareamento' },
      { keys: ['restaura', 'obtura', 'carie', 'quebrou', 'fratur', 'resina', 'trinca', 'furado', 'buraco', 'pedaco', 'bati o dente', 'lascou', 'massinha', 'ponta do dente'], response: {
        answer: "Cáries, dentes trincados, lascados ou com restaurações velhas são resolvidos com Resina Estética! A Dra. Erika é Mestra nisso — ela esculpe o dente de novo, deixando idêntico ao original, e o melhor: preservando o que resta do seu dente natural.\\n\\nManda foto no Whats pra ela dar uma olhada!",
        waMessage: "Oi Dra. Erika! Preciso avaliar uma restauração ou dente quebrado."
      }},
      { keys: ['lente', 'faceta', 'porcelana', 'ceramica', 'transformar o sorriso', 'sorriso novo', 'dente de artista', 'aqueles brancos', 'lente de contato'], faq: 'lentes' },
      { keys: ['protese', 'dentadura', 'ponte', 'coroa', 'perdi dente', 'falta dente', 'chumbo', 'cinza', 'preta', 'pivô', 'roach', 'jaqueta', 'bloco'], faq: 'protese' },
      { keys: ['implante', 'parafuso', 'pino', 'raiz artificial', 'arranquei e quero colocar', 'implantar', 'protese sobre implante'], faq: 'implante' },
      { keys: ['canal', 'endodont', 'nervo', 'polpa', 'matar o nervo', 'tratamento de canal', 'raio x acusou'], faq: 'canal' },
      { keys: ['extrac', 'arrancar', 'tirar dente', 'siso', 'ciso', 'juizo', 'dente do siso', 'cirurgia', 'nao tem jeito', 'extrair'], response: {
        answer: "Para extrações simples, a Dra. Erika faz no consultório. Para dentes do siso inclusos, deitados, ou cirurgias complexas, ela conta com um cirurgião parceiro de altíssimo nível.\\n\\nManda uma mensagem no Whats com seu Raio-X se tiver!",
        waMessage: "Oi Dra. Erika! Preciso tirar uma dúvida sobre extração/siso."
      }},
      { keys: ['ortodont', 'aparelho', 'alinhar', 'torto', 'invisalign', 'alinhador', 'transparente', 'ferro', 'borrachinha', 'meu dente e torto', 'ortodontia'], response: {
        answer: "Seus dentes estão tortos? A Dra. Erika foca na parte estética de resinas e próteses, ela não coloca aparelho. MAS ela tem ortodontistas parceiros sensacionais pra indicar.\\n\\nClica abaixo e manda uma mensagem pra pedir os contatos!",
        waMessage: "Oi Dra. Erika! Gostaria de indicações ou saber sobre aparelho ortodôntico."
      }},
      { keys: ['bruxismo', 'ranger', 'apertar', 'placa', 'mordida', 'atm', 'estalo', 'dor de cabeca', 'maxilar', 'acordo com dor', 'ranjendo', 'desgastado', 'dente curto'], response: {
        answer: "Bruxismo destrói o sorriso com o tempo! A Dra. Erika faz uma avaliação completa do seu desgaste e confecciona uma placa miorrelaxante (de acrílico duro) sob medida para você dormir e proteger seus dentes.\\n\\nTambém é possível recuperar o tamanho dos dentes desgastados com resina. Vamos agendar?",
        waMessage: "Oi Dra. Erika! Acho que tenho bruxismo e preciso avaliar."
      }},
      { keys: ['botox', 'harmonizacao', 'preenchimento', 'labio', 'boca', 'bigode chines', 'papada', 'bichectomia', 'toxina', 'facial', 'rosto'], response: {
        answer: "A Dra. Erika é especialista 100% focada em Odontologia Restauradora e reabilitação dos DENTES (Lentes, Resinas, Próteses). Ela não realiza procedimentos de Harmonização Facial (Botox, preenchimento, etc).\\n\\nMas o sorriso ela garante que fica perfeito! Quer agendar para os dentes?",
        waMessage: "Oi Dra. Erika! Gostaria de agendar uma consulta odontológica."
      }},
      { keys: ['primeira', 'avaliacao', 'como e a consulta', 'primeira vez', 'conhecer', 'como funciona', 'nunca fui'], faq: 'primeira' },

      // ==========================================
      // 4. FINANCEIRO E CONVÊNIOS
      // ==========================================
      { keys: ['convenio', 'plano', 'aceita', 'pagamento', 'parcela', 'cartao', 'preco', 'valor', 'custa', 'quanto', 'orcamento', 'caro', 'barato', 'divide', 'pix', 'dinheiro', 'boleto', 'amil', 'bradesco', 'sulamerica', 'odontoprev', 'unimed', 'notredame', 'interodonto'], faq: 'convenio' },
      { keys: ['desconto', 'mais barato', 'cobre orcamento', 'promocao', 'descontinho'], response: {
        answer: "Os valores da Dra. Erika refletem a altíssima qualidade dos materiais que ela usa (resinas nobres, importadas) e o tempo exclusivo dedicado a você (nada de atendimento com pressa).\\n\\nMas chama no WhatsApp! A equipe sempre busca a melhor forma de parcelamento para caber no seu bolso.",
        waMessage: "Oi Dra. Erika! Queria ver um orçamento e formas de pagamento."
      }},

      // ==========================================
      // 5. SMALL TALK, BRINCADEIRAS, GÍRIAS E ELOGIOS
      // ==========================================
      { keys: ['tlgd', 'pdp', 'pdc', 'fmz', 'blz', 'vlw', 'obg', 'slc', 'slk', 'daora', 'maneiro', 'top', 'brabo', 'irado', 'pode pa', 'suave', 'tranquilo', 'obrigado', 'valeu', 'obrigada'], response: {
        answer: "Beleza! 😎 Qualquer dúvida sobre os tratamentos ou se quiser colar aqui no consultório, é só chamar no WhatsApp que a gente desenrola!",
        waMessage: "Opa, salve! Gostaria de agendar ou tirar uma dúvida."
      }},
      { keys: ['sla', 'sei la', 'nao sei', 'to em duvida', 'to perdido', 'qualquer coisa', 'boiei'], response: {
        answer: "Fica tranquilo(a)! Normal ficar na dúvida com tanta informação odontológica. 😅\\n\\nO melhor caminho é mandar uma mensagem no WhatsApp contando o que te incomoda, que a Dra. Erika te dá a direção certa.",
        waMessage: "Oi Dra. Erika! Tô meio em dúvida sobre o que eu preciso, pode me ajudar?"
      }},
      { keys: ['q', 'que', 'como assim', 'nao entendi', 'hahn', 'hein', 'que isso', 'wat', 'wtf'], response: {
        answer: "Ficou confuso? Relaxa, às vezes eu como robô explico meio mal rs.\\n\\nClica no botão aí embaixo e fala direto no WhatsApp com a Dra. Erika que ela te explica direitinho com áudio!",
        waMessage: "Oi Dra. Erika! Fiquei com uma dúvida conversando com o robô do site."
      }},
      { keys: ['te amo', 'casar', 'gata', 'linda', 'namorar', 'solteira', 'passa o numero', 'zap'], response: {
        answer: "Opa, muito obrigada pelo carinho! Hahaha ❤️\\n\\nMas meu coração já é do consultório da Dra. Erika! Brincadeiras à parte, se precisar marcar uma avaliação, tô aqui!",
        waMessage: "Oi! Gostaria de falar com a clínica."
      }},
      { keys: ['burro', 'burra', 'inutil', 'odeio', 'chato', 'merda', 'lixo', 'porcaria', 'droga', 'foda', 'puta', 'vsf', 'vtnc'], response: {
        answer: "Poxa, desculpa se não consegui ajudar como você queria! 😔 Sou só uma assistente virtual aprendendo.\\n\\nClica abaixo pra falar com um ser humano real no WhatsApp, eles com certeza vão resolver seu problema sem stress!",
        waMessage: "Oi! Tive um probleminha com o chat do site e queria falar com alguém."
      }},
      { keys: ['você é chatgpt', 'você é uma ia', 'chat gpt', 'gemini', 'inteligencia artificial', 'robo', 'bot', 'robotic', 'maquina'], response: {
        answer: "Quase isso! 🤖 Sou uma inteligência treinada exclusivamente com tudo sobre o consultório da Dra. Erika.\\n\\nSei horários, preços, sobre resina, lente, canal... Mas não sei fazer piada igual humano (ainda!).",
        waMessage: "Oi! Gostaria de tirar algumas dúvidas com uma pessoa real."
      }},
      { keys: ['site lindo', 'site bonito', 'gostei do site', 'parabens', 'arrasou', 'perfeito', 'mt bom', 'muito bom', 'amei'], response: {
        answer: "Aaah, que legal que você gostou! 🥰 Foi feito com muito carinho pra transmitir exatamente o clima do consultório da Dra. Erika.\\n\\nAproveita e agenda uma visita pra ver de perto!",
        waMessage: "Oi! Gostei muito do site de vocês e queria agendar."
      }},
      { keys: ['sim', 'quero', 'isso', 'exatamente', 'pode ser', 'vamos', 'bora', 'fechou'], response: {
        answer: "Maravilha! Então clica aqui no botão de WhatsApp abaixo e fala direto com a gente. Já deixa sua mensagem engatilhada!",
        waMessage: "Oi Dra. Erika! Estava falando com o robô no site e quero dar andamento."
      }},
      { keys: ['nao', 'agora nao', 'depois', 'obrigado nao', 'nada'], response: {
        answer: "Sem problemas! Estarei por aqui 24 horas por dia. Quando precisar de cuidar do sorriso, é só voltar. Um abraço! 👋",
        waMessage: "Oi!"
      }},
      { keys: ['teste', 'testando', '123', 'som'], response: {
        answer: "Som, som... 1, 2, 3! 🎤 Tudo funcionando perfeitamente por aqui! E aí, qual a sua dúvida sobre o consultório?",
        waMessage: "Oi! Gostaria de falar com o consultório."
      }},
      
      // ==========================================
      // 6. GREETINGS (Prioridade Mais Baixa)
      // ==========================================
      { keys: ['salve', 'fala tu', 'fala ai', 'eai', 'fala doutora', 'e ai', 'oie', 'oii', 'oiie', 'hello', 'hi', 'koe', 'coeh'], response: {
        answer: "Opa, tudo bem? 👋\\n\\nAqui é a assistente virtual! Pode mandar sua dúvida ou pedir pra agendar que eu te dou o caminho das pedras.",
        waMessage: "Oi! Gostaria de falar com o consultório."
      }},
      { keys: ['bom dia', 'boa tarde', 'boa noite', 'tudo bem', 'tudo joia', 'tudo otimo', 'tudo certo', 'como vc ta', 'joia'], response: {
        answer: "Tudo ótimo por aqui! 😊\\n\\nComo posso facilitar sua vida hoje? Se quiser agendar, saber onde fica ou ver sobre lente e resina, pode perguntar!",
        waMessage: "Oi! Gostaria de falar com o consultório."
      }},
      { keys: ['oi', 'ola', 'olaa'], response: {
        answer: "Oi! Tudo ótimo por aqui. 😊\\n\\nComo posso te ajudar hoje? Pode me perguntar sobre horários, tratamentos, valores ou pedir para agendar uma consulta.",
        waMessage: "Oi! Gostaria de falar com o consultório."
      }},
      { keys: ['tchau', 'adeus', 'ate logo', 'fui', 'ate mais', 'xau'], response: {
        answer: "Até mais! Um ótimo dia pra você. Quando precisar do consultório, estaremos por aqui. 👋",
        waMessage: "Oi! Gostaria de falar com o consultório."
      }}
    ];

    for (const pattern of patterns) {
      for (const key of pattern.keys) {
        // Usa Expressão Regular com Borda de Palavra (\\b) para evitar matching de pedaços de palavras!
        // Ex: "quero agendar" tem "q", mas com \\bq\\b não vai mais bugar!
        const regex = new RegExp(`\\\\b${key}\\\\b`, 'i');
        if (regex.test(lower)) {
          if (pattern.faq) {
            return { type: 'faq', key: pattern.faq };
          } else {
            return { type: 'custom', data: pattern.response };
          }
        }
      }
    }

    return { type: 'fallback' };
  };

"""

content = content.replace(old_detect_intent, new_detect_intent)

with open('/home/hiago/Área de trabalho/dentista/script.js', 'w', encoding='utf-8') as f:
    f.write(content)
