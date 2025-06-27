import { Base } from './Base.js';

export class Section extends Base {
  constructor() {
    super();
  }

  render() {
    this.classList.add('max-w-5xl', 'px-4', 'm-auto');
  }
}
