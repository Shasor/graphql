import { state } from '../main.js';

export class Base extends HTMLElement {
  constructor() {
    super();
    this.user = null;
  }

  connectedCallback() {
    this.init();
  }

  init() {
    this.currentModule = state.currentModule;
    this.user = state.user;
    this.render();
    this.afterRender();
  }

  render() {}

  afterRender() {}
}
