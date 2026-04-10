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

## Como abrir localmente

Opção mais simples:

1. Abra `index.html` diretamente no navegador.
2. Navegue entre as telas usando o menu lateral e os botões do fluxo principal.

Observação:

- O protótipo funciona em `file://` porque usa fallback local em JavaScript.
- Os arquivos JSON em `assets/data/` permanecem no projeto para edição e referência dos dados fictícios.

## Screenshots para apresentação

Foi incluído um script para capturar screenshots de todas as telas:

```bash
node scripts/capture-screenshots.mjs
```

O script:

- sobe um servidor HTTP local temporário em `http://127.0.0.1:4173`;
- percorre todas as páginas do protótipo;
- salva as imagens na pasta `screenshots/`.

Requisito para o script:

- ter `chromium`, `chromium-browser`, `google-chrome` ou `google-chrome-stable` disponível no `PATH`.

## Observações importantes

- Todos os dados exibidos são fictícios e foram criados apenas para fins acadêmicos e demonstrativos.
- Nenhum dado real de paciente foi utilizado.
- A interatividade é simulada e não depende de backend, APIs externas, build ou bibliotecas de terceiros.
