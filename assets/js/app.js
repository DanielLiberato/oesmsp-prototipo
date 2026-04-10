const STATUS_OPTIONS = [
  "Encaminhado",
  "Contato pendente",
  "Tentativa sem resposta",
  "Acolhido",
  "Retorno agendado"
];

const SERVICE_CATALOG = [
  {
    key: "caps",
    label: "Acionar CAPS",
    shortLabel: "CAPS",
    description: "Referência clínica prioritária para acolhimento intensivo e definição de plano terapêutico."
  },
  {
    key: "ubs",
    label: "Notificar UBS",
    shortLabel: "UBS",
    description: "Reconexão territorial para acompanhamento pós-evento e continuidade do cuidado."
  },
  {
    key: "social",
    label: "Acionar assistência social",
    shortLabel: "Assistência social",
    description: "Apoio para vulnerabilidade social, barreiras de transporte e suporte familiar."
  },
  {
    key: "hospital",
    label: "Compartilhar alerta com hospital",
    shortLabel: "Hospital",
    description: "Devolver sinalização para alta protegida e pactuação de retorno quando necessário."
  }
];

document.addEventListener("DOMContentLoaded", async () => {
  if (!window.OESMSPData) {
    return;
  }

  const data = await window.OESMSPData.load();
  const page = document.body.dataset.page || "";

  hydrateGlobalChrome(data);

  const pageHandlers = {
    login: initLoginPage,
    dashboard: initDashboardPage,
    territories: initTerritoriesPage,
    patients: initPatientsPage,
    patient: initPatientPage,
    referral: initReferralPage,
    followup: initFollowupPage,
    impact: initImpactPage
  };

  if (pageHandlers[page]) {
    pageHandlers[page](data);
  }
});

function hydrateGlobalChrome(data) {
  setActiveNav(document.body.dataset.page || "");
  setGeneratedAt(data.indicators.generatedAt);
  setUserProfile(data.indicators.user);
  rewriteCaseLinks(data.indicators.mainCaseId);
}

function setActiveNav(page) {
  document.querySelectorAll("[data-nav]").forEach((link) => {
    link.classList.toggle("active", link.dataset.nav === page);
  });
}

function setGeneratedAt(value) {
  const node = document.getElementById("generatedAt");
  if (!node || !value) {
    return;
  }
  node.textContent = "Atualizado em " + formatDate(value, true);
}

function setUserProfile(user) {
  const name = document.getElementById("userProfileName");
  const role = document.getElementById("userProfileRole");
  if (name && user) {
    name.textContent = user.name;
  }
  if (role && user) {
    role.textContent = user.role + " • " + user.institution;
  }
}

function rewriteCaseLinks(patientId) {
  document.querySelectorAll("[data-case-link]").forEach((link) => {
    const page = link.dataset.caseLink;
    link.href = withCaseId(page, patientId);
  });
}

function withCaseId(page, patientId) {
  return page + "?id=" + encodeURIComponent(patientId);
}

function getCaseId(data) {
  const params = new URLSearchParams(window.location.search);
  return params.get("id") || data.indicators.mainCaseId;
}

function getPatientById(data, patientId) {
  return data.patients.find((patient) => patient.id === patientId) || data.patients[0];
}

function getTerritoryById(data, territoryId) {
  return data.territories.find((territory) => territory.id === territoryId) || data.territories[0];
}

function initLoginPage(data) {
  const disclaimer = document.getElementById("loginDisclaimer");
  if (disclaimer) {
    disclaimer.textContent = data.indicators.disclaimer;
  }
}

function initDashboardPage(data) {
  renderMetricCards(data.indicators.dashboardCards, document.getElementById("dashboardCards"));
  renderLineChart(
    document.getElementById("dashboardTrendChart"),
    data.indicators.trendSeries,
    "value",
    "casos priorizados",
    (value) => value
  );
  renderDashboardAlerts(data);
  renderQuickActions(data.indicators.quickActions, document.getElementById("quickActions"));
  renderTerritorySnapshot(data);
  renderDashboardCaseFocus(data);
}

function renderDashboardAlerts(data) {
  const container = document.getElementById("alertsList");
  if (!container) {
    return;
  }

  container.innerHTML = data.indicators.alerts
    .map((alert) => {
      return `
        <a class="alert-item" href="${withCaseId("paciente.html", alert.patientId)}">
          <div class="alert-head">
            <strong>${escapeHtml(alert.title)}</strong>
            <span class="chip chip-danger">${escapeHtml(alert.status)}</span>
          </div>
          <p>${escapeHtml(alert.description)}</p>
          <div class="meta-row">
            <span class="chip">${escapeHtml(alert.category)}</span>
            <span class="chip chip-soft">${escapeHtml(alert.territory)}</span>
          </div>
        </a>
      `;
    })
    .join("");
}

function renderQuickActions(actions, container) {
  if (!container) {
    return;
  }

  container.innerHTML = actions
    .map((action) => {
      return `
        <a class="action-card" href="${action.href}">
          <span class="action-eyebrow">Ação rápida</span>
          <strong>${escapeHtml(action.label)}</strong>
          <p>${escapeHtml(action.description)}</p>
        </a>
      `;
    })
    .join("");
}

