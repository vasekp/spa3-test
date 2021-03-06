import './spa-scroll.js';
import ContainerElement from './spa-focus-container.js';

const template = document.createElement('template');
template.innerHTML = `
<link rel="stylesheet" type="text/css" href="css/components/spa-modal.css"/>
<spa-scroll id="scroll"><div id="content"><slot></slot></div></spa-scroll>`;

export default class ModalElement extends ContainerElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.addEventListener('focus-leave', () => this.hide());
    this.addEventListener('click', e => {
      if(e.target === this)
        this.hide();
    });
    this.addEventListener('keydown', e => {
      if(e.key === 'Escape')
        this.hide();
    });
  }

  connectedCallback() {
    if(!this.hasAttribute('tabindex'))
      this.setAttribute('tabindex', -1);
  }

  show() {
    this.hidden = false;
    history.pushState({reason: 'modal'}, '');
    this.focus();
    window.addEventListener('popstate', _ => this.hide(), {once: true});
  }

  hide() {
    this.hidden = true;
    if(!this.hidden && history.state?.reason === 'modal')
      history.back();
  }
}

// Disallow forwarding to a state pushed by a modal
window.addEventListener('popstate', e => {
  if(e.state?.reason === 'modal')
    history.back();
});


window.customElements.define('spa-modal', ModalElement);
