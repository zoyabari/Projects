/* ---------- scroll-spy ---------- */

const sections = document.querySelectorAll('main .section, .intro');
const navLinks = document.querySelectorAll('.nav a');

const spy = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });

sections.forEach(section => {
  if (section.id) spy.observe(section);
});

/* ---------- project data ---------- */

const projectsData = [
  {
    id: 'power-chain',
    group: 'digital-twin',
    shortTitle: 'Power Chain',
    title: 'Industrial Control System Digital Twin: Power Chain',
    image: 'Industrial Control System Digital Twin/Power Chain/images/electrical_diagram.png',
    description: `
      <p>The power chain models a three-phase AC source through a six-diode rectifier down to a 24V DC instrumentation bus, achieving 96.7% simulated efficiency with a full component-level loss breakdown validated against hand calculations.</p>
      <p>Rather than modelling every sensor at component level, the simulation uses a deliberate abstraction strategy required for the assignment: each sensor tier is aggregated into a single equivalent resistive load block in Simscape, with resistance calculated from <code>R = V² / P_nom</code> at the 24V DC bus. This allows the full 74-channel sensor network to be represented realistically in terms of power consumption without the computational overhead of 74 individual signal chains.</p>
      <p>I referenced my load values from real hardware datasheets. PLC power budgets are taken directly from the Siemens S7-1200 System Manual V4.3 Tables A-47 and A-52, docking loads from the Atlas Copco LT5-15 and Blue Logic Subsea-USB product catalogues, and sensor power values are derived uniformly from the ISA-5.1 4–20 mA standard, giving <code>P_max = 24V × 20mA = 480mW</code> per standard channel, with justified exceptions for bridge sensors, FBG interrogators, and discrete sensors.</p>
      <p>The highlight of this model is a custom PID controller, written from scratch as a MATLAB Function block, which continuously regulates the Buck converter output voltage by computing incremental duty cycle adjustments rather than absolute values, a deliberate design choice that inherently avoids the integral accumulation behaviour encountered with positional PID implementations, eliminating the need for explicit anti-windup clamping.</p>
      <p>The final controller achieves approximately ten times better voltage regulation than the open-loop converter with no efficiency penalty.</p>
      <p>One unexpected discovery arose during model validation: the Simscape three-phase voltage source uses internal modelling assumptions that differ from the simplified textbook rectifier equations, meaning the theoretical 284V source setting did not produce the expected DC output. The correct value was determined through empirical iteration to achieve the required operating point.</p>
    `,
    link: 'https://github.com/zoyabari/projects/tree/main/Industrial%20Control%20System%20Digital%20Twin/Power%20Chain'
  },
  {
    id: 'plc-sis',
    group: 'digital-twin',
    shortTitle: 'PLC / SIS Simulation',
    title: 'Industrial Control System Digital Twin: PLC / SIS Simulation',
    image: 'Industrial Control System Digital Twin/PLC and SIS Simulation/images/plc_diagram.png',
    description: `
      <p>For the control and automation portion of the underwater habitat project, I developed a software-in-the-loop Simulink model of a dual-PLC architecture, separating the habitat's safety functions from its normal process-control functions.</p>
      <p>The system is modelled around two Siemens S7-1200 CPU 1214C controllers assigned separate roles:</p>
      <ul>
        <li><strong>Safety Instrumented System (SIS):</strong> critical alarms, voting logic, emergency interlocks, and protective actions</li>
        <li><strong>Basic Process Control System (BPCS):</strong> docking, pressurisation, charger sequencing, and normal process-control functions</li>
      </ul>
      <p>The SIS and BPCS were implemented as separate subsystems, following IEC 61508 functional-segregation principles.</p>

      <h5>Sensor Architecture</h5>
      <p>The complete instrumentation system contains 45 sensors represented by 74 individual measurement channels. The sensor network was divided into four tiers according to the consequence of failure.</p>

      <p class="tier-meta">Tier 1: Life-Critical Sensors · 2oo3 · HFT 2 · SIL 3 · 26 channels</p>
      <ul><li>Oxygen concentration</li><li>Carbon dioxide concentration</li><li>Hydrogen concentration</li><li>Hull differential pressure</li><li>Docking pressure</li><li>Internal habitat pressure</li><li>Smoke detection</li></ul>

      <p class="tier-meta">Tier 2: Structural and Flood Protection · 1oo2 · HFT 1 · SIL 2 · 23 channels</p>
      <ul><li>External pressure</li><li>Leak detection</li><li>Internal habitat pressure</li></ul>

      <p class="tier-meta">Tier 3: Infrastructure and Availability · 2oo2 · HFT 1 · SIL 1 · 17 channels</p>
      <ul><li>Battery state of charge</li><li>Communications health</li><li>Power and infrastructure status</li></ul>

      <p class="tier-meta">Tier 4: Environmental Monitoring · single channel · 8 channels</p>
      <ul><li>Zone temperature</li><li>Relative humidity</li><li>Water quality</li><li>Dew point</li></ul>

      <h5>Sensor Modelling</h5>
      <p>Analogue sensors were modelled as first-order dynamic systems: <code>G(s) = K / (τs + 1)</code>, where:</p>
      <ul>
        <li><code>K</code> represents the sensor electrical transfer characteristic</li>
        <li><code>τ</code> is derived from manufacturer <code>T90</code> response times</li>
        <li>4–20 mA sensor gains are derived from their physical measurement range</li>
        <li>Analogue channels include simulated ADC quantisation</li>
        <li>Discrete sensors such as smoke detectors and leak strips use threshold-based logic</li>
      </ul>

      <h5>Safety Voting &amp; Interlock Logic</h5>
      <p>The SIS subsystem implements the voting logic for each safety tier before generating alarms and protective commands. Implemented outputs include <code>T1_ALARM</code>, <code>T2_ALARM</code>, <code>SIS_EMERG_VENT</code>, <code>SIS_CLOSE_HATCH</code>, and Tier 3 infrastructure status.</p>
      <p>Faults were deliberately injected into the model using Step inputs. At <code>t = 7s</code>, a hull differential-pressure fault and a leak condition are introduced, and <code>T1_ALARM</code>, <code>T2_ALARM</code>, <code>SIS_EMERG_VENT</code>, and <code>SIS_CLOSE_HATCH</code> all change from <code>0 → 1</code>.</p>

      <h5>SIS / BPCS Functional Segregation</h5>
      <p>The architecture separates safety functions from normal process-control functions.</p>
      <p><strong>SIS:</strong> critical sensor inputs, voting logic, safety alarms, emergency ventilation, hatch isolation, protective interlocks.</p>
      <p><strong>BPCS:</strong> docking sequence, moon-pool pressurisation, charger start sequence, normal operational permissives, <code>DOCK_ENABLE</code>.</p>
      <p>During the simulated SIS fault at <code>t = 7s</code>, the BPCS <code>DOCK_ENABLE</code> signal remains at logic <code>1</code>.</p>

      <h5>Redundant Industrial Network</h5>
      <p>The communication architecture uses a redundant PROFINET star topology. The network includes:</p>
      <ul><li>Two network switches</li><li>Redundant communication paths</li><li>Distributed I/O nodes</li><li>Separate SIS and BPCS PLC connections</li><li>Instrumentation nodes distributed throughout the habitat</li><li>Fibre-optic telemetry connection towards shore</li></ul>
      <p>The architecture uses Switch A + Switch B for network redundancy and separates individual instrumentation branches through the star topology.</p>

      <h5>Continuous Telemetry</h5>
      <p>Four system signals were multiplexed into the simulated fibre-optic telemetry path:</p>
      <ul><li>Tier 1 alarm status</li><li>Tier 2 alarm status</li><li>Charger status</li><li>Docking-enable status</li></ul>
      <p>The telemetry output remained active throughout the <code>0–15s</code> simulation, including during the injected Tier 1 and Tier 2 fault events.</p>

      <h5>Standards &amp; Engineering References</h5>
      <p>The control and instrumentation architecture was developed using industrial standards and hardware documentation, including:</p>
      <ul>
        <li><strong>IEC 61508-2:</strong> functional safety, segregation, SIL and hardware fault tolerance</li>
        <li><strong>IEC 61508-6 Annex B:</strong> 1oo2, 2oo2, and 2oo3 voting architectures</li>
        <li><strong>ISA-5.1:</strong> instrumentation and 4–20 mA conventions</li>
        <li><strong>IEEE 1451.0:</strong> smart-sensor interfaces, status information and time synchronisation</li>
        <li><strong>IEC 60751:</strong> RTD and temperature instrumentation</li>
        <li><strong>Siemens S7-1200 System Manual:</strong> PLC electrical and power requirements</li>
      </ul>

      <h5>Key Features</h5>
      <ul>
        <li>Dual SIS + BPCS PLC architecture</li>
        <li>Siemens S7-1200 based design</li>
        <li>45 sensors / 74 measurement channels</li>
        <li>Four consequence-based sensor tiers</li>
        <li>2oo3, 1oo2, 2oo2, and single-channel voting</li>
        <li>Dynamic first-order sensor modelling</li>
        <li>4–20 mA instrumentation modelling</li>
        <li>Fault-injection testing</li>
        <li>Safety alarms and automatic interlocks</li>
        <li>SIS/BPCS functional segregation</li>
        <li>Redundant PROFINET star network</li>
        <li>Distributed I/O architecture</li>
        <li>Continuous fibre-optic telemetry</li>
      </ul>
    `,
    link: 'https://github.com/zoyabari/projects/tree/main/Industrial%20Control%20System%20Digital%20Twin/PLC%20and%20SIS%20Simulation'
  },
  {
    id: 'fusion-enclosure',
    group: 'digital-twin',
    shortTitle: 'Fusion Enclosure Design',
    title: 'Industrial Control System Digital Twin: Fusion Enclosure Design',
    image: 'Industrial Control System Digital Twin/Fusion Enclosure Design/images/PLC_Enclosure.png',
    description: `
      <p>I first made a sample model of a PLC enclosure on Fusion 360, sized to house the Siemens S7-1200 SIS and BPCS controllers, the PROFINET switches, and the distributed I/O terminals used in the architecture above.</p>
      <h5>Layout</h5>
      <p>The model is built as two identical bolted compartments side by side, each sized for one S7-1200 controller, keeping the SIS and BPCS physically separated to match their functional segregation in the control architecture. Front, top, back, and isometric views were drawn to check panel clearances and the bolt-hole pattern around each compartment.</p>
    `,
    link: 'https://github.com/zoyabari/projects/tree/main/Industrial%20Control%20System%20Digital%20Twin/Fusion%20Enclosure%20Design'
  },
  {
    id: 'sysml',
    year: 'Y2',
    title: 'SysML v2: Intelligent Hair Dryer',
    image: null,
    description: '<p>A SysML v2 model of a patented intelligent hair dryer (US 12,178,303 B2): requirements, block definition, and activity diagrams mapping its IMU-guided, IR-sensed adaptive heating system. Submitted as a module assignment, scoring 94%.</p>',
    repo: 'SysML - Intelligent Hair Dryer',
    extraLinks: [{ label: 'Assignment (PDF) →', href: 'SysML - Intelligent Hair Dryer/System Design for an Intelligent Hair Dryer (Annotated).pdf' }]
  },
  {
    id: 'humra',
    year: 'Y2',
    shortTitle: 'HUMRA (Ongoing)',
    title: 'HUMRA: Humanoid Unified Memory and Reasoning Architecture (Ongoing)',
    image: null,
    description: '<p>A cognitive memory architecture for a humanoid robot, inspired by child cognitive development, letting it remember people and experiences across interactions.</p>'
  },
  {
    id: 'robotic-arm',
    year: 'Y1',
    title: 'Robotic Arm: 6-Axis',
    image: null,
    description: '<p>A programmable six-axis robotic manipulator combining servo motors and a NEMA 17 stepper for coordinated, repeatable motion. Presented at the SEE Youth Sustainability Hackathon (2nd place) as a beach-cleaning and worker-safety concept.</p>',
    repo: 'Robotic Arm',
    extraLinks: [{ label: 'Watch demo →', href: 'Robotic Arm/VID-20260626-WA0048.mp4' }]
  },
  {
    id: 'cruise-control',
    year: 'Y1',
    title: 'Adaptive Cruise Control System',
    image: 'Cruise Control/images/simulink.png',
    description: '<p>A closed-loop cruise control simulation with a custom adaptive gain-tuning function block that re-tunes Kp, Ki, and Kd in real time against disturbance forces like a hill or headwind.</p>',
    repo: 'Cruise Control'
  },
  {
    id: 'traffic-light',
    year: 'Y1',
    title: 'Distance-Activated Traffic Light System',
    image: 'Ultrasonic Traffic Light System/images/schematic.png',
    description: '<p>A traffic light sequence triggered by an ultrasonic proximity sensor instead of a pedestrian button, running a full red-yellow-green cycle on approach.</p>',
    repo: 'Ultrasonic Traffic Light System'
  },
  {
    id: 'power-supply',
    year: 'Y1',
    title: 'Linear Power Supply',
    image: 'Linear Power Supply in MultiSim/images/circuit.jpg',
    description: '<p>A linear AC-to-DC supply converting 220V AC to a regulated 12V DC, 5W output, simulated across multiple configurations and validated on a soldered protoboard build.</p>',
    repo: 'Linear Power Supply in MultiSim',
    extraLinks: [{ label: 'Assignment (PDF) →', href: 'Linear Power Supply in MultiSim/images/IDP B Project - Final.pdf' }]
  },
  {
    id: 'linear-actuator',
    year: 'Y1',
    title: 'Linear Actuator: Fusion 360',
    image: null,
    description: '<p>A simplified linear actuator modelled for solar-tracking applications, based on the LINAK LA35 datasheet, with full orthographic and isometric technical drawings.</p>',
    repo: 'Linear Actuator - Fusion360',
    extraLinks: [{ label: 'Assignment (PDF) →', href: 'Linear Actuator - Fusion360/images/IDP A Assignment 3.pdf' }]
  },
  {
    id: 'cat-toy',
    year: 'Y1',
    title: 'Cat Toy',
    image: 'Cat Toy/images/mytoy.png',
    description: '<p>A keypad-controlled laser toy for my cats, with smooth step-interpolated servo motion and a randomized autoplay mode.</p>',
    repo: 'Cat Toy'
  }
];