function renderTerritorySnapshot(data) {
  const container = document.getElementById("territorySummary");
  if (!container) {
    return;
  }

  const topTerritories = data.territories
    .slice()
    .sort((left, right) => right.risco_medio - left.risco_medio)
    .slice(0, 3);

  container.innerHTML = `
    <div class="summary-grid">
      <div class="summary-stat">
        <span class="summary-label">Território mais crítico</span>
        <strong>${escapeHtml(data.indicators.territorialSummary.mostCritical)}</strong>
      </div>
      <div class="summary-stat">
        <span class="summary-label">Cobertura média da rede</span>
        <strong>${escapeHtml(data.indicators.territorialSummary.networkCoverage)}</strong>
      </div>
      <div class="summary-stat">
        <span class="summary-label">Fluxo intermunicipal</span>
        <strong>${escapeHtml(data.indicators.territorialSummary.crossFlow)}</strong>
      </div>
      <div class="summary-stat">
        <span class="summary-label">Desertos de atendimento</span>
        <strong>${escapeHtml(data.indicators.territorialSummary.deserts)}</strong>
      </div>
    </div>
    <div class="compact-list">
      ${topTerritories
        .map((territory) => {
          return `
            <div class="compact-item">
              <div>
                <strong>${escapeHtml(territory.regiao)}</strong>
                <span>${territory.casos_sem_seguimento} casos sem seguimento • cobertura ${territory.cobertura_rede}%</span>
              </div>
              <span class="score-badge ${riskClassByScore(territory.risco_medio)}">${territory.risco_medio}</span>
            </div>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderDashboardCaseFocus(data) {
  const container = document.getElementById("dashboardCaseFocus");
  if (!container) {
    return;
  }

  const patient = getPatientById(data, data.indicators.mainCaseId);
  const territory = getTerritoryById(data, patient.territorio_id);

  container.innerHTML = `
    <div class="case-focus-card">
      <div class="meta-row">
        <span class="chip chip-danger">Caso prioritário</span>
        <span class="chip chip-soft">${escapeHtml(territory.regiao)}</span>
      </div>
      <h3>${escapeHtml(patient.nome)}</h3>
      <p>${escapeHtml(patient.resumo)}</p>
      <div class="detail-pills">
        <span class="detail-pill">Score ${patient.score_risco}</span>
        <span class="detail-pill">${patient.recorrencia} recorrências</span>
        <span class="detail-pill">${patient.dias_sem_contato} dias sem contato</span>
      </div>
      <div class="button-row">
        <a class="button button-primary" href="${withCaseId("paciente.html", patient.id)}">Abrir caso</a>
        <a class="button button-secondary" href="${withCaseId("encaminhamento.html", patient.id)}">Acionar rede</a>
      </div>
    </div>
  `;
}

function initTerritoriesPage(data) {
  const filters = {
    municipio: document.getElementById("territoryMunicipioFilter"),
    sexo: document.getElementById("territorySexoFilter"),
    faixaEtaria: document.getElementById("territoryFaixaFilter"),
    recorrencia: document.getElementById("territoryRecorrenciaFilter"),
    seguimento: document.getElementById("territorySeguimentoFilter")
  };

  populateTerritoryMunicipalities(data.territories, filters.municipio);

  const state = {
    activeId: data.territories.slice().sort((left, right) => right.risco_medio - left.risco_medio)[0].id
  };

  Object.values(filters).forEach((input) => {
    if (input) {
      input.addEventListener("change", () => renderTerritoriesScene(data, filters, state));
    }
  });

  document.querySelectorAll("[data-region-target]").forEach((node) => {
    node.addEventListener("click", () => {
      state.activeId = node.dataset.regionTarget;
      renderTerritoriesScene(data, filters, state);
    });
  });

  renderTerritoriesScene(data, filters, state);
}

function populateTerritoryMunicipalities(territories, select) {
  if (!select) {
    return;
  }

  const municipalities = territories
    .flatMap((territory) => territory.municipios)
    .filter((city, index, list) => list.indexOf(city) === index)
    .sort((left, right) => left.localeCompare(right));

  select.innerHTML = `
    <option value="Todos">Todos os municípios</option>
    ${municipalities.map((city) => `<option value="${escapeHtml(city)}">${escapeHtml(city)}</option>`).join("")}
  `;
}

function renderTerritoriesScene(data, filters, state) {
  const filterState = {
    municipio: filters.municipio ? filters.municipio.value : "Todos",
    sexo: filters.sexo ? filters.sexo.value : "Todos",
    faixaEtaria: filters.faixaEtaria ? filters.faixaEtaria.value : "Todos",
    recorrencia: filters.recorrencia ? filters.recorrencia.value : "Todos",
    seguimento: filters.seguimento ? filters.seguimento.value : "Todos"
  };

  const computed = data.territories.map((territory) => {
    const result = computeTerritoryRisk(territory, filterState);
    return Object.assign({}, territory, result);
  });

  if (!computed.some((territory) => territory.id === state.activeId && !territory.muted)) {
    const firstAvailable = computed.find((territory) => !territory.muted) || computed[0];
    state.activeId = firstAvailable.id;
  }

  updateMapRegions(computed, state.activeId);
  renderTerritoryDetails(computed, state.activeId, filterState);
  renderTerritoryCards(computed, state.activeId);
}

function computeTerritoryRisk(territory, filters) {
  const values = [territory.risco_medio];

  if (filters.sexo !== "Todos") {
    values.push(territory.segments.sexo[filters.sexo]);
  }
  if (filters.faixaEtaria !== "Todos") {
    values.push(territory.segments.faixa_etaria[filters.faixaEtaria]);
  }
  if (filters.recorrencia !== "Todos") {
    values.push(territory.segments.recorrencia[filters.recorrencia]);
  }
  if (filters.seguimento !== "Todos") {
    values.push(territory.segments.seguimento_status[filters.seguimento]);
  }

  const municipioMatch = filters.municipio === "Todos" || territory.municipios.includes(filters.municipio);
  let risk = Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);

  if (!municipioMatch) {
    risk = Math.max(36, risk - 18);
  }

  return {
    filteredRisk: risk,
    muted: !municipioMatch
  };
}

