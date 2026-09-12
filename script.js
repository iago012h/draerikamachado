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
    const lower = text.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // Remove acentos pra matching

    // Mapeamento de palavras-chave para respostas
    const patterns = [
      { keys: ['diastema', 'espaco', 'separado', 'espaco entre', 'dente separado', 'abertura'], faq: 'diastema' },
      { keys: ['clareamento', 'clarear', 'branco', 'amarelo', 'branquear', 'dente escuro'], faq: 'clareamento' },
      { keys: ['protese', 'dentadura', 'ponte', 'coroa', 'perdi dente', 'falta dente'], faq: 'protese' },
      { keys: ['horario', 'hora', 'funciona', 'aberto', 'sabado', 'domingo', 'semana'], faq: 'horarios' },
      { keys: ['onde', 'endereco', 'shopping', 'localiza', 'como chego', 'mapa', 'fica'], faq: 'local' },
      { keys: ['agendar', 'marcar', 'consulta', 'agenda'], faq: 'agendar' },
      { keys: ['lente', 'faceta', 'porcelana', 'ceramica'], faq: 'lentes' },
      { keys: ['canal', 'endodont', 'nervo'], faq: 'canal' },
      { keys: ['implante', 'parafuso', 'pino'], faq: 'implante' },
      { keys: ['convenio', 'plano', 'aceita', 'pagamento', 'parcela', 'cartao', 'preco', 'valor', 'custa', 'quanto'], faq: 'convenio' },
      { keys: ['dor', 'doi', 'doendo', 'inchado', 'inflamado', 'urgencia', 'emergencia'], faq: 'dor' },
      { keys: ['primeira', 'avaliacao', 'como e a consulta', 'primeira vez'], faq: 'primeira' },
      { keys: ['restaura', 'obtura', 'carie', 'quebrou', 'fratur', 'resina', 'trinca'], faq: 'protese' },
      { keys: ['gengiva', 'sangra', 'limpeza', 'tartaro', 'profilaxia'], response: {
        answer: "Sim! A Dra. Erika faz limpeza profissional (profilaxia) e cuida de problemas na gengiva. Se sua gengiva está sangrando ou inchada, é bom agendar uma avaliação.\n\nClica no botão abaixo pra falar com ela!",
        waMessage: "Oi Dra. Erika! Estou com problema na gengiva e gostaria de uma avaliação."
      }},
      { keys: ['extrac', 'arrancar', 'tirar dente', 'siso'], response: {
        answer: "Depende do caso! A Dra. Erika avalia se realmente precisa extrair. Para sisos inclusos ou casos cirúrgicos mais complexos, ela pode encaminhar pra um cirurgião parceiro.\n\nManda mensagem pelo WhatsApp e conta o que está acontecendo.",
        waMessage: "Oi Dra. Erika! Preciso avaliar uma extração."
      }},
      { keys: ['ortodont', 'aparelho', 'alinhar', 'torto'], response: {
        answer: "Ortodontia (aparelho) não é a especialidade da Dra. Erika, mas ela pode te avaliar e encaminhar pra um ortodontista de confiança que trabalha em parceria com o consultório.\n\nSe quiser, fala com ela pelo WhatsApp!",
        waMessage: "Oi Dra. Erika! Gostaria de saber sobre aparelho/ortodontia."
      }},
      { keys: ['bruxismo', 'ranger', 'apertar', 'placa', 'mordida'], response: {
        answer: "Sim, a Dra. Erika pode te ajudar com isso! Ela avalia o desgaste dos dentes e pode fazer uma placa de bruxismo sob medida pra proteger seus dentes.\n\nÉ um problema mais comum do que parece. Fala com ela pelo WhatsApp!",
        waMessage: "Oi Dra. Erika! Queria avaliar bruxismo."
      }},
      { keys: ['sensibilidade', 'sensivel', 'gelado', 'frio', 'doce'], response: {
        answer: "Sensibilidade pode ter várias causas — retração da gengiva, cárie, restauração com problema... O ideal é a Dra. Erika avaliar pessoalmente pra identificar o que está acontecendo.\n\nManda mensagem pra ela que vocês combinam!",
        waMessage: "Oi Dra. Erika! Meus dentes estão muito sensíveis."
      }},
      { keys: ['mau halito', 'halitose', 'cheiro', 'bafo'], response: {
        answer: "Mau hálito pode ter várias origens — desde problemas na gengiva até restaurações antigas. A Dra. Erika pode avaliar sua saúde bucal completa e identificar a causa.\n\nFala com ela pelo WhatsApp sem constrangimento, é mais comum do que você imagina!",
        waMessage: "Oi Dra. Erika! Gostaria de uma avaliação sobre halitose."
      }}
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
