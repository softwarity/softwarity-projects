import { expect, fixture, html } from '@open-wc/testing';
import '../src/softwarity-projects.ts';

describe('softwarity-projects', () => {
  describe('rendering', () => {
    it('renders the component', async () => {
      const el = await fixture(html`<softwarity-projects></softwarity-projects>`);
      expect(el).to.exist;
      expect(el.shadowRoot).to.exist;
    });

    it('renders the menu button with title', async () => {
      const el = await fixture(html`<softwarity-projects></softwarity-projects>`);
      const button = el.shadowRoot.querySelector('.menu-button');
      expect(button).to.exist;
      expect(button.textContent).to.include('Test Menu');
    });

    it('renders the dropdown menu', async () => {
      const el = await fixture(html`<softwarity-projects></softwarity-projects>`);
      const dropdown = el.shadowRoot.querySelector('.menu-dropdown');
      expect(dropdown).to.exist;
    });

    it('renders submenus', async () => {
      const el = await fixture(html`<softwarity-projects></softwarity-projects>`);
      const submenus = el.shadowRoot.querySelectorAll('.menu-submenu');
      expect(submenus.length).to.be.greaterThan(0);
    });

    it('renders separators', async () => {
      const el = await fixture(html`<softwarity-projects></softwarity-projects>`);
      const button = el.shadowRoot.querySelector('.menu-button');
      button.click();
      const separators = el.shadowRoot.querySelectorAll('.menu-separator');
      expect(separators.length).to.be.greaterThan(0);
    });
  });

  describe('interactions', () => {
    it('opens dropdown on button click', async () => {
      const el = await fixture(html`<softwarity-projects></softwarity-projects>`);
      const button = el.shadowRoot.querySelector('.menu-button');
      const dropdown = el.shadowRoot.querySelector('.menu-dropdown');

      expect(dropdown.classList.contains('open')).to.be.false;
      button.click();
      expect(dropdown.classList.contains('open')).to.be.true;
    });

    it('closes dropdown on second button click', async () => {
      const el = await fixture(html`<softwarity-projects></softwarity-projects>`);
      const button = el.shadowRoot.querySelector('.menu-button');
      const dropdown = el.shadowRoot.querySelector('.menu-dropdown');

      button.click();
      expect(dropdown.classList.contains('open')).to.be.true;
      button.click();
      expect(dropdown.classList.contains('open')).to.be.false;
    });

    it('closes dropdown on outside click', async () => {
      const el = await fixture(html`<softwarity-projects></softwarity-projects>`);
      const button = el.shadowRoot.querySelector('.menu-button');
      const dropdown = el.shadowRoot.querySelector('.menu-dropdown');

      button.click();
      expect(dropdown.classList.contains('open')).to.be.true;

      document.body.click();
      expect(dropdown.classList.contains('open')).to.be.false;
    });

    it('has submenu triggers with chevron icons', async () => {
      const el = await fixture(html`<softwarity-projects></softwarity-projects>`);
      const triggers = el.shadowRoot.querySelectorAll('.menu-submenu-trigger');
      expect(triggers.length).to.be.greaterThan(0);

      const chevron = triggers[0].querySelector('.chevron');
      expect(chevron).to.exist;
    });
  });

  describe('links', () => {
    it('renders links with correct attributes', async () => {
      const el = await fixture(html`<softwarity-projects></softwarity-projects>`);
      const link = el.shadowRoot.querySelector('.menu-item');
      expect(link).to.exist;
      expect(link.getAttribute('target')).to.equal('_blank');
      expect(link.getAttribute('rel')).to.equal('noopener noreferrer');
    });
  });

  describe('position detection', () => {
    it('has open-left class handling', async () => {
      const el = await fixture(html`<softwarity-projects></softwarity-projects>`);
      const container = el.shadowRoot.querySelector('.menu-container');
      expect(container).to.exist;
      // By default should not have open-left
      expect(container.classList.contains('open-left')).to.be.false;
    });
  });

  describe('version', () => {
    it('exposes version property', async () => {
      const { SoftwarityProjects } = await import('../src/softwarity-projects.ts');
      expect(SoftwarityProjects.version).to.exist;
    });
  });
});
