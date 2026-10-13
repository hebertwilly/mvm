// Fotografias ilustrativas; não retratam equipe ou instalações da MVM.
export const serviceSlides = [
  { key: 'safety', label: 'Segurança do trabalho', eyebrow: 'SEGURANÇA DO TRABALHO', title: 'Segurança que acompanha a sua operação.', description: 'Projetos personalizados para indústrias, agronegócio e construtoras.', cta: 'Conheça nossas soluções', href: '/servicos/seguranca-do-trabalho/', desktopPosition: 'center center', mobilePosition: '72% center' },
  { key: 'medicine', label: 'Medicina ocupacional', eyebrow: 'MEDICINA OCUPACIONAL', title: 'Mais cuidado com a saúde da sua equipe.', description: 'Exames médicos com atendimento personalizado para sua empresa.', cta: 'Conheça a medicina ocupacional', href: '/servicos/medicina-ocupacional/', desktopPosition: 'center center', mobilePosition: '77% center' },
  { key: 'onsite', label: 'Atendimento in loco', eyebrow: 'ATENDIMENTO IN LOCO', title: 'Levamos o atendimento até a sua empresa.', description: 'Exames realizados nas suas instalações, com menos deslocamentos para a equipe.', cta: 'Conheça o atendimento in loco', href: '/servicos/atendimento-in-loco/', desktopPosition: 'center center', mobilePosition: '72% center' },
];

export const homeSlides = [
  { key: 'institutional', label: 'A MVM', eyebrow: 'MVM · SEGURANÇA E MEDICINA OCUPACIONAL', title: 'Segurança e saúde para quem move sua empresa.', description: 'Atendimento personalizado, com exames realizados na sua empresa. Hoje, atendemos clientes em São Paulo e no Paraná.', cta: 'Solicitar um orçamento', message: 'quote', desktopPosition: 'center center', mobilePosition: '77% center' },
  ...serviceSlides,
];

export const individualBanners = {
  'seguranca-do-trabalho': {
    key: 'safety', eyebrow: 'SEGURANÇA DO TRABALHO',
    title: 'Segurança do trabalho para a realidade da sua empresa.',
    description: 'Projetos personalizados para indústrias, agronegócio e construtoras. Consulte sua localidade.',
    cta: 'Solicitar uma proposta', message: 'safetyProposal',
    desktopPosition: 'center center', mobilePosition: '72% center',
  },
  'medicina-ocupacional': {
    key: 'medicine', eyebrow: 'MEDICINA OCUPACIONAL',
    title: 'Cuidado com a saúde de quem move sua empresa.',
    description: 'Exames médicos com atendimento personalizado para sua empresa. Consulte sua localidade.',
    cta: 'Consultar atendimento', message: 'occupationalExams',
    desktopPosition: 'center center', mobilePosition: '77% center',
  },
  'atendimento-in-loco': {
    key: 'onsite', eyebrow: 'ATENDIMENTO IN LOCO',
    title: 'Exames médicos dentro da sua empresa.',
    description: 'Atendimento personalizado nas suas instalações, com menos deslocamentos para a equipe.',
    cta: 'Consultar atendimento in loco', message: 'onsiteCompany',
    desktopPosition: 'center center', mobilePosition: '72% center',
  },
};
