/**
 * Overlay Manager - Coordinates all UI overlays
 *
 * "Managing the visual chaos so you don't have to."
 * - Skippy the Magnificent
 */

import { DebugOverlay, type DebugOverlayState } from './DebugOverlay';
import { FPSOverlay } from './FPSOverlay';
import { HelpOverlay } from './HelpOverlay';
import { NotificationOverlay } from './NotificationOverlay';

export type { DebugOverlayState } from './DebugOverlay';

export class OverlayManager {
  readonly debug: DebugOverlay;
  readonly fps: FPSOverlay;
  readonly help: HelpOverlay;
  readonly notification: NotificationOverlay;

  private screenshotMode = false;

  constructor(parent: HTMLElement) {
    this.debug = new DebugOverlay(parent);
    this.fps = new FPSOverlay(parent);
    this.help = new HelpOverlay(parent);
    this.notification = new NotificationOverlay(parent);
  }

  /**
   * Toggle screenshot mode - hides all overlays except notifications
   */
  toggleScreenshotMode(): boolean {
    this.screenshotMode = !this.screenshotMode;

    if (this.screenshotMode) {
      // Hide help if visible
      if (this.help.isVisible()) {
        this.help.hide();
      }
      this.debug.hide();
      this.fps.hide();
    } else {
      this.debug.show();
      this.fps.show();
    }

    this.notification.showScreenshotMode(this.screenshotMode);
    return this.screenshotMode;
  }

  /**
   * Check if screenshot mode is active
   */
  isScreenshotMode(): boolean {
    return this.screenshotMode;
  }

  /**
   * Toggle help overlay
   */
  toggleHelp(): boolean {
    return this.help.toggle();
  }

  /**
   * Update debug overlay with current state
   */
  updateDebug(state: DebugOverlayState): void {
    if (!this.screenshotMode) {
      this.debug.update(state);
    }
  }

  /**
   * Tick FPS counter
   */
  tickFPS(now: number): void {
    if (!this.screenshotMode) {
      this.fps.tick(now);
    }
  }

  /**
   * Clean up all overlays
   */
  destroy(): void {
    this.debug.destroy();
    this.fps.destroy();
    this.help.destroy();
    this.notification.destroy();
  }
}