function updateMapRegions(territories, activeId) {
  territories.forEach((territory) => {
    const region = document.querySelector('[data-region="' + territory.id + '"]');
    if (!region) {
      return;
    }

    region.style.setProperty("--region-fill", riskColor(territory.filteredRisk));
    region.classList.toggle("muted", territory.muted);
    region.classList.toggle("active", territory.id === activeId);

    const badge = document.querySelector('[data-region-badge="' + territory.id + '"]');
    if (badge) {
      badge.textContent = territory.filteredRisk;
      badge.className = "map-score " + riskClassByScore(territory.filteredRisk);
    }
  });
}

function renderTerritoryDetails(territories, activeId, filters) {
  const active = territories.find((territory) => territory.id === activeId) || territories[0];
  const details = document.getElementById("territoryDetail");
  const sideCards = document.getElementById("territorySideCards");
  const activeFilters = document.getElementById("territoryFilterSummary");

  if (details) {
    details.innerHTML = `
      <div class="meta-row">
        <span class="chip ${riskChipClass(active.filteredRisk)}">${escapeHtml(active.status)}</span>
        <span class="chip chip-soft">Risco ajustado ${active.filteredRisk}</span>
      </div>
      <h3>${escapeHtml(active.regiao)}</h3>
      <p>${escapeHtml(active.principal_alerta)}</p>
      <div class="detail-pills">
        ${active.municipios.map((city) => `<span class="detail-pill">${escapeHtml(city)}</span>`).join("")}
      </div>
      <div class="territory-highlight">
        <strong>${escapeHtml(active.lead_service)}</strong>
        <span>Serviço-sentinela para coordenação do seguimento neste recorte.</span>
      </div>
    `;
  }

  if (sideCards) {
    sideCards.innerHTML = `
      <div class="side-stat">
        <span class="side-label">Cobertura da rede</span>
        <strong>${active.cobertura_rede}%</strong>
        <small>CAPS ${escapeHtml(active.cobertura_caps)}</small>
      </div>
      <div class="side-stat">
        <span class="side-label">Fluxo intermunicipal</span>
        <strong>${active.fluxo_intermunicipal}%</strong>
        <small>Casos atravessando município de residência e atendimento</small>
      </div>
      <div class="side-stat">
        <span class="side-label">Áreas sob pressão</span>
        <strong>${active.areas_pressao}</strong>
        <small>Microáreas com atraso de retorno e alta demanda</small>
      </div>
      <div class="side-stat">
        <span class="side-label">Desertos de atendimento</span>
        <strong>${active.desertos_atendimento}</strong>
        <small>Setores com baixa absorção territorial</small>
      </div>
    `;
  }

  if (activeFilters) {
    activeFilters.textContent =
      "Filtros ativos: " +
      [
        filters.municipio !== "Todos" ? filters.municipio : "todos os municípios",
        filters.sexo !== "Todos" ? filters.sexo : "todos os sexos",
        filters.faixaEtaria !== "Todos" ? filters.faixaEtaria : "todas as faixas",
        filters.recorrencia !== "Todos" ? filters.recorrencia : "todos os perfis de recorrência",
        filters.seguimento !== "Todos" ? filters.seguimento : "todos os status de seguimento"
      ].join(" • ");
  }
}

function renderTerritoryCards(territories, activeId) {
  const container = document.getElementById("territoryCards");
  if (!container) {
    return;
  }

  container.innerHTML = territories
    .slice()
    .sort((left, right) => right.filteredRisk - left.filteredRisk)
    .map((territory) => {
      const meterWidth = Math.max(18, territory.filteredRisk);
      return `
        <button class="territory-card ${territory.id === activeId ? "active" : ""} ${territory.muted ? "muted" : ""}" data-card-region="${territory.id}">
          <div class="territory-card-head">
            <strong>${escapeHtml(territory.regiao)}</strong>
            <span class="score-badge ${riskClassByScore(territory.filteredRisk)}">${territory.filteredRisk}</span>
          </div>
          <p>${escapeHtml(territory.principal_alerta)}</p>
          <div class="meter">
            <span style="width:${meterWidth}%"></span>
          </div>
          <small>${territory.casos_sem_seguimento} casos sem seguimento • cobertura ${territory.cobertura_rede}%</small>
        </button>
      `;
    })
    .join("");

  container.querySelectorAll("[data-card-region]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelector('[data-region-target="' + button.dataset.cardRegion + '"]')?.click();
    });
  });
}

function initPatientsPage(data) {
  const summaryCards = [
    {
      label: "Risco alto",
      value: data.patients.filter((patient) => patient.score_risco >= 80).length,
      context: "Casos com score maior ou igual a 80",
      trend: "up",
      delta: "Foco assistencial"
    },
    {
      label: "Sem seguimento",
      value: data.patients.filter((patient) => isNoFollowUp(patient.seguimento_status)).length,
      context: "Pendência de contato ou retorno",
      trend: "up",
      delta: "Prioridade de busca ativa"
    },
    {
      label: "Recorrentes",
      value: data.patients.filter((patient) => patient.recorrencia >= 2).length,
      context: "Casos com dois ou mais eventos",
      trend: "neutral",
      delta: "Atenção longitudinal"
    },
    {
      label: "Pós-alta recente",
      value: data.patients.filter((patient) => patient.pos_alta_dias <= 7).length,
      context: "Janela crítica de continuidade",
      trend: "down",
      delta: "Meta de absorção em 7 dias"
    }
  ];

  renderMetricCards(summaryCards, document.getElementById("patientSummaryCards"), true);

  const state = {
    filter: "todos",
    query: ""
  };

  document.querySelectorAll("[data-patient-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-patient-filter]").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      state.filter = button.dataset.patientFilter;
      renderPatientsTable(data, state);
    });
  });

  const search = document.getElementById("patientSearch");
  if (search) {
    search.addEventListener("input", () => {
      state.query = search.value.trim().toLowerCase();
      renderPatientsTable(data, state);
    });
  }

  renderPatientsTable(data, state);
}

