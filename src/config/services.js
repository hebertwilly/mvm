export const segments = [
  { title: 'Indústrias', icon: 'operation' },
  { title: 'Agronegócio', icon: 'growth' },
  { title: 'Construtoras', icon: 'helmet' },
];

export const services = [
  {
    slug: 'seguranca-do-trabalho', href: '/servicos/seguranca-do-trabalho/', label: 'Segurança do Trabalho',
    cardTitle: 'Segurança do Trabalho', cardText: 'Avaliação de riscos, orientação técnica e acompanhamento do plano de ação.', icon: 'helmet', message: 'safety',
    pageTitle: 'Segurança do Trabalho | MVM', description: 'Avaliação de riscos ocupacionais, PGR, PCMSO e LTCAT conforme a necessidade, com acompanhamento do plano de ação.',
    what: 'A MVM avalia a realidade da empresa e seus riscos ocupacionais para orientar medidas de prevenção. Conforme a necessidade, elabora PGR, PCMSO e LTCAT, orienta sobre ações e prazos aplicáveis e acompanha o plano de ação.',
    when: [
      { title: 'Avaliar riscos ocupacionais', text: 'Conhecer as condições de trabalho e organizar medidas de prevenção adequadas à operação.' },
      { title: 'Planejar e acompanhar ações', text: 'Definir orientações e prazos aplicáveis e acompanhar a execução do plano de ação.' },
    ],
    how: 'Começamos pelo levantamento das necessidades e informações da empresa. O escopo da proposta e os documentos necessários são definidos conforme a avaliação de cada caso.',
    secondaryVisual: 'safety-detail',
    detailsTitle: 'Documentos conforme a necessidade',
    details: [
      { title: 'PGR — Programa de Gerenciamento de Riscos', text: 'Identifica e avalia os riscos ocupacionais da empresa e organiza medidas de prevenção em um plano de ação.' },
      { title: 'PCMSO — Programa de Controle Médico de Saúde Ocupacional', text: 'Orienta o acompanhamento da saúde dos trabalhadores, considerando os riscos ocupacionais identificados e os exames definidos pelo médico responsável.' },
      { title: 'LTCAT — Laudo Técnico das Condições Ambientais do Trabalho', text: 'Avalia a exposição dos trabalhadores a agentes nocivos para subsidiar informações previdenciárias e a análise das condições relacionadas à aposentadoria especial.' },
    ],
    noteTitle: 'Análise de riscos e apoio à gestão de custos previdenciários',
    note: 'A MVM atua na avaliação dos riscos ocupacionais e no acompanhamento de medidas de prevenção. Também oferece análise técnica para apoiar demandas relacionadas ao FAP e à contestação, conforme as condições e a documentação de cada empresa.',
    faq: [
      { question: 'Como solicitar uma proposta de Segurança do Trabalho?', answer: 'Entre em contato pelo WhatsApp. A equipe levanta as necessidades e informações da empresa para definir a proposta e o escopo.' },
      { question: 'Quais informações são necessárias para a proposta?', answer: 'Tenha em mãos CNPJ, número de empregados por unidade, lista de funções, documentos existentes e suas validades, motivo da contratação e localização.' },
    ],
    contactTitle: 'Converse sobre a segurança da sua empresa.', contactText: 'Fale com a MVM para avaliar suas necessidades e solicitar uma proposta.', contactMessage: 'safetyProposal',
  },
  {
    slug: 'medicina-ocupacional', href: '/servicos/medicina-ocupacional/', label: 'Exames ocupacionais e complementares',
    cardTitle: 'Exames ocupacionais e complementares', cardText: 'Exames definidos conforme a solicitação e a avaliação aplicável.', icon: 'medical', message: 'occupational',
    pageTitle: 'Exames ocupacionais e complementares | MVM', description: 'Exame clínico, audiometria, raio-X, exames laboratoriais de coleta, eletrocardiograma, eletroencefalograma e espirometria.',
    what: 'A MVM realiza exames ocupacionais e complementares conforme a solicitação e a avaliação aplicável. Os exames necessários e as orientações de preparo são alinhados no agendamento.',
    when: [
      { title: 'Agendar exames da equipe', text: 'Converse com a MVM sobre a solicitação e as necessidades dos trabalhadores.' },
      { title: 'Alinhar orientações de preparo', text: 'As orientações específicas são informadas no agendamento, conforme os exames solicitados.' },
    ],
    how: 'A equipe confere a solicitação, alinha os exames necessários e orienta o agendamento e o preparo conforme a avaliação aplicável.',
    secondaryVisual: 'medicine-detail',
    detailsEyebrow: 'Exames ocupacionais',
    detailsTitle: 'Exames ocupacionais e complementares',
    detailsSubtitle: 'Alguns dos exames realizados pela MVM.',
    details: [
      { title: 'Exame clínico', icon: 'examClinical' }, { title: 'Audiometria', icon: 'examAudiometry' }, { title: 'Raio-X', icon: 'examXray' },
      { title: 'Exames laboratoriais de coleta', icon: 'examLab' }, { title: 'Eletrocardiograma', icon: 'examEcg' }, { title: 'Eletroencefalograma', icon: 'examEeg' },
      { title: 'Espirometria', icon: 'examSpirometry' },
    ],
    faq: [
      { question: 'Como agendar exames?', answer: 'Compartilhe a solicitação com a equipe da MVM. No agendamento, serão alinhados os exames necessários e as orientações de preparo aplicáveis.' },
      { question: 'Quais exames a MVM realiza?', answer: 'Exame clínico, audiometria, raio-X, exames laboratoriais de coleta, eletrocardiograma, eletroencefalograma e espirometria.' },
    ],
    contactTitle: 'Vamos organizar os exames da sua equipe?', contactText: 'Converse com a MVM sobre a solicitação e o agendamento.', contactMessage: 'occupationalExams',
  },
  {
    slug: 'atendimento-in-loco', href: '/servicos/atendimento-in-loco/', label: 'Atendimento in loco',
    cardTitle: 'Atendimento in loco', cardText: 'Atendimento ocupacional planejado na empresa para grupos a partir de 10 colaboradores.', icon: 'location', message: 'onsite',
    pageTitle: 'Atendimento in loco | MVM', description: 'Atendimento ocupacional na empresa para grupos a partir de 10 colaboradores, mediante agendamento e planejamento.',
    what: 'Levamos o atendimento ocupacional até a sua empresa, com planejamento personalizado para facilitar a rotina dos colaboradores. Disponível para grupos a partir de 10 colaboradores, mediante agendamento e alinhamento das necessidades com nossa equipe.',
    when: [
      { title: 'A partir de 10 colaboradores', text: 'O atendimento in loco está disponível para grupos com no mínimo 10 colaboradores.' },
      { title: 'Facilidade para a rotina', text: 'Organizamos os atendimentos em conjunto com a empresa para facilitar a rotina dos colaboradores.' },
    ],
    how: 'A equipe da MVM levanta as necessidades da empresa e planeja o atendimento em conjunto com ela. Agende uma conversa pelo WhatsApp.',
    faq: [
      { question: 'Qual é o mínimo de colaboradores?', answer: 'O atendimento in loco está disponível para grupos a partir de 10 colaboradores.' },
      { question: 'Como consultar o atendimento na empresa?', answer: 'Fale com a MVM pelo WhatsApp para alinhar as necessidades e planejar o agendamento.' },
    ],
    contactTitle: 'Consulte o atendimento na sua empresa.', contactText: 'Planeje o atendimento in loco com a equipe da MVM.', contactCta: 'Consultar atendimento in loco', contactMessage: 'onsiteCompany',
  },
  {
    slug: 'treinamentos', href: '/servicos/treinamentos/', label: 'Treinamentos',
    cardTitle: 'Treinamentos', cardText: 'Treinamentos em Segurança do Trabalho com escopo definido para a empresa.', icon: 'people', message: 'training',
    pageTitle: 'Treinamentos em Segurança do Trabalho | MVM', description: 'Treinamentos em Segurança do Trabalho com escopo alinhado às necessidades de cada empresa.',
    what: 'A MVM oferece treinamentos em Segurança do Trabalho. O conteúdo e o escopo são definidos em conversa com a empresa, de acordo com suas necessidades.',
    when: [
      { title: 'Planejar a capacitação', text: 'Converse sobre as necessidades de Segurança do Trabalho da equipe.' },
      { title: 'Definir o escopo', text: 'A proposta considera as informações e as necessidades apresentadas pela empresa.' },
    ],
    how: 'A empresa entra em contato pelo WhatsApp, apresenta sua demanda e recebe uma proposta com escopo definido em conjunto com a MVM.',
    faq: [
      { question: 'Como solicitar um treinamento?', answer: 'Entre em contato pelo WhatsApp e apresente as necessidades da empresa para definir o escopo.' },
      { question: 'Como consultar atendimento em outra região?', answer: 'A MVM tem clientes em São Paulo, Paraná, Rio de Janeiro, Rio Grande do Sul e no Nordeste. Consulte a equipe para avaliar o atendimento à sua empresa.' },
    ],
    contactTitle: 'Vamos conversar sobre os treinamentos?', contactText: 'Fale com a MVM para definir o escopo conforme sua necessidade.',
  },
];