function encodePath(path) {
  return path.split('/').map(encodeURIComponent).join('/');
}

function repoUrl(folder) {
  return 'https://github.com/zoyabari/projects/tree/main/' + encodeURIComponent(folder);
}

function renderTiles(containerId, predicate) {
  const container = document.getElementById(containerId);
  const items = projectsData.filter(predicate);
  container.innerHTML = items.map(p => `
    <button class="project-tile" data-id="${p.id}" aria-haspopup="dialog">
      <span class="tile-title">${p.shortTitle || p.title}</span>
    </button>
  `).join('');
}

renderTiles('year1Grid', p => p.year === 'Y1');
renderTiles('year2Grid', p => p.year === 'Y2');
renderTiles('digitalTwinGrid', p => p.group === 'digital-twin');

/* ---------- modal ---------- */

const modalOverlay = document.getElementById('modalOverlay');
const modalBody = document.getElementById('modalBody');
const modalClose = document.getElementById('modalClose');
let lastFocused = null;

function openModal(id) {
  const p = projectsData.find(x => x.id === id);
  if (!p) return;

  const extraLinks = (p.extraLinks || [])
    .map(l => `<a href="${encodePath(l.href)}" target="_blank" rel="noopener">${l.label}</a>`)
    .join('');

  modalBody.innerHTML = `
    ${p.image ? `<img class="modal-image" src="${encodePath(p.image)}" alt="">` : ''}
    <div class="modal-content">
      <h3>${p.title}</h3>
      <div class="rich">${p.description}</div>
      <div class="project-links">
        ${p.link || p.repo ? `<a href="${p.link || repoUrl(p.repo)}" target="_blank" rel="noopener">View on GitHub →</a>` : ''}
        ${extraLinks}
      </div>
    </div>
  `;

  lastFocused = document.activeElement;
  modalOverlay.hidden = false;
  document.body.style.overflow = 'hidden';
  modalClose.focus();
}

function closeModal() {
  modalOverlay.hidden = true;
  document.body.style.overflow = '';
  if (lastFocused) lastFocused.focus();
}

document.querySelectorAll('.tile-grid').forEach(grid => {
  grid.addEventListener('click', (e) => {
    const tile = e.target.closest('.project-tile');
    if (tile) openModal(tile.dataset.id);
  });
});

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !modalOverlay.hidden) closeModal();
});