function renderPatientsTable(data, state) {
  const tableBody = document.getElementById("patientsTableBody");
  const emptyState = document.getElementById("patientsEmptyState");
  const tableWrap = document.getElementById("patientsTableWrap");

  if (!tableBody || !emptyState || !tableWrap) {
    return;
  }

  const filtered = data.patients.filter((patient) => {
    const matchesQuery =
      !state.query ||
      patient.id.toLowerCase().includes(state.query) ||
      patient.nome.toLowerCase().includes(state.query);

    const matchesFilter = {
      todos: true,
      risco: patient.score_risco >= 80,
      semSeguimento: isNoFollowUp(patient.seguimento_status),
      recorrente: patient.recorrencia >= 2,
      posAlta: patient.pos_alta_dias <= 7
    }[state.filter];

    return matchesQuery && matchesFilter;
  });

  filtered.sort((left, right) => right.score_risco - left.score_risco);

  if (!filtered.length) {
    tableWrap.classList.add("hidden");
    emptyState.classList.remove("hidden");
    return;
  }

  tableWrap.classList.remove("hidden");
  emptyState.classList.add("hidden");

  tableBody.innerHTML = filtered
    .map((patient) => {
      return `
        <tr>
          <td>${escapeHtml(patient.id)}</td>
          <td><strong>${escapeHtml(patient.nome)}</strong></td>
          <td>${patient.idade}</td>
          <td>${escapeHtml(patient.sexo)}</td>
          <td>${escapeHtml(patient.municipio_residencia)}</td>
          <td>${escapeHtml(patient.municipio_atendimento)}</td>
          <td><span class="score-badge ${riskClassByScore(patient.score_risco)}">${patient.score_risco}</span></td>
          <td>${patient.recorrencia}</td>
          <td>${formatDate(patient.ultima_ocorrencia)}</td>
          <td><span class="table-status ${statusClass(patient.seguimento_status)}">${escapeHtml(patient.seguimento_status)}</span></td>
          <td><a class="text-link" href="${withCaseId("paciente.html", patient.id)}">Ver caso</a></td>
        </tr>
      `;
    })
    .join("");
}

function isNoFollowUp(status) {
  return ["Pendente", "Sem contato", "Sem seguimento", "Tentativa sem resposta"].includes(status);
}

function initPatientPage(data) {
  const patient = getPatientById(data, getCaseId(data));
  const timeline = data.timeline[patient.id] || {};

  const title = document.getElementById("patientPageTitle");
  const subtitle = document.getElementById("patientPageSubtitle");
  if (title) {
    title.textContent = "Caso prioritário " + patient.nome;
  }
  if (subtitle) {
    subtitle.textContent = patient.resumo;
  }

  renderPatientHero(patient);
  renderPatientLists(patient);
  renderCaseTimeline(timeline.caseTimeline || buildFallbackTimeline(patient), document.getElementById("patientTimeline"));
  renderPatientRecommendation(patient);

  const actionButton = document.getElementById("patientActionButton");
  if (actionButton) {
    actionButton.href = withCaseId("encaminhamento.html", patient.id);
  }
}

function renderPatientHero(patient) {
  const container = document.getElementById("patientHero");
  if (!container) {
    return;
  }

  container.innerHTML = `
    <div>
      <div class="meta-row">
        <span class="chip ${riskChipClass(patient.score_risco)}">Risco ${escapeHtml(patient.risco)}</span>
        <span class="chip chip-soft">${escapeHtml(patient.status_atual)}</span>
        <span class="chip chip-soft">${escapeHtml(patient.prioridade)}</span>
      </div>
      <h2>${escapeHtml(patient.nome)}</h2>
      <p>${escapeHtml(patient.resumo)}</p>
      <div class="detail-pills">
        <span class="detail-pill">Score ${patient.score_risco}</span>
        <span class="detail-pill">${patient.recorrencia} recorrências</span>
        <span class="detail-pill">${patient.dias_sem_contato} dias sem contato</span>
        <span class="detail-pill">${patient.municipio_residencia} → ${patient.municipio_atendimento}</span>
      </div>
    </div>
    <div class="hero-side">
      <div class="hero-metric">
        <span class="hero-label">Status atual</span>
        <strong>${escapeHtml(patient.seguimento_status)}</strong>
      </div>
      <div class="hero-metric">
        <span class="hero-label">Pós-alta</span>
        <strong>${patient.pos_alta_dias} dias</strong>
      </div>
      <div class="hero-metric">
        <span class="hero-label">Responsável</span>
        <strong>${escapeHtml(patient.responsavel)}</strong>
      </div>
    </div>
  `;
}

function renderPatientLists(patient) {
  const cards = [
    {
      target: "patientRiskFactors",
      title: "Fatores de risco",
      items: patient.fatores_risco
    },
    {
      target: "patientRecentHistory",
      title: "Histórico recente",
      items: patient.historico_recente
    },
    {
      target: "patientSocialFactors",
      title: "Vulnerabilidades sociais",
      items: patient.vulnerabilidades_sociais
    },
    {
      target: "patientActivatedServices",
      title: "Serviços já acionados",
      items: patient.servicos_acionados
    }
  ];

  cards.forEach((card) => {
    const node = document.getElementById(card.target);
    if (!node) {
      return;
    }
    node.innerHTML = `
      <div class="panel-header">
        <div>
          <h3 class="panel-title">${card.title}</h3>
        </div>
      </div>
      <ul class="list">
        ${card.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
      </ul>
    `;
  });
}

