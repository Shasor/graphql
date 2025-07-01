import { state } from '../main.js';
import { updateState } from '../utils/auth.js';
import { saveModule } from '../utils/current_module.js';
import { removeJWT } from '../utils/jwt.js';
import { ConvertXpToStr, getDateRegex } from '../utils/others.js';
import { Base } from './Base.js';

export class ProfilePage extends Base {
  constructor() {
    super();
  }

  render() {
    this.innerHTML = '';
    // main
    const main = document.createElement('main');
    this.appendChild(main);
    // c-header
    this.renderHeader(main);
    // spacing
    this.addSpacing(main);
    // main section
    const section = document.createElement('c-section');
    section.className = 'flex flex-col p-4 bg-stone-800 rounded-lg';
    main.appendChild(section);
    // modules btn
    this.renderModules(section);
    // spacing
    this.addSpacing(section);
    // one line section : level card, last audit (+btn more) and ratio
    this.renderUserStats(section);
    // spacing
    this.addSpacing(section);
    // graph selection
    this.renderGraphSelection(section);
    // spacing
    this.addSpacing(section);
    // graph
    this.renderGraph(section);
  }

  renderHeader(el) {
    const header = document.createElement('header');
    header.className = 'py-4 border-b z-10';
    el.appendChild(header);

    const section = document.createElement('c-section');
    section.className = 'flex items-center gap-5';
    header.appendChild(section);

    const h1 = document.createElement('h1');
    h1.className = 'text-2xl font-bold text-primary';
    h1.textContent = `Welcome ${this.user.attrs.firstName} ${this.user.attrs.lastName} !`;
    section.appendChild(h1);

    const div = document.createElement('div');
    div.className = 'flex-1';
    section.appendChild(div);

    const logoutBtn = document.createElement('button');
    logoutBtn.id = 'logoutBtn';

    logoutBtn.className = 'px-4 py-2 bg-neutral-700 text-white rounded hover:bg-neutral-800 transition';
    logoutBtn.textContent = 'Logout';
    section.appendChild(logoutBtn);
  }

  addSpacing(el) {
    const spacing = document.createElement('div');
    spacing.className = 'h-8 lg:h-12';
    el.appendChild(spacing);
  }

  renderModules(el) {
    const modulesDiv = document.createElement('div');
    modulesDiv.className = 'flex flex-1';
    el.appendChild(modulesDiv);
    for (let i = 0; i < this.user.modules.length; i++) {
      const e = this.user.modules[i];
      const btn = document.createElement('div');
      btn.id = `module-btn-${e.event.id}`;
      btn.textContent = e.event.object.name;
      btn.setAttribute('data-module-id', e.event.id);
      // Classes de base
      let classes = `flex-1 ${this.currentModule == e.event.id ? 'bg-red-600' : 'bg-stone-700 hover:bg-stone-600'} p-2 text-center ${i !== 0 ? 'border-l border-black' : ''}`;
      // Coins arrondis uniquement sur les extrémités
      if (i === 0) {
        classes += ' rounded-l-lg';
      } else if (i === this.user.modules.length - 1) {
        classes += ' rounded-r-lg';
      }

      btn.className = classes;
      modulesDiv.appendChild(btn);
    }
  }

  renderUserStats(el) {
    const userStatsDiv = document.createElement('div');
    userStatsDiv.className = 'flex gap-4 items-center';
    el.appendChild(userStatsDiv);
    // user level card
    this.renderUserLevelCard(userStatsDiv);
    this.renderAuditsRatio(userStatsDiv);
    this.renderLastAudit(userStatsDiv);
  }

