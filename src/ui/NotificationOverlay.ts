/**
 * Notification Overlay - Toast notifications for user feedback
 *
 * "Informing the masses of their actions."
 * - Skippy the Magnificent
 */

export interface NotificationOptions {
  color?: string;
  duration?: number;
  html?: boolean;
}

export class NotificationOverlay {
  private element: HTMLElement;
  private timeoutId: ReturnType<typeof setTimeout> | null = null;

  constructor(parent: HTMLElement) {
    this.element = document.createElement('div');
    this.element.id = 'share-notification';
    parent.appendChild(this.element);
  }

  /**
   * Show a notification message
   */
  show(message: string, options: NotificationOptions = {}): void {
    const { color = '#4ade80', duration = 2000, html = false } = options;

    // Clear any existing timeout
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
    }

    if (html) {
      this.element.innerHTML = message;
    } else {
      this.element.textContent = message;
    }
    this.element.style.color = color;
    this.element.style.opacity = '1';

    this.timeoutId = setTimeout(() => {
      this.element.style.opacity = '0';
      this.timeoutId = null;
    }, duration);
  }

  /**
   * Show a success notification
   */
  success(message: string, duration = 2000): void {
    this.show(message, { color: '#4ade80', duration });
  }

  /**
   * Show an error notification
   */
  error(message: string, duration = 2000): void {
    this.show(message, { color: '#f87171', duration });
  }

  /**
   * Show an info notification
   */
  info(message: string, duration = 2000): void {
    this.show(message, { color: '#60a5fa', duration });
  }

  /**
   * Show a location notification with name and description
   */
  showLocation(name: string, description: string, duration = 2500): void {
    const html = `<strong class="notification-title">📍 ${name}</strong><br><span class="notification-subtitle">${description}</span>`;
    this.show(html, { color: '#60a5fa', duration, html: true });
  }

  /**
   * Show tourist mode notification
   */
  showTouristMode(started: boolean): void {
    if (started) {
      this.show(
        '🚀 <strong>Tourist Mode</strong> — Sit back and enjoy the ride!<br><span class="notification-hint">Click or press T to take control</span>',
        { color: '#60a5fa', duration: 3000, html: true }
      );
    } else {
      this.show("🎮 <strong>Manual Control</strong> — You're driving now", {
        color: '#4ade80',
        duration: 1500,
        html: true,
      });
    }
  }

  /**
   * Show auto-started tourist mode notification with help text
   */
  showAutoTouristMode(): void {
    this.show(
      '🚀 <strong>Tourist Mode</strong> — Exploring fractal landscapes<br><span class="notification-hint">Press <strong>T</strong> to stop · Press <strong>H</strong> for help</span>',
      { color: '#60a5fa', duration: 5000, html: true }
    );
  }

  /**
   * Show screenshot mode notification
   */
  showScreenshotMode(enabled: boolean): void {
    const message = enabled ? '📷 Screenshot mode (Space to exit)' : '📷 UI restored';
    this.info(message, 1000);
  }

  /**
   * Show share result notification
   */
  showShareResult(success: boolean): void {
    if (success) {
      this.success('📋 Link copied to clipboard!');
    } else {
      this.error('❌ Failed to copy link');
    }
  }

  destroy(): void {
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
    }
    this.element.remove();
  }
}