function buildFallbackTimeline(patient) {
  return [
    {
      date: patient.ultima_ocorrencia,
      title: "Evento crítico registrado",
      type: "event",
      details: patient.resumo
    },
    {
      date: patient.ultima_ocorrencia,
      title: "Caso entrou na fila prioritária",
      type: "analysis",
      details: "Score " + patient.score_risco + " com prioridade " + patient.prioridade + "."
    }
  ];
}

function renderCaseTimeline(entries, container) {
  if (!container) {
    return;
  }

  const ordered = entries.slice().sort((left, right) => new Date(right.date) - new Date(left.date));
  container.innerHTML = ordered
    .map((entry) => {
      return `
        <article class="timeline-item timeline-${entry.type || "event"}">
          <span class="timeline-date">${formatDate(entry.date, true)}</span>
          <strong>${escapeHtml(entry.title)}</strong>
          <p>${escapeHtml(entry.details)}</p>
        </article>
      `;
    })
    .join("");
}

function renderPatientRecommendation(patient) {
  const recommendation = document.getElementById("patientRecommendation");
  const continuity = document.getElementById("patientContinuityAlert");

  if (recommendation) {
    recommendation.innerHTML = `
      <div class="panel-header">
        <div>
          <h3 class="panel-title">Recomendação analítica</h3>
          <p class="panel-subtitle">Síntese orientada por risco e continuidade do cuidado</p>
        </div>
      </div>
      <p>${escapeHtml(patient.analise_recomendada)}</p>
    `;
  }

  if (continuity) {
    continuity.innerHTML = `
      <div class="alert-inline">
        <span class="chip chip-warning">Continuidade do cuidado</span>
        <p>${escapeHtml(patient.alerta_continuidade)}</p>
      </div>
    `;
  }
}

function initReferralPage(data) {
  const patient = getPatientById(data, getCaseId(data));
  const timeline = data.timeline[patient.id] || {};
  const storedPlan = getStoredPlan(patient.id);
  const defaultServices = new Set((timeline.planTemplate?.services || []).map((service) => service.key));
  const summaryTarget = document.getElementById("planSummary");
  const feedbackTarget = document.getElementById("planFeedback");

  const title = document.getElementById("referralPageTitle");
  const subtitle = document.getElementById("referralPageSubtitle");
  if (title) {
    title.textContent = "Plano de seguimento • " + patient.nome;
  }
  if (subtitle) {
    subtitle.textContent = "Coordenação do cuidado entre CAPS, UBS, assistência social e retaguarda hospitalar.";
  }

  renderReferralPatientSummary(patient, timeline);
  renderServiceOptions(document.getElementById("serviceModules"), storedPlan, defaultServices);

  const deadlineInput = document.getElementById("returnDeadline");
  const priorityInput = document.getElementById("planPriority");
  const noteInput = document.getElementById("planObservation");

  if (deadlineInput) {
    deadlineInput.value = storedPlan?.returnDeadline || timeline.planTemplate?.returnDeadline || "2026-04-11";
  }
  if (priorityInput) {
    priorityInput.value = storedPlan?.priority || timeline.planTemplate?.priority || "Alta";
  }
  if (noteInput) {
    noteInput.value = storedPlan?.observation || timeline.planTemplate?.observation || "";
  }

  const form = document.getElementById("referralForm");
  if (form) {
    form.addEventListener("change", () => updatePlanSummary(summaryTarget, patient));
    form.addEventListener("input", () => updatePlanSummary(summaryTarget, patient));
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const selectedServices = getSelectedServices();
      if (!selectedServices.length) {
        if (feedbackTarget) {
          feedbackTarget.textContent = "Selecione ao menos um serviço para confirmar o plano.";
          feedbackTarget.className = "form-feedback error";
        }
        return;
      }

      const plan = {
        patientId: patient.id,
        services: selectedServices,
        returnDeadline: deadlineInput ? deadlineInput.value : "",
        priority: priorityInput ? priorityInput.value : "Alta",
        observation: noteInput ? noteInput.value.trim() : "",
        status: "Encaminhado",
        confirmedAt: new Date().toISOString(),
        history: appendHistory(storedPlan?.history, {
          date: new Date().toISOString(),
          title: "Plano de seguimento confirmado",
          type: "network",
          details: "Serviços acionados: " + selectedServices.map((service) => service.shortLabel).join(", ") + "."
        })
      };

      saveStoredPlan(patient.id, plan);
      window.location.href = withCaseId("acompanhamento.html", patient.id);
    });
  }

  updatePlanSummary(summaryTarget, patient);
}

function renderReferralPatientSummary(patient, timeline) {
  const summary = document.getElementById("referralPatientSummary");
  if (!summary) {
    return;
  }

  summary.innerHTML = `
    <div class="meta-row">
      <span class="chip ${riskChipClass(patient.score_risco)}">Score ${patient.score_risco}</span>
      <span class="chip chip-soft">${escapeHtml(patient.prioridade)}</span>
    </div>
    <h3>${escapeHtml(patient.nome)}</h3>
    <p>${escapeHtml(patient.resumo)}</p>
    <div class="compact-list">
      <div class="compact-item">
        <div>
          <strong>Status atual</strong>
          <span>${escapeHtml(patient.seguimento_status)} • ${patient.dias_sem_contato} dias sem contato</span>
        </div>
      </div>
      <div class="compact-item">
        <div>
          <strong>Território</strong>
          <span>${escapeHtml(patient.municipio_residencia)} → ${escapeHtml(patient.municipio_atendimento)}</span>
        </div>
      </div>
      <div class="compact-item">
        <div>
          <strong>Recomendação analítica</strong>
          <span>${escapeHtml(patient.analise_recomendada)}</span>
        </div>
      </div>
      <div class="compact-item">
        <div>
          <strong>Alerta de continuidade</strong>
          <span>${escapeHtml(timeline.delayAlert || patient.alerta_continuidade)}</span>
        </div>
      </div>
    </div>
  `;
}

