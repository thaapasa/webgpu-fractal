/**
 * Fractal Explorer - Main Entry Point
 *
 * "This is where the magic begins. You're welcome."
 * - Skippy the Magnificent
 */

console.log('main.ts script loaded');

function init(): void {
  const app = document.getElementById('app');
  if (!app) {
    console.error('Could not find #app element');
    return;
  }

  // Create canvas element
  const canvas = document.createElement('canvas');
  canvas.id = 'fractal-canvas';
  app.appendChild(canvas);

  // Set canvas size to match window
  const resize = (): void => {
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
  };

  resize();
  window.addEventListener('resize', resize);

  // Verify WebGL 2 support
  const gl = canvas.getContext('webgl2');
  if (!gl) {
    console.error('WebGL 2 is not supported in this browser');
    app.innerHTML = `
      <div style="color: white; text-align: center; padding: 20px; font-family: system-ui, sans-serif;">
        <h1>WebGL 2 Not Supported</h1>
        <p>Your browser does not support WebGL 2, which is required for this application.</p>
        <p>Please try a modern browser like Chrome, Firefox, or Safari.</p>
      </div>
    `;
    return;
  }

  // Set viewport to match canvas size
  gl.viewport(0, 0, canvas.width, canvas.height);

  // Clear to a dark color to prove it's working
  gl.clearColor(0.05, 0.05, 0.1, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  console.log('Fractal Explorer initialized successfully');
  console.log(`Canvas size: ${canvas.width}x${canvas.height}`);
  console.log(`WebGL 2 context acquired`);
}

// Initialize when DOM is ready
try {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
} catch (error) {
  console.error('Failed to initialize Fractal Explorer:', error);
  const app = document.getElementById('app');
  if (app) {
    app.innerHTML = `
      <div style="color: white; text-align: center; padding: 20px; font-family: system-ui, sans-serif;">
        <h1>Initialization Error</h1>
        <p>Failed to initialize the application.</p>
        <pre style="text-align: left; margin-top: 20px; color: #ff6b6b;">${error instanceof Error ? error.message : String(error)}</pre>
      </div>
    `;
  }
}
