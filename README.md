# OESM-SP — Observatório Estratégico de Saúde Mental de São Paulo

Protótipo web local, de alta fidelidade, desenvolvido em HTML, CSS e JavaScript puros para simular a experiência de uso de uma plataforma pública de saúde mental orientada por dados.

O objetivo do protótipo é materializar uma solução complementar aos sistemas existentes, com foco em:

- integração de dados assistenciais, epidemiológicos e territoriais;
- priorização de pacientes de maior risco;
- visualização territorial de áreas críticas e desertos de atendimento;
- coordenação do cuidado entre CAPS, UBS, assistência social e hospitais;
- monitoramento pós-alta e redução de ruptura no cuidado.

## Estrutura do projeto

```text
oesmsp-prototipo/
  index.html
  dashboard.html
  territorios.html
  pacientes.html
  paciente.html
  encaminhamento.html
  acompanhamento.html
  impacto.html
  README.md
  screenshots/
  assets/
    css/
      styles.css
    js/
      app.js
      data-loader.js
    data/
      indicadores.json
      pacientes.json
      territorios.json
      timeline.json
    img/
      logo.svg
      empty-state.svg
  scripts/
    capture-screenshots.mjs
```

## Telas do protótipo

1. `index.html`
   Acesso institucional com apresentação da proposta de valor do OESM-SP.
2. `dashboard.html`
   Painel executivo com indicadores, tendência, alertas prioritários, ações rápidas e resumo territorial.
3. `territorios.html`
   Visão territorial com mapa simulado de risco, filtros e leitura de desigualdade de cobertura.
4. `pacientes.html`
   Lista de pacientes priorizados com busca local, filtros e navegação para o detalhe do caso.
5. `paciente.html`
   Detalhe do paciente com score de risco, histórico, vulnerabilidades, serviços acionados e timeline.
6. `encaminhamento.html`
   Tela de acionamento da rede com plano de seguimento, prioridade, prazo e observações.
7. `acompanhamento.html`
   Monitoramento do caso com status visual, timeline pós-evento, alertas e resumo do plano confirmado.
8. `impacto.html`
   Painel executivo de impacto com métricas estratégicas, tendências e prioridades recomendadas.

## Como testar localmente no macOS

O projeto é um protótipo estático em HTML, CSS e JavaScript. Para uma demonstração rápida, não é necessário subir servidor web.

### Opção 1: abrir o HTML diretamente

Use esta opção para navegar pelo protótipo e validar as telas sem instalar nada.

1. No Finder, abra a pasta do projeto.
2. Dê duplo clique em `index.html`.
3. Navegue entre as telas usando o menu lateral e os botões do fluxo principal.

Também é possível abrir pelo Terminal:

```bash
open index.html
```

Nesta opção, o navegador abre o projeto como `file://`. Isso funciona porque o JavaScript possui um conjunto de dados demonstrativos embutido como fallback.

Importante: ao abrir por `file://`, alterações feitas apenas nos arquivos JSON de `assets/data/` não serão carregadas pelo navegador. Para testar mudanças nesses JSON, use a opção com servidor local.

### Opção 2: subir servidor local com Node

Use esta opção quando quiser testar o projeto em `http://localhost`, validar alterações nos arquivos JSON de `assets/data/` ou reproduzir um ambiente mais próximo de hospedagem estática.

Pré-requisito:

- Node.js instalado no macOS.

Com Node instalado, execute:

```bash
npm run serve
```

Depois abra no navegador:

```text
http://127.0.0.1:4173
```

Para parar o servidor, pressione `Ctrl+C` no Terminal.

Observação: `npm install` não é necessário para rodar `npm run serve`, porque o servidor local usa apenas recursos nativos do Node. A instalação das dependências só é necessária para gerar screenshots automatizados.

## Screenshots para apresentação

Foi incluído um fluxo simples de captura com Puppeteer.

### Instalação da dependência mínima

```bash
npm install
```

Isso instala apenas a dependência necessária para automação de navegador e deixa o projeto pronto para captura local.

### Como executar a captura

```bash
npm run screenshots
```

O script:

- sobe um servidor HTTP local temporário automaticamente;
- abre cada tela em viewport desktop `1440x900`;
- espera apenas o necessário para a interface terminar de hidratar;
- ajusta a altura da captura para evitar cortes;
- salva os arquivos PNG em `screenshots/`.

### Arquivos gerados

Os arquivos são salvos com nomes organizados:

- `screenshots/01-login.png`
- `screenshots/02-dashboard.png`
- `screenshots/03-territorios.png`
- `screenshots/04-pacientes.png`
- `screenshots/05-paciente.png`
- `screenshots/06-encaminhamento.png`
- `screenshots/07-acompanhamento.png`
- `screenshots/08-impacto.png`

Observação:

- Não é necessário abrir o servidor manualmente para a captura, porque o script já cria uma instância temporária local.
- Em Linux muito enxuto, o navegador headless pode exigir bibliotecas do sistema. Pacotes comuns em Debian/Ubuntu:
  `libatk1.0-0 libatk-bridge2.0-0 libxdamage1 libgbm1 libxkbcommon0 libatspi2.0-0 fonts-liberation`

## Observações importantes

- Todos os dados exibidos são fictícios e foram criados apenas para fins acadêmicos e demonstrativos.
- Nenhum dado real de paciente foi utilizado.
- A interatividade é simulada e não depende de backend, APIs externas, build ou bibliotecas de terceiros.
