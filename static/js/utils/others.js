export function ConvertXpToStr(xp) {
  return `${xp >= 1000000 ? `${(xp / 1000000).toFixed(2)} MB` : `${(xp / 1000).toFixed(0)} kB`}`;
}

export function CreateLoadingBtn() {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `
    flex bg-indigo-500 text-white text-sm font-medium 
    py-1 px-3 rounded shadow mt-2 fixed
    top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
  `;
  button.disabled = true;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.classList = 'mr-2 size-4 animate-spin fill-white';
  svg.setAttribute('viewBox', '0 0 24 24');

  svg.innerHTML = `
    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
  `;

  const span = document.createElement('span');
  span.textContent = 'Chargement…';

  button.appendChild(svg);
  button.appendChild(span);
  return button;
}
