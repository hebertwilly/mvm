# Pendências de conteúdo — MVM

As quatro rotas de Serviços apresentam apenas as três frentes confirmadas:
segurança do trabalho, medicina ocupacional e atendimento in loco como
modalidade de atendimento médico. O conteúdo confirmado inclui projetos
personalizados, atendimento médico e exames, realização de exames dentro da
empresa do cliente, clientes atuais em São Paulo e no Paraná e os segmentos indústrias,
agronegócio e construtoras.

## Conteúdo a confirmar

| Página | Informação pendente | Tratamento atual |
| --- | --- | --- |
| Segurança do trabalho | Escopo, entregas e limites dos projetos; etapas do atendimento. | A página explica a área em termos gerais e distingue essa explicação dos projetos personalizados confirmados da MVM. Orienta a consulta à equipe sobre o escopo. |
| Medicina ocupacional | Relação de exames, preparos, documentos, condições e prazos. | A página confirma atendimento médico e exames, sem listar modalidades ou prazos. As dúvidas de exames são direcionadas à equipe. |
| Atendimento in loco | Exames disponíveis no local, infraestrutura, condições operacionais, agendamento e quantidade mínima. | A página explica a modalidade, a redução de deslocamentos e o planejamento personalizado, com disponibilidade a consultar. |
| Todas | Detalhes adicionais dos serviços, evidências para alegações específicas e respostas operacionais de FAQ. | São exibidas apenas informações sustentadas pelos dados confirmados. |

Nenhuma página promete eliminação de riscos ou garantia de conformidade. Não
foram incluídos laudos, programas, treinamentos, métricas, clientes,
certificações, prazos ou serviços não confirmados.

## Imagem necessária

Os quatro fundos panorâmicos de `src/assets/images/banners/` medem 1774×887 px.
Estão em uso na Home e nas páginas de Serviços, com enquadramento e derivados
responsivos. Para nitidez de aproximadamente 3× em smartphones, produzir versões
verticais próprias de **institucional, segurança, medicina e in loco**, com ao
menos 1200×2000 px e composição que preserve pessoas e área de leitura. Um
simples recorte ou aumento dos panoramas atuais não acrescentará detalhes.
Em tablets de alta densidade e monitores grandes, panoramas originais mais
largos também melhorariam a nitidez. As fotos permanecem ilustrativas e não
representam equipe nem instalações reais da MVM.

## Navegação e publicação

- `/servicos/`, `/servicos/seguranca-do-trabalho/`,
  `/servicos/medicina-ocupacional/` e `/servicos/atendimento-in-loco/` existem.
- Sobre nós e Contato têm páginas próprias em `/sobre-nos/` e `/contato/`.
- O telefone de teste permanece somente em `src/config/contact.js` e deve ser
  substituído pelo número oficial antes da publicação.
- A marca tipográfica é provisória até o fornecimento da logo oficial.

## Sobre nós e Contato

- `sobre-mvm.png` não foi encontrado. A seção “Quem é a MVM” usa uma foto
  ilustrativa já disponível, sem identificar as pessoas como integrantes da
  equipe. Substituir quando o arquivo aprovado for fornecido.
- A galeria “Conheça a nossa estrutura” usa seis imagens provisórias do projeto,
  repetidas em outros contextos. Substituir todas por fotos reais da estrutura
  da MVM, com descrições aprovadas e autorização de publicação. As imagens de
  “Quem é a MVM”, “Nossa história”, linha do tempo e “Nosso próximo capítulo”
  também são ilustrativas; a última foi gerada para esta composição.
- Confirmar o telefone oficial antes da publicação. O e-mail
  `contato@mvm.example` e o horário “Segunda a sexta, das 8h às 18h.” são
  provisórios, centralizados em `src/config/contact.js`. O e-mail não possui
  link `mailto:` e não deve ser apresentado como canal funcional.
- O endereço “Rua Treze de Maio, 939 — Centro, Taquarituba — SP” é provisório.
  Confirmar se é o escritório da MVM antes da publicação. O iframe hospedado
  no Google Maps usa pesquisa textual pelo endereço, sem coordenadas nem Place
  ID presumidos. Confirmar o resultado diretamente no Maps e substituir por
  código de incorporação oficial do local, se fornecido.
- A abertura de Contato usa imagem institucional gerada e provisória; não
  representa pessoas ou instalações reais da MVM.
- As três miniaturas da seção Instagram são imagens provisórias existentes no
  projeto, ligadas apenas ao perfil. Fornecer URLs de três publicações reais
  selecionadas para substituí-las. Um feed automático depende de integração
  futura autorizada.
- SP e PR representam estados com clientes atendidos atualmente, não uma
  delimitação da área de atendimento. Confirmar disponibilidade por serviço e
  localidade com a equipe.

## Fonte cartográfica

O mapa de atuação usa a [API de Malhas Geográficas do IBGE](https://servicodados.ibge.gov.br/api/v3/malhas/paises/BR?intrarregiao=UF&qualidade=minima),
consulta `BR?intrarregiao=UF&qualidade=minima`, em SVG. O arquivo original está
em `src/assets/maps/ibge-ufs.svg` e conserva os contornos e identificadores
oficiais das 27 unidades federativas. O site recorta a visualização para o
Sul/Sudeste e destaca os IDs 35 (SP) e 41 (PR), com atribuição visível ao IBGE.
O [IBGE](https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais.html)
é a fonte da malha. A [nota técnica da Malha Municipal Digital](https://www.ibge.gov.br/biblioteca/visualizacao/livros/liv102152.pdf)
declara licença compatível com CC BY 4.0 para a MMD e derivados, com crédito à
criação original. A API não identifica a edição da malha em sua resposta SVG;
manter a atribuição ao IBGE em qualquer redistribuição do mapa. A atribuição
permanece no texto acessível do mapa.

## Validação pendente

As referências `referencias/sobre-nos-desktop.png` e
`referencias/contato-desktop.png` foram abertas e comparadas seção a seção com
capturas das páginas em Chrome headless. Nesta revisão, Sobre nós e Contato
foram verificados com viewport emulada de 320, 390, 768 e 1366 px, sem
overflow horizontal. O build e o verificador das rotas/links passaram. A
incorporação do Google Maps usa o endereço textual informado, mas o conteúdo
externo não carregou no navegador deste ambiente; conferir o mapa em uma rede
com acesso ao Google e validar a localização com a MVM antes de publicar.
Também convém confirmar o aspecto em aparelhos físicos e repetir os testes de
teclado, lightbox e linha do tempo na interface final.
