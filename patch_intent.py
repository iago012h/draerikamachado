import re

with open('/home/hiago/Área de trabalho/dentista/script.js', 'r', encoding='utf-8') as f:
    content = f.read()

old_patterns_start = "const patterns = ["
old_patterns_end = "return { type: 'fallback' };"
old_block = content[content.find(old_patterns_start):content.find(old_patterns_end)]

new_block = """const patterns = [
      // 1. GREETINGS & SMALL TALK
      { keys: ['oi', 'ola', 'bom dia', 'boa tarde', 'boa noite', 'tudo bem', 'opa', 'alo', 'ei', 'oii', 'oie'], response: {
        answer: "Oi! Tudo ótimo por aqui. 😊\\n\\nComo posso te ajudar hoje? Pode me perguntar sobre horários, tratamentos, valores ou pedir para agendar uma consulta.",
        waMessage: "Oi! Gostaria de falar com o consultório."
      }},
      { keys: ['obrigado', 'obrigada', 'valeu', 'agradeco', 'perfeito', 'otimo', 'joia', 'ok', 'entendi', 'show', 'beleza', 'legal'], response: {
        answer: "Por nada! Se precisar de mais alguma coisa, é só chamar aqui ou no botão do WhatsApp logo abaixo. 🥰",
        waMessage: "Oi! Gostaria de falar com o consultório."
      }},
      { keys: ['tchau', 'adeus', 'ate logo', 'fui', 'ate mais', 'xau'], response: {
        answer: "Até mais! Um ótimo dia pra você. Quando precisar do consultório, estaremos por aqui. 👋",
        waMessage: "Oi! Gostaria de falar com o consultório."
      }},
      { keys: ['rs', 'kkk', 'haha', 'legal'], response: {
        answer: "😄 Pode mandar sua dúvida ou pedir para agendar que eu te ajudo!",
        waMessage: "Oi! Gostaria de falar com o consultório."
      }},
      { keys: ['quem e voce', 'voce e um robo', 'robo', 'ia', 'assistente'], response: {
        answer: "Eu sou a assistente virtual do consultório! Fui programada pra te dar respostas rápidas sobre a clínica.\\n\\nMas se você clicar no botão do WhatsApp, vai falar com humanos de verdade lá na recepção! 😉",
        waMessage: "Oi! Gostaria de tirar algumas dúvidas."
      }},
      { keys: ['nome dela', 'quem e a doutora', 'quem e erika'], response: {
        answer: "A Dra. Erika Machado é cirurgiã-dentista (CROSP 115717) e Mestra em Odontologia Restauradora. Ela foca muito em salvar o máximo da estrutura do seu dente e em estética com resinas e cerâmicas.",
        waMessage: "Oi! Gostaria de saber mais sobre a Dra. Erika."
      }},

      // 2. SCHEDULING / AGENDAMENTO AMPLIADO
      { keys: ['agendar', 'marcar', 'consulta', 'agenda', 'horario', 'vaga', 'queria ir', 'marcar um dia', 'ver um dia', 'reservar', 'agendamento', 'agende', 'ir ai', 'passar com ela', 'ver a dra'], faq: 'agendar' },

      // 3. COSTS / FINANCEIRO AMPLIADO
      { keys: ['convenio', 'plano', 'aceita', 'pagamento', 'parcela', 'cartao', 'preco', 'valor', 'custa', 'quanto', 'orcamento', 'caro', 'barato', 'divide', 'pix', 'dinheiro', 'boleto', 'amil', 'bradesco', 'sulamerica', 'odontoprev', 'unimed'], faq: 'convenio' },

      // 4. LOCATIONS / LOCALIZAÇÃO AMPLIADO
      { keys: ['onde', 'endereco', 'shopping', 'localiza', 'como chego', 'mapa', 'fica', 'rua', 'bairro', 'cidade', 'gps', 'waze', 'maps'], faq: 'local' },

      // 5. EMERGENCIES / URGÊNCIA AMPLIADO
      { keys: ['dor', 'doi', 'doendo', 'inchado', 'inflamado', 'urgencia', 'emergencia', 'sangue', 'sangrando', 'pus', 'socorro', 'muita dor', 'caiu', 'soltou', 'provisorio', 'urgente'], faq: 'dor' },

      // 6. CLINICAL PROCEDURES - MASSIVE LIBRARY
      // Profilaxia / Gengiva
      { keys: ['gengiva', 'sangra', 'limpeza', 'tartaro', 'profilaxia', 'halito', 'fedor', 'cheiro', 'fluor', 'boca amarga', 'boca seca'], response: {
        answer: "A Dra. Erika faz a profilaxia clínica (limpeza completa) detalhada, ideal pra tirar o tártaro e evitar doenças na gengiva, mau hálito e cáries.\\n\\nO ideal é fazer de 6 em 6 meses! Quer agendar a sua?",
        waMessage: "Oi Dra. Erika! Quero agendar uma limpeza/avaliação."
      }},
      // Diastema / Resina / Estética Direta
      { keys: ['diastema', 'espaco', 'separado', 'espaco entre', 'dente separado', 'abertura', 'vazado', 'fresta'], faq: 'diastema' },
      // Clareamento
      { keys: ['clareamento', 'clarear', 'branco', 'amarelo', 'branquear', 'dente escuro', 'mancha', 'cafe', 'cigarro'], faq: 'clareamento' },
      // Restauração / Cárie
      { keys: ['restaura', 'obtura', 'carie', 'quebrou', 'fratur', 'resina', 'trinca', 'furado', 'buraco', 'pedaco'], response: {
        answer: "Cáries, dentes trincados ou fraturados são resolvidos com restaurações estéticas! A Dra. Erika é Mestra nisso — ela usa resinas de altíssima qualidade pra deixar o dente igualzinho ao natural, tanto na cor quanto no formato.\\n\\nManda uma mensagem no Whats pra agendar uma avaliação!",
        waMessage: "Oi Dra. Erika! Preciso avaliar uma restauração."
      }},
      // Lentes / Facetas
      { keys: ['lente', 'faceta', 'porcelana', 'ceramica', 'transformar o sorriso', 'sorriso novo'], faq: 'lentes' },
      // Prótese (Fixa, Coroa) / Implante
      { keys: ['protese', 'dentadura', 'ponte', 'coroa', 'perdi dente', 'falta dente', 'chumbo', 'cinza', 'preta'], faq: 'protese' },
      { keys: ['implante', 'parafuso', 'pino', 'raiz artificial'], faq: 'implante' },
      // Canal
      { keys: ['canal', 'endodont', 'nervo', 'polpa', 'matar o nervo', 'tratamento de canal'], faq: 'canal' },
      // Cirurgia / Extração
      { keys: ['extrac', 'arrancar', 'tirar dente', 'siso', 'ciso', 'juizo', 'dente do siso', 'cirurgia'], response: {
        answer: "Para extrações simples, a Dra. Erika faz no consultório. Para dentes do siso inclusos ou cirurgias complexas, ela tem um cirurgião parceiro de altíssima confiança pra realizar o procedimento.\\n\\nManda uma foto no Whats pra ela dar uma olhada e te orientar!",
        waMessage: "Oi Dra. Erika! Preciso tirar uma dúvida sobre extração/siso."
      }},
      // Ortodontia / Aparelho
      { keys: ['ortodont', 'aparelho', 'alinhar', 'torto', 'invisalign', 'alinhador', 'transparente', 'ferro', 'borrachinha'], response: {
        answer: "Seus dentes estão tortos ou desalinhados? A Dra. Erika não coloca aparelho (ortodontia não é o foco dela), mas ela pode te examinar e encaminhar pros melhores especialistas parceiros dela.\\n\\nClica abaixo e manda uma mensagem pra gente!",
        waMessage: "Oi Dra. Erika! Gostaria de indicações ou saber sobre aparelho."
      }},
      // Bruxismo
      { keys: ['bruxismo', 'ranger', 'apertar', 'placa', 'mordida', 'atm', 'estalo', 'dor de cabeca', 'maxilar', 'acordo com dor'], response: {
        answer: "Acorda com dor ou com os dentes cansados? Pode ser bruxismo! A Dra. Erika faz uma avaliação da sua mordida e pode confeccionar uma placa de acrílico sob medida para proteger seus dentes durante o sono.\\n\\nÉ super importante tratar isso pra não desgastar os dentes. Vamos agendar?",
        waMessage: "Oi Dra. Erika! Acho que tenho bruxismo e preciso avaliar uma placa."
      }},
      { keys: ['primeira', 'avaliacao', 'como e a consulta', 'primeira vez', 'conhecer'], faq: 'primeira' }
    ];

    for (const pattern of patterns) {
      for (const key of pattern.keys) {
        // Usa regex pra checar se a palavra inteira ou substring existe, mas lidando com espaços
        if (lower.includes(key)) {
          if (pattern.faq) {
            return { type: 'faq', key: pattern.faq };
          } else {
            return { type: 'custom', data: pattern.response };
          }
        }
      }
    }

    """

content = content.replace(old_block, new_block)

with open('/home/hiago/Área de trabalho/dentista/script.js', 'w', encoding='utf-8') as f:
    f.write(content)
