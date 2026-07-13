(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();function e(t){"@babel/helpers - typeof";return e=typeof Symbol==`function`&&typeof Symbol.iterator==`symbol`?function(e){return typeof e}:function(e){return e&&typeof Symbol==`function`&&e.constructor===Symbol&&e!==Symbol.prototype?`symbol`:typeof e},e(t)}function t(t,n){if(e(t)!=`object`||!t)return t;var r=t[Symbol.toPrimitive];if(r!==void 0){var i=r.call(t,n||`default`);if(e(i)!=`object`)return i;throw TypeError(`@@toPrimitive must return a primitive value.`)}return(n===`string`?String:Number)(t)}function n(n){var r=t(n,`string`);return e(r)==`symbol`?r:r+``}function r(e,t,r){return(t=n(t))in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}var i=class e{constructor(e){r(this,`device`,void 0),r(this,`context`,void 0),r(this,`canvas`,void 0),r(this,`format`,void 0),r(this,`animationFrameId`,null),r(this,`renderCallback`,null),r(this,`hdrEnabled`,!1),r(this,`_displaySupportsHDR`,!1),r(this,`hdrMediaQuery`,null),r(this,`onHdrChangeCallback`,null),this.canvas=e,this._displaySupportsHDR=this.detectHDRDisplay(),this.setupHdrMediaQueryListener()}get displaySupportsHDR(){return this._displaySupportsHDR}static async create(t){let n=new e(t);return await n.initialize(),n}static isSupported(){return`gpu`in navigator}async initialize(){if(!navigator.gpu)throw Error(`WebGPU is not supported in this browser`);console.log(`WebGPU HDR capability check:`),console.log(`  - Display supports HDR:`,this.displaySupportsHDR),console.log(`  - dynamic-range: high:`,window.matchMedia?.(`(dynamic-range: high)`).matches),console.log(`  - color-gamut: p3:`,window.matchMedia?.(`(color-gamut: p3)`).matches);let e=await navigator.gpu.requestAdapter({powerPreference:`high-performance`});if(!e)throw Error(`Failed to get WebGPU adapter`);if(`info`in e){let t=e.info;console.log(`  - Adapter:`,t?.vendor,t?.architecture)}if(this.device=await e.requestDevice(),this.context=this.canvas.getContext(`webgpu`),!this.context)throw Error(`Failed to get WebGPU context`);this.configureContext(),console.log(`WebGPU initialized successfully`),this.hdrEnabled&&console.log(`HDR mode enabled with rgba16float + extended tone mapping`)}configureContext(){let e=navigator.gpu.getPreferredCanvasFormat();if(this.displaySupportsHDR)try{this.format=`rgba16float`,this.context.configure({device:this.device,format:this.format,alphaMode:`opaque`,toneMapping:{mode:`extended`}}),this.hdrEnabled=!0,console.log(`  - Configured with rgba16float + extended tone mapping (HDR)`)}catch(t){console.log(`  - HDR configuration failed, falling back to SDR:`,t),this.format=e,this.context.configure({device:this.device,format:this.format,alphaMode:`opaque`}),this.hdrEnabled=!1}else this.format=e,this.context.configure({device:this.device,format:this.format,alphaMode:`opaque`}),this.hdrEnabled=!1,console.log(`  - Configured with`,this.format,`(SDR)`)}resize(e,t){let n=window.devicePixelRatio||1;this.canvas.width=e*n,this.canvas.height=t*n,this.canvas.style.width=`${e}px`,this.canvas.style.height=`${t}px`}getCurrentTexture(){return this.context.getCurrentTexture()}start(e){if(this.animationFrameId!==null)return;this.renderCallback=e;let t=()=>{this.renderCallback&&this.renderCallback(),this.animationFrameId=requestAnimationFrame(t)};this.animationFrameId=requestAnimationFrame(t)}stop(){this.animationFrameId!==null&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null),this.renderCallback=null}detectHDRDisplay(){return!!window.matchMedia?.(`(dynamic-range: high)`).matches}setupHdrMediaQueryListener(){window.matchMedia&&(this.hdrMediaQuery=window.matchMedia(`(dynamic-range: high)`),this.hdrMediaQuery.addEventListener?.(`change`,()=>{let e=this.detectHDRDisplay();e!==this._displaySupportsHDR&&(console.log(`HDR display support changed: ${this._displaySupportsHDR} -> ${e}`),this._displaySupportsHDR=e,this.context&&this.device&&this.configureContext(),this.onHdrChangeCallback?.())}))}setOnHdrChange(e){this.onHdrChangeCallback=e}destroy(){this.stop(),this.onHdrChangeCallback=null,this.device?.destroy()}},a=.6;function o(e){return 1+(e-1)*a}var s=class e{constructor(e,t,n,i={}){r(this,`canvas`,void 0),r(this,`viewState`,void 0),r(this,`onChange`,void 0),r(this,`callbacks`,void 0),r(this,`isDragging`,!1),r(this,`lastX`,0),r(this,`lastY`,0),r(this,`lastTouchDistance`,0),r(this,`juliaPickerMode`,!1),r(this,`isPickingJulia`,!1),r(this,`juliaPickViewState`,null),r(this,`keyboardZoomDirection`,null),r(this,`keyboardZoomStartTime`,0),r(this,`keyboardZoomAnimationId`,null),r(this,`locationKeyHeld`,null),r(this,`locationLongPressTimeout`,null),r(this,`fractalKeyHeld`,null),r(this,`fractalLongPressTimeout`,null),this.canvas=e,this.viewState=t,this.onChange=n,this.callbacks=i,this.setupEventListeners()}setCallbacks(e){this.callbacks={...this.callbacks,...e}}setJuliaPickerMode(e){this.juliaPickerMode=e,this.canvas.style.cursor=e?`crosshair`:`grab`}isJuliaPickerModeActive(){return this.juliaPickerMode}setupEventListeners(){this.canvas.addEventListener(`mousedown`,this.handleMouseDown.bind(this)),this.canvas.addEventListener(`mousemove`,this.handleMouseMove.bind(this)),this.canvas.addEventListener(`mouseup`,this.handleMouseUp.bind(this)),this.canvas.addEventListener(`mouseleave`,this.handleMouseUp.bind(this)),this.canvas.addEventListener(`wheel`,this.handleWheel.bind(this),{passive:!1}),this.canvas.addEventListener(`dblclick`,this.handleDoubleClick.bind(this)),this.canvas.addEventListener(`touchstart`,this.handleTouchStart.bind(this),{passive:!1}),this.canvas.addEventListener(`touchmove`,this.handleTouchMove.bind(this),{passive:!1}),this.canvas.addEventListener(`touchend`,this.handleTouchEnd.bind(this)),this.canvas.addEventListener(`touchcancel`,this.handleTouchEnd.bind(this)),window.addEventListener(`keydown`,this.handleKeyDown.bind(this)),window.addEventListener(`keyup`,this.handleKeyUp.bind(this))}getCanvasRect(){return this.canvas.getBoundingClientRect()}getScreenCoords(e,t){let n=this.getCanvasRect();return[e-n.left,t-n.top]}getCanvasSize(){let e=this.getCanvasRect();return[e.width,e.height]}toFractalCoordsWithView(e,t,n,r,i){let a=n/r,o=(e/n-.5)*a,s=t/r-.5;return[i.centerX+o/i.zoom,i.centerY-s/i.zoom]}notifyChange(){this.onChange(this.viewState)}handleMouseDown(e){if(e.button!==0)return;this.callbacks.onUserInput?.();let[t,n]=this.getScreenCoords(e.clientX,e.clientY);if(this.juliaPickerMode&&this.callbacks.onJuliaPick){let[e,r]=this.getCanvasSize();this.juliaPickViewState={centerX:this.viewState.centerX,centerY:this.viewState.centerY,zoom:this.viewState.zoom};let[i,a]=this.toFractalCoordsWithView(t,n,e,r,this.juliaPickViewState);this.isPickingJulia=!0,this.lastX=t,this.lastY=n,this.callbacks.onJuliaPick(i,a);return}this.isDragging=!0,this.lastX=t,this.lastY=n,this.canvas.style.cursor=`grabbing`}handleMouseMove(e){let[t,n]=this.getScreenCoords(e.clientX,e.clientY);if(this.isPickingJulia&&this.callbacks.onJuliaPick&&this.juliaPickViewState){let[e,r]=this.getCanvasSize(),[i,a]=this.toFractalCoordsWithView(t,n,e,r,this.juliaPickViewState);this.callbacks.onJuliaPick(i,a),this.lastX=t,this.lastY=n;return}if(!this.isDragging)return;let r=t-this.lastX,i=n-this.lastY,[a,o]=this.getCanvasSize();this.viewState.pan(r,i,a,o),this.notifyChange(),this.lastX=t,this.lastY=n}handleMouseUp(){if(this.isPickingJulia){this.isPickingJulia=!1,this.juliaPickViewState=null,this.callbacks.onJuliaPickEnd?.();return}this.isDragging&&(this.isDragging=!1,this.canvas.style.cursor=`grab`)}handleWheel(e){e.preventDefault(),this.callbacks.onUserInput?.();let[t,n]=this.getScreenCoords(e.clientX,e.clientY),r=o(e.deltaY>0?.9:1.1),[i,a]=this.getCanvasSize();this.viewState.zoomAt(t,n,r,i,a),this.notifyChange()}handleDoubleClick(e){this.callbacks.onUserInput?.();let[t,n]=this.getScreenCoords(e.clientX,e.clientY),[r,i]=this.getCanvasSize();this.viewState.zoomToPoint(t,n,o(2),r,i),this.notifyChange()}getTouchDistance(e){if(e.length<2)return 0;let t=e[0].clientX-e[1].clientX,n=e[0].clientY-e[1].clientY;return Math.sqrt(t*t+n*n)}getTouchCenter(e){if(e.length===0)return[0,0];if(e.length===1)return this.getScreenCoords(e[0].clientX,e[0].clientY);let t=(e[0].clientX+e[1].clientX)/2,n=(e[0].clientY+e[1].clientY)/2;return this.getScreenCoords(t,n)}handleTouchStart(e){if(this.callbacks.onUserInput?.(),e.touches.length===1){this.isDragging=!0;let[t,n]=this.getScreenCoords(e.touches[0].clientX,e.touches[0].clientY);this.lastX=t,this.lastY=n}else e.touches.length===2&&(this.isDragging=!1,this.lastTouchDistance=this.getTouchDistance(e.touches))}handleTouchMove(e){if(e.preventDefault(),e.touches.length===1&&this.isDragging){let[t,n]=this.getScreenCoords(e.touches[0].clientX,e.touches[0].clientY),r=t-this.lastX,i=n-this.lastY,[a,o]=this.getCanvasSize();this.viewState.pan(r,i,a,o),this.notifyChange(),this.lastX=t,this.lastY=n}else if(e.touches.length===2){let t=this.getTouchDistance(e.touches),n=this.getTouchCenter(e.touches);if(this.lastTouchDistance>0){let e=o(t/this.lastTouchDistance),[r,i]=this.getCanvasSize();this.viewState.zoomAt(n[0],n[1],e,r,i),this.notifyChange()}this.lastTouchDistance=t}}handleTouchEnd(){this.isDragging=!1,this.lastTouchDistance=0}handleKeyDown(t){if(!(t.target instanceof HTMLInputElement||t.target instanceof HTMLTextAreaElement))switch(this.callbacks.onUserInput?.(),t.key){case`+`:case`=`:t.preventDefault(),this.callbacks.onIterationAdjust?.(1);break;case`-`:case`_`:t.preventDefault(),this.callbacks.onIterationAdjust?.(-1);break;case`0`:t.preventDefault(),this.callbacks.onIterationReset?.();break;case`c`:t.preventDefault(),this.callbacks.onCosinePaletteCycle?.(1);break;case`C`:t.preventDefault(),this.callbacks.onCosinePaletteCycle?.(-1);break;case`g`:t.preventDefault(),this.callbacks.onGradientPaletteCycle?.(1);break;case`G`:t.preventDefault(),this.callbacks.onGradientPaletteCycle?.(-1);break;case`[`:case`,`:t.preventDefault(),this.callbacks.onColorOffsetAdjust?.(-.05);break;case`]`:case`.`:t.preventDefault(),this.callbacks.onColorOffsetAdjust?.(.05);break;case`{`:case`<`:t.preventDefault(),this.callbacks.onColorOffsetAdjust?.(-.15);break;case`}`:case`>`:t.preventDefault(),this.callbacks.onColorOffsetAdjust?.(.15);break;case`r`:case`R`:t.preventDefault(),this.callbacks.onColorOffsetReset?.();break;case`b`:t.preventDefault(),this.callbacks.onBrightnessAdjust?.(1);break;case`B`:t.preventDefault(),this.callbacks.onBrightnessAdjust?.(-1);break;case`d`:t.preventDefault(),this.callbacks.onBrightnessReset?.();break;case`f`:t.preventDefault(),!t.repeat&&this.fractalKeyHeld!==`f`&&(this.fractalKeyHeld=`f`,this.fractalLongPressTimeout=setTimeout(()=>{this.fractalKeyHeld===`f`&&(this.callbacks.onFractalCycleAnimate?.(1),this.fractalKeyHeld=null)},e.LONG_PRESS_THRESHOLD));break;case`F`:t.preventDefault(),!t.repeat&&this.fractalKeyHeld!==`F`&&(this.fractalKeyHeld=`F`,this.fractalLongPressTimeout=setTimeout(()=>{this.fractalKeyHeld===`F`&&(this.callbacks.onFractalCycleAnimate?.(-1),this.fractalKeyHeld=null)},e.LONG_PRESS_THRESHOLD));break;case`j`:case`J`:t.preventDefault(),this.callbacks.onToggleJuliaMode?.();break;case`s`:case`S`:t.preventDefault(),this.callbacks.onShare?.();break;case`1`:case`2`:case`3`:case`4`:case`5`:case`6`:case`7`:case`8`:case`9`:t.preventDefault(),!t.repeat&&this.locationKeyHeld!==t.key&&(this.locationKeyHeld=t.key,this.locationLongPressTimeout=setTimeout(()=>{this.locationKeyHeld===t.key&&(this.callbacks.onLocationAnimate?.(t.key),this.locationKeyHeld=null)},e.LONG_PRESS_THRESHOLD));break;case`h`:case`H`:t.preventDefault(),this.callbacks.onToggleHelp?.();break;case` `:t.preventDefault(),this.callbacks.onToggleScreenshotMode?.();break;case`t`:case`T`:t.preventDefault(),this.callbacks.onToggleTouristMode?.();break;case`p`:t.preventDefault(),this.callbacks.onPostProcessPresetCycle?.(1);break;case`P`:t.preventDefault(),this.callbacks.onPostProcessPresetCycle?.(-1);break;case`z`:t.preventDefault(),t.repeat||this.startKeyboardZoom(1);break;case`Z`:t.preventDefault(),t.repeat||this.startKeyboardZoom(-1);break}}handleKeyUp(e){if((e.key===`z`||e.key===`Z`)&&this.stopKeyboardZoom(),e.key>=`1`&&e.key<=`9`&&this.locationKeyHeld===e.key&&(this.locationLongPressTimeout!==null&&(clearTimeout(this.locationLongPressTimeout),this.locationLongPressTimeout=null),this.callbacks.onLocationSelect?.(e.key),this.locationKeyHeld=null),(e.key===`f`||e.key===`F`)&&this.fractalKeyHeld!==null){this.fractalLongPressTimeout!==null&&(clearTimeout(this.fractalLongPressTimeout),this.fractalLongPressTimeout=null);let e=this.fractalKeyHeld===`f`?1:-1;this.callbacks.onFractalCycle?.(e),this.fractalKeyHeld=null}}startKeyboardZoom(e){this.keyboardZoomAnimationId!==null&&this.stopKeyboardZoom(),this.keyboardZoomDirection=e,this.keyboardZoomStartTime=performance.now(),this.keyboardZoomAnimationId=requestAnimationFrame(this.keyboardZoomLoop.bind(this))}stopKeyboardZoom(){this.keyboardZoomAnimationId!==null&&(cancelAnimationFrame(this.keyboardZoomAnimationId),this.keyboardZoomAnimationId=null),this.keyboardZoomDirection=null}keyboardZoomLoop(e){if(this.keyboardZoomDirection===null)return;let t=e-this.keyboardZoomStartTime;this.keyboardZoomStartTime=e;let n=this.keyboardZoomDirection*.7*(t/1e3),r=Math.exp(n),[i,a]=this.getCanvasSize();this.viewState.zoomAt(i/2,a/2,r,i,a),this.notifyChange(),this.keyboardZoomAnimationId=requestAnimationFrame(this.keyboardZoomLoop.bind(this))}destroy(){}};r(s,`LONG_PRESS_THRESHOLD`,400);var c=function(e){return e[e.Mandelbrot=0]=`Mandelbrot`,e[e.MandelbrotJulia=1]=`MandelbrotJulia`,e[e.BurningShip=2]=`BurningShip`,e[e.BurningShipJulia=3]=`BurningShipJulia`,e[e.Tricorn=4]=`Tricorn`,e[e.TricornJulia=5]=`TricornJulia`,e[e.Celtic=6]=`Celtic`,e[e.CelticJulia=7]=`CelticJulia`,e[e.Buffalo=8]=`Buffalo`,e[e.BuffaloJulia=9]=`BuffaloJulia`,e[e.Phoenix=10]=`Phoenix`,e[e.PhoenixJulia=11]=`PhoenixJulia`,e[e.Multibrot3=12]=`Multibrot3`,e[e.Multibrot3Julia=13]=`Multibrot3Julia`,e[e.Multibrot4=14]=`Multibrot4`,e[e.Multibrot4Julia=15]=`Multibrot4Julia`,e[e.Funky=16]=`Funky`,e[e.FunkyJulia=17]=`FunkyJulia`,e[e.Perpendicular=18]=`Perpendicular`,e[e.PerpendicularJulia=19]=`PerpendicularJulia`,e[e.TripleDragon=20]=`TripleDragon`,e[e.TripleDragonJulia=21]=`TripleDragonJulia`,e}({}),l={0:`Mandelbrot`,1:`Mandelbrot Julia`,2:`Burning Ship`,3:`Burning Ship Julia`,4:`Tricorn`,5:`Tricorn Julia`,6:`Celtic`,7:`Celtic Julia`,8:`Buffalo`,9:`Buffalo Julia`,10:`Phoenix`,11:`Phoenix Julia`,12:`Multibrot (z³)`,13:`Multibrot³ Julia`,14:`Multibrot (z⁴)`,15:`Multibrot⁴ Julia`,16:`Funky`,17:`Funky Julia`,18:`Perpendicular`,19:`Perpendicular Julia`,20:`Triple Dragon`,21:`Triple Dragon Julia`};function u(e){return(e&1)==1}function d(e){return e&-2}function f(e){return e|1}var p={TYPE:`t`,CENTER_X:`x`,CENTER_Y:`y`,ZOOM:`z`,PALETTE:`p`,PALETTE_TYPE:`pt`,COSINE_PALETTE:`cp`,GRADIENT_PALETTE:`gp`,COLOR_OFFSET:`o`,JULIA_REAL:`jr`,JULIA_IMAG:`ji`,ITERATIONS:`i`,AA:`aa`};function m(e,t=15){return e===0?`0`:Math.abs(e)<1e-10||Math.abs(e)>1e10?e.toExponential(t):parseFloat(e.toPrecision(t)).toString()}function h(e){if(e===null||e===``)return null;let t=parseFloat(e);return isNaN(t)?null:t}function g(e){let t=new URLSearchParams;return t.set(p.TYPE,e.fractalType.toString()),t.set(p.CENTER_X,m(e.centerX)),t.set(p.CENTER_Y,m(e.centerY)),t.set(p.ZOOM,m(e.zoom)),t.set(p.PALETTE_TYPE,e.paletteType===`cosine`?`c`:`g`),t.set(p.COSINE_PALETTE,e.cosinePaletteIndex.toString()),t.set(p.GRADIENT_PALETTE,e.gradientPaletteIndex.toString()),Math.abs(e.colorOffset)>.001&&t.set(p.COLOR_OFFSET,m(e.colorOffset,4)),u(e.fractalType)&&(t.set(p.JULIA_REAL,m(e.juliaC[0])),t.set(p.JULIA_IMAG,m(e.juliaC[1]))),e.maxIterationsOverride!==null&&t.set(p.ITERATIONS,e.maxIterationsOverride.toString()),e.aaEnabled&&t.set(p.AA,`1`),t.toString()}function _(e){let t=new URLSearchParams(e.replace(/^#/,``)),n={},r=h(t.get(p.TYPE));r!==null&&r>=0&&r<22&&(n.fractalType=r);let i=h(t.get(p.CENTER_X));i!==null&&(n.centerX=i);let a=h(t.get(p.CENTER_Y));a!==null&&(n.centerY=a);let o=h(t.get(p.ZOOM));o!==null&&o>0&&(n.zoom=o);let s=t.get(p.PALETTE_TYPE);(s===`c`||s===`g`)&&(n.paletteType=s===`c`?`cosine`:`gradient`);let c=h(t.get(p.COSINE_PALETTE));c!==null&&c>=0&&(n.cosinePaletteIndex=Math.floor(c));let l=h(t.get(p.GRADIENT_PALETTE));l!==null&&l>=0&&(n.gradientPaletteIndex=Math.floor(l));let u=h(t.get(p.PALETTE));u!==null&&u>=0&&u<=11&&(n.paletteIndex=Math.floor(u));let d=h(t.get(p.COLOR_OFFSET));d!==null&&(n.colorOffset=d);let f=h(t.get(p.JULIA_REAL)),m=h(t.get(p.JULIA_IMAG));f!==null&&m!==null&&(n.juliaC=[f,m]);let g=h(t.get(p.ITERATIONS));return g!==null&&g>0&&(n.maxIterationsOverride=Math.floor(g)),t.get(p.AA)===`1`&&(n.aaEnabled=!0),n}function v(e){let t=g(e),n=new URL(window.location.href);return n.hash=t,n.toString()}function y(e){let t=g(e);window.history.replaceState(null,``,`#`+t)}function ee(){return _(window.location.hash)}async function te(e){let t=v(e);try{return await navigator.clipboard.writeText(t),!0}catch{let e=document.createElement(`textarea`);e.value=t,e.style.position=`fixed`,e.style.left=`-9999px`,document.body.appendChild(e),e.select();try{return document.execCommand(`copy`),!0}catch{return!1}finally{document.body.removeChild(e)}}}function b(e,t,n,r,i,a,o,s={}){return{name:e,description:t,key:n,state:{fractalType:r,centerX:i,centerY:a,zoom:o,paletteType:s.paletteType??`cosine`,cosinePaletteIndex:s.cosinePaletteIndex??1,gradientPaletteIndex:s.gradientPaletteIndex??0,colorOffset:s.colorOffset??0,juliaC:s.juliaC??[-.7,.27015],maxIterationsOverride:s.maxIterationsOverride??null,aaEnabled:!1}}}var ne=[b(`Mandelbrot`,`The famous Mandelbrot set`,`1`,c.Mandelbrot,-.5,0,.4),b(`Seahorse Valley`,`The iconic seahorse-shaped spirals`,`2`,c.Mandelbrot,-.7581249305506096,.11244273987387937,36.41989684959737,{cosinePaletteIndex:5,colorOffset:.05}),b(`Elephant Valley`,`Elephant trunk-like spirals on the positive real side`,`3`,c.Mandelbrot,.2746341335933571,.0066936145282295205,212.15493874953236,{cosinePaletteIndex:3,colorOffset:-.1}),b(`Double Spiral Valley`,`Beautiful double spirals deep in the set`,`4`,c.Mandelbrot,-.743733589978665,.130905227502858,350,{cosinePaletteIndex:5,colorOffset:.15}),b(`Spiral Galaxy`,`Galactic spiral arms emerging from chaos`,`5`,c.Mandelbrot,-.7615484049386866,-.08478444765887823,1506.4927460380957,{cosinePaletteIndex:4,colorOffset:.05}),b(`Douady Rabbit`,`The famous rabbit-eared Julia set`,`6`,c.MandelbrotJulia,0,0,.6,{cosinePaletteIndex:4,colorOffset:.2,juliaC:[-.123,.745]}),b(`Dragon Julia`,`Fierce dragon-like Julia set`,`7`,c.MandelbrotJulia,0,0,.45,{cosinePaletteIndex:3,colorOffset:-.5,juliaC:[-.8,.156]}),b(`Spiral Julia`,`Delicate spiral arms from the main cardioid edge`,`8`,c.MandelbrotJulia,0,0,.5,{cosinePaletteIndex:8,colorOffset:.65,juliaC:[-.75,.11]}),b(`Dendrite Julia`,`Tree-like branching structure on the real axis`,`9`,c.MandelbrotJulia,0,0,.41791083585808675,{cosinePaletteIndex:5,colorOffset:.1,juliaC:[.285,.01]})],re=[b(`Main Ship`,`The iconic burning ship silhouette`,`1`,c.BurningShip,-.6819541375872399,.5906040268456356,.4,{cosinePaletteIndex:4,colorOffset:.3}),b(`The Armada`,`Mini ships along the antenna`,`2`,c.BurningShip,-1.80173025652805,.0153452534367207,9,{cosinePaletteIndex:4,colorOffset:.2}),b(`Bow Detail`,`Intricate patterns at the ship's bow`,`3`,c.BurningShip,-1.7500929615866607,.0368035491770765,10,{cosinePaletteIndex:10,colorOffset:.1}),b(`Bacteria Worm`,`Worm-like structures with mosaic patterns`,`4`,c.BurningShipJulia,0,0,.3,{cosinePaletteIndex:10,colorOffset:-.55,juliaC:[.5179709888623353,.8057669844188748]}),b(`Wispy Coils`,`Wispy coils near the bulbous extrusion from the ship`,`5`,c.BurningShipJulia,0,0,.4,{cosinePaletteIndex:4,colorOffset:.35,juliaC:[.2525994076160102,.0006358222328731386]}),b(`Space Brain`,`Brain-like structures from the bottom of the ship`,`6`,c.BurningShipJulia,0,0,.7,{cosinePaletteIndex:5,colorOffset:.3,juliaC:[-1.059944784917394,-.033218825489255054]}),b(`Spiral Patterns`,`Spiral patterns near the bulbous extrusion`,`7`,c.BurningShipJulia,0,0,.41,{cosinePaletteIndex:11,colorOffset:.55,juliaC:[.28292507376881926,-.007597008191683113]}),b(`Detailed Patterns`,`Beautiful detailed patterns near the bottom of the ship`,`8`,c.BurningShipJulia,0,0,.5,{cosinePaletteIndex:2,colorOffset:.6,juliaC:[-.3967192382583807,-.09102348993288789]})],ie=[b(`Tricorn`,`The main tricorn shape with its distinctive three-cornered symmetry`,`1`,c.Tricorn,-.1343398614022916,-.07051105375213641,.24,{cosinePaletteIndex:11,colorOffset:-.45}),b(`Skewed Mandelbrot`,`Skewed Mandelbrot from one of the main bulbs`,`2`,c.Tricorn,-1.0683098234816064,.13055543771605108,722.5553792774821,{cosinePaletteIndex:5,colorOffset:.1}),b(`Lightning Bolts`,`Lightning bolt-like patterns near the main cardioid edge`,`3`,c.TricornJulia,0,0,.5,{cosinePaletteIndex:5,colorOffset:.2,juliaC:[-.7092474160797806,-.113024316756254]}),b(`Water Lily Leaf`,`Leaf-like structures from the center of the edge of the main cardioid`,`4`,c.TricornJulia,0,0,.43,{colorOffset:-.7,juliaC:[-.1254330794660274,.2407433439223678]}),b(`Lightning Brain`,`Brain-like structures`,`5`,c.TricornJulia,0,0,3.15,{cosinePaletteIndex:5,juliaC:[.8748878776979363,-1.515483485507111]}),b(`Spiral Mosaic`,`Mosaic patterns from the base of one of the main bulbs`,`6`,c.TricornJulia,0,0,.5,{cosinePaletteIndex:11,colorOffset:.55,juliaC:[-.5647012802389192,-.06508603367125808]}),b(`Electric Tendrils`,`Electric tendril patterns with bright highlights`,`7`,c.TricornJulia,0,0,.5,{cosinePaletteIndex:4,colorOffset:.05,juliaC:[-.511125124692869,.0500484416152959]})],ae=[b(`Celtic Knot`,`The main Celtic fractal shape`,`1`,c.Celtic,-.5,0,.25,{cosinePaletteIndex:10,colorOffset:.05}),b(`Celtic Detail`,`Intricate knotwork patterns`,`2`,c.Celtic,-.7803221774980102,.1635662989215261,120,{cosinePaletteIndex:10,colorOffset:.25,maxIterationsOverride:1e4}),b(`Leafy Spirals`,`Symmetric shapes from the tip of the celtic shape`,`3`,c.CelticJulia,0,0,.55,{cosinePaletteIndex:7,colorOffset:.1,juliaC:[.25345198072532704,.0001580704105713714]}),b(`Tendrils`,`Tendrils emerging from fog`,`4`,c.CelticJulia,-.1649932591722856,-.033582161161888655,.28,{cosinePaletteIndex:5,juliaC:[-.4530201342281876,-.8993288590604025]}),b(`Electric Buzz`,`Electric patterns with uniform patterned regions`,`5`,c.CelticJulia,.2,-.3,.55,{colorOffset:.2,juliaC:[-.6378073937333775,1.2082886796996293]}),b(`Intricate Patterns`,`Knotwork patterns with intricate details`,`6`,c.CelticJulia,0,0,.52,{cosinePaletteIndex:10,colorOffset:.3,juliaC:[-.7610237673309276,.12050023730653406]}),b(`Petri Dish`,`Bacteria-like patterns that spread outwards`,`7`,c.CelticJulia,0,0,.55,{cosinePaletteIndex:10,colorOffset:.45,juliaC:[-1.056655765809614,-.16855216053399263]})],oe=[b(`Buffalo Overview`,`The distinctive Buffalo fractal shape`,`1`,c.Buffalo,-.7,.6,.4,{cosinePaletteIndex:2,colorOffset:.45}),b(`Overgrown Cities`,`Tree or cathedral-like structures emerging from real axis`,`2`,c.Buffalo,-1.75,.13,2.4,{colorOffset:0}),b(`Industrial Snowflake`,`Snowflake-like patterns with industrial structures woven in`,`3`,c.BuffaloJulia,.45,0,.85,{cosinePaletteIndex:4,colorOffset:-.1,juliaC:[-1.62727125821226,.00873720402364775]}),b(`Plasma Bursts`,`Plasma-like bursts of color`,`4`,c.BuffaloJulia,0,0,.5,{cosinePaletteIndex:8,colorOffset:-.75,juliaC:[.2745030250648227,.1797320656871218]}),b(`Intricate Patterns`,`Intricate patterns near the bottom of the main shape`,`5`,c.BuffaloJulia,0,0,.5,{cosinePaletteIndex:4,colorOffset:.25,juliaC:[-.5828307625231954,-.3049842077590671]}),b(`Seed Pods`,`Spirals bursting with seeds`,`6`,c.BuffaloJulia,0,0,.6,{cosinePaletteIndex:3,colorOffset:-.75,juliaC:[.3056228373702423,-.007698961937716242]})],se=[b(`Phoenix Overview`,`The Phoenix parameter space`,`1`,c.Phoenix,-.15,-.7,.25,{cosinePaletteIndex:5,colorOffset:-.65}),b(`Classic Phoenix Julia`,`The iconic feathery Phoenix fractal`,`2`,c.PhoenixJulia,0,0,.5,{cosinePaletteIndex:2,colorOffset:.45,juliaC:[-.5,.5667],maxIterationsOverride:1152}),b(`Phoenix Feathers`,`Detailed feather-like structures`,`3`,c.PhoenixJulia,.38,.07,3.4,{cosinePaletteIndex:5,juliaC:[-.5,.5667]}),b(`Golden Weaves`,`Bright golden patterns with intricate weaves`,`4`,c.PhoenixJulia,0,.08,.4,{cosinePaletteIndex:2,colorOffset:.35,juliaC:[.656142759731905,.0353380147311402]}),b(`Fiery Phoenix`,`Fiery wings spreading outwards`,`5`,c.PhoenixJulia,0,-.03,.6,{cosinePaletteIndex:4,colorOffset:-.7,juliaC:[-.272349453272398,.4059142585519806]})],ce=[b(`Multibrot³ Overview`,`The three-fold symmetric z³ Multibrot`,`1`,c.Multibrot3,0,0,.35,{cosinePaletteIndex:5,colorOffset:.35}),b(`The Bulb`,`A bulbous extrusion from the main shape`,`2`,c.Multibrot3,.5852686308492299,.27,6,{colorOffset:.1}),b(`Three-fold Spirals`,`Bright pearly spirals with three-fold symmetry`,`3`,c.Multibrot3Julia,0,0,.4,{cosinePaletteIndex:10,colorOffset:.15,juliaC:[.5448826747676219,.26362559338015445]}),b(`Multibrot³ Julia`,`A Julia set with three-fold symmetry`,`4`,c.Multibrot3Julia,0,0,.434,{cosinePaletteIndex:5,colorOffset:.1,juliaC:[-.45963436785036077,.03389484474578987]}),b(`Double Elephant Valley`,`Two elephants in each group`,`5`,c.Multibrot3,.42814685603247177,.012748071569601296,77,{cosinePaletteIndex:3,colorOffset:0}),b(`Wonky Spiral`,`Wonky spiral Julia structure from inside the main set`,`6`,c.Multibrot3Julia,.3695408370900379,.3371264555793177,2.274691481464049,{cosinePaletteIndex:0,colorOffset:0,juliaC:[.5277614770068884,.15853942850341446],maxIterationsOverride:2124}),b(`Spiral Galaxies`,`The wonky spiral Julia structure viewed as galaxies`,`7`,c.Multibrot3Julia,0,0,.4,{paletteType:`gradient`,juliaC:[.5277614770068884,.15853942850341446],maxIterationsOverride:1152})],le=[b(`Multibrot⁴ Overview`,`The four-fold symmetric z⁴ Multibrot`,`1`,c.Multibrot4,0,0,.4,{cosinePaletteIndex:5,colorOffset:0}),b(`Atomic Spirals`,`Structures resembling atomic orbitals with spiral patterns`,`2`,c.Multibrot4Julia,0,-0,.35,{cosinePaletteIndex:5,colorOffset:.4,juliaC:[-.7878865573262246,.02073442187254452]}),b(`Triple Elephant Valley`,`Now there's three elephants in each group!`,`3`,c.Multibrot4,-.2726362830546699,.44295218397589975,42,{cosinePaletteIndex:3}),b(`Starscape`,`Spiraling galaxies surrounding a black hole`,`4`,c.Multibrot4Julia,0,0,.5,{paletteType:`gradient`,juliaC:[.634977850702787,.194816172925824],maxIterationsOverride:1152}),b(`Static Burst`,`Burst of electricity`,`5`,c.Multibrot4Julia,0,0,.4,{colorOffset:-.75,juliaC:[-.6179887054490777,.487166930716755]})],ue=[b(`Funky Overview`,`The wonderfully weird Funky fractal`,`1`,c.Funky,-.5,0,.35,{cosinePaletteIndex:4,colorOffset:.25}),b(`Tulip Bulb`,`Extrusions resembling tulips near the top of the main shape`,`2`,c.Funky,.303,.534,6.3,{cosinePaletteIndex:10}),b(`Battleship`,`Spaceship-like structure with double turrets all around`,`3`,c.FunkyJulia,0,0,.45,{cosinePaletteIndex:4,colorOffset:-.7,juliaC:[-1.02568231965141,.128286053018475]}),b(`Frog Crab`,`Crablike structure with brain-like spiral patterns within it`,`4`,c.FunkyJulia,0,0,.37,{colorOffset:.1,juliaC:[.30191025227457674,.5253550579235958]}),b(`Spiral Details`,`Beautiful spiral details without too much clutter`,`5`,c.FunkyJulia,-.2,0,.4,{cosinePaletteIndex:5,colorOffset:.6,juliaC:[-.06404194046216194,.662960137583706]}),b(`Migrating Birds`,`Bird-like shapes flying in formation`,`6`,c.FunkyJulia,.34,0,.35,{cosinePaletteIndex:5,colorOffset:.4,juliaC:[.5804003550040334,-.9094296635818582]}),b(`Glittering Coral`,`Brightly gleaming coral-like structures`,`7`,c.FunkyJulia,0,0,.5,{cosinePaletteIndex:11,colorOffset:-.4,juliaC:[-.45427582797825017,-.06920415224913506]})],de=[b(`Perpendicular Overview`,`The Perpendicular Mandelbrot variant`,`1`,c.Perpendicular,-.5,0,.32,{cosinePaletteIndex:2,colorOffset:0}),b(`Seed Pod`,`A pod-like structure near the head of the main shape`,`2`,c.Perpendicular,-.7734996631118647,.12393043736115505,250,{cosinePaletteIndex:5}),b(`Bird of Prey`,`Waveform bird flying out to get you`,`3`,c.PerpendicularJulia,0,0,.35,{cosinePaletteIndex:4,colorOffset:.15,juliaC:[-1.2870593206662457,.022288689289989876]}),b(`Old Dragon`,`Bird-like shape with leathery frayed wings`,`4`,c.PerpendicularJulia,0,0,.3913248754208607,{cosinePaletteIndex:5,colorOffset:.45,juliaC:[-1.0197782349577895,-.13982096184940793]}),b(`Peacock Eyes`,`Glowing eyes of a brightly coloured peacock`,`5`,c.PerpendicularJulia,0,-.8821542839734092,2.8,{cosinePaletteIndex:11,juliaC:[.25987719401314263,-.17615047146201984]}),b(`Mask of the Ancients`,`A detailed mask with intricate patterns`,`6`,c.PerpendicularJulia,0,0,.42,{cosinePaletteIndex:2,colorOffset:-.1,juliaC:[.3021983882651174,.4025604479726435]})],fe=[b(`Triple Dragon Parameter Space`,`The canonical c = 0 view — three-fold symmetric Fatou dust`,`1`,c.TripleDragon,0,0,.5,{colorOffset:.15,maxIterationsOverride:850}),b(`Dragon Overview`,`The three-fold symmetric connected dragon`,`2`,c.TripleDragonJulia,0,0,.5,{cosinePaletteIndex:5,colorOffset:0,juliaC:[.47596153846153855,-.21538461538461529],maxIterationsOverride:850}),b(`Light Blue`,`Thin dragon with intricate details`,`3`,c.TripleDragonJulia,0,0,.5,{cosinePaletteIndex:4,colorOffset:.6,juliaC:[.3956524214054766,-.4780295616453324],maxIterationsOverride:1100}),b(`Tank Tread`,`A connected dragon with endlessly branching arms`,`4`,c.TripleDragonJulia,0,0,.5,{cosinePaletteIndex:5,colorOffset:.25,juliaC:[.476691793393776,-.118823023835833]}),b(`Bacteria Blot`,`Connected area with bright edges`,`5`,c.TripleDragonJulia,0,0,.5,{cosinePaletteIndex:2,colorOffset:-.1,juliaC:[.407784986098239,-.408711770157553],maxIterationsOverride:768})],x=new Map([[c.Mandelbrot,ne],[c.BurningShip,re],[c.Tricorn,ie],[c.Celtic,ae],[c.Buffalo,oe],[c.Phoenix,se],[c.Multibrot3,ce],[c.Multibrot4,le],[c.Funky,ue],[c.Perpendicular,de],[c.TripleDragon,fe]]);function S(e,t){let n=d(t),r=x.get(n);if(r)return r.find(t=>t.key===e)}function C(e){let t=d(e);return x.get(t)??[]}var w=[{name:`Rainbow`,isMonotonic:!1,params:{type:`cosine`,a:[.5,.5,.5],b:[.5,.5,.5],c:[1,1,1],d:[0,.33,.67]}},{name:`Fire`,isMonotonic:!1,params:{type:`cosine`,a:[.5,.5,.5],b:[.5,.5,.5],c:[1,1,.5],d:[0,.1,.2]}},{name:`Ice`,isMonotonic:!1,params:{type:`cosine`,a:[.5,.5,.5],b:[.5,.5,.5],c:[1,.7,.4],d:[0,.15,.2]}},{name:`Sunset`,isMonotonic:!1,params:{type:`cosine`,a:[.5,.3,.2],b:[.5,.4,.3],c:[1,1,.5],d:[0,.1,.2]}},{name:`Electric`,isMonotonic:!1,params:{type:`cosine`,a:[.5,.5,.5],b:[.6,.6,.6],c:[1,1,1],d:[.3,.2,.2]}},{name:`Neon`,isMonotonic:!1,params:{type:`cosine`,a:[.5,.5,.5],b:[.5,.5,.5],c:[1,1,1],d:[0,.1,.2]}},{name:`Emerald`,isMonotonic:!1,params:{type:`cosine`,a:[.2,.5,.3],b:[.3,.5,.3],c:[1,1,1],d:[0,.25,.5]}},{name:`Candy`,isMonotonic:!1,params:{type:`cosine`,a:[.8,.5,.5],b:[.2,.4,.4],c:[1,1,2],d:[0,.25,.25]}},{name:`Plasma`,isMonotonic:!1,params:{type:`cosine`,a:[.5,.5,.5],b:[.5,.5,.5],c:[2,1,0],d:[.5,.2,.25]}},{name:`Peacock`,isMonotonic:!1,params:{type:`cosine`,a:[.3,.5,.5],b:[.4,.4,.3],c:[1,1,1],d:[0,.1,.35]}},{name:`Autumn`,isMonotonic:!1,params:{type:`cosine`,a:[.6,.4,.2],b:[.4,.3,.2],c:[1,1,1],d:[0,.05,.1]}},{name:`Aurora`,isMonotonic:!1,params:{type:`cosine`,a:[.3,.5,.5],b:[.5,.5,.5],c:[1,1,.5],d:[.8,.9,.3]}}],T=w.length,E=[{name:`Blue`,isMonotonic:!0,params:{type:`gradient`,c1:[.02,.01,.08],c2:[.05,.15,.25],c3:[.1,.4,.5],c4:[.3,.6,.8],c5:[.7,.9,1]},hdrParams:{type:`gradient`,c1:[.2,.4,1],c2:[.3,.6,1],c3:[.4,.8,1],c4:[.6,.9,1],c5:[.85,1,1]}},{name:`Gold`,isMonotonic:!0,params:{type:`gradient`,c1:[.04,.02,.01],c2:[.2,.08,.02],c3:[.5,.25,.05],c4:[.85,.6,.2],c5:[1,.95,.7]},hdrParams:{type:`gradient`,c1:[1,.5,.1],c2:[1,.65,.2],c3:[1,.8,.3],c4:[1,.9,.5],c5:[1,1,.8]}},{name:`Grayscale`,isMonotonic:!0,params:{type:`gradient`,c1:[.01,.01,.03],c2:[.15,.15,.17],c3:[.45,.45,.45],c4:[.75,.74,.72],c5:[1,.98,.95]},hdrParams:{type:`gradient`,c1:[1,1,1],c2:[1,1,1],c3:[1,1,1],c4:[1,1,1],c5:[1,1,1]}},{name:`Sepia`,isMonotonic:!0,params:{type:`gradient`,c1:[.03,.02,.01],c2:[.15,.08,.03],c3:[.4,.25,.12],c4:[.7,.55,.35],c5:[1,.95,.85]},hdrParams:{type:`gradient`,c1:[1,.7,.4],c2:[1,.8,.55],c3:[1,.88,.7],c4:[1,.95,.85],c5:[1,1,.95]}},{name:`Ocean`,isMonotonic:!0,params:{type:`gradient`,c1:[0,.02,.05],c2:[.02,.08,.2],c3:[.05,.3,.4],c4:[.2,.6,.6],c5:[.6,.95,.9]},hdrParams:{type:`gradient`,c1:[.1,.8,.8],c2:[.2,.9,.85],c3:[.4,.95,.9],c4:[.65,1,.95],c5:[.85,1,1]}},{name:`Purple`,isMonotonic:!0,params:{type:`gradient`,c1:[.03,.01,.06],c2:[.15,.05,.25],c3:[.4,.15,.5],c4:[.7,.4,.75],c5:[.95,.8,1]},hdrParams:{type:`gradient`,c1:[.8,.2,1],c2:[.85,.4,1],c3:[.9,.6,1],c4:[.95,.8,1],c5:[1,.95,1]}},{name:`Forest`,isMonotonic:!0,params:{type:`gradient`,c1:[.02,.03,.01],c2:[.05,.12,.04],c3:[.1,.35,.15],c4:[.3,.65,.3],c5:[.7,.95,.6]},hdrParams:{type:`gradient`,c1:[.3,1,.2],c2:[.5,1,.4],c3:[.7,1,.55],c4:[.85,1,.75],c5:[.95,1,.9]}}],D=E.length;function O(e){return w[e%T].params}function k(e,t){let n=E[e%D];return t&&n.hdrParams?n.hdrParams:n.params}function pe(e){return w[e%T]}function me(e){return E[e%D]}function he(e){return w[e%T].name}function ge(e){return E[e%D].name}function A(e){let t=u(e),n=e>>1,r;switch(n){case 0:r={juliaBlend:0,preAbsRe:0,preAbsIm:0,preNegIm:0,postAbsRe:0,postAbsIm:0,postNegIm:0};break;case 1:r={juliaBlend:0,preAbsRe:1,preAbsIm:1,preNegIm:1,postAbsRe:0,postAbsIm:0,postNegIm:0};break;case 2:r={juliaBlend:0,preAbsRe:0,preAbsIm:0,preNegIm:0,postAbsRe:0,postAbsIm:0,postNegIm:1};break;case 3:r={juliaBlend:0,preAbsRe:0,preAbsIm:0,preNegIm:0,postAbsRe:1,postAbsIm:0,postNegIm:0};break;case 4:r={juliaBlend:0,preAbsRe:0,preAbsIm:0,preNegIm:0,postAbsRe:1,postAbsIm:1,postNegIm:1};break;case 5:return null;case 6:return null;case 7:return null;case 8:r={juliaBlend:0,preAbsRe:0,preAbsIm:1,preNegIm:0,postAbsRe:0,postAbsIm:0,postNegIm:0};break;case 9:r={juliaBlend:0,preAbsRe:1,preAbsIm:0,preNegIm:0,postAbsRe:0,postAbsIm:0,postNegIm:1};break;default:return null}return r.juliaBlend=+!!t,r}function j(e,t,n){return e+(t-e)*n}function _e(e,t,n){return{juliaBlend:j(e.juliaBlend,t.juliaBlend,n),preAbsRe:j(e.preAbsRe,t.preAbsRe,n),preAbsIm:j(e.preAbsIm,t.preAbsIm,n),preNegIm:j(e.preNegIm,t.preNegIm,n),postAbsRe:j(e.postAbsRe,t.postAbsRe,n),postAbsIm:j(e.postAbsIm,t.postAbsIm,n),postNegIm:j(e.postNegIm,t.postNegIm,n)}}var ve=3e3,M=3e3,ye=8e3,be=2e3,N=.5,xe=.25,Se=3,P=2,F=.6,I=.5;function Ce(e,t,n){if(e<P&&t<P)return B(e,t,n);let r=Math.min(e,t),i=Math.max(I,r*(1-F)+I*F);if(i>=r)return B(e,t,n);let a=Math.log(e),o=Math.log(t),s=Math.log(i),c=1-n,l=c*c*a+2*c*n*s+n*n*o;return Math.exp(l)}function L(e){return e<.5?4*e*e*e:1-(-2*e+2)**3/2}function R(e,t,n){return e+(t-e)*n}function z(e,t,n){return[R(e[0],t[0],n),R(e[1],t[1],n),R(e[2],t[2],n)]}function we(e){return e.paletteType===`cosine`?O(e.cosinePaletteIndex):k(e.gradientPaletteIndex,!1)}function Te(e,t,n){if(e.type===`cosine`&&t.type===`cosine`)return{type:`cosine`,a:z(e.a,t.a,n),b:z(e.b,t.b,n),c:z(e.c,t.c,n),d:z(e.d,t.d,n)};if(e.type===`gradient`&&t.type===`gradient`)return{type:`gradient`,c1:z(e.c1,t.c1,n),c2:z(e.c2,t.c2,n),c3:z(e.c3,t.c3,n),c4:z(e.c4,t.c4,n),c5:z(e.c5,t.c5,n)};if(n<.5)if(e.type===`cosine`){let t=n*2;return{type:`cosine`,a:z(e.a,[.5,.5,.5],t*.3),b:z(e.b,[.3,.3,.3],t*.3),c:e.c,d:e.d}}else return e;else if(t.type===`cosine`){let e=(n-.5)*2;return{type:`cosine`,a:z([.5,.5,.5],t.a,e),b:z([.3,.3,.3],t.b,e),c:t.c,d:t.d}}else return t}function B(e,t,n){return Math.exp(R(Math.log(e),Math.log(t),n))}function V(e,t,n,r,i){let a=Math.sqrt(e*e+t*t),o=Math.sqrt(n*n+r*r),s=Math.atan2(t,e),c=Math.atan2(r,n),l=.01;if(a<l&&o<l)return[R(e,n,i),R(t,r,i)];if(a<l)return[R(0,n,i),R(0,r,i)];if(o<l)return[R(e,0,i),R(t,0,i)];let u=c-s;u>Math.PI?u-=2*Math.PI:u<-Math.PI&&(u+=2*Math.PI);let d=s+u*i,f=R(a,o,i);return[f*Math.cos(d),f*Math.sin(d)]}var H=class{constructor(e,t){r(this,`active`,!1),r(this,`state`,{type:`idle`}),r(this,`animationFrameId`,null),r(this,`callbacks`,void 0),r(this,`currentTarget`,void 0),r(this,`visitedLocations`,new Set),r(this,`recentBaseFractals`,[]),r(this,`tick`,e=>{this.active&&(this.updateAnimation(e),this.animationFrameId=requestAnimationFrame(this.tick))}),this.callbacks=e,this.currentTarget=this.bookmarkToTarget(t)}bookmarkToTarget(e){return{centerX:e.centerX,centerY:e.centerY,zoom:e.zoom,fractalType:e.fractalType,paletteType:e.paletteType,cosinePaletteIndex:e.cosinePaletteIndex,gradientPaletteIndex:e.gradientPaletteIndex,paletteParams:we(e),colorOffset:e.colorOffset,juliaC:e.juliaC,blendParams:A(e.fractalType)}}start(e){this.active||(this.active=!0,this.currentTarget=this.bookmarkToTarget(e),this.visitedLocations.clear(),this.recentBaseFractals=[d(this.currentTarget.fractalType)>>1],this.state={type:`paused`,startTime:performance.now(),duration:1e3},this.animationFrameId=requestAnimationFrame(this.tick),console.log(`🚀 Tourist mode started`))}stop(){this.active&&(this.active=!1,this.state={type:`idle`},this.animationFrameId!==null&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null),console.log(`🛑 Tourist mode stopped`))}isActive(){return this.active}updateCurrentState(e){this.currentTarget=this.bookmarkToTarget(e)}animateToLocation(e,t){this.animationFrameId!==null&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null),this.active=!0,this.currentTarget=this.bookmarkToTarget(t),this.transitionTo(e,!0),this.animationFrameId=requestAnimationFrame(this.tick),console.log(`🎯 Animating to: ${e.name}`)}updateAnimation(e){switch(this.state.type){case`idle`:this.pickNextDestination();break;case`paused`:e-this.state.startTime>=this.state.duration&&this.pickNextDestination();break;case`transitioning`:{let t=e-this.state.startTime,n=Math.min(1,t/this.state.duration),r=L(n),i=V(this.state.from.juliaC[0],this.state.from.juliaC[1],this.state.to.juliaC[0],this.state.to.juliaC[1],r),a=this.state.from.zoom,o=this.state.to.zoom,s=Ce(a,o,n),[c,l]=V(this.state.from.centerX,this.state.from.centerY,this.state.to.centerX,this.state.to.centerY,r),u=Te(this.state.from.paletteParams,this.state.to.paletteParams,r),d=null,f=this.state.from.blendParams,p=this.state.to.blendParams;f&&p?d=_e(f,p,r):n>=.5&&p?d=p:n<.5&&f&&(d=f);let m={centerX:c,centerY:l,zoom:s,fractalType:this.state.to.fractalType,paletteType:this.state.to.paletteType,cosinePaletteIndex:this.state.to.cosinePaletteIndex,gradientPaletteIndex:this.state.to.gradientPaletteIndex,colorOffset:R(this.state.from.colorOffset,this.state.to.colorOffset,r),juliaC:i};this.currentTarget={...this.state.to,centerX:c,centerY:l,zoom:s,paletteParams:u,colorOffset:m.colorOffset,juliaC:i,blendParams:d},this.callbacks.onUpdate(m,u,d),this.callbacks.onRender(),n>=1&&(this.callbacks.onClearInterpolation(),this.state.singleTransition?(this.active=!1,this.state={type:`idle`},this.animationFrameId!==null&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null),console.log(`🎯 Single transition complete`)):this.state={type:`paused`,startTime:e,duration:ve});break}case`zoomingOut`:{let t=e-this.state.startTime,n=Math.min(1,t/this.state.duration),r=L(n),i=B(this.state.from.zoom,this.state.targetZoom,r),a={centerX:this.state.from.centerX,centerY:this.state.from.centerY,zoom:i};this.currentTarget={...this.currentTarget,zoom:i},this.callbacks.onUpdate(a),this.callbacks.onClearInterpolation(),this.callbacks.onRender(),n>=1&&(this.currentTarget.fractalType=this.state.nextFractalType,this.currentTarget.blendParams=A(this.state.nextFractalType),this.callbacks.onUpdate({fractalType:this.state.nextFractalType}),this.callbacks.onClearInterpolation(),this.visitedLocations.clear(),this.pickDestinationForCurrentFractal(!0));break}}}pickNextDestination(){let e=C(this.currentTarget.fractalType).length,t=this.visitedLocations.size,n=1-(1-xe)**Math.max(1,t);e>0&&t>=e&&(n=1),Math.random()<n?this.initiateFractalSwitch():this.pickDestinationForCurrentFractal()}initiateFractalSwitch(){let e=this.pickNewFractalBaseIndex();this.recordBaseFractal(e);let t=e<<1;if(this.currentTarget.zoom<=N*1.5){this.currentTarget.fractalType=t,this.callbacks.onUpdate({fractalType:t}),this.visitedLocations.clear(),this.pickDestinationForCurrentFractal(!0);return}this.state={type:`zoomingOut`,startTime:performance.now(),duration:be,from:{...this.currentTarget},targetZoom:N,nextFractalType:t}}pickNewFractalBaseIndex(){let e=new Set(this.recentBaseFractals),t=[];for(let n=0;n<11;n++)e.has(n)||C(n<<1).length>0&&t.push(n);if(t.length===0&&(t=[...Array(11).keys()].filter(t=>!e.has(t))),t.length===0){let e=d(this.currentTarget.fractalType)>>1;t=[...Array(11).keys()].filter(t=>t!==e)}return t[Math.floor(Math.random()*t.length)]}recordBaseFractal(e){this.recentBaseFractals.push(e),this.recentBaseFractals.length>Se&&this.recentBaseFractals.shift()}pickDestinationForCurrentFractal(e=!1){let t=C(this.currentTarget.fractalType);if(t.length===0){this.currentTarget.fractalType=c.Mandelbrot,this.callbacks.onUpdate({fractalType:c.Mandelbrot}),this.pickDestinationForCurrentFractal(e);return}let n=e&&t.length>1?t.slice(1):t,r=n.filter(e=>!this.visitedLocations.has(this.getLocationKey(e)));r.length===0&&(this.visitedLocations.clear(),r=n);let i=r[Math.floor(Math.random()*r.length)];this.transitionTo(i)}getLocationKey(e){return`${e.state.fractalType}-${e.key}`}transitionTo(e,t=!1){let n=this.bookmarkToTarget(e.state),r=Math.abs(Math.log(n.zoom)-Math.log(this.currentTarget.zoom)),i=Math.sqrt((n.centerX-this.currentTarget.centerX)**2+(n.centerY-this.currentTarget.centerY)**2),a=Math.min(ye,Math.max(M,M+r*500+i*2e3)),o=this.getLocationKey(e);this.visitedLocations.add(o),this.callbacks.onLocationNotification?.(e.name,e.description),this.state={type:`transitioning`,startTime:performance.now(),duration:a,from:{...this.currentTarget},to:n,singleTransition:t}}},Ee=class{constructor(e){r(this,`element`,void 0),r(this,`visible`,!0),this.element=document.createElement(`div`),this.element.id=`zoom-debug`,e.appendChild(this.element)}update(e){if(!this.visible)return;let t=e.zoom,n=t>=1e6?t.toExponential(2):t<1?t.toPrecision(4):String(Math.round(t)),r=e.isManualIterations?` (manual)`:``,i=e.hdrEnabled?Math.abs(e.hdrBrightnessBias)>.01?`HDR (${e.hdrBrightnessBias>0?`+`:``}${e.hdrBrightnessBias.toFixed(2)})`:`HDR`:e.displaySupportsHDR?`HDR available`:`SDR`,a=!e.hdrEnabled&&e.paletteType===`gradient`&&Math.abs(e.sdrGradientBrightness-1)>.01?`brightness ${e.sdrGradientBrightness.toFixed(1)}`:``,o=e.juliaPickerMode?`🎯 Pick Julia point`:``,s=e.isJulia?`c=(${e.juliaC[0].toFixed(4)}, ${e.juliaC[1].toFixed(4)})`:``,c=Math.abs(e.colorOffset)>.001?`offset ${e.colorOffset.toFixed(1)}`:``,l=[e.fractalName,`zoom ${n}`,`iterations ${e.maxIterations}${r}`,e.paletteName];c&&l.push(c),a&&l.push(a),s&&l.push(s),l.push(i),o&&l.push(o),e.postProcessPreset&&l.push(`FX: ${e.postProcessPreset}`),l.push(`H = help`),this.element.textContent=l.join(`  ·  `)}show(){this.visible=!0,this.element.style.display=`block`}hide(){this.visible=!1,this.element.style.display=`none`}destroy(){this.element.remove()}},De=class{constructor(e){r(this,`element`,void 0),r(this,`frameCount`,0),r(this,`fps`,0),r(this,`lastUpdate`,0),r(this,`updateInterval`,500),r(this,`visible`,!0),this.element=document.createElement(`div`),this.element.id=`fps-overlay`,this.element.textContent=`-- FPS`,e.appendChild(this.element)}tick(e){this.frameCount++,e-this.lastUpdate>=this.updateInterval&&(this.fps=Math.round(this.frameCount*1e3/(e-this.lastUpdate)),this.frameCount=0,this.lastUpdate=e,this.visible&&(this.element.textContent=`${this.fps} FPS`))}getFPS(){return this.fps}show(){this.visible=!0,this.element.style.display=`block`}hide(){this.visible=!1,this.element.style.display=`none`}destroy(){this.element.remove()}},Oe=class{constructor(e){r(this,`element`,void 0),r(this,`visible`,!1),this.element=document.createElement(`div`),this.element.id=`help-overlay`,this.element.innerHTML=this.createContent(),e.appendChild(this.element)}toggle(){return this.visible=!this.visible,this.element.classList.toggle(`visible`,this.visible),this.visible}show(){this.visible=!0,this.element.classList.add(`visible`)}hide(){this.visible=!1,this.element.classList.remove(`visible`)}isVisible(){return this.visible}createContent(){return`
      <h2 class="help-title">
        🌀 Fractal Explorer - Keyboard Shortcuts
      </h2>
      <div class="help-grid">
        <div class="help-section">
          <h3 class="help-section-title">Navigation</h3>
          <div class="help-section-content">
            ${this.helpRow(`Drag`,`Pan view`)}
            ${this.helpRow(`Scroll`,`Zoom in/out`)}
            ${this.helpRow(`z / Z`,`Fine zoom (hold)`)}
            ${this.helpRow(`Double-click`,`Zoom in at point`)}
            ${this.helpRow(`1-9`,`Famous locations`)}
          </div>
        </div>
        <div class="help-section">
          <h3 class="help-section-title">Iterations</h3>
          <div class="help-section-content">
            ${this.helpRow(`+/-`,`Adjust iterations`)}
            ${this.helpRow(`0`,`Reset to auto`)}
          </div>
        </div>
        <div class="help-section">
          <h3 class="help-section-title">Colors</h3>
          <div class="help-section-content">
            ${this.helpRow(`C / Shift+C`,`Cosine palettes`)}
            ${this.helpRow(`G / Shift+G`,`Gradient palettes`)}
            ${this.helpRow(`, / .`,`Shift colors (fine)`)}
            ${this.helpRow(`< / >`,`Shift colors (coarse)`)}
            ${this.helpRow(`R`,`Reset color offset`)}
          </div>
        </div>
        <div class="help-section">
          <h3 class="help-section-title">Fractal Type</h3>
          <div class="help-section-content">
            ${this.helpRow(`F / Shift+F`,`Cycle fractals`)}
            ${this.helpRow(`J`,`Julia picker mode`)}
          </div>
        </div>
        <div class="help-section">
          <h3 class="help-section-title">Brightness</h3>
          <div class="help-section-content">
            ${this.helpRow(`B / Shift+B`,`Adjust brightness*`)}
            ${this.helpRow(`D`,`Reset brightness`)}
          </div>
          <div class="help-note">*HDR bias or SDR gradient brightness</div>
        </div>
        <div class="help-section">
          <h3 class="help-section-title">Effects</h3>
          <div class="help-section-content">
            ${this.helpRow(`P / Shift+P`,`Cycle post-process presets`)}
          </div>
          <div class="help-note">Clean · Cinematic · Vivid · Dreamy</div>
        </div>
        <div class="help-section">
          <h3 class="help-section-title">UI</h3>
          <div class="help-section-content">
            ${this.helpRow(`T`,`Tourist mode (auto-tour)`)}
            ${this.helpRow(`H`,`Toggle this help`)}
            ${this.helpRow(`Space`,`Screenshot mode`)}
          </div>
        </div>
        <div class="help-section">
          <h3 class="help-section-title">Share</h3>
          <div class="help-section-content">
            ${this.helpRow(`S`,`Copy bookmark URL`)}
          </div>
        </div>
      </div>
      <div class="help-footer">
        Press <kbd>H</kbd> to close
      </div>
    `}helpRow(e,t){return`
      <div class="help-row">
        <kbd class="help-key">${e}</kbd>
        <span class="help-description">${t}</span>
      </div>
    `}destroy(){this.element.remove()}},ke=class{constructor(e){r(this,`element`,void 0),r(this,`timeoutId`,null),this.element=document.createElement(`div`),this.element.id=`share-notification`,e.appendChild(this.element)}show(e,t={}){let{color:n=`#4ade80`,duration:r=2e3,html:i=!1}=t;this.timeoutId!==null&&clearTimeout(this.timeoutId),i?this.element.innerHTML=e:this.element.textContent=e,this.element.style.color=n,this.element.style.opacity=`1`,this.timeoutId=setTimeout(()=>{this.element.style.opacity=`0`,this.timeoutId=null},r)}success(e,t=2e3){this.show(e,{color:`#4ade80`,duration:t})}error(e,t=2e3){this.show(e,{color:`#f87171`,duration:t})}info(e,t=2e3){this.show(e,{color:`#60a5fa`,duration:t})}showLocation(e,t,n=2500){let r=`<strong class="notification-title">📍 ${e}</strong><br><span class="notification-subtitle">${t}</span>`;this.show(r,{color:`#60a5fa`,duration:n,html:!0})}showTouristMode(e){e?this.show(`🚀 <strong>Tourist Mode</strong> — Sit back and enjoy the ride!<br><span class="notification-hint">Click or press T to take control</span>`,{color:`#60a5fa`,duration:3e3,html:!0}):this.show(`🎮 <strong>Manual Control</strong> — You're driving now`,{color:`#4ade80`,duration:1500,html:!0})}showAutoTouristMode(){this.show(`🚀 <strong>Tourist Mode</strong> — Exploring fractal landscapes<br><span class="notification-hint">Press <strong>T</strong> to stop · Press <strong>H</strong> for help</span>`,{color:`#60a5fa`,duration:5e3,html:!0})}showScreenshotMode(e){let t=e?`📷 Screenshot mode (Space to exit)`:`📷 UI restored`;this.info(t,1e3)}showShareResult(e){e?this.success(`📋 Link copied to clipboard!`):this.error(`❌ Failed to copy link`)}destroy(){this.timeoutId!==null&&clearTimeout(this.timeoutId),this.element.remove()}},Ae=class{constructor(e){r(this,`debug`,void 0),r(this,`fps`,void 0),r(this,`help`,void 0),r(this,`notification`,void 0),r(this,`screenshotMode`,!1),r(this,`screenshotModeAutoEnabled`,!1),this.debug=new Ee(e),this.fps=new De(e),this.help=new Oe(e),this.notification=new ke(e)}toggleScreenshotMode(){return this.setScreenshotMode(!this.screenshotMode,!1),this.notification.showScreenshotMode(this.screenshotMode),this.screenshotMode}setScreenshotMode(e,t=!1){e!==this.screenshotMode&&(this.screenshotMode=e,this.screenshotModeAutoEnabled=t&&e,this.screenshotMode?(this.help.isVisible()&&this.help.hide(),this.debug.hide(),this.fps.hide()):(this.debug.show(),this.fps.show()))}disableAutoScreenshotMode(){this.screenshotModeAutoEnabled&&this.setScreenshotMode(!1,!1)}isScreenshotMode(){return this.screenshotMode}toggleHelp(){return this.help.toggle()}updateDebug(e){this.screenshotMode||this.debug.update(e)}tickFPS(e){this.screenshotMode||this.fps.tick(e)}destroy(){this.debug.destroy(),this.fps.destroy(),this.help.destroy(),this.notification.destroy()}},je=class{constructor(e=-.5,t=0,n=.4){r(this,`centerX`,void 0),r(this,`centerY`,void 0),r(this,`zoom`,void 0),this.centerX=e,this.centerY=t,this.zoom=n}pan(e,t,n,r){let i=n/r,a=-e*i/(this.zoom*n),o=t/(this.zoom*r);this.centerX+=a,this.centerY+=o}zoomAt(e,t,n,r,i){let a=r/i,o=this.centerX+(e/r-.5)*a/this.zoom,s=this.centerY-(t/i-.5)/this.zoom;this.zoom*=n,this.zoom=Math.max(.1,Math.min(this.zoom,0x38d7ea4c68000));let c=this.centerX+(e/r-.5)*a/this.zoom,l=this.centerY-(t/i-.5)/this.zoom;this.centerX+=o-c,this.centerY+=s-l}toFractalCoords(e,t,n,r){let i=n/r,a=(e/n-.5)*i,o=t/r-.5;return[this.centerX+a/this.zoom,this.centerY-o/this.zoom]}toScreenCoords(e,t,n,r){let i=n/r,a=(e-this.centerX)*this.zoom,o=(t-this.centerY)*this.zoom;return[(a/i+.5)*n,(-o+.5)*r]}zoomToPoint(e,t,n,r,i){let[a,o]=this.toFractalCoords(e,t,r,i);this.centerX=a,this.centerY=o,this.zoom*=n,this.zoom=Math.max(.1,Math.min(this.zoom,0x38d7ea4c68000))}reset(){this.centerX=-.5,this.centerY=0,this.zoom=.4}},Me=256,Ne=512,Pe=4096,Fe=640,Ie=1.65;function U(e,t=!1){let n=Math.log10(Math.max(1,e)),r=t?Ne:Me,i=r+Fe*n**+Ie;return Math.round(Math.max(r,Math.min(Pe,i)))}var Le=class{constructor(){r(this,`view`,void 0),r(this,`_fractalType`,c.Mandelbrot),r(this,`_juliaC`,[-.7,.27015]),r(this,`_juliaPickerMode`,!1),r(this,`_isActivelyPickingJulia`,!1),r(this,`_savedViewState`,null),r(this,`_savedFractalType`,null),r(this,`_paletteType`,`cosine`),r(this,`_cosinePaletteIndex`,1),r(this,`_gradientPaletteIndex`,0),r(this,`_colorOffset`,0),r(this,`_maxIterationsOverride`,null),r(this,`_hdrBrightnessBias`,0),r(this,`_sdrGradientBrightness`,1),r(this,`_interpolatedPaletteParams`,null),r(this,`_interpolatedBlendParams`,null),r(this,`listeners`,new Set),this.view=new je}get fractalType(){return this._fractalType}get juliaC(){return this._juliaC}get juliaPickerMode(){return this._juliaPickerMode}get isActivelyPickingJulia(){return this._isActivelyPickingJulia}get savedViewState(){return this._savedViewState}get savedFractalType(){return this._savedFractalType}get paletteType(){return this._paletteType}get cosinePaletteIndex(){return this._cosinePaletteIndex}get gradientPaletteIndex(){return this._gradientPaletteIndex}get colorOffset(){return this._colorOffset}get maxIterationsOverride(){return this._maxIterationsOverride}get hdrBrightnessBias(){return this._hdrBrightnessBias}get sdrGradientBrightness(){return this._sdrGradientBrightness}get interpolatedPaletteParams(){return this._interpolatedPaletteParams}get interpolatedBlendParams(){return this._interpolatedBlendParams}get isJulia(){return u(this._fractalType)}get maxIterations(){return this._maxIterationsOverride??U(this.view.zoom,this.isJulia)}set fractalType(e){this._fractalType!==e&&(this._fractalType=e,this.emit(`fractalType`))}set juliaC(e){this._juliaC=e,this.emit(`julia`)}set juliaPickerMode(e){this._juliaPickerMode=e,this.emit(`julia`)}set isActivelyPickingJulia(e){this._isActivelyPickingJulia=e}set savedViewState(e){this._savedViewState=e}set savedFractalType(e){this._savedFractalType=e}set paletteType(e){this._paletteType!==e&&(this._paletteType=e,this.emit(`palette`))}set cosinePaletteIndex(e){let t=(e%T+T)%T;this._cosinePaletteIndex!==t&&(this._cosinePaletteIndex=t,this.emit(`palette`))}set gradientPaletteIndex(e){let t=(e%D+D)%D;this._gradientPaletteIndex!==t&&(this._gradientPaletteIndex=t,this.emit(`palette`))}set colorOffset(e){this._colorOffset=e,this.emit(`palette`)}set maxIterationsOverride(e){this._maxIterationsOverride=e,this.emit(`iterations`)}set hdrBrightnessBias(e){this._hdrBrightnessBias=Math.max(-1,Math.min(1,e)),this.emit(`brightness`)}set sdrGradientBrightness(e){this._sdrGradientBrightness=Math.max(.1,Math.min(10,e)),this.emit(`brightness`)}set interpolatedPaletteParams(e){this._interpolatedPaletteParams=e}set interpolatedBlendParams(e){this._interpolatedBlendParams=e}clearInterpolationState(){this._interpolatedPaletteParams=null,this._interpolatedBlendParams=null}toBookmark(){return{fractalType:this._fractalType,centerX:this.view.centerX,centerY:this.view.centerY,zoom:this.view.zoom,paletteType:this._paletteType,cosinePaletteIndex:this._cosinePaletteIndex,gradientPaletteIndex:this._gradientPaletteIndex,colorOffset:this._colorOffset,juliaC:this._juliaC,maxIterationsOverride:this._maxIterationsOverride,aaEnabled:!1}}fromBookmark(e){e.centerX!==void 0&&(this.view.centerX=e.centerX),e.centerY!==void 0&&(this.view.centerY=e.centerY),e.zoom!==void 0&&(this.view.zoom=e.zoom),e.fractalType!==void 0&&(this._fractalType=e.fractalType),e.paletteType!==void 0&&(this._paletteType=e.paletteType),e.cosinePaletteIndex!==void 0&&(this._cosinePaletteIndex=e.cosinePaletteIndex%T),e.gradientPaletteIndex!==void 0&&(this._gradientPaletteIndex=e.gradientPaletteIndex%D),e.colorOffset!==void 0&&(this._colorOffset=e.colorOffset),e.juliaC!==void 0&&(this._juliaC=e.juliaC),e.maxIterationsOverride!==void 0&&(this._maxIterationsOverride=e.maxIterationsOverride),this.emit(`all`)}applyBookmark(e){this.view.centerX=e.centerX,this.view.centerY=e.centerY,this.view.zoom=e.zoom,this._fractalType=e.fractalType,this._paletteType=e.paletteType,this._cosinePaletteIndex=e.cosinePaletteIndex,this._gradientPaletteIndex=e.gradientPaletteIndex,this._colorOffset=e.colorOffset,this._juliaC=e.juliaC,this._maxIterationsOverride=e.maxIterationsOverride,this.emit(`all`)}applyPartial(e){e.centerX!==void 0&&(this.view.centerX=e.centerX),e.centerY!==void 0&&(this.view.centerY=e.centerY),e.zoom!==void 0&&(this.view.zoom=e.zoom),e.fractalType!==void 0&&(this._fractalType=e.fractalType),e.paletteType!==void 0&&(this._paletteType=e.paletteType),e.cosinePaletteIndex!==void 0&&(this._cosinePaletteIndex=e.cosinePaletteIndex),e.gradientPaletteIndex!==void 0&&(this._gradientPaletteIndex=e.gradientPaletteIndex),e.colorOffset!==void 0&&(this._colorOffset=e.colorOffset),e.juliaC!==void 0&&(this._juliaC=e.juliaC)}addListener(e){return this.listeners.add(e),()=>this.listeners.delete(e)}emit(e){for(let t of this.listeners)t(e)}notifyViewChange(){this.emit(`view`)}},W={enabled:!1,bloomEnabled:!1,bloomThreshold:.8,bloomIntensity:.3,vignetteEnabled:!1,vignetteIntensity:.4,vignetteSoftness:.5,sharpenEnabled:!1,sharpenStrength:.3,chromaticAberrationEnabled:!1,chromaticAberrationIntensity:.3,toneMappingEnabled:!1,exposure:1,saturation:1.15,temperature:0,ghostMirrorEnabled:!1,ghostMirrorOpacity:.3,ghostMirrorMode:2,kaleidoscopeEnabled:!1,kaleidoscopeSegments:6,waveEnabled:!1,waveAmplitude:.01,waveFrequency:8,feedbackEnabled:!1,feedbackDecay:.85,feedbackInterval:250},G={clean:`Clean`,cinematic:`Cinematic`,vivid:`Vivid`,dreamy:`Dreamy`,psychedelic:`Psychedelic`,acid:`Acid Trip`,ethereal:`Ethereal`},K=[`clean`,`cinematic`,`vivid`,`dreamy`,`psychedelic`,`acid`,`ethereal`],Re={clean:{enabled:!1,bloomEnabled:!1,vignetteEnabled:!1,sharpenEnabled:!1,chromaticAberrationEnabled:!1,toneMappingEnabled:!1},cinematic:{enabled:!0,bloomEnabled:!0,bloomThreshold:.8,bloomIntensity:.3,vignetteEnabled:!0,vignetteIntensity:.4,vignetteSoftness:.5,sharpenEnabled:!1,chromaticAberrationEnabled:!1,toneMappingEnabled:!0,exposure:1,saturation:1.15,temperature:0},vivid:{enabled:!0,bloomEnabled:!0,bloomThreshold:.7,bloomIntensity:.25,vignetteEnabled:!1,sharpenEnabled:!0,sharpenStrength:.4,chromaticAberrationEnabled:!1,toneMappingEnabled:!0,exposure:1,saturation:1.3,temperature:0},dreamy:{enabled:!0,bloomEnabled:!0,bloomThreshold:.5,bloomIntensity:.5,vignetteEnabled:!0,vignetteIntensity:.3,vignetteSoftness:.6,sharpenEnabled:!1,chromaticAberrationEnabled:!0,chromaticAberrationIntensity:.3,toneMappingEnabled:!1},psychedelic:{enabled:!0,bloomEnabled:!0,bloomThreshold:.6,bloomIntensity:.4,vignetteEnabled:!0,vignetteIntensity:.3,vignetteSoftness:.5,ghostMirrorEnabled:!0,ghostMirrorOpacity:.25,ghostMirrorMode:2,kaleidoscopeEnabled:!0,kaleidoscopeSegments:6,toneMappingEnabled:!0,saturation:1.4},acid:{enabled:!0,bloomEnabled:!0,bloomThreshold:.5,bloomIntensity:.5,kaleidoscopeEnabled:!0,kaleidoscopeSegments:8,waveEnabled:!0,waveAmplitude:.015,waveFrequency:10,chromaticAberrationEnabled:!0,chromaticAberrationIntensity:.5,toneMappingEnabled:!0,saturation:1.5,temperature:.3},ethereal:{enabled:!0,bloomEnabled:!0,bloomThreshold:.5,bloomIntensity:.4,ghostMirrorEnabled:!0,ghostMirrorOpacity:.2,ghostMirrorMode:2,vignetteEnabled:!0,vignetteIntensity:.3,vignetteSoftness:.5,feedbackEnabled:!0,feedbackDecay:.5,feedbackInterval:250}};function ze(e){return{...W,...Re[e]}}var Be=`// Bloom Brightness Extraction Pass
// Extracts pixels above a luminance threshold for bloom processing

struct PostProcessUniforms {
  resolution: vec2f,                     // offset 0
  texelSize: vec2f,                      // offset 8
  bloomThreshold: f32,                   // offset 16
  bloomIntensity: f32,                   // offset 20
  vignetteIntensity: f32,                // offset 24
  vignetteSoftness: f32,                 // offset 28
  sharpenStrength: f32,                  // offset 32
  chromaticAberrationIntensity: f32,     // offset 36
  exposure: f32,                         // offset 40
  saturation: f32,                       // offset 44
  temperature: f32,                      // offset 48
  bloomEnabled: i32,                     // offset 52
  vignetteEnabled: i32,                  // offset 56
  sharpenEnabled: i32,                   // offset 60
  chromaticAberrationEnabled: i32,       // offset 64
  toneMappingEnabled: i32,               // offset 68
  _pad1: f32,                            // offset 72
  _pad2: f32,                            // offset 76
}

struct VertexOutput {
  @builtin(position) position: vec4f,
  @location(0) uv: vec2f,
}

@group(0) @binding(0) var texSampler: sampler;
@group(0) @binding(1) var inputTexture: texture_2d<f32>;
@group(0) @binding(2) var<uniform> u: PostProcessUniforms;

@vertex
fn vertexMain(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
  var pos = array<vec2f, 3>(
    vec2f(-1.0, -1.0),
    vec2f(3.0, -1.0),
    vec2f(-1.0, 3.0)
  );
  var output: VertexOutput;
  output.position = vec4f(pos[vertexIndex], 0.0, 1.0);
  let p = pos[vertexIndex];
  output.uv = vec2f((p.x + 1.0) * 0.5, (1.0 - p.y) * 0.5);
  return output;
}

@fragment
fn fragmentMain(input: VertexOutput) -> @location(0) vec4f {
  let color = textureSample(inputTexture, texSampler, input.uv);
  let luminance = dot(color.rgb, vec3f(0.2126, 0.7152, 0.0722));
  let contribution = max(luminance - u.bloomThreshold, 0.0);
  let factor = contribution / max(luminance, 0.001);
  return vec4f(color.rgb * factor, 1.0);
}
`,Ve=`// Separable Gaussian Blur Pass
// Direction is controlled by uniform: (1,0) for horizontal, (0,1) for vertical

struct BlurUniforms {
  texelSize: vec2f,              // offset 0
  direction: vec2f,              // offset 8
}

struct VertexOutput {
  @builtin(position) position: vec4f,
  @location(0) uv: vec2f,
}

@group(0) @binding(0) var texSampler: sampler;
@group(0) @binding(1) var inputTexture: texture_2d<f32>;
@group(0) @binding(2) var<uniform> u: BlurUniforms;

@vertex
fn vertexMain(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
  var pos = array<vec2f, 3>(
    vec2f(-1.0, -1.0),
    vec2f(3.0, -1.0),
    vec2f(-1.0, 3.0)
  );
  var output: VertexOutput;
  output.position = vec4f(pos[vertexIndex], 0.0, 1.0);
  let p = pos[vertexIndex];
  output.uv = vec2f((p.x + 1.0) * 0.5, (1.0 - p.y) * 0.5);
  return output;
}

@fragment
fn fragmentMain(input: VertexOutput) -> @location(0) vec4f {
  // 9-tap Gaussian kernel (sigma ~ 1.5)
  let w0 = 0.227027;
  let w1 = 0.1945946;
  let w2 = 0.1216216;
  let w3 = 0.054054;
  let w4 = 0.016216;

  let step = u.texelSize * u.direction;

  var result = textureSample(inputTexture, texSampler, input.uv).rgb * w0;

  result += textureSample(inputTexture, texSampler, input.uv + step * 1.0).rgb * w1;
  result += textureSample(inputTexture, texSampler, input.uv - step * 1.0).rgb * w1;

  result += textureSample(inputTexture, texSampler, input.uv + step * 2.0).rgb * w2;
  result += textureSample(inputTexture, texSampler, input.uv - step * 2.0).rgb * w2;

  result += textureSample(inputTexture, texSampler, input.uv + step * 3.0).rgb * w3;
  result += textureSample(inputTexture, texSampler, input.uv - step * 3.0).rgb * w3;

  result += textureSample(inputTexture, texSampler, input.uv + step * 4.0).rgb * w4;
  result += textureSample(inputTexture, texSampler, input.uv - step * 4.0).rgb * w4;

  return vec4f(result, 1.0);
}
`,He=`// Final Composite Pass
// Combines fractal image with bloom and applies vignette, sharpen,
// chromatic aberration, and filmic tone mapping

struct PostProcessUniforms {
  resolution: vec2f,                     // offset 0
  texelSize: vec2f,                      // offset 8
  bloomThreshold: f32,                   // offset 16
  bloomIntensity: f32,                   // offset 20
  vignetteIntensity: f32,                // offset 24
  vignetteSoftness: f32,                 // offset 28
  sharpenStrength: f32,                  // offset 32
  chromaticAberrationIntensity: f32,     // offset 36
  exposure: f32,                         // offset 40
  saturation: f32,                       // offset 44
  temperature: f32,                      // offset 48
  bloomEnabled: i32,                     // offset 52
  vignetteEnabled: i32,                  // offset 56
  sharpenEnabled: i32,                   // offset 60
  chromaticAberrationEnabled: i32,       // offset 64
  toneMappingEnabled: i32,               // offset 68
  // Ghost Mirrors
  ghostMirrorEnabled: i32,               // offset 72
  ghostMirrorOpacity: f32,               // offset 76
  ghostMirrorMode: i32,                  // offset 80
  // Kaleidoscope
  kaleidoscopeEnabled: i32,              // offset 84
  kaleidoscopeSegments: f32,             // offset 88
  // Wave Distortion
  waveEnabled: i32,                      // offset 92
  waveAmplitude: f32,                    // offset 96
  waveFrequency: f32,                    // offset 100
  time: f32,                             // offset 104
  // Feedback Trails
  feedbackEnabled: i32,                  // offset 108
  feedbackDecay: f32,                    // offset 112
  _pad1: f32,                            // offset 116 (pad to 16-byte alignment)
}

struct VertexOutput {
  @builtin(position) position: vec4f,
  @location(0) uv: vec2f,
}

@group(0) @binding(0) var texSampler: sampler;
@group(0) @binding(1) var fractalTexture: texture_2d<f32>;
@group(0) @binding(2) var bloomTexture: texture_2d<f32>;
@group(0) @binding(3) var<uniform> u: PostProcessUniforms;
@group(0) @binding(4) var historyTexture: texture_2d<f32>;

@vertex
fn vertexMain(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
  var pos = array<vec2f, 3>(
    vec2f(-1.0, -1.0),
    vec2f(3.0, -1.0),
    vec2f(-1.0, 3.0)
  );
  var output: VertexOutput;
  output.position = vec4f(pos[vertexIndex], 0.0, 1.0);
  let p = pos[vertexIndex];
  output.uv = vec2f((p.x + 1.0) * 0.5, (1.0 - p.y) * 0.5);
  return output;
}

// ACES filmic tone mapping approximation (Narkowicz 2015)
fn acesToneMap(x: vec3f) -> vec3f {
  let a = 2.51;
  let b = 0.03;
  let c = 2.43;
  let d = 0.59;
  let e = 0.14;
  return clamp((x * (a * x + b)) / (x * (c * x + d) + e), vec3f(0.0), vec3f(1.0));
}

const PI: f32 = 3.14159265359;

@fragment
fn fragmentMain(input: VertexOutput) -> @location(0) vec4f {
  var color: vec3f;
  var uv = input.uv;

  // --- Kaleidoscope (UV transform, applied first) ---
  if (u.kaleidoscopeEnabled != 0) {
    let centered = uv - 0.5;
    let angle = atan2(centered.y, centered.x);
    let radius = length(centered);
    let segAngle = 2.0 * PI / u.kaleidoscopeSegments;
    // Fold angle into one segment and mirror alternating segments
    var foldedAngle = angle % segAngle;
    if (foldedAngle < 0.0) { foldedAngle += segAngle; }
    // Mirror: reflect odd segments for seamless joins
    let segIndex = floor((angle + PI) / segAngle);
    if (i32(segIndex) % 2 == 1) {
      foldedAngle = segAngle - foldedAngle;
    }
    uv = vec2f(cos(foldedAngle), sin(foldedAngle)) * radius + 0.5;
  }

  // --- Wave Distortion (UV transform) ---
  if (u.waveEnabled != 0) {
    let wave_x = sin(uv.y * u.waveFrequency * PI * 2.0 + u.time * 2.0) * u.waveAmplitude;
    let wave_y = cos(uv.x * u.waveFrequency * PI * 2.0 + u.time * 1.7) * u.waveAmplitude;
    uv = uv + vec2f(wave_x, wave_y);
  }

  // --- Adaptive Sharpening (Laplacian) ---
  // Applied first, before chromatic aberration, so it operates on clean samples
  if (u.sharpenEnabled != 0) {
    let ts = u.texelSize;
    let center = textureSample(fractalTexture, texSampler, uv).rgb;
    let top = textureSample(fractalTexture, texSampler, uv + vec2f(0.0, -ts.y)).rgb;
    let bot = textureSample(fractalTexture, texSampler, uv + vec2f(0.0, ts.y)).rgb;
    let lft = textureSample(fractalTexture, texSampler, uv + vec2f(-ts.x, 0.0)).rgb;
    let rht = textureSample(fractalTexture, texSampler, uv + vec2f(ts.x, 0.0)).rgb;
    let detail = 4.0 * center - top - bot - lft - rht;
    let contrast = length(detail);
    let adaptiveStrength = u.sharpenStrength * smoothstep(0.0, 0.1, contrast);
    color = center + detail * adaptiveStrength;
  } else {
    color = textureSample(fractalTexture, texSampler, uv).rgb;
  }

  // --- Chromatic Aberration ---
  // Offsets R/G/B channels radially from center for a prismatic effect
  // Applied after sharpening so the fringing isn't amplified by the Laplacian
  if (u.chromaticAberrationEnabled != 0) {
    let dir = uv - 0.5;
    let dist = length(dir);
    let offset = dir * dist * u.chromaticAberrationIntensity * 0.02;
    color.r = textureSample(fractalTexture, texSampler, uv + offset).r;
    color.g = color.g; // Keep center sample (already computed above or by sharpen)
    color.b = textureSample(fractalTexture, texSampler, uv - offset).b;
  }

  // --- Bloom (additive blend) ---
  if (u.bloomEnabled != 0) {
    let bloom = textureSample(bloomTexture, texSampler, uv).rgb;
    color = color + bloom * u.bloomIntensity;
  }

  // --- Ghost Mirrors (translucent mirrored overlays) ---
  if (u.ghostMirrorEnabled != 0) {
    let mode = u.ghostMirrorMode;
    let opacity = u.ghostMirrorOpacity;
    if (mode == 0 || mode == 2) {
      // Horizontal mirror
      let mirrorH = textureSample(fractalTexture, texSampler, vec2f(1.0 - uv.x, uv.y)).rgb;
      color = mix(color, max(color, mirrorH), opacity);
    }
    if (mode == 1 || mode == 2) {
      // Vertical mirror
      let mirrorV = textureSample(fractalTexture, texSampler, vec2f(uv.x, 1.0 - uv.y)).rgb;
      color = mix(color, max(color, mirrorV), opacity);
    }
    if (mode == 3) {
      // Diagonal: flip both axes + blend
      let mirrorD = textureSample(fractalTexture, texSampler, vec2f(1.0 - uv.x, 1.0 - uv.y)).rgb;
      color = mix(color, max(color, mirrorD), opacity);
    }
  }

  // --- Filmic Tone Mapping & Color Grading ---
  if (u.toneMappingEnabled != 0) {
    // Exposure
    color = color * u.exposure;
    // Saturation
    let luma = dot(color, vec3f(0.2126, 0.7152, 0.0722));
    color = mix(vec3f(luma), color, u.saturation);
    // Color temperature (warm/cool shift)
    color.r = color.r * (1.0 + u.temperature * 0.1);
    color.b = color.b * (1.0 - u.temperature * 0.1);
    // ACES filmic curve
    color = acesToneMap(color);
  }

  // --- Vignette (applied last for consistent darkening) ---
  if (u.vignetteEnabled != 0) {
    let dist = length(uv - 0.5) * 1.414; // Normalized: 0 at center, ~1 at corners
    let vig = 1.0 - smoothstep(1.0 - u.vignetteSoftness, 1.0, dist) * u.vignetteIntensity;
    color = color * vig;
  }

  // --- Feedback Trails (blend with previous frame) ---
  if (u.feedbackEnabled != 0) {
    let history = textureSample(historyTexture, texSampler, input.uv).rgb;
    color = mix(color, history, u.feedbackDecay);
  }

  return vec4f(max(color, vec3f(0.0)), 1.0);
}
`,Ue=`// Simple fullscreen texture blit — copies a texture to the render target

@group(0) @binding(0) var texSampler: sampler;
@group(0) @binding(1) var inputTexture: texture_2d<f32>;

struct VertexOutput {
  @builtin(position) position: vec4f,
  @location(0) uv: vec2f,
}

@vertex
fn vertexMain(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
  var pos = array<vec2f, 3>(
    vec2f(-1.0, -1.0),
    vec2f(3.0, -1.0),
    vec2f(-1.0, 3.0)
  );
  var output: VertexOutput;
  output.position = vec4f(pos[vertexIndex], 0.0, 1.0);
  let p = pos[vertexIndex];
  output.uv = vec2f((p.x + 1.0) * 0.5, (1.0 - p.y) * 0.5);
  return output;
}

@fragment
fn fragmentMain(input: VertexOutput) -> @location(0) vec4f {
  return textureSample(inputTexture, texSampler, input.uv);
}
`,q=128,J=16,We=class{constructor(e,t){r(this,`device`,void 0),r(this,`format`,void 0),r(this,`settings`,void 0),r(this,`intermediateTexture`,null),r(this,`bloomExtractTexture`,null),r(this,`bloomBlurTempTexture`,null),r(this,`bloomBlurTexture`,null),r(this,`feedbackTextureA`,null),r(this,`feedbackTextureB`,null),r(this,`feedbackIndex`,0),r(this,`sampler`,void 0),r(this,`bloomExtractPipeline`,void 0),r(this,`blurPipeline`,void 0),r(this,`compositePipeline`,void 0),r(this,`blitPipeline`,void 0),r(this,`singleTextureLayout`,void 0),r(this,`compositeLayout`,void 0),r(this,`blitLayout`,void 0),r(this,`bloomExtractBindGroup`,null),r(this,`blurHBindGroup`,null),r(this,`blurVBindGroup`,null),r(this,`compositeBindGroup`,null),r(this,`compositeBindGroupFB`,[null,null]),r(this,`blitBindGroupFB`,[null,null]),r(this,`uniformBuffer`,void 0),r(this,`blurHUniformBuffer`,void 0),r(this,`blurVUniformBuffer`,void 0),r(this,`width`,0),r(this,`height`,0),r(this,`lastSnapshotTime`,0),this.device=e,this.format=t,this.settings={...W},this.sampler=e.createSampler({label:`Post-Process Sampler`,magFilter:`linear`,minFilter:`linear`,addressModeU:`clamp-to-edge`,addressModeV:`clamp-to-edge`}),this.uniformBuffer=e.createBuffer({label:`Post-Process Uniforms`,size:q,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.blurHUniformBuffer=e.createBuffer({label:`Blur H Uniforms`,size:J,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.blurVUniformBuffer=e.createBuffer({label:`Blur V Uniforms`,size:J,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.singleTextureLayout=e.createBindGroupLayout({label:`Single Texture Layout`,entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,sampler:{type:`filtering`}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:`float`}},{binding:2,visibility:GPUShaderStage.FRAGMENT,buffer:{type:`uniform`}}]}),this.compositeLayout=e.createBindGroupLayout({label:`Composite Layout`,entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,sampler:{type:`filtering`}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:`float`}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:`float`}},{binding:3,visibility:GPUShaderStage.FRAGMENT,buffer:{type:`uniform`}},{binding:4,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:`float`}}]}),this.blitLayout=e.createBindGroupLayout({label:`Blit Layout`,entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,sampler:{type:`filtering`}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:`float`}}]});let n=e.createShaderModule({label:`Bloom Extract Shader`,code:Be}),i=e.createShaderModule({label:`Blur Shader`,code:Ve}),a=e.createShaderModule({label:`Composite Shader`,code:He}),o=e.createShaderModule({label:`Blit Shader`,code:Ue});this.bloomExtractPipeline=e.createRenderPipeline({label:`Bloom Extract Pipeline`,layout:e.createPipelineLayout({bindGroupLayouts:[this.singleTextureLayout]}),vertex:{module:n,entryPoint:`vertexMain`},fragment:{module:n,entryPoint:`fragmentMain`,targets:[{format:t}]},primitive:{topology:`triangle-list`}}),this.blurPipeline=e.createRenderPipeline({label:`Blur Pipeline`,layout:e.createPipelineLayout({bindGroupLayouts:[this.singleTextureLayout]}),vertex:{module:i,entryPoint:`vertexMain`},fragment:{module:i,entryPoint:`fragmentMain`,targets:[{format:t}]},primitive:{topology:`triangle-list`}}),this.compositePipeline=e.createRenderPipeline({label:`Composite Pipeline`,layout:e.createPipelineLayout({bindGroupLayouts:[this.compositeLayout]}),vertex:{module:a,entryPoint:`vertexMain`},fragment:{module:a,entryPoint:`fragmentMain`,targets:[{format:t}]},primitive:{topology:`triangle-list`}}),this.blitPipeline=e.createRenderPipeline({label:`Blit Pipeline`,layout:e.createPipelineLayout({bindGroupLayouts:[this.blitLayout]}),vertex:{module:o,entryPoint:`vertexMain`},fragment:{module:o,entryPoint:`fragmentMain`,targets:[{format:t}]},primitive:{topology:`triangle-list`}}),console.log(`Post-processing pipeline initialized`)}isEnabled(){return this.settings.enabled}setPreset(e){this.settings=ze(e)}resize(e,t){if(e===this.width&&t===this.height)return;this.width=e,this.height=t,this.intermediateTexture?.destroy(),this.bloomExtractTexture?.destroy(),this.bloomBlurTempTexture?.destroy(),this.bloomBlurTexture?.destroy(),this.feedbackTextureA?.destroy(),this.feedbackTextureB?.destroy();let n=Math.max(1,Math.floor(e/2)),r=Math.max(1,Math.floor(t/2));this.intermediateTexture=this.device.createTexture({label:`Post-Process Intermediate`,size:{width:e,height:t},format:this.format,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),this.bloomExtractTexture=this.device.createTexture({label:`Bloom Extract`,size:{width:n,height:r},format:this.format,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),this.bloomBlurTempTexture=this.device.createTexture({label:`Bloom Blur Temp`,size:{width:n,height:r},format:this.format,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),this.bloomBlurTexture=this.device.createTexture({label:`Bloom Blur`,size:{width:n,height:r},format:this.format,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),this.feedbackTextureA=this.device.createTexture({label:`Feedback A`,size:{width:e,height:t},format:this.format,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),this.feedbackTextureB=this.device.createTexture({label:`Feedback B`,size:{width:e,height:t},format:this.format,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),this.feedbackIndex=0,this.createBindGroups(n,r)}getIntermediateTextureView(){return this.intermediateTexture.createView()}encodePostProcessPasses(e,t){if(this.updateUniforms(),this.settings.bloomEnabled){let t=e.beginRenderPass({label:`Bloom Extract`,colorAttachments:[{view:this.bloomExtractTexture.createView(),clearValue:{r:0,g:0,b:0,a:1},loadOp:`clear`,storeOp:`store`}]});t.setPipeline(this.bloomExtractPipeline),t.setBindGroup(0,this.bloomExtractBindGroup),t.draw(3),t.end();let n=e.beginRenderPass({label:`Blur Horizontal`,colorAttachments:[{view:this.bloomBlurTempTexture.createView(),clearValue:{r:0,g:0,b:0,a:1},loadOp:`clear`,storeOp:`store`}]});n.setPipeline(this.blurPipeline),n.setBindGroup(0,this.blurHBindGroup),n.draw(3),n.end();let r=e.beginRenderPass({label:`Blur Vertical`,colorAttachments:[{view:this.bloomBlurTexture.createView(),clearValue:{r:0,g:0,b:0,a:1},loadOp:`clear`,storeOp:`store`}]});r.setPipeline(this.blurPipeline),r.setBindGroup(0,this.blurVBindGroup),r.draw(3),r.end()}if(this.settings.feedbackEnabled){let n=performance.now(),r=this.settings.feedbackInterval,i=r<=0||n-this.lastSnapshotTime>=r,a=this.feedbackIndex;if(i){this.lastSnapshotTime=n;let r=a===0?this.feedbackTextureA.createView():this.feedbackTextureB.createView(),i=e.beginRenderPass({label:`Composite (→ Feedback)`,colorAttachments:[{view:r,clearValue:{r:0,g:0,b:0,a:1},loadOp:`clear`,storeOp:`store`}]});i.setPipeline(this.compositePipeline),i.setBindGroup(0,this.compositeBindGroupFB[a]),i.draw(3),i.end();let o=e.beginRenderPass({label:`Blit (Feedback → Canvas)`,colorAttachments:[{view:t,clearValue:{r:0,g:0,b:0,a:1},loadOp:`clear`,storeOp:`store`}]});o.setPipeline(this.blitPipeline),o.setBindGroup(0,this.blitBindGroupFB[a]),o.draw(3),o.end(),this.feedbackIndex=1-a}else{let n=e.beginRenderPass({label:`Composite (with frozen history)`,colorAttachments:[{view:t,clearValue:{r:0,g:0,b:0,a:1},loadOp:`clear`,storeOp:`store`}]});n.setPipeline(this.compositePipeline),n.setBindGroup(0,this.compositeBindGroupFB[a]),n.draw(3),n.end()}}else{let n=e.beginRenderPass({label:`Composite`,colorAttachments:[{view:t,clearValue:{r:0,g:0,b:0,a:1},loadOp:`clear`,storeOp:`store`}]});n.setPipeline(this.compositePipeline),n.setBindGroup(0,this.compositeBindGroup),n.draw(3),n.end()}}createBindGroups(e,t){let n=this.intermediateTexture.createView(),r=this.bloomExtractTexture.createView(),i=this.bloomBlurTempTexture.createView(),a=this.bloomBlurTexture.createView();this.bloomExtractBindGroup=this.device.createBindGroup({label:`Bloom Extract Bind Group`,layout:this.singleTextureLayout,entries:[{binding:0,resource:this.sampler},{binding:1,resource:n},{binding:2,resource:{buffer:this.uniformBuffer}}]}),this.blurHBindGroup=this.device.createBindGroup({label:`Blur H Bind Group`,layout:this.singleTextureLayout,entries:[{binding:0,resource:this.sampler},{binding:1,resource:r},{binding:2,resource:{buffer:this.blurHUniformBuffer}}]}),this.blurVBindGroup=this.device.createBindGroup({label:`Blur V Bind Group`,layout:this.singleTextureLayout,entries:[{binding:0,resource:this.sampler},{binding:1,resource:i},{binding:2,resource:{buffer:this.blurVUniformBuffer}}]});let o=this.feedbackTextureA.createView(),s=this.feedbackTextureB.createView();this.compositeBindGroup=this.device.createBindGroup({label:`Composite Bind Group`,layout:this.compositeLayout,entries:[{binding:0,resource:this.sampler},{binding:1,resource:n},{binding:2,resource:a},{binding:3,resource:{buffer:this.uniformBuffer}},{binding:4,resource:o}]}),this.compositeBindGroupFB[0]=this.device.createBindGroup({label:`Composite Bind Group (FB→A)`,layout:this.compositeLayout,entries:[{binding:0,resource:this.sampler},{binding:1,resource:n},{binding:2,resource:a},{binding:3,resource:{buffer:this.uniformBuffer}},{binding:4,resource:s}]}),this.compositeBindGroupFB[1]=this.device.createBindGroup({label:`Composite Bind Group (FB→B)`,layout:this.compositeLayout,entries:[{binding:0,resource:this.sampler},{binding:1,resource:n},{binding:2,resource:a},{binding:3,resource:{buffer:this.uniformBuffer}},{binding:4,resource:o}]}),this.blitBindGroupFB[0]=this.device.createBindGroup({label:`Blit Bind Group (A)`,layout:this.blitLayout,entries:[{binding:0,resource:this.sampler},{binding:1,resource:o}]}),this.blitBindGroupFB[1]=this.device.createBindGroup({label:`Blit Bind Group (B)`,layout:this.blitLayout,entries:[{binding:0,resource:this.sampler},{binding:1,resource:s}]});let c=new Float32Array([1/e,1/t,1,0]);this.device.queue.writeBuffer(this.blurHUniformBuffer,0,c);let l=new Float32Array([1/e,1/t,0,1]);this.device.queue.writeBuffer(this.blurVUniformBuffer,0,l)}updateUniforms(){let e=new ArrayBuffer(q),t=new Float32Array(e),n=new Int32Array(e);if(t[0]=this.width,t[1]=this.height,t[2]=1/this.width,t[3]=1/this.height,t[4]=this.settings.bloomThreshold,t[5]=this.settings.bloomIntensity,t[6]=this.settings.vignetteIntensity,t[7]=this.settings.vignetteSoftness,t[8]=this.settings.sharpenStrength,t[9]=this.settings.chromaticAberrationIntensity,t[10]=this.settings.exposure,t[11]=this.settings.saturation,t[12]=this.settings.temperature,n[13]=+!!this.settings.bloomEnabled,n[14]=+!!this.settings.vignetteEnabled,n[15]=+!!this.settings.sharpenEnabled,n[16]=+!!this.settings.chromaticAberrationEnabled,n[17]=+!!this.settings.toneMappingEnabled,n[18]=+!!this.settings.ghostMirrorEnabled,t[19]=this.settings.ghostMirrorOpacity,n[20]=this.settings.ghostMirrorMode,n[21]=+!!this.settings.kaleidoscopeEnabled,t[22]=this.settings.kaleidoscopeSegments,n[23]=+!!this.settings.waveEnabled,t[24]=this.settings.waveAmplitude,t[25]=this.settings.waveFrequency,t[26]=performance.now()*.001,n[27]=+!!this.settings.feedbackEnabled,this.settings.feedbackEnabled&&this.settings.feedbackInterval>0){let e=performance.now()-this.lastSnapshotTime,n=1.5/this.settings.feedbackInterval;t[28]=this.settings.feedbackDecay*Math.exp(-n*e)}else t[28]=this.settings.feedbackDecay;this.device.queue.writeBuffer(this.uniformBuffer,0,e)}destroy(){this.intermediateTexture?.destroy(),this.bloomExtractTexture?.destroy(),this.bloomBlurTempTexture?.destroy(),this.bloomBlurTexture?.destroy(),this.feedbackTextureA?.destroy(),this.feedbackTextureB?.destroy(),this.uniformBuffer.destroy(),this.blurHUniformBuffer.destroy(),this.blurVUniformBuffer.destroy()}},Ge=`// WebGPU Shader for Mandelbrot Set with HDR support
// Version 3: Fractal type interpolation support for smooth Tourist Mode transitions

struct Uniforms {
  resolution: vec2f,         // offset 0, size 8
  center: vec2f,             // offset 8, size 8
  zoom: f32,                 // offset 16, size 4
  maxIterations: i32,        // offset 20, size 4
  time: f32,                 // offset 24, size 4
  colorOffset: f32,          // offset 28, size 4
  fractalType: i32,          // offset 32, size 4
  _pad_jc: f32,              // offset 36, size 4 (padding for juliaC alignment)
  juliaC: vec2f,             // offset 40, size 8
  hdrEnabled: i32,           // offset 48, size 4
  hdrBrightnessBias: f32,    // offset 52, size 4
  paletteType: i32,          // offset 56, size 4
  isMonotonic: i32,          // offset 60, size 4
  sdrGradientBrightness: f32, // offset 64, size 4
  // Fractal blend parameters (offset 68)
  blendJulia: f32,           // offset 68, size 4 - 0=Mandelbrot-style, 1=Julia-style
  blendPreAbsRe: f32,        // offset 72, size 4 - abs(Re(z)) before squaring
  blendPreAbsIm: f32,        // offset 76, size 4 - abs(Im(z)) before squaring
  // Now at offset 80 = 16-byte aligned for vec3f
  // Cosine palette: color = a + b * cos(2π * (c * t + d))
  paletteA: vec3f,           // offset 80, size 12
  _padA: f32,                // offset 92, size 4
  paletteB: vec3f,           // offset 96, size 12
  _padB: f32,                // offset 108, size 4
  paletteC: vec3f,           // offset 112, size 12
  _padC: f32,                // offset 124, size 4
  paletteD: vec3f,           // offset 128, size 12
  _padD: f32,                // offset 140, size 4
  // Gradient palette: 5 color stops (offset 144)
  gradientC1: vec3f,         // offset 144, size 12
  _padG1: f32,               // offset 156, size 4
  gradientC2: vec3f,         // offset 160, size 12
  _padG2: f32,               // offset 172, size 4
  gradientC3: vec3f,         // offset 176, size 12
  _padG3: f32,               // offset 188, size 4
  gradientC4: vec3f,         // offset 192, size 12
  _padG4: f32,               // offset 204, size 4
  gradientC5: vec3f,         // offset 208, size 12
  _padG5: f32,               // offset 220, size 4
  // More blend parameters (offset 224)
  blendPreNegIm: f32,        // offset 224, size 4 - negate Im after abs
  blendPostAbsRe: f32,       // offset 228, size 4 - abs(Re(z²)) after squaring
  blendPostAbsIm: f32,       // offset 232, size 4 - abs(Im(z²)) after squaring
  blendPostNegIm: f32,       // offset 236, size 4 - negate Im(z²)
  blendEnabled: i32,         // offset 240, size 4 - 1 if blending active, 0 for legacy path
  _padBlend1: f32,           // offset 244, size 4 - padding
  _padBlend2: f32,           // offset 248, size 4 - padding
  _padBlend3: f32,           // offset 252, size 4 - padding to 256 bytes
}

@group(0) @binding(0) var<uniform> u: Uniforms;

struct VertexOutput {
  @builtin(position) position: vec4f,
  @location(0) uv: vec2f,
}

@vertex
fn vertexMain(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
  var pos = array<vec2f, 3>(
    vec2f(-1.0, -1.0),
    vec2f(3.0, -1.0),
    vec2f(-1.0, 3.0)
  );
  var output: VertexOutput;
  output.position = vec4f(pos[vertexIndex], 0.0, 1.0);
  output.uv = (pos[vertexIndex] + 1.0) * 0.5;
  return output;
}

// Cosine palette formula
fn cosineColor(t: f32, a: vec3f, b: vec3f, c: vec3f, d: vec3f) -> vec3f {
  return a + b * cos(6.28318 * (c * t + d));
}

// 5-stop gradient
fn gradientColor(t: f32, c1: vec3f, c2: vec3f, c3: vec3f, c4: vec3f, c5: vec3f) -> vec3f {
  if (t < 0.25) { return mix(c1, c2, t * 4.0); }
  else if (t < 0.5) { return mix(c2, c3, (t - 0.25) * 4.0); }
  else if (t < 0.75) { return mix(c3, c4, (t - 0.5) * 4.0); }
  else { return mix(c4, c5, (t - 0.75) * 4.0); }
}

// Get color based on palette type
fn getColor(t_in: f32, isCycling: bool) -> vec3f {
  var t = t_in;
  if (isCycling) {
    t = fract(t);
  } else {
    t = clamp(t, 0.0, 1.0);
  }

  if (u.paletteType == 0) {
    return cosineColor(t, u.paletteA, u.paletteB, u.paletteC, u.paletteD);
  } else {
    var color = gradientColor(t, u.gradientC1, u.gradientC2, u.gradientC3, u.gradientC4, u.gradientC5);
    // Apply SDR gradient brightness adjustment (only affects SDR mode)
    if (u.hdrEnabled == 0) {
      color = color * u.sdrGradientBrightness;
    }
    return color;
  }
}

// HDR brightness curve for MONOTONIC palettes
// bias: -1 to +1, shifts the bright region earlier (positive) or later (negative)
fn hdrBrightnessCurveMonotonic(normalized: f32, bias: f32) -> f32 {
  // Shift the normalized value by bias to move bright regions
  // bias > 0: more of the image becomes bright (bright region starts earlier)
  // bias < 0: less of the image is bright (bright region starts later)
  let shifted = clamp(normalized + bias * 0.4, 0.0, 1.0);

  let LOW_END = 0.05;
  let MID_START = 0.30;
  let HIGH_START = 0.60;
  let PEAK = 10.0; // Fixed peak multiplier for HDR

  if (shifted < LOW_END) {
    let t = shifted / LOW_END;
    return mix(0.0, 0.15, sqrt(t));
  } else if (shifted < MID_START) {
    let t = (shifted - LOW_END) / (MID_START - LOW_END);
    return mix(0.15, 0.5, t);
  } else if (shifted < HIGH_START) {
    let t = (shifted - MID_START) / (HIGH_START - MID_START);
    return mix(0.5, 1.0, t);
  } else {
    let t = (shifted - HIGH_START) / (1.0 - HIGH_START);
    let eased = pow(t, 1.1);
    return mix(1.0, PEAK, eased);
  }
}

// HDR brightness curve for CYCLING palettes
// bias: -1 to +1, shifts the HDR highlight region
fn hdrBrightnessCurveCycling(normalized: f32, bias: f32) -> f32 {
  // Shift where the HDR boost kicks in
  // bias > 0: HDR highlights appear earlier (more of image gets boost)
  // bias < 0: HDR highlights appear later (only near-boundary gets boost)
  let HIGH_START = clamp(0.70 - bias * 0.25, 0.3, 0.95);
  let PEAK = 10.0; // Fixed peak multiplier for HDR

  if (normalized < HIGH_START) {
    let t = normalized / HIGH_START;
    return mix(0.85, 1.0, t);
  } else {
    let t = (normalized - HIGH_START) / (1.0 - HIGH_START);
    let eased = pow(t, 1.2);
    return mix(1.0, PEAK, eased);
  }
}

// ============================================================================
// BLENDED FRACTAL ITERATION
// Enables smooth morphing between z² fractal variants during transitions
// ============================================================================

const BLEND_SUPPRESS_STRENGTH: f32 = 0.6;
const BLEND_SUPPRESS_LIMIT: f32 = 1.5;

// Cumulative measure of how far the blend parameters are from pure fractal states.
// Range: 0 (pure state) to 6 (all params at midpoint).
fn blendHybridness() -> f32 {
  let h1 = 1.0 - abs(2.0 * u.blendPreAbsRe - 1.0);
  let h2 = 1.0 - abs(2.0 * u.blendPreAbsIm - 1.0);
  let h3 = 1.0 - abs(2.0 * u.blendPreNegIm - 1.0);
  let h4 = 1.0 - abs(2.0 * u.blendPostAbsRe - 1.0);
  let h5 = 1.0 - abs(2.0 * u.blendPostAbsIm - 1.0);
  let h6 = 1.0 - abs(2.0 * u.blendPostNegIm - 1.0);
  return h1 + h2 + h3 + h4 + h5 + h6;
}

// Blended z² iteration - parameterizes all z² variants into a unified formula
fn iterateBlended(z: vec2f, c: vec2f) -> vec2f {
  // Pre-square transforms: optionally apply abs() to components
  var zp = z;

  // Blend between z.x and abs(z.x)
  zp.x = mix(z.x, abs(z.x), u.blendPreAbsRe);

  // Blend between z.y and abs(z.y)
  zp.y = mix(z.y, abs(z.y), u.blendPreAbsIm);

  // Optionally negate Im after abs (for Burning Ship's downward orientation)
  zp.y = mix(zp.y, -abs(z.y), u.blendPreNegIm);

  // Compute z² = (x² - y²) + 2xy·i
  let zSqRe = zp.x * zp.x - zp.y * zp.y;
  let zSqIm = 2.0 * zp.x * zp.y;

  // Post-square transforms: optionally apply abs() to components of z²
  var resultRe = mix(zSqRe, abs(zSqRe), u.blendPostAbsRe);
  var resultIm = mix(zSqIm, abs(zSqIm), u.blendPostAbsIm);

  // Optionally negate Im (for Tricorn conjugate, Buffalo, Perpendicular)
  resultIm = mix(resultIm, -resultIm, u.blendPostNegIm);

  // Add c and return
  return vec2f(resultRe + c.x, resultIm + c.y);
}

@fragment
fn fragmentMain(input: VertexOutput) -> @location(0) vec4f {
  let aspect = u.resolution.x / u.resolution.y;
  var uv = input.uv - 0.5;
  uv.x *= aspect;
  let pos = u.center + uv / u.zoom;

  var z: vec2f;
  var c: vec2f;
  var zPrev: vec2f = vec2f(0.0); // For Phoenix fractal

  // Determine if this is a Julia variant (odd types have bit 0 set)
  let fType = u.fractalType;
  let isJulia = (fType & 1) == 1;
  let baseType = fType >> 1; // 0=Mandelbrot, 1=BurningShip, 2=Tricorn, etc.

  // Phoenix is naturally Julia-style - always start z at pixel position
  let isPhoenix = baseType == 5;

  // Triple Dragon is a rational map whose iconic form is a Julia render:
  // z₀ = pixel, c = constant. Its base view uses c = 0 (juliaC set by the
  // location), the Julia variant lets you pick other c values.
  let isTripleDragon = baseType == 10;

  // Check if we're using blended mode (for smooth fractal type transitions)
  let useBlendedMode = u.blendEnabled != 0;

  if (useBlendedMode) {
    // BLENDED MODE: Use interpolated initial conditions
    // This enables smooth Mandelbrot ↔ Julia transitions
    z = mix(vec2f(0.0), pos, u.blendJulia);
    c = mix(pos, u.juliaC, u.blendJulia);
  } else if (isJulia || isTripleDragon) {
    // LEGACY MODE: Julia variant (Triple Dragon always uses this z₀ = pixel init)
    // For Phoenix Julia, swap and negate to match conventional orientation
    // (feathers extending horizontally, correct vertical orientation)
    if (isPhoenix) {
      z = vec2f(-pos.y, pos.x);  // Rotate 90° CCW to match reference images
    } else {
      z = pos;
    }
    // Base Triple Dragon (non-Julia) is the canonical c = 0 view: 3-fold
    // symmetric Fatou dust, independent of juliaC so it is fully reproducible
    // from a shared link. Its Julia variant sweeps c to reveal the dragons.
    if (isTripleDragon && !isJulia) {
      c = vec2f(0.0, 0.0);
    } else {
      c = u.juliaC;
    }
  } else {
    // LEGACY MODE: Mandelbrot-style
    z = vec2f(0.0);
    c = pos;
  }

  var iterations = 0;
  let maxIter = u.maxIterations;

  // Triple Dragon convergence tracking (smooth colouring)
  var tripleSmooth = 0.0;   // fractional iteration at which the orbit settled
  var prevDelta = 1e30;     // |z_{n-1} - z_{n-2}| from the previous step

  for (var i = 0; i < 65536; i++) {
    if (i >= maxIter) { break; }
    let zMagSq = dot(z, z);
    // Triple Dragon (baseType 10) is a bounded rational map: z³/(z³+1) → 1 as
    // |z| → ∞, so it never truly escapes. It is classified by convergence to a
    // fixed point instead (handled after the dispatch below), so skip the
    // magnitude-escape test for it.
    if (zMagSq > 256.0 && baseType != 10) { break; } // Larger escape for higher powers

    let zTemp = z;

    // BLENDED MODE: Use parameterized iteration for smooth morphing
    if (useBlendedMode) {
      z = iterateBlended(z, c);

      // Suppress z magnitude during blend to prevent premature escape.
      // Only activates when |z| exceeds softLimit AND blend is in the
      // degenerate middle zone. Exponential compression on the excess.
      let hybridness = blendHybridness();
      let mag = length(z);
      if (mag > BLEND_SUPPRESS_LIMIT && hybridness > 0.0) {
        let excess = mag - BLEND_SUPPRESS_LIMIT;
        let compressed = excess * exp(-BLEND_SUPPRESS_STRENGTH * hybridness);
        z = z * ((BLEND_SUPPRESS_LIMIT + compressed) / mag);
      }
    }
    // LEGACY MODE: Fractal type dispatch using base type
    // 0: Mandelbrot/Julia, 1: Burning Ship, 2: Tricorn, 3: Celtic,
    // 4: Buffalo, 5: Phoenix, 6: Multibrot3, 7: Multibrot4, 8: Funky, 9: Perpendicular
    else if (baseType == 0) {
      // Mandelbrot / Julia: z² + c
      z = vec2f(z.x * z.x - z.y * z.y + c.x, 2.0 * z.x * z.y + c.y);
    }
    else if (baseType == 1) {
      // Burning Ship: |z|² + c (take abs before squaring)
      z = vec2f(abs(z.x), -abs(z.y));
      z = vec2f(z.x * z.x - z.y * z.y + c.x, 2.0 * z.x * z.y + c.y);
    }
    else if (baseType == 2) {
      // Tricorn: conj(z)² + c
      z = vec2f(z.x * z.x - z.y * z.y + c.x, -2.0 * z.x * z.y + c.y);
    }
    else if (baseType == 3) {
      // Celtic: |Re(z²)| + Im(z²)i + c
      let zSqReal = z.x * z.x - z.y * z.y;
      let zSqImag = 2.0 * z.x * z.y;
      z = vec2f(abs(zSqReal) + c.x, zSqImag + c.y);
    }
    else if (baseType == 4) {
      // Buffalo: |Re(z²)| - |Im(z²)|i + c
      let zSqReal = z.x * z.x - z.y * z.y;
      let zSqImag = 2.0 * z.x * z.y;
      z = vec2f(abs(zSqReal) + c.x, -abs(zSqImag) + c.y);
    }
    else if (baseType == 5) {
      // Phoenix: z_{n+1} = z_n² + p + q * z_{n-1}
      // Classic formula from Shigehiro Ushiki
      // We swap real/imag to rotate 90° and match conventional orientation
      // where the "beak" points right and "feathers" extend horizontally
      let p = c.y;  // Swapped: use imag as real constant
      let q = c.x;  // Swapped: use real as coupling constant
      let zSq = vec2f(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y);
      let newZ = vec2f(
        zSq.x + p + q * zPrev.x,
        zSq.y + q * zPrev.y
      );
      zPrev = z;
      z = newZ;
    }
    else if (baseType == 6) {
      // Multibrot3: z³ + c
      let zSq = vec2f(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y);
      z = vec2f(z.x * zSq.x - z.y * zSq.y + c.x, z.x * zSq.y + z.y * zSq.x + c.y);
    }
    else if (baseType == 7) {
      // Multibrot4: z⁴ + c
      let zSq = vec2f(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y);
      z = vec2f(zSq.x * zSq.x - zSq.y * zSq.y + c.x, 2.0 * zSq.x * zSq.y + c.y);
    }
    else if (baseType == 8) {
      // Funky Mandelbrot (happy accident!): Re(z) + |Im(z)|i then square
      z = vec2f(z.x, abs(z.y));
      z = vec2f(z.x * z.x - z.y * z.y + c.x, 2.0 * z.x * z.y + c.y);
    }
    else if (baseType == 9) {
      // Perpendicular Mandelbrot: (|Re(z)| - i·Im(z))² + c
      // w = |x| - iy, w² = |x|² - y² - 2|x|yi
      let ax = abs(z.x);
      z = vec2f(ax * ax - z.y * z.y + c.x, -2.0 * ax * z.y + c.y);
    }
    else if (baseType == 10) {
      // Triple Dragon (Paul Bourke): z_{n+1} = z³ / (z³ + 1) + c
      // Rational map — orbits converge to a fixed point (interior basins) or
      // wander on the fractal boundary. Coloured by convergence speed below.
      let z2 = vec2f(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y);          // z²
      let z3 = vec2f(z.x * z2.x - z.y * z2.y, z.x * z2.y + z.y * z2.x); // z³
      let denom = vec2f(z3.x + 1.0, z3.y);                             // z³ + 1
      let denomMagSq = dot(denom, denom);
      if (denomMagSq < 1e-12) {
        // Pole (z³ ≈ -1): division blows up. Treat as non-converging interior.
        iterations = maxIter;
        break;
      }
      // Complex division z³ / denom = z³ · conj(denom) / |denom|²
      let divRe = (z3.x * denom.x + z3.y * denom.y) / denomMagSq;
      let divIm = (z3.y * denom.x - z3.x * denom.y) / denomMagSq;
      z = vec2f(divRe + c.x, divIm + c.y);
    }
    else {
      // Fallback to standard Mandelbrot
      z = vec2f(z.x * z.x - z.y * z.y + c.x, 2.0 * z.x * z.y + c.y);
    }

    iterations++;

    // Triple Dragon convergence test: stop once the orbit settles onto a fixed
    // point. Convergence speed varies wildly near the Julia set (the dragon),
    // giving it its fine detail; smooth colouring resolves that. Points that
    // never settle (the Julia set itself) run to maxIter and are drawn black.
    if (baseType == 10) {
      let d = z - zTemp;
      let dmag = sqrt(dot(d, d));
      const CONV_EPS = 1e-5;
      if (dmag < CONV_EPS) {
        // Geometric convergence → log(step) ~linear in n. Interpolate the
        // fractional iteration where the step size crossed CONV_EPS.
        let denomL = log(dmag) - log(prevDelta);
        var frac = 0.0;
        if (denomL != 0.0) {
          frac = clamp((log(CONV_EPS) - log(prevDelta)) / denomL, 0.0, 1.0);
        }
        tripleSmooth = f32(iterations - 1) + frac;
        break;
      }
      prevDelta = dmag;
    }
  }

  if (iterations >= maxIter) {
    return vec4f(0.0, 0.0, 0.0, 1.0);
  }

  // Smooth iteration count - adjust log base for higher power fractals
  var logBase = 2.0;
  if (baseType == 6) { logBase = 3.0; }      // Multibrot3
  else if (baseType == 7) { logBase = 4.0; } // Multibrot4

  var normalized: f32;
  if (baseType == 10) {
    // Triple Dragon: colour by smooth convergence count, not escape magnitude.
    normalized = tripleSmooth / f32(maxIter);
  } else {
    let smoothIter = f32(iterations) + 1.0 - log2(log2(max(dot(z, z), 4.0))) / log2(logBase);
    normalized = smoothIter / f32(maxIter);
  }

  let isMonotonic = u.isMonotonic != 0;
  let isCycling = !isMonotonic;

  var t: f32;
  if (isMonotonic) {
    t = normalized + u.colorOffset;
  } else {
    let numCycles = 8.0;
    t = normalized * numCycles + u.colorOffset;
  }

  var color = getColor(t, isCycling);

  if (u.hdrEnabled != 0) {
    var brightnessMult: f32;

    if (isMonotonic) {
      brightnessMult = hdrBrightnessCurveMonotonic(normalized, u.hdrBrightnessBias);
    } else {
      brightnessMult = hdrBrightnessCurveCycling(normalized, u.hdrBrightnessBias);
    }

    color = color * brightnessMult;
    return vec4f(color, 1.0);
  } else {
    let edgeFactor = 1.0 - f32(iterations) / f32(maxIter);
    let glow = pow(edgeFactor, 0.5) * 0.3;
    color = color * (1.0 + glow);
    return vec4f(min(color, vec3f(1.0)), 1.0);
  }
}
`,Y=1.5,X=256,Z=class e{constructor(e,t){r(this,`renderer`,void 0),r(this,`state`,void 0),r(this,`inputHandler`,void 0),r(this,`pipeline`,void 0),r(this,`uniformBuffer`,void 0),r(this,`bindGroup`,void 0),r(this,`postProcessing`,void 0),r(this,`postProcessPresetIndex`,0),r(this,`overlays`,void 0),r(this,`touristMode`,null),r(this,`autoTouristTimeout`,null),r(this,`userHasInteracted`,!1),r(this,`autoTourActive`,!1),r(this,`handleResize`,()=>{this.renderer.resize(window.innerWidth,window.innerHeight);let e=this.renderer.canvas;this.postProcessing.resize(e.width,e.height),this.render()}),r(this,`handleHashChange`,()=>{this.loadBookmark()}),this.renderer=e,this.state=new Le,this.postProcessing=new We(e.device,e.format),this.inputHandler=new s(t,this.state.view,()=>this.render(),this.createInputCallbacks()),this.setupOverlays(t)}static async create(t){let n=await i.create(t),r=new e(n,t);return await r.initializePipeline(),n.setOnHdrChange(()=>{console.log(`HDR status changed, re-rendering...`),r.render()}),window.addEventListener(`resize`,r.handleResize),window.addEventListener(`hashchange`,r.handleHashChange),r.loadBookmark(),r.handleResize(),r.startAutoTouristTimer(),r}async initializePipeline(){let e=this.renderer.device,t=e.createShaderModule({label:`Mandelbrot Shader`,code:Ge});this.uniformBuffer=e.createBuffer({label:`Uniforms`,size:X,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});let n=e.createBindGroupLayout({label:`Bind Group Layout`,entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:`uniform`}}]});this.bindGroup=e.createBindGroup({label:`Bind Group`,layout:n,entries:[{binding:0,resource:{buffer:this.uniformBuffer}}]});let r=e.createPipelineLayout({label:`Pipeline Layout`,bindGroupLayouts:[n]});this.pipeline=e.createRenderPipeline({label:`Mandelbrot Pipeline`,layout:r,vertex:{module:t,entryPoint:`vertexMain`},fragment:{module:t,entryPoint:`fragmentMain`,targets:[{format:this.renderer.format}]},primitive:{topology:`triangle-list`}}),console.log(`WebGPU pipeline initialized`)}createInputCallbacks(){return{onIterationAdjust:e=>this.adjustMaxIterations(e),onIterationReset:()=>this.clearMaxIterationsOverride(),onCosinePaletteCycle:e=>this.cycleCosinePalette(e),onGradientPaletteCycle:e=>this.cycleGradientPalette(e),onColorOffsetAdjust:e=>this.adjustColorOffset(e),onColorOffsetReset:()=>this.resetColorOffset(),onBrightnessAdjust:e=>this.adjustHdrBrightness(e),onBrightnessReset:()=>this.resetHdrBrightness(),onFractalCycle:e=>this.cycleFractalType(e),onFractalCycleAnimate:e=>this.animateFractalCycle(e),onToggleJuliaMode:()=>this.toggleJuliaPickerMode(),onJuliaPick:(e,t)=>this.pickJuliaConstant(e,t),onJuliaPickEnd:()=>this.endJuliaPicking(),onShare:()=>this.shareBookmark(),onLocationSelect:e=>this.goToLocation(e),onLocationAnimate:e=>this.animateToLocation(e),onToggleHelp:()=>this.toggleHelp(),onToggleScreenshotMode:()=>this.toggleScreenshotMode(),onToggleTouristMode:()=>this.toggleTouristMode(),onPostProcessPresetCycle:e=>this.cyclePostProcessPreset(e),onUserInput:()=>this.registerUserAction()}}setupOverlays(e){let t=e.parentElement;if(!t)throw Error(`Canvas must have a parent element for overlays`);this.overlays=new Ae(t)}render(){let e=this.renderer.device,t=this.renderer.canvas,n=performance.now();this.overlays.tickFPS(n);let r=u(this.state.fractalType),i=this.state.maxIterationsOverride??U(this.state.view.zoom,r),a=this.state.paletteType===`cosine`?he(this.state.cosinePaletteIndex):ge(this.state.gradientPaletteIndex),o={fractalName:l[this.state.fractalType],zoom:this.state.view.zoom,maxIterations:i,isManualIterations:this.state.maxIterationsOverride!==null,paletteName:a,colorOffset:this.state.colorOffset,isJulia:r,juliaC:this.state.juliaC,hdrEnabled:this.renderer.hdrEnabled,hdrBrightnessBias:this.state.hdrBrightnessBias,displaySupportsHDR:this.renderer.displaySupportsHDR,sdrGradientBrightness:this.state.sdrGradientBrightness,paletteType:this.state.paletteType,juliaPickerMode:this.state.juliaPickerMode,postProcessPreset:this.postProcessing.isEnabled()?G[K[this.postProcessPresetIndex]]:null};this.overlays.updateDebug(o);let s=new ArrayBuffer(X),c=new Float32Array(s),d=new Int32Array(s),f=this.state.paletteType===`cosine`,p=f?pe(this.state.cosinePaletteIndex):me(this.state.gradientPaletteIndex),m=this.state.interpolatedPaletteParams??(f?O(this.state.cosinePaletteIndex):k(this.state.gradientPaletteIndex,this.renderer.hdrEnabled));c[0]=t.width,c[1]=t.height,c[2]=this.state.view.centerX,c[3]=this.state.view.centerY,c[4]=this.state.view.zoom,d[5]=i,c[6]=performance.now()*.001,c[7]=this.state.colorOffset,d[8]=this.state.fractalType,c[10]=this.state.juliaC[0],c[11]=this.state.juliaC[1],d[12]=+!!this.renderer.hdrEnabled,c[13]=this.state.hdrBrightnessBias,d[14]=m.type===`cosine`?0:1,d[15]=+!!p.isMonotonic,c[16]=this.state.sdrGradientBrightness;let h=this.state.interpolatedBlendParams;c[17]=h?.juliaBlend??0,c[18]=h?.preAbsRe??0,c[19]=h?.preAbsIm??0,m.type===`cosine`&&(c[20]=m.a[0],c[21]=m.a[1],c[22]=m.a[2],c[24]=m.b[0],c[25]=m.b[1],c[26]=m.b[2],c[28]=m.c[0],c[29]=m.c[1],c[30]=m.c[2],c[32]=m.d[0],c[33]=m.d[1],c[34]=m.d[2]),m.type===`gradient`&&(c[36]=m.c1[0],c[37]=m.c1[1],c[38]=m.c1[2],c[40]=m.c2[0],c[41]=m.c2[1],c[42]=m.c2[2],c[44]=m.c3[0],c[45]=m.c3[1],c[46]=m.c3[2],c[48]=m.c4[0],c[49]=m.c4[1],c[50]=m.c4[2],c[52]=m.c5[0],c[53]=m.c5[1],c[54]=m.c5[2]),c[56]=h?.preNegIm??0,c[57]=h?.postAbsRe??0,c[58]=h?.postAbsIm??0,c[59]=h?.postNegIm??0,d[60]=h===null?0:1,e.queue.writeBuffer(this.uniformBuffer,0,s);let g=e.createCommandEncoder(),_=this.postProcessing.isEnabled(),v=_?this.postProcessing.getIntermediateTextureView():this.renderer.getCurrentTexture().createView(),y=g.beginRenderPass({colorAttachments:[{view:v,clearValue:{r:0,g:0,b:0,a:1},loadOp:`clear`,storeOp:`store`}]});if(y.setPipeline(this.pipeline),y.setBindGroup(0,this.bindGroup),y.draw(3),y.end(),_){let e=this.renderer.getCurrentTexture().createView();this.postProcessing.encodePostProcessPasses(g,e)}e.queue.submit([g.finish()])}start(){this.renderer.start(()=>this.render())}stop(){this.renderer.stop()}adjustMaxIterations(e){let t=u(this.state.fractalType),n=this.state.maxIterationsOverride??U(this.state.view.zoom,t),r=e>0?n*Y:n/Y;this.state.maxIterationsOverride=Math.round(Math.max(1,r)),this.render()}clearMaxIterationsOverride(){this.state.maxIterationsOverride=null,this.render()}adjustHdrBrightness(e){this.renderer.hdrEnabled?this.state.hdrBrightnessBias=Math.max(-1,Math.min(1,this.state.hdrBrightnessBias+e*.1)):this.state.paletteType===`gradient`&&(this.state.sdrGradientBrightness=Math.max(.1,Math.min(10,this.state.sdrGradientBrightness+e*.2))),this.render()}resetHdrBrightness(){this.state.hdrBrightnessBias=0,this.state.sdrGradientBrightness=1,this.render()}cycleCosinePalette(e){this.state.cosinePaletteIndex=(this.state.cosinePaletteIndex+e+T)%T,this.state.paletteType=`cosine`,this.render()}cycleGradientPalette(e){this.state.gradientPaletteIndex=(this.state.gradientPaletteIndex+e+D)%D,this.state.paletteType=`gradient`,this.render()}adjustColorOffset(e){this.state.colorOffset+=e,this.render()}resetColorOffset(){this.state.colorOffset=0,this.render()}cycleFractalType(e=1){this.registerUserAction(),this.cancelOngoingAnimation();let t=((d(this.state.fractalType)>>1)+e+11)%11<<1;this.state.juliaPickerMode&&(this.state.juliaPickerMode=!1,this.inputHandler.setJuliaPickerMode(!1));let n=S(`1`,t);n?(this.applyLocationState(n.state),this.state.clearInterpolationState(),this.showLocationNotification(n.name,n.description)):(this.state.fractalType=t,this.state.clearInterpolationState()),this.render()}animateFractalCycle(e=1){this.registerUserAction();let t=((d(this.state.fractalType)>>1)+e+11)%11<<1;this.state.juliaPickerMode&&(this.state.juliaPickerMode=!1,this.inputHandler.setJuliaPickerMode(!1));let n=S(`1`,t);if(!n){this.cycleFractalType(e);return}this.touristMode||(this.touristMode=new H({onUpdate:(e,t,n)=>this.applyTouristUpdate(e,t,n),onClearInterpolation:()=>this.state.clearInterpolationState(),onRender:()=>this.render(),onLocationNotification:(e,t)=>this.showLocationNotification(e,t)},this.getBookmarkState())),this.touristMode.animateToLocation(n,this.getBookmarkState())}toggleJuliaPickerMode(){if(u(this.state.fractalType)){this.exitJuliaMode();return}this.state.juliaPickerMode=!this.state.juliaPickerMode,this.inputHandler.setJuliaPickerMode(this.state.juliaPickerMode),this.render()}pickJuliaConstant(e,t){this.state.juliaPickerMode&&(this.state.isActivelyPickingJulia||(this.state.savedViewState={centerX:this.state.view.centerX,centerY:this.state.view.centerY,zoom:this.state.view.zoom},this.state.savedFractalType=this.state.fractalType,this.state.fractalType=f(this.state.fractalType),this.state.view.centerX=0,this.state.view.centerY=0,this.state.view.zoom=.5,this.state.isActivelyPickingJulia=!0),this.state.juliaC=[e,t],this.render())}endJuliaPicking(){this.state.isActivelyPickingJulia&&(this.state.isActivelyPickingJulia=!1,this.state.juliaPickerMode=!1,this.inputHandler.setJuliaPickerMode(!1),this.render())}exitJuliaMode(){this.state.savedViewState&&(this.state.view.centerX=this.state.savedViewState.centerX,this.state.view.centerY=this.state.savedViewState.centerY,this.state.view.zoom=this.state.savedViewState.zoom,this.state.savedViewState=null),this.state.savedFractalType===null?this.state.fractalType=d(this.state.fractalType):(this.state.fractalType=this.state.savedFractalType,this.state.savedFractalType=null),this.state.juliaPickerMode=!1,this.inputHandler.setJuliaPickerMode(!1),this.render()}getBookmarkState(){return this.state.toBookmark()}loadBookmark(){let e=ee();if(e){if(e.paletteIndex!==void 0&&e.paletteType===void 0){let t=[0,4,5,10,11];t.includes(e.paletteIndex)?(e.paletteType=`cosine`,e.cosinePaletteIndex=t.indexOf(e.paletteIndex)):(e.paletteType=`gradient`,e.gradientPaletteIndex=[1,2,3,6,7,8,9].indexOf(e.paletteIndex))}this.state.fromBookmark(e),this.render()}}goToLocation(e){let t=S(e,this.state.fractalType);t&&(this.registerUserAction(),this.cancelOngoingAnimation(),this.applyLocationState(t.state),this.state.clearInterpolationState(),this.showLocationNotification(t.name,t.description),this.updateUrlBookmark(),this.render())}animateToLocation(e){let t=S(e,this.state.fractalType);t&&(this.registerUserAction(),this.touristMode||(this.touristMode=new H({onUpdate:(e,t,n)=>this.applyTouristUpdate(e,t,n),onClearInterpolation:()=>this.state.clearInterpolationState(),onRender:()=>this.render(),onLocationNotification:(e,t)=>this.showLocationNotification(e,t)},this.getBookmarkState())),this.touristMode.animateToLocation(t,this.getBookmarkState()))}applyLocationState(e){this.state.applyBookmark(e)}showLocationNotification(e,t){this.overlays.isScreenshotMode()||this.overlays.notification.showLocation(e,t)}updateUrlBookmark(){y(this.getBookmarkState())}async shareBookmark(){let e=await te(this.getBookmarkState());this.showShareNotification(e),e&&this.updateUrlBookmark(),(window.location.hostname===`localhost`||window.location.hostname===`127.0.0.1`)&&this.logCreateLocationCode()}logCreateLocationCode(){let e=this.getFractalTypeEnumName(this.state.fractalType),t=u(this.state.fractalType),n=[];this.state.paletteType===`gradient`?(n.push(`paletteType: 'gradient'`),this.state.gradientPaletteIndex!==0&&n.push(`gradientPaletteIndex: ${this.state.gradientPaletteIndex}`)):this.state.cosinePaletteIndex!==1&&n.push(`cosinePaletteIndex: ${this.state.cosinePaletteIndex}`),Math.abs(this.state.colorOffset)>.001&&n.push(`colorOffset: ${this.state.colorOffset}`),t&&n.push(`juliaC: [${this.state.juliaC[0]}, ${this.state.juliaC[1]}]`),this.state.maxIterationsOverride!==null&&n.push(`maxIterationsOverride: ${this.state.maxIterationsOverride}`);let r=n.length>0?`,\n    { ${n.join(`, `)} }`:``,i=`createLocation(
    'TODO: Name',
    'TODO: Description',
    'TODO: Key (1-9)',
    FractalType.${e},
    ${this.state.view.centerX}, ${this.state.view.centerY}, ${this.state.view.zoom}${r}
  ),`;console.log(`%c📍 createLocation() code:`,`color: #4ade80; font-weight: bold; font-size: 14px;`),console.log(i)}getFractalTypeEnumName(e){let t=Object.entries(c);for(let[n,r]of t)if(r===e&&isNaN(Number(n)))return n;return`Unknown(${e})`}showShareNotification(e){this.overlays.notification.showShareResult(e)}toggleHelp(){this.overlays.toggleHelp()}toggleScreenshotMode(){this.overlays.toggleScreenshotMode()}cyclePostProcessPreset(e){this.postProcessPresetIndex=(this.postProcessPresetIndex+e+K.length)%K.length;let t=K[this.postProcessPresetIndex];this.postProcessing.setPreset(t);let n=G[t];this.overlays.notification.info(`✨ Post-Processing: ${n}`,1500),this.render()}toggleTouristMode(){this.touristMode?.isActive()?this.stopTouristMode():this.startTouristMode()}startTouristMode(){this.autoTourActive=!1,this.touristMode||(this.touristMode=new H({onUpdate:(e,t,n)=>this.applyTouristUpdate(e,t,n),onClearInterpolation:()=>this.state.clearInterpolationState(),onRender:()=>this.render(),onLocationNotification:(e,t)=>this.showLocationNotification(e,t)},this.getBookmarkState())),this.touristMode.start(this.getBookmarkState()),this.showTouristModeNotification(!0)}stopTouristMode(){this.autoTourActive=!1,this.touristMode?.isActive()&&(this.touristMode.stop(),this.state.clearInterpolationState(),this.overlays.disableAutoScreenshotMode(),this.showTouristModeNotification(!1),this.updateUrlBookmark())}cancelOngoingAnimation(){this.autoTourActive=!1,this.touristMode?.isActive()&&(this.touristMode.stop(),this.state.clearInterpolationState())}registerUserAction(){this.userHasInteracted=!0,this.cancelAutoTouristTimer(),this.autoTourActive&&this.stopAutoTour()}stopAutoTour(){this.autoTourActive=!1,this.touristMode?.isActive()&&(this.touristMode.stop(),this.state.clearInterpolationState()),this.overlays.disableAutoScreenshotMode()}startAutoTouristTimer(){this.userHasInteracted||(this.cancelAutoTouristTimer(),this.autoTouristTimeout=setTimeout(()=>{!this.userHasInteracted&&!this.touristMode?.isActive()&&this.startTouristModeAuto()},e.AUTO_TOURIST_DELAY))}cancelAutoTouristTimer(){this.autoTouristTimeout!==null&&(clearTimeout(this.autoTouristTimeout),this.autoTouristTimeout=null)}startTouristModeAuto(){this.autoTourActive=!0,this.overlays.setScreenshotMode(!0,!0),this.touristMode||(this.touristMode=new H({onUpdate:(e,t,n)=>this.applyTouristUpdate(e,t,n),onClearInterpolation:()=>this.state.clearInterpolationState(),onRender:()=>this.render(),onLocationNotification:(e,t)=>this.showLocationNotification(e,t)},this.getBookmarkState())),this.touristMode.start(this.getBookmarkState()),this.overlays.notification.showAutoTouristMode()}applyTouristUpdate(e,t,n){this.state.applyPartial(e),this.state.interpolatedPaletteParams=t??null,this.state.interpolatedBlendParams=n??null}showTouristModeNotification(e){this.overlays.notification.showTouristMode(e)}destroy(){this.cancelAutoTouristTimer(),this.touristMode?.stop(),this.stop(),window.removeEventListener(`resize`,this.handleResize),window.removeEventListener(`hashchange`,this.handleHashChange),this.overlays.destroy(),this.inputHandler.destroy(),this.postProcessing.destroy(),this.renderer.destroy()}};r(Z,`AUTO_TOURIST_DELAY`,2e4),console.log(`Fractal Explorer - Initializing...`);var Q=null;async function $(){let e=document.getElementById(`app`);if(!e){console.error(`Could not find #app element`);return}if(!i.isSupported()){e.innerHTML=`
      <div style="color: white; text-align: center; padding: 40px; font-family: system-ui, sans-serif;">
        <h1>WebGPU Not Supported</h1>
        <p>This application requires WebGPU, which is not available in your browser.</p>
        <p style="margin-top: 20px; color: #888;">
          Please use a modern browser with WebGPU support:<br>
          Chrome 113+, Edge 113+, or Firefox Nightly with WebGPU enabled.
        </p>
      </div>
    `;return}let t=document.createElement(`canvas`);t.id=`fractal-canvas`,e.appendChild(t);try{Q=await Z.create(t),Q.start(),console.log(`Fractal Explorer initialized successfully`),console.log(`Controls:`),console.log(`  - Drag to pan`),console.log(`  - Scroll to zoom`),console.log(`  - Double-click to zoom in`),console.log(`  - Touch drag to pan (mobile)`),console.log(`  - Pinch to zoom (mobile)`),console.log(`  - + / - to adjust max iterations`),console.log(`  - 0 to reset iterations to auto-scaling`),console.log(`  - c / C to cycle cosine palettes (forward/backward)`),console.log(`  - g / G to cycle gradient palettes (forward/backward)`),console.log(`  - , / . to shift colors (fine)`),console.log(`  - < / > to shift colors (coarse)`),console.log(`  - b / B to adjust brightness (HDR bias or SDR gradient)`),console.log(`  - d to reset brightness`),console.log(`  - s to share/copy bookmark URL`),console.log(`  - 1-9 to visit famous locations`),console.log(`  - h to toggle help overlay`),console.log(`  - Space to toggle screenshot mode`)}catch(t){console.error(`Failed to initialize Fractal Explorer:`,t),e.innerHTML=`
      <div style="color: white; text-align: center; padding: 20px; font-family: system-ui, sans-serif;">
        <h1>Initialization Error</h1>
        <p>Failed to initialize the application.</p>
        <pre style="text-align: left; margin-top: 20px; color: #ff6b6b;">${t instanceof Error?t.message:String(t)}</pre>
      </div>
    `}}document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,()=>$()):$(),window.addEventListener(`beforeunload`,()=>{Q&&Q.destroy()});
//# sourceMappingURL=index-DUvDUZqU.js.map