export declare class SoftwarityProjects extends HTMLElement {
  static get version(): string;
  constructor();
  connectedCallback(): void;
  disconnectedCallback(): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'softwarity-projects': SoftwarityProjects;
  }
}
