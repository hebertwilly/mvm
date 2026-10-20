export const contact = {
  name: 'MVM Segurança e Medicina Ocupacional',
  cnpj: '34.464.745/0001-23',
  whatsappNumber: '5514982323774',
  phone: '(14) 98232-3774',
  phoneUrl: 'tel:+5514982323774',
  email: 'comercial@mvmengmed.com.br',
  hours: 'Segunda a sexta-feira, das 7h às 17h.',
  instagram: {
    handle: '@mvmsegmed',
    url: 'https://www.instagram.com/mvmsegmed/',
  },
  messages: {
    general: 'Olá! Vim pelo site da MVM e gostaria de mais informações.',
    quote: 'Olá! Vim pelo site da MVM e gostaria de solicitar um orçamento.',
    safety: 'Olá! Vim pelo site da MVM e gostaria de informações sobre Segurança do Trabalho.',
    occupational: 'Olá! Vim pelo site da MVM e gostaria de informações sobre exames ocupacionais e complementares.',
    onsite: 'Olá! Vim pelo site da MVM e gostaria de informações sobre atendimento in loco.',
    training: 'Olá! Vim pelo site da MVM e gostaria de informações sobre treinamentos em Segurança do Trabalho.',
    safetyProposal: 'Olá! Vim pelo site da MVM e gostaria de solicitar uma proposta de Segurança do Trabalho.',
    occupationalExams: 'Olá! Vim pelo site da MVM e gostaria de agendar exames ocupacionais e complementares.',
    onsiteCompany: 'Olá! Vim pelo site da MVM e gostaria de consultar atendimento in loco na minha empresa.',
  },
};

export function getWhatsAppUrl(message = 'general') {
  const number = contact.whatsappNumber;
  if (typeof number !== 'string' || !/^[1-9]\d{7,14}$/.test(number)) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(contact.messages[message] ?? contact.messages.general)}`;
}

export function getEmailUrl() {
  const email = contact.email?.trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || /\.example$/i.test(email)) return null;
  return `mailto:${email}`;
}
