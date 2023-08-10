export class MyCustomComponent extends HTMLElement {
  connectedCallback() {
    this.innerHTML = 'Hello World From My Custom Component!';
  }
}
