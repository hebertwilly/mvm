# MVM Segurança e Medicina Ocupacional

Site institucional em Astro, com npm, JavaScript e CSS puro e saída estática.
A Home inclui header fixo, menu móvel,
serviços, diferenciais, atendimento in loco, etapas, sobre e chamada de contato.
As quatro páginas de Serviços estão implementadas com conteúdo confirmado.

## Navegação e conteúdo

O header e o rodapé usam destinos válidos também nas páginas internas. Home
e a marca acessam `/`. Serviços acessa a página geral; o texto e a seta do
dropdown são controles separados. No desktop o submenu abre por hover e
permanece acessível enquanto o ponteiro está dentro dele. A seta abre por
clique, teclado ou toque; ArrowDown abre e foca o primeiro link. Escape fecha
o submenu e devolve o foco à seta; no mobile, outro Escape fecha o menu.
Os estados usam `aria-expanded`, `aria-controls`, `hidden` e indicação da seção
ativa em todas as rotas de Serviços. Links mantêm a semântica de navegação,
sem roles de menu de aplicativo. Sem JavaScript, o link Serviços continua
acessível e a página geral oferece os links individuais.

| Página | Destino | Situação |
| --- | --- | --- |
| Serviços | `/servicos/` | Implementada |
| Segurança do trabalho | `/servicos/seguranca-do-trabalho/` | Implementada |
| Medicina ocupacional | `/servicos/medicina-ocupacional/` | Implementada |
| Atendimento in loco | `/servicos/atendimento-in-loco/` | Implementada |
| Sobre nós | `/#sobre` | Seção da Home; página própria pendente |
| Contato | `/#contato` | Seção da Home; página própria pendente |

O pedido atual de Serviços substitui a orientação anterior de usar o destino
pendente `/sobre-nos/`. O link da Home também usa `/#sobre` nesta etapa.
As pendências editoriais e operacionais estão em
[docs/pendencias-conteudo.md](docs/pendencias-conteudo.md). Seções sem informações
suficientes são omitidas, sem inventar escopos, exames ou condições de atendimento.

A referência `referencias/home-mvm.png` foi aberta e comparada com o código,
seção por seção: header, hero, serviços, diferenciais, in loco, etapas, sobre,
chamada final e footer. Foram restaurados os links com setas, adicionados os
ícones de WhatsApp e localização nos botões, corrigido o ícone de engrenagem
dos diferenciais, o marcador de Home e a marca compacta do rodapé.
Os textos, imagens e rótulos fornecidos anteriormente permanecem, assim como
o hero aprovado, o header fixo, as animações e o contato sem formulário.
O pedido posterior de configurar o WhatsApp de teste autoriza o componente
flutuante compartilhado e substitui a orientação anterior de não incluí-lo.
A comparação com o código não substitui uma validação visual
da página renderizada em navegador.

## Requisitos

- Node.js 22.12.0 ou superior.
- npm 9.6.5 ou superior.

## Instalação

Na pasta do projeto, instale as versões registradas no `package-lock.json`:

```sh
npm ci
```

## Desenvolvimento

```sh
npm run dev
```

Acesse o endereço informado no terminal, normalmente `http://localhost:4321`.

## Build estático

```sh
npm run build
```

Os arquivos prontos para publicação são gerados em `dist/`.

## Preview do build

Após executar o build:

```sh
npm run preview
```

O preview serve para conferir localmente a saída gerada.

## Estrutura

```text
public/                     Arquivos públicos
src/
  assets/                   Recursos processados pelo Astro
  components/               Componentes reutilizáveis
  layouts/BaseLayout.astro  Documento HTML base e metadados
  layouts/InternalLayout.astro Header, rodapé e animações das páginas internas
  layouts/ServiceLayout.astro Estrutura editorial com seções condicionais
  components/ServiceCarousel.astro Banners progressivos da página geral
  components/ServiceVisual.astro Fotos e visual provisório identificado
  config/                   Navegação e configuração central do WhatsApp
  pages/index.astro         Home
  pages/servicos/           Página geral e três rotas estáticas individuais
  scripts/home.js           Revelação somente durante a rolagem
  styles/global.css         Estilos responsivos e acessibilidade
  styles/services.css       Complementos exclusivos das páginas internas
astro.config.mjs            Configuração de saída estática
```

O layout recebe as propriedades `title` e `description`, importa o CSS global
e inclui o componente reutilizável `src/components/WhatsAppContact.astro`.
Nas páginas de Serviços, o breadcrumb foi removido por completo. A página
geral mantém um h1 estático seguido de três banners com títulos h2, texto HTML,
links e visuais distintos. O carrossel começa sem troca automática, oferece
setas, indicadores e gestos horizontais. Com JavaScript, só o slide atual é
exibido; sem JavaScript, os três banners e links ficam visíveis. A transição
discreta usa CSS apenas quando não há preferência por movimento reduzido.
As páginas individuais usam abertura em duas colunas, explicação direta da
frente, situações de interesse, segmentos, forma de atendimento, FAQ,
serviços relacionados e WhatsApp específico. A falta de foto adequada para a
abertura de segurança está documentada em `docs/pendencias-conteudo.md`.
As pastas vazias usam `.gitkeep` para preservar a estrutura no Git.