  renderUserLevelCard(el) {
    // Crée le conteneur principal
    const container = document.createElement('div');
    container.className = 'bg-gray-100 p-12 flex flex-col items-center rounded shadow-md w-fit';

    // Texte "Current rank"
    const xpLabel = document.createElement('div');
    xpLabel.textContent = 'Current XP';
    xpLabel.className = 'text-gray-500 text-xs font-mono mb-1';
    container.appendChild(xpLabel);

    // Texte XP
    const xp = document.createElement('div');
    xp.textContent = ConvertXpToStr(this.user.xp.amount);
    xp.className = 'text-gray-700 text-base mb-2';
    container.appendChild(xp);

    // Texte "Next rank in 4 levels"
    const nextRank = document.createElement('div');
    nextRank.className = 'w-full border-t border-gray-300 pt-2';
    container.appendChild(nextRank);

    // Lien "(See all ranks)"
    const link = document.createElement('a');
    link.href = 'https://zone01normandie.org/intra/rouen/profile/ranks?event=303';
    link.textContent = '(See all ranks)';
    link.className = 'text-purple-500 text-xs font-mono mt-2 hover:text-purple-700 underline';
    container.appendChild(link);

    // Cercle décoratif avec le niveau au centre
    const circleWrapper = document.createElement('div');
    circleWrapper.className = 'relative w-32 h-32 mt-6 mb-4';

    // SVG du cercle gris
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('class', 'w-full h-full');

    // Cercle gris
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', '50');
    circle.setAttribute('cy', '50');
    circle.setAttribute('r', '40');
    circle.setAttribute('fill', '#E5E7EB'); // gray-200
    svg.appendChild(circle);

    // Exemples de dots violets autour du cercle
    for (let i = 0; i < 10; i++) {
      const angle = (i / 10) * 2 * Math.PI;
      const radius = 45;
      const x = 50 + radius * Math.cos(angle);
      const y = 50 + radius * Math.sin(angle);

      const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot.setAttribute('cx', x);
      dot.setAttribute('cy', y);
      dot.setAttribute('r', '3');
      dot.setAttribute('fill', i < 7 ? '#8B5CF6' : '#9CA3AF'); // purple-500 or gray-400
      svg.appendChild(dot);
    }

    circleWrapper.appendChild(svg);

    // Niveau affiché au centre du cercle
    const levelText = document.createElement('div');
    levelText.className = 'absolute inset-0 flex flex-col justify-center items-center text-gray-700 font-mono';
    levelText.innerHTML = `
  <div class="text-xs">Level</div>
  <div class="text-2xl">${this.user.xp.level}</div>
`;

    circleWrapper.appendChild(levelText);

    // Ajoute le cercle décoratif au container
    container.appendChild(circleWrapper);

    // Ajoute le tout au body ou à ton div cible
    el.appendChild(container);
  }

  renderAuditsRatio(el) {
    // main container
    const container = document.createElement('div');
    container.className = 'flex flex-col flex-1 bg-stone-700 rounded-lg size-fit p-3 gap-4';
    el.appendChild(container);
    // title div
    const title = document.createElement('div');
    title.className = 'text-lg font-semibold';
    title.textContent = 'Audits Ratio';
    container.appendChild(title);
    // bars div
    const bars = document.createElement('div');
    bars.className = 'flex flex-col gap-4';
    container.appendChild(bars);
    // 1st bar
    const done = document.createElement('div');
    bars.appendChild(done);
    // 1st bar: label
    const doneLabel = document.createElement('div');
    doneLabel.className = 'text-green-600';
    doneLabel.textContent = `Done: ${ConvertXpToStr(this.user.xp.up)}`;
    done.appendChild(doneLabel);
    // 1st bar: bar
    const bar1 = document.createElement('div');
    bar1.className = 'bg-stone-600 w-full h-[1rem] rounded-lg';
    done.appendChild(bar1);
    // color
    const green = document.createElement('div');
    green.className = 'bg-green-600 h-[1rem] rounded-lg';
    green.style.width = `${this.user.xp.up > this.user.xp.down ? '100%' : `${(this.user.xp.up / this.user.xp.down) * 100}%`}`;
    bar1.appendChild(green);
    // 1st bar
    const received = document.createElement('div');
    bars.appendChild(received);
    // 1st bar: label
    const receivedLabel = document.createElement('div');
    receivedLabel.className = 'text-red-600';
    receivedLabel.textContent = `Received: ${ConvertXpToStr(this.user.xp.down)}`;
    received.appendChild(receivedLabel);
    // 1st bar: bar
    const bar2 = document.createElement('div');
    bar2.className = 'bg-stone-600 w-full h-[1rem] rounded-lg';
    received.appendChild(bar2);
    // color
    const red = document.createElement('div');
    red.className = 'bg-red-600 h-[1rem] rounded-lg';
    red.style.width = `${this.user.xp.down > this.user.xp.up ? '100%' : `${(this.user.xp.down / this.user.xp.up) * 100}%`}`;
    bar2.appendChild(red);
    // ratio
    const ratioValue = (Math.ceil((this.user.xp.up / this.user.xp.down) * 10) / 10).toFixed(1);
    const ratio = document.createElement('div');
    ratio.className = `flex items-end ${ratioValue < 1 ? 'text-yellow-700' : 'text-green-600'}`;
    container.appendChild(ratio);
    // ratio value
    const ratioDiv = document.createElement('div');
    ratioDiv.className = 'text-[4rem] leading-[0.9]';
    ratioDiv.textContent = ratioValue;
    ratio.appendChild(ratioDiv);
    // ratio text
    const ratioText = document.createElement('div');
    ratioText.className = 'ml-2';
    ratioText.textContent = ratioValue < 1 ? 'Make more audits!' : 'Good job!';
    ratio.appendChild(ratioText);
  }

