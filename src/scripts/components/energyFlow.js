// Interactive "How Solar Works" animated energy flow simulation
export function initEnergyFlow() {
  const stageCards = document.querySelectorAll('.flow-node');
  const stageDetailsContainer = document.getElementById('flow-stage-details');

  const stagesInfo = {
    1: {
      title: 'Stage 1: Photon Capture & Irradiance',
      summary: 'Sunlight strikes the anti-reflective glass surface of high-purity silicon wafers. Photons knock electrons free from silicon atoms, generating a continuous flow of Direct Current (DC) electricity.',
      metric1Label: 'Photon Absorption',
      metric1Value: '98.4%',
      metric2Label: 'Operating Temp Coeff',
      metric2Value: '-0.29% / °C',
      status: 'Active Irradiance: 1,000 W/m² (STC Standard)'
    },
    2: {
      title: 'Stage 2: Photovoltaic Generation (DC Power)',
      summary: 'Conductive silver busbars and micro-fingers collect the energized electrons across the cell matrix, routing raw DC power through sealed junction boxes and high-grade shielded cabling.',
      metric1Label: 'Cell Type',
      metric1Value: 'N-Type TOPCon Mono',
      metric2Label: 'Module Efficiency',
      metric2Value: '22.8% Nominal',
      status: 'Direct Current (DC): 48.2V @ 11.4A per string'
    },
    3: {
      title: 'Stage 3: Smart Inverter Conversion (DC ➔ AC)',
      summary: 'The intelligent micro-inverter or central hybrid inverter converts erratic DC electricity into clean, synchronized 120V/240V Alternating Current (AC) power matching utility grid wave standards.',
      metric1Label: 'Conversion Efficiency',
      metric1Value: '99.2% CEC Peak',
      metric2Label: 'Grid Harmonic Distortion',
      metric2Value: '< 1.8% THD',
      status: 'Pure Sine Wave Output: 240V AC @ 60Hz'
    },
    4: {
      title: 'Stage 4: Intelligent Distribution & Storage',
      summary: 'Clean electricity flows into your main electrical distribution panel, powering your lighting, HVAC, servers, and appliances in real-time. Excess energy charges high-density lithium storage batteries.',
      metric1Label: 'Self-Consumption Rate',
      metric1Value: '85 - 100%',
      metric2Label: 'Switchover Latency',
      metric2Value: '< 10 Milliseconds',
      status: 'Primary Load: Zero Carbon Local Consumption'
    },
    5: {
      title: 'Stage 5: Bi-Directional Grid Interconnection',
      summary: 'Surplus clean solar power beyond local demand flows seamlessly back into the utility grid. Smart bi-directional net meters track every kilowatt-hour exported, crediting your monthly utility account.',
      metric1Label: 'Net Metering Credit',
      metric1Value: '1:1 Retail / Avoided Cost',
      metric2Label: 'Grid Resiliency',
      metric2Value: 'Anti-Islanding Compliant',
      status: 'Surplus Export: Active Grid Revenue Stream'
    }
  };

  function selectStage(stageNum) {
    stageCards.forEach((card) => {
      if (card.dataset.stage === String(stageNum)) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });

    const info = stagesInfo[stageNum];
    if (stageDetailsContainer && info) {
      stageDetailsContainer.innerHTML = `
        <div class="stage-info-card animate-fade-in">
          <div class="stage-header">
            <span class="stage-badge">Phase 0${stageNum}</span>
            <h4 class="stage-title">${info.title}</h4>
          </div>
          <p class="stage-desc">${info.summary}</p>
          <div class="stage-metrics-grid">
            <div class="stage-metric-box">
              <span class="m-label">${info.metric1Label}</span>
              <span class="m-val">${info.metric1Value}</span>
            </div>
            <div class="stage-metric-box">
              <span class="m-label">${info.metric2Label}</span>
              <span class="m-val">${info.metric2Value}</span>
            </div>
          </div>
          <div class="stage-telemetry">
            <span class="telemetry-dot"></span>
            <span class="telemetry-text">${info.status}</span>
          </div>
        </div>
      `;
    }
  }

  stageCards.forEach((card) => {
    card.addEventListener('click', () => {
      const stage = card.dataset.stage;
      selectStage(stage);
    });
  });

  // Auto select stage 1 initially
  selectStage(1);
}