Referência: [documentação do Astro](https://docs.astro.build/en/install-and-setup/).

## Contato e recursos visuais

**Configuração temporária para teste: substituir pelo telefone oficial antes
da publicação.** O único número está em `whatsappNumber`, no arquivo
`src/config/contact.js`, em formato internacional (DDI + DDD + número, apenas
dígitos). Não copiar o telefone para componentes ou outros arquivos.

Esse arquivo centraliza as mensagens geral, orçamento, segurança do trabalho,
medicina ocupacional e atendimento in loco. `getWhatsAppUrl` monta todos os
destinos com `encodeURIComponent`. Os CTAs “Fale conosco” e “Falar com a MVM
no WhatsApp” usam a mensagem geral; “Solicitar um orçamento” usa a mensagem
de orçamento; “Consultar atendimento in loco” usa a mensagem de in loco.
Os links abrem o WhatsApp em outra aba com o texto preenchido; o envio exige
ação do usuário. Os links dos cards da Home acessam as novas páginas de Serviços;
Sobre nós usa a âncora da Home enquanto a página própria está pendente.
Sem número válido, os CTAs usam a seção Contato e o botão final é desabilitado.

O botão flutuante abre somente por clique uma janela de contato não modal,
com quatro assuntos em seleção única. Nenhuma opção começa selecionada e
“Continuar no WhatsApp” permanece desabilitado até a seleção. “Outros assuntos”
usa a mensagem geral. Não há formulário, bot, indicadores de disponibilidade
ou simulação de conversa. O foco vai para o botão de fechar ao abrir e volta
ao botão flutuante ao fechar por ele, pelo botão de fechar ou por Escape.
A janela fechada usa `hidden`, removendo seus controles da navegação por teclado.

Os estilos são locais ao componente: janela branca de até 340px, margens de
ao menos 16px, respeito às safe areas e altura limitada com rolagem interna.
O verde fica no botão circular; seleção e foco usam detalhes vermelhos.
A entrada de 160ms só ocorre sem preferência por movimento reduzido.
A página continua rolando normalmente e a janela pode ser fechada a qualquer
momento. Sem JavaScript, o flutuante fica oculto e os CTAs continuam sendo links.

A marca tipográfica MVM é provisória até o fornecimento da logo oficial.
Foi preservada a fonte de sistema já definida no projeto. As fotos fornecidas
são ilustrativas e possuem legendas; não representam integrantes reais da equipe.
Os arquivos foram mantidos com seus nomes originais:

- Hero: `Profissional de saúde com tablet-1.png` (possui transparência).
- In loco: `Medição de pressão no atendimento ocupacional-2.png`.
- Sobre: `Colaboração em segurança e saúde ocupacional-3.png`.

O Astro gera versões responsivas das fotos. O hero tem carregamento prioritário;
as demais fotos usam lazy loading. As animações usam GSAP + ScrollTrigger via npm,
centralizados em `src/scripts/home.js`, sem CDN. O conteúdo é visível sem JavaScript
e a preferência de movimento reduzido elimina animações e rolagem suave.
Sem JavaScript, a navegação móvel permanece expandida com espaço reservado.
As páginas internas importam o mesmo módulo de animação, sem alterar seus
efeitos, duração, sequência, repetição ou tratamento de movimento reduzido.
Usam aberturas editoriais próprias e complementos de CSS restritos à classe
`internal-page`, preservando os estilos da Home.

Header e hero aparecem imediatamente, sem animação. Elementos já visíveis na
primeira dobra ou acima do scroll restaurado também permanecem estáticos.
Os demais elementos usam opacity de 0 a 1, deslocamento de 20px, duração de
0.9s e `power2.out`, com entrada quando o topo do elemento cruza 85% da viewport.
As entradas se repetem sem reload após retornar ao topo e descer novamente.
Foram removidos `once: true` dos triggers e o bloqueio permanente dos itens
já revelados: o estado é liberado somente quando o elemento sai por baixo
da viewport na subida, sem esconder conteúdo que ainda está visível.

Cards e etapas usam `ScrollTrigger.batch`, intervalo de coleta de 0.1s e
stagger de 0.15s. Não há agrupamento manual de linhas. Em telas de até 38rem,
o batch contém um item por vez. Cada item possui um único trigger. O estado
inicial é aplicado apenas abaixo da dobra, após a inicialização bem-sucedida;
isso evita que um item apareça e depois desapareça ao cruzar o ponto de disparo.
A visibilidade é conferida na coleta e no início real de cada item.
Cada trigger usa `start: 'top bottom'` e `end: 'top 85%'`: `onLeave` reproduz
a entrada na descida e `onLeaveBack` prepara a próxima entrada na subida,
comportamento equivalente compatível com batch, sem novos efeitos.
O reset interrompe tweens pendentes, restaura opacity 0 e y 20 apenas fora
da viewport e libera o registro de revelação; os atrasos se repetem.
Callbacks atrasados não ocultam itens visíveis nem itens com foco.
`onRefreshInit` neutraliza temporariamente y durante as medições; o próprio
ScrollTrigger reverte esse ajuste ao terminar o refresh.
Fontes e imagens pendentes solicitam refresh ao terminar, sem loop de refresh;
o ScrollTrigger recalcula as medidas ao redimensionar.

`gsap.matchMedia` respeita movimento reduzido. O foco encerra a animação do
elemento; links em fade-in ficam temporariamente inert e são restaurados ao fim.
Âncoras exibem imediatamente o conteúdo do destino. Falhas restauram a
visibilidade, e a limpeza remove tweens, triggers e listeners desta Home.
Os hovers dos cards usam a propriedade CSS `translate`, independente do
`transform` animado pelo GSAP. Não há pinning, scrub ou biblioteca de rolagem.

Documentação: [ScrollTrigger.batch](https://gsap.com/docs/v3/Plugins/ScrollTrigger/static.batch()/),
[matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/) e
[stagger](https://gsap.com/resources/getting-started/Staggers/).

O container mantém o limite de 1200px, com margens, tipografia e espaçamentos
fluidos. Cards passam de três para duas e uma coluna; etapas passam de quatro
para duas e uma. Texto e imagem são empilhados antes de ficarem apertados.
O menu usa a altura disponível da viewport, com rolagem interna em telas baixas.

A grade do hero centraliza o bloco textual em relação à composição do retrato
e círculo, limitada a 320px de largura e sem recortar ou distorcer a foto.
Um pequeno padding inferior compensa o espaço transparente superior do PNG.
A legenda ocupa uma segunda linha compartilhada por subgrid e não interfere
no alinhamento vertical das colunas. Em telas estreitas, o conteúdo é empilhado.
O padding vertical varia entre 40 e 56px; a compensação do header permanece
apenas no body. As animações existentes foram preservadas.

A validação visual em navegador ainda está pendente, incluindo as larguras de
320, 360, 390, 430, 768, 1024, 1366, 1440, 1920 e 2560px, retrato/paisagem,
rolagem lenta/rápida, foco, âncoras e movimento reduzido. Verificações em DOM
simulado conferem somente a lógica e não comprovam responsividade ou suavidade.

Para conferir a sequência GSAP, os estados durante o stagger e o HTML estático:

```sh
node scripts/verify-motion.mjs
```

O ajuste de repetição foi validado com duas descidas e retorno ao topo em DOM
simulado, incluindo reset individual fora da viewport, preservação de foco,
callbacks de batch atrasados e repetição do stagger de 0.15s. O build passou.
Sem navegador disponível na sessão, as duas descidas reais e a suavidade
visual ainda precisam ser conferidas no navegador.

Após o build, para conferir o WhatsApp de teste:

```sh
node scripts/verify-contact.mjs
```

Para conferir as rotas, metadados, links, mensagens e estados do menu de Serviços:

```sh
node scripts/verify-services.mjs
```

O build de Serviços gera cinco páginas (Home e quatro rotas de Serviços).
As verificações de menu e carrossel usam DOM simulado; não houve validação
visual em navegador nesta sessão e a conferência real permanece pendente.

Na implementação do contato, `npm run build` e os dois scripts de verificação
passaram. A verificação de contato confere a fonte única do telefone, os quatro
CTAs, as quatro opções com labels, as mensagens e sua codificação na saída
estática, além da preservação dos links internos. O JavaScript emitido pelo
Astro é executado em DOM simulado para conferir abertura somente por ação,
botão inicialmente desabilitado, seleção, Escape, fechamento, retorno de foco
e limpeza dos listeners. `window.open` é simulado: nenhum destino externo é
aberto e nenhuma mensagem real é enviada.

Não havia navegador disponível na sessão (a tentativa de abrir o navegador
integrado retornou indisponibilidade). Permanecem pendentes a conferência
visual em desktop/mobile e telas baixas, safe areas, ausência de overflow,
teclado nativo (Tab, setas, Espaço e Enter) e preferência de movimento reduzido
no componente. Os testes em DOM simulado não comprovam esses comportamentos.

No PowerShell, se `npm.ps1` estiver bloqueado, use `npm.cmd run build`.
Em ambientes que restringem escrita fora do projeto, execute o build com
`ASTRO_TELEMETRY_DISABLED=1` para evitar a criação da configuração global do Astro.