function renderServiceOptions(container, storedPlan, defaultServices) {
  if (!container) {
    return;
  }

  const selected = new Set((storedPlan?.services || []).map((service) => service.key));
  if (!selected.size) {
    defaultServices.forEach((key) => selected.add(key));
  }

  container.innerHTML = SERVICE_CATALOG.map((service) => {
    const active = selected.has(service.key);
    return `
      <label class="service-tile ${active ? "active" : ""}">
        <input type="checkbox" name="service" value="${service.key}" ${active ? "checked" : ""}>
        <span class="service-title">${escapeHtml(service.label)}</span>
        <span class="service-text">${escapeHtml(service.description)}</span>
      </label>
    `;
  }).join("");

  container.querySelectorAll('input[name="service"]').forEach((input) => {
    input.addEventListener("change", () => {
      input.closest(".service-tile")?.classList.toggle("active", input.checked);
    });
  });
}

function getSelectedServices() {
  const checked = Array.from(document.querySelectorAll('input[name="service"]:checked'));
  return checked.map((input) => {
    const service = SERVICE_CATALOG.find((item) => item.key === input.value);
    return {
      key: service.key,
      label: service.label,
      shortLabel: service.shortLabel,
      description: service.description
    };
  });
}

function updatePlanSummary(container, patient) {
  if (!container) {
    return;
  }

  const services = getSelectedServices();
  const deadlineInput = document.getElementById("returnDeadline");
  const priorityInput = document.getElementById("planPriority");
  const noteInput = document.getElementById("planObservation");

  container.innerHTML = `
    <div class="summary-stat">
      <span class="summary-label">Status do plano</span>
      <strong>${services.length ? "Pronto para confirmação" : "Seleção incompleta"}</strong>
    </div>
    <div class="summary-stat">
      <span class="summary-label">Serviços acionados</span>
      <strong>${services.length ? services.map((service) => service.shortLabel).join(", ") : "Nenhum serviço selecionado"}</strong>
    </div>
    <div class="summary-stat">
      <span class="summary-label">Prazo de retorno</span>
      <strong>${deadlineInput && deadlineInput.value ? formatDate(deadlineInput.value) : "Não definido"}</strong>
    </div>
    <div class="summary-stat">
      <span class="summary-label">Prioridade</span>
      <strong>${priorityInput ? escapeHtml(priorityInput.value) : "Alta"}</strong>
    </div>
    <div class="summary-stat">
      <span class="summary-label">Observação</span>
      <strong>${noteInput && noteInput.value ? escapeHtml(noteInput.value) : "Sem observação adicional"}</strong>
    </div>
    <div class="summary-stat">
      <span class="summary-label">Caso</span>
      <strong>${escapeHtml(patient.nome)} • Score ${patient.score_risco}</strong>
    </div>
  `;
}

function initFollowupPage(data) {
  const patient = getPatientById(data, getCaseId(data));
  const timeline = data.timeline[patient.id] || {};
  const storedPlan = getStoredPlan(patient.id) || {};

  const title = document.getElementById("followupPageTitle");
  const subtitle = document.getElementById("followupPageSubtitle");
  if (title) {
    title.textContent = "Monitoramento do caso • " + patient.nome;
  }
  if (subtitle) {
    subtitle.textContent = "Acompanhar status do cuidado e reduzir ruptura após alta ou evento agudo.";
  }

  renderFollowupScene(patient, timeline, storedPlan);

  document.querySelectorAll("[data-status-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const nextStatus = button.dataset.statusAction;
      const plan = getStoredPlan(patient.id) || storedPlan || {};
      const updatedPlan = Object.assign({}, plan, {
        patientId: patient.id,
        status: nextStatus,
        history: appendHistory(plan.history, {
          date: new Date().toISOString(),
          title: nextStatus,
          type: statusEventType(nextStatus),
          details: statusEventDescription(nextStatus)
        })
      });
      saveStoredPlan(patient.id, updatedPlan);
      renderFollowupScene(patient, timeline, updatedPlan);
    });
  });
}

function renderFollowupScene(patient, timeline, storedPlan) {
  const currentStatus = storedPlan.status || normalizeFollowupStatus(timeline.currentStatus || patient.seguimento_status);
  const daysWithoutContact = resolveDaysWithoutContact(patient, currentStatus, timeline);
  const summaryCards = [
    {
      label: "Status do caso",
      value: currentStatus,
      context: "Situação mais recente registrada",
      trend: "neutral",
      delta: "Cuidado em curso"
    },
    {
      label: "Dias sem contato",
      value: daysWithoutContact,
      context: "Quanto maior, maior risco de ruptura",
      trend: daysWithoutContact >= 7 ? "up" : "down",
      delta: daysWithoutContact >= 7 ? "Acima da janela recomendada" : "Dentro da janela esperada"
    },
    {
      label: "Prazo de retorno",
      value: storedPlan.returnDeadline ? formatDate(storedPlan.returnDeadline) : "Não definido",
      context: "Prazo pactuado para reconexão do cuidado",
      trend: "neutral",
      delta: "Monitoramento territorial"
    },
    {
      label: "Responsável",
      value: timeline.responsibleTeam || patient.responsavel,
      context: "Ponto focal de seguimento",
      trend: "neutral",
      delta: "Coordenação de rede"
    }
  ];

  renderMetricCards(summaryCards, document.getElementById("followupSummaryCards"), true);
  renderFollowupStatus(currentStatus);
  renderFollowupPlan(patient, storedPlan, timeline, daysWithoutContact);
  renderCaseTimeline(buildFollowupTimeline(timeline, storedPlan), document.getElementById("followupTimeline"));

  const backButton = document.getElementById("backToDashboard");
  if (backButton) {
    backButton.href = "dashboard.html";
  }
}

