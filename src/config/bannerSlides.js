// Fotografias ilustrativas; não retratam equipe ou instalações da MVM.
export const serviceSlides = [
  { key: 'safety', label: 'Segurança do Trabalho', eyebrow: 'SEGURANÇA DO TRABALHO', title: 'Segurança que acompanha a sua operação.', description: 'Avaliação de riscos e documentos de Segurança do Trabalho para indústrias, agronegócio e construtoras.', cta: 'Conheça nossas soluções', href: '/servicos/seguranca-do-trabalho/', desktopPosition: 'center center', mobilePosition: '72% center' },
  { key: 'medicine', label: 'Exames ocupacionais e complementares', eyebrow: 'EXAMES OCUPACIONAIS', title: 'Mais cuidado com a saúde da sua equipe.', description: 'Exames ocupacionais e complementares agendados conforme a solicitação e a avaliação aplicável.', cta: 'Conheça os exames', href: '/servicos/medicina-ocupacional/', desktopPosition: 'center center', mobilePosition: '77% center' },
  { key: 'onsite', label: 'Atendimento in loco', eyebrow: 'ATENDIMENTO IN LOCO', title: 'Levamos o atendimento até a sua empresa.', description: 'Atendimento ocupacional planejado para grupos a partir de 10 colaboradores.', cta: 'Conheça o atendimento in loco', href: '/servicos/atendimento-in-loco/', desktopPosition: 'center center', mobilePosition: '72% center' },
];

export const homeSlides = [
  { key: 'institutional', label: 'A MVM', eyebrow: 'MVM · SEGURANÇA E MEDICINA OCUPACIONAL', title: 'Segurança e saúde para quem move sua empresa.', description: 'Atendimento personalizado em segurança e saúde ocupacional, com soluções na clínica e na sua empresa.', cta: 'Solicitar um orçamento', message: 'quote', desktopPosition: 'center center', mobilePosition: '77% center' },
  ...serviceSlides,
];

export const individualBanners = {
  'seguranca-do-trabalho': {
    key: 'safety', eyebrow: 'SEGURANÇA DO TRABALHO',
    title: 'Segurança do trabalho para a realidade da sua empresa.',
    description: 'Avaliação de riscos ocupacionais e acompanhamento do plano de ação conforme a sua necessidade.',
    cta: 'Solicitar uma proposta', message: 'safetyProposal',
    desktopPosition: 'center center', mobilePosition: '72% center',
  },
  'medicina-ocupacional': {
    key: 'medicine', eyebrow: 'EXAMES OCUPACIONAIS',
    title: 'Cuidado com a saúde de quem move sua empresa.',
    description: 'Exames ocupacionais e complementares com agendamento alinhado à sua necessidade.',
    cta: 'Consultar atendimento', message: 'occupationalExams',
    desktopPosition: 'center center', mobilePosition: '77% center',
  },
  'atendimento-in-loco': {
    key: 'onsite', eyebrow: 'ATENDIMENTO IN LOCO',
    title: 'Atendimento ocupacional na sua empresa.',
    description: 'Atendimento planejado para grupos a partir de 10 colaboradores, mediante agendamento.',
    cta: 'Consultar atendimento in loco', message: 'onsiteCompany',
    desktopPosition: 'center center', mobilePosition: '72% center',
  },
  'treinamentos': {
    key: 'safety', eyebrow: 'TREINAMENTOS', title: 'Treinamentos para a realidade da sua empresa.',
    description: 'Treinamentos em Segurança do Trabalho com escopo definido conforme a sua necessidade.',
    cta: 'Consultar treinamentos', message: 'training', desktopPosition: 'center center', mobilePosition: '72% center',
  },
};
