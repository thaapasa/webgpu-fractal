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
    this.element.style.cssText = `
      position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.92); color: #e5e5e5; padding: 24px 32px;
      border-radius: 12px; font-family: system-ui, -apple-system, sans-serif;
      font-size: 14px; z-index: 1001; opacity: 0; transition: opacity 0.2s ease;
      pointer-events: none; max-width: 90vw; max-height: 90vh; overflow-y: auto;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5); border: 1px solid rgba(255, 255, 255, 0.1);
    `;
    parent.appendChild(this.element);
  }

  toggle(): boolean {
    this.visible = !this.visible;
    this.element.style.opacity = this.visible ? '1' : '0';
    this.element.style.pointerEvents = this.visible ? 'auto' : 'none';
    return this.visible;
  }

  show(): void {
    this.visible = true;
    this.element.style.opacity = '1';
    this.element.style.pointerEvents = 'auto';
  }

  hide(): void {
    this.visible = false;
    this.element.style.opacity = '0';
    this.element.style.pointerEvents = 'none';
  }

  isVisible(): boolean {
    return this.visible;
  }

  private createContent(): string {
    return `
      <h2 style="margin: 0 0 16px 0; color: #60a5fa; font-size: 20px; font-weight: 600;">
        🌀 Fractal Explorer - Keyboard Shortcuts
      </h2>
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px 32px;">
        <div style="margin-bottom: 12px;">
          <h3 style="margin: 0 0 8px 0; color: #a78bfa; font-size: 13px; text-transform: uppercase;">Navigation</h3>
          <div style="display: grid; gap: 4px;">
            ${this.helpRow('Drag', 'Pan view')}
            ${this.helpRow('Scroll', 'Zoom in/out')}
            ${this.helpRow('z / Z', 'Fine zoom (hold)')}
            ${this.helpRow('Double-click', 'Zoom in at point')}
            ${this.helpRow('1-9', 'Famous locations')}
          </div>
        </div>
        <div style="margin-bottom: 12px;">
          <h3 style="margin: 0 0 8px 0; color: #a78bfa; font-size: 13px; text-transform: uppercase;">Iterations</h3>
          <div style="display: grid; gap: 4px;">
            ${this.helpRow('+/-', 'Adjust iterations')}
            ${this.helpRow('0', 'Reset to auto')}
          </div>
        </div>
        <div style="margin-bottom: 12px;">
          <h3 style="margin: 0 0 8px 0; color: #a78bfa; font-size: 13px; text-transform: uppercase;">Colors</h3>
          <div style="display: grid; gap: 4px;">
            ${this.helpRow('C / Shift+C', 'Cosine palettes')}
            ${this.helpRow('G / Shift+G', 'Gradient palettes')}
            ${this.helpRow(', / .', 'Shift colors (fine)')}
            ${this.helpRow('< / >', 'Shift colors (coarse)')}
            ${this.helpRow('R', 'Reset color offset')}
          </div>
        </div>
        <div style="margin-bottom: 12px;">
          <h3 style="margin: 0 0 8px 0; color: #a78bfa; font-size: 13px; text-transform: uppercase;">Fractal Type</h3>
          <div style="display: grid; gap: 4px;">
            ${this.helpRow('F / Shift+F', 'Cycle fractals')}
            ${this.helpRow('J', 'Julia picker mode')}
          </div>
        </div>
        <div style="margin-bottom: 12px;">
          <h3 style="margin: 0 0 8px 0; color: #a78bfa; font-size: 13px; text-transform: uppercase;">Brightness</h3>
          <div style="display: grid; gap: 4px;">
            ${this.helpRow('B / Shift+B', 'Adjust brightness*')}
            ${this.helpRow('D', 'Reset brightness')}
          </div>
          <div style="color: #888; font-size: 10px; margin-top: 4px;">*HDR bias or SDR gradient brightness</div>
        </div>
        <div style="margin-bottom: 12px;">
          <h3 style="margin: 0 0 8px 0; color: #a78bfa; font-size: 13px; text-transform: uppercase;">UI</h3>
          <div style="display: grid; gap: 4px;">
            ${this.helpRow('T', 'Tourist mode (auto-tour)')}
            ${this.helpRow('H', 'Toggle this help')}
            ${this.helpRow('Space', 'Screenshot mode')}
          </div>
        </div>
        <div style="margin-bottom: 12px;">
          <h3 style="margin: 0 0 8px 0; color: #a78bfa; font-size: 13px; text-transform: uppercase;">Share</h3>
          <div style="display: grid; gap: 4px;">
            ${this.helpRow('S', 'Copy bookmark URL')}
          </div>
        </div>
      </div>
      <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.1); color: #888; font-size: 12px; text-align: center;">
        Press <kbd style="background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px;">H</kbd> to close
      </div>
    `;
  }

  private helpRow(key: string, description: string): string {
    return `
      <div style="display: flex; align-items: baseline; gap: 8px;">
        <kbd style="background: rgba(255,255,255,0.1); color: #f0f0f0; padding: 2px 8px; border-radius: 4px; font-family: ui-monospace, monospace; font-size: 12px; min-width: 60px; text-align: center;">${key}</kbd>
        <span style="color: #ccc;">${description}</span>
      </div>
    `;
  }

  destroy(): void {
    this.element.remove();
  }
}
