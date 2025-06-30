import { state } from '../main.js';
import { loadState } from '../utils/auth.js';
import { removeJWT } from '../utils/jwt.js';
import { ConvertXpToStr } from '../utils/others.js';
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
  }

  renderHeader(el) {
    const header = document.createElement('header');
    header.className = 'sticky top-0 py-4 border-b z-10';
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

      btn.addEventListener('click', async (e) => {
        state.currentModule = parseInt(e.target.getAttribute('data-module-id'), 10);
        await loadState();
        this.init();
      });
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
    console.log(this.user.audits);
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
    const dateRegex = audit.group.createdAt.match(/(\d{4})-(\d{2})-(\d{2})/);
    const dateStr = document.createElement('div');
    dateStr.className = 'self-center';
    dateStr.textContent = `Date: ${dateRegex[3]}/${dateRegex[2]}/${dateRegex[1]}`;
    container.appendChild(dateStr);
    // status
    const status = document.createElement('div');
    status.className = `self-center ${audit.grade >= 1 ? 'text-green-600' : 'text-red-600'}`;
    status.textContent = audit.grade >= 1 ? 'PASSED' : 'FAILED';
    container.appendChild(status);
    return container;
  }

  afterRender() {
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
    // logout
    this.querySelector('#logoutBtn').addEventListener('click', () => {
      removeJWT();
      this.dispatchEvent(new CustomEvent('logout', { bubbles: true }));
    });
  }
}