  renderLastAudit(el) {
    el.appendChild(this.createAuditCard(this.user.audits[0], true));
  }

  createAuditCard(audit, seeMore = false) {
    // main container
    const container = document.createElement('div');
    container.className = 'flex flex-col flex-1 bg-stone-700 rounded-lg p-3 gap-4';
    // header
    if (seeMore) {
      const header = document.createElement('div');
      header.className = 'flex justify-between';
      container.appendChild(header);
      // title in header
      const title = document.createElement('div');
      title.className = 'text-lg font-semibold self-center';
      title.textContent = 'Last Audit';
      header.appendChild(title);
      // see more

      const more = document.createElement('div');
      more.id = 'more-audit-btn';
      more.className = 'text-violet-500 hover:underline';
      more.textContent = 'See more';
      header.appendChild(more);
    }
    // string: project - name
    const projectStr = document.createElement('div');
    projectStr.className = 'self-center';
    projectStr.textContent = `${audit.group.object.name} - ${audit.group.captainLogin}`;
    container.appendChild(projectStr);
    // date
    const dateStr = document.createElement('div');
    dateStr.className = 'self-center';
    dateStr.textContent = `Date: ${getDateRegex(audit.group.createdAt)}`;
    container.appendChild(dateStr);
    // status
    const status = document.createElement('div');
    status.className = `self-center ${audit.grade >= 1 ? 'text-green-600' : 'text-red-600'}`;
    status.textContent = audit.grade >= 1 ? 'PASSED' : 'FAILED';
    container.appendChild(status);
    return container;
  }

  renderGraphSelection(el) {
    const graphs = [
      { str: 'XP by Project', type: 'project' },
      { str: 'XP in Time', type: 'timeline' },
    ];
    const graphsBtn = document.createElement('div');
    graphsBtn.className = 'flex flex-1';
    el.appendChild(graphsBtn);
    for (let i = 0; i < graphs.length; i++) {
      const e = graphs[i];
      const btn = document.createElement('div');
      btn.id = `graph-btn-${e.type}`;
      btn.textContent = e.str;
      btn.setAttribute('data-graph-id', e.type);
      // Classes de base
      let classes = `flex-1 ${this.currentGraph == e.type ? 'bg-red-600' : 'bg-stone-700 hover:bg-stone-600'} p-2 text-center ${i !== 0 ? 'border-l border-black' : ''}`;
      // Coins arrondis uniquement sur les extrémités
      if (i === 0) {
        classes += ' rounded-l-lg';
      } else if (i === graphs.length - 1) {
        classes += ' rounded-r-lg';
      }

      btn.className = classes;
      graphsBtn.appendChild(btn);
    }
  }

  renderGraph(el) {
    if (this.currentGraph == 'project') this.renderXPGraph(el, this.user.xp.project);
    else this.renderXPTimelineGraph(el, this.user.xp.project);
  }