function renderFollowupStatus(currentStatus) {
  const container = document.getElementById("followupStatusStrip");
  if (!container) {
    return;
  }

  container.innerHTML = STATUS_OPTIONS.map((status) => {
    return `
      <div class="status-step ${status === currentStatus ? "active" : ""}">
        <span class="status-index">${STATUS_OPTIONS.indexOf(status) + 1}</span>
        <strong>${escapeHtml(status)}</strong>
      </div>
    `;
  }).join("");
}

function renderFollowupPlan(patient, storedPlan, timeline, daysWithoutContact) {
  const summary = document.getElementById("followupPlanSummary");
  const alert = document.getElementById("followupAlert");
  const services = storedPlan.services || timeline.planTemplate?.services || [];

  if (summary) {
    summary.innerHTML = `
      <div class="panel-header">
        <div>
          <h3 class="panel-title">Plano de seguimento</h3>
          <p class="panel-subtitle">A alta não encerra o cuidado. O caso segue em monitoramento até absorção efetiva da rede.</p>
        </div>
      </div>
      <div class="compact-list">
        <div class="compact-item">
          <div>
            <strong>Serviços acionados</strong>
            <span>${services.length ? services.map((service) => service.shortLabel || service.name || service.label).join(", ") : "Plano ainda não confirmado"}</span>
          </div>
        </div>
        <div class="compact-item">
          <div>
            <strong>Prazo de retorno</strong>
            <span>${storedPlan.returnDeadline ? formatDate(storedPlan.returnDeadline) : timeline.planTemplate?.returnDeadline ? formatDate(timeline.planTemplate.returnDeadline) : "Não definido"}</span>
          </div>
        </div>
        <div class="compact-item">
          <div>
            <strong>Observação</strong>
            <span>${escapeHtml(storedPlan.observation || timeline.planTemplate?.observation || "Sem observação adicional.")}</span>
          </div>
        </div>
        <div class="compact-item">
          <div>
            <strong>Caso monitorado</strong>
            <span>${escapeHtml(patient.nome)} • ${patient.municipio_residencia} → ${patient.municipio_atendimento}</span>
          </div>
        </div>
      </div>
    `;
  }

  if (alert) {
    const tone = daysWithoutContact >= 7 ? "chip-danger" : "chip-success";
    const text =
      daysWithoutContact >= 7
        ? timeline.delayAlert || patient.alerta_continuidade
        : "Seguimento dentro da janela prevista. Manter monitoramento e confirmar acolhimento da rede.";

    alert.innerHTML = `
      <div class="alert-inline">
        <span class="chip ${tone}">Alerta de prazo</span>
        <p>${escapeHtml(text)}</p>
      </div>
    `;
  }
}

function buildFollowupTimeline(timeline, storedPlan) {
  const base = timeline.followUpTimeline || [];
  const history = storedPlan.history || [];
  return base.concat(history).sort((left, right) => new Date(right.date) - new Date(left.date));
}

function initImpactPage(data) {
  renderMetricCards(data.indicators.impactCards, document.getElementById("impactCards"), true);
  renderLineChart(
    document.getElementById("impactTrendChart"),
    data.indicators.impactSeries,
    "semSeguimento",
    "casos sem seguimento",
    (value) => value
  );
  renderProgressComparison(data.indicators.impactSeries, document.getElementById("impactAccessBars"));
  renderAverageTimeCards(data.indicators.impactSeries, document.getElementById("impactTimeCards"));
  renderInsightList(data.indicators.strategicInsights, document.getElementById("strategicInsights"), "insight");
  renderInsightList(data.indicators.recommendedPriorities, document.getElementById("recommendedPriorities"), "priority");
  renderCoveragePanel(data.territories, document.getElementById("coveragePanel"));
}

function renderProgressComparison(series, container) {
  if (!container) {
    return;
  }

  container.innerHTML = series
    .map((entry) => {
      return `
        <div class="progress-row">
          <div class="progress-head">
            <strong>${escapeHtml(entry.label)}</strong>
            <span>${entry.ate7dias}% em até 7 dias</span>
          </div>
          <div class="meter">
            <span style="width:${entry.ate7dias}%"></span>
          </div>
        </div>
      `;
    })
    .join("");
}

function renderAverageTimeCards(series, container) {
  if (!container) {
    return;
  }

  container.innerHTML = series
    .map((entry) => {
      return `
        <div class="time-card">
          <span>${escapeHtml(entry.label)}</span>
          <strong>${entry.tempoMedio.toFixed(1).replace(".", ",")} dias</strong>
          <small>Entre alta e primeiro contato</small>
        </div>
      `;
    })
    .join("");
}

function renderInsightList(items, container, tone) {
  if (!container) {
    return;
  }

  container.innerHTML = items
    .map((item) => {
      return `
        <article class="insight-card ${tone}">
          <p>${escapeHtml(item)}</p>
        </article>
      `;
    })
    .join("");
}

function renderCoveragePanel(territories, container) {
  if (!container) {
    return;
  }

  container.innerHTML = territories
    .slice()
    .sort((left, right) => right.cobertura_rede - left.cobertura_rede)
    .map((territory) => {
      return `
        <div class="compact-item">
          <div>
            <strong>${escapeHtml(territory.regiao)}</strong>
            <span>${territory.cobertura_rede}% de cobertura • ${territory.status}</span>
          </div>
          <span class="score-badge ${riskClassByScore(100 - territory.cobertura_rede)}">${territory.cobertura_rede}%</span>
        </div>
      `;
    })
    .join("");
}

