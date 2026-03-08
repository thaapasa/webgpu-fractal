/**
 * Help Overlay - Keyboard shortcuts reference
 *
 * "A guide for those who haven't memorized everything yet."
 * - Skippy the Magnificent
 */

export class HelpOverlay {
  private element: HTMLElement;
  private visible = false;

  constructor(parent: HTMLElement) {
    this.element = document.createElement('div');
    this.element.id = 'help-overlay';
    this.element.innerHTML = this.createContent();
    parent.appendChild(this.element);
  }

  toggle(): boolean {
    this.visible = !this.visible;
    this.element.classList.toggle('visible', this.visible);
    return this.visible;
  }

  show(): void {
    this.visible = true;
    this.element.classList.add('visible');
  }

  hide(): void {
    this.visible = false;
    this.element.classList.remove('visible');
  }

  isVisible(): boolean {
    return this.visible;
  }

  private createContent(): string {
    return `
      <h2 class="help-title">
        🌀 Fractal Explorer - Keyboard Shortcuts
      </h2>
      <div class="help-grid">
        <div class="help-section">
          <h3 class="help-section-title">Navigation</h3>
          <div class="help-section-content">
            ${this.helpRow('Drag', 'Pan view')}
            ${this.helpRow('Scroll', 'Zoom in/out')}
            ${this.helpRow('z / Z', 'Fine zoom (hold)')}
            ${this.helpRow('Double-click', 'Zoom in at point')}
            ${this.helpRow('1-9', 'Famous locations')}
          </div>
        </div>
        <div class="help-section">
          <h3 class="help-section-title">Iterations</h3>
          <div class="help-section-content">
            ${this.helpRow('+/-', 'Adjust iterations')}
            ${this.helpRow('0', 'Reset to auto')}
          </div>
        </div>
        <div class="help-section">
          <h3 class="help-section-title">Colors</h3>
          <div class="help-section-content">
            ${this.helpRow('C / Shift+C', 'Cosine palettes')}
            ${this.helpRow('G / Shift+G', 'Gradient palettes')}
            ${this.helpRow(', / .', 'Shift colors (fine)')}
            ${this.helpRow('< / >', 'Shift colors (coarse)')}
            ${this.helpRow('R', 'Reset color offset')}
          </div>
        </div>
        <div class="help-section">
          <h3 class="help-section-title">Fractal Type</h3>
          <div class="help-section-content">
            ${this.helpRow('F / Shift+F', 'Cycle fractals')}
            ${this.helpRow('J', 'Julia picker mode')}
          </div>
        </div>
        <div class="help-section">
          <h3 class="help-section-title">Brightness</h3>
          <div class="help-section-content">
            ${this.helpRow('B / Shift+B', 'Adjust brightness*')}
            ${this.helpRow('D', 'Reset brightness')}
          </div>
          <div class="help-note">*HDR bias or SDR gradient brightness</div>
        </div>
        <div class="help-section">
          <h3 class="help-section-title">Effects</h3>
          <div class="help-section-content">
            ${this.helpRow('P / Shift+P', 'Cycle post-process presets')}
          </div>
          <div class="help-note">Clean · Cinematic · Vivid · Dreamy</div>
        </div>
        <div class="help-section">
          <h3 class="help-section-title">UI</h3>
          <div class="help-section-content">
            ${this.helpRow('T', 'Tourist mode (auto-tour)')}
            ${this.helpRow('H', 'Toggle this help')}
            ${this.helpRow('Space', 'Screenshot mode')}
          </div>
        </div>
        <div class="help-section">
          <h3 class="help-section-title">Share</h3>
          <div class="help-section-content">
            ${this.helpRow('S', 'Copy bookmark URL')}
          </div>
        </div>
      </div>
      <div class="help-footer">
        Press <kbd>H</kbd> to close
      </div>
    `;
  }

  private helpRow(key: string, description: string): string {
    return `
      <div class="help-row">
        <kbd class="help-key">${key}</kbd>
        <span class="help-description">${description}</span>
      </div>
    `;
  }

  destroy(): void {
    this.element.remove();
  }
}
