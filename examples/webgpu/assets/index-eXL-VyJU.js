var fe=Object.defineProperty;var pe=(i,e,t)=>e in i?fe(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t;var a=(i,e,t)=>pe(i,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const h of o.addedNodes)h.tagName==="LINK"&&h.rel==="modulepreload"&&s(h)}).observe(document,{childList:!0,subtree:!0});function t(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(n){if(n.ep)return;n.ep=!0;const o=t(n);fetch(n.href,o)}})();class D{constructor(e){a(this,"device");a(this,"context");a(this,"canvas");a(this,"format");a(this,"animationFrameId",null);a(this,"renderCallback",null);a(this,"hdrEnabled",!1);a(this,"_displaySupportsHDR",!1);a(this,"hdrMediaQuery",null);a(this,"onHdrChangeCallback",null);this.canvas=e,this._displaySupportsHDR=this.detectHDRDisplay(),this.setupHdrMediaQueryListener()}get displaySupportsHDR(){return this._displaySupportsHDR}static async create(e){const t=new D(e);return await t.initialize(),t}static isSupported(){return"gpu"in navigator}async initialize(){if(!navigator.gpu)throw new Error("WebGPU is not supported in this browser");console.log("WebGPU HDR capability check:"),console.log("  - Display supports HDR:",this.displaySupportsHDR),console.log("  - dynamic-range: high:",window.matchMedia?.("(dynamic-range: high)").matches),console.log("  - color-gamut: p3:",window.matchMedia?.("(color-gamut: p3)").matches);const e=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!e)throw new Error("Failed to get WebGPU adapter");if("info"in e){const t=e.info;console.log("  - Adapter:",t?.vendor,t?.architecture)}if(this.device=await e.requestDevice(),this.context=this.canvas.getContext("webgpu"),!this.context)throw new Error("Failed to get WebGPU context");this.configureContext(),console.log("WebGPU initialized successfully"),this.hdrEnabled&&console.log("HDR mode enabled with rgba16float + extended tone mapping")}configureContext(){const e=navigator.gpu.getPreferredCanvasFormat();if(this.displaySupportsHDR)try{this.format="rgba16float",this.context.configure({device:this.device,format:this.format,alphaMode:"opaque",toneMapping:{mode:"extended"}}),this.hdrEnabled=!0,console.log("  - Configured with rgba16float + extended tone mapping (HDR)")}catch(t){console.log("  - HDR configuration failed, falling back to SDR:",t),this.format=e,this.context.configure({device:this.device,format:this.format,alphaMode:"opaque"}),this.hdrEnabled=!1}else this.format=e,this.context.configure({device:this.device,format:this.format,alphaMode:"opaque"}),this.hdrEnabled=!1,console.log("  - Configured with",this.format,"(SDR)")}resize(e,t){const s=window.devicePixelRatio||1;this.canvas.width=e*s,this.canvas.height=t*s,this.canvas.style.width=`${e}px`,this.canvas.style.height=`${t}px`}getCurrentTexture(){return this.context.getCurrentTexture()}start(e){if(this.animationFrameId!==null)return;this.renderCallback=e;const t=()=>{this.renderCallback&&this.renderCallback(),this.animationFrameId=requestAnimationFrame(t)};this.animationFrameId=requestAnimationFrame(t)}stop(){this.animationFrameId!==null&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null),this.renderCallback=null}detectHDRDisplay(){return!!window.matchMedia?.("(dynamic-range: high)").matches}setupHdrMediaQueryListener(){if(!window.matchMedia)return;this.hdrMediaQuery=window.matchMedia("(dynamic-range: high)");const e=()=>{const t=this.detectHDRDisplay();t!==this._displaySupportsHDR&&(console.log(`HDR display support changed: ${this._displaySupportsHDR} -> ${t}`),this._displaySupportsHDR=t,this.context&&this.device&&this.configureContext(),this.onHdrChangeCallback?.())};this.hdrMediaQuery.addEventListener?.("change",e)}setOnHdrChange(e){this.onHdrChangeCallback=e}destroy(){this.stop(),this.onHdrChangeCallback=null,this.device?.destroy()}}const me=.6;function U(i){return 1+(i-1)*me}const k=class k{constructor(e,t,s,n={}){a(this,"canvas");a(this,"viewState");a(this,"onChange");a(this,"callbacks");a(this,"isDragging",!1);a(this,"lastX",0);a(this,"lastY",0);a(this,"lastTouchDistance",0);a(this,"juliaPickerMode",!1);a(this,"isPickingJulia",!1);a(this,"juliaPickViewState",null);a(this,"keyboardZoomDirection",null);a(this,"keyboardZoomStartTime",0);a(this,"keyboardZoomAnimationId",null);a(this,"locationKeyHeld",null);a(this,"locationLongPressTimeout",null);a(this,"fractalKeyHeld",null);a(this,"fractalLongPressTimeout",null);this.canvas=e,this.viewState=t,this.onChange=s,this.callbacks=n,this.setupEventListeners()}setCallbacks(e){this.callbacks={...this.callbacks,...e}}setJuliaPickerMode(e){this.juliaPickerMode=e,this.canvas.style.cursor=e?"crosshair":"grab"}isJuliaPickerModeActive(){return this.juliaPickerMode}setupEventListeners(){this.canvas.addEventListener("mousedown",this.handleMouseDown.bind(this)),this.canvas.addEventListener("mousemove",this.handleMouseMove.bind(this)),this.canvas.addEventListener("mouseup",this.handleMouseUp.bind(this)),this.canvas.addEventListener("mouseleave",this.handleMouseUp.bind(this)),this.canvas.addEventListener("wheel",this.handleWheel.bind(this),{passive:!1}),this.canvas.addEventListener("dblclick",this.handleDoubleClick.bind(this)),this.canvas.addEventListener("touchstart",this.handleTouchStart.bind(this),{passive:!1}),this.canvas.addEventListener("touchmove",this.handleTouchMove.bind(this),{passive:!1}),this.canvas.addEventListener("touchend",this.handleTouchEnd.bind(this)),this.canvas.addEventListener("touchcancel",this.handleTouchEnd.bind(this)),window.addEventListener("keydown",this.handleKeyDown.bind(this)),window.addEventListener("keyup",this.handleKeyUp.bind(this))}getCanvasRect(){return this.canvas.getBoundingClientRect()}getScreenCoords(e,t){const s=this.getCanvasRect();return[e-s.left,t-s.top]}getCanvasSize(){const e=this.getCanvasRect();return[e.width,e.height]}toFractalCoordsWithView(e,t,s,n,o){const h=s/n,u=(e/s-.5)*h,f=t/n-.5,l=o.centerX+u/o.zoom,p=o.centerY-f/o.zoom;return[l,p]}notifyChange(){this.onChange(this.viewState)}handleMouseDown(e){if(e.button!==0)return;const[t,s]=this.getScreenCoords(e.clientX,e.clientY);if(this.juliaPickerMode&&this.callbacks.onJuliaPick){const[n,o]=this.getCanvasSize();this.juliaPickViewState={centerX:this.viewState.centerX,centerY:this.viewState.centerY,zoom:this.viewState.zoom};const[h,u]=this.toFractalCoordsWithView(t,s,n,o,this.juliaPickViewState);this.isPickingJulia=!0,this.lastX=t,this.lastY=s,this.callbacks.onJuliaPick(h,u);return}this.isDragging=!0,this.lastX=t,this.lastY=s,this.canvas.style.cursor="grabbing"}handleMouseMove(e){const[t,s]=this.getScreenCoords(e.clientX,e.clientY);if(this.isPickingJulia&&this.callbacks.onJuliaPick&&this.juliaPickViewState){const[f,l]=this.getCanvasSize(),[p,b]=this.toFractalCoordsWithView(t,s,f,l,this.juliaPickViewState);this.callbacks.onJuliaPick(p,b),this.lastX=t,this.lastY=s;return}if(!this.isDragging)return;const n=t-this.lastX,o=s-this.lastY,[h,u]=this.getCanvasSize();this.viewState.pan(n,o,h,u),this.notifyChange(),this.lastX=t,this.lastY=s}handleMouseUp(){if(this.isPickingJulia){this.isPickingJulia=!1,this.juliaPickViewState=null,this.callbacks.onJuliaPickEnd?.();return}this.isDragging&&(this.isDragging=!1,this.canvas.style.cursor="grab")}handleWheel(e){e.preventDefault(),this.callbacks.onUserInput?.();const[t,s]=this.getScreenCoords(e.clientX,e.clientY),n=e.deltaY>0?.9:1.1,o=U(n),[h,u]=this.getCanvasSize();this.viewState.zoomAt(t,s,o,h,u),this.notifyChange()}handleDoubleClick(e){const[t,s]=this.getScreenCoords(e.clientX,e.clientY),[n,o]=this.getCanvasSize();this.viewState.zoomToPoint(t,s,U(2),n,o),this.notifyChange()}getTouchDistance(e){if(e.length<2)return 0;const t=e[0].clientX-e[1].clientX,s=e[0].clientY-e[1].clientY;return Math.sqrt(t*t+s*s)}getTouchCenter(e){if(e.length===0)return[0,0];if(e.length===1)return this.getScreenCoords(e[0].clientX,e[0].clientY);const t=(e[0].clientX+e[1].clientX)/2,s=(e[0].clientY+e[1].clientY)/2;return this.getScreenCoords(t,s)}handleTouchStart(e){if(this.callbacks.onUserInput?.(),e.touches.length===1){this.isDragging=!0;const[t,s]=this.getScreenCoords(e.touches[0].clientX,e.touches[0].clientY);this.lastX=t,this.lastY=s}else e.touches.length===2&&(this.isDragging=!1,this.lastTouchDistance=this.getTouchDistance(e.touches))}handleTouchMove(e){if(e.preventDefault(),e.touches.length===1&&this.isDragging){const[t,s]=this.getScreenCoords(e.touches[0].clientX,e.touches[0].clientY),n=t-this.lastX,o=s-this.lastY,[h,u]=this.getCanvasSize();this.viewState.pan(n,o,h,u),this.notifyChange(),this.lastX=t,this.lastY=s}else if(e.touches.length===2){const t=this.getTouchDistance(e.touches),s=this.getTouchCenter(e.touches);if(this.lastTouchDistance>0){const n=t/this.lastTouchDistance,o=U(n),[h,u]=this.getCanvasSize();this.viewState.zoomAt(s[0],s[1],o,h,u),this.notifyChange()}this.lastTouchDistance=t}}handleTouchEnd(){this.isDragging=!1,this.lastTouchDistance=0}handleKeyDown(e){if(!(e.target instanceof HTMLInputElement||e.target instanceof HTMLTextAreaElement))switch(e.key){case"+":case"=":e.preventDefault(),this.callbacks.onIterationAdjust?.(1);break;case"-":case"_":e.preventDefault(),this.callbacks.onIterationAdjust?.(-1);break;case"0":e.preventDefault(),this.callbacks.onIterationReset?.();break;case"c":e.preventDefault(),this.callbacks.onCosinePaletteCycle?.(1);break;case"C":e.preventDefault(),this.callbacks.onCosinePaletteCycle?.(-1);break;case"g":e.preventDefault(),this.callbacks.onGradientPaletteCycle?.(1);break;case"G":e.preventDefault(),this.callbacks.onGradientPaletteCycle?.(-1);break;case"[":case",":e.preventDefault(),this.callbacks.onColorOffsetAdjust?.(-.05);break;case"]":case".":e.preventDefault(),this.callbacks.onColorOffsetAdjust?.(.05);break;case"{":case"<":e.preventDefault(),this.callbacks.onColorOffsetAdjust?.(-.15);break;case"}":case">":e.preventDefault(),this.callbacks.onColorOffsetAdjust?.(.15);break;case"r":case"R":e.preventDefault(),this.callbacks.onColorOffsetReset?.();break;case"b":e.preventDefault(),this.callbacks.onBrightnessAdjust?.(1);break;case"B":e.preventDefault(),this.callbacks.onBrightnessAdjust?.(-1);break;case"d":e.preventDefault(),this.callbacks.onBrightnessReset?.();break;case"f":e.preventDefault(),!e.repeat&&this.fractalKeyHeld!=="f"&&(this.fractalKeyHeld="f",this.fractalLongPressTimeout=setTimeout(()=>{this.fractalKeyHeld==="f"&&(this.callbacks.onFractalCycleAnimate?.(1),this.fractalKeyHeld=null)},k.LONG_PRESS_THRESHOLD));break;case"F":e.preventDefault(),!e.repeat&&this.fractalKeyHeld!=="F"&&(this.fractalKeyHeld="F",this.fractalLongPressTimeout=setTimeout(()=>{this.fractalKeyHeld==="F"&&(this.callbacks.onFractalCycleAnimate?.(-1),this.fractalKeyHeld=null)},k.LONG_PRESS_THRESHOLD));break;case"j":case"J":e.preventDefault(),this.callbacks.onToggleJuliaMode?.();break;case"s":case"S":e.preventDefault(),this.callbacks.onShare?.();break;case"1":case"2":case"3":case"4":case"5":case"6":case"7":case"8":case"9":e.preventDefault(),!e.repeat&&this.locationKeyHeld!==e.key&&(this.locationKeyHeld=e.key,this.locationLongPressTimeout=setTimeout(()=>{this.locationKeyHeld===e.key&&(this.callbacks.onLocationAnimate?.(e.key),this.locationKeyHeld=null)},k.LONG_PRESS_THRESHOLD));break;case"h":case"H":e.preventDefault(),this.callbacks.onToggleHelp?.();break;case" ":e.preventDefault(),this.callbacks.onToggleScreenshotMode?.();break;case"t":case"T":e.preventDefault(),this.callbacks.onToggleTouristMode?.();break;case"p":e.preventDefault(),this.callbacks.onPostProcessPresetCycle?.(1);break;case"P":e.preventDefault(),this.callbacks.onPostProcessPresetCycle?.(-1);break;case"z":e.preventDefault(),e.repeat||this.startKeyboardZoom(1);break;case"Z":e.preventDefault(),e.repeat||this.startKeyboardZoom(-1);break}}handleKeyUp(e){if((e.key==="z"||e.key==="Z")&&this.stopKeyboardZoom(),e.key>="1"&&e.key<="9"&&this.locationKeyHeld===e.key&&(this.locationLongPressTimeout!==null&&(clearTimeout(this.locationLongPressTimeout),this.locationLongPressTimeout=null),this.callbacks.onLocationSelect?.(e.key),this.locationKeyHeld=null),(e.key==="f"||e.key==="F")&&this.fractalKeyHeld===e.key){this.fractalLongPressTimeout!==null&&(clearTimeout(this.fractalLongPressTimeout),this.fractalLongPressTimeout=null);const t=e.key==="f"?1:-1;this.callbacks.onFractalCycle?.(t),this.fractalKeyHeld=null}}startKeyboardZoom(e){this.keyboardZoomAnimationId!==null&&this.stopKeyboardZoom(),this.keyboardZoomDirection=e,this.keyboardZoomStartTime=performance.now(),this.keyboardZoomAnimationId=requestAnimationFrame(this.keyboardZoomLoop.bind(this))}stopKeyboardZoom(){this.keyboardZoomAnimationId!==null&&(cancelAnimationFrame(this.keyboardZoomAnimationId),this.keyboardZoomAnimationId=null),this.keyboardZoomDirection=null}keyboardZoomLoop(e){if(this.keyboardZoomDirection===null)return;const t=e-this.keyboardZoomStartTime;this.keyboardZoomStartTime=e;const n=this.keyboardZoomDirection*.7*(t/1e3),o=Math.exp(n),[h,u]=this.getCanvasSize();this.viewState.zoomAt(h/2,u/2,o,h,u),this.notifyChange(),this.keyboardZoomAnimationId=requestAnimationFrame(this.keyboardZoomLoop.bind(this))}destroy(){}};a(k,"LONG_PRESS_THRESHOLD",400);let F=k;var r=(i=>(i[i.Mandelbrot=0]="Mandelbrot",i[i.MandelbrotJulia=1]="MandelbrotJulia",i[i.BurningShip=2]="BurningShip",i[i.BurningShipJulia=3]="BurningShipJulia",i[i.Tricorn=4]="Tricorn",i[i.TricornJulia=5]="TricornJulia",i[i.Celtic=6]="Celtic",i[i.CelticJulia=7]="CelticJulia",i[i.Buffalo=8]="Buffalo",i[i.BuffaloJulia=9]="BuffaloJulia",i[i.Phoenix=10]="Phoenix",i[i.PhoenixJulia=11]="PhoenixJulia",i[i.Multibrot3=12]="Multibrot3",i[i.Multibrot3Julia=13]="Multibrot3Julia",i[i.Multibrot4=14]="Multibrot4",i[i.Multibrot4Julia=15]="Multibrot4Julia",i[i.Funky=16]="Funky",i[i.FunkyJulia=17]="FunkyJulia",i[i.Perpendicular=18]="Perpendicular",i[i.PerpendicularJulia=19]="PerpendicularJulia",i))(r||{});const ge={0:"Mandelbrot",1:"Mandelbrot Julia",2:"Burning Ship",3:"Burning Ship Julia",4:"Tricorn",5:"Tricorn Julia",6:"Celtic",7:"Celtic Julia",8:"Buffalo",9:"Buffalo Julia",10:"Phoenix",11:"Phoenix Julia",12:"Multibrot (z³)",13:"Multibrot³ Julia",14:"Multibrot (z⁴)",15:"Multibrot⁴ Julia",16:"Funky",17:"Funky Julia",18:"Perpendicular",19:"Perpendicular Julia"},z=10;function M(i){return(i&1)===1}function B(i){return i&-2}function be(i){return i|1}const m={TYPE:"t",CENTER_X:"x",CENTER_Y:"y",ZOOM:"z",PALETTE:"p",PALETTE_TYPE:"pt",COSINE_PALETTE:"cp",GRADIENT_PALETTE:"gp",COLOR_OFFSET:"o",JULIA_REAL:"jr",JULIA_IMAG:"ji",ITERATIONS:"i",AA:"aa"};function C(i,e=15){return i===0?"0":Math.abs(i)<1e-10||Math.abs(i)>1e10?i.toExponential(e):parseFloat(i.toPrecision(e)).toString()}function T(i){if(i===null||i==="")return null;const e=parseFloat(i);return isNaN(e)?null:e}function oe(i){const e=new URLSearchParams;return e.set(m.TYPE,i.fractalType.toString()),e.set(m.CENTER_X,C(i.centerX)),e.set(m.CENTER_Y,C(i.centerY)),e.set(m.ZOOM,C(i.zoom)),e.set(m.PALETTE_TYPE,i.paletteType==="cosine"?"c":"g"),e.set(m.COSINE_PALETTE,i.cosinePaletteIndex.toString()),e.set(m.GRADIENT_PALETTE,i.gradientPaletteIndex.toString()),Math.abs(i.colorOffset)>.001&&e.set(m.COLOR_OFFSET,C(i.colorOffset,4)),M(i.fractalType)&&(e.set(m.JULIA_REAL,C(i.juliaC[0])),e.set(m.JULIA_IMAG,C(i.juliaC[1]))),i.maxIterationsOverride!==null&&e.set(m.ITERATIONS,i.maxIterationsOverride.toString()),i.aaEnabled&&e.set(m.AA,"1"),e.toString()}function ye(i){const e=new URLSearchParams(i.replace(/^#/,"")),t={},s=T(e.get(m.TYPE));s!==null&&s>=0&&s<=19&&(t.fractalType=s);const n=T(e.get(m.CENTER_X));n!==null&&(t.centerX=n);const o=T(e.get(m.CENTER_Y));o!==null&&(t.centerY=o);const h=T(e.get(m.ZOOM));h!==null&&h>0&&(t.zoom=h);const u=e.get(m.PALETTE_TYPE);(u==="c"||u==="g")&&(t.paletteType=u==="c"?"cosine":"gradient");const f=T(e.get(m.COSINE_PALETTE));f!==null&&f>=0&&(t.cosinePaletteIndex=Math.floor(f));const l=T(e.get(m.GRADIENT_PALETTE));l!==null&&l>=0&&(t.gradientPaletteIndex=Math.floor(l));const p=T(e.get(m.PALETTE));p!==null&&p>=0&&p<=11&&(t.paletteIndex=Math.floor(p));const b=T(e.get(m.COLOR_OFFSET));b!==null&&(t.colorOffset=b);const y=T(e.get(m.JULIA_REAL)),d=T(e.get(m.JULIA_IMAG));y!==null&&d!==null&&(t.juliaC=[y,d]);const g=T(e.get(m.ITERATIONS));return g!==null&&g>0&&(t.maxIterationsOverride=Math.floor(g)),e.get(m.AA)==="1"&&(t.aaEnabled=!0),t}function ve(i){const e=oe(i),t=new URL(window.location.href);return t.hash=e,t.toString()}function xe(i){const e=oe(i);window.history.replaceState(null,"","#"+e)}function Te(){return ye(window.location.hash)}async function Pe(i){const e=ve(i);try{return await navigator.clipboard.writeText(e),!0}catch{const t=document.createElement("textarea");t.value=e,t.style.position="fixed",t.style.left="-9999px",document.body.appendChild(t),t.select();try{return document.execCommand("copy"),!0}catch{return!1}finally{document.body.removeChild(t)}}}function c(i,e,t,s,n,o,h,u={}){return{name:i,description:e,key:t,state:{fractalType:s,centerX:n,centerY:o,zoom:h,paletteType:u.paletteType??"cosine",cosinePaletteIndex:u.cosinePaletteIndex??1,gradientPaletteIndex:u.gradientPaletteIndex??0,colorOffset:u.colorOffset??0,juliaC:u.juliaC??[-.7,.27015],maxIterationsOverride:u.maxIterationsOverride??null,aaEnabled:!1}}}const Ie=[c("Mandelbrot","The famous Mandelbrot set","1",r.Mandelbrot,-.5,0,.4),c("Seahorse Valley","The iconic seahorse-shaped spirals","2",r.Mandelbrot,-.7581249305506096,.11244273987387937,36.41989684959737,{cosinePaletteIndex:5,colorOffset:.05}),c("Elephant Valley","Elephant trunk-like spirals on the positive real side","3",r.Mandelbrot,.2746341335933571,.0066936145282295205,212.15493874953236,{cosinePaletteIndex:3,colorOffset:-.1}),c("Double Spiral Valley","Beautiful double spirals deep in the set","4",r.Mandelbrot,-.743733589978665,.130905227502858,350,{cosinePaletteIndex:5,colorOffset:.15}),c("Spiral Galaxy","Galactic spiral arms emerging from chaos","5",r.Mandelbrot,-.7615484049386866,-.08478444765887823,1506.4927460380957,{cosinePaletteIndex:4,colorOffset:.05}),c("Douady Rabbit","The famous rabbit-eared Julia set","6",r.MandelbrotJulia,0,0,.6,{cosinePaletteIndex:4,colorOffset:.2,juliaC:[-.123,.745]}),c("Dragon Julia","Fierce dragon-like Julia set","7",r.MandelbrotJulia,0,0,.45,{cosinePaletteIndex:3,colorOffset:-.5,juliaC:[-.8,.156]}),c("Spiral Julia","Delicate spiral arms from the main cardioid edge","8",r.MandelbrotJulia,0,0,.5,{cosinePaletteIndex:8,colorOffset:.65,juliaC:[-.75,.11]}),c("Dendrite Julia","Tree-like branching structure on the real axis","9",r.MandelbrotJulia,0,0,.41791083585808675,{cosinePaletteIndex:5,colorOffset:.1,juliaC:[.285,.01]})],Se=[c("Main Ship","The iconic burning ship silhouette","1",r.BurningShip,-.6819541375872399,.5906040268456356,.4,{cosinePaletteIndex:4,colorOffset:.3}),c("The Armada","Mini ships along the antenna","2",r.BurningShip,-1.80173025652805,.0153452534367207,9,{cosinePaletteIndex:4,colorOffset:.2}),c("Bow Detail","Intricate patterns at the ship's bow","3",r.BurningShip,-1.7500929615866607,.0368035491770765,10,{cosinePaletteIndex:10,colorOffset:.1}),c("Bacteria Worm","Worm-like structures with mosaic patterns","4",r.BurningShipJulia,0,0,.3,{cosinePaletteIndex:10,colorOffset:-.55,juliaC:[.5179709888623353,.8057669844188748]}),c("Wispy Coils","Wispy coils near the bulbous extrusion from the ship","5",r.BurningShipJulia,0,0,.4,{cosinePaletteIndex:4,colorOffset:.35,juliaC:[.2525994076160102,.0006358222328731386]}),c("Space Brain","Brain-like structures from the bottom of the ship","6",r.BurningShipJulia,0,0,.7,{cosinePaletteIndex:5,colorOffset:.3,juliaC:[-1.059944784917394,-.033218825489255054]}),c("Spiral Patterns","Spiral patterns near the bulbous extrusion","7",r.BurningShipJulia,0,0,.41,{cosinePaletteIndex:11,colorOffset:.55,juliaC:[.28292507376881926,-.007597008191683113]}),c("Detailed Patterns","Beautiful detailed patterns near the bottom of the ship","8",r.BurningShipJulia,0,0,.5,{cosinePaletteIndex:2,colorOffset:.6,juliaC:[-.3967192382583807,-.09102348993288789]})],Me=[c("Tricorn","The main tricorn shape with its distinctive three-cornered symmetry","1",r.Tricorn,-.1343398614022916,-.07051105375213641,.24,{cosinePaletteIndex:11,colorOffset:-.45}),c("Skewed Mandelbrot","Skewed Mandelbrot from one of the main bulbs","2",r.Tricorn,-1.0683098234816064,.13055543771605108,722.5553792774821,{cosinePaletteIndex:5,colorOffset:.1}),c("Lightning Bolts","Lightning bolt-like patterns near the main cardioid edge","3",r.TricornJulia,0,0,.5,{cosinePaletteIndex:5,colorOffset:.2,juliaC:[-.7092474160797806,-.113024316756254]}),c("Water Lily Leaf","Leaf-like structures from the center of the edge of the main cardioid","4",r.TricornJulia,0,0,.43,{colorOffset:-.7,juliaC:[-.1254330794660274,.2407433439223678]}),c("Lightning Brain","Brain-like structures","5",r.TricornJulia,0,0,3.15,{cosinePaletteIndex:5,juliaC:[.8748878776979363,-1.515483485507111]}),c("Spiral Mosaic","Mosaic patterns from the base of one of the main bulbs","6",r.TricornJulia,0,0,.5,{cosinePaletteIndex:11,colorOffset:.55,juliaC:[-.5647012802389192,-.06508603367125808]}),c("Electric Tendrils","Electric tendril patterns with bright highlights","7",r.TricornJulia,0,0,.5,{cosinePaletteIndex:4,colorOffset:.05,juliaC:[-.511125124692869,.0500484416152959]})],we=[c("Celtic Knot","The main Celtic fractal shape","1",r.Celtic,-.5,0,.25,{cosinePaletteIndex:10,colorOffset:.05}),c("Celtic Detail","Intricate knotwork patterns","2",r.Celtic,-.7803221774980102,.1635662989215261,120,{cosinePaletteIndex:10,colorOffset:.25,maxIterationsOverride:1e4}),c("Leafy Spirals","Symmetric shapes from the tip of the celtic shape","3",r.CelticJulia,0,0,.55,{cosinePaletteIndex:7,colorOffset:.1,juliaC:[.25345198072532704,.0001580704105713714]}),c("Tendrils","Tendrils emerging from fog","4",r.CelticJulia,-.1649932591722856,-.033582161161888655,.28,{cosinePaletteIndex:5,juliaC:[-.4530201342281876,-.8993288590604025]}),c("Electric Buzz","Electric patterns with uniform patterned regions","5",r.CelticJulia,.2,-.3,.55,{colorOffset:.2,juliaC:[-.6378073937333775,1.2082886796996293]}),c("Intricate Patterns","Knotwork patterns with intricate details","6",r.CelticJulia,0,0,.52,{cosinePaletteIndex:10,colorOffset:.3,juliaC:[-.7610237673309276,.12050023730653406]}),c("Petri Dish","Bacteria-like patterns that spread outwards","7",r.CelticJulia,0,0,.55,{cosinePaletteIndex:10,colorOffset:.45,juliaC:[-1.056655765809614,-.16855216053399263]})],Ce=[c("Buffalo Overview","The distinctive Buffalo fractal shape","1",r.Buffalo,-.7,.6,.4,{cosinePaletteIndex:2,colorOffset:.45}),c("Overgrown Cities","Tree or cathedral-like structures emerging from real axis","2",r.Buffalo,-1.75,.13,2.4,{colorOffset:0}),c("Industrial Snowflake","Snowflake-like patterns with industrial structures woven in","3",r.BuffaloJulia,.45,0,.85,{cosinePaletteIndex:4,colorOffset:-.1,juliaC:[-1.62727125821226,.00873720402364775]}),c("Plasma Bursts","Plasma-like bursts of color","4",r.BuffaloJulia,0,0,.5,{cosinePaletteIndex:8,colorOffset:-.75,juliaC:[.2745030250648227,.1797320656871218]}),c("Intricate Patterns","Intricate patterns near the bottom of the main shape","5",r.BuffaloJulia,0,0,.5,{cosinePaletteIndex:4,colorOffset:.25,juliaC:[-.5828307625231954,-.3049842077590671]}),c("Seed Pods","Spirals bursting with seeds","6",r.BuffaloJulia,0,0,.6,{cosinePaletteIndex:3,colorOffset:-.75,juliaC:[.3056228373702423,-.007698961937716242]})],ze=[c("Phoenix Overview","The Phoenix parameter space","1",r.Phoenix,-.15,-.7,.25,{cosinePaletteIndex:5,colorOffset:-.65}),c("Classic Phoenix Julia","The iconic feathery Phoenix fractal","2",r.PhoenixJulia,0,0,.5,{cosinePaletteIndex:2,colorOffset:.45,juliaC:[-.5,.5667],maxIterationsOverride:1152}),c("Phoenix Feathers","Detailed feather-like structures","3",r.PhoenixJulia,.38,.07,3.4,{cosinePaletteIndex:5,juliaC:[-.5,.5667]}),c("Golden Weaves","Bright golden patterns with intricate weaves","4",r.PhoenixJulia,0,.08,.4,{cosinePaletteIndex:2,colorOffset:.35,juliaC:[.656142759731905,.0353380147311402]}),c("Fiery Phoenix","Fiery wings spreading outwards","5",r.PhoenixJulia,0,-.03,.6,{cosinePaletteIndex:4,colorOffset:-.7,juliaC:[-.272349453272398,.4059142585519806]})],ke=[c("Multibrot³ Overview","The three-fold symmetric z³ Multibrot","1",r.Multibrot3,0,0,.35,{cosinePaletteIndex:5,colorOffset:.35}),c("The Bulb","A bulbous extrusion from the main shape","2",r.Multibrot3,.5852686308492299,.27,6,{colorOffset:.1}),c("Three-fold Spirals","Bright pearly spirals with three-fold symmetry","3",r.Multibrot3Julia,0,0,.4,{cosinePaletteIndex:10,colorOffset:.15,juliaC:[.5448826747676219,.26362559338015445]}),c("Multibrot³ Julia","A Julia set with three-fold symmetry","4",r.Multibrot3Julia,0,0,.434,{cosinePaletteIndex:5,colorOffset:.1,juliaC:[-.45963436785036077,.03389484474578987]}),c("Double Elephant Valley","Two elephants in each group","5",r.Multibrot3,.42814685603247177,.012748071569601296,77,{cosinePaletteIndex:3,colorOffset:0}),c("Wonky Spiral","Wonky spiral Julia structure from inside the main set","6",r.Multibrot3Julia,.3695408370900379,.3371264555793177,2.274691481464049,{cosinePaletteIndex:0,colorOffset:0,juliaC:[.5277614770068884,.15853942850341446],maxIterationsOverride:2124}),c("Spiral Galaxies","The wonky spiral Julia structure viewed as galaxies","7",r.Multibrot3Julia,0,0,.4,{paletteType:"gradient",juliaC:[.5277614770068884,.15853942850341446],maxIterationsOverride:1152})],Be=[c("Multibrot⁴ Overview","The four-fold symmetric z⁴ Multibrot","1",r.Multibrot4,0,0,.4,{cosinePaletteIndex:5,colorOffset:0}),c("Atomic Spirals","Structures resembling atomic orbitals with spiral patterns","2",r.Multibrot4Julia,0,-0,.35,{cosinePaletteIndex:5,colorOffset:.4,juliaC:[-.7878865573262246,.02073442187254452]}),c("Triple Elephant Valley","Now there's three elephants in each group!","3",r.Multibrot4,-.2726362830546699,.44295218397589975,42,{cosinePaletteIndex:3}),c("Starscape","Spiraling galaxies surrounding a black hole","4",r.Multibrot4Julia,0,0,.5,{paletteType:"gradient",juliaC:[.634977850702787,.194816172925824],maxIterationsOverride:1152}),c("Static Burst","Burst of electricity","5",r.Multibrot4Julia,0,0,.4,{colorOffset:-.75,juliaC:[-.6179887054490777,.487166930716755]})],Oe=[c("Funky Overview","The wonderfully weird Funky fractal","1",r.Funky,-.5,0,.35,{cosinePaletteIndex:4,colorOffset:.25}),c("Tulip Bulb","Extrusions resembling tulips near the top of the main shape","2",r.Funky,.303,.534,6.3,{cosinePaletteIndex:10}),c("Battleship","Spaceship-like structure with double turrets all around","3",r.FunkyJulia,0,0,.45,{cosinePaletteIndex:4,colorOffset:-.7,juliaC:[-1.02568231965141,.128286053018475]}),c("Frog Crab","Crablike structure with brain-like spiral patterns within it","4",r.FunkyJulia,0,0,.37,{colorOffset:.1,juliaC:[.30191025227457674,.5253550579235958]}),c("Spiral Details","Beautiful spiral details without too much clutter","5",r.FunkyJulia,-.2,0,.4,{cosinePaletteIndex:5,colorOffset:.6,juliaC:[-.06404194046216194,.662960137583706]}),c("Migrating Birds","Bird-like shapes flying in formation","6",r.FunkyJulia,.34,0,.35,{cosinePaletteIndex:5,colorOffset:.4,juliaC:[.5804003550040334,-.9094296635818582]}),c("Glittering Coral","Brightly gleaming coral-like structures","7",r.FunkyJulia,0,0,.5,{cosinePaletteIndex:11,colorOffset:-.4,juliaC:[-.45427582797825017,-.06920415224913506]})],Ae=[c("Perpendicular Overview","The Perpendicular Mandelbrot variant","1",r.Perpendicular,-.5,0,.32,{cosinePaletteIndex:2,colorOffset:0}),c("Seed Pod","A pod-like structure near the head of the main shape","2",r.Perpendicular,-.7734996631118647,.12393043736115505,250,{cosinePaletteIndex:5}),c("Bird of Prey","Waveform bird flying out to get you","3",r.PerpendicularJulia,0,0,.35,{cosinePaletteIndex:4,colorOffset:.15,juliaC:[-1.2870593206662457,.022288689289989876]}),c("Old Dragon","Bird-like shape with leathery frayed wings","4",r.PerpendicularJulia,0,0,.3913248754208607,{cosinePaletteIndex:5,colorOffset:.45,juliaC:[-1.0197782349577895,-.13982096184940793]}),c("Peacock Eyes","Glowing eyes of a brightly coloured peacock","5",r.PerpendicularJulia,0,-.8821542839734092,2.8,{cosinePaletteIndex:11,juliaC:[.25987719401314263,-.17615047146201984]}),c("Mask of the Ancients","A detailed mask with intricate patterns","6",r.PerpendicularJulia,0,0,.42,{cosinePaletteIndex:2,colorOffset:-.1,juliaC:[.3021983882651174,.4025604479726435]})],re=new Map([[r.Mandelbrot,Ie],[r.BurningShip,Se],[r.Tricorn,Me],[r.Celtic,we],[r.Buffalo,Ce],[r.Phoenix,ze],[r.Multibrot3,ke],[r.Multibrot4,Be],[r.Funky,Oe],[r.Perpendicular,Ae]]);function E(i,e){const t=B(e),s=re.get(t);if(s)return s.find(n=>n.key===i)}function Ee(i){const e=B(i);return re.get(e)??[]}const N=[{name:"Rainbow",isMonotonic:!1,params:{type:"cosine",a:[.5,.5,.5],b:[.5,.5,.5],c:[1,1,1],d:[0,.33,.67]}},{name:"Fire",isMonotonic:!1,params:{type:"cosine",a:[.5,.5,.5],b:[.5,.5,.5],c:[1,1,.5],d:[0,.1,.2]}},{name:"Ice",isMonotonic:!1,params:{type:"cosine",a:[.5,.5,.5],b:[.5,.5,.5],c:[1,.7,.4],d:[0,.15,.2]}},{name:"Sunset",isMonotonic:!1,params:{type:"cosine",a:[.5,.3,.2],b:[.5,.4,.3],c:[1,1,.5],d:[0,.1,.2]}},{name:"Electric",isMonotonic:!1,params:{type:"cosine",a:[.5,.5,.5],b:[.6,.6,.6],c:[1,1,1],d:[.3,.2,.2]}},{name:"Neon",isMonotonic:!1,params:{type:"cosine",a:[.5,.5,.5],b:[.5,.5,.5],c:[1,1,1],d:[0,.1,.2]}},{name:"Emerald",isMonotonic:!1,params:{type:"cosine",a:[.2,.5,.3],b:[.3,.5,.3],c:[1,1,1],d:[0,.25,.5]}},{name:"Candy",isMonotonic:!1,params:{type:"cosine",a:[.8,.5,.5],b:[.2,.4,.4],c:[1,1,2],d:[0,.25,.25]}},{name:"Plasma",isMonotonic:!1,params:{type:"cosine",a:[.5,.5,.5],b:[.5,.5,.5],c:[2,1,0],d:[.5,.2,.25]}},{name:"Peacock",isMonotonic:!1,params:{type:"cosine",a:[.3,.5,.5],b:[.4,.4,.3],c:[1,1,1],d:[0,.1,.35]}},{name:"Autumn",isMonotonic:!1,params:{type:"cosine",a:[.6,.4,.2],b:[.4,.3,.2],c:[1,1,1],d:[0,.05,.1]}},{name:"Aurora",isMonotonic:!1,params:{type:"cosine",a:[.3,.5,.5],b:[.5,.5,.5],c:[1,1,.5],d:[.8,.9,.3]}}],P=N.length,G=[{name:"Blue",isMonotonic:!0,params:{type:"gradient",c1:[.02,.01,.08],c2:[.05,.15,.25],c3:[.1,.4,.5],c4:[.3,.6,.8],c5:[.7,.9,1]},hdrParams:{type:"gradient",c1:[.2,.4,1],c2:[.3,.6,1],c3:[.4,.8,1],c4:[.6,.9,1],c5:[.85,1,1]}},{name:"Gold",isMonotonic:!0,params:{type:"gradient",c1:[.04,.02,.01],c2:[.2,.08,.02],c3:[.5,.25,.05],c4:[.85,.6,.2],c5:[1,.95,.7]},hdrParams:{type:"gradient",c1:[1,.5,.1],c2:[1,.65,.2],c3:[1,.8,.3],c4:[1,.9,.5],c5:[1,1,.8]}},{name:"Grayscale",isMonotonic:!0,params:{type:"gradient",c1:[.01,.01,.03],c2:[.15,.15,.17],c3:[.45,.45,.45],c4:[.75,.74,.72],c5:[1,.98,.95]},hdrParams:{type:"gradient",c1:[1,1,1],c2:[1,1,1],c3:[1,1,1],c4:[1,1,1],c5:[1,1,1]}},{name:"Sepia",isMonotonic:!0,params:{type:"gradient",c1:[.03,.02,.01],c2:[.15,.08,.03],c3:[.4,.25,.12],c4:[.7,.55,.35],c5:[1,.95,.85]},hdrParams:{type:"gradient",c1:[1,.7,.4],c2:[1,.8,.55],c3:[1,.88,.7],c4:[1,.95,.85],c5:[1,1,.95]}},{name:"Ocean",isMonotonic:!0,params:{type:"gradient",c1:[0,.02,.05],c2:[.02,.08,.2],c3:[.05,.3,.4],c4:[.2,.6,.6],c5:[.6,.95,.9]},hdrParams:{type:"gradient",c1:[.1,.8,.8],c2:[.2,.9,.85],c3:[.4,.95,.9],c4:[.65,1,.95],c5:[.85,1,1]}},{name:"Purple",isMonotonic:!0,params:{type:"gradient",c1:[.03,.01,.06],c2:[.15,.05,.25],c3:[.4,.15,.5],c4:[.7,.4,.75],c5:[.95,.8,1]},hdrParams:{type:"gradient",c1:[.8,.2,1],c2:[.85,.4,1],c3:[.9,.6,1],c4:[.95,.8,1],c5:[1,.95,1]}},{name:"Forest",isMonotonic:!0,params:{type:"gradient",c1:[.02,.03,.01],c2:[.05,.12,.04],c3:[.1,.35,.15],c4:[.3,.65,.3],c5:[.7,.95,.6]},hdrParams:{type:"gradient",c1:[.3,1,.2],c2:[.5,1,.4],c3:[.7,1,.55],c4:[.85,1,.75],c5:[.95,1,.9]}}],I=G.length;function le(i){return N[i%P].params}function ce(i,e){const t=G[i%I];return e&&t.hdrParams?t.hdrParams:t.params}function Re(i){return N[i%P]}function _e(i){return G[i%I]}function Le(i){return N[i%P].name}function De(i){return G[i%I].name}function V(i){const e=M(i),t=i>>1;let s;switch(t){case 0:s={juliaBlend:0,preAbsRe:0,preAbsIm:0,preNegIm:0,postAbsRe:0,postAbsIm:0,postNegIm:0};break;case 1:s={juliaBlend:0,preAbsRe:1,preAbsIm:1,preNegIm:1,postAbsRe:0,postAbsIm:0,postNegIm:0};break;case 2:s={juliaBlend:0,preAbsRe:0,preAbsIm:0,preNegIm:0,postAbsRe:0,postAbsIm:0,postNegIm:1};break;case 3:s={juliaBlend:0,preAbsRe:0,preAbsIm:0,preNegIm:0,postAbsRe:1,postAbsIm:0,postNegIm:0};break;case 4:s={juliaBlend:0,preAbsRe:0,preAbsIm:0,preNegIm:0,postAbsRe:1,postAbsIm:1,postNegIm:1};break;case 5:return null;case 6:return null;case 7:return null;case 8:s={juliaBlend:0,preAbsRe:0,preAbsIm:1,preNegIm:0,postAbsRe:0,postAbsIm:0,postNegIm:0};break;case 9:s={juliaBlend:0,preAbsRe:1,preAbsIm:0,preNegIm:0,postAbsRe:0,postAbsIm:0,postNegIm:1};break;default:return null}return s.juliaBlend=e?1:0,s}function S(i,e,t){return i+(e-i)*t}function Ne(i,e,t){return{juliaBlend:S(i.juliaBlend,e.juliaBlend,t),preAbsRe:S(i.preAbsRe,e.preAbsRe,t),preAbsIm:S(i.preAbsIm,e.preAbsIm,t),preNegIm:S(i.preNegIm,e.preNegIm,t),postAbsRe:S(i.postAbsRe,e.postAbsRe,t),postAbsIm:S(i.postAbsIm,e.postAbsIm,t),postNegIm:S(i.postNegIm,e.postNegIm,t)}}const Ge=3e3,X=3e3,Ue=8e3,Fe=2e3,q=.5,je=.25,$=2,K=.6,Z=.5;function Je(i,e,t){if(i<$&&e<$)return j(i,e,t);const s=Math.min(i,e),n=Math.max(Z,s*(1-K)+Z*K);if(n>=s)return j(i,e,t);const o=Math.log(i),h=Math.log(e),u=Math.log(n),f=1-t,l=f*f*o+2*f*t*u+t*t*h;return Math.exp(l)}function W(i){return i<.5?4*i*i*i:1-Math.pow(-2*i+2,3)/2}function x(i,e,t){return i+(e-i)*t}function v(i,e,t){return[x(i[0],e[0],t),x(i[1],e[1],t),x(i[2],e[2],t)]}function He(i){return i.paletteType==="cosine"?le(i.cosinePaletteIndex):ce(i.gradientPaletteIndex,!1)}function Ye(i,e,t){if(i.type==="cosine"&&e.type==="cosine")return{type:"cosine",a:v(i.a,e.a,t),b:v(i.b,e.b,t),c:v(i.c,e.c,t),d:v(i.d,e.d,t)};if(i.type==="gradient"&&e.type==="gradient")return{type:"gradient",c1:v(i.c1,e.c1,t),c2:v(i.c2,e.c2,t),c3:v(i.c3,e.c3,t),c4:v(i.c4,e.c4,t),c5:v(i.c5,e.c5,t)};if(t<.5)if(i.type==="cosine"){const s=t*2;return{type:"cosine",a:v(i.a,[.5,.5,.5],s*.3),b:v(i.b,[.3,.3,.3],s*.3),c:i.c,d:i.d}}else return i;else if(e.type==="cosine"){const s=(t-.5)*2;return{type:"cosine",a:v([.5,.5,.5],e.a,s),b:v([.3,.3,.3],e.b,s),c:e.c,d:e.d}}else return e}function j(i,e,t){const s=Math.log(i),n=Math.log(e);return Math.exp(x(s,n,t))}function Q(i,e,t,s,n){const o=Math.sqrt(i*i+e*e),h=Math.sqrt(t*t+s*s);let u=Math.atan2(e,i),f=Math.atan2(s,t);const l=.01;if(o<l&&h<l)return[x(i,t,n),x(e,s,n)];if(o<l)return[x(0,t,n),x(0,s,n)];if(h<l)return[x(i,0,n),x(e,0,n)];let p=f-u;p>Math.PI?p-=2*Math.PI:p<-Math.PI&&(p+=2*Math.PI);const b=u+p*n,y=x(o,h,n);return[y*Math.cos(b),y*Math.sin(b)]}class R{constructor(e,t){a(this,"active",!1);a(this,"state",{type:"idle"});a(this,"animationFrameId",null);a(this,"callbacks");a(this,"currentTarget");a(this,"visitedLocations",new Set);a(this,"tick",e=>{this.active&&(this.updateAnimation(e),this.animationFrameId=requestAnimationFrame(this.tick))});this.callbacks=e,this.currentTarget=this.bookmarkToTarget(t)}bookmarkToTarget(e){return{centerX:e.centerX,centerY:e.centerY,zoom:e.zoom,fractalType:e.fractalType,paletteType:e.paletteType,cosinePaletteIndex:e.cosinePaletteIndex,gradientPaletteIndex:e.gradientPaletteIndex,paletteParams:He(e),colorOffset:e.colorOffset,juliaC:e.juliaC,blendParams:V(e.fractalType)}}start(e){this.active||(this.active=!0,this.currentTarget=this.bookmarkToTarget(e),this.visitedLocations.clear(),this.state={type:"paused",startTime:performance.now(),duration:1e3},this.animationFrameId=requestAnimationFrame(this.tick),console.log("🚀 Tourist mode started"))}stop(){this.active&&(this.active=!1,this.state={type:"idle"},this.animationFrameId!==null&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null),console.log("🛑 Tourist mode stopped"))}isActive(){return this.active}updateCurrentState(e){this.currentTarget=this.bookmarkToTarget(e)}animateToLocation(e,t){this.animationFrameId!==null&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null),this.active=!0,this.currentTarget=this.bookmarkToTarget(t),this.transitionTo(e,!0),this.animationFrameId=requestAnimationFrame(this.tick),console.log(`🎯 Animating to: ${e.name}`)}updateAnimation(e){switch(this.state.type){case"idle":this.pickNextDestination();break;case"paused":e-this.state.startTime>=this.state.duration&&this.pickNextDestination();break;case"transitioning":{const t=e-this.state.startTime,s=Math.min(1,t/this.state.duration),n=W(s),o=Q(this.state.from.juliaC[0],this.state.from.juliaC[1],this.state.to.juliaC[0],this.state.to.juliaC[1],n),h=this.state.from.zoom,u=this.state.to.zoom,f=Je(h,u,s),[l,p]=Q(this.state.from.centerX,this.state.from.centerY,this.state.to.centerX,this.state.to.centerY,n),b=Ye(this.state.from.paletteParams,this.state.to.paletteParams,n);let y=null;const d=this.state.from.blendParams,g=this.state.to.blendParams;d&&g?y=Ne(d,g,n):s>=.5&&g?y=g:s<.5&&d&&(y=d);const w={centerX:l,centerY:p,zoom:f,fractalType:this.state.to.fractalType,paletteType:this.state.to.paletteType,cosinePaletteIndex:this.state.to.cosinePaletteIndex,gradientPaletteIndex:this.state.to.gradientPaletteIndex,colorOffset:x(this.state.from.colorOffset,this.state.to.colorOffset,n),juliaC:o};this.currentTarget={...this.state.to,centerX:l,centerY:p,zoom:f,paletteParams:b,colorOffset:w.colorOffset,juliaC:o,blendParams:y},this.callbacks.onUpdate(w,b,y),this.callbacks.onRender(),s>=1&&(this.callbacks.onClearInterpolation(),this.state.singleTransition?(this.active=!1,this.state={type:"idle"},this.animationFrameId!==null&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null),console.log("🎯 Single transition complete")):this.state={type:"paused",startTime:e,duration:Ge});break}case"zoomingOut":{const t=e-this.state.startTime,s=Math.min(1,t/this.state.duration),n=W(s),o=j(this.state.from.zoom,this.state.targetZoom,n),h={centerX:this.state.from.centerX,centerY:this.state.from.centerY,zoom:o};this.currentTarget={...this.currentTarget,zoom:o},this.callbacks.onUpdate(h),this.callbacks.onClearInterpolation(),this.callbacks.onRender(),s>=1&&(this.currentTarget.fractalType=this.state.nextFractalType,this.currentTarget.blendParams=V(this.state.nextFractalType),this.callbacks.onUpdate({fractalType:this.state.nextFractalType}),this.callbacks.onClearInterpolation(),this.visitedLocations.clear(),this.pickDestinationForCurrentFractal());break}}}pickNextDestination(){Math.random()<je?this.initiateFractalSwitch():this.pickDestinationForCurrentFractal()}initiateFractalSwitch(){const t=B(this.currentTarget.fractalType)>>1;let s=Math.floor(Math.random()*z);s===t&&(s=(s+1)%z);const n=s<<1;if(this.currentTarget.zoom<=q*1.5){this.currentTarget.fractalType=n,this.callbacks.onUpdate({fractalType:n}),this.visitedLocations.clear(),this.pickDestinationForCurrentFractal();return}this.state={type:"zoomingOut",startTime:performance.now(),duration:Fe,from:{...this.currentTarget},targetZoom:q,nextFractalType:n}}pickDestinationForCurrentFractal(){const e=Ee(this.currentTarget.fractalType);if(e.length===0){this.currentTarget.fractalType=r.Mandelbrot,this.callbacks.onUpdate({fractalType:r.Mandelbrot}),this.pickDestinationForCurrentFractal();return}let t=e.filter(n=>!this.visitedLocations.has(this.getLocationKey(n)));t.length===0&&(this.visitedLocations.clear(),t=e);const s=t[Math.floor(Math.random()*t.length)];this.transitionTo(s)}getLocationKey(e){return`${e.state.fractalType}-${e.key}`}transitionTo(e,t=!1){const s=this.bookmarkToTarget(e.state),n=Math.abs(Math.log(s.zoom)-Math.log(this.currentTarget.zoom)),o=Math.sqrt(Math.pow(s.centerX-this.currentTarget.centerX,2)+Math.pow(s.centerY-this.currentTarget.centerY,2)),h=Math.min(Ue,Math.max(X,X+n*500+o*2e3)),u=this.getLocationKey(e);this.visitedLocations.add(u),this.callbacks.onLocationNotification?.(e.name,e.description),this.state={type:"transitioning",startTime:performance.now(),duration:h,from:{...this.currentTarget},to:s,singleTransition:t}}}class Ve{constructor(e){a(this,"element");a(this,"visible",!0);this.element=document.createElement("div"),this.element.id="zoom-debug",e.appendChild(this.element)}update(e){if(!this.visible)return;const t=e.zoom,s=t>=1e6?t.toExponential(2):t<1?t.toPrecision(4):String(Math.round(t)),n=e.isManualIterations?" (manual)":"",o=e.hdrEnabled?Math.abs(e.hdrBrightnessBias)>.01?`HDR (${e.hdrBrightnessBias>0?"+":""}${e.hdrBrightnessBias.toFixed(2)})`:"HDR":e.displaySupportsHDR?"HDR available":"SDR",h=!e.hdrEnabled&&e.paletteType==="gradient"&&Math.abs(e.sdrGradientBrightness-1)>.01?`brightness ${e.sdrGradientBrightness.toFixed(1)}`:"",u=e.juliaPickerMode?"🎯 Pick Julia point":"",f=e.isJulia?`c=(${e.juliaC[0].toFixed(4)}, ${e.juliaC[1].toFixed(4)})`:"",l=Math.abs(e.colorOffset)>.001?`offset ${e.colorOffset.toFixed(1)}`:"",p=[e.fractalName,`zoom ${s}`,`iterations ${e.maxIterations}${n}`,e.paletteName];l&&p.push(l),h&&p.push(h),f&&p.push(f),p.push(o),u&&p.push(u),e.postProcessPreset&&p.push(`FX: ${e.postProcessPreset}`),p.push("H = help"),this.element.textContent=p.join("  ·  ")}show(){this.visible=!0,this.element.style.display="block"}hide(){this.visible=!1,this.element.style.display="none"}destroy(){this.element.remove()}}class Xe{constructor(e){a(this,"element");a(this,"frameCount",0);a(this,"fps",0);a(this,"lastUpdate",0);a(this,"updateInterval",500);a(this,"visible",!0);this.element=document.createElement("div"),this.element.id="fps-overlay",this.element.textContent="-- FPS",e.appendChild(this.element)}tick(e){this.frameCount++,e-this.lastUpdate>=this.updateInterval&&(this.fps=Math.round(this.frameCount*1e3/(e-this.lastUpdate)),this.frameCount=0,this.lastUpdate=e,this.visible&&(this.element.textContent=`${this.fps} FPS`))}getFPS(){return this.fps}show(){this.visible=!0,this.element.style.display="block"}hide(){this.visible=!1,this.element.style.display="none"}destroy(){this.element.remove()}}class qe{constructor(e){a(this,"element");a(this,"visible",!1);this.element=document.createElement("div"),this.element.id="help-overlay",this.element.innerHTML=this.createContent(),e.appendChild(this.element)}toggle(){return this.visible=!this.visible,this.element.classList.toggle("visible",this.visible),this.visible}show(){this.visible=!0,this.element.classList.add("visible")}hide(){this.visible=!1,this.element.classList.remove("visible")}isVisible(){return this.visible}createContent(){return`
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
    `}destroy(){this.element.remove()}}class $e{constructor(e){a(this,"element");a(this,"timeoutId",null);this.element=document.createElement("div"),this.element.id="share-notification",e.appendChild(this.element)}show(e,t={}){const{color:s="#4ade80",duration:n=2e3,html:o=!1}=t;this.timeoutId!==null&&clearTimeout(this.timeoutId),o?this.element.innerHTML=e:this.element.textContent=e,this.element.style.color=s,this.element.style.opacity="1",this.timeoutId=setTimeout(()=>{this.element.style.opacity="0",this.timeoutId=null},n)}success(e,t=2e3){this.show(e,{color:"#4ade80",duration:t})}error(e,t=2e3){this.show(e,{color:"#f87171",duration:t})}info(e,t=2e3){this.show(e,{color:"#60a5fa",duration:t})}showLocation(e,t,s=2500){const n=`<strong class="notification-title">📍 ${e}</strong><br><span class="notification-subtitle">${t}</span>`;this.show(n,{color:"#60a5fa",duration:s,html:!0})}showTouristMode(e){e?this.show('🚀 <strong>Tourist Mode</strong> — Sit back and enjoy the ride!<br><span class="notification-hint">Click or press T to take control</span>',{color:"#60a5fa",duration:3e3,html:!0}):this.show("🎮 <strong>Manual Control</strong> — You're driving now",{color:"#4ade80",duration:1500,html:!0})}showAutoTouristMode(){this.show('🚀 <strong>Tourist Mode</strong> — Exploring fractal landscapes<br><span class="notification-hint">Press <strong>T</strong> to stop · Press <strong>H</strong> for help</span>',{color:"#60a5fa",duration:5e3,html:!0})}showScreenshotMode(e){const t=e?"📷 Screenshot mode (Space to exit)":"📷 UI restored";this.info(t,1e3)}showShareResult(e){e?this.success("📋 Link copied to clipboard!"):this.error("❌ Failed to copy link")}destroy(){this.timeoutId!==null&&clearTimeout(this.timeoutId),this.element.remove()}}class Ke{constructor(e){a(this,"debug");a(this,"fps");a(this,"help");a(this,"notification");a(this,"screenshotMode",!1);a(this,"screenshotModeAutoEnabled",!1);this.debug=new Ve(e),this.fps=new Xe(e),this.help=new qe(e),this.notification=new $e(e)}toggleScreenshotMode(){return this.setScreenshotMode(!this.screenshotMode,!1),this.notification.showScreenshotMode(this.screenshotMode),this.screenshotMode}setScreenshotMode(e,t=!1){e!==this.screenshotMode&&(this.screenshotMode=e,this.screenshotModeAutoEnabled=t&&e,this.screenshotMode?(this.help.isVisible()&&this.help.hide(),this.debug.hide(),this.fps.hide()):(this.debug.show(),this.fps.show()))}disableAutoScreenshotMode(){this.screenshotModeAutoEnabled&&this.setScreenshotMode(!1,!1)}isScreenshotMode(){return this.screenshotMode}toggleHelp(){return this.help.toggle()}updateDebug(e){this.screenshotMode||this.debug.update(e)}tickFPS(e){this.screenshotMode||this.fps.tick(e)}destroy(){this.debug.destroy(),this.fps.destroy(),this.help.destroy(),this.notification.destroy()}}class Ze{constructor(e=-.5,t=0,s=.4){a(this,"centerX");a(this,"centerY");a(this,"zoom");this.centerX=e,this.centerY=t,this.zoom=s}pan(e,t,s,n){const o=-e/(this.zoom*s),h=t/(this.zoom*n);this.centerX+=o,this.centerY+=h}zoomAt(e,t,s,n,o){const h=this.centerX+(e/n-.5)/this.zoom,u=this.centerY-(t/o-.5)/this.zoom;this.zoom*=s,this.zoom=Math.max(.1,Math.min(this.zoom,1e15));const f=this.centerX+(e/n-.5)/this.zoom,l=this.centerY-(t/o-.5)/this.zoom;this.centerX+=h-f,this.centerY+=u-l}toFractalCoords(e,t,s,n){const o=s/n,h=(e/s-.5)*o,u=t/n-.5,f=this.centerX+h/this.zoom,l=this.centerY-u/this.zoom;return[f,l]}toScreenCoords(e,t,s,n){const o=s/n,h=(e-this.centerX)*this.zoom,u=(t-this.centerY)*this.zoom,f=(h/o+.5)*s,l=(-u+.5)*n;return[f,l]}zoomToPoint(e,t,s,n,o){const[h,u]=this.toFractalCoords(e,t,n,o);this.centerX=h,this.centerY=u,this.zoom*=s,this.zoom=Math.max(.1,Math.min(this.zoom,1e15))}reset(){this.centerX=-.5,this.centerY=0,this.zoom=.4}}const We=256,Qe=512,et=4096,tt=640,it=1.65;function J(i,e=!1){const t=Math.max(1,i),s=Math.log10(t),n=e?Qe:We,o=n+tt*Math.pow(s,it);return Math.round(Math.max(n,Math.min(et,o)))}class st{constructor(){a(this,"view");a(this,"_fractalType",r.Mandelbrot);a(this,"_juliaC",[-.7,.27015]);a(this,"_juliaPickerMode",!1);a(this,"_isActivelyPickingJulia",!1);a(this,"_savedViewState",null);a(this,"_savedFractalType",null);a(this,"_paletteType","cosine");a(this,"_cosinePaletteIndex",1);a(this,"_gradientPaletteIndex",0);a(this,"_colorOffset",0);a(this,"_maxIterationsOverride",null);a(this,"_hdrBrightnessBias",0);a(this,"_sdrGradientBrightness",1);a(this,"_interpolatedPaletteParams",null);a(this,"_interpolatedBlendParams",null);a(this,"listeners",new Set);this.view=new Ze}get fractalType(){return this._fractalType}get juliaC(){return this._juliaC}get juliaPickerMode(){return this._juliaPickerMode}get isActivelyPickingJulia(){return this._isActivelyPickingJulia}get savedViewState(){return this._savedViewState}get savedFractalType(){return this._savedFractalType}get paletteType(){return this._paletteType}get cosinePaletteIndex(){return this._cosinePaletteIndex}get gradientPaletteIndex(){return this._gradientPaletteIndex}get colorOffset(){return this._colorOffset}get maxIterationsOverride(){return this._maxIterationsOverride}get hdrBrightnessBias(){return this._hdrBrightnessBias}get sdrGradientBrightness(){return this._sdrGradientBrightness}get interpolatedPaletteParams(){return this._interpolatedPaletteParams}get interpolatedBlendParams(){return this._interpolatedBlendParams}get isJulia(){return M(this._fractalType)}get maxIterations(){return this._maxIterationsOverride??J(this.view.zoom,this.isJulia)}set fractalType(e){this._fractalType!==e&&(this._fractalType=e,this.emit("fractalType"))}set juliaC(e){this._juliaC=e,this.emit("julia")}set juliaPickerMode(e){this._juliaPickerMode=e,this.emit("julia")}set isActivelyPickingJulia(e){this._isActivelyPickingJulia=e}set savedViewState(e){this._savedViewState=e}set savedFractalType(e){this._savedFractalType=e}set paletteType(e){this._paletteType!==e&&(this._paletteType=e,this.emit("palette"))}set cosinePaletteIndex(e){const t=(e%P+P)%P;this._cosinePaletteIndex!==t&&(this._cosinePaletteIndex=t,this.emit("palette"))}set gradientPaletteIndex(e){const t=(e%I+I)%I;this._gradientPaletteIndex!==t&&(this._gradientPaletteIndex=t,this.emit("palette"))}set colorOffset(e){this._colorOffset=e,this.emit("palette")}set maxIterationsOverride(e){this._maxIterationsOverride=e,this.emit("iterations")}set hdrBrightnessBias(e){this._hdrBrightnessBias=Math.max(-1,Math.min(1,e)),this.emit("brightness")}set sdrGradientBrightness(e){this._sdrGradientBrightness=Math.max(.1,Math.min(10,e)),this.emit("brightness")}set interpolatedPaletteParams(e){this._interpolatedPaletteParams=e}set interpolatedBlendParams(e){this._interpolatedBlendParams=e}clearInterpolationState(){this._interpolatedPaletteParams=null,this._interpolatedBlendParams=null}toBookmark(){return{fractalType:this._fractalType,centerX:this.view.centerX,centerY:this.view.centerY,zoom:this.view.zoom,paletteType:this._paletteType,cosinePaletteIndex:this._cosinePaletteIndex,gradientPaletteIndex:this._gradientPaletteIndex,colorOffset:this._colorOffset,juliaC:this._juliaC,maxIterationsOverride:this._maxIterationsOverride,aaEnabled:!1}}fromBookmark(e){e.centerX!==void 0&&(this.view.centerX=e.centerX),e.centerY!==void 0&&(this.view.centerY=e.centerY),e.zoom!==void 0&&(this.view.zoom=e.zoom),e.fractalType!==void 0&&(this._fractalType=e.fractalType),e.paletteType!==void 0&&(this._paletteType=e.paletteType),e.cosinePaletteIndex!==void 0&&(this._cosinePaletteIndex=e.cosinePaletteIndex%P),e.gradientPaletteIndex!==void 0&&(this._gradientPaletteIndex=e.gradientPaletteIndex%I),e.colorOffset!==void 0&&(this._colorOffset=e.colorOffset),e.juliaC!==void 0&&(this._juliaC=e.juliaC),e.maxIterationsOverride!==void 0&&(this._maxIterationsOverride=e.maxIterationsOverride),this.emit("all")}applyBookmark(e){this.view.centerX=e.centerX,this.view.centerY=e.centerY,this.view.zoom=e.zoom,this._fractalType=e.fractalType,this._paletteType=e.paletteType,this._cosinePaletteIndex=e.cosinePaletteIndex,this._gradientPaletteIndex=e.gradientPaletteIndex,this._colorOffset=e.colorOffset,this._juliaC=e.juliaC,this._maxIterationsOverride=e.maxIterationsOverride,this.emit("all")}applyPartial(e){e.centerX!==void 0&&(this.view.centerX=e.centerX),e.centerY!==void 0&&(this.view.centerY=e.centerY),e.zoom!==void 0&&(this.view.zoom=e.zoom),e.fractalType!==void 0&&(this._fractalType=e.fractalType),e.paletteType!==void 0&&(this._paletteType=e.paletteType),e.cosinePaletteIndex!==void 0&&(this._cosinePaletteIndex=e.cosinePaletteIndex),e.gradientPaletteIndex!==void 0&&(this._gradientPaletteIndex=e.gradientPaletteIndex),e.colorOffset!==void 0&&(this._colorOffset=e.colorOffset),e.juliaC!==void 0&&(this._juliaC=e.juliaC)}addListener(e){return this.listeners.add(e),()=>this.listeners.delete(e)}emit(e){for(const t of this.listeners)t(e)}notifyViewChange(){this.emit("view")}}const he={enabled:!1,bloomEnabled:!1,bloomThreshold:.8,bloomIntensity:.3,vignetteEnabled:!1,vignetteIntensity:.4,vignetteSoftness:.5,sharpenEnabled:!1,sharpenStrength:.3,chromaticAberrationEnabled:!1,chromaticAberrationIntensity:.3,toneMappingEnabled:!1,exposure:1,saturation:1.15,temperature:0},ee={clean:"Clean",cinematic:"Cinematic",vivid:"Vivid",dreamy:"Dreamy"},_=["clean","cinematic","vivid","dreamy"],nt={clean:{enabled:!1,bloomEnabled:!1,vignetteEnabled:!1,sharpenEnabled:!1,chromaticAberrationEnabled:!1,toneMappingEnabled:!1},cinematic:{enabled:!0,bloomEnabled:!0,bloomThreshold:.8,bloomIntensity:.3,vignetteEnabled:!0,vignetteIntensity:.4,vignetteSoftness:.5,sharpenEnabled:!1,chromaticAberrationEnabled:!1,toneMappingEnabled:!0,exposure:1,saturation:1.15,temperature:0},vivid:{enabled:!0,bloomEnabled:!0,bloomThreshold:.7,bloomIntensity:.25,vignetteEnabled:!1,sharpenEnabled:!0,sharpenStrength:.4,chromaticAberrationEnabled:!1,toneMappingEnabled:!0,exposure:1,saturation:1.3,temperature:0},dreamy:{enabled:!0,bloomEnabled:!0,bloomThreshold:.5,bloomIntensity:.5,vignetteEnabled:!0,vignetteIntensity:.3,vignetteSoftness:.6,sharpenEnabled:!1,chromaticAberrationEnabled:!0,chromaticAberrationIntensity:.3,toneMappingEnabled:!1}};function at(i){return{...he,...nt[i]}}const ot=`// Bloom Brightness Extraction Pass
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
  _pad1: f32,                            // offset 72
  _pad2: f32,                            // offset 76
}

struct VertexOutput {
  @builtin(position) position: vec4f,
  @location(0) uv: vec2f,
}

@group(0) @binding(0) var texSampler: sampler;
@group(0) @binding(1) var fractalTexture: texture_2d<f32>;
@group(0) @binding(2) var bloomTexture: texture_2d<f32>;
@group(0) @binding(3) var<uniform> u: PostProcessUniforms;

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

@fragment
fn fragmentMain(input: VertexOutput) -> @location(0) vec4f {
  var color: vec3f;
  let uv = input.uv;

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

  return vec4f(max(color, vec3f(0.0)), 1.0);
}
`,te=80,ie=16;class ct{constructor(e,t){a(this,"device");a(this,"format");a(this,"settings");a(this,"intermediateTexture",null);a(this,"bloomExtractTexture",null);a(this,"bloomBlurTempTexture",null);a(this,"bloomBlurTexture",null);a(this,"sampler");a(this,"bloomExtractPipeline");a(this,"blurPipeline");a(this,"compositePipeline");a(this,"singleTextureLayout");a(this,"compositeLayout");a(this,"bloomExtractBindGroup",null);a(this,"blurHBindGroup",null);a(this,"blurVBindGroup",null);a(this,"compositeBindGroup",null);a(this,"uniformBuffer");a(this,"blurHUniformBuffer");a(this,"blurVUniformBuffer");a(this,"width",0);a(this,"height",0);this.device=e,this.format=t,this.settings={...he},this.sampler=e.createSampler({label:"Post-Process Sampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),this.uniformBuffer=e.createBuffer({label:"Post-Process Uniforms",size:te,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.blurHUniformBuffer=e.createBuffer({label:"Blur H Uniforms",size:ie,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.blurVUniformBuffer=e.createBuffer({label:"Blur V Uniforms",size:ie,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.singleTextureLayout=e.createBindGroupLayout({label:"Single Texture Layout",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),this.compositeLayout=e.createBindGroupLayout({label:"Composite Layout",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]});const s=e.createShaderModule({label:"Bloom Extract Shader",code:ot}),n=e.createShaderModule({label:"Blur Shader",code:rt}),o=e.createShaderModule({label:"Composite Shader",code:lt});this.bloomExtractPipeline=e.createRenderPipeline({label:"Bloom Extract Pipeline",layout:e.createPipelineLayout({bindGroupLayouts:[this.singleTextureLayout]}),vertex:{module:s,entryPoint:"vertexMain"},fragment:{module:s,entryPoint:"fragmentMain",targets:[{format:t}]},primitive:{topology:"triangle-list"}}),this.blurPipeline=e.createRenderPipeline({label:"Blur Pipeline",layout:e.createPipelineLayout({bindGroupLayouts:[this.singleTextureLayout]}),vertex:{module:n,entryPoint:"vertexMain"},fragment:{module:n,entryPoint:"fragmentMain",targets:[{format:t}]},primitive:{topology:"triangle-list"}}),this.compositePipeline=e.createRenderPipeline({label:"Composite Pipeline",layout:e.createPipelineLayout({bindGroupLayouts:[this.compositeLayout]}),vertex:{module:o,entryPoint:"vertexMain"},fragment:{module:o,entryPoint:"fragmentMain",targets:[{format:t}]},primitive:{topology:"triangle-list"}}),console.log("Post-processing pipeline initialized")}isEnabled(){return this.settings.enabled}setPreset(e){this.settings=at(e)}resize(e,t){if(e===this.width&&t===this.height)return;this.width=e,this.height=t,this.intermediateTexture?.destroy(),this.bloomExtractTexture?.destroy(),this.bloomBlurTempTexture?.destroy(),this.bloomBlurTexture?.destroy();const s=Math.max(1,Math.floor(e/2)),n=Math.max(1,Math.floor(t/2));this.intermediateTexture=this.device.createTexture({label:"Post-Process Intermediate",size:{width:e,height:t},format:this.format,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),this.bloomExtractTexture=this.device.createTexture({label:"Bloom Extract",size:{width:s,height:n},format:this.format,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),this.bloomBlurTempTexture=this.device.createTexture({label:"Bloom Blur Temp",size:{width:s,height:n},format:this.format,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),this.bloomBlurTexture=this.device.createTexture({label:"Bloom Blur",size:{width:s,height:n},format:this.format,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),this.createBindGroups(s,n)}getIntermediateTextureView(){return this.intermediateTexture.createView()}encodePostProcessPasses(e,t){if(this.updateUniforms(),this.settings.bloomEnabled){const n=e.beginRenderPass({label:"Bloom Extract",colorAttachments:[{view:this.bloomExtractTexture.createView(),clearValue:{r:0,g:0,b:0,a:1},loadOp:"clear",storeOp:"store"}]});n.setPipeline(this.bloomExtractPipeline),n.setBindGroup(0,this.bloomExtractBindGroup),n.draw(3),n.end();const o=e.beginRenderPass({label:"Blur Horizontal",colorAttachments:[{view:this.bloomBlurTempTexture.createView(),clearValue:{r:0,g:0,b:0,a:1},loadOp:"clear",storeOp:"store"}]});o.setPipeline(this.blurPipeline),o.setBindGroup(0,this.blurHBindGroup),o.draw(3),o.end();const h=e.beginRenderPass({label:"Blur Vertical",colorAttachments:[{view:this.bloomBlurTexture.createView(),clearValue:{r:0,g:0,b:0,a:1},loadOp:"clear",storeOp:"store"}]});h.setPipeline(this.blurPipeline),h.setBindGroup(0,this.blurVBindGroup),h.draw(3),h.end()}const s=e.beginRenderPass({label:"Composite",colorAttachments:[{view:t,clearValue:{r:0,g:0,b:0,a:1},loadOp:"clear",storeOp:"store"}]});s.setPipeline(this.compositePipeline),s.setBindGroup(0,this.compositeBindGroup),s.draw(3),s.end()}createBindGroups(e,t){const s=this.intermediateTexture.createView(),n=this.bloomExtractTexture.createView(),o=this.bloomBlurTempTexture.createView(),h=this.bloomBlurTexture.createView();this.bloomExtractBindGroup=this.device.createBindGroup({label:"Bloom Extract Bind Group",layout:this.singleTextureLayout,entries:[{binding:0,resource:this.sampler},{binding:1,resource:s},{binding:2,resource:{buffer:this.uniformBuffer}}]}),this.blurHBindGroup=this.device.createBindGroup({label:"Blur H Bind Group",layout:this.singleTextureLayout,entries:[{binding:0,resource:this.sampler},{binding:1,resource:n},{binding:2,resource:{buffer:this.blurHUniformBuffer}}]}),this.blurVBindGroup=this.device.createBindGroup({label:"Blur V Bind Group",layout:this.singleTextureLayout,entries:[{binding:0,resource:this.sampler},{binding:1,resource:o},{binding:2,resource:{buffer:this.blurVUniformBuffer}}]}),this.compositeBindGroup=this.device.createBindGroup({label:"Composite Bind Group",layout:this.compositeLayout,entries:[{binding:0,resource:this.sampler},{binding:1,resource:s},{binding:2,resource:h},{binding:3,resource:{buffer:this.uniformBuffer}}]});const u=new Float32Array([1/e,1/t,1,0]);this.device.queue.writeBuffer(this.blurHUniformBuffer,0,u);const f=new Float32Array([1/e,1/t,0,1]);this.device.queue.writeBuffer(this.blurVUniformBuffer,0,f)}updateUniforms(){const e=new ArrayBuffer(te),t=new Float32Array(e),s=new Int32Array(e);t[0]=this.width,t[1]=this.height,t[2]=1/this.width,t[3]=1/this.height,t[4]=this.settings.bloomThreshold,t[5]=this.settings.bloomIntensity,t[6]=this.settings.vignetteIntensity,t[7]=this.settings.vignetteSoftness,t[8]=this.settings.sharpenStrength,t[9]=this.settings.chromaticAberrationIntensity,t[10]=this.settings.exposure,t[11]=this.settings.saturation,t[12]=this.settings.temperature,s[13]=this.settings.bloomEnabled?1:0,s[14]=this.settings.vignetteEnabled?1:0,s[15]=this.settings.sharpenEnabled?1:0,s[16]=this.settings.chromaticAberrationEnabled?1:0,s[17]=this.settings.toneMappingEnabled?1:0,this.device.queue.writeBuffer(this.uniformBuffer,0,e)}destroy(){this.intermediateTexture?.destroy(),this.bloomExtractTexture?.destroy(),this.bloomBlurTempTexture?.destroy(),this.bloomBlurTexture?.destroy(),this.uniformBuffer.destroy(),this.blurHUniformBuffer.destroy(),this.blurVUniformBuffer.destroy()}}const ht=`// WebGPU Shader for Mandelbrot Set with HDR support
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
`,se=1.5,ne=256,O=class O{constructor(e,t){a(this,"renderer");a(this,"state");a(this,"inputHandler");a(this,"pipeline");a(this,"uniformBuffer");a(this,"bindGroup");a(this,"postProcessing");a(this,"postProcessPresetIndex",0);a(this,"overlays");a(this,"touristMode",null);a(this,"autoTouristTimeout",null);a(this,"userHasInteracted",!1);a(this,"handleResize",()=>{this.renderer.resize(window.innerWidth,window.innerHeight);const e=this.renderer.canvas;this.postProcessing.resize(e.width,e.height),this.render()});a(this,"handleHashChange",()=>{this.loadBookmark()});this.renderer=e,this.state=new st,this.postProcessing=new ct(e.device,e.format),this.inputHandler=new F(t,this.state.view,()=>this.render(),this.createInputCallbacks()),this.setupOverlays(t)}static async create(e){const t=await D.create(e),s=new O(t,e);return await s.initializePipeline(),t.setOnHdrChange(()=>{console.log("HDR status changed, re-rendering..."),s.render()}),window.addEventListener("resize",s.handleResize),window.addEventListener("hashchange",s.handleHashChange),s.loadBookmark(),s.handleResize(),s.startAutoTouristTimer(),s}async initializePipeline(){const e=this.renderer.device,t=e.createShaderModule({label:"Mandelbrot Shader",code:ht});this.uniformBuffer=e.createBuffer({label:"Uniforms",size:ne,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});const s=e.createBindGroupLayout({label:"Bind Group Layout",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]});this.bindGroup=e.createBindGroup({label:"Bind Group",layout:s,entries:[{binding:0,resource:{buffer:this.uniformBuffer}}]});const n=e.createPipelineLayout({label:"Pipeline Layout",bindGroupLayouts:[s]});this.pipeline=e.createRenderPipeline({label:"Mandelbrot Pipeline",layout:n,vertex:{module:t,entryPoint:"vertexMain"},fragment:{module:t,entryPoint:"fragmentMain",targets:[{format:this.renderer.format}]},primitive:{topology:"triangle-list"}}),console.log("WebGPU pipeline initialized")}createInputCallbacks(){return{onIterationAdjust:e=>this.adjustMaxIterations(e),onIterationReset:()=>this.clearMaxIterationsOverride(),onCosinePaletteCycle:e=>this.cycleCosinePalette(e),onGradientPaletteCycle:e=>this.cycleGradientPalette(e),onColorOffsetAdjust:e=>this.adjustColorOffset(e),onColorOffsetReset:()=>this.resetColorOffset(),onBrightnessAdjust:e=>this.adjustHdrBrightness(e),onBrightnessReset:()=>this.resetHdrBrightness(),onFractalCycle:e=>this.cycleFractalType(e),onFractalCycleAnimate:e=>this.animateFractalCycle(e),onToggleJuliaMode:()=>this.toggleJuliaPickerMode(),onJuliaPick:(e,t)=>this.pickJuliaConstant(e,t),onJuliaPickEnd:()=>this.endJuliaPicking(),onShare:()=>this.shareBookmark(),onLocationSelect:e=>this.goToLocation(e),onLocationAnimate:e=>this.animateToLocation(e),onToggleHelp:()=>this.toggleHelp(),onToggleScreenshotMode:()=>this.toggleScreenshotMode(),onToggleTouristMode:()=>this.toggleTouristMode(),onPostProcessPresetCycle:e=>this.cyclePostProcessPreset(e),onUserInput:()=>this.handleUserInput()}}setupOverlays(e){const t=e.parentElement;if(!t)throw new Error("Canvas must have a parent element for overlays");this.overlays=new Ke(t)}render(){const e=this.renderer.device,t=this.renderer.canvas,s=performance.now();this.overlays.tickFPS(s);const n=M(this.state.fractalType),o=this.state.maxIterationsOverride??J(this.state.view.zoom,n),h=this.state.paletteType==="cosine"?Le(this.state.cosinePaletteIndex):De(this.state.gradientPaletteIndex),u={fractalName:ge[this.state.fractalType],zoom:this.state.view.zoom,maxIterations:o,isManualIterations:this.state.maxIterationsOverride!==null,paletteName:h,colorOffset:this.state.colorOffset,isJulia:n,juliaC:this.state.juliaC,hdrEnabled:this.renderer.hdrEnabled,hdrBrightnessBias:this.state.hdrBrightnessBias,displaySupportsHDR:this.renderer.displaySupportsHDR,sdrGradientBrightness:this.state.sdrGradientBrightness,paletteType:this.state.paletteType,juliaPickerMode:this.state.juliaPickerMode,postProcessPreset:this.postProcessing.isEnabled()?ee[_[this.postProcessPresetIndex]]:null};this.overlays.updateDebug(u);const f=new ArrayBuffer(ne),l=new Float32Array(f),p=new Int32Array(f),b=this.state.paletteType==="cosine",y=b?Re(this.state.cosinePaletteIndex):_e(this.state.gradientPaletteIndex),d=this.state.interpolatedPaletteParams??(b?le(this.state.cosinePaletteIndex):ce(this.state.gradientPaletteIndex,this.renderer.hdrEnabled));l[0]=t.width,l[1]=t.height,l[2]=this.state.view.centerX,l[3]=this.state.view.centerY,l[4]=this.state.view.zoom,p[5]=o,l[6]=performance.now()*.001,l[7]=this.state.colorOffset,p[8]=this.state.fractalType,l[10]=this.state.juliaC[0],l[11]=this.state.juliaC[1],p[12]=this.renderer.hdrEnabled?1:0,l[13]=this.state.hdrBrightnessBias,p[14]=d.type==="cosine"?0:1,p[15]=y.isMonotonic?1:0,l[16]=this.state.sdrGradientBrightness;const g=this.state.interpolatedBlendParams;l[17]=g?.juliaBlend??0,l[18]=g?.preAbsRe??0,l[19]=g?.preAbsIm??0,d.type==="cosine"&&(l[20]=d.a[0],l[21]=d.a[1],l[22]=d.a[2],l[24]=d.b[0],l[25]=d.b[1],l[26]=d.b[2],l[28]=d.c[0],l[29]=d.c[1],l[30]=d.c[2],l[32]=d.d[0],l[33]=d.d[1],l[34]=d.d[2]),d.type==="gradient"&&(l[36]=d.c1[0],l[37]=d.c1[1],l[38]=d.c1[2],l[40]=d.c2[0],l[41]=d.c2[1],l[42]=d.c2[2],l[44]=d.c3[0],l[45]=d.c3[1],l[46]=d.c3[2],l[48]=d.c4[0],l[49]=d.c4[1],l[50]=d.c4[2],l[52]=d.c5[0],l[53]=d.c5[1],l[54]=d.c5[2]),l[56]=g?.preNegIm??0,l[57]=g?.postAbsRe??0,l[58]=g?.postAbsIm??0,l[59]=g?.postNegIm??0,p[60]=g!==null?1:0,e.queue.writeBuffer(this.uniformBuffer,0,f);const w=e.createCommandEncoder(),Y=this.postProcessing.isEnabled(),ue=Y?this.postProcessing.getIntermediateTextureView():this.renderer.getCurrentTexture().createView(),A=w.beginRenderPass({colorAttachments:[{view:ue,clearValue:{r:0,g:0,b:0,a:1},loadOp:"clear",storeOp:"store"}]});if(A.setPipeline(this.pipeline),A.setBindGroup(0,this.bindGroup),A.draw(3),A.end(),Y){const de=this.renderer.getCurrentTexture().createView();this.postProcessing.encodePostProcessPasses(w,de)}e.queue.submit([w.finish()])}start(){this.renderer.start(()=>this.render())}stop(){this.renderer.stop()}adjustMaxIterations(e){const t=M(this.state.fractalType),s=this.state.maxIterationsOverride??J(this.state.view.zoom,t),n=e>0?s*se:s/se;this.state.maxIterationsOverride=Math.round(Math.max(1,n)),this.render()}clearMaxIterationsOverride(){this.state.maxIterationsOverride=null,this.render()}adjustHdrBrightness(e){this.renderer.hdrEnabled?this.state.hdrBrightnessBias=Math.max(-1,Math.min(1,this.state.hdrBrightnessBias+e*.1)):this.state.paletteType==="gradient"&&(this.state.sdrGradientBrightness=Math.max(.1,Math.min(10,this.state.sdrGradientBrightness+e*.2))),this.render()}resetHdrBrightness(){this.state.hdrBrightnessBias=0,this.state.sdrGradientBrightness=1,this.render()}cycleCosinePalette(e){this.state.cosinePaletteIndex=(this.state.cosinePaletteIndex+e+P)%P,this.state.paletteType="cosine",this.render()}cycleGradientPalette(e){this.state.gradientPaletteIndex=(this.state.gradientPaletteIndex+e+I)%I,this.state.paletteType="gradient",this.render()}adjustColorOffset(e){this.state.colorOffset+=e,this.render()}resetColorOffset(){this.state.colorOffset=0,this.render()}cycleFractalType(e=1){this.userHasInteracted=!0,this.cancelAutoTouristTimer(),this.cancelOngoingAnimation();const o=((B(this.state.fractalType)>>1)+e+z)%z<<1;this.state.juliaPickerMode&&(this.state.juliaPickerMode=!1,this.inputHandler.setJuliaPickerMode(!1));const h=E("1",o);h?(this.applyLocationState(h.state),this.state.clearInterpolationState(),this.showLocationNotification(h.name,h.description)):(this.state.fractalType=o,this.state.clearInterpolationState()),this.render()}animateFractalCycle(e=1){this.userHasInteracted=!0,this.cancelAutoTouristTimer();const o=((B(this.state.fractalType)>>1)+e+z)%z<<1;this.state.juliaPickerMode&&(this.state.juliaPickerMode=!1,this.inputHandler.setJuliaPickerMode(!1));const h=E("1",o);if(!h){this.cycleFractalType(e);return}this.touristMode||(this.touristMode=new R({onUpdate:(u,f,l)=>this.applyTouristUpdate(u,f,l),onClearInterpolation:()=>this.state.clearInterpolationState(),onRender:()=>this.render(),onLocationNotification:(u,f)=>this.showLocationNotification(u,f)},this.getBookmarkState())),this.touristMode.animateToLocation(h,this.getBookmarkState())}toggleJuliaPickerMode(){if(M(this.state.fractalType)){this.exitJuliaMode();return}this.state.juliaPickerMode=!this.state.juliaPickerMode,this.inputHandler.setJuliaPickerMode(this.state.juliaPickerMode),this.render()}pickJuliaConstant(e,t){this.state.juliaPickerMode&&(this.state.isActivelyPickingJulia||(this.state.savedViewState={centerX:this.state.view.centerX,centerY:this.state.view.centerY,zoom:this.state.view.zoom},this.state.savedFractalType=this.state.fractalType,this.state.fractalType=be(this.state.fractalType),this.state.view.centerX=0,this.state.view.centerY=0,this.state.view.zoom=.5,this.state.isActivelyPickingJulia=!0),this.state.juliaC=[e,t],this.render())}endJuliaPicking(){this.state.isActivelyPickingJulia&&(this.state.isActivelyPickingJulia=!1,this.state.juliaPickerMode=!1,this.inputHandler.setJuliaPickerMode(!1),this.render())}exitJuliaMode(){this.state.savedViewState&&(this.state.view.centerX=this.state.savedViewState.centerX,this.state.view.centerY=this.state.savedViewState.centerY,this.state.view.zoom=this.state.savedViewState.zoom,this.state.savedViewState=null),this.state.savedFractalType!==null?(this.state.fractalType=this.state.savedFractalType,this.state.savedFractalType=null):this.state.fractalType=B(this.state.fractalType),this.state.juliaPickerMode=!1,this.inputHandler.setJuliaPickerMode(!1),this.render()}getBookmarkState(){return this.state.toBookmark()}loadBookmark(){const e=Te();if(e){if(e.paletteIndex!==void 0&&e.paletteType===void 0){const t=[0,4,5,10,11];if(t.includes(e.paletteIndex))e.paletteType="cosine",e.cosinePaletteIndex=t.indexOf(e.paletteIndex);else{e.paletteType="gradient";const s=[1,2,3,6,7,8,9];e.gradientPaletteIndex=s.indexOf(e.paletteIndex)}}this.state.fromBookmark(e),this.render()}}goToLocation(e){const t=E(e,this.state.fractalType);t&&(this.userHasInteracted=!0,this.cancelAutoTouristTimer(),this.cancelOngoingAnimation(),this.applyLocationState(t.state),this.state.clearInterpolationState(),this.showLocationNotification(t.name,t.description),this.updateUrlBookmark(),this.render())}animateToLocation(e){const t=E(e,this.state.fractalType);t&&(this.userHasInteracted=!0,this.cancelAutoTouristTimer(),this.touristMode||(this.touristMode=new R({onUpdate:(s,n,o)=>this.applyTouristUpdate(s,n,o),onClearInterpolation:()=>this.state.clearInterpolationState(),onRender:()=>this.render(),onLocationNotification:(s,n)=>this.showLocationNotification(s,n)},this.getBookmarkState())),this.touristMode.animateToLocation(t,this.getBookmarkState()))}applyLocationState(e){this.state.applyBookmark(e)}showLocationNotification(e,t){this.overlays.isScreenshotMode()||this.overlays.notification.showLocation(e,t)}updateUrlBookmark(){xe(this.getBookmarkState())}async shareBookmark(){const e=await Pe(this.getBookmarkState());this.showShareNotification(e),e&&this.updateUrlBookmark(),(window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1")&&this.logCreateLocationCode()}logCreateLocationCode(){const e=this.getFractalTypeEnumName(this.state.fractalType),t=M(this.state.fractalType),s=[];this.state.paletteType==="gradient"?(s.push("paletteType: 'gradient'"),this.state.gradientPaletteIndex!==0&&s.push(`gradientPaletteIndex: ${this.state.gradientPaletteIndex}`)):this.state.cosinePaletteIndex!==1&&s.push(`cosinePaletteIndex: ${this.state.cosinePaletteIndex}`),Math.abs(this.state.colorOffset)>.001&&s.push(`colorOffset: ${this.state.colorOffset}`),t&&s.push(`juliaC: [${this.state.juliaC[0]}, ${this.state.juliaC[1]}]`),this.state.maxIterationsOverride!==null&&s.push(`maxIterationsOverride: ${this.state.maxIterationsOverride}`);const n=s.length>0?`,
    { ${s.join(", ")} }`:"",o=`createLocation(
    'TODO: Name',
    'TODO: Description',
    'TODO: Key (1-9)',
    FractalType.${e},
    ${this.state.view.centerX}, ${this.state.view.centerY}, ${this.state.view.zoom}${n}
  ),`;console.log("%c📍 createLocation() code:","color: #4ade80; font-weight: bold; font-size: 14px;"),console.log(o)}getFractalTypeEnumName(e){const t=Object.entries(r);for(const[s,n]of t)if(n===e&&isNaN(Number(s)))return s;return`Unknown(${e})`}showShareNotification(e){this.overlays.notification.showShareResult(e)}toggleHelp(){this.overlays.toggleHelp()}toggleScreenshotMode(){this.overlays.toggleScreenshotMode()}cyclePostProcessPreset(e){this.postProcessPresetIndex=(this.postProcessPresetIndex+e+_.length)%_.length;const t=_[this.postProcessPresetIndex];this.postProcessing.setPreset(t);const s=ee[t];this.overlays.notification.info(`✨ Post-Processing: ${s}`,1500),this.render()}toggleTouristMode(){this.touristMode?.isActive()?this.stopTouristMode():this.startTouristMode()}startTouristMode(){this.touristMode||(this.touristMode=new R({onUpdate:(e,t,s)=>this.applyTouristUpdate(e,t,s),onClearInterpolation:()=>this.state.clearInterpolationState(),onRender:()=>this.render(),onLocationNotification:(e,t)=>this.showLocationNotification(e,t)},this.getBookmarkState())),this.touristMode.start(this.getBookmarkState()),this.showTouristModeNotification(!0)}stopTouristMode(){this.touristMode?.isActive()&&(this.touristMode.stop(),this.state.clearInterpolationState(),this.overlays.disableAutoScreenshotMode(),this.showTouristModeNotification(!1),this.updateUrlBookmark())}cancelOngoingAnimation(){this.touristMode?.isActive()&&(this.touristMode.stop(),this.state.clearInterpolationState())}handleUserInput(){this.userHasInteracted=!0,this.cancelAutoTouristTimer(),this.touristMode?.isActive()&&this.stopTouristMode()}startAutoTouristTimer(){this.userHasInteracted||(this.cancelAutoTouristTimer(),this.autoTouristTimeout=setTimeout(()=>{!this.userHasInteracted&&!this.touristMode?.isActive()&&this.startTouristModeAuto()},O.AUTO_TOURIST_DELAY))}cancelAutoTouristTimer(){this.autoTouristTimeout!==null&&(clearTimeout(this.autoTouristTimeout),this.autoTouristTimeout=null)}startTouristModeAuto(){this.overlays.setScreenshotMode(!0,!0),this.touristMode||(this.touristMode=new R({onUpdate:(e,t,s)=>this.applyTouristUpdate(e,t,s),onClearInterpolation:()=>this.state.clearInterpolationState(),onRender:()=>this.render(),onLocationNotification:(e,t)=>this.showLocationNotification(e,t)},this.getBookmarkState())),this.touristMode.start(this.getBookmarkState()),this.overlays.notification.showAutoTouristMode()}applyTouristUpdate(e,t,s){this.state.applyPartial(e),this.state.interpolatedPaletteParams=t??null,this.state.interpolatedBlendParams=s??null}showTouristModeNotification(e){this.overlays.notification.showTouristMode(e)}destroy(){this.cancelAutoTouristTimer(),this.touristMode?.stop(),this.stop(),window.removeEventListener("resize",this.handleResize),window.removeEventListener("hashchange",this.handleHashChange),this.overlays.destroy(),this.inputHandler.destroy(),this.postProcessing.destroy(),this.renderer.destroy()}};a(O,"AUTO_TOURIST_DELAY",2e4);let H=O;console.log("Fractal Explorer - Initializing...");let L=null;async function ae(){const i=document.getElementById("app");if(!i){console.error("Could not find #app element");return}if(!D.isSupported()){i.innerHTML=`
      <div style="color: white; text-align: center; padding: 40px; font-family: system-ui, sans-serif;">
        <h1>WebGPU Not Supported</h1>
        <p>This application requires WebGPU, which is not available in your browser.</p>
        <p style="margin-top: 20px; color: #888;">
          Please use a modern browser with WebGPU support:<br>
          Chrome 113+, Edge 113+, or Firefox Nightly with WebGPU enabled.
        </p>
      </div>
    `;return}const e=document.createElement("canvas");e.id="fractal-canvas",i.appendChild(e);try{L=await H.create(e),L.start(),console.log("Fractal Explorer initialized successfully"),console.log("Controls:"),console.log("  - Drag to pan"),console.log("  - Scroll to zoom"),console.log("  - Double-click to zoom in"),console.log("  - Touch drag to pan (mobile)"),console.log("  - Pinch to zoom (mobile)"),console.log("  - + / - to adjust max iterations"),console.log("  - 0 to reset iterations to auto-scaling"),console.log("  - c / C to cycle cosine palettes (forward/backward)"),console.log("  - g / G to cycle gradient palettes (forward/backward)"),console.log("  - , / . to shift colors (fine)"),console.log("  - < / > to shift colors (coarse)"),console.log("  - b / B to adjust brightness (HDR bias or SDR gradient)"),console.log("  - d to reset brightness"),console.log("  - s to share/copy bookmark URL"),console.log("  - 1-9 to visit famous locations"),console.log("  - h to toggle help overlay"),console.log("  - Space to toggle screenshot mode")}catch(t){console.error("Failed to initialize Fractal Explorer:",t),i.innerHTML=`
      <div style="color: white; text-align: center; padding: 20px; font-family: system-ui, sans-serif;">
        <h1>Initialization Error</h1>
        <p>Failed to initialize the application.</p>
        <pre style="text-align: left; margin-top: 20px; color: #ff6b6b;">${t instanceof Error?t.message:String(t)}</pre>
      </div>
    `}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>ae()):ae();window.addEventListener("beforeunload",()=>{L&&L.destroy()});
//# sourceMappingURL=index-eXL-VyJU.js.map
