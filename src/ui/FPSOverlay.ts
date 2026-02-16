/**
 * FPS Overlay - Frames per second counter
 *
 * "Measuring performance for those who care about such things."
 * - Skippy the Magnificent
 */

export class FPSOverlay {
  private element: HTMLElement;
  private frameCount = 0;
  private fps = 0;
  private lastUpdate = 0;
  private updateInterval = 500; // Update every 500ms
  private visible = true;

  constructor(parent: HTMLElement) {
    this.element = document.createElement('div');
    this.element.id = 'fps-overlay';
    this.element.style.cssText = `
      position: fixed; bottom: 12px; right: 12px;
      background: rgba(0, 0, 0, 0.6); color: #888;
      padding: 4px 8px; border-radius: 4px;
      font-family: ui-monospace, monospace; font-size: 12px;
      pointer-events: none; z-index: 100;
    `;
    this.element.textContent = '-- FPS';
    parent.appendChild(this.element);
  }

  /**
   * Call this on every frame to track FPS
   */
  tick(now: number): void {
    this.frameCount++;

    if (now - this.lastUpdate >= this.updateInterval) {
      this.fps = Math.round((this.frameCount * 1000) / (now - this.lastUpdate));
      this.frameCount = 0;
      this.lastUpdate = now;

      if (this.visible) {
        this.element.textContent = `${this.fps} FPS`;
      }
    }
  }

  getFPS(): number {
    return this.fps;
  }

  show(): void {
    this.visible = true;
    this.element.style.display = 'block';
  }

  hide(): void {
    this.visible = false;
    this.element.style.display = 'none';
  }

  destroy(): void {
    this.element.remove();
  }
}
