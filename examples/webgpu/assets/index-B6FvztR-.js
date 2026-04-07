var fe=Object.defineProperty;var pe=(n,e,t)=>e in n?fe(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t;var a=(n,e,t)=>pe(n,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const c of o.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&i(c)}).observe(document,{childList:!0,subtree:!0});function t(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(s){if(s.ep)return;s.ep=!0;const o=t(s);fetch(s.href,o)}})();class D{constructor(e){a(this,"device");a(this,"context");a(this,"canvas");a(this,"format");a(this,"animationFrameId",null);a(this,"renderCallback",null);a(this,"hdrEnabled",!1);a(this,"_displaySupportsHDR",!1);a(this,"hdrMediaQuery",null);a(this,"onHdrChangeCallback",null);this.canvas=e,this._displaySupportsHDR=this.detectHDRDisplay(),this.setupHdrMediaQueryListener()}get displaySupportsHDR(){return this._displaySupportsHDR}static async create(e){const t=new D(e);return await t.initialize(),t}static isSupported(){return"gpu"in navigator}async initialize(){if(!navigator.gpu)throw new Error("WebGPU is not supported in this browser");console.log("WebGPU HDR capability check:"),console.log("  - Display supports HDR:",this.displaySupportsHDR),console.log("  - dynamic-range: high:",window.matchMedia?.("(dynamic-range: high)").matches),console.log("  - color-gamut: p3:",window.matchMedia?.("(color-gamut: p3)").matches);const e=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!e)throw new Error("Failed to get WebGPU adapter");if("info"in e){const t=e.info;console.log("  - Adapter:",t?.vendor,t?.architecture)}if(this.device=await e.requestDevice(),this.context=this.canvas.getContext("webgpu"),!this.context)throw new Error("Failed to get WebGPU context");this.configureContext(),console.log("WebGPU initialized successfully"),this.hdrEnabled&&console.log("HDR mode enabled with rgba16float + extended tone mapping")}configureContext(){const e=navigator.gpu.getPreferredCanvasFormat();if(this.displaySupportsHDR)try{this.format="rgba16float",this.context.configure({device:this.device,format:this.format,alphaMode:"opaque",toneMapping:{mode:"extended"}}),this.hdrEnabled=!0,console.log("  - Configured with rgba16float + extended tone mapping (HDR)")}catch(t){console.log("  - HDR configuration failed, falling back to SDR:",t),this.format=e,this.context.configure({device:this.device,format:this.format,alphaMode:"opaque"}),this.hdrEnabled=!1}else this.format=e,this.context.configure({device:this.device,format:this.format,alphaMode:"opaque"}),this.hdrEnabled=!1,console.log("  - Configured with",this.format,"(SDR)")}resize(e,t){const i=window.devicePixelRatio||1;this.canvas.width=e*i,this.canvas.height=t*i,this.canvas.style.width=`${e}px`,this.canvas.style.height=`${t}px`}getCurrentTexture(){return this.context.getCurrentTexture()}start(e){if(this.animationFrameId!==null)return;this.renderCallback=e;const t=()=>{this.renderCallback&&this.renderCallback(),this.animationFrameId=requestAnimationFrame(t)};this.animationFrameId=requestAnimationFrame(t)}stop(){this.animationFrameId!==null&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null),this.renderCallback=null}detectHDRDisplay(){return!!window.matchMedia?.("(dynamic-range: high)").matches}setupHdrMediaQueryListener(){if(!window.matchMedia)return;this.hdrMediaQuery=window.matchMedia("(dynamic-range: high)");const e=()=>{const t=this.detectHDRDisplay();t!==this._displaySupportsHDR&&(console.log(`HDR display support changed: ${this._displaySupportsHDR} -> ${t}`),this._displaySupportsHDR=t,this.context&&this.device&&this.configureContext(),this.onHdrChangeCallback?.())};this.hdrMediaQuery.addEventListener?.("change",e)}setOnHdrChange(e){this.onHdrChangeCallback=e}destroy(){this.stop(),this.onHdrChangeCallback=null,this.device?.destroy()}}const me=.6;function F(n){return 1+(n-1)*me}const k=class k{constructor(e,t,i,s={}){a(this,"canvas");a(this,"viewState");a(this,"onChange");a(this,"callbacks");a(this,"isDragging",!1);a(this,"lastX",0);a(this,"lastY",0);a(this,"lastTouchDistance",0);a(this,"juliaPickerMode",!1);a(this,"isPickingJulia",!1);a(this,"juliaPickViewState",null);a(this,"keyboardZoomDirection",null);a(this,"keyboardZoomStartTime",0);a(this,"keyboardZoomAnimationId",null);a(this,"locationKeyHeld",null);a(this,"locationLongPressTimeout",null);a(this,"fractalKeyHeld",null);a(this,"fractalLongPressTimeout",null);this.canvas=e,this.viewState=t,this.onChange=i,this.callbacks=s,this.setupEventListeners()}setCallbacks(e){this.callbacks={...this.callbacks,...e}}setJuliaPickerMode(e){this.juliaPickerMode=e,this.canvas.style.cursor=e?"crosshair":"grab"}isJuliaPickerModeActive(){return this.juliaPickerMode}setupEventListeners(){this.canvas.addEventListener("mousedown",this.handleMouseDown.bind(this)),this.canvas.addEventListener("mousemove",this.handleMouseMove.bind(this)),this.canvas.addEventListener("mouseup",this.handleMouseUp.bind(this)),this.canvas.addEventListener("mouseleave",this.handleMouseUp.bind(this)),this.canvas.addEventListener("wheel",this.handleWheel.bind(this),{passive:!1}),this.canvas.addEventListener("dblclick",this.handleDoubleClick.bind(this)),this.canvas.addEventListener("touchstart",this.handleTouchStart.bind(this),{passive:!1}),this.canvas.addEventListener("touchmove",this.handleTouchMove.bind(this),{passive:!1}),this.canvas.addEventListener("touchend",this.handleTouchEnd.bind(this)),this.canvas.addEventListener("touchcancel",this.handleTouchEnd.bind(this)),window.addEventListener("keydown",this.handleKeyDown.bind(this)),window.addEventListener("keyup",this.handleKeyUp.bind(this))}getCanvasRect(){return this.canvas.getBoundingClientRect()}getScreenCoords(e,t){const i=this.getCanvasRect();return[e-i.left,t-i.top]}getCanvasSize(){const e=this.getCanvasRect();return[e.width,e.height]}toFractalCoordsWithView(e,t,i,s,o){const c=i/s,h=(e/i-.5)*c,d=t/s-.5,l=o.centerX+h/o.zoom,p=o.centerY-d/o.zoom;return[l,p]}notifyChange(){this.onChange(this.viewState)}handleMouseDown(e){if(e.button!==0)return;const[t,i]=this.getScreenCoords(e.clientX,e.clientY);if(this.juliaPickerMode&&this.callbacks.onJuliaPick){const[s,o]=this.getCanvasSize();this.juliaPickViewState={centerX:this.viewState.centerX,centerY:this.viewState.centerY,zoom:this.viewState.zoom};const[c,h]=this.toFractalCoordsWithView(t,i,s,o,this.juliaPickViewState);this.isPickingJulia=!0,this.lastX=t,this.lastY=i,this.callbacks.onJuliaPick(c,h);return}this.isDragging=!0,this.lastX=t,this.lastY=i,this.canvas.style.cursor="grabbing"}handleMouseMove(e){const[t,i]=this.getScreenCoords(e.clientX,e.clientY);if(this.isPickingJulia&&this.callbacks.onJuliaPick&&this.juliaPickViewState){const[d,l]=this.getCanvasSize(),[p,b]=this.toFractalCoordsWithView(t,i,d,l,this.juliaPickViewState);this.callbacks.onJuliaPick(p,b),this.lastX=t,this.lastY=i;return}if(!this.isDragging)return;const s=t-this.lastX,o=i-this.lastY,[c,h]=this.getCanvasSize();this.viewState.pan(s,o,c,h),this.notifyChange(),this.lastX=t,this.lastY=i}handleMouseUp(){if(this.isPickingJulia){this.isPickingJulia=!1,this.juliaPickViewState=null,this.callbacks.onJuliaPickEnd?.();return}this.isDragging&&(this.isDragging=!1,this.canvas.style.cursor="grab")}handleWheel(e){e.preventDefault(),this.callbacks.onUserInput?.();const[t,i]=this.getScreenCoords(e.clientX,e.clientY),s=e.deltaY>0?.9:1.1,o=F(s),[c,h]=this.getCanvasSize();this.viewState.zoomAt(t,i,o,c,h),this.notifyChange()}handleDoubleClick(e){const[t,i]=this.getScreenCoords(e.clientX,e.clientY),[s,o]=this.getCanvasSize();this.viewState.zoomToPoint(t,i,F(2),s,o),this.notifyChange()}getTouchDistance(e){if(e.length<2)return 0;const t=e[0].clientX-e[1].clientX,i=e[0].clientY-e[1].clientY;return Math.sqrt(t*t+i*i)}getTouchCenter(e){if(e.length===0)return[0,0];if(e.length===1)return this.getScreenCoords(e[0].clientX,e[0].clientY);const t=(e[0].clientX+e[1].clientX)/2,i=(e[0].clientY+e[1].clientY)/2;return this.getScreenCoords(t,i)}handleTouchStart(e){if(this.callbacks.onUserInput?.(),e.touches.length===1){this.isDragging=!0;const[t,i]=this.getScreenCoords(e.touches[0].clientX,e.touches[0].clientY);this.lastX=t,this.lastY=i}else e.touches.length===2&&(this.isDragging=!1,this.lastTouchDistance=this.getTouchDistance(e.touches))}handleTouchMove(e){if(e.preventDefault(),e.touches.length===1&&this.isDragging){const[t,i]=this.getScreenCoords(e.touches[0].clientX,e.touches[0].clientY),s=t-this.lastX,o=i-this.lastY,[c,h]=this.getCanvasSize();this.viewState.pan(s,o,c,h),this.notifyChange(),this.lastX=t,this.lastY=i}else if(e.touches.length===2){const t=this.getTouchDistance(e.touches),i=this.getTouchCenter(e.touches);if(this.lastTouchDistance>0){const s=t/this.lastTouchDistance,o=F(s),[c,h]=this.getCanvasSize();this.viewState.zoomAt(i[0],i[1],o,c,h),this.notifyChange()}this.lastTouchDistance=t}}handleTouchEnd(){this.isDragging=!1,this.lastTouchDistance=0}handleKeyDown(e){if(!(e.target instanceof HTMLInputElement||e.target instanceof HTMLTextAreaElement))switch(e.key){case"+":case"=":e.preventDefault(),this.callbacks.onIterationAdjust?.(1);break;case"-":case"_":e.preventDefault(),this.callbacks.onIterationAdjust?.(-1);break;case"0":e.preventDefault(),this.callbacks.onIterationReset?.();break;case"c":e.preventDefault(),this.callbacks.onCosinePaletteCycle?.(1);break;case"C":e.preventDefault(),this.callbacks.onCosinePaletteCycle?.(-1);break;case"g":e.preventDefault(),this.callbacks.onGradientPaletteCycle?.(1);break;case"G":e.preventDefault(),this.callbacks.onGradientPaletteCycle?.(-1);break;case"[":case",":e.preventDefault(),this.callbacks.onColorOffsetAdjust?.(-.05);break;case"]":case".":e.preventDefault(),this.callbacks.onColorOffsetAdjust?.(.05);break;case"{":case"<":e.preventDefault(),this.callbacks.onColorOffsetAdjust?.(-.15);break;case"}":case">":e.preventDefault(),this.callbacks.onColorOffsetAdjust?.(.15);break;case"r":case"R":e.preventDefault(),this.callbacks.onColorOffsetReset?.();break;case"b":e.preventDefault(),this.callbacks.onBrightnessAdjust?.(1);break;case"B":e.preventDefault(),this.callbacks.onBrightnessAdjust?.(-1);break;case"d":e.preventDefault(),this.callbacks.onBrightnessReset?.();break;case"f":e.preventDefault(),!e.repeat&&this.fractalKeyHeld!=="f"&&(this.fractalKeyHeld="f",this.fractalLongPressTimeout=setTimeout(()=>{this.fractalKeyHeld==="f"&&(this.callbacks.onFractalCycleAnimate?.(1),this.fractalKeyHeld=null)},k.LONG_PRESS_THRESHOLD));break;case"F":e.preventDefault(),!e.repeat&&this.fractalKeyHeld!=="F"&&(this.fractalKeyHeld="F",this.fractalLongPressTimeout=setTimeout(()=>{this.fractalKeyHeld==="F"&&(this.callbacks.onFractalCycleAnimate?.(-1),this.fractalKeyHeld=null)},k.LONG_PRESS_THRESHOLD));break;case"j":case"J":e.preventDefault(),this.callbacks.onToggleJuliaMode?.();break;case"s":case"S":e.preventDefault(),this.callbacks.onShare?.();break;case"1":case"2":case"3":case"4":case"5":case"6":case"7":case"8":case"9":e.preventDefault(),!e.repeat&&this.locationKeyHeld!==e.key&&(this.locationKeyHeld=e.key,this.locationLongPressTimeout=setTimeout(()=>{this.locationKeyHeld===e.key&&(this.callbacks.onLocationAnimate?.(e.key),this.locationKeyHeld=null)},k.LONG_PRESS_THRESHOLD));break;case"h":case"H":e.preventDefault(),this.callbacks.onToggleHelp?.();break;case" ":e.preventDefault(),this.callbacks.onToggleScreenshotMode?.();break;case"t":case"T":e.preventDefault(),this.callbacks.onToggleTouristMode?.();break;case"p":e.preventDefault(),this.callbacks.onPostProcessPresetCycle?.(1);break;case"P":e.preventDefault(),this.callbacks.onPostProcessPresetCycle?.(-1);break;case"z":e.preventDefault(),e.repeat||this.startKeyboardZoom(1);break;case"Z":e.preventDefault(),e.repeat||this.startKeyboardZoom(-1);break}}handleKeyUp(e){if((e.key==="z"||e.key==="Z")&&this.stopKeyboardZoom(),e.key>="1"&&e.key<="9"&&this.locationKeyHeld===e.key&&(this.locationLongPressTimeout!==null&&(clearTimeout(this.locationLongPressTimeout),this.locationLongPressTimeout=null),this.callbacks.onLocationSelect?.(e.key),this.locationKeyHeld=null),(e.key==="f"||e.key==="F")&&this.fractalKeyHeld===e.key){this.fractalLongPressTimeout!==null&&(clearTimeout(this.fractalLongPressTimeout),this.fractalLongPressTimeout=null);const t=e.key==="f"?1:-1;this.callbacks.onFractalCycle?.(t),this.fractalKeyHeld=null}}startKeyboardZoom(e){this.keyboardZoomAnimationId!==null&&this.stopKeyboardZoom(),this.keyboardZoomDirection=e,this.keyboardZoomStartTime=performance.now(),this.keyboardZoomAnimationId=requestAnimationFrame(this.keyboardZoomLoop.bind(this))}stopKeyboardZoom(){this.keyboardZoomAnimationId!==null&&(cancelAnimationFrame(this.keyboardZoomAnimationId),this.keyboardZoomAnimationId=null),this.keyboardZoomDirection=null}keyboardZoomLoop(e){if(this.keyboardZoomDirection===null)return;const t=e-this.keyboardZoomStartTime;this.keyboardZoomStartTime=e;const s=this.keyboardZoomDirection*.7*(t/1e3),o=Math.exp(s),[c,h]=this.getCanvasSize();this.viewState.zoomAt(c/2,h/2,o,c,h),this.notifyChange(),this.keyboardZoomAnimationId=requestAnimationFrame(this.keyboardZoomLoop.bind(this))}destroy(){}};a(k,"LONG_PRESS_THRESHOLD",400);let U=k;var r=(n=>(n[n.Mandelbrot=0]="Mandelbrot",n[n.MandelbrotJulia=1]="MandelbrotJulia",n[n.BurningShip=2]="BurningShip",n[n.BurningShipJulia=3]="BurningShipJulia",n[n.Tricorn=4]="Tricorn",n[n.TricornJulia=5]="TricornJulia",n[n.Celtic=6]="Celtic",n[n.CelticJulia=7]="CelticJulia",n[n.Buffalo=8]="Buffalo",n[n.BuffaloJulia=9]="BuffaloJulia",n[n.Phoenix=10]="Phoenix",n[n.PhoenixJulia=11]="PhoenixJulia",n[n.Multibrot3=12]="Multibrot3",n[n.Multibrot3Julia=13]="Multibrot3Julia",n[n.Multibrot4=14]="Multibrot4",n[n.Multibrot4Julia=15]="Multibrot4Julia",n[n.Funky=16]="Funky",n[n.FunkyJulia=17]="FunkyJulia",n[n.Perpendicular=18]="Perpendicular",n[n.PerpendicularJulia=19]="PerpendicularJulia",n))(r||{});const ge={0:"Mandelbrot",1:"Mandelbrot Julia",2:"Burning Ship",3:"Burning Ship Julia",4:"Tricorn",5:"Tricorn Julia",6:"Celtic",7:"Celtic Julia",8:"Buffalo",9:"Buffalo Julia",10:"Phoenix",11:"Phoenix Julia",12:"Multibrot (z³)",13:"Multibrot³ Julia",14:"Multibrot (z⁴)",15:"Multibrot⁴ Julia",16:"Funky",17:"Funky Julia",18:"Perpendicular",19:"Perpendicular Julia"},B=10;function M(n){return(n&1)===1}function z(n){return n&-2}function be(n){return n|1}const m={TYPE:"t",CENTER_X:"x",CENTER_Y:"y",ZOOM:"z",PALETTE:"p",PALETTE_TYPE:"pt",COSINE_PALETTE:"cp",GRADIENT_PALETTE:"gp",COLOR_OFFSET:"o",JULIA_REAL:"jr",JULIA_IMAG:"ji",ITERATIONS:"i",AA:"aa"};function C(n,e=15){return n===0?"0":Math.abs(n)<1e-10||Math.abs(n)>1e10?n.toExponential(e):parseFloat(n.toPrecision(e)).toString()}function T(n){if(n===null||n==="")return null;const e=parseFloat(n);return isNaN(e)?null:e}function oe(n){const e=new URLSearchParams;return e.set(m.TYPE,n.fractalType.toString()),e.set(m.CENTER_X,C(n.centerX)),e.set(m.CENTER_Y,C(n.centerY)),e.set(m.ZOOM,C(n.zoom)),e.set(m.PALETTE_TYPE,n.paletteType==="cosine"?"c":"g"),e.set(m.COSINE_PALETTE,n.cosinePaletteIndex.toString()),e.set(m.GRADIENT_PALETTE,n.gradientPaletteIndex.toString()),Math.abs(n.colorOffset)>.001&&e.set(m.COLOR_OFFSET,C(n.colorOffset,4)),M(n.fractalType)&&(e.set(m.JULIA_REAL,C(n.juliaC[0])),e.set(m.JULIA_IMAG,C(n.juliaC[1]))),n.maxIterationsOverride!==null&&e.set(m.ITERATIONS,n.maxIterationsOverride.toString()),n.aaEnabled&&e.set(m.AA,"1"),e.toString()}function ve(n){const e=new URLSearchParams(n.replace(/^#/,"")),t={},i=T(e.get(m.TYPE));i!==null&&i>=0&&i<=19&&(t.fractalType=i);const s=T(e.get(m.CENTER_X));s!==null&&(t.centerX=s);const o=T(e.get(m.CENTER_Y));o!==null&&(t.centerY=o);const c=T(e.get(m.ZOOM));c!==null&&c>0&&(t.zoom=c);const h=e.get(m.PALETTE_TYPE);(h==="c"||h==="g")&&(t.paletteType=h==="c"?"cosine":"gradient");const d=T(e.get(m.COSINE_PALETTE));d!==null&&d>=0&&(t.cosinePaletteIndex=Math.floor(d));const l=T(e.get(m.GRADIENT_PALETTE));l!==null&&l>=0&&(t.gradientPaletteIndex=Math.floor(l));const p=T(e.get(m.PALETTE));p!==null&&p>=0&&p<=11&&(t.paletteIndex=Math.floor(p));const b=T(e.get(m.COLOR_OFFSET));b!==null&&(t.colorOffset=b);const v=T(e.get(m.JULIA_REAL)),f=T(e.get(m.JULIA_IMAG));v!==null&&f!==null&&(t.juliaC=[v,f]);const g=T(e.get(m.ITERATIONS));return g!==null&&g>0&&(t.maxIterationsOverride=Math.floor(g)),e.get(m.AA)==="1"&&(t.aaEnabled=!0),t}function ye(n){const e=oe(n),t=new URL(window.location.href);return t.hash=e,t.toString()}function xe(n){const e=oe(n);window.history.replaceState(null,"","#"+e)}function Te(){return ve(window.location.hash)}async function Pe(n){const e=ye(n);try{return await navigator.clipboard.writeText(e),!0}catch{const t=document.createElement("textarea");t.value=e,t.style.position="fixed",t.style.left="-9999px",document.body.appendChild(t),t.select();try{return document.execCommand("copy"),!0}catch{return!1}finally{document.body.removeChild(t)}}}function u(n,e,t,i,s,o,c,h={}){return{name:n,description:e,key:t,state:{fractalType:i,centerX:s,centerY:o,zoom:c,paletteType:h.paletteType??"cosine",cosinePaletteIndex:h.cosinePaletteIndex??1,gradientPaletteIndex:h.gradientPaletteIndex??0,colorOffset:h.colorOffset??0,juliaC:h.juliaC??[-.7,.27015],maxIterationsOverride:h.maxIterationsOverride??null,aaEnabled:!1}}}const Ie=[u("Mandelbrot","The famous Mandelbrot set","1",r.Mandelbrot,-.5,0,.4),u("Seahorse Valley","The iconic seahorse-shaped spirals","2",r.Mandelbrot,-.7581249305506096,.11244273987387937,36.41989684959737,{cosinePaletteIndex:5,colorOffset:.05}),u("Elephant Valley","Elephant trunk-like spirals on the positive real side","3",r.Mandelbrot,.2746341335933571,.0066936145282295205,212.15493874953236,{cosinePaletteIndex:3,colorOffset:-.1}),u("Double Spiral Valley","Beautiful double spirals deep in the set","4",r.Mandelbrot,-.743733589978665,.130905227502858,350,{cosinePaletteIndex:5,colorOffset:.15}),u("Spiral Galaxy","Galactic spiral arms emerging from chaos","5",r.Mandelbrot,-.7615484049386866,-.08478444765887823,1506.4927460380957,{cosinePaletteIndex:4,colorOffset:.05}),u("Douady Rabbit","The famous rabbit-eared Julia set","6",r.MandelbrotJulia,0,0,.6,{cosinePaletteIndex:4,colorOffset:.2,juliaC:[-.123,.745]}),u("Dragon Julia","Fierce dragon-like Julia set","7",r.MandelbrotJulia,0,0,.45,{cosinePaletteIndex:3,colorOffset:-.5,juliaC:[-.8,.156]}),u("Spiral Julia","Delicate spiral arms from the main cardioid edge","8",r.MandelbrotJulia,0,0,.5,{cosinePaletteIndex:8,colorOffset:.65,juliaC:[-.75,.11]}),u("Dendrite Julia","Tree-like branching structure on the real axis","9",r.MandelbrotJulia,0,0,.41791083585808675,{cosinePaletteIndex:5,colorOffset:.1,juliaC:[.285,.01]})],Se=[u("Main Ship","The iconic burning ship silhouette","1",r.BurningShip,-.6819541375872399,.5906040268456356,.4,{cosinePaletteIndex:4,colorOffset:.3}),u("The Armada","Mini ships along the antenna","2",r.BurningShip,-1.80173025652805,.0153452534367207,9,{cosinePaletteIndex:4,colorOffset:.2}),u("Bow Detail","Intricate patterns at the ship's bow","3",r.BurningShip,-1.7500929615866607,.0368035491770765,10,{cosinePaletteIndex:10,colorOffset:.1}),u("Bacteria Worm","Worm-like structures with mosaic patterns","4",r.BurningShipJulia,0,0,.3,{cosinePaletteIndex:10,colorOffset:-.55,juliaC:[.5179709888623353,.8057669844188748]}),u("Wispy Coils","Wispy coils near the bulbous extrusion from the ship","5",r.BurningShipJulia,0,0,.4,{cosinePaletteIndex:4,colorOffset:.35,juliaC:[.2525994076160102,.0006358222328731386]}),u("Space Brain","Brain-like structures from the bottom of the ship","6",r.BurningShipJulia,0,0,.7,{cosinePaletteIndex:5,colorOffset:.3,juliaC:[-1.059944784917394,-.033218825489255054]}),u("Spiral Patterns","Spiral patterns near the bulbous extrusion","7",r.BurningShipJulia,0,0,.41,{cosinePaletteIndex:11,colorOffset:.55,juliaC:[.28292507376881926,-.007597008191683113]}),u("Detailed Patterns","Beautiful detailed patterns near the bottom of the ship","8",r.BurningShipJulia,0,0,.5,{cosinePaletteIndex:2,colorOffset:.6,juliaC:[-.3967192382583807,-.09102348993288789]})],Me=[u("Tricorn","The main tricorn shape with its distinctive three-cornered symmetry","1",r.Tricorn,-.1343398614022916,-.07051105375213641,.24,{cosinePaletteIndex:11,colorOffset:-.45}),u("Skewed Mandelbrot","Skewed Mandelbrot from one of the main bulbs","2",r.Tricorn,-1.0683098234816064,.13055543771605108,722.5553792774821,{cosinePaletteIndex:5,colorOffset:.1}),u("Lightning Bolts","Lightning bolt-like patterns near the main cardioid edge","3",r.TricornJulia,0,0,.5,{cosinePaletteIndex:5,colorOffset:.2,juliaC:[-.7092474160797806,-.113024316756254]}),u("Water Lily Leaf","Leaf-like structures from the center of the edge of the main cardioid","4",r.TricornJulia,0,0,.43,{colorOffset:-.7,juliaC:[-.1254330794660274,.2407433439223678]}),u("Lightning Brain","Brain-like structures","5",r.TricornJulia,0,0,3.15,{cosinePaletteIndex:5,juliaC:[.8748878776979363,-1.515483485507111]}),u("Spiral Mosaic","Mosaic patterns from the base of one of the main bulbs","6",r.TricornJulia,0,0,.5,{cosinePaletteIndex:11,colorOffset:.55,juliaC:[-.5647012802389192,-.06508603367125808]}),u("Electric Tendrils","Electric tendril patterns with bright highlights","7",r.TricornJulia,0,0,.5,{cosinePaletteIndex:4,colorOffset:.05,juliaC:[-.511125124692869,.0500484416152959]})],we=[u("Celtic Knot","The main Celtic fractal shape","1",r.Celtic,-.5,0,.25,{cosinePaletteIndex:10,colorOffset:.05}),u("Celtic Detail","Intricate knotwork patterns","2",r.Celtic,-.7803221774980102,.1635662989215261,120,{cosinePaletteIndex:10,colorOffset:.25,maxIterationsOverride:1e4}),u("Leafy Spirals","Symmetric shapes from the tip of the celtic shape","3",r.CelticJulia,0,0,.55,{cosinePaletteIndex:7,colorOffset:.1,juliaC:[.25345198072532704,.0001580704105713714]}),u("Tendrils","Tendrils emerging from fog","4",r.CelticJulia,-.1649932591722856,-.033582161161888655,.28,{cosinePaletteIndex:5,juliaC:[-.4530201342281876,-.8993288590604025]}),u("Electric Buzz","Electric patterns with uniform patterned regions","5",r.CelticJulia,.2,-.3,.55,{colorOffset:.2,juliaC:[-.6378073937333775,1.2082886796996293]}),u("Intricate Patterns","Knotwork patterns with intricate details","6",r.CelticJulia,0,0,.52,{cosinePaletteIndex:10,colorOffset:.3,juliaC:[-.7610237673309276,.12050023730653406]}),u("Petri Dish","Bacteria-like patterns that spread outwards","7",r.CelticJulia,0,0,.55,{cosinePaletteIndex:10,colorOffset:.45,juliaC:[-1.056655765809614,-.16855216053399263]})],Ce=[u("Buffalo Overview","The distinctive Buffalo fractal shape","1",r.Buffalo,-.7,.6,.4,{cosinePaletteIndex:2,colorOffset:.45}),u("Overgrown Cities","Tree or cathedral-like structures emerging from real axis","2",r.Buffalo,-1.75,.13,2.4,{colorOffset:0}),u("Industrial Snowflake","Snowflake-like patterns with industrial structures woven in","3",r.BuffaloJulia,.45,0,.85,{cosinePaletteIndex:4,colorOffset:-.1,juliaC:[-1.62727125821226,.00873720402364775]}),u("Plasma Bursts","Plasma-like bursts of color","4",r.BuffaloJulia,0,0,.5,{cosinePaletteIndex:8,colorOffset:-.75,juliaC:[.2745030250648227,.1797320656871218]}),u("Intricate Patterns","Intricate patterns near the bottom of the main shape","5",r.BuffaloJulia,0,0,.5,{cosinePaletteIndex:4,colorOffset:.25,juliaC:[-.5828307625231954,-.3049842077590671]}),u("Seed Pods","Spirals bursting with seeds","6",r.BuffaloJulia,0,0,.6,{cosinePaletteIndex:3,colorOffset:-.75,juliaC:[.3056228373702423,-.007698961937716242]})],Be=[u("Phoenix Overview","The Phoenix parameter space","1",r.Phoenix,-.15,-.7,.25,{cosinePaletteIndex:5,colorOffset:-.65}),u("Classic Phoenix Julia","The iconic feathery Phoenix fractal","2",r.PhoenixJulia,0,0,.5,{cosinePaletteIndex:2,colorOffset:.45,juliaC:[-.5,.5667],maxIterationsOverride:1152}),u("Phoenix Feathers","Detailed feather-like structures","3",r.PhoenixJulia,.38,.07,3.4,{cosinePaletteIndex:5,juliaC:[-.5,.5667]}),u("Golden Weaves","Bright golden patterns with intricate weaves","4",r.PhoenixJulia,0,.08,.4,{cosinePaletteIndex:2,colorOffset:.35,juliaC:[.656142759731905,.0353380147311402]}),u("Fiery Phoenix","Fiery wings spreading outwards","5",r.PhoenixJulia,0,-.03,.6,{cosinePaletteIndex:4,colorOffset:-.7,juliaC:[-.272349453272398,.4059142585519806]})],ke=[u("Multibrot³ Overview","The three-fold symmetric z³ Multibrot","1",r.Multibrot3,0,0,.35,{cosinePaletteIndex:5,colorOffset:.35}),u("The Bulb","A bulbous extrusion from the main shape","2",r.Multibrot3,.5852686308492299,.27,6,{colorOffset:.1}),u("Three-fold Spirals","Bright pearly spirals with three-fold symmetry","3",r.Multibrot3Julia,0,0,.4,{cosinePaletteIndex:10,colorOffset:.15,juliaC:[.5448826747676219,.26362559338015445]}),u("Multibrot³ Julia","A Julia set with three-fold symmetry","4",r.Multibrot3Julia,0,0,.434,{cosinePaletteIndex:5,colorOffset:.1,juliaC:[-.45963436785036077,.03389484474578987]}),u("Double Elephant Valley","Two elephants in each group","5",r.Multibrot3,.42814685603247177,.012748071569601296,77,{cosinePaletteIndex:3,colorOffset:0}),u("Wonky Spiral","Wonky spiral Julia structure from inside the main set","6",r.Multibrot3Julia,.3695408370900379,.3371264555793177,2.274691481464049,{cosinePaletteIndex:0,colorOffset:0,juliaC:[.5277614770068884,.15853942850341446],maxIterationsOverride:2124}),u("Spiral Galaxies","The wonky spiral Julia structure viewed as galaxies","7",r.Multibrot3Julia,0,0,.4,{paletteType:"gradient",juliaC:[.5277614770068884,.15853942850341446],maxIterationsOverride:1152})],ze=[u("Multibrot⁴ Overview","The four-fold symmetric z⁴ Multibrot","1",r.Multibrot4,0,0,.4,{cosinePaletteIndex:5,colorOffset:0}),u("Atomic Spirals","Structures resembling atomic orbitals with spiral patterns","2",r.Multibrot4Julia,0,-0,.35,{cosinePaletteIndex:5,colorOffset:.4,juliaC:[-.7878865573262246,.02073442187254452]}),u("Triple Elephant Valley","Now there's three elephants in each group!","3",r.Multibrot4,-.2726362830546699,.44295218397589975,42,{cosinePaletteIndex:3}),u("Starscape","Spiraling galaxies surrounding a black hole","4",r.Multibrot4Julia,0,0,.5,{paletteType:"gradient",juliaC:[.634977850702787,.194816172925824],maxIterationsOverride:1152}),u("Static Burst","Burst of electricity","5",r.Multibrot4Julia,0,0,.4,{colorOffset:-.75,juliaC:[-.6179887054490777,.487166930716755]})],Ee=[u("Funky Overview","The wonderfully weird Funky fractal","1",r.Funky,-.5,0,.35,{cosinePaletteIndex:4,colorOffset:.25}),u("Tulip Bulb","Extrusions resembling tulips near the top of the main shape","2",r.Funky,.303,.534,6.3,{cosinePaletteIndex:10}),u("Battleship","Spaceship-like structure with double turrets all around","3",r.FunkyJulia,0,0,.45,{cosinePaletteIndex:4,colorOffset:-.7,juliaC:[-1.02568231965141,.128286053018475]}),u("Frog Crab","Crablike structure with brain-like spiral patterns within it","4",r.FunkyJulia,0,0,.37,{colorOffset:.1,juliaC:[.30191025227457674,.5253550579235958]}),u("Spiral Details","Beautiful spiral details without too much clutter","5",r.FunkyJulia,-.2,0,.4,{cosinePaletteIndex:5,colorOffset:.6,juliaC:[-.06404194046216194,.662960137583706]}),u("Migrating Birds","Bird-like shapes flying in formation","6",r.FunkyJulia,.34,0,.35,{cosinePaletteIndex:5,colorOffset:.4,juliaC:[.5804003550040334,-.9094296635818582]}),u("Glittering Coral","Brightly gleaming coral-like structures","7",r.FunkyJulia,0,0,.5,{cosinePaletteIndex:11,colorOffset:-.4,juliaC:[-.45427582797825017,-.06920415224913506]})],Ae=[u("Perpendicular Overview","The Perpendicular Mandelbrot variant","1",r.Perpendicular,-.5,0,.32,{cosinePaletteIndex:2,colorOffset:0}),u("Seed Pod","A pod-like structure near the head of the main shape","2",r.Perpendicular,-.7734996631118647,.12393043736115505,250,{cosinePaletteIndex:5}),u("Bird of Prey","Waveform bird flying out to get you","3",r.PerpendicularJulia,0,0,.35,{cosinePaletteIndex:4,colorOffset:.15,juliaC:[-1.2870593206662457,.022288689289989876]}),u("Old Dragon","Bird-like shape with leathery frayed wings","4",r.PerpendicularJulia,0,0,.3913248754208607,{cosinePaletteIndex:5,colorOffset:.45,juliaC:[-1.0197782349577895,-.13982096184940793]}),u("Peacock Eyes","Glowing eyes of a brightly coloured peacock","5",r.PerpendicularJulia,0,-.8821542839734092,2.8,{cosinePaletteIndex:11,juliaC:[.25987719401314263,-.17615047146201984]}),u("Mask of the Ancients","A detailed mask with intricate patterns","6",r.PerpendicularJulia,0,0,.42,{cosinePaletteIndex:2,colorOffset:-.1,juliaC:[.3021983882651174,.4025604479726435]})],re=new Map([[r.Mandelbrot,Ie],[r.BurningShip,Se],[r.Tricorn,Me],[r.Celtic,we],[r.Buffalo,Ce],[r.Phoenix,Be],[r.Multibrot3,ke],[r.Multibrot4,ze],[r.Funky,Ee],[r.Perpendicular,Ae]]);function O(n,e){const t=z(e),i=re.get(t);if(i)return i.find(s=>s.key===n)}function Oe(n){const e=z(n);return re.get(e)??[]}const N=[{name:"Rainbow",isMonotonic:!1,params:{type:"cosine",a:[.5,.5,.5],b:[.5,.5,.5],c:[1,1,1],d:[0,.33,.67]}},{name:"Fire",isMonotonic:!1,params:{type:"cosine",a:[.5,.5,.5],b:[.5,.5,.5],c:[1,1,.5],d:[0,.1,.2]}},{name:"Ice",isMonotonic:!1,params:{type:"cosine",a:[.5,.5,.5],b:[.5,.5,.5],c:[1,.7,.4],d:[0,.15,.2]}},{name:"Sunset",isMonotonic:!1,params:{type:"cosine",a:[.5,.3,.2],b:[.5,.4,.3],c:[1,1,.5],d:[0,.1,.2]}},{name:"Electric",isMonotonic:!1,params:{type:"cosine",a:[.5,.5,.5],b:[.6,.6,.6],c:[1,1,1],d:[.3,.2,.2]}},{name:"Neon",isMonotonic:!1,params:{type:"cosine",a:[.5,.5,.5],b:[.5,.5,.5],c:[1,1,1],d:[0,.1,.2]}},{name:"Emerald",isMonotonic:!1,params:{type:"cosine",a:[.2,.5,.3],b:[.3,.5,.3],c:[1,1,1],d:[0,.25,.5]}},{name:"Candy",isMonotonic:!1,params:{type:"cosine",a:[.8,.5,.5],b:[.2,.4,.4],c:[1,1,2],d:[0,.25,.25]}},{name:"Plasma",isMonotonic:!1,params:{type:"cosine",a:[.5,.5,.5],b:[.5,.5,.5],c:[2,1,0],d:[.5,.2,.25]}},{name:"Peacock",isMonotonic:!1,params:{type:"cosine",a:[.3,.5,.5],b:[.4,.4,.3],c:[1,1,1],d:[0,.1,.35]}},{name:"Autumn",isMonotonic:!1,params:{type:"cosine",a:[.6,.4,.2],b:[.4,.3,.2],c:[1,1,1],d:[0,.05,.1]}},{name:"Aurora",isMonotonic:!1,params:{type:"cosine",a:[.3,.5,.5],b:[.5,.5,.5],c:[1,1,.5],d:[.8,.9,.3]}}],P=N.length,G=[{name:"Blue",isMonotonic:!0,params:{type:"gradient",c1:[.02,.01,.08],c2:[.05,.15,.25],c3:[.1,.4,.5],c4:[.3,.6,.8],c5:[.7,.9,1]},hdrParams:{type:"gradient",c1:[.2,.4,1],c2:[.3,.6,1],c3:[.4,.8,1],c4:[.6,.9,1],c5:[.85,1,1]}},{name:"Gold",isMonotonic:!0,params:{type:"gradient",c1:[.04,.02,.01],c2:[.2,.08,.02],c3:[.5,.25,.05],c4:[.85,.6,.2],c5:[1,.95,.7]},hdrParams:{type:"gradient",c1:[1,.5,.1],c2:[1,.65,.2],c3:[1,.8,.3],c4:[1,.9,.5],c5:[1,1,.8]}},{name:"Grayscale",isMonotonic:!0,params:{type:"gradient",c1:[.01,.01,.03],c2:[.15,.15,.17],c3:[.45,.45,.45],c4:[.75,.74,.72],c5:[1,.98,.95]},hdrParams:{type:"gradient",c1:[1,1,1],c2:[1,1,1],c3:[1,1,1],c4:[1,1,1],c5:[1,1,1]}},{name:"Sepia",isMonotonic:!0,params:{type:"gradient",c1:[.03,.02,.01],c2:[.15,.08,.03],c3:[.4,.25,.12],c4:[.7,.55,.35],c5:[1,.95,.85]},hdrParams:{type:"gradient",c1:[1,.7,.4],c2:[1,.8,.55],c3:[1,.88,.7],c4:[1,.95,.85],c5:[1,1,.95]}},{name:"Ocean",isMonotonic:!0,params:{type:"gradient",c1:[0,.02,.05],c2:[.02,.08,.2],c3:[.05,.3,.4],c4:[.2,.6,.6],c5:[.6,.95,.9]},hdrParams:{type:"gradient",c1:[.1,.8,.8],c2:[.2,.9,.85],c3:[.4,.95,.9],c4:[.65,1,.95],c5:[.85,1,1]}},{name:"Purple",isMonotonic:!0,params:{type:"gradient",c1:[.03,.01,.06],c2:[.15,.05,.25],c3:[.4,.15,.5],c4:[.7,.4,.75],c5:[.95,.8,1]},hdrParams:{type:"gradient",c1:[.8,.2,1],c2:[.85,.4,1],c3:[.9,.6,1],c4:[.95,.8,1],c5:[1,.95,1]}},{name:"Forest",isMonotonic:!0,params:{type:"gradient",c1:[.02,.03,.01],c2:[.05,.12,.04],c3:[.1,.35,.15],c4:[.3,.65,.3],c5:[.7,.95,.6]},hdrParams:{type:"gradient",c1:[.3,1,.2],c2:[.5,1,.4],c3:[.7,1,.55],c4:[.85,1,.75],c5:[.95,1,.9]}}],I=G.length;function le(n){return N[n%P].params}function ce(n,e){const t=G[n%I];return e&&t.hdrParams?t.hdrParams:t.params}function Re(n){return N[n%P]}function _e(n){return G[n%I]}function Le(n){return N[n%P].name}function De(n){return G[n%I].name}function Y(n){const e=M(n),t=n>>1;let i;switch(t){case 0:i={juliaBlend:0,preAbsRe:0,preAbsIm:0,preNegIm:0,postAbsRe:0,postAbsIm:0,postNegIm:0};break;case 1:i={juliaBlend:0,preAbsRe:1,preAbsIm:1,preNegIm:1,postAbsRe:0,postAbsIm:0,postNegIm:0};break;case 2:i={juliaBlend:0,preAbsRe:0,preAbsIm:0,preNegIm:0,postAbsRe:0,postAbsIm:0,postNegIm:1};break;case 3:i={juliaBlend:0,preAbsRe:0,preAbsIm:0,preNegIm:0,postAbsRe:1,postAbsIm:0,postNegIm:0};break;case 4:i={juliaBlend:0,preAbsRe:0,preAbsIm:0,preNegIm:0,postAbsRe:1,postAbsIm:1,postNegIm:1};break;case 5:return null;case 6:return null;case 7:return null;case 8:i={juliaBlend:0,preAbsRe:0,preAbsIm:1,preNegIm:0,postAbsRe:0,postAbsIm:0,postNegIm:0};break;case 9:i={juliaBlend:0,preAbsRe:1,preAbsIm:0,preNegIm:0,postAbsRe:0,postAbsIm:0,postNegIm:1};break;default:return null}return i.juliaBlend=e?1:0,i}function S(n,e,t){return n+(e-n)*t}function Ne(n,e,t){return{juliaBlend:S(n.juliaBlend,e.juliaBlend,t),preAbsRe:S(n.preAbsRe,e.preAbsRe,t),preAbsIm:S(n.preAbsIm,e.preAbsIm,t),preNegIm:S(n.preNegIm,e.preNegIm,t),postAbsRe:S(n.postAbsRe,e.postAbsRe,t),postAbsIm:S(n.postAbsIm,e.postAbsIm,t),postNegIm:S(n.postNegIm,e.postNegIm,t)}}const Ge=3e3,X=3e3,Fe=8e3,Ue=2e3,q=.5,je=.25,$=2,K=.6,Z=.5;function He(n,e,t){if(n<$&&e<$)return j(n,e,t);const i=Math.min(n,e),s=Math.max(Z,i*(1-K)+Z*K);if(s>=i)return j(n,e,t);const o=Math.log(n),c=Math.log(e),h=Math.log(s),d=1-t,l=d*d*o+2*d*t*h+t*t*c;return Math.exp(l)}function W(n){return n<.5?4*n*n*n:1-Math.pow(-2*n+2,3)/2}function x(n,e,t){return n+(e-n)*t}function y(n,e,t){return[x(n[0],e[0],t),x(n[1],e[1],t),x(n[2],e[2],t)]}function Je(n){return n.paletteType==="cosine"?le(n.cosinePaletteIndex):ce(n.gradientPaletteIndex,!1)}function Ve(n,e,t){if(n.type==="cosine"&&e.type==="cosine")return{type:"cosine",a:y(n.a,e.a,t),b:y(n.b,e.b,t),c:y(n.c,e.c,t),d:y(n.d,e.d,t)};if(n.type==="gradient"&&e.type==="gradient")return{type:"gradient",c1:y(n.c1,e.c1,t),c2:y(n.c2,e.c2,t),c3:y(n.c3,e.c3,t),c4:y(n.c4,e.c4,t),c5:y(n.c5,e.c5,t)};if(t<.5)if(n.type==="cosine"){const i=t*2;return{type:"cosine",a:y(n.a,[.5,.5,.5],i*.3),b:y(n.b,[.3,.3,.3],i*.3),c:n.c,d:n.d}}else return n;else if(e.type==="cosine"){const i=(t-.5)*2;return{type:"cosine",a:y([.5,.5,.5],e.a,i),b:y([.3,.3,.3],e.b,i),c:e.c,d:e.d}}else return e}function j(n,e,t){const i=Math.log(n),s=Math.log(e);return Math.exp(x(i,s,t))}function Q(n,e,t,i,s){const o=Math.sqrt(n*n+e*e),c=Math.sqrt(t*t+i*i);let h=Math.atan2(e,n),d=Math.atan2(i,t);const l=.01;if(o<l&&c<l)return[x(n,t,s),x(e,i,s)];if(o<l)return[x(0,t,s),x(0,i,s)];if(c<l)return[x(n,0,s),x(e,0,s)];let p=d-h;p>Math.PI?p-=2*Math.PI:p<-Math.PI&&(p+=2*Math.PI);const b=h+p*s,v=x(o,c,s);return[v*Math.cos(b),v*Math.sin(b)]}class R{constructor(e,t){a(this,"active",!1);a(this,"state",{type:"idle"});a(this,"animationFrameId",null);a(this,"callbacks");a(this,"currentTarget");a(this,"visitedLocations",new Set);a(this,"tick",e=>{this.active&&(this.updateAnimation(e),this.animationFrameId=requestAnimationFrame(this.tick))});this.callbacks=e,this.currentTarget=this.bookmarkToTarget(t)}bookmarkToTarget(e){return{centerX:e.centerX,centerY:e.centerY,zoom:e.zoom,fractalType:e.fractalType,paletteType:e.paletteType,cosinePaletteIndex:e.cosinePaletteIndex,gradientPaletteIndex:e.gradientPaletteIndex,paletteParams:Je(e),colorOffset:e.colorOffset,juliaC:e.juliaC,blendParams:Y(e.fractalType)}}start(e){this.active||(this.active=!0,this.currentTarget=this.bookmarkToTarget(e),this.visitedLocations.clear(),this.state={type:"paused",startTime:performance.now(),duration:1e3},this.animationFrameId=requestAnimationFrame(this.tick),console.log("🚀 Tourist mode started"))}stop(){this.active&&(this.active=!1,this.state={type:"idle"},this.animationFrameId!==null&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null),console.log("🛑 Tourist mode stopped"))}isActive(){return this.active}updateCurrentState(e){this.currentTarget=this.bookmarkToTarget(e)}animateToLocation(e,t){this.animationFrameId!==null&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null),this.active=!0,this.currentTarget=this.bookmarkToTarget(t),this.transitionTo(e,!0),this.animationFrameId=requestAnimationFrame(this.tick),console.log(`🎯 Animating to: ${e.name}`)}updateAnimation(e){switch(this.state.type){case"idle":this.pickNextDestination();break;case"paused":e-this.state.startTime>=this.state.duration&&this.pickNextDestination();break;case"transitioning":{const t=e-this.state.startTime,i=Math.min(1,t/this.state.duration),s=W(i),o=Q(this.state.from.juliaC[0],this.state.from.juliaC[1],this.state.to.juliaC[0],this.state.to.juliaC[1],s),c=this.state.from.zoom,h=this.state.to.zoom,d=He(c,h,i),[l,p]=Q(this.state.from.centerX,this.state.from.centerY,this.state.to.centerX,this.state.to.centerY,s),b=Ve(this.state.from.paletteParams,this.state.to.paletteParams,s);let v=null;const f=this.state.from.blendParams,g=this.state.to.blendParams;f&&g?v=Ne(f,g,s):i>=.5&&g?v=g:i<.5&&f&&(v=f);const w={centerX:l,centerY:p,zoom:d,fractalType:this.state.to.fractalType,paletteType:this.state.to.paletteType,cosinePaletteIndex:this.state.to.cosinePaletteIndex,gradientPaletteIndex:this.state.to.gradientPaletteIndex,colorOffset:x(this.state.from.colorOffset,this.state.to.colorOffset,s),juliaC:o};this.currentTarget={...this.state.to,centerX:l,centerY:p,zoom:d,paletteParams:b,colorOffset:w.colorOffset,juliaC:o,blendParams:v},this.callbacks.onUpdate(w,b,v),this.callbacks.onRender(),i>=1&&(this.callbacks.onClearInterpolation(),this.state.singleTransition?(this.active=!1,this.state={type:"idle"},this.animationFrameId!==null&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null),console.log("🎯 Single transition complete")):this.state={type:"paused",startTime:e,duration:Ge});break}case"zoomingOut":{const t=e-this.state.startTime,i=Math.min(1,t/this.state.duration),s=W(i),o=j(this.state.from.zoom,this.state.targetZoom,s),c={centerX:this.state.from.centerX,centerY:this.state.from.centerY,zoom:o};this.currentTarget={...this.currentTarget,zoom:o},this.callbacks.onUpdate(c),this.callbacks.onClearInterpolation(),this.callbacks.onRender(),i>=1&&(this.currentTarget.fractalType=this.state.nextFractalType,this.currentTarget.blendParams=Y(this.state.nextFractalType),this.callbacks.onUpdate({fractalType:this.state.nextFractalType}),this.callbacks.onClearInterpolation(),this.visitedLocations.clear(),this.pickDestinationForCurrentFractal());break}}}pickNextDestination(){Math.random()<je?this.initiateFractalSwitch():this.pickDestinationForCurrentFractal()}initiateFractalSwitch(){const t=z(this.currentTarget.fractalType)>>1;let i=Math.floor(Math.random()*B);i===t&&(i=(i+1)%B);const s=i<<1;if(this.currentTarget.zoom<=q*1.5){this.currentTarget.fractalType=s,this.callbacks.onUpdate({fractalType:s}),this.visitedLocations.clear(),this.pickDestinationForCurrentFractal();return}this.state={type:"zoomingOut",startTime:performance.now(),duration:Ue,from:{...this.currentTarget},targetZoom:q,nextFractalType:s}}pickDestinationForCurrentFractal(){const e=Oe(this.currentTarget.fractalType);if(e.length===0){this.currentTarget.fractalType=r.Mandelbrot,this.callbacks.onUpdate({fractalType:r.Mandelbrot}),this.pickDestinationForCurrentFractal();return}let t=e.filter(s=>!this.visitedLocations.has(this.getLocationKey(s)));t.length===0&&(this.visitedLocations.clear(),t=e);const i=t[Math.floor(Math.random()*t.length)];this.transitionTo(i)}getLocationKey(e){return`${e.state.fractalType}-${e.key}`}transitionTo(e,t=!1){const i=this.bookmarkToTarget(e.state),s=Math.abs(Math.log(i.zoom)-Math.log(this.currentTarget.zoom)),o=Math.sqrt(Math.pow(i.centerX-this.currentTarget.centerX,2)+Math.pow(i.centerY-this.currentTarget.centerY,2)),c=Math.min(Fe,Math.max(X,X+s*500+o*2e3)),h=this.getLocationKey(e);this.visitedLocations.add(h),this.callbacks.onLocationNotification?.(e.name,e.description),this.state={type:"transitioning",startTime:performance.now(),duration:c,from:{...this.currentTarget},to:i,singleTransition:t}}}class Ye{constructor(e){a(this,"element");a(this,"visible",!0);this.element=document.createElement("div"),this.element.id="zoom-debug",e.appendChild(this.element)}update(e){if(!this.visible)return;const t=e.zoom,i=t>=1e6?t.toExponential(2):t<1?t.toPrecision(4):String(Math.round(t)),s=e.isManualIterations?" (manual)":"",o=e.hdrEnabled?Math.abs(e.hdrBrightnessBias)>.01?`HDR (${e.hdrBrightnessBias>0?"+":""}${e.hdrBrightnessBias.toFixed(2)})`:"HDR":e.displaySupportsHDR?"HDR available":"SDR",c=!e.hdrEnabled&&e.paletteType==="gradient"&&Math.abs(e.sdrGradientBrightness-1)>.01?`brightness ${e.sdrGradientBrightness.toFixed(1)}`:"",h=e.juliaPickerMode?"🎯 Pick Julia point":"",d=e.isJulia?`c=(${e.juliaC[0].toFixed(4)}, ${e.juliaC[1].toFixed(4)})`:"",l=Math.abs(e.colorOffset)>.001?`offset ${e.colorOffset.toFixed(1)}`:"",p=[e.fractalName,`zoom ${i}`,`iterations ${e.maxIterations}${s}`,e.paletteName];l&&p.push(l),c&&p.push(c),d&&p.push(d),p.push(o),h&&p.push(h),e.postProcessPreset&&p.push(`FX: ${e.postProcessPreset}`),p.push("H = help"),this.element.textContent=p.join("  ·  ")}show(){this.visible=!0,this.element.style.display="block"}hide(){this.visible=!1,this.element.style.display="none"}destroy(){this.element.remove()}}class Xe{constructor(e){a(this,"element");a(this,"frameCount",0);a(this,"fps",0);a(this,"lastUpdate",0);a(this,"updateInterval",500);a(this,"visible",!0);this.element=document.createElement("div"),this.element.id="fps-overlay",this.element.textContent="-- FPS",e.appendChild(this.element)}tick(e){this.frameCount++,e-this.lastUpdate>=this.updateInterval&&(this.fps=Math.round(this.frameCount*1e3/(e-this.lastUpdate)),this.frameCount=0,this.lastUpdate=e,this.visible&&(this.element.textContent=`${this.fps} FPS`))}getFPS(){return this.fps}show(){this.visible=!0,this.element.style.display="block"}hide(){this.visible=!1,this.element.style.display="none"}destroy(){this.element.remove()}}class qe{constructor(e){a(this,"element");a(this,"visible",!1);this.element=document.createElement("div"),this.element.id="help-overlay",this.element.innerHTML=this.createContent(),e.appendChild(this.element)}toggle(){return this.visible=!this.visible,this.element.classList.toggle("visible",this.visible),this.visible}show(){this.visible=!0,this.element.classList.add("visible")}hide(){this.visible=!1,this.element.classList.remove("visible")}isVisible(){return this.visible}createContent(){return`
      <h2 class="help-title">
        🌀 Fractal Explorer - Keyboard Shortcuts
      </h2>
      <div class="help-grid">
        <div class="help-section">
          <h3 class="help-section-title">Navigation</h3>
          <div class="help-section-content">
            ${this.helpRow("Drag","Pan view")}
            ${this.helpRow("Scroll","Zoom in/out")}
            ${this.helpRow("z / Z","Fine zoom (hold)")}
            ${this.helpRow("Double-click","Zoom in at point")}
            ${this.helpRow("1-9","Famous locations")}
          </div>
        </div>
        <div class="help-section">
          <h3 class="help-section-title">Iterations</h3>
          <div class="help-section-content">
            ${this.helpRow("+/-","Adjust iterations")}
            ${this.helpRow("0","Reset to auto")}
          </div>
        </div>
        <div class="help-section">
          <h3 class="help-section-title">Colors</h3>
          <div class="help-section-content">
            ${this.helpRow("C / Shift+C","Cosine palettes")}
            ${this.helpRow("G / Shift+G","Gradient palettes")}
            ${this.helpRow(", / .","Shift colors (fine)")}
            ${this.helpRow("< / >","Shift colors (coarse)")}
            ${this.helpRow("R","Reset color offset")}
          </div>
        </div>
        <div class="help-section">
          <h3 class="help-section-title">Fractal Type</h3>
          <div class="help-section-content">
            ${this.helpRow("F / Shift+F","Cycle fractals")}
            ${this.helpRow("J","Julia picker mode")}
          </div>
        </div>
        <div class="help-section">
          <h3 class="help-section-title">Brightness</h3>
          <div class="help-section-content">
            ${this.helpRow("B / Shift+B","Adjust brightness*")}
            ${this.helpRow("D","Reset brightness")}
          </div>
          <div class="help-note">*HDR bias or SDR gradient brightness</div>
        </div>
        <div class="help-section">
          <h3 class="help-section-title">Effects</h3>
          <div class="help-section-content">
            ${this.helpRow("P / Shift+P","Cycle post-process presets")}
          </div>
          <div class="help-note">Clean · Cinematic · Vivid · Dreamy</div>
        </div>
        <div class="help-section">
          <h3 class="help-section-title">UI</h3>
          <div class="help-section-content">
            ${this.helpRow("T","Tourist mode (auto-tour)")}
            ${this.helpRow("H","Toggle this help")}
            ${this.helpRow("Space","Screenshot mode")}
          </div>
        </div>
        <div class="help-section">
          <h3 class="help-section-title">Share</h3>
          <div class="help-section-content">
            ${this.helpRow("S","Copy bookmark URL")}
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
    `}destroy(){this.element.remove()}}class $e{constructor(e){a(this,"element");a(this,"timeoutId",null);this.element=document.createElement("div"),this.element.id="share-notification",e.appendChild(this.element)}show(e,t={}){const{color:i="#4ade80",duration:s=2e3,html:o=!1}=t;this.timeoutId!==null&&clearTimeout(this.timeoutId),o?this.element.innerHTML=e:this.element.textContent=e,this.element.style.color=i,this.element.style.opacity="1",this.timeoutId=setTimeout(()=>{this.element.style.opacity="0",this.timeoutId=null},s)}success(e,t=2e3){this.show(e,{color:"#4ade80",duration:t})}error(e,t=2e3){this.show(e,{color:"#f87171",duration:t})}info(e,t=2e3){this.show(e,{color:"#60a5fa",duration:t})}showLocation(e,t,i=2500){const s=`<strong class="notification-title">📍 ${e}</strong><br><span class="notification-subtitle">${t}</span>`;this.show(s,{color:"#60a5fa",duration:i,html:!0})}showTouristMode(e){e?this.show('🚀 <strong>Tourist Mode</strong> — Sit back and enjoy the ride!<br><span class="notification-hint">Click or press T to take control</span>',{color:"#60a5fa",duration:3e3,html:!0}):this.show("🎮 <strong>Manual Control</strong> — You're driving now",{color:"#4ade80",duration:1500,html:!0})}showAutoTouristMode(){this.show('🚀 <strong>Tourist Mode</strong> — Exploring fractal landscapes<br><span class="notification-hint">Press <strong>T</strong> to stop · Press <strong>H</strong> for help</span>',{color:"#60a5fa",duration:5e3,html:!0})}showScreenshotMode(e){const t=e?"📷 Screenshot mode (Space to exit)":"📷 UI restored";this.info(t,1e3)}showShareResult(e){e?this.success("📋 Link copied to clipboard!"):this.error("❌ Failed to copy link")}destroy(){this.timeoutId!==null&&clearTimeout(this.timeoutId),this.element.remove()}}class Ke{constructor(e){a(this,"debug");a(this,"fps");a(this,"help");a(this,"notification");a(this,"screenshotMode",!1);a(this,"screenshotModeAutoEnabled",!1);this.debug=new Ye(e),this.fps=new Xe(e),this.help=new qe(e),this.notification=new $e(e)}toggleScreenshotMode(){return this.setScreenshotMode(!this.screenshotMode,!1),this.notification.showScreenshotMode(this.screenshotMode),this.screenshotMode}setScreenshotMode(e,t=!1){e!==this.screenshotMode&&(this.screenshotMode=e,this.screenshotModeAutoEnabled=t&&e,this.screenshotMode?(this.help.isVisible()&&this.help.hide(),this.debug.hide(),this.fps.hide()):(this.debug.show(),this.fps.show()))}disableAutoScreenshotMode(){this.screenshotModeAutoEnabled&&this.setScreenshotMode(!1,!1)}isScreenshotMode(){return this.screenshotMode}toggleHelp(){return this.help.toggle()}updateDebug(e){this.screenshotMode||this.debug.update(e)}tickFPS(e){this.screenshotMode||this.fps.tick(e)}destroy(){this.debug.destroy(),this.fps.destroy(),this.help.destroy(),this.notification.destroy()}}class Ze{constructor(e=-.5,t=0,i=.4){a(this,"centerX");a(this,"centerY");a(this,"zoom");this.centerX=e,this.centerY=t,this.zoom=i}pan(e,t,i,s){const o=i/s,c=-e*o/(this.zoom*i),h=t/(this.zoom*s);this.centerX+=c,this.centerY+=h}zoomAt(e,t,i,s,o){const c=s/o,h=this.centerX+(e/s-.5)*c/this.zoom,d=this.centerY-(t/o-.5)/this.zoom;this.zoom*=i,this.zoom=Math.max(.1,Math.min(this.zoom,1e15));const l=this.centerX+(e/s-.5)*c/this.zoom,p=this.centerY-(t/o-.5)/this.zoom;this.centerX+=h-l,this.centerY+=d-p}toFractalCoords(e,t,i,s){const o=i/s,c=(e/i-.5)*o,h=t/s-.5,d=this.centerX+c/this.zoom,l=this.centerY-h/this.zoom;return[d,l]}toScreenCoords(e,t,i,s){const o=i/s,c=(e-this.centerX)*this.zoom,h=(t-this.centerY)*this.zoom,d=(c/o+.5)*i,l=(-h+.5)*s;return[d,l]}zoomToPoint(e,t,i,s,o){const[c,h]=this.toFractalCoords(e,t,s,o);this.centerX=c,this.centerY=h,this.zoom*=i,this.zoom=Math.max(.1,Math.min(this.zoom,1e15))}reset(){this.centerX=-.5,this.centerY=0,this.zoom=.4}}const We=256,Qe=512,et=4096,tt=640,it=1.65;function H(n,e=!1){const t=Math.max(1,n),i=Math.log10(t),s=e?Qe:We,o=s+tt*Math.pow(i,it);return Math.round(Math.max(s,Math.min(et,o)))}class nt{constructor(){a(this,"view");a(this,"_fractalType",r.Mandelbrot);a(this,"_juliaC",[-.7,.27015]);a(this,"_juliaPickerMode",!1);a(this,"_isActivelyPickingJulia",!1);a(this,"_savedViewState",null);a(this,"_savedFractalType",null);a(this,"_paletteType","cosine");a(this,"_cosinePaletteIndex",1);a(this,"_gradientPaletteIndex",0);a(this,"_colorOffset",0);a(this,"_maxIterationsOverride",null);a(this,"_hdrBrightnessBias",0);a(this,"_sdrGradientBrightness",1);a(this,"_interpolatedPaletteParams",null);a(this,"_interpolatedBlendParams",null);a(this,"listeners",new Set);this.view=new Ze}get fractalType(){return this._fractalType}get juliaC(){return this._juliaC}get juliaPickerMode(){return this._juliaPickerMode}get isActivelyPickingJulia(){return this._isActivelyPickingJulia}get savedViewState(){return this._savedViewState}get savedFractalType(){return this._savedFractalType}get paletteType(){return this._paletteType}get cosinePaletteIndex(){return this._cosinePaletteIndex}get gradientPaletteIndex(){return this._gradientPaletteIndex}get colorOffset(){return this._colorOffset}get maxIterationsOverride(){return this._maxIterationsOverride}get hdrBrightnessBias(){return this._hdrBrightnessBias}get sdrGradientBrightness(){return this._sdrGradientBrightness}get interpolatedPaletteParams(){return this._interpolatedPaletteParams}get interpolatedBlendParams(){return this._interpolatedBlendParams}get isJulia(){return M(this._fractalType)}get maxIterations(){return this._maxIterationsOverride??H(this.view.zoom,this.isJulia)}set fractalType(e){this._fractalType!==e&&(this._fractalType=e,this.emit("fractalType"))}set juliaC(e){this._juliaC=e,this.emit("julia")}set juliaPickerMode(e){this._juliaPickerMode=e,this.emit("julia")}set isActivelyPickingJulia(e){this._isActivelyPickingJulia=e}set savedViewState(e){this._savedViewState=e}set savedFractalType(e){this._savedFractalType=e}set paletteType(e){this._paletteType!==e&&(this._paletteType=e,this.emit("palette"))}set cosinePaletteIndex(e){const t=(e%P+P)%P;this._cosinePaletteIndex!==t&&(this._cosinePaletteIndex=t,this.emit("palette"))}set gradientPaletteIndex(e){const t=(e%I+I)%I;this._gradientPaletteIndex!==t&&(this._gradientPaletteIndex=t,this.emit("palette"))}set colorOffset(e){this._colorOffset=e,this.emit("palette")}set maxIterationsOverride(e){this._maxIterationsOverride=e,this.emit("iterations")}set hdrBrightnessBias(e){this._hdrBrightnessBias=Math.max(-1,Math.min(1,e)),this.emit("brightness")}set sdrGradientBrightness(e){this._sdrGradientBrightness=Math.max(.1,Math.min(10,e)),this.emit("brightness")}set interpolatedPaletteParams(e){this._interpolatedPaletteParams=e}set interpolatedBlendParams(e){this._interpolatedBlendParams=e}clearInterpolationState(){this._interpolatedPaletteParams=null,this._interpolatedBlendParams=null}toBookmark(){return{fractalType:this._fractalType,centerX:this.view.centerX,centerY:this.view.centerY,zoom:this.view.zoom,paletteType:this._paletteType,cosinePaletteIndex:this._cosinePaletteIndex,gradientPaletteIndex:this._gradientPaletteIndex,colorOffset:this._colorOffset,juliaC:this._juliaC,maxIterationsOverride:this._maxIterationsOverride,aaEnabled:!1}}fromBookmark(e){e.centerX!==void 0&&(this.view.centerX=e.centerX),e.centerY!==void 0&&(this.view.centerY=e.centerY),e.zoom!==void 0&&(this.view.zoom=e.zoom),e.fractalType!==void 0&&(this._fractalType=e.fractalType),e.paletteType!==void 0&&(this._paletteType=e.paletteType),e.cosinePaletteIndex!==void 0&&(this._cosinePaletteIndex=e.cosinePaletteIndex%P),e.gradientPaletteIndex!==void 0&&(this._gradientPaletteIndex=e.gradientPaletteIndex%I),e.colorOffset!==void 0&&(this._colorOffset=e.colorOffset),e.juliaC!==void 0&&(this._juliaC=e.juliaC),e.maxIterationsOverride!==void 0&&(this._maxIterationsOverride=e.maxIterationsOverride),this.emit("all")}applyBookmark(e){this.view.centerX=e.centerX,this.view.centerY=e.centerY,this.view.zoom=e.zoom,this._fractalType=e.fractalType,this._paletteType=e.paletteType,this._cosinePaletteIndex=e.cosinePaletteIndex,this._gradientPaletteIndex=e.gradientPaletteIndex,this._colorOffset=e.colorOffset,this._juliaC=e.juliaC,this._maxIterationsOverride=e.maxIterationsOverride,this.emit("all")}applyPartial(e){e.centerX!==void 0&&(this.view.centerX=e.centerX),e.centerY!==void 0&&(this.view.centerY=e.centerY),e.zoom!==void 0&&(this.view.zoom=e.zoom),e.fractalType!==void 0&&(this._fractalType=e.fractalType),e.paletteType!==void 0&&(this._paletteType=e.paletteType),e.cosinePaletteIndex!==void 0&&(this._cosinePaletteIndex=e.cosinePaletteIndex),e.gradientPaletteIndex!==void 0&&(this._gradientPaletteIndex=e.gradientPaletteIndex),e.colorOffset!==void 0&&(this._colorOffset=e.colorOffset),e.juliaC!==void 0&&(this._juliaC=e.juliaC)}addListener(e){return this.listeners.add(e),()=>this.listeners.delete(e)}emit(e){for(const t of this.listeners)t(e)}notifyViewChange(){this.emit("view")}}const ue={enabled:!1,bloomEnabled:!1,bloomThreshold:.8,bloomIntensity:.3,vignetteEnabled:!1,vignetteIntensity:.4,vignetteSoftness:.5,sharpenEnabled:!1,sharpenStrength:.3,chromaticAberrationEnabled:!1,chromaticAberrationIntensity:.3,toneMappingEnabled:!1,exposure:1,saturation:1.15,temperature:0,ghostMirrorEnabled:!1,ghostMirrorOpacity:.3,ghostMirrorMode:2,kaleidoscopeEnabled:!1,kaleidoscopeSegments:6,waveEnabled:!1,waveAmplitude:.01,waveFrequency:8,feedbackEnabled:!1,feedbackDecay:.85,feedbackInterval:250},ee={clean:"Clean",cinematic:"Cinematic",vivid:"Vivid",dreamy:"Dreamy",psychedelic:"Psychedelic",acid:"Acid Trip",ethereal:"Ethereal"},_=["clean","cinematic","vivid","dreamy","psychedelic","acid","ethereal"],st={clean:{enabled:!1,bloomEnabled:!1,vignetteEnabled:!1,sharpenEnabled:!1,chromaticAberrationEnabled:!1,toneMappingEnabled:!1},cinematic:{enabled:!0,bloomEnabled:!0,bloomThreshold:.8,bloomIntensity:.3,vignetteEnabled:!0,vignetteIntensity:.4,vignetteSoftness:.5,sharpenEnabled:!1,chromaticAberrationEnabled:!1,toneMappingEnabled:!0,exposure:1,saturation:1.15,temperature:0},vivid:{enabled:!0,bloomEnabled:!0,bloomThreshold:.7,bloomIntensity:.25,vignetteEnabled:!1,sharpenEnabled:!0,sharpenStrength:.4,chromaticAberrationEnabled:!1,toneMappingEnabled:!0,exposure:1,saturation:1.3,temperature:0},dreamy:{enabled:!0,bloomEnabled:!0,bloomThreshold:.5,bloomIntensity:.5,vignetteEnabled:!0,vignetteIntensity:.3,vignetteSoftness:.6,sharpenEnabled:!1,chromaticAberrationEnabled:!0,chromaticAberrationIntensity:.3,toneMappingEnabled:!1},psychedelic:{enabled:!0,bloomEnabled:!0,bloomThreshold:.6,bloomIntensity:.4,vignetteEnabled:!0,vignetteIntensity:.3,vignetteSoftness:.5,ghostMirrorEnabled:!0,ghostMirrorOpacity:.25,ghostMirrorMode:2,kaleidoscopeEnabled:!0,kaleidoscopeSegments:6,toneMappingEnabled:!0,saturation:1.4},acid:{enabled:!0,bloomEnabled:!0,bloomThreshold:.5,bloomIntensity:.5,kaleidoscopeEnabled:!0,kaleidoscopeSegments:8,waveEnabled:!0,waveAmplitude:.015,waveFrequency:10,chromaticAberrationEnabled:!0,chromaticAberrationIntensity:.5,toneMappingEnabled:!0,saturation:1.5,temperature:.3},ethereal:{enabled:!0,bloomEnabled:!0,bloomThreshold:.5,bloomIntensity:.4,ghostMirrorEnabled:!0,ghostMirrorOpacity:.2,ghostMirrorMode:2,vignetteEnabled:!0,vignetteIntensity:.3,vignetteSoftness:.5,feedbackEnabled:!0,feedbackDecay:.5,feedbackInterval:250}};function at(n){return{...ue,...st[n]}}const ot=`// Bloom Brightness Extraction Pass
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
`,rt=`// Separable Gaussian Blur Pass
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
`,lt=`// Final Composite Pass
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
`,ct=`// Simple fullscreen texture blit — copies a texture to the render target

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
`,te=128,ie=16;class ut{constructor(e,t){a(this,"device");a(this,"format");a(this,"settings");a(this,"intermediateTexture",null);a(this,"bloomExtractTexture",null);a(this,"bloomBlurTempTexture",null);a(this,"bloomBlurTexture",null);a(this,"feedbackTextureA",null);a(this,"feedbackTextureB",null);a(this,"feedbackIndex",0);a(this,"sampler");a(this,"bloomExtractPipeline");a(this,"blurPipeline");a(this,"compositePipeline");a(this,"blitPipeline");a(this,"singleTextureLayout");a(this,"compositeLayout");a(this,"blitLayout");a(this,"bloomExtractBindGroup",null);a(this,"blurHBindGroup",null);a(this,"blurVBindGroup",null);a(this,"compositeBindGroup",null);a(this,"compositeBindGroupFB",[null,null]);a(this,"blitBindGroupFB",[null,null]);a(this,"uniformBuffer");a(this,"blurHUniformBuffer");a(this,"blurVUniformBuffer");a(this,"width",0);a(this,"height",0);a(this,"lastSnapshotTime",0);this.device=e,this.format=t,this.settings={...ue},this.sampler=e.createSampler({label:"Post-Process Sampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),this.uniformBuffer=e.createBuffer({label:"Post-Process Uniforms",size:te,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.blurHUniformBuffer=e.createBuffer({label:"Blur H Uniforms",size:ie,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.blurVUniformBuffer=e.createBuffer({label:"Blur V Uniforms",size:ie,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.singleTextureLayout=e.createBindGroupLayout({label:"Single Texture Layout",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),this.compositeLayout=e.createBindGroupLayout({label:"Composite Layout",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:4,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}}]}),this.blitLayout=e.createBindGroupLayout({label:"Blit Layout",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}}]});const i=e.createShaderModule({label:"Bloom Extract Shader",code:ot}),s=e.createShaderModule({label:"Blur Shader",code:rt}),o=e.createShaderModule({label:"Composite Shader",code:lt}),c=e.createShaderModule({label:"Blit Shader",code:ct});this.bloomExtractPipeline=e.createRenderPipeline({label:"Bloom Extract Pipeline",layout:e.createPipelineLayout({bindGroupLayouts:[this.singleTextureLayout]}),vertex:{module:i,entryPoint:"vertexMain"},fragment:{module:i,entryPoint:"fragmentMain",targets:[{format:t}]},primitive:{topology:"triangle-list"}}),this.blurPipeline=e.createRenderPipeline({label:"Blur Pipeline",layout:e.createPipelineLayout({bindGroupLayouts:[this.singleTextureLayout]}),vertex:{module:s,entryPoint:"vertexMain"},fragment:{module:s,entryPoint:"fragmentMain",targets:[{format:t}]},primitive:{topology:"triangle-list"}}),this.compositePipeline=e.createRenderPipeline({label:"Composite Pipeline",layout:e.createPipelineLayout({bindGroupLayouts:[this.compositeLayout]}),vertex:{module:o,entryPoint:"vertexMain"},fragment:{module:o,entryPoint:"fragmentMain",targets:[{format:t}]},primitive:{topology:"triangle-list"}}),this.blitPipeline=e.createRenderPipeline({label:"Blit Pipeline",layout:e.createPipelineLayout({bindGroupLayouts:[this.blitLayout]}),vertex:{module:c,entryPoint:"vertexMain"},fragment:{module:c,entryPoint:"fragmentMain",targets:[{format:t}]},primitive:{topology:"triangle-list"}}),console.log("Post-processing pipeline initialized")}isEnabled(){return this.settings.enabled}setPreset(e){this.settings=at(e)}resize(e,t){if(e===this.width&&t===this.height)return;this.width=e,this.height=t,this.intermediateTexture?.destroy(),this.bloomExtractTexture?.destroy(),this.bloomBlurTempTexture?.destroy(),this.bloomBlurTexture?.destroy(),this.feedbackTextureA?.destroy(),this.feedbackTextureB?.destroy();const i=Math.max(1,Math.floor(e/2)),s=Math.max(1,Math.floor(t/2));this.intermediateTexture=this.device.createTexture({label:"Post-Process Intermediate",size:{width:e,height:t},format:this.format,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),this.bloomExtractTexture=this.device.createTexture({label:"Bloom Extract",size:{width:i,height:s},format:this.format,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),this.bloomBlurTempTexture=this.device.createTexture({label:"Bloom Blur Temp",size:{width:i,height:s},format:this.format,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),this.bloomBlurTexture=this.device.createTexture({label:"Bloom Blur",size:{width:i,height:s},format:this.format,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),this.feedbackTextureA=this.device.createTexture({label:"Feedback A",size:{width:e,height:t},format:this.format,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),this.feedbackTextureB=this.device.createTexture({label:"Feedback B",size:{width:e,height:t},format:this.format,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),this.feedbackIndex=0,this.createBindGroups(i,s)}getIntermediateTextureView(){return this.intermediateTexture.createView()}encodePostProcessPasses(e,t){if(this.updateUniforms(),this.settings.bloomEnabled){const i=e.beginRenderPass({label:"Bloom Extract",colorAttachments:[{view:this.bloomExtractTexture.createView(),clearValue:{r:0,g:0,b:0,a:1},loadOp:"clear",storeOp:"store"}]});i.setPipeline(this.bloomExtractPipeline),i.setBindGroup(0,this.bloomExtractBindGroup),i.draw(3),i.end();const s=e.beginRenderPass({label:"Blur Horizontal",colorAttachments:[{view:this.bloomBlurTempTexture.createView(),clearValue:{r:0,g:0,b:0,a:1},loadOp:"clear",storeOp:"store"}]});s.setPipeline(this.blurPipeline),s.setBindGroup(0,this.blurHBindGroup),s.draw(3),s.end();const o=e.beginRenderPass({label:"Blur Vertical",colorAttachments:[{view:this.bloomBlurTexture.createView(),clearValue:{r:0,g:0,b:0,a:1},loadOp:"clear",storeOp:"store"}]});o.setPipeline(this.blurPipeline),o.setBindGroup(0,this.blurVBindGroup),o.draw(3),o.end()}if(this.settings.feedbackEnabled){const i=performance.now(),s=this.settings.feedbackInterval,o=s<=0||i-this.lastSnapshotTime>=s,c=this.feedbackIndex;if(o){this.lastSnapshotTime=i;const h=c===0?this.feedbackTextureA.createView():this.feedbackTextureB.createView(),d=e.beginRenderPass({label:"Composite (→ Feedback)",colorAttachments:[{view:h,clearValue:{r:0,g:0,b:0,a:1},loadOp:"clear",storeOp:"store"}]});d.setPipeline(this.compositePipeline),d.setBindGroup(0,this.compositeBindGroupFB[c]),d.draw(3),d.end();const l=e.beginRenderPass({label:"Blit (Feedback → Canvas)",colorAttachments:[{view:t,clearValue:{r:0,g:0,b:0,a:1},loadOp:"clear",storeOp:"store"}]});l.setPipeline(this.blitPipeline),l.setBindGroup(0,this.blitBindGroupFB[c]),l.draw(3),l.end(),this.feedbackIndex=1-c}else{const h=e.beginRenderPass({label:"Composite (with frozen history)",colorAttachments:[{view:t,clearValue:{r:0,g:0,b:0,a:1},loadOp:"clear",storeOp:"store"}]});h.setPipeline(this.compositePipeline),h.setBindGroup(0,this.compositeBindGroupFB[c]),h.draw(3),h.end()}}else{const i=e.beginRenderPass({label:"Composite",colorAttachments:[{view:t,clearValue:{r:0,g:0,b:0,a:1},loadOp:"clear",storeOp:"store"}]});i.setPipeline(this.compositePipeline),i.setBindGroup(0,this.compositeBindGroup),i.draw(3),i.end()}}createBindGroups(e,t){const i=this.intermediateTexture.createView(),s=this.bloomExtractTexture.createView(),o=this.bloomBlurTempTexture.createView(),c=this.bloomBlurTexture.createView();this.bloomExtractBindGroup=this.device.createBindGroup({label:"Bloom Extract Bind Group",layout:this.singleTextureLayout,entries:[{binding:0,resource:this.sampler},{binding:1,resource:i},{binding:2,resource:{buffer:this.uniformBuffer}}]}),this.blurHBindGroup=this.device.createBindGroup({label:"Blur H Bind Group",layout:this.singleTextureLayout,entries:[{binding:0,resource:this.sampler},{binding:1,resource:s},{binding:2,resource:{buffer:this.blurHUniformBuffer}}]}),this.blurVBindGroup=this.device.createBindGroup({label:"Blur V Bind Group",layout:this.singleTextureLayout,entries:[{binding:0,resource:this.sampler},{binding:1,resource:o},{binding:2,resource:{buffer:this.blurVUniformBuffer}}]});const h=this.feedbackTextureA.createView(),d=this.feedbackTextureB.createView();this.compositeBindGroup=this.device.createBindGroup({label:"Composite Bind Group",layout:this.compositeLayout,entries:[{binding:0,resource:this.sampler},{binding:1,resource:i},{binding:2,resource:c},{binding:3,resource:{buffer:this.uniformBuffer}},{binding:4,resource:h}]}),this.compositeBindGroupFB[0]=this.device.createBindGroup({label:"Composite Bind Group (FB→A)",layout:this.compositeLayout,entries:[{binding:0,resource:this.sampler},{binding:1,resource:i},{binding:2,resource:c},{binding:3,resource:{buffer:this.uniformBuffer}},{binding:4,resource:d}]}),this.compositeBindGroupFB[1]=this.device.createBindGroup({label:"Composite Bind Group (FB→B)",layout:this.compositeLayout,entries:[{binding:0,resource:this.sampler},{binding:1,resource:i},{binding:2,resource:c},{binding:3,resource:{buffer:this.uniformBuffer}},{binding:4,resource:h}]}),this.blitBindGroupFB[0]=this.device.createBindGroup({label:"Blit Bind Group (A)",layout:this.blitLayout,entries:[{binding:0,resource:this.sampler},{binding:1,resource:h}]}),this.blitBindGroupFB[1]=this.device.createBindGroup({label:"Blit Bind Group (B)",layout:this.blitLayout,entries:[{binding:0,resource:this.sampler},{binding:1,resource:d}]});const l=new Float32Array([1/e,1/t,1,0]);this.device.queue.writeBuffer(this.blurHUniformBuffer,0,l);const p=new Float32Array([1/e,1/t,0,1]);this.device.queue.writeBuffer(this.blurVUniformBuffer,0,p)}updateUniforms(){const e=new ArrayBuffer(te),t=new Float32Array(e),i=new Int32Array(e);if(t[0]=this.width,t[1]=this.height,t[2]=1/this.width,t[3]=1/this.height,t[4]=this.settings.bloomThreshold,t[5]=this.settings.bloomIntensity,t[6]=this.settings.vignetteIntensity,t[7]=this.settings.vignetteSoftness,t[8]=this.settings.sharpenStrength,t[9]=this.settings.chromaticAberrationIntensity,t[10]=this.settings.exposure,t[11]=this.settings.saturation,t[12]=this.settings.temperature,i[13]=this.settings.bloomEnabled?1:0,i[14]=this.settings.vignetteEnabled?1:0,i[15]=this.settings.sharpenEnabled?1:0,i[16]=this.settings.chromaticAberrationEnabled?1:0,i[17]=this.settings.toneMappingEnabled?1:0,i[18]=this.settings.ghostMirrorEnabled?1:0,t[19]=this.settings.ghostMirrorOpacity,i[20]=this.settings.ghostMirrorMode,i[21]=this.settings.kaleidoscopeEnabled?1:0,t[22]=this.settings.kaleidoscopeSegments,i[23]=this.settings.waveEnabled?1:0,t[24]=this.settings.waveAmplitude,t[25]=this.settings.waveFrequency,t[26]=performance.now()*.001,i[27]=this.settings.feedbackEnabled?1:0,this.settings.feedbackEnabled&&this.settings.feedbackInterval>0){const s=performance.now()-this.lastSnapshotTime,o=1.5/this.settings.feedbackInterval;t[28]=this.settings.feedbackDecay*Math.exp(-o*s)}else t[28]=this.settings.feedbackDecay;this.device.queue.writeBuffer(this.uniformBuffer,0,e)}destroy(){this.intermediateTexture?.destroy(),this.bloomExtractTexture?.destroy(),this.bloomBlurTempTexture?.destroy(),this.bloomBlurTexture?.destroy(),this.feedbackTextureA?.destroy(),this.feedbackTextureB?.destroy(),this.uniformBuffer.destroy(),this.blurHUniformBuffer.destroy(),this.blurVUniformBuffer.destroy()}}const ht=`// WebGPU Shader for Mandelbrot Set with HDR support
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

  // Check if we're using blended mode (for smooth fractal type transitions)
  let useBlendedMode = u.blendEnabled != 0;

  if (useBlendedMode) {
    // BLENDED MODE: Use interpolated initial conditions
    // This enables smooth Mandelbrot ↔ Julia transitions
    z = mix(vec2f(0.0), pos, u.blendJulia);
    c = mix(pos, u.juliaC, u.blendJulia);
  } else if (isJulia) {
    // LEGACY MODE: Julia variant
    // For Phoenix Julia, swap and negate to match conventional orientation
    // (feathers extending horizontally, correct vertical orientation)
    if (isPhoenix) {
      z = vec2f(-pos.y, pos.x);  // Rotate 90° CCW to match reference images
    } else {
      z = pos;
    }
    c = u.juliaC;
  } else {
    // LEGACY MODE: Mandelbrot-style
    z = vec2f(0.0);
    c = pos;
  }

  var iterations = 0;
  let maxIter = u.maxIterations;

  for (var i = 0; i < 65536; i++) {
    if (i >= maxIter) { break; }
    let zMagSq = dot(z, z);
    if (zMagSq > 256.0) { break; } // Larger escape for higher powers

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
    else {
      // Fallback to standard Mandelbrot
      z = vec2f(z.x * z.x - z.y * z.y + c.x, 2.0 * z.x * z.y + c.y);
    }

    iterations++;
  }

  if (iterations >= maxIter) {
    return vec4f(0.0, 0.0, 0.0, 1.0);
  }

  // Smooth iteration count - adjust log base for higher power fractals
  var logBase = 2.0;
  if (baseType == 6) { logBase = 3.0; }      // Multibrot3
  else if (baseType == 7) { logBase = 4.0; } // Multibrot4

  let smoothIter = f32(iterations) + 1.0 - log2(log2(max(dot(z, z), 4.0))) / log2(logBase);
  let normalized = smoothIter / f32(maxIter);

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
`,ne=1.5,se=256,E=class E{constructor(e,t){a(this,"renderer");a(this,"state");a(this,"inputHandler");a(this,"pipeline");a(this,"uniformBuffer");a(this,"bindGroup");a(this,"postProcessing");a(this,"postProcessPresetIndex",0);a(this,"overlays");a(this,"touristMode",null);a(this,"autoTouristTimeout",null);a(this,"userHasInteracted",!1);a(this,"handleResize",()=>{this.renderer.resize(window.innerWidth,window.innerHeight);const e=this.renderer.canvas;this.postProcessing.resize(e.width,e.height),this.render()});a(this,"handleHashChange",()=>{this.loadBookmark()});this.renderer=e,this.state=new nt,this.postProcessing=new ut(e.device,e.format),this.inputHandler=new U(t,this.state.view,()=>this.render(),this.createInputCallbacks()),this.setupOverlays(t)}static async create(e){const t=await D.create(e),i=new E(t,e);return await i.initializePipeline(),t.setOnHdrChange(()=>{console.log("HDR status changed, re-rendering..."),i.render()}),window.addEventListener("resize",i.handleResize),window.addEventListener("hashchange",i.handleHashChange),i.loadBookmark(),i.handleResize(),i.startAutoTouristTimer(),i}async initializePipeline(){const e=this.renderer.device,t=e.createShaderModule({label:"Mandelbrot Shader",code:ht});this.uniformBuffer=e.createBuffer({label:"Uniforms",size:se,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});const i=e.createBindGroupLayout({label:"Bind Group Layout",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]});this.bindGroup=e.createBindGroup({label:"Bind Group",layout:i,entries:[{binding:0,resource:{buffer:this.uniformBuffer}}]});const s=e.createPipelineLayout({label:"Pipeline Layout",bindGroupLayouts:[i]});this.pipeline=e.createRenderPipeline({label:"Mandelbrot Pipeline",layout:s,vertex:{module:t,entryPoint:"vertexMain"},fragment:{module:t,entryPoint:"fragmentMain",targets:[{format:this.renderer.format}]},primitive:{topology:"triangle-list"}}),console.log("WebGPU pipeline initialized")}createInputCallbacks(){return{onIterationAdjust:e=>this.adjustMaxIterations(e),onIterationReset:()=>this.clearMaxIterationsOverride(),onCosinePaletteCycle:e=>this.cycleCosinePalette(e),onGradientPaletteCycle:e=>this.cycleGradientPalette(e),onColorOffsetAdjust:e=>this.adjustColorOffset(e),onColorOffsetReset:()=>this.resetColorOffset(),onBrightnessAdjust:e=>this.adjustHdrBrightness(e),onBrightnessReset:()=>this.resetHdrBrightness(),onFractalCycle:e=>this.cycleFractalType(e),onFractalCycleAnimate:e=>this.animateFractalCycle(e),onToggleJuliaMode:()=>this.toggleJuliaPickerMode(),onJuliaPick:(e,t)=>this.pickJuliaConstant(e,t),onJuliaPickEnd:()=>this.endJuliaPicking(),onShare:()=>this.shareBookmark(),onLocationSelect:e=>this.goToLocation(e),onLocationAnimate:e=>this.animateToLocation(e),onToggleHelp:()=>this.toggleHelp(),onToggleScreenshotMode:()=>this.toggleScreenshotMode(),onToggleTouristMode:()=>this.toggleTouristMode(),onPostProcessPresetCycle:e=>this.cyclePostProcessPreset(e),onUserInput:()=>this.handleUserInput()}}setupOverlays(e){const t=e.parentElement;if(!t)throw new Error("Canvas must have a parent element for overlays");this.overlays=new Ke(t)}render(){const e=this.renderer.device,t=this.renderer.canvas,i=performance.now();this.overlays.tickFPS(i);const s=M(this.state.fractalType),o=this.state.maxIterationsOverride??H(this.state.view.zoom,s),c=this.state.paletteType==="cosine"?Le(this.state.cosinePaletteIndex):De(this.state.gradientPaletteIndex),h={fractalName:ge[this.state.fractalType],zoom:this.state.view.zoom,maxIterations:o,isManualIterations:this.state.maxIterationsOverride!==null,paletteName:c,colorOffset:this.state.colorOffset,isJulia:s,juliaC:this.state.juliaC,hdrEnabled:this.renderer.hdrEnabled,hdrBrightnessBias:this.state.hdrBrightnessBias,displaySupportsHDR:this.renderer.displaySupportsHDR,sdrGradientBrightness:this.state.sdrGradientBrightness,paletteType:this.state.paletteType,juliaPickerMode:this.state.juliaPickerMode,postProcessPreset:this.postProcessing.isEnabled()?ee[_[this.postProcessPresetIndex]]:null};this.overlays.updateDebug(h);const d=new ArrayBuffer(se),l=new Float32Array(d),p=new Int32Array(d),b=this.state.paletteType==="cosine",v=b?Re(this.state.cosinePaletteIndex):_e(this.state.gradientPaletteIndex),f=this.state.interpolatedPaletteParams??(b?le(this.state.cosinePaletteIndex):ce(this.state.gradientPaletteIndex,this.renderer.hdrEnabled));l[0]=t.width,l[1]=t.height,l[2]=this.state.view.centerX,l[3]=this.state.view.centerY,l[4]=this.state.view.zoom,p[5]=o,l[6]=performance.now()*.001,l[7]=this.state.colorOffset,p[8]=this.state.fractalType,l[10]=this.state.juliaC[0],l[11]=this.state.juliaC[1],p[12]=this.renderer.hdrEnabled?1:0,l[13]=this.state.hdrBrightnessBias,p[14]=f.type==="cosine"?0:1,p[15]=v.isMonotonic?1:0,l[16]=this.state.sdrGradientBrightness;const g=this.state.interpolatedBlendParams;l[17]=g?.juliaBlend??0,l[18]=g?.preAbsRe??0,l[19]=g?.preAbsIm??0,f.type==="cosine"&&(l[20]=f.a[0],l[21]=f.a[1],l[22]=f.a[2],l[24]=f.b[0],l[25]=f.b[1],l[26]=f.b[2],l[28]=f.c[0],l[29]=f.c[1],l[30]=f.c[2],l[32]=f.d[0],l[33]=f.d[1],l[34]=f.d[2]),f.type==="gradient"&&(l[36]=f.c1[0],l[37]=f.c1[1],l[38]=f.c1[2],l[40]=f.c2[0],l[41]=f.c2[1],l[42]=f.c2[2],l[44]=f.c3[0],l[45]=f.c3[1],l[46]=f.c3[2],l[48]=f.c4[0],l[49]=f.c4[1],l[50]=f.c4[2],l[52]=f.c5[0],l[53]=f.c5[1],l[54]=f.c5[2]),l[56]=g?.preNegIm??0,l[57]=g?.postAbsRe??0,l[58]=g?.postAbsIm??0,l[59]=g?.postNegIm??0,p[60]=g!==null?1:0,e.queue.writeBuffer(this.uniformBuffer,0,d);const w=e.createCommandEncoder(),V=this.postProcessing.isEnabled(),he=V?this.postProcessing.getIntermediateTextureView():this.renderer.getCurrentTexture().createView(),A=w.beginRenderPass({colorAttachments:[{view:he,clearValue:{r:0,g:0,b:0,a:1},loadOp:"clear",storeOp:"store"}]});if(A.setPipeline(this.pipeline),A.setBindGroup(0,this.bindGroup),A.draw(3),A.end(),V){const de=this.renderer.getCurrentTexture().createView();this.postProcessing.encodePostProcessPasses(w,de)}e.queue.submit([w.finish()])}start(){this.renderer.start(()=>this.render())}stop(){this.renderer.stop()}adjustMaxIterations(e){const t=M(this.state.fractalType),i=this.state.maxIterationsOverride??H(this.state.view.zoom,t),s=e>0?i*ne:i/ne;this.state.maxIterationsOverride=Math.round(Math.max(1,s)),this.render()}clearMaxIterationsOverride(){this.state.maxIterationsOverride=null,this.render()}adjustHdrBrightness(e){this.renderer.hdrEnabled?this.state.hdrBrightnessBias=Math.max(-1,Math.min(1,this.state.hdrBrightnessBias+e*.1)):this.state.paletteType==="gradient"&&(this.state.sdrGradientBrightness=Math.max(.1,Math.min(10,this.state.sdrGradientBrightness+e*.2))),this.render()}resetHdrBrightness(){this.state.hdrBrightnessBias=0,this.state.sdrGradientBrightness=1,this.render()}cycleCosinePalette(e){this.state.cosinePaletteIndex=(this.state.cosinePaletteIndex+e+P)%P,this.state.paletteType="cosine",this.render()}cycleGradientPalette(e){this.state.gradientPaletteIndex=(this.state.gradientPaletteIndex+e+I)%I,this.state.paletteType="gradient",this.render()}adjustColorOffset(e){this.state.colorOffset+=e,this.render()}resetColorOffset(){this.state.colorOffset=0,this.render()}cycleFractalType(e=1){this.userHasInteracted=!0,this.cancelAutoTouristTimer(),this.cancelOngoingAnimation();const o=((z(this.state.fractalType)>>1)+e+B)%B<<1;this.state.juliaPickerMode&&(this.state.juliaPickerMode=!1,this.inputHandler.setJuliaPickerMode(!1));const c=O("1",o);c?(this.applyLocationState(c.state),this.state.clearInterpolationState(),this.showLocationNotification(c.name,c.description)):(this.state.fractalType=o,this.state.clearInterpolationState()),this.render()}animateFractalCycle(e=1){this.userHasInteracted=!0,this.cancelAutoTouristTimer();const o=((z(this.state.fractalType)>>1)+e+B)%B<<1;this.state.juliaPickerMode&&(this.state.juliaPickerMode=!1,this.inputHandler.setJuliaPickerMode(!1));const c=O("1",o);if(!c){this.cycleFractalType(e);return}this.touristMode||(this.touristMode=new R({onUpdate:(h,d,l)=>this.applyTouristUpdate(h,d,l),onClearInterpolation:()=>this.state.clearInterpolationState(),onRender:()=>this.render(),onLocationNotification:(h,d)=>this.showLocationNotification(h,d)},this.getBookmarkState())),this.touristMode.animateToLocation(c,this.getBookmarkState())}toggleJuliaPickerMode(){if(M(this.state.fractalType)){this.exitJuliaMode();return}this.state.juliaPickerMode=!this.state.juliaPickerMode,this.inputHandler.setJuliaPickerMode(this.state.juliaPickerMode),this.render()}pickJuliaConstant(e,t){this.state.juliaPickerMode&&(this.state.isActivelyPickingJulia||(this.state.savedViewState={centerX:this.state.view.centerX,centerY:this.state.view.centerY,zoom:this.state.view.zoom},this.state.savedFractalType=this.state.fractalType,this.state.fractalType=be(this.state.fractalType),this.state.view.centerX=0,this.state.view.centerY=0,this.state.view.zoom=.5,this.state.isActivelyPickingJulia=!0),this.state.juliaC=[e,t],this.render())}endJuliaPicking(){this.state.isActivelyPickingJulia&&(this.state.isActivelyPickingJulia=!1,this.state.juliaPickerMode=!1,this.inputHandler.setJuliaPickerMode(!1),this.render())}exitJuliaMode(){this.state.savedViewState&&(this.state.view.centerX=this.state.savedViewState.centerX,this.state.view.centerY=this.state.savedViewState.centerY,this.state.view.zoom=this.state.savedViewState.zoom,this.state.savedViewState=null),this.state.savedFractalType!==null?(this.state.fractalType=this.state.savedFractalType,this.state.savedFractalType=null):this.state.fractalType=z(this.state.fractalType),this.state.juliaPickerMode=!1,this.inputHandler.setJuliaPickerMode(!1),this.render()}getBookmarkState(){return this.state.toBookmark()}loadBookmark(){const e=Te();if(e){if(e.paletteIndex!==void 0&&e.paletteType===void 0){const t=[0,4,5,10,11];if(t.includes(e.paletteIndex))e.paletteType="cosine",e.cosinePaletteIndex=t.indexOf(e.paletteIndex);else{e.paletteType="gradient";const i=[1,2,3,6,7,8,9];e.gradientPaletteIndex=i.indexOf(e.paletteIndex)}}this.state.fromBookmark(e),this.render()}}goToLocation(e){const t=O(e,this.state.fractalType);t&&(this.userHasInteracted=!0,this.cancelAutoTouristTimer(),this.cancelOngoingAnimation(),this.applyLocationState(t.state),this.state.clearInterpolationState(),this.showLocationNotification(t.name,t.description),this.updateUrlBookmark(),this.render())}animateToLocation(e){const t=O(e,this.state.fractalType);t&&(this.userHasInteracted=!0,this.cancelAutoTouristTimer(),this.touristMode||(this.touristMode=new R({onUpdate:(i,s,o)=>this.applyTouristUpdate(i,s,o),onClearInterpolation:()=>this.state.clearInterpolationState(),onRender:()=>this.render(),onLocationNotification:(i,s)=>this.showLocationNotification(i,s)},this.getBookmarkState())),this.touristMode.animateToLocation(t,this.getBookmarkState()))}applyLocationState(e){this.state.applyBookmark(e)}showLocationNotification(e,t){this.overlays.isScreenshotMode()||this.overlays.notification.showLocation(e,t)}updateUrlBookmark(){xe(this.getBookmarkState())}async shareBookmark(){const e=await Pe(this.getBookmarkState());this.showShareNotification(e),e&&this.updateUrlBookmark(),(window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1")&&this.logCreateLocationCode()}logCreateLocationCode(){const e=this.getFractalTypeEnumName(this.state.fractalType),t=M(this.state.fractalType),i=[];this.state.paletteType==="gradient"?(i.push("paletteType: 'gradient'"),this.state.gradientPaletteIndex!==0&&i.push(`gradientPaletteIndex: ${this.state.gradientPaletteIndex}`)):this.state.cosinePaletteIndex!==1&&i.push(`cosinePaletteIndex: ${this.state.cosinePaletteIndex}`),Math.abs(this.state.colorOffset)>.001&&i.push(`colorOffset: ${this.state.colorOffset}`),t&&i.push(`juliaC: [${this.state.juliaC[0]}, ${this.state.juliaC[1]}]`),this.state.maxIterationsOverride!==null&&i.push(`maxIterationsOverride: ${this.state.maxIterationsOverride}`);const s=i.length>0?`,
    { ${i.join(", ")} }`:"",o=`createLocation(
    'TODO: Name',
    'TODO: Description',
    'TODO: Key (1-9)',
    FractalType.${e},
    ${this.state.view.centerX}, ${this.state.view.centerY}, ${this.state.view.zoom}${s}
  ),`;console.log("%c📍 createLocation() code:","color: #4ade80; font-weight: bold; font-size: 14px;"),console.log(o)}getFractalTypeEnumName(e){const t=Object.entries(r);for(const[i,s]of t)if(s===e&&isNaN(Number(i)))return i;return`Unknown(${e})`}showShareNotification(e){this.overlays.notification.showShareResult(e)}toggleHelp(){this.overlays.toggleHelp()}toggleScreenshotMode(){this.overlays.toggleScreenshotMode()}cyclePostProcessPreset(e){this.postProcessPresetIndex=(this.postProcessPresetIndex+e+_.length)%_.length;const t=_[this.postProcessPresetIndex];this.postProcessing.setPreset(t);const i=ee[t];this.overlays.notification.info(`✨ Post-Processing: ${i}`,1500),this.render()}toggleTouristMode(){this.touristMode?.isActive()?this.stopTouristMode():this.startTouristMode()}startTouristMode(){this.touristMode||(this.touristMode=new R({onUpdate:(e,t,i)=>this.applyTouristUpdate(e,t,i),onClearInterpolation:()=>this.state.clearInterpolationState(),onRender:()=>this.render(),onLocationNotification:(e,t)=>this.showLocationNotification(e,t)},this.getBookmarkState())),this.touristMode.start(this.getBookmarkState()),this.showTouristModeNotification(!0)}stopTouristMode(){this.touristMode?.isActive()&&(this.touristMode.stop(),this.state.clearInterpolationState(),this.overlays.disableAutoScreenshotMode(),this.showTouristModeNotification(!1),this.updateUrlBookmark())}cancelOngoingAnimation(){this.touristMode?.isActive()&&(this.touristMode.stop(),this.state.clearInterpolationState())}handleUserInput(){this.userHasInteracted=!0,this.cancelAutoTouristTimer(),this.touristMode?.isActive()&&this.stopTouristMode()}startAutoTouristTimer(){this.userHasInteracted||(this.cancelAutoTouristTimer(),this.autoTouristTimeout=setTimeout(()=>{!this.userHasInteracted&&!this.touristMode?.isActive()&&this.startTouristModeAuto()},E.AUTO_TOURIST_DELAY))}cancelAutoTouristTimer(){this.autoTouristTimeout!==null&&(clearTimeout(this.autoTouristTimeout),this.autoTouristTimeout=null)}startTouristModeAuto(){this.overlays.setScreenshotMode(!0,!0),this.touristMode||(this.touristMode=new R({onUpdate:(e,t,i)=>this.applyTouristUpdate(e,t,i),onClearInterpolation:()=>this.state.clearInterpolationState(),onRender:()=>this.render(),onLocationNotification:(e,t)=>this.showLocationNotification(e,t)},this.getBookmarkState())),this.touristMode.start(this.getBookmarkState()),this.overlays.notification.showAutoTouristMode()}applyTouristUpdate(e,t,i){this.state.applyPartial(e),this.state.interpolatedPaletteParams=t??null,this.state.interpolatedBlendParams=i??null}showTouristModeNotification(e){this.overlays.notification.showTouristMode(e)}destroy(){this.cancelAutoTouristTimer(),this.touristMode?.stop(),this.stop(),window.removeEventListener("resize",this.handleResize),window.removeEventListener("hashchange",this.handleHashChange),this.overlays.destroy(),this.inputHandler.destroy(),this.postProcessing.destroy(),this.renderer.destroy()}};a(E,"AUTO_TOURIST_DELAY",2e4);let J=E;console.log("Fractal Explorer - Initializing...");let L=null;async function ae(){const n=document.getElementById("app");if(!n){console.error("Could not find #app element");return}if(!D.isSupported()){n.innerHTML=`
      <div style="color: white; text-align: center; padding: 40px; font-family: system-ui, sans-serif;">
        <h1>WebGPU Not Supported</h1>
        <p>This application requires WebGPU, which is not available in your browser.</p>
        <p style="margin-top: 20px; color: #888;">
          Please use a modern browser with WebGPU support:<br>
          Chrome 113+, Edge 113+, or Firefox Nightly with WebGPU enabled.
        </p>
      </div>
    `;return}const e=document.createElement("canvas");e.id="fractal-canvas",n.appendChild(e);try{L=await J.create(e),L.start(),console.log("Fractal Explorer initialized successfully"),console.log("Controls:"),console.log("  - Drag to pan"),console.log("  - Scroll to zoom"),console.log("  - Double-click to zoom in"),console.log("  - Touch drag to pan (mobile)"),console.log("  - Pinch to zoom (mobile)"),console.log("  - + / - to adjust max iterations"),console.log("  - 0 to reset iterations to auto-scaling"),console.log("  - c / C to cycle cosine palettes (forward/backward)"),console.log("  - g / G to cycle gradient palettes (forward/backward)"),console.log("  - , / . to shift colors (fine)"),console.log("  - < / > to shift colors (coarse)"),console.log("  - b / B to adjust brightness (HDR bias or SDR gradient)"),console.log("  - d to reset brightness"),console.log("  - s to share/copy bookmark URL"),console.log("  - 1-9 to visit famous locations"),console.log("  - h to toggle help overlay"),console.log("  - Space to toggle screenshot mode")}catch(t){console.error("Failed to initialize Fractal Explorer:",t),n.innerHTML=`
      <div style="color: white; text-align: center; padding: 20px; font-family: system-ui, sans-serif;">
        <h1>Initialization Error</h1>
        <p>Failed to initialize the application.</p>
        <pre style="text-align: left; margin-top: 20px; color: #ff6b6b;">${t instanceof Error?t.message:String(t)}</pre>
      </div>
    `}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>ae()):ae();window.addEventListener("beforeunload",()=>{L&&L.destroy()});
//# sourceMappingURL=index-B6FvztR-.js.map
