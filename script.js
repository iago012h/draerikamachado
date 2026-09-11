/**
 * ==========================================================================
 * DRA. ERIKA MACHADO — CIRURGIÃ DENTISTA (CROSP 115717)
 * Script de Interatividade, Status em Tempo Real e Recepção Virtual (FAQ)
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // Informações da Clínica
  const CLINIC_INFO = {
    whatsappUrl: 'https://wa.me/message/VBLJFW3FEOGOK1',
    phone: '(12) 99684-1633',
    city: 'São José dos Campos - SP',
    address: 'Shopping Centro, Rua Rubião Júnior, 84, Sala 57 (2º andar)'
  };

  /* --------------------------------------------------------------------------
     1. Menu Mobile Toggle
     -------------------------------------------------------------------------- */
  const menuToggle = document.getElementById('menu-toggle');
  const siteNav = document.getElementById('site-nav');

  if (menuToggle && siteNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = siteNav.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', isOpen);
    });

    // Fecha o menu ao clicar em qualquer link
    siteNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        siteNav.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* --------------------------------------------------------------------------
     2. Status dos Horários em Tempo Real
     -------------------------------------------------------------------------- */
  const initClinicStatus = () => {
    const statusBadge = document.getElementById('clinic-status-badge');
    const scheduleRows = document.querySelectorAll('.schedule-table tr[data-day]');
    if (!statusBadge) return;

    const now = new Date();
    const day = now.getDay(); // 0 = Domingo, 1 = Segunda ... 6 = Sábado
    const hour = now.getHours();
    const minute = now.getMinutes();
    const currentTime = hour + minute / 60;

    // Destacar o dia da semana atual na tabela
    scheduleRows.forEach(row => {
      const rowDay = parseInt(row.getAttribute('data-day'), 10);
      if (rowDay === day) {
        row.classList.add('today-row');
      } else {
        row.classList.remove('today-row');
      }
    });

    let isOpen = false;
    let closingHour = '';

    if (day >= 1 && day <= 5) {
      // Segunda a Sexta: 09:00 às 18:00
      if (currentTime >= 9 && currentTime < 18) {
        isOpen = true;
        closingHour = '18:00';
      }
    } else if (day === 6) {
      // Sábado: 09:00 às 13:00
      if (currentTime >= 9 && currentTime < 13) {
        isOpen = true;
        closingHour = '13:00';
      }
    } // Domingo: Fechado

    if (isOpen) {
      statusBadge.className = 'status-live-badge open';
      statusBadge.innerHTML = `<span class="status-live-dot"></span> Atendendo agora • Hoje até às ${closingHour}`;
    } else {
      statusBadge.className = 'status-live-badge closed';
      statusBadge.innerHTML = `<span class="status-live-dot"></span> Fechado agora • Atendimento com hora marcada`;
    }
  };

  initClinicStatus();

  /* --------------------------------------------------------------------------
     3. Recepção Virtual / FAQ Interativo
     -------------------------------------------------------------------------- */
  const conciergeTrigger = document.getElementById('concierge-trigger');
  const conciergeModal = document.getElementById('concierge-modal');
  const conciergeClose = document.getElementById('concierge-close');
  const conciergeStream = document.getElementById('concierge-stream');
  const conciergeForm = document.getElementById('concierge-form');
  const conciergeInput = document.getElementById('concierge-input');

  // Base de Conhecimento Clínica da Dra. Erika Machado
  const CLINIC_FAQ = {
    diastema: {
      question: "Como funciona o Fechamento de Diastema?",
      answer: "O fechamento de diastema é um procedimento delicado e conservador realizado com resina composta nobre. Ele permite aproximar os dentes e harmonizar o sorriso sem desgastar a estrutura saudável. A Dra. Erika Machado avalia a proporção do seu rosto e dentes para um resultado muito natural.",
      waMessage: "Olá, Dra. Erika! Gostaria de conversar sobre o Fechamento de Diastema."
    },
    clareamento: {
      question: "Como é feito o Clareamento Dental?",
      answer: "Utilizamos protocolos modernos e supervisionados que respeitam a integridade do esmalte e previnem a sensibilidade. O objetivo é iluminar o sorriso com suavidade, mantendo a naturalidade e a saúde dos seus dentes.",
      waMessage: "Olá, Dra. Erika! Gostaria de agendar um Clareamento Dental."
    },
    protese: {
      question: "Quais são as opções de Próteses e Restaurações?",
      answer: "Cuidamos da sua mastigação e do seu bem-estar com próteses confortáveis e restaurações em resinas estéticas que se integram perfeitamente à cor natural dos dentes, devolvendo a segurança ao sorrir.",
      waMessage: "Olá, Dra. Erika! Gostaria de saber mais sobre Próteses e Restaurações."
    },
    horarios: {
      question: "Quais são os horários de atendimento?",
      answer: "Atendemos de Segunda a Sexta das 09:00 às 18:00 e aos Sábados das 09:00 às 13:00 (aos Domingos ficamos fechados). Todas as consultas são com hora marcada, garantindo privacidade e atendimento pontual sem pressa.",
      waMessage: "Olá! Gostaria de verificar os horários disponíveis para uma consulta com a Dra. Erika."
    },
    local: {
      question: "Onde fica localizado o consultório?",
      answer: "Nosso consultório fica no Shopping Centro: Rua Rubião Júnior, 84, Sala 57 (2º andar), no Centro de São José dos Campos. Um espaço acolhedor, de fácil acesso e com estacionamento coberto para sua comodidade.",
      waMessage: "Olá! Gostaria de confirmar a localização e agendar uma visita ao consultório."
    },
    agendar: {
      question: "Como agendar uma avaliação?",
      answer: "É muito simples! Basta clicar no botão abaixo para conversar diretamente conosco pelo WhatsApp oficial. Responderemos com toda a atenção para encontrar o melhor dia e horário para você.",
      waMessage: "Olá, Dra. Erika! Gostaria de agendar uma consulta no consultório."
    }
  };

  // Abrir / Fechar Recepção Virtual
  if (conciergeTrigger && conciergeModal) {
    conciergeTrigger.addEventListener('click', () => {
      conciergeModal.classList.toggle('is-open');
      if (conciergeModal.classList.contains('is-open')) {
        conciergeInput?.focus();
      }
    });

    conciergeClose?.addEventListener('click', () => {
      conciergeModal.classList.remove('is-open');
    });
  }

  // Renderizar Mensagem no Chat
  const appendChatMessage = (sender, messageText, actionWa = null) => {
    if (!conciergeStream) return;

    const row = document.createElement('div');
    row.className = `chat-bubble-item ${sender}`;

    let buttonActionHtml = '';
    if (actionWa) {
      const waLink = `${CLINIC_INFO.whatsappUrl}?text=${encodeURIComponent(actionWa.text)}`;
      buttonActionHtml = `
        <a href="${waLink}" target="_blank" rel="noopener" class="chat-direct-wa-btn">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.587-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.055-1.92-.477-1.528-.63-2.511-2.18-2.587-2.281-.077-.101-.625-.833-.625-1.588 0-.755.396-1.127.536-1.282.14-.155.306-.194.408-.194.102 0 .204.001.293.006.094.005.22-.036.345.263.128.307.439 1.07.478 1.148.038.077.064.168.013.27-.051.102-.077.165-.153.254-.077.089-.161.198-.23.265-.077.075-.157.157-.067.311.089.155.397.654.851 1.059.585.521 1.078.683 1.232.76.153.076.243.064.333-.038.089-.102.383-.446.485-.599.102-.153.204-.128.344-.076.14.051.892.42 1.045.497.153.076.255.115.293.179.038.064.038.371-.106.776z"/>
          </svg>
          ${actionWa.label || 'Continuar no WhatsApp'}
        </a>
      `;
    }

    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    row.innerHTML = `
      <div class="chat-bubble-text">
        ${messageText}
        ${buttonActionHtml}
      </div>
      <span class="chat-bubble-time">${timeString}</span>
    `;

    conciergeStream.appendChild(row);
    conciergeStream.scrollTop = conciergeStream.scrollHeight;
  };

  // Indicador de Digitando
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

  // Disparo Global de Dúvida Rápida (chamado pelo onclick)
  window.sendQuickFAQ = (key) => {
    const faq = CLINIC_FAQ[key];
    if (!faq) return;

    appendChatMessage('user', faq.question);
    showTypingIndicator();

    setTimeout(() => {
      removeTypingIndicator();
      appendChatMessage('bot', faq.answer, {
        text: faq.waMessage,
        label: 'Falar com a Dra. Erika no WhatsApp'
      });
    }, 550);
  };

  // Formulário de Pergunta Livre
  if (conciergeForm && conciergeInput) {
    conciergeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = conciergeInput.value.trim();
      if (!text) return;

      appendChatMessage('user', text);
      conciergeInput.value = '';

      showTypingIndicator();

      setTimeout(() => {
        removeTypingIndicator();
        const lower = text.toLowerCase();

        let reply = "Obrigada pelo contato! A Dra. Erika Machado realiza atendimentos personalizados no Shopping Centro em São José dos Campos. Clique no botão abaixo para conversarmos no WhatsApp e tirar sua dúvida:";
        let waText = `Olá Dra. Erika, gostaria de tirar a seguinte dúvida: "${text}"`;

        if (lower.includes('diastema') || lower.includes('espaço') || lower.includes('separado')) {
          reply = CLINIC_FAQ.diastema.answer;
          waText = CLINIC_FAQ.diastema.waMessage;
        } else if (lower.includes('clareamento') || lower.includes('branco') || lower.includes('sensibilidade')) {
          reply = CLINIC_FAQ.clareamento.answer;
          waText = CLINIC_FAQ.clareamento.waMessage;
        } else if (lower.includes('protese') || lower.includes('prótese') || lower.includes('restauracao') || lower.includes('restauração')) {
          reply = CLINIC_FAQ.protese.answer;
          waText = CLINIC_FAQ.protese.waMessage;
        } else if (lower.includes('horario') || lower.includes('horário') || lower.includes('sabado') || lower.includes('funciona')) {
          reply = CLINIC_FAQ.horarios.answer;
          waText = CLINIC_FAQ.horarios.waMessage;
        } else if (lower.includes('endereco') || lower.includes('endereço') || lower.includes('shopping') || lower.includes('onde')) {
          reply = CLINIC_FAQ.local.answer;
          waText = CLINIC_FAQ.local.waMessage;
        } else if (lower.includes('preco') || lower.includes('preço') || lower.includes('valor') || lower.includes('custa')) {
          reply = "Cada sorriso tem necessidades biológicas e anatômicas específicas. A Dra. Erika realiza uma avaliação clínica presencial para planejar o melhor tratamento com total clareza de valores.";
          waText = "Olá Dra. Erika, gostaria de agendar uma avaliação para verificar valores e opções de tratamento.";
        }

        appendChatMessage('bot', reply, {
          text: waText,
          label: 'Conversar com a Dra. Erika no WhatsApp'
        });
      }, 650);
    });
  }
});