function renderMetricCards(cards, container, compact) {
  if (!container) {
    return;
  }

  container.innerHTML = cards
    .map((card) => {
      const toneClass = card.tone ? "tone-" + card.tone : "";
      const trendClass = card.trend ? "trend-" + card.trend : "";
      return `
        <article class="metric-card ${toneClass}">
          <span class="metric-label">${escapeHtml(card.label)}</span>
          <strong class="metric-value ${compact ? "compact" : ""}">${escapeHtml(String(card.value))}</strong>
          <p class="metric-context">${escapeHtml(card.context || card.detail || "")}</p>
          <span class="metric-delta ${trendClass}">${escapeHtml(card.delta || "")}</span>
        </article>
      `;
    })
    .join("");
}

function renderLineChart(container, series, key, caption, formatter) {
  if (!container || !series.length) {
    return;
  }

  const values = series.map((entry) => entry[key]);
  const max = Math.max.apply(null, values);
  const min = Math.min.apply(null, values);
  const width = 700;
  const height = 280;
  const padding = 36;
  const span = Math.max(1, max - min);

  const points = series.map((entry, index) => {
    const x = padding + ((width - padding * 2) / Math.max(1, series.length - 1)) * index;
    const y = height - padding - ((entry[key] - min) / span) * (height - padding * 2);
    return { x, y, label: entry.label, value: entry[key] };
  });

  const polyline = points.map((point) => point.x + "," + point.y).join(" ");
  const area = ["M " + padding + " " + (height - padding)]
    .concat(points.map((point) => "L " + point.x + " " + point.y))
    .concat("L " + points[points.length - 1].x + " " + (height - padding))
    .concat("Z")
    .join(" ");

  container.innerHTML = `
    <div class="chart-caption">${escapeHtml(caption)}</div>
    <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeHtml(caption)}">
      <defs>
        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="rgba(26,115,232,0.26)" />
          <stop offset="100%" stop-color="rgba(26,115,232,0)" />
        </linearGradient>
      </defs>
      <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" class="chart-axis"></line>
      <path d="${area}" class="chart-area"></path>
      <polyline points="${polyline}" class="chart-line"></polyline>
      ${points
        .map((point) => {
          return `
            <g class="chart-point-group">
              <circle cx="${point.x}" cy="${point.y}" r="5.5" class="chart-point"></circle>
              <text x="${point.x}" y="${point.y - 14}" class="chart-value">${escapeHtml(String(formatter(point.value)))}</text>
              <text x="${point.x}" y="${height - 10}" class="chart-label">${escapeHtml(point.label)}</text>
            </g>
          `;
        })
        .join("")}
    </svg>
  `;
}

function riskColor(score) {
  if (score >= 85) {
    return "#d9544d";
  }
  if (score >= 75) {
    return "#f2a93b";
  }
  if (score >= 65) {
    return "#5f94cb";
  }
  return "#b8cee5";
}

function riskClassByScore(score) {
  if (score >= 85) {
    return "risk-high";
  }
  if (score >= 75) {
    return "risk-medium";
  }
  if (score >= 65) {
    return "risk-watch";
  }
  return "risk-low";
}

function riskChipClass(score) {
  const riskClass = riskClassByScore(score);
  return {
    "risk-high": "chip-danger",
    "risk-medium": "chip-warning",
    "risk-watch": "chip-primary",
    "risk-low": "chip-soft"
  }[riskClass];
}

function statusClass(status) {
  const map = {
    Pendente: "status-warning",
    "Sem contato": "status-danger",
    "Sem seguimento": "status-danger",
    "Tentativa sem resposta": "status-danger",
    Encaminhado: "status-primary",
    Acolhido: "status-success",
    "Retorno agendado": "status-success",
    "Contato pendente": "status-warning"
  };
  return map[status] || "status-neutral";
}

function normalizeFollowupStatus(status) {
  if (status === "Pendente" || status === "Sem seguimento" || status === "Sem contato") {
    return "Contato pendente";
  }
  if (STATUS_OPTIONS.includes(status)) {
    return status;
  }
  return "Encaminhado";
}

function resolveDaysWithoutContact(patient, status, timeline) {
  const base = timeline.daysWithoutContact || patient.dias_sem_contato || 0;
  const map = {
    Encaminhado: Math.max(3, base - 4),
    "Contato pendente": base,
    "Tentativa sem resposta": base + 1,
    Acolhido: 0,
    "Retorno agendado": 1
  };
  return map[status];
}

function statusEventType(status) {
  return {
    Encaminhado: "network",
    "Contato pendente": "analysis",
    "Tentativa sem resposta": "alert",
    Acolhido: "event",
    "Retorno agendado": "network"
  }[status];
}

function statusEventDescription(status) {
  return {
    Encaminhado: "Plano distribuído para a rede e aguardando absorção territorial.",
    "Contato pendente": "Contato inicial priorizado, aguardando confirmação da equipe de referência.",
    "Tentativa sem resposta": "Busca ativa realizada sem retorno do usuário até o momento.",
    Acolhido: "Acolhimento confirmado por serviço da rede com continuidade pactuada.",
    "Retorno agendado": "Retorno programado no território e monitoramento compartilhado ativo."
  }[status];
}

function getStoredPlan(patientId) {
  try {
    const raw = localStorage.getItem("oesmsp-plan-" + patientId);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
}

function saveStoredPlan(patientId, plan) {
  localStorage.setItem("oesmsp-plan-" + patientId, JSON.stringify(plan));
}

function appendHistory(history, entry) {
  const items = Array.isArray(history) ? history.slice() : [];
  const alreadyExists = items.some((item) => item.title === entry.title);
  if (!alreadyExists) {
    items.push(entry);
  }
  return items;
}

function formatDate(value, withTime) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const options = withTime
    ? { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }
    : { day: "2-digit", month: "2-digit", year: "numeric" };

  return new Intl.DateTimeFormat("pt-BR", options).format(date);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
