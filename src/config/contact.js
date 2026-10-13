// TEMPORÁRIO: número de teste autorizado. Substituir pelo número oficial antes
// da publicação, com DDI e DDD, apenas dígitos. Única fonte do telefone no site.
export const contact = {
  whatsappNumber: '5514997031879',
  // Dados provisórios para composição da página Contato. Confirmar antes da publicação.
  email: 'contato@mvm.example',
  hours: 'Segunda a sexta, das 8h às 18h.',
  instagram: {
    handle: '@mvmsegmed',
    url: 'https://www.instagram.com/mvmsegmed/',
  },
  messages: {
    general: 'Olá! Vim pelo site da MVM e gostaria de mais informações.',
    quote: 'Olá! Vim pelo site da MVM e gostaria de solicitar um orçamento.',
    safety: 'Olá! Vim pelo site da MVM e gostaria de informações sobre segurança do trabalho.',
    occupational: 'Olá! Vim pelo site da MVM e gostaria de informações sobre medicina ocupacional.',
    onsite: 'Olá! Vim pelo site da MVM e gostaria de informações sobre atendimento in loco.',
    safetyProposal: 'Olá! Vim pelo site da MVM e gostaria de solicitar uma proposta de segurança do trabalho.',
    occupationalExams: 'Olá! Vim pelo site da MVM e gostaria de informações sobre medicina ocupacional e exames médicos.',
    onsiteCompany: 'Olá! Vim pelo site da MVM e gostaria de informações sobre atendimento in loco na minha empresa.',
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
