/**
 * DRA. ERIKA MACHADO — CROSP 115717
 * Interatividade, Status em Tempo Real e Assistente Virtual
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const CLINIC_INFO = {
    whatsappUrl: 'https://wa.me/message/VBLJFW3FEOGOK1',
    phone: '(12) 99684-1633',
    city: 'São José dos Campos - SP',
    address: 'Shopping Centro, Rua Rubião Júnior, 84, Sala 57 (2º andar)'
  };

  /* ---------- 1. Menu Mobile ---------- */
  const menuToggle = document.getElementById('menu-toggle');
  const siteNav = document.getElementById('site-nav');

  if (menuToggle && siteNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = siteNav.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', isOpen);
    });
    siteNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        siteNav.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- 2. Status Horários ---------- */
  const initClinicStatus = () => {
    const statusBadge = document.getElementById('clinic-status-badge');
    const scheduleRows = document.querySelectorAll('.schedule-table-editorial tr[data-day], .schedule-table tr[data-day]');
    if (!statusBadge) return;

    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const currentTime = hour + minute / 60;

    scheduleRows.forEach(row => {
      const rowDay = parseInt(row.getAttribute('data-day'), 10);
      row.classList.toggle('today-row', rowDay === day);
    });

    let isOpen = false;
    let closingHour = '';

    if (day >= 1 && day <= 5 && currentTime >= 9 && currentTime < 18) {
      isOpen = true;
      closingHour = '18:00';
    } else if (day === 6 && currentTime >= 9 && currentTime < 13) {
      isOpen = true;
      closingHour = '13:00';
    }

    if (isOpen) {
      statusBadge.className = 'status-live-badge open';
      statusBadge.innerHTML = `<span class="status-live-dot"></span> Atendendo agora · até ${closingHour}`;
    } else {
      statusBadge.className = 'status-live-badge closed';
      statusBadge.innerHTML = `<span class="status-live-dot"></span> Fechado agora`;
    }
  };

  initClinicStatus();

  /* ---------- 3. Assistente Virtual / Chat ---------- */
  const conciergeTrigger = document.getElementById('concierge-trigger');
  const conciergeModal = document.getElementById('concierge-modal');
  const conciergeClose = document.getElementById('concierge-close');
  const conciergeStream = document.getElementById('concierge-stream');
  const conciergeForm = document.getElementById('concierge-form');
  const conciergeInput = document.getElementById('concierge-input');

  // Base de conhecimento expandida
  const CLINIC_FAQ = {
    diastema: {
      question: "Tem como fechar o espaço entre os dentes?",
      answer: "Sim! O fechamento de diastema é um dos procedimentos mais procurados aqui no consultório. A Dra. Erika faz com resina composta direta, em sessão única, sem desgastar o dente. O resultado fica bem natural.\n\nSe quiser, manda uma foto pelo WhatsApp que a Dra. Erika já te dá uma orientação inicial.",
      waMessage: "Oi Dra. Erika! Queria saber sobre fechamento de diastema."
    },
    clareamento: {
      question: "Como funciona o clareamento?",
      answer: "A Dra. Erika trabalha com clareamento no consultório e também com moldeira para casa, depende de cada caso. O protocolo é bem controlado pra não dar sensibilidade.\n\nO resultado costuma ser visível já nas primeiras sessões. Quer agendar uma avaliação?",
      waMessage: "Oi Dra. Erika! Gostaria de saber sobre clareamento dental."
    },
    protese: {
      question: "Preciso de uma prótese, como funciona?",
      answer: "A Dra. Erika trabalha com próteses fixas, removíveis e também faz reabilitações sobre implantes. Cada caso é diferente — ela avalia a situação toda antes de indicar o melhor caminho.\n\nPode mandar sua dúvida pelo WhatsApp que ela te explica direitinho.",
      waMessage: "Oi Dra. Erika! Preciso avaliar uma prótese dentária."
    },
    horarios: {
      question: "Que horas vocês atendem?",
      answer: "O consultório funciona assim:\n\n• Segunda a sexta: 9h às 18h\n• Sábado: 9h às 13h\n• Domingo: fechado\n\nTodas as consultas são com hora marcada, então não tem espera. É só agendar pelo WhatsApp!",
      waMessage: "Oi! Queria ver os horários disponíveis pra uma consulta."
    },
    local: {
      question: "Onde fica o consultório?",
      answer: "Fica no Shopping Centro, aqui no centro de São José dos Campos:\n\n📍 Rua Rubião Júnior, 84 — Sala 57 (2º andar)\n\nTem estacionamento coberto e elevador. É bem fácil de achar!",
      waMessage: "Oi! Queria confirmar a localização do consultório."
    },
    agendar: {
      question: "Quero agendar uma consulta",
      answer: "Ótimo! É só clicar no botão abaixo pra falar direto com o consultório pelo WhatsApp. A gente responde rápido e encontra o melhor horário pra você. 😊",
      waMessage: "Oi Dra. Erika! Gostaria de agendar uma consulta."
    },
    lentes: {
      question: "A Dra. faz lentes de contato dental?",
      answer: "Sim, a Dra. Erika faz lentes de contato e facetas em porcelana. Mas ela é bem criteriosa com a indicação — só recomenda quando realmente faz sentido pro caso.\n\nSe o resultado puder ser alcançado com resina (sem desgastar o dente), ela vai te explicar essa opção também. O importante é você entender todas as possibilidades antes de decidir.",
      waMessage: "Oi Dra. Erika! Gostaria de saber sobre lentes de contato dental."
    },
    canal: {
      question: "A Dra. faz tratamento de canal?",
      answer: "O tratamento de canal (endodontia) não é a especialidade principal da Dra. Erika, mas ela avalia cada caso. Dependendo da complexidade, ela pode realizar o procedimento ou encaminhar para um(a) endodontista de confiança que trabalha em parceria.\n\nPode entrar em contato pelo WhatsApp que ela te orienta!",
      waMessage: "Oi Dra. Erika! Preciso avaliar um tratamento de canal."
    },
    implante: {
      question: "A Dra. trabalha com implante?",
      answer: "A cirurgia de implante em si é feita por um cirurgião parceiro do consultório. A Dra. Erika cuida da parte protética — que é a coroa, a estrutura que vai em cima do implante, pra ficar bonito e funcional.\n\nSe você precisa de implante, ela pode avaliar o caso todo e coordenar o tratamento. Fala com ela pelo WhatsApp!",
      waMessage: "Oi Dra. Erika! Gostaria de saber sobre implantes."
    },
    convenio: {
      question: "Aceita convênio?",
      answer: "Atualmente o consultório trabalha com atendimento particular. Mas a Dra. Erika pode te passar um orçamento detalhado e combinar a melhor forma de pagamento.\n\nManda mensagem pelo WhatsApp que ela te explica tudo, sem compromisso.",
      waMessage: "Oi Dra. Erika! Queria saber sobre formas de pagamento."
    },
    dor: {
      question: "Estou com dor de dente",
      answer: "Se você está com dor, o ideal é procurar atendimento o mais rápido possível. Entre em contato pelo WhatsApp e explique a situação — a equipe vai tentar encaixar um horário de urgência pra você.\n\n⚠️ Se a dor for muito intensa ou com inchaço, procure um pronto-atendimento odontológico.",
      waMessage: "Oi Dra. Erika! Estou com dor de dente e preciso de atendimento."
    },
    primeira: {
      question: "Como é a primeira consulta?",
      answer: "Na primeira consulta a Dra. Erika faz uma avaliação completa: examina tudo com calma, tira fotos se necessário, conversa sobre o que te incomoda e explica cada opção de tratamento.\n\nNão tem pegadinha — ela é bem transparente com tudo. A consulta dura em torno de 40 a 60 minutos porque é um paciente por horário.",
      waMessage: "Oi Dra. Erika! Gostaria de agendar uma primeira consulta."
    }
  };

  // Abrir / Fechar
  if (conciergeTrigger && conciergeModal) {
    conciergeTrigger.addEventListener('click', () => {
      conciergeModal.classList.toggle('is-open');
      if (conciergeModal.classList.contains('is-open')) {
        document.body.classList.add('modal-open');
        document.documentElement.classList.add('modal-open');
        conciergeInput?.focus();
      } else {
        document.body.classList.remove('modal-open');
        document.documentElement.classList.remove('modal-open');
      }
    });
    conciergeClose?.addEventListener('click', () => {
      conciergeModal.classList.remove('is-open');
      document.body.classList.remove('modal-open');
        document.documentElement.classList.remove('modal-open');
    });
  }

  // Renderizar mensagem
  const appendChatMessage = (sender, messageText, actionWa = null) => {
    if (!conciergeStream) return;

    const row = document.createElement('div');
    row.className = `chat-bubble-item ${sender}`;

    // Converte \n em <br> para formatação
    const formattedText = messageText.replace(/\n/g, '<br>');

    let buttonActionHtml = '';
    if (actionWa) {
      const waLink = `${CLINIC_INFO.whatsappUrl}?text=${encodeURIComponent(actionWa.text)}`;
      buttonActionHtml = `
        <a href="${waLink}" target="_blank" rel="noopener" class="chat-direct-wa-btn">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.587-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.055-1.92-.477-1.528-.63-2.511-2.18-2.587-2.281-.077-.101-.625-.833-.625-1.588 0-.755.396-1.127.536-1.282.14-.155.306-.194.408-.194.102 0 .204.001.293.006.094.005.22-.036.345.263.128.307.439 1.07.478 1.148.038.077.064.168.013.27-.051.102-.077.165-.153.254-.077.089-.161.198-.23.265-.077.075-.157.157-.067.311.089.155.397.654.851 1.059.585.521 1.078.683 1.232.76.153.076.243.064.333-.038.089-.102.383-.446.485-.599.102-.153.204-.128.344-.076.14.051.892.42 1.045.497.153.076.255.115.293.179.038.064.038.371-.106.776z"/>
          </svg>
          ${actionWa.label || 'Falar pelo WhatsApp'}
        </a>
      `;
    }

    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    row.innerHTML = `
      <div class="chat-bubble-text">
        ${formattedText}
        ${buttonActionHtml}
      </div>
      <span class="chat-bubble-time">${timeString}</span>
    `;

    conciergeStream.appendChild(row);
    conciergeStream.scrollTop = conciergeStream.scrollHeight;
  };

  // Indicador de digitando
  const showTypingIndicator = () => {
    const bubble = document.createElement('div');
    bubble.id = 'typing-indicator-box';
    bubble.className = 'chat-bubble-item bot';
    bubble.innerHTML = `
      <div class="typing-bubble-dots">
        <div class="typing-dot-unit"></div>
        <div class="typing-dot-unit"></div>
        <div class="typing-dot-unit"></div>
      </div>
    `;
    conciergeStream.appendChild(bubble);
    conciergeStream.scrollTop = conciergeStream.scrollHeight;
    return bubble;
  };

  const removeTypingIndicator = () => {
    const el = document.getElementById('typing-indicator-box');
    if (el) el.remove();
  };

  // FAQ rápida
  window.sendQuickFAQ = (key) => {
    const faq = CLINIC_FAQ[key];
    if (!faq) return;

    appendChatMessage('user', faq.question);
    showTypingIndicator();

    const delay = 400 + Math.random() * 400;
    setTimeout(() => {
      removeTypingIndicator();
      appendChatMessage('bot', faq.answer, {
        text: faq.waMessage,
        label: 'Falar com a Dra. Erika'
      });
    }, delay);
  };

  // Detecção inteligente de intenção
  const detectIntent = (text) => {
    const rawLower = text.toLowerCase();
    const lower = rawLower.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    // 0. CAPTURA DE NOME
    const nameMatch = lower.match(/(?:meu nome e|chamo|sou o|sou a|aqui e o|aqui e a|falo com o|falo com a)\s+([a-z]+)/);
    if (nameMatch) {
      const name = nameMatch[1];
      const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
      return { type: 'custom', data: {
        answer: `Prazer em te conhecer, ${capitalized}! 😊\n\nEu sou a assistente virtual da Dra. Erika. Pode me fazer qualquer pergunta sobre o consultório, tratamentos, ou se quiser agendar uma consulta. Como posso te ajudar hoje?`,
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
        answer: "Sentir choque ao beber água gelada ou comer doce pode ser desde uma retração na gengiva até uma cárie profunda chegando no nervo.\n\nNão deixa isso piorar! Agende uma avaliação pra Dra. Erika proteger esse dente antes que precise de canal.",
        waMessage: "Oi Dra. Erika! Estou com muita sensibilidade/pontadas no dente."
      }},
      { keys: ['mole', 'caindo', 'balancando'], response: {
        answer: "Dente mole em adulto é sinal de alerta máximo (pode ser problema periodontal sério ou trauma)!\n\nMande mensagem pra gente IMEDIATAMENTE no WhatsApp pra Dra. Erika avaliar e tentar salvar o seu dente.",
        waMessage: "Oi Dra. Erika! Estou com um dente mole e preciso de avaliação urgente."
      }},

      // ==========================================
      // 2. AGENDAMENTO, LOGÍSTICA E REGRAS
      // ==========================================
      { keys: ['agendar', 'marcar', 'consulta', 'agenda', 'horario', 'vaga', 'queria ir', 'marcar um', 'reservar', 'agendamento', 'agende', 'ir ai', 'passar com ela', 'ver a dra', 'fazer uma visita', 'tem horario', 'disponibilidade'], faq: 'agendar' },
      { keys: ['hoje', 'agora', 'ainda hoje', 'pra hj', 'vaga hoje', 'tem vaga hoje'], response: {
        answer: "Para vagas no mesmo dia, você precisa confirmar rapidinho no nosso WhatsApp, pois a agenda da Dra. Erika é bem concorrida e trabalhamos com 1 paciente por horário.\n\nClica abaixo e pergunta se teve alguma desistência pra hoje!",
        waMessage: "Oi Dra. Erika! Teria alguma vaga para hoje?"
      }},
      { keys: ['sabado', 'fds', 'fim de semana', 'domingo'], response: {
        answer: "Aos sábados o consultório funciona das 9h às 13h! Mas os horários de sábado costumam esgotar bem rápido.\n\nManda mensagem no Whats pra garantir o seu!",
        waMessage: "Oi Dra. Erika! Gostaria de agendar um horário para o Sábado."
      }},
      { keys: ['onde', 'endereco', 'shopping', 'localiza', 'como chego', 'mapa', 'fica', 'rua', 'bairro', 'cidade', 'gps', 'waze', 'maps', 'qual a rua', 'perto de', 'sao jose', 'sjc'], faq: 'local' },
      { keys: ['estacionamento', 'parar o carro', 'vaga de carro', 'carro', 'moto'], response: {
        answer: "Fica super tranquilo! O consultório fica dentro do Shopping Centro (SJC), então tem estacionamento coberto e seguro bem no local. É só parar e subir para a Sala 57 no 2º andar.",
        waMessage: "Oi Dra. Erika! Gostaria de agendar uma consulta."
      }},
      { keys: ['crianca', 'infantil', 'pediatria', 'odontopediatria', 'bebe', 'dente de leite', 'meu filho', 'minha filha', 'menino', 'menina'], response: {
        answer: "A especialidade da Dra. Erika é focada em adultos (Odontologia Restauradora e Estética). Para crianças (odontopediatria), ela pode te recomendar colegas excelentes!\n\nChama no Whats que ela te passa os contatos de confiança.",
        waMessage: "Oi Dra. Erika! Você atende criança ou indica algum odontopediatra?"
      }},
      { keys: ['idoso', 'velho', 'terceira idade', 'cadeirante', 'escada', 'elevador', 'acessibilidade', 'dificuldade'], response: {
        answer: "O consultório tem total acessibilidade! Ficamos no 2º andar do Shopping Centro, que conta com elevadores espaçosos, rampas e estrutura completa para cadeirantes ou pessoas com dificuldade de locomoção. Pode vir tranquilo(a)!",
        waMessage: "Oi Dra. Erika! Gostaria de agendar e saber sobre acessibilidade."
      }},
      { keys: ['medo', 'fobia', 'pavor', 'agulha', 'injecao', 'anestesia', 'trauma', 'choro', 'panico', 'ansiedade'], response: {
        answer: "Olha, você não está sozinho(a)! Muita gente tem trauma de dentista. A Dra. Erika atende exatamente pensando nisso: é um paciente por vez, num ambiente calmo, sem barulho de sala de espera cheia e com muita conversa antes de qualquer procedimento.\n\nEla tem uma mão super leve. Manda mensagem e fala que você tem medo, ela vai te acolher com o maior carinho!",
        waMessage: "Oi Dra. Erika! Queria agendar, mas tenho muito medo/trauma de dentista..."
      }},

      // ==========================================
      // 3. ESTÉTICA, PROCEDIMENTOS E DÚVIDAS ESPECÍFICAS
      // ==========================================
      { keys: ['gengiva', 'sangra na escova', 'limpeza', 'tartaro', 'profilaxia', 'halito', 'fedor', 'cheiro', 'fluor', 'boca amarga', 'boca seca', 'gengivite'], response: {
        answer: "A Dra. Erika faz a profilaxia clínica (limpeza completa) detalhada, ideal pra tirar o tártaro, limpar por baixo da gengiva e evitar mau hálito e perda óssea.\n\nO ideal é fazer de 6 em 6 meses! Quer agendar a sua?",
        waMessage: "Oi Dra. Erika! Quero agendar uma limpeza/avaliação de gengiva."
      }},
      { keys: ['diastema', 'espaco', 'separado', 'espaco entre', 'dente separado', 'abertura', 'vazado', 'fresta', 'vaozinho', 'buraco entre os dentes'], faq: 'diastema' },
      { keys: ['clareamento', 'clarear', 'branco', 'amarelo', 'branquear', 'dente escuro', 'mancha', 'cafe', 'cigarro', 'dente sujo', 'clareamento caseiro', 'clareamento a laser'], faq: 'clareamento' },
      { keys: ['restaura', 'obtura', 'carie', 'quebrou', 'fratur', 'resina', 'trinca', 'furado', 'buraco', 'pedaco', 'bati o dente', 'lascou', 'massinha', 'ponta do dente'], response: {
        answer: "Cáries, dentes trincados, lascados ou com restaurações velhas são resolvidos com Resina Estética! A Dra. Erika é Mestra nisso — ela esculpe o dente de novo, deixando idêntico ao original, e o melhor: preservando o que resta do seu dente natural.\n\nManda foto no Whats pra ela dar uma olhada!",
        waMessage: "Oi Dra. Erika! Preciso avaliar uma restauração ou dente quebrado."
      }},
      { keys: ['lente', 'faceta', 'porcelana', 'ceramica', 'transformar o sorriso', 'sorriso novo', 'dente de artista', 'aqueles brancos', 'lente de contato'], faq: 'lentes' },
      { keys: ['protese', 'dentadura', 'ponte', 'coroa', 'perdi dente', 'falta dente', 'chumbo', 'cinza', 'preta', 'pivô', 'roach', 'jaqueta', 'bloco'], faq: 'protese' },
      { keys: ['implante', 'parafuso', 'pino', 'raiz artificial', 'arranquei e quero colocar', 'implantar', 'protese sobre implante'], faq: 'implante' },
      { keys: ['canal', 'endodont', 'nervo', 'polpa', 'matar o nervo', 'tratamento de canal', 'raio x acusou'], faq: 'canal' },
      { keys: ['extrac', 'arrancar', 'tirar dente', 'siso', 'ciso', 'juizo', 'dente do siso', 'cirurgia', 'nao tem jeito', 'extrair'], response: {
        answer: "Para extrações simples, a Dra. Erika faz no consultório. Para dentes do siso inclusos, deitados, ou cirurgias complexas, ela conta com um cirurgião parceiro de altíssimo nível.\n\nManda uma mensagem no Whats com seu Raio-X se tiver!",
        waMessage: "Oi Dra. Erika! Preciso tirar uma dúvida sobre extração/siso."
      }},
      { keys: ['ortodont', 'aparelho', 'alinhar', 'torto', 'invisalign', 'alinhador', 'transparente', 'ferro', 'borrachinha', 'meu dente e torto', 'ortodontia'], response: {
        answer: "Seus dentes estão tortos? A Dra. Erika foca na parte estética de resinas e próteses, ela não coloca aparelho. MAS ela tem ortodontistas parceiros sensacionais pra indicar.\n\nClica abaixo e manda uma mensagem pra pedir os contatos!",
        waMessage: "Oi Dra. Erika! Gostaria de indicações ou saber sobre aparelho ortodôntico."
      }},
      { keys: ['bruxismo', 'ranger', 'apertar', 'placa', 'mordida', 'atm', 'estalo', 'dor de cabeca', 'maxilar', 'acordo com dor', 'ranjendo', 'desgastado', 'dente curto'], response: {
        answer: "Bruxismo destrói o sorriso com o tempo! A Dra. Erika faz uma avaliação completa do seu desgaste e confecciona uma placa miorrelaxante (de acrílico duro) sob medida para você dormir e proteger seus dentes.\n\nTambém é possível recuperar o tamanho dos dentes desgastados com resina. Vamos agendar?",
        waMessage: "Oi Dra. Erika! Acho que tenho bruxismo e preciso avaliar."
      }},
      { keys: ['botox', 'harmonizacao', 'preenchimento', 'labio', 'boca', 'bigode chines', 'papada', 'bichectomia', 'toxina', 'facial', 'rosto'], response: {
        answer: "A Dra. Erika é especialista 100% focada em Odontologia Restauradora e reabilitação dos DENTES (Lentes, Resinas, Próteses). Ela não realiza procedimentos de Harmonização Facial (Botox, preenchimento, etc).\n\nMas o sorriso ela garante que fica perfeito! Quer agendar para os dentes?",
        waMessage: "Oi Dra. Erika! Gostaria de agendar uma consulta odontológica."
      }},
      { keys: ['primeira', 'avaliacao', 'como e a consulta', 'primeira vez', 'conhecer', 'como funciona', 'nunca fui'], faq: 'primeira' },

      // ==========================================
      // 4. FINANCEIRO E CONVÊNIOS
      // ==========================================
      { keys: ['convenio', 'plano', 'aceita', 'pagamento', 'parcela', 'cartao', 'preco', 'valor', 'custa', 'quanto', 'orcamento', 'caro', 'barato', 'divide', 'pix', 'dinheiro', 'boleto', 'amil', 'bradesco', 'sulamerica', 'odontoprev', 'unimed', 'notredame', 'interodonto'], faq: 'convenio' },
      { keys: ['desconto', 'mais barato', 'cobre orcamento', 'promocao', 'descontinho'], response: {
        answer: "Os valores da Dra. Erika refletem a altíssima qualidade dos materiais que ela usa (resinas nobres, importadas) e o tempo exclusivo dedicado a você (nada de atendimento com pressa).\n\nMas chama no WhatsApp! A equipe sempre busca a melhor forma de parcelamento para caber no seu bolso.",
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
        answer: "Fica tranquilo(a)! Normal ficar na dúvida com tanta informação odontológica. 😅\n\nO melhor caminho é mandar uma mensagem no WhatsApp contando o que te incomoda, que a Dra. Erika te dá a direção certa.",
        waMessage: "Oi Dra. Erika! Tô meio em dúvida sobre o que eu preciso, pode me ajudar?"
      }},
      { keys: ['q', 'que', 'como assim', 'nao entendi', 'hahn', 'hein', 'que isso', 'wat', 'wtf'], response: {
        answer: "Ficou confuso? Relaxa, às vezes eu como robô explico meio mal rs.\n\nClica no botão aí embaixo e fala direto no WhatsApp com a Dra. Erika que ela te explica direitinho com áudio!",
        waMessage: "Oi Dra. Erika! Fiquei com uma dúvida conversando com o robô do site."
      }},
      { keys: ['te amo', 'casar', 'gata', 'linda', 'namorar', 'solteira', 'passa o numero', 'zap'], response: {
        answer: "Opa, muito obrigada pelo carinho! Hahaha ❤️\n\nMas meu coração já é do consultório da Dra. Erika! Brincadeiras à parte, se precisar marcar uma avaliação, tô aqui!",
        waMessage: "Oi! Gostaria de falar com a clínica."
      }},
      { keys: ['burro', 'burra', 'inutil', 'odeio', 'chato', 'merda', 'lixo', 'porcaria', 'droga', 'foda', 'puta', 'vsf', 'vtnc'], response: {
        answer: "Poxa, desculpa se não consegui ajudar como você queria! 😔 Sou só uma assistente virtual aprendendo.\n\nClica abaixo pra falar com um ser humano real no WhatsApp, eles com certeza vão resolver seu problema sem stress!",
        waMessage: "Oi! Tive um probleminha com o chat do site e queria falar com alguém."
      }},
      { keys: ['você é chatgpt', 'você é uma ia', 'chat gpt', 'gemini', 'inteligencia artificial', 'robo', 'bot', 'robotic', 'maquina'], response: {
        answer: "Quase isso! 🤖 Sou uma inteligência treinada exclusivamente com tudo sobre o consultório da Dra. Erika.\n\nSei horários, preços, sobre resina, lente, canal... Mas não sei fazer piada igual humano (ainda!).",
        waMessage: "Oi! Gostaria de tirar algumas dúvidas com uma pessoa real."
      }},
      { keys: ['site lindo', 'site bonito', 'gostei do site', 'parabens', 'arrasou', 'perfeito', 'mt bom', 'muito bom', 'amei'], response: {
        answer: "Aaah, que legal que você gostou! 🥰 Foi feito com muito carinho pra transmitir exatamente o clima do consultório da Dra. Erika.\n\nAproveita e agenda uma visita pra ver de perto!",
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
        answer: "Opa, tudo bem? 👋\n\nAqui é a assistente virtual! Pode mandar sua dúvida ou pedir pra agendar que eu te dou o caminho das pedras.",
        waMessage: "Oi! Gostaria de falar com o consultório."
      }},
      { keys: ['bom dia', 'boa tarde', 'boa noite', 'tudo bem', 'tudo joia', 'tudo otimo', 'tudo certo', 'como vc ta', 'joia'], response: {
        answer: "Tudo ótimo por aqui! 😊\n\nComo posso facilitar sua vida hoje? Se quiser agendar, saber onde fica ou ver sobre lente e resina, pode perguntar!",
        waMessage: "Oi! Gostaria de falar com o consultório."
      }},
      { keys: ['oi', 'ola', 'olaa'], response: {
        answer: "Oi! Tudo ótimo por aqui. 😊\n\nComo posso te ajudar hoje? Pode me perguntar sobre horários, tratamentos, valores ou pedir para agendar uma consulta.",
        waMessage: "Oi! Gostaria de falar com o consultório."
      }},
      { keys: ['tchau', 'adeus', 'ate logo', 'fui', 'ate mais', 'xau'], response: {
        answer: "Até mais! Um ótimo dia pra você. Quando precisar do consultório, estaremos por aqui. 👋",
        waMessage: "Oi! Gostaria de falar com o consultório."
      }}
    ];

    for (const pattern of patterns) {
      for (const key of pattern.keys) {
        // Usa Expressão Regular com Borda de Palavra (\b) para evitar matching de pedaços de palavras!
        // Ex: "quero agendar" tem "q", mas com \bq\b não vai mais bugar!
        const regex = new RegExp(`\\b${key}\\b`, 'i');
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

  // Formulário de pergunta livre
  if (conciergeForm && conciergeInput) {
    conciergeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = conciergeInput.value.trim();
      if (!text) return;

      appendChatMessage('user', text);
      conciergeInput.value = '';

      showTypingIndicator();

      const delay = 500 + Math.random() * 500;
      setTimeout(() => {
        removeTypingIndicator();

        const intent = detectIntent(text);

        if (intent.type === 'faq') {
          const faq = CLINIC_FAQ[intent.key];
          appendChatMessage('bot', faq.answer, {
            text: faq.waMessage,
            label: 'Falar com a Dra. Erika'
          });
        } else if (intent.type === 'custom') {
          appendChatMessage('bot', intent.data.answer, {
            text: intent.data.waMessage,
            label: 'Falar com a Dra. Erika'
          });
        } else {
          // Fallback genérico mas acolhedor
          const waText = `Oi Dra. Erika, tenho uma dúvida: "${text}"`;
          appendChatMessage('bot',
            "Hmm, essa eu não tenho certeza da resposta! 😅\n\nMas a Dra. Erika pode te ajudar com praticamente qualquer questão odontológica.\n\nClica no botão abaixo pra falar direto com ela:",
            {
              text: waText,
              label: 'Perguntar pra Dra. Erika'
            }
          );
        }
      }, delay);
    });
  }
});
