import { state } from '../main.js';

export class Base extends HTMLElement {
  constructor() {
    super();
    this.userModules = null;
    this.userInfo = null;
    this.userAttrs = null;
    this.userXP = null;
  }

  connectedCallback() {
    this.init();
  }

  init() {
    this.currentModule = state.currentModule;
    this.userModules = state.userModules;
    this.userInfo = state.userInfo;
    this.userAttrs = state.userAttrs;
    this.userXP = state.userXP;
    this.userXPlevel = state.userXPlevel;
    this.render();
    this.afterRender();
  }

  render() {}

  afterRender() {}
}
