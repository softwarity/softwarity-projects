import { menuData } from 'virtual:menu-data';
import styles from './softwarity-projects.css?inline';

declare const __VERSION__: string;

interface MenuItem {
  type: 'link' | 'separator';
  text?: string;
  url?: string;
}

interface SubSection {
  title: string;
  items: MenuItem[];
}

interface Section {
  type?: 'separator';
  title?: string;
  items?: MenuItem[];
  subSections?: SubSection[];
}

interface MenuData {
  title: string;
  sections: Section[];
}

/**
 * Material Symbols used:
 * - expand_more: Button dropdown indicator
 * - chevron_right/chevron_left: Submenu indicator
 * - open_in_new: External link indicator
 */

const MATERIAL_SYMBOLS_URL = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap';

function loadMaterialSymbols(): void {
  if (document.querySelector(`link[href="${MATERIAL_SYMBOLS_URL}"]`)) {
    return;
  }
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = MATERIAL_SYMBOLS_URL;
  document.head.appendChild(link);
}

export class SoftwarityProjects extends HTMLElement {
  private shadow: ShadowRoot;
  private isOpen = false;
  private data: MenuData;
  private openLeft = false;

  static get version(): string {
    return __VERSION__;
  }

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.data = menuData as MenuData;
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  connectedCallback(): void {
    loadMaterialSymbols();
    this.render();
    document.addEventListener('click', this.handleClickOutside);
  }

  disconnectedCallback(): void {
    document.removeEventListener('click', this.handleClickOutside);
  }

  private handleClickOutside(event: MouseEvent): void {
    if (!this.contains(event.target as Node) && this.isOpen) {
      this.isOpen = false;
      this.updateDropdownState();
    }
  }

  private toggleMenu(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.checkPosition();
    }
    this.updateDropdownState();
  }

  private checkPosition(): void {
    const rect = this.getBoundingClientRect();
    const spaceRight = window.innerWidth - rect.right;
    this.openLeft = spaceRight < 250;
    const container = this.shadow.querySelector('.menu-container');
    container?.classList.toggle('open-left', this.openLeft);
  }

  private updateDropdownState(): void {
    const button = this.shadow.querySelector('.menu-button');
    const dropdown = this.shadow.querySelector('.menu-dropdown');
    if (button && dropdown) {
      button.classList.toggle('open', this.isOpen);
      dropdown.classList.toggle('open', this.isOpen);
    }
  }

  private renderItem(item: MenuItem): string {
    if (item.type === 'separator') {
      return '<div class="menu-separator"></div>';
    }
    return `
      <a class="menu-item" href="${item.url}" target="_blank" rel="noopener noreferrer">
        <span class="material-symbols-outlined icon">open_in_new</span>
        <span class="menu-item-text">${item.text}</span>
      </a>
    `;
  }

  private renderSubSection(subSection: SubSection): string {
    const chevron = 'chevron_right';
    return `
      <div class="menu-submenu">
        <div class="menu-submenu-trigger">
          <span class="menu-item-text">${subSection.title}</span>
          <span class="material-symbols-outlined icon chevron">${chevron}</span>
        </div>
        <div class="menu-submenu-content">
          ${subSection.items.map(item => this.renderItem(item)).join('')}
        </div>
      </div>
    `;
  }

  private renderSection(section: Section): string {
    if (section.type === 'separator') {
      return '<div class="menu-separator"></div>';
    }

    const hasSubmenus = section.subSections && section.subSections.length > 0;
    const hasItems = section.items && section.items.length > 0;

    if (!hasSubmenus && !hasItems) {
      return '';
    }

    // If section has submenus, render as submenu trigger
    if (hasSubmenus) {
      const chevron = 'chevron_right';
      return `
        <div class="menu-submenu">
          <div class="menu-submenu-trigger">
            <span class="menu-item-text">${section.title}</span>
            <span class="material-symbols-outlined icon chevron">${chevron}</span>
          </div>
          <div class="menu-submenu-content">
            ${section.items?.map(item => this.renderItem(item)).join('') || ''}
            ${section.subSections?.map(sub =>
              this.renderSubSection(sub)
            ).join('') || ''}
          </div>
        </div>
      `;
    }

    // Section with only items - render as submenu
    const chevron = 'chevron_right';
    return `
      <div class="menu-submenu">
        <div class="menu-submenu-trigger">
          <span class="menu-item-text">${section.title}</span>
          <span class="material-symbols-outlined icon chevron">${chevron}</span>
        </div>
        <div class="menu-submenu-content">
          ${section.items?.map(item => this.renderItem(item)).join('') || ''}
        </div>
      </div>
    `;
  }

  private render(): void {
    this.shadow.innerHTML = `
      <style>${styles}</style>
      <div class="menu-container">
        <button class="menu-button" type="button">
          <span>${this.data.title}</span>
          <span class="material-symbols-outlined icon">expand_more</span>
        </button>
        <div class="menu-dropdown">
          ${this.data.sections.map(section =>
            this.renderSection(section)
          ).join('')}
        </div>
      </div>
    `;

    this.attachEventListeners();
  }

  private attachEventListeners(): void {
    const button = this.shadow.querySelector('.menu-button');
    button?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleMenu();
    });
  }
}

customElements.define('softwarity-projects', SoftwarityProjects);