  renderXPGraph(el, data) {
    const container = document.createElement('div');
    container.className = 'flex flex-col relative pt-4 bg-stone-700 rounded-lg';
    el.appendChild(container);
    // Early return if no data or empty array
    if (!data || data.length === 0) {
      container.innerHTML = '<p>No project data available for this module.</p>';
      return;
    }

    // Sort data by creation date (newest first)
    const sortedData = [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Define graph dimensions and margins
    const margin = { top: 80, right: 30, bottom: 60, left: 80 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Find maximum XP value for scaling
    const maxXP = Math.max(...sortedData.map((d) => d.amount));

    // Calculate bar width based on data length - ensure minimum width for visibility
    const barWidth = Math.max(4, Math.min(50, width / sortedData.length - 2));

    // graph title
    const graphTitle = document.createElement('h3');
    graphTitle.className = 'self-center';
    graphTitle.textContent = 'XP by Project (Oldest to Newest)';
    container.appendChild(graphTitle);
    // info popup
    const infoPanel = document.createElement('div');
    infoPanel.className = 'absolute bg-stone-600 top-[100px] left-1/2 -translate-x-1/2 w-2xs py-2 px-4 text-center rounded-lg hidden';
    container.appendChild(infoPanel);
    // info popup: name
    const projectNameEl = document.createElement('div');
    infoPanel.appendChild(projectNameEl);
    // info popup: xp
    const projectXpEl = document.createElement('div');
    projectXpEl.className = 'text-green-600';
    infoPanel.appendChild(projectXpEl);
    // info popup: date
    const projectDateEl = document.createElement('div');
    infoPanel.appendChild(projectDateEl);

    // Generate the SVG - use 100% width with proper aspect ratio preservation
    const svg = `
    <svg width="100%" height="100%" preserveAspectRatio="xMidYMid meet" viewBox="0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}">
      <g transform="translate(${margin.left}, ${margin.top})">
        <!-- X and Y axes -->
        <line x1="0" y1="${height}" x2="${width}" y2="${height}" stroke="#555" stroke-width="2" />
        <line x1="0" y1="0" x2="0" y2="${height}" stroke="#555" stroke-width="2" />
        
        <!-- Bars -->
        ${sortedData
          .reverse()
          .map((project, i) => {
            // Ensure minimum height for visibility
            const barHeight = Math.max(1, (project.amount / maxXP) * height);
            const x = (width / sortedData.length) * i + (width / sortedData.length - barWidth) / 2;
            const y = height - barHeight;

            return `
            <g id="graph-bars" data-project="${project.object.name}" data-xp="${project.amount}" data-date="${getDateRegex(project.createdAt)}">
              <rect 
                x="${x}" 
                y="${y}" 
                width="${barWidth}" 
                height="${barHeight}" 
                fill="#ff0000" 
                opacity="0.8"
                rx="2"
              />
            </g>
          `;
          })
          .join('')}
        
        <!-- Y-axis labels (XP values) -->
        ${[0, 0.25, 0.5, 0.75, 1]
          .map((percent) => {
            const yPos = height - height * percent;
            const xpValue = Math.round(maxXP * percent);

            return `
            <g>
              <line 
                x1="-5" 
                y1="${yPos}" 
                x2="${width}" 
                y2="${yPos}" 
                stroke="#555" 
                stroke-dasharray="5,5" 
                opacity="0.3"
              />
              <text 
                x="-10" 
                y="${yPos + 5}" 
                text-anchor="end" 
                fill="white"
                font-size="12px"
              >
                ${xpValue} XP
              </text>
            </g>
          `;
          })
          .join('')}
      </g>
    </svg>
  `;
    // svg container
    const svgContainer = document.createElement('div');
    svgContainer.innerHTML = svg;
    container.appendChild(svgContainer);

    // Set a fixed height to maintain aspect ratio
    svgContainer.style.height = '500px';

    // Add event listeners for interactivity
    this.querySelectorAll('#graph-bars').forEach((g) => {
      g.addEventListener('mouseenter', function () {
        const projectName = this.getAttribute('data-project');
        const xpAmount = this.getAttribute('data-xp');
        const date = this.getAttribute('data-date');
        const rect = this.querySelector('rect');

        // Highlight the bar
        rect.setAttribute('opacity', '1');
        rect.setAttribute('fill', '#ff000a');

        // Update info panel content
        projectNameEl.textContent = projectName;
        projectXpEl.textContent = `[XP] ${ConvertXpToStr(xpAmount)}`;
        projectDateEl.textContent = date;

        // Show the info panel
        infoPanel.classList.toggle('hidden');
      });

      g.addEventListener('mouseleave', function () {
        const rect = this.querySelector('rect');
        rect.setAttribute('opacity', '0.8');
        rect.setAttribute('fill', '#ff0000');

        // Hide the info panel
        infoPanel.classList.toggle('hidden');
      });
    });
  }

  renderXPTimelineGraph(el, data) {
    const container = document.createElement('div');
    container.className = 'flex flex-col relative pt-4 bg-stone-700 rounded-lg';
    el.appendChild(container);
    // Early return if no data or empty array
    if (!data || data.length === 0) {
      container.innerHTML = '<p>No project data available for this module.</p>';
      return;
    }

    // Sort projects by creation date (oldest first)
    const sortedData = [...data].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    // Calculate cumulative XP over time
    let cumulativeXP = 0;
    const timelineData = sortedData.map((item) => {
      cumulativeXP += item.amount;
      return {
        date: new Date(item.createdAt),
        amount: item.amount,
        cumulative: cumulativeXP,
        name: item.object?.name || 'Unknown Project',
      };
    });

    // graph dimensions and margins
    const margin = { top: 60, right: 30, bottom: 60, left: 80 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // graph title
    const graphTitle = document.createElement('h3');
    graphTitle.className = 'self-center';
    graphTitle.textContent = 'XP by Project (Oldest to Newest)';
    container.appendChild(graphTitle);
    // info popup
    const infoPanel = document.createElement('div');
    infoPanel.className = 'absolute bg-stone-600 top-[100px] left-1/2 -translate-x-1/2 w-2xs py-2 px-4 text-center z-10 rounded-lg hidden';
    container.appendChild(infoPanel);
    // info popup: name
    const projectNameEl = document.createElement('div');
    infoPanel.appendChild(projectNameEl);
    // info popup: xp
    const projectXpEl = document.createElement('div');
    projectXpEl.className = 'text-green-600';
    infoPanel.appendChild(projectXpEl);
    // info popup: date
    const projectDateEl = document.createElement('div');
    infoPanel.appendChild(projectDateEl);
    // cumulative
    const cumulativeXpEl = document.createElement('div');
    infoPanel.appendChild(cumulativeXpEl);

    // Calculate X and Y scales
    const dateRange = timelineData.map((d) => d.date);
    const minDate = dateRange[0];
    const maxDate = dateRange[dateRange.length - 1];
    const maxXP = timelineData[timelineData.length - 1].cumulative;

    // Calculate x depending on date
    const getXPosition = (date) => {
      const totalDays = (maxDate - minDate) / (1000 * 60 * 60 * 24);
      const daysPassed = (date - minDate) / (1000 * 60 * 60 * 24);
      return (daysPassed / totalDays) * width;
    };

    // Calculate y depending on XP
    const getYPosition = (xp) => {
      return height - (xp / maxXP) * height;
    };

    // Line between project points
    const linePath = timelineData
      .map((point, i) => {
        const x = getXPosition(point.date);
        const y = getYPosition(point.cumulative);
        return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
      })
      .join(' ');

    // Generate area path (line + bottom enclosure)
    const areaPath = `${linePath} L ${getXPosition(maxDate)} ${height} L ${getXPosition(minDate)} ${height} Z`;

    // Generate the SVG
    const svg = `
    <svg width="100%" height="100%" preserveAspectRatio="xMidYMid meet" viewBox="0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}">
      <defs>
        <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#ab54f1" stop-opacity="0.8"/>
          <stop offset="100%" stop-color="#ab54f1" stop-opacity="0.2"/>
        </linearGradient>
      </defs>
      <g transform="translate(${margin.left}, ${margin.top})">
        <!-- X and Y axes -->
        <line x1="0" y1="${height}" x2="${width}" y2="${height}" stroke="#555" stroke-width="2" />
        <line x1="0" y1="0" x2="0" y2="${height}" stroke="#555" stroke-width="2" />
        
        <!-- Area under the line -->
        <path d="${areaPath}" fill="#ff0000" />
        
        <!-- Line graph -->
        <path d="${linePath}" stroke="#b30000" stroke-width="3" fill="none" />
        
        <!-- Data points -->
        ${timelineData
          .map((point, i) => {
            const x = getXPosition(point.date);
            const y = getYPosition(point.cumulative);
            const date = new Date(point.date);
            const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
            const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;

            return `
            <g class="graph-point" 
               data-index="${i}" 
               data-project="${point.name}" 
               data-xp="${point.amount}" 
               data-date="${`${day}/${month}/${date.getFullYear()}`}" 
               data-cumulative="${point.cumulative}">
                <circle 
                  cx="${x}" 
                  cy="${y}" 
                  r="4" 
                  fill="#ffffff" 
                  stroke="#000000" 
                  stroke-width="2"
                />
            </g>`;
          })
          .join('')}
        
        <!-- Y-axis labels -->
        ${[0, 0.25, 0.5, 0.75, 1]
          .map((percent) => {
            const yPos = height - height * percent;
            const xpValue = Math.round(maxXP * percent);

            return `
            <g>
                <line 
                  x1="-5" 
                  y1="${yPos}" 
                  x2="${width}" 
                  y2="${yPos}" 
                  stroke="#555" 
                  stroke-dasharray="5,5" 
                  opacity="0.3"
                />
                <text 
                  x="-10" 
                  y="${yPos + 5}" 
                  text-anchor="end" 
                  fill="#e0e0e0"
                  font-size="12px"
                >
                  ${ConvertXpToStr(xpValue)}
                </text>
            </g>`;
          })
          .join('')}
        
        <!-- X-axis labels -->
        ${[0, 0.25, 0.5, 0.75, 1]
          .map((percent) => {
            const date = new Date(minDate.getTime() + (maxDate - minDate) * percent);
            const xPos = getXPosition(date);

            return `
            <g>
                <line 
                  x1="${xPos}" 
                  y1="${height + 5}" 
                  x2="${xPos}" 
                  y2="${height}" 
                  stroke="#555" 
                  stroke-width="1"
                />
                <text 
                  x="${xPos}" 
                  y="${height + 20}" 
                  text-anchor="middle" 
                  fill="#e0e0e0"
                  font-size="12px"
                >
                  ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </text>
            </g>`;
          })
          .join('')}
      </g>
    </svg>
  `;

    // svg container
    const svgContainer = document.createElement('div');
    svgContainer.innerHTML = svg;
    container.appendChild(svgContainer);

    svgContainer.style.height = '500px';

    document.querySelectorAll('.graph-point').forEach((p) => {
      p.addEventListener('mouseenter', function () {
        const projectName = this.getAttribute('data-project');
        const xpAmount = this.getAttribute('data-xp');
        const date = this.getAttribute('data-date');
        const cumulative = this.getAttribute('data-cumulative');
        const circle = this.querySelector('circle');

        // Highlight the point
        circle.setAttribute('r', '6');
        circle.setAttribute('stroke-width', '3');

        projectNameEl.textContent = projectName;
        projectXpEl.textContent = `Gained: ${ConvertXpToStr(xpAmount)}`;
        projectDateEl.textContent = date;
        cumulativeXpEl.textContent = `Total: ${ConvertXpToStr(cumulative)}`;

        infoPanel.classList.toggle('hidden');
      });

      p.addEventListener('mouseleave', function () {
        const circle = this.querySelector('circle');
        circle.setAttribute('r', '4');
        circle.setAttribute('stroke-width', '2');

        infoPanel.classList.toggle('hidden');
      });
    });
  }

  afterRender() {
    // change module
    this.querySelectorAll('[id^="module-btn-"]').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        saveModule(e.target.getAttribute('data-module-id'));
        await updateState(true);
        this.init();
      });
    });
    // see more audits
    this.querySelector('#more-audit-btn').addEventListener('click', () => {
      const modal = document.createElement('c-modal');
      const div = document.createElement('div');
      div.className = 'p-4 overflow-y-auto bg-stone-800 rounded-lg max-h-7/8 max-w-3/4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5';
      modal.appendChild(div);
      this.user.audits.forEach((e) => {
        div.appendChild(this.createAuditCard(e));
      });
      document.body.appendChild(modal);
    });
    // change graph
    this.querySelectorAll('[id^="graph-btn-"]').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        state.currentGraph = e.target.getAttribute('data-graph-id');
        // await updateState(true);
        this.init();
      });
    });
    // logout
    this.querySelector('#logoutBtn').addEventListener('click', () => {
      removeJWT();
      this.dispatchEvent(new CustomEvent('logout', { bubbles: true }));
    });
  }
}
