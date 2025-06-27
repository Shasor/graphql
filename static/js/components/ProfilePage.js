import { state } from '../main.js';
import { loadState } from '../utils/auth.js';
import { removeJWT } from '../utils/jwt.js';
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
    h1.textContent = `Welcome ${this.userAttrs.firstName} ${this.userAttrs.lastName} !`;
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
    for (let i = 0; i < this.userModules.length; i++) {
      const e = this.userModules[i];
      const btn = document.createElement('div');
      btn.textContent = e.event.object.name;
      btn.setAttribute('data-module-id', e.event.id);
      // Classes de base
      let classes = `flex-1 ${this.currentModule == e.event.id ? 'bg-red-600' : 'bg-stone-700 hover:bg-stone-600'} p-2 text-center ${i !== 0 ? 'border-l border-black' : ''}`;
      // Coins arrondis uniquement sur les extrémités
      if (i === 0) {
        classes += ' rounded-l-lg';
      } else if (i === this.userModules.length - 1) {
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
    userStatsDiv.className = 'flex';
    el.appendChild(userStatsDiv);
    // user level card
    this.renderUserLevelCard(userStatsDiv);
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
    xp.textContent = `${this.userXP >= 1000000 ? `${(this.userXP / 1000000).toFixed(2)} MB` : `${(this.userXP / 1000).toFixed(0)} kB`}`;
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
  <div class="text-2xl">${this.userXPlevel}</div>
`;

    circleWrapper.appendChild(levelText);

    // Ajoute le cercle décoratif au container
    container.appendChild(circleWrapper);

    // Ajoute le tout au body ou à ton div cible
    el.appendChild(container);
  }

  afterRender() {
    this.querySelector('#logoutBtn').addEventListener('click', () => {
      removeJWT();
      this.dispatchEvent(new CustomEvent('logout', { bubbles: true }));
    });
  }
}
