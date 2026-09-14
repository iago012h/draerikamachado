import re

with open('/home/hiago/Área de trabalho/dentista/script.js', 'r', encoding='utf-8') as f:
    content = f.read()

# I will replace the detectIntent function entirely
old_detect_intent = content[content.find("  const detectIntent = (text) => {"):content.find("  // Formulário de pergunta livre")]

new_detect_intent = """  const detectIntent = (text) => {
    const rawLower = text.toLowerCase();
    const lower = rawLower.normalize('NFD').replace(/[\\u0300-\\u036f]/g, '');

    // 0. CAPTURA DE NOME (Ex: "meu nome e Joao", "eu sou a Maria", "chamo Pedro")
    const nameMatch = lower.match(/(?:meu nome e|chamo|sou o|sou a|aqui e o|aqui e a|falo com o|falo com a) ([a-z]+)/);
    if (nameMatch) {
      const name = nameMatch[1];
      const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
      return { type: 'custom', data: {
        answer: `Prazer em te conhecer, ${capitalized}! 😊\\n\\nEu sou a assistente virtual aqui da Dra. Erika. O que você manda hoje? Queria agendar, ver valores ou tirar dúvida de algum procedimento?`,
        waMessage: `Oi Dra. Erika! Meu nome é ${capitalized} e queria uma informação.`
      }};
    }

    // Mapeamento de palavras-chave para respostas
    const patterns = [
      // 1. ABREVIAÇÕES & GÍRIAS (SLANGS)
      { keys: ['tlgd', 'pdp', 'pdc', 'fmz', 'blz', 'vlw', 'obg', 'slc', 'slk', 'daora', 'maneiro', 'top', 'brabo', 'irado'], response: {
        answer: "Hahaha, beleza! 😎 Qualquer dúvida sobre os tratamentos ou se quiser colar aqui no consultório, é só chamar no WhatsApp que a gente desenrola!",
        waMessage: "Opa, salve! Gostaria de agendar ou tirar uma dúvida."
      }},
      { keys: ['sla', 'sei la', 'nao sei', 'to em duvida', 'to perdido'], response: {
        answer: "Fica tranquilo(a)! Normal ficar na dúvida com tanta informação odontológica. 😅\\n\\nO melhor caminho é mandar uma mensagem no WhatsApp contando o que te incomoda, que a Dra. Erika te dá a direção certa.",
        waMessage: "Oi Dra. Erika! Tô meio em dúvida sobre o que eu preciso, pode me ajudar?"
      }},
      { keys: ['q', 'que', 'como assim', 'nao entendi', 'hahn', 'hein'], response: {
        answer: "Ficou confuso? Relaxa, às vezes eu como robô explico meio mal rs.\\n\\nClica no botão aí embaixo e fala direto no WhatsApp com a Dra. Erika que ela te explica direitinho com áudio!",
        waMessage: "Oi Dra. Erika! Fiquei com uma dúvida conversando com o robô do site."
      }},
      
      // 2. GREETINGS (EXPANDED WITH INFORMAL)
      { keys: ['salve', 'fala tu', 'fala ai', 'eai', 'fala doutora', 'e ai', 'oie', 'oii', 'oiie', 'hello', 'hi'], response: {
        answer: "Opa, tudo bem? 👋\\n\\nAqui é a assistente virtual! Pode mandar sua dúvida ou pedir pra agendar que eu te dou o caminho das pedras.",
        waMessage: "Oi! Gostaria de falar com o consultório."
      }},
      { keys: ['bom dia', 'boa tarde', 'boa noite', 'tudo bem', 'tudo joia', 'tudo otimo', 'tudo certo'], response: {
        answer: "Tudo ótimo por aqui! 😊\\n\\nComo posso facilitar sua vida hoje? Se quiser agendar, saber onde fica ou ver sobre lente e resina, pode perguntar!",
        waMessage: "Oi! Gostaria de falar com o consultório."
      }},

      // 3. IDENTIDADE E BRINCADEIRAS
      { keys: ['te amo', 'casar', 'gata', 'linda', 'namorar'], response: {
        answer: "Opa, muito obrigada pelo carinho! Hahaha ❤️\\n\\nMas meu coração já é do consultório da Dra. Erika! Brincadeiras à parte, se precisar marcar uma avaliação, tô aqui!",
        waMessage: "Oi! Gostaria de falar com a clínica."
      }},
      { keys: ['burro', 'burra', 'inutil', 'odeio', 'chato', 'merda', 'lixo'], response: {
        answer: "Poxa, desculpa se não consegui ajudar como você queria! 😔 Sou só uma assistente virtual aprendendo.\\n\\nClica abaixo pra falar com um ser humano real no WhatsApp, eles com certeza vão resolver seu problema!",
        waMessage: "Oi! Tive um probleminha com o chat do site e queria falar com alguém."
      }},
      { keys: ['você é chatgpt', 'você é uma ia', 'chat gpt', 'gemini', 'inteligencia artificial', 'robo'], response: {
        answer: "Quase isso! 🤖 Sou uma inteligência treinada exclusivamente com tudo sobre o consultório da Dra. Erika.\\n\\nSei horários, preços, sobre resina, lente, canal... Mas não sei fazer piada igual humano (ainda!).",
        waMessage: "Oi! Gostaria de tirar algumas dúvidas reais."
      }},

      // 4. ELOGIOS
      { keys: ['site lindo', 'site bonito', 'gostei do site', 'parabens', 'arrasou', 'perfeito'], response: {
        answer: "Aaah, que legal que você gostou! 🥰 Foi feito com muito carinho pra transmitir exatamente o clima do consultório da Dra. Erika.\\n\\nAproveita e agenda uma visita pra ver de perto!",
        waMessage: "Oi! Gostei muito do site de vocês e queria agendar."
      }},

      // AGENDAMENTO, CUSTOS, LOCAL E URGÊNCIA (Mantidos)
      { keys: ['agendar', 'marcar', 'consulta', 'agenda', 'horario', 'vaga', 'queria ir', 'marcar um', 'reservar', 'agendamento', 'agende', 'ir ai', 'passar com ela', 'ver a dra'], faq: 'agendar' },
      { keys: ['convenio', 'plano', 'aceita', 'pagamento', 'parcela', 'cartao', 'preco', 'valor', 'custa', 'quanto', 'orcamento', 'caro', 'barato', 'divide', 'pix', 'dinheiro', 'boleto', 'amil', 'bradesco', 'sulamerica', 'odontoprev', 'unimed'], faq: 'convenio' },
      { keys: ['onde', 'endereco', 'shopping', 'localiza', 'como chego', 'mapa', 'fica', 'rua', 'bairro', 'cidade', 'gps', 'waze', 'maps'], faq: 'local' },
      { keys: ['dor', 'doi', 'doendo', 'inchado', 'inflamado', 'urgencia', 'emergencia', 'sangue', 'sangrando', 'pus', 'socorro', 'muita dor', 'caiu', 'soltou', 'provisorio', 'urgente'], faq: 'dor' },

      // CLINICAL MASSIVE LIBRARY (Mantidos e Refinados)
      { keys: ['gengiva', 'sangra', 'limpeza', 'tartaro', 'profilaxia', 'halito', 'fedor', 'cheiro', 'fluor', 'boca amarga', 'boca seca', 'sangrando na escovacao'], response: {
        answer: "A Dra. Erika faz a profilaxia clínica (limpeza completa) detalhada, ideal pra tirar o tártaro e evitar doenças na gengiva, mau hálito e cáries.\\n\\nO ideal é fazer de 6 em 6 meses! Quer agendar a sua?",
        waMessage: "Oi Dra. Erika! Quero agendar uma limpeza/avaliação."
      }},
      { keys: ['diastema', 'espaco', 'separado', 'espaco entre', 'dente separado', 'abertura', 'vazado', 'fresta', 'vaozinho'], faq: 'diastema' },
      { keys: ['clareamento', 'clarear', 'branco', 'amarelo', 'branquear', 'dente escuro', 'mancha', 'cafe', 'cigarro', 'dente sujo'], faq: 'clareamento' },
      { keys: ['restaura', 'obtura', 'carie', 'quebrou', 'fratur', 'resina', 'trinca', 'furado', 'buraco', 'pedaco', 'bati o dente', 'lascou'], response: {
        answer: "Cáries, dentes trincados, buracos ou fraturas são resolvidos com restaurações estéticas! A Dra. Erika é Mestra nisso — ela usa resinas que ficam iguaizinhas ao dente original.\\n\\nManda mensagem e envia uma foto pra ela ver!",
        waMessage: "Oi Dra. Erika! Preciso avaliar uma restauração ou dente quebrado."
      }},
      { keys: ['lente', 'faceta', 'porcelana', 'ceramica', 'transformar o sorriso', 'sorriso novo', 'dente de artista', 'aqueles brancos'], faq: 'lentes' },
      { keys: ['protese', 'dentadura', 'ponte', 'coroa', 'perdi dente', 'falta dente', 'chumbo', 'cinza', 'preta', 'pivô', 'roach', 'jaqueta'], faq: 'protese' },
      { keys: ['implante', 'parafuso', 'pino', 'raiz artificial', 'arranquei e quero colocar'], faq: 'implante' },
      { keys: ['canal', 'endodont', 'nervo', 'polpa', 'matar o nervo', 'tratamento de canal', 'raio x acusou'], faq: 'canal' },
      { keys: ['extrac', 'arrancar', 'tirar dente', 'siso', 'ciso', 'juizo', 'dente do siso', 'cirurgia', 'nao tem jeito'], response: {
        answer: "Para extrações simples, a Dra. Erika faz no consultório. Para dentes do siso inclusos ou cirurgias mais brutas, ela tem um cirurgião top de parceiro.\\n\\nManda uma mensagem no Whats pra gente agilizar isso!",
        waMessage: "Oi Dra. Erika! Preciso tirar uma dúvida sobre extração/siso."
      }},
      { keys: ['ortodont', 'aparelho', 'alinhar', 'torto', 'invisalign', 'alinhador', 'transparente', 'ferro', 'borrachinha', 'meu dente e torto'], response: {
        answer: "Seus dentes estão tortos? A Dra. Erika não mexe com aparelho, mas ela tem parceiros excelentes pra indicar.\\n\\nClica abaixo e manda uma mensagem pra ela te passar o contato!",
        waMessage: "Oi Dra. Erika! Gostaria de indicações ou saber sobre aparelho."
      }},
      { keys: ['bruxismo', 'ranger', 'apertar', 'placa', 'mordida', 'atm', 'estalo', 'dor de cabeca', 'maxilar', 'acordo com dor', 'ranjendo'], response: {
        answer: "Acorda com dor no maxilar ou estalando? Pode ser bruxismo! A Dra. Erika avalia sua mordida e faz aquela plaquinha de acrílico sob medida pra você dormir sossegado.\\n\\nVamos agendar uma avaliação?",
        waMessage: "Oi Dra. Erika! Acho que tenho bruxismo e preciso avaliar uma placa."
      }},
      { keys: ['primeira', 'avaliacao', 'como e a consulta', 'primeira vez', 'conhecer', 'como funciona'], faq: 'primeira' }
    ];

    for (const pattern of patterns) {
      for (const key of pattern.keys) {
        if (lower.includes(key)) {
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
