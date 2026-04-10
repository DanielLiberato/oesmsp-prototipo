(function () {
  const DEMO_INDICATORS = {
    systemName: "OESM-SP",
    subtitle: "Observatório Estratégico de Saúde Mental de São Paulo",
    disclaimer: "Ambiente demonstrativo com dados fictícios para fins acadêmicos.",
    generatedAt: "2026-04-09T09:30:00-03:00",
    mainCaseId: "PCT-001",
    user: {
      name: "Marina Torres",
      role: "Coordenação Estadual de Saúde Mental",
      institution: "SES-SP"
    },
    dashboardCards: [
      {
        id: "highRisk",
        label: "Pacientes em alto risco",
        value: 38,
        delta: "+6 vs. semana anterior",
        trend: "up",
        context: "16 com deslocamento intermunicipal"
      },
      {
        id: "noFollowUp",
        label: "Casos sem seguimento em 7 dias",
        value: 14,
        delta: "-3 após mutirão regional",
        trend: "down",
        context: "Maior pressão na Zona Leste Metropolitana"
      },
      {
        id: "criticalTerritories",
        label: "Territórios críticos",
        value: 3,
        delta: "1 novo território em alerta",
        trend: "up",
        context: "Foco em cobertura e fluxo intermunicipal"
      },
      {
        id: "pendingReferrals",
        label: "Encaminhamentos pendentes",
        value: 22,
        delta: "9 com prioridade clínica e social",
        trend: "neutral",
        context: "CAPS, UBS e assistência social"
      }
    ],
    trendSeries: [
      { label: "Sem 1", value: 28 },
      { label: "Sem 2", value: 31 },
      { label: "Sem 3", value: 29 },
      { label: "Sem 4", value: 34 },
      { label: "Sem 5", value: 36 },
      { label: "Sem 6", value: 38 }
    ],
    alerts: [
      {
        title: "A. S. M. sem acolhimento após alta psiquiátrica",
        category: "Alto risco",
        territory: "Zona Leste Metropolitana",
        status: "Ação imediata",
        patientId: "PCT-001",
        description: "Score 92, recorrência 3, 8 dias sem contato e residência fora do município de atendimento."
      },
      {
        title: "Aumento de rupturas no eixo Diadema-Santo André",
        category: "Fluxo intermunicipal",
        territory: "Eixo Sul e Grande ABC",
        status: "Monitorar 72h",
        patientId: "PCT-002",
        description: "Crescimento de 14% em casos com pós-alta recente e seguimento pendente."
      },
      {
        title: "Microáreas com baixa cobertura de CAPS III",
        category: "Deserto de atendimento",
        territory: "Alto Tietê",
        status: "Prioridade regional",
        patientId: "PCT-003",
        description: "Quatro microáreas concentram atraso de retorno e sobrecarga de referência hospitalar."
      }
    ],
    quickActions: [
      {
        label: "Abrir lista priorizada",
        href: "pacientes.html",
        description: "Ordenar casos por risco, recorrência e ausência de seguimento"
      },
      {
        label: "Explorar territórios críticos",
        href: "territorios.html",
        description: "Visualizar zonas sob pressão assistencial e desertos de atendimento"
      },
      {
        label: "Acionar caso prioritário",
        href: "paciente.html?id=PCT-001",
        description: "Entrar direto no caso com maior score de risco desta semana"
      },
      {
        label: "Ver painel de impacto",
        href: "impacto.html",
        description: "Acompanhar redução de ruptura de cuidado e ganho de cobertura"
      }
    ],
    territorialSummary: {
      mostCritical: "Zona Leste Metropolitana",
      networkCoverage: "72%",
      crossFlow: "18%",
      deserts: "4 microáreas",
      highPressure: "3 regiões"
    },
    impactCards: [
      {
        label: "Redução de casos sem seguimento",
        value: "18%",
        detail: "Comparado ao ciclo anterior",
        tone: "success"
      },
      {
        label: "Pacientes acompanhados em até 7 dias",
        value: "71%",
        detail: "Meta pactuada de 75%",
        tone: "primary"
      },
      {
        label: "Territórios com melhora de cobertura",
        value: "3",
        detail: "Com expansão de resposta local",
        tone: "warning"
      },
      {
        label: "Tempo médio entre alta e primeiro contato",
        value: "4,9 dias",
        detail: "Queda de 1,6 dia no trimestre",
        tone: "primary"
      }
    ],
    impactSeries: [
      { label: "Jan", semSeguimento: 148, ate7dias: 54, tempoMedio: 6.5 },
      { label: "Fev", semSeguimento: 141, ate7dias: 59, tempoMedio: 6.1 },
      { label: "Mar", semSeguimento: 133, ate7dias: 64, tempoMedio: 5.7 },
      { label: "Abr", semSeguimento: 126, ate7dias: 68, tempoMedio: 5.3 },
      { label: "Mai", semSeguimento: 122, ate7dias: 70, tempoMedio: 5.1 },
      { label: "Jun", semSeguimento: 121, ate7dias: 71, tempoMedio: 4.9 }
    ],
    strategicInsights: [
      "A combinação entre recorrência, pós-alta recente e barreira territorial explica a maior parte dos casos com ruptura de seguimento.",
      "O ganho de cobertura foi mais consistente onde CAPS e UBS passaram a operar com plano único de retorno em até 72 horas.",
      "Fluxos intermunicipais continuam pressionando os territórios de fronteira e devem orientar pactuações regionais."
    ],
    recommendedPriorities: [
      "Ampliar resposta de seguimento rápido na Zona Leste Metropolitana com foco em alta hospitalar recente.",
      "Padronizar plano de acionamento entre CAPS, UBS e assistência social para casos de prioridade clínica e social.",
      "Monitorar semanalmente microáreas com deserto de atendimento e apoiar redistribuição regional de vagas."
    ]
  };

  const DEMO_TERRITORIES = [
    {
      id: "ZL",
      regiao: "Zona Leste Metropolitana",
      municipios: ["São Paulo", "Itaquaquecetuba", "Ferraz de Vasconcelos"],
      risco_medio: 84,
      casos_sem_seguimento: 127,
      cobertura_caps: "Baixa",
      cobertura_rede: 61,
      fluxo_intermunicipal: 24,
      desertos_atendimento: 4,
      pressao_assistencial: "Muito alta",
      status: "Crítico",
      areas_pressao: 9,
      principal_alerta: "Alta hospitalar sem absorção rápida pela rede territorial.",
      lead_service: "CAPS III Itaim Paulista",
      segments: {
        sexo: { Todos: 84, Feminino: 86, Masculino: 81 },
        faixa_etaria: { Todos: 84, "15-24": 88, "25-39": 86, "40-59": 80, "60+": 73 },
        recorrencia: { Todos: 84, Recorrente: 91, "Primeiro evento": 74 },
        seguimento_status: { Todos: 84, "Sem seguimento": 92, "Em seguimento": 76 }
      }
    },
    {
      id: "ABC",
      regiao: "Eixo Sul e Grande ABC",
      municipios: ["Diadema", "Santo André", "São Bernardo do Campo", "Mauá"],
      risco_medio: 79,
      casos_sem_seguimento: 93,
      cobertura_caps: "Média",
      cobertura_rede: 69,
      fluxo_intermunicipal: 19,
      desertos_atendimento: 2,
      pressao_assistencial: "Alta",
      status: "Sob pressão",
      areas_pressao: 6,
      principal_alerta: "Fluxo intermunicipal crescente no pós-alta e vagas concentradas em poucos serviços.",
      lead_service: "CAPS AD Regional ABC",
      segments: {
        sexo: { Todos: 79, Feminino: 77, Masculino: 82 },
        faixa_etaria: { Todos: 79, "15-24": 74, "25-39": 83, "40-59": 81, "60+": 70 },
        recorrencia: { Todos: 79, Recorrente: 87, "Primeiro evento": 69 },
        seguimento_status: { Todos: 79, "Sem seguimento": 88, "Em seguimento": 71 }
      }
    },
    {
      id: "AT",
      regiao: "Alto Tietê",
      municipios: ["Suzano", "Mogi das Cruzes", "Poá"],
      risco_medio: 76,
      casos_sem_seguimento: 81,
      cobertura_caps: "Baixa",
      cobertura_rede: 64,
      fluxo_intermunicipal: 17,
      desertos_atendimento: 4,
      pressao_assistencial: "Alta",
      status: "Sob pressão",
      areas_pressao: 5,
      principal_alerta: "Deslocamento prolongado para atendimento especializado e retorno tardio à atenção básica.",
      lead_service: "CAPS II Mogi das Cruzes",
      segments: {
        sexo: { Todos: 76, Feminino: 78, Masculino: 74 },
        faixa_etaria: { Todos: 76, "15-24": 82, "25-39": 79, "40-59": 74, "60+": 67 },
        recorrencia: { Todos: 76, Recorrente: 84, "Primeiro evento": 68 },
        seguimento_status: { Todos: 76, "Sem seguimento": 85, "Em seguimento": 70 }
      }
    },
    {
      id: "CE",
      regiao: "Centro Expandido",
      municipios: ["São Paulo", "Osasco"],
      risco_medio: 63,
      casos_sem_seguimento: 52,
      cobertura_caps: "Média",
      cobertura_rede: 74,
      fluxo_intermunicipal: 11,
      desertos_atendimento: 1,
      pressao_assistencial: "Moderada",
      status: "Atenção",
      areas_pressao: 3,
      principal_alerta: "Alta rotatividade entre serviços de urgência e baixa adesão ao retorno programado.",
      lead_service: "CAPS Sé",
      segments: {
        sexo: { Todos: 63, Feminino: 61, Masculino: 65 },
        faixa_etaria: { Todos: 63, "15-24": 67, "25-39": 66, "40-59": 62, "60+": 58 },
        recorrencia: { Todos: 63, Recorrente: 71, "Primeiro evento": 56 },
        seguimento_status: { Todos: 63, "Sem seguimento": 75, "Em seguimento": 58 }
      }
    },
    {
      id: "NN",
      regiao: "Eixo Norte-Noroeste",
      municipios: ["Guarulhos", "Barueri", "Carapicuíba"],
      risco_medio: 68,
      casos_sem_seguimento: 61,
      cobertura_caps: "Média",
      cobertura_rede: 72,
      fluxo_intermunicipal: 15,
      desertos_atendimento: 2,
      pressao_assistencial: "Moderada",
      status: "Observação",
      areas_pressao: 4,
      principal_alerta: "Demanda de média complexidade deslocada para hospitais de referência da capital.",
      lead_service: "CAPS Guarulhos Norte",
      segments: {
        sexo: { Todos: 68, Feminino: 66, Masculino: 71 },
        faixa_etaria: { Todos: 68, "15-24": 72, "25-39": 70, "40-59": 69, "60+": 60 },
        recorrencia: { Todos: 68, Recorrente: 76, "Primeiro evento": 59 },
        seguimento_status: { Todos: 68, "Sem seguimento": 79, "Em seguimento": 62 }
      }
    },
    {
      id: "BS",
      regiao: "Baixada Santista Referenciada",
      municipios: ["Santos", "Praia Grande", "São Vicente"],
      risco_medio: 58,
      casos_sem_seguimento: 37,
      cobertura_caps: "Boa",
      cobertura_rede: 81,
      fluxo_intermunicipal: 9,
      desertos_atendimento: 1,
      pressao_assistencial: "Controlada",
      status: "Estável",
      areas_pressao: 2,
      principal_alerta: "Monitorar continuidade de cuidado para usuários que retornam à capital após internação.",
      lead_service: "CAPS III Santos",
      segments: {
        sexo: { Todos: 58, Feminino: 57, Masculino: 60 },
        faixa_etaria: { Todos: 58, "15-24": 60, "25-39": 62, "40-59": 55, "60+": 53 },
        recorrencia: { Todos: 58, Recorrente: 65, "Primeiro evento": 49 },
        seguimento_status: { Todos: 58, "Sem seguimento": 68, "Em seguimento": 52 }
      }
    }
  ];

  const DEMO_PATIENTS = [
    {
      id: "PCT-001",
      nome: "A. S. M.",
      idade: 24,
      sexo: "Feminino",
      municipio_residencia: "Itaquaquecetuba",
      municipio_atendimento: "São Paulo",
      risco: "Alto",
      score_risco: 92,
      recorrencia: 3,
      ultima_ocorrencia: "2026-03-28",
      seguimento_status: "Pendente",
      status_atual: "Pós-alta recente",
      pos_alta_dias: 4,
      dias_sem_contato: 8,
      prioridade: "Clínica e social",
      responsavel: "Núcleo Regional Leste",
      territorio_id: "ZL",
      fatores_risco: ["Evento recorrente", "Pós-alta recente", "Deslocamento intermunicipal", "Tentativa prévia sem vínculo territorial"],
      historico_recente: ["Alta hospitalar em leito psiquiátrico de hospital geral", "Duas passagens por urgência em 30 dias", "Contato telefônico sem sucesso após a alta"],
      vulnerabilidades_sociais: ["Moradia com alta rotatividade familiar", "Renda instável", "Dependência de transporte intermunicipal"],
      servicos_acionados: ["Hospital geral de referência", "CAPS III em pré-alerta", "Apoio matricial solicitado à UBS"],
      analise_recomendada: "Acionar plano intensivo de seguimento em até 24 horas, com CAPS III, UBS de referência e assistência social articulados pelo território de residência.",
      alerta_continuidade: "A alta hospitalar não encerra o cuidado. A ausência de acolhimento em até 7 dias eleva o risco de nova ruptura.",
      resumo: "Caso com alta prioridade por recorrência, vulnerabilidade social e cuidado fragmentado entre municípios."
    },
    {
      id: "PCT-002",
      nome: "J. R. P.",
      idade: 39,
      sexo: "Masculino",
      municipio_residencia: "Diadema",
      municipio_atendimento: "Santo André",
      risco: "Alto",
      score_risco: 89,
      recorrencia: 4,
      ultima_ocorrencia: "2026-04-02",
      seguimento_status: "Sem contato",
      status_atual: "Pós-alta recente",
      pos_alta_dias: 2,
      dias_sem_contato: 6,
      prioridade: "Clínica",
      responsavel: "Coordenação Regional ABC",
      territorio_id: "ABC",
      fatores_risco: ["Recorrência elevada", "Retorno frequente à urgência", "Baixa adesão a plano anterior"],
      historico_recente: ["Internação breve em hospital municipal", "Encaminhamento não absorvido pelo CAPS de origem"],
      vulnerabilidades_sociais: ["Desemprego recente", "Rede de apoio fragilizada"],
      servicos_acionados: ["Hospital municipal", "CAPS AD regional"],
      analise_recomendada: "Recomenda-se coordenação regional imediata com pactuação entre município de residência e município de atendimento.",
      alerta_continuidade: "Sem primeiro contato efetivo após alta nas últimas 72 horas.",
      resumo: "Fluxo intermunicipal persistente com recorrência e baixa adesão."
    },
    {
      id: "PCT-003",
      nome: "M. C. L.",
      idade: 17,
      sexo: "Feminino",
      municipio_residencia: "Ferraz de Vasconcelos",
      municipio_atendimento: "São Paulo",
      risco: "Alto",
      score_risco: 86,
      recorrencia: 2,
      ultima_ocorrencia: "2026-04-01",
      seguimento_status: "Retorno agendado",
      status_atual: "Em monitoramento",
      pos_alta_dias: 6,
      dias_sem_contato: 2,
      prioridade: "Clínica e social",
      responsavel: "Apoio territorial Alto Tietê",
      territorio_id: "AT",
      fatores_risco: ["Adolescente em pós-alta", "Deslocamento prolongado", "Recorrência recente"],
      historico_recente: ["Alta de observação psiquiátrica", "Encaminhamento para UBS e CAPS infantojuvenil"],
      vulnerabilidades_sociais: ["Baixa renda", "Dependência de cuidador para deslocamento"],
      servicos_acionados: ["CAPS IJ", "UBS de referência"],
      analise_recomendada: "Manter retorno protegido e monitorar comparecimento no território de residência.",
      alerta_continuidade: "Necessário confirmar acolhimento familiar e transporte para retorno.",
      resumo: "Caso com risco alto e retorno agendado, porém com barreiras de acesso."
    },
    {
      id: "PCT-004",
      nome: "D. T. S.",
      idade: 52,
      sexo: "Masculino",
      municipio_residencia: "São Paulo",
      municipio_atendimento: "São Paulo",
      risco: "Alto",
      score_risco: 84,
      recorrencia: 3,
      ultima_ocorrencia: "2026-03-25",
      seguimento_status: "Pendente",
      status_atual: "Sem seguimento",
      pos_alta_dias: 9,
      dias_sem_contato: 9,
      prioridade: "Clínica",
      responsavel: "Coordenação Centro Expandido",
      territorio_id: "CE",
      fatores_risco: ["Uso frequente de pronto atendimento", "Recorrência trimestral", "Adesão irregular"],
      historico_recente: ["Duas visitas à urgência em março", "Plano anterior expirado sem retorno"],
      vulnerabilidades_sociais: ["Moradia temporária", "Fragilidade de rede familiar"],
      servicos_acionados: ["Pronto atendimento", "CAPS Sé em observação"],
      analise_recomendada: "Rever plano anterior e reativar vínculo territorial com busca ativa compartilhada.",
      alerta_continuidade: "Nove dias sem contato após evento agudo.",
      resumo: "Caso urbano com alta circulação em serviços e baixa retenção em cuidado continuado."
    },
    {
      id: "PCT-005",
      nome: "L. P. N.",
      idade: 31,
      sexo: "Feminino",
      municipio_residencia: "Mauá",
      municipio_atendimento: "São Bernardo do Campo",
      risco: "Alto",
      score_risco: 82,
      recorrencia: 2,
      ultima_ocorrencia: "2026-04-04",
      seguimento_status: "Encaminhado",
      status_atual: "Aguardando contato",
      pos_alta_dias: 3,
      dias_sem_contato: 3,
      prioridade: "Clínica e social",
      responsavel: "Coordenação Regional ABC",
      territorio_id: "ABC",
      fatores_risco: ["Pós-alta recente", "Histórico de abandono", "Cuidado fora do município de residência"],
      historico_recente: ["Alta de observação em São Bernardo", "UBS de residência ainda sem confirmação"],
      vulnerabilidades_sociais: ["Instabilidade habitacional", "Cuidados de criança pequena no domicílio"],
      servicos_acionados: ["CAPS II", "UBS de referência"],
      analise_recomendada: "Contato em até 48 horas e plano compartilhado entre UBS e CAPS.",
      alerta_continuidade: "Plano acionado, aguardando confirmação de absorção territorial.",
      resumo: "Caso de fronteira municipal com risco alto e necessidade de coordenação rápida."
    },
    {
      id: "PCT-006",
      nome: "R. A. F.",
      idade: 46,
      sexo: "Masculino",
      municipio_residencia: "Osasco",
      municipio_atendimento: "São Paulo",
      risco: "Médio-alto",
      score_risco: 79,
      recorrencia: 1,
      ultima_ocorrencia: "2026-03-30",
      seguimento_status: "Tentativa sem resposta",
      status_atual: "Monitoramento ativo",
      pos_alta_dias: 7,
      dias_sem_contato: 7,
      prioridade: "Social",
      responsavel: "Núcleo Oeste Integrado",
      territorio_id: "CE",
      fatores_risco: ["Tentativa de contato frustrada", "Baixa cobertura social", "Retorno não confirmado"],
      historico_recente: ["Alta de observação psiquiátrica", "Busca telefônica sem sucesso"],
      vulnerabilidades_sociais: ["Trabalho informal", "Mudanças frequentes de telefone"],
      servicos_acionados: ["UBS", "Equipe de apoio social"],
      analise_recomendada: "Reforçar busca ativa territorial e atualizar referência comunitária.",
      alerta_continuidade: "Persistem 7 dias sem contato efetivo.",
      resumo: "Caso com risco moderado-alto e dificuldade de localização para seguimento."
    },
    {
      id: "PCT-007",
      nome: "E. V. C.",
      idade: 28,
      sexo: "Feminino",
      municipio_residencia: "Suzano",
      municipio_atendimento: "Mogi das Cruzes",
      risco: "Médio-alto",
      score_risco: 77,
      recorrencia: 2,
      ultima_ocorrencia: "2026-04-05",
      seguimento_status: "Retorno agendado",
      status_atual: "Acompanhamento territorial",
      pos_alta_dias: 2,
      dias_sem_contato: 1,
      prioridade: "Clínica",
      responsavel: "Coordenação Alto Tietê",
      territorio_id: "AT",
      fatores_risco: ["Recorrência recente", "Necessidade de apoio matricial"],
      historico_recente: ["Encaminhamento conjunto CAPS/UBS", "Retorno pactuado para 72 horas"],
      vulnerabilidades_sociais: ["Dependência de transporte coletivo"],
      servicos_acionados: ["CAPS II", "UBS", "Assistência social"],
      analise_recomendada: "Manter retorno protegido e verificar comparecimento no prazo.",
      alerta_continuidade: "Baixo risco de ruptura se o retorno ocorrer no prazo.",
      resumo: "Caso em melhor condição de seguimento, mas ainda dependente de coordenação intersetorial."
    },
    {
      id: "PCT-008",
      nome: "B. G. O.",
      idade: 63,
      sexo: "Masculino",
      municipio_residencia: "Carapicuíba",
      municipio_atendimento: "Barueri",
      risco: "Médio-alto",
      score_risco: 75,
      recorrencia: 1,
      ultima_ocorrencia: "2026-03-21",
      seguimento_status: "Sem contato",
      status_atual: "Pós-evento sem vínculo",
      pos_alta_dias: 13,
      dias_sem_contato: 10,
      prioridade: "Social",
      responsavel: "Eixo Norte-Noroeste",
      territorio_id: "NN",
      fatores_risco: ["Idoso com baixa adesão", "Sem confirmação de retorno", "Dependência de cuidador"],
      historico_recente: ["Alta clínica associada a demanda em saúde mental", "Sem registro de acolhimento local"],
      vulnerabilidades_sociais: ["Cuidador eventual", "Baixa renda"],
      servicos_acionados: ["Hospital de apoio", "UBS em pendência"],
      analise_recomendada: "Ativar UBS e assistência social para reduzir risco de abandono pós-evento.",
      alerta_continuidade: "Mais de 10 dias sem contato registrado.",
      resumo: "Caso de idoso com barreira de acesso e seguimento insuficiente."
    },
    {
      id: "PCT-009",
      nome: "T. H. B.",
      idade: 35,
      sexo: "Feminino",
      municipio_residencia: "Santos",
      municipio_atendimento: "São Paulo",
      risco: "Médio-alto",
      score_risco: 73,
      recorrencia: 2,
      ultima_ocorrencia: "2026-03-29",
      seguimento_status: "Acolhido",
      status_atual: "Em cuidado compartilhado",
      pos_alta_dias: 8,
      dias_sem_contato: 0,
      prioridade: "Clínica",
      responsavel: "Apoio Baixada Santista",
      territorio_id: "BS",
      fatores_risco: ["Fluxo regional", "Recorrência moderada"],
      historico_recente: ["Acolhimento confirmado em CAPS III Santos", "Retorno em UBS agendado"],
      vulnerabilidades_sociais: ["Apoio familiar parcial"],
      servicos_acionados: ["CAPS III Santos", "UBS"],
      analise_recomendada: "Manter monitoramento leve e checar adesão ao retorno programado.",
      alerta_continuidade: "Sem alertas críticos no momento.",
      resumo: "Caso estabilizado após acolhimento rápido e pactuação regional."
    },
    {
      id: "PCT-010",
      nome: "N. D. Q.",
      idade: 22,
      sexo: "Masculino",
      municipio_residencia: "Guarulhos",
      municipio_atendimento: "São Paulo",
      risco: "Médio-alto",
      score_risco: 71,
      recorrencia: 1,
      ultima_ocorrencia: "2026-04-03",
      seguimento_status: "Encaminhado",
      status_atual: "Aguardando acolhimento",
      pos_alta_dias: 3,
      dias_sem_contato: 3,
      prioridade: "Clínica",
      responsavel: "Coordenação Norte",
      territorio_id: "NN",
      fatores_risco: ["Jovem em primeiro ciclo crítico", "Deslocamento pendular para atendimento"],
      historico_recente: ["Encaminhamento da urgência para CAPS de referência"],
      vulnerabilidades_sociais: ["Inserção laboral instável"],
      servicos_acionados: ["CAPS", "UBS"],
      analise_recomendada: "Garantir primeiro acolhimento em até 5 dias para evitar escalada de risco.",
      alerta_continuidade: "Caso ainda dentro da janela recomendada de contato.",
      resumo: "Caso novo com risco moderado-alto e necessidade de retenção precoce."
    },
    {
      id: "PCT-011",
      nome: "C. F. R.",
      idade: 41,
      sexo: "Feminino",
      municipio_residencia: "São Bernardo do Campo",
      municipio_atendimento: "Santo André",
      risco: "Médio-alto",
      score_risco: 69,
      recorrencia: 3,
      ultima_ocorrencia: "2026-03-26",
      seguimento_status: "Sem seguimento",
      status_atual: "Ruptura de plano",
      pos_alta_dias: 11,
      dias_sem_contato: 11,
      prioridade: "Social",
      responsavel: "Coordenação Regional ABC",
      territorio_id: "ABC",
      fatores_risco: ["Plano anterior expirado", "Recorrência trimestral"],
      historico_recente: ["Sem comparecimento ao retorno pactuado", "Ausência de confirmação de busca ativa"],
      vulnerabilidades_sociais: ["Sobrecarga de cuidado familiar"],
      servicos_acionados: ["UBS", "CAPS II em pendência"],
      analise_recomendada: "Reativar plano com apoio social e redefinir ponto focal de acompanhamento.",
      alerta_continuidade: "Ruptura prolongada de seguimento.",
      resumo: "Caso com recorrência e perda de vínculo após retorno perdido."
    },
    {
      id: "PCT-012",
      nome: "V. M. E.",
      idade: 58,
      sexo: "Masculino",
      municipio_residencia: "São Paulo",
      municipio_atendimento: "São Paulo",
      risco: "Médio",
      score_risco: 67,
      recorrencia: 1,
      ultima_ocorrencia: "2026-03-19",
      seguimento_status: "Acolhido",
      status_atual: "Seguimento estável",
      pos_alta_dias: 15,
      dias_sem_contato: 0,
      prioridade: "Clínica",
      responsavel: "Centro Expandido",
      territorio_id: "CE",
      fatores_risco: ["Baixa adesão prévia"],
      historico_recente: ["Acolhido em CAPS e com retorno confirmado na UBS"],
      vulnerabilidades_sociais: ["Rede familiar restrita"],
      servicos_acionados: ["CAPS", "UBS"],
      analise_recomendada: "Manter acompanhamento de rotina com monitoramento mensal.",
      alerta_continuidade: "Sem alertas críticos.",
      resumo: "Caso estabilizado com seguimento local confirmado."
    }
  ];

  const DEMO_TIMELINE = {
    "PCT-001": {
      responsibleTeam: "Núcleo Regional Leste / Apoiadora de rede",
      daysWithoutContact: 8,
      currentStatus: "Contato pendente",
      delayAlert: "Alta hospitalar não acompanhada por contato efetivo em até 7 dias.",
      caseTimeline: [
        {
          date: "2026-03-28T21:10:00-03:00",
          title: "Alta hospitalar com indicação de seguimento intensivo",
          type: "event",
          details: "Saída de leito psiquiátrico em hospital geral. Residência em Itaquaquecetuba e atendimento de referência em São Paulo."
        },
        {
          date: "2026-03-29T08:15:00-03:00",
          title: "Score de risco recalculado para 92",
          type: "analysis",
          details: "Recorrência, pós-alta recente, barreira territorial e vulnerabilidade social ampliaram a prioridade do caso."
        },
        {
          date: "2026-03-29T10:40:00-03:00",
          title: "CAPS III sinalizado em pré-alerta",
          type: "network",
          details: "Equipe regional registrou necessidade de acolhimento intensivo em até 24 horas após confirmação de referência."
        },
        {
          date: "2026-03-31T15:05:00-03:00",
          title: "Tentativa de contato sem resposta",
          type: "alert",
          details: "Ligação não completada e ausência de retorno. Caso mantido na fila prioritária de seguimento."
        },
        {
          date: "2026-04-04T09:20:00-03:00",
          title: "Alerta de continuidade emitido",
          type: "alert",
          details: "Sem acolhimento confirmado em até 7 dias. Sistema recomenda plano integrado CAPS, UBS e assistência social."
        }
      ],
      followUpTimeline: [
        {
          date: "2026-04-05T08:30:00-03:00",
          title: "Caso priorizado para monitoramento pós-alta",
          type: "analysis",
          details: "Painel executivo destacou o caso entre os pacientes com maior risco de ruptura."
        },
        {
          date: "2026-04-06T11:20:00-03:00",
          title: "Coordenação regional solicitou acionamento integrado",
          type: "network",
          details: "Indicação de comunicação simultânea entre CAPS, UBS do território e assistência social."
        }
      ],
      planTemplate: {
        services: [
          {
            key: "caps",
            name: "CAPS III Itaim Paulista",
            description: "Acolhimento intensivo e definição de referência clínica em até 24 horas."
          },
          {
            key: "ubs",
            name: "UBS Jardim Romano",
            description: "Contato territorial para reconexão do cuidado e apoio à adesão."
          },
          {
            key: "social",
            name: "CRAS Jardim Helena",
            description: "Apoio para barreiras sociais, transporte e retaguarda familiar."
          }
        ],
        returnDeadline: "2026-04-11",
        priority: "Alta",
        observation: "Realizar primeiro contato articulado com território de residência e registrar retorno em até 72 horas."
      }
    }
  };

  const FALLBACK_BUNDLE = {
    indicators: DEMO_INDICATORS,
    territories: DEMO_TERRITORIES,
    patients: DEMO_PATIENTS,
    timeline: DEMO_TIMELINE
  };

  function clone(data) {
    return JSON.parse(JSON.stringify(data));
  }

  async function fetchJson(path) {
    const response = await fetch(path, { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Falha ao carregar " + path);
    }
    return response.json();
  }

  async function load() {
    if (window.__OESM_DATA__) {
      return clone(window.__OESM_DATA__);
    }

    if (window.location.protocol !== "file:" && typeof fetch === "function") {
      try {
        const [indicators, patients, territories, timeline] = await Promise.all([
          fetchJson("assets/data/indicadores.json"),
          fetchJson("assets/data/pacientes.json"),
          fetchJson("assets/data/territorios.json"),
          fetchJson("assets/data/timeline.json")
        ]);
        window.__OESM_DATA__ = { indicators, patients, territories, timeline };
        return clone(window.__OESM_DATA__);
      } catch (error) {
        console.warn("OESM-SP: usando fallback local embutido.", error);
      }
    }

    window.__OESM_DATA__ = clone(FALLBACK_BUNDLE);
    return clone(window.__OESM_DATA__);
  }

  window.OESMSPData = {
    load: load,
    fallback: clone(FALLBACK_BUNDLE)
  };
})();
