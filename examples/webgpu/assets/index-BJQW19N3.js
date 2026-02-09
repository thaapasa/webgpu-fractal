var q=Object.defineProperty;var V=(i,e,t)=>e in i?q(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t;var o=(i,e,t)=>V(i,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const c of s)if(c.type==="childList")for(const r of c.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&n(r)}).observe(document,{childList:!0,subtree:!0});function t(s){const c={};return s.integrity&&(c.integrity=s.integrity),s.referrerPolicy&&(c.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?c.credentials="include":s.crossOrigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function n(s){if(s.ep)return;s.ep=!0;const c=t(s);fetch(s.href,c)}})();class I{constructor(e){o(this,"device");o(this,"context");o(this,"canvas");o(this,"format");o(this,"animationFrameId",null);o(this,"renderCallback",null);o(this,"hdrEnabled",!1);o(this,"_displaySupportsHDR",!1);o(this,"hdrMediaQuery",null);o(this,"onHdrChangeCallback",null);this.canvas=e,this._displaySupportsHDR=this.detectHDRDisplay(),this.setupHdrMediaQueryListener()}get displaySupportsHDR(){return this._displaySupportsHDR}static async create(e){const t=new I(e);return await t.initialize(),t}static isSupported(){return"gpu"in navigator}async initialize(){if(!navigator.gpu)throw new Error("WebGPU is not supported in this browser");console.log("WebGPU HDR capability check:"),console.log("  - Display supports HDR:",this.displaySupportsHDR),console.log("  - dynamic-range: high:",window.matchMedia?.("(dynamic-range: high)").matches),console.log("  - color-gamut: p3:",window.matchMedia?.("(color-gamut: p3)").matches);const e=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!e)throw new Error("Failed to get WebGPU adapter");if("info"in e){const t=e.info;console.log("  - Adapter:",t?.vendor,t?.architecture)}if(this.device=await e.requestDevice(),this.context=this.canvas.getContext("webgpu"),!this.context)throw new Error("Failed to get WebGPU context");this.configureContext(),console.log("WebGPU initialized successfully"),this.hdrEnabled&&console.log("HDR mode enabled with rgba16float + extended tone mapping")}configureContext(){const e=navigator.gpu.getPreferredCanvasFormat();if(this.displaySupportsHDR)try{this.format="rgba16float",this.context.configure({device:this.device,format:this.format,alphaMode:"opaque",toneMapping:{mode:"extended"}}),this.hdrEnabled=!0,console.log("  - Configured with rgba16float + extended tone mapping (HDR)")}catch(t){console.log("  - HDR configuration failed, falling back to SDR:",t),this.format=e,this.context.configure({device:this.device,format:this.format,alphaMode:"opaque"}),this.hdrEnabled=!1}else this.format=e,this.context.configure({device:this.device,format:this.format,alphaMode:"opaque"}),this.hdrEnabled=!1,console.log("  - Configured with",this.format,"(SDR)")}resize(e,t){const n=window.devicePixelRatio||1;this.canvas.width=e*n,this.canvas.height=t*n,this.canvas.style.width=`${e}px`,this.canvas.style.height=`${t}px`}getCurrentTexture(){return this.context.getCurrentTexture()}start(e){if(this.animationFrameId!==null)return;this.renderCallback=e;const t=()=>{this.renderCallback&&this.renderCallback(),this.animationFrameId=requestAnimationFrame(t)};this.animationFrameId=requestAnimationFrame(t)}stop(){this.animationFrameId!==null&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null),this.renderCallback=null}detectHDRDisplay(){return!!window.matchMedia?.("(dynamic-range: high)").matches}setupHdrMediaQueryListener(){if(!window.matchMedia)return;this.hdrMediaQuery=window.matchMedia("(dynamic-range: high)");const e=()=>{const t=this.detectHDRDisplay();t!==this._displaySupportsHDR&&(console.log(`HDR display support changed: ${this._displaySupportsHDR} -> ${t}`),this._displaySupportsHDR=t,this.context&&this.device&&this.configureContext(),this.onHdrChangeCallback?.())};this.hdrMediaQuery.addEventListener?.("change",e)}setOnHdrChange(e){this.onHdrChangeCallback=e}destroy(){this.stop(),this.onHdrChangeCallback=null,this.device?.destroy()}}class Z{constructor(e=-.5,t=0,n=.4){o(this,"centerX");o(this,"centerY");o(this,"zoom");this.centerX=e,this.centerY=t,this.zoom=n}pan(e,t,n,s){const c=-e/(this.zoom*n),r=t/(this.zoom*s);this.centerX+=c,this.centerY+=r}zoomAt(e,t,n,s,c){const r=this.centerX+(e/s-.5)/this.zoom,h=this.centerY-(t/c-.5)/this.zoom;this.zoom*=n,this.zoom=Math.max(.1,Math.min(this.zoom,1e15));const f=this.centerX+(e/s-.5)/this.zoom,p=this.centerY-(t/c-.5)/this.zoom;this.centerX+=r-f,this.centerY+=h-p}toFractalCoords(e,t,n,s){const c=n/s,r=(e/n-.5)*c,h=t/s-.5,f=this.centerX+r/this.zoom,p=this.centerY-h/this.zoom;return[f,p]}toScreenCoords(e,t,n,s){const c=n/s,r=(e-this.centerX)*this.zoom,h=(t-this.centerY)*this.zoom,f=(r/c+.5)*n,p=(-h+.5)*s;return[f,p]}zoomToPoint(e,t,n,s,c){const[r,h]=this.toFractalCoords(e,t,s,c);this.centerX=r,this.centerY=h,this.zoom*=n,this.zoom=Math.max(.1,Math.min(this.zoom,1e15))}reset(){this.centerX=-.5,this.centerY=0,this.zoom=.4}}const W=.6;function O(i){return 1+(i-1)*W}class K{constructor(e,t,n){o(this,"canvas");o(this,"viewState");o(this,"onChange");o(this,"onIterationAdjust",null);o(this,"onIterationReset",null);o(this,"onCosinePaletteCycle",null);o(this,"onGradientPaletteCycle",null);o(this,"onColorOffset",null);o(this,"onColorOffsetReset",null);o(this,"onToggleAA",null);o(this,"onAdjustHdrBrightness",null);o(this,"onResetHdrBrightness",null);o(this,"onFractalCycle",null);o(this,"onToggleJuliaMode",null);o(this,"onJuliaPick",null);o(this,"onJuliaPickEnd",null);o(this,"onShare",null);o(this,"onLocationSelect",null);o(this,"onToggleHelp",null);o(this,"onToggleScreenshotMode",null);o(this,"isDragging",!1);o(this,"lastX",0);o(this,"lastY",0);o(this,"lastTouchDistance",0);o(this,"juliaPickerMode",!1);o(this,"isPickingJulia",!1);o(this,"juliaPickViewState",null);o(this,"keyboardZoomDirection",null);o(this,"keyboardZoomStartTime",0);o(this,"keyboardZoomAnimationId",null);this.canvas=e,this.viewState=t,this.onChange=n,this.setupEventListeners()}setIterationAdjustCallback(e){this.onIterationAdjust=e}setIterationResetCallback(e){this.onIterationReset=e}setCosinePaletteCycleCallback(e){this.onCosinePaletteCycle=e}setGradientPaletteCycleCallback(e){this.onGradientPaletteCycle=e}setColorOffsetCallback(e){this.onColorOffset=e}setColorOffsetResetCallback(e){this.onColorOffsetReset=e}setToggleAACallback(e){this.onToggleAA=e}setToggleHDRCallback(e){}setAdjustHdrBrightnessCallback(e){this.onAdjustHdrBrightness=e}setResetHdrBrightnessCallback(e){this.onResetHdrBrightness=e}setFractalCycleCallback(e){this.onFractalCycle=e}setToggleJuliaModeCallback(e){this.onToggleJuliaMode=e}setJuliaPickCallback(e){this.onJuliaPick=e}setJuliaPickEndCallback(e){this.onJuliaPickEnd=e}setShareCallback(e){this.onShare=e}setLocationSelectCallback(e){this.onLocationSelect=e}setToggleHelpCallback(e){this.onToggleHelp=e}setToggleScreenshotModeCallback(e){this.onToggleScreenshotMode=e}setJuliaPickerMode(e){this.juliaPickerMode=e,this.canvas.style.cursor=e?"crosshair":"grab"}isJuliaPickerModeActive(){return this.juliaPickerMode}setupEventListeners(){this.canvas.addEventListener("mousedown",this.handleMouseDown.bind(this)),this.canvas.addEventListener("mousemove",this.handleMouseMove.bind(this)),this.canvas.addEventListener("mouseup",this.handleMouseUp.bind(this)),this.canvas.addEventListener("mouseleave",this.handleMouseUp.bind(this)),this.canvas.addEventListener("wheel",this.handleWheel.bind(this),{passive:!1}),this.canvas.addEventListener("dblclick",this.handleDoubleClick.bind(this)),this.canvas.addEventListener("touchstart",this.handleTouchStart.bind(this),{passive:!1}),this.canvas.addEventListener("touchmove",this.handleTouchMove.bind(this),{passive:!1}),this.canvas.addEventListener("touchend",this.handleTouchEnd.bind(this)),this.canvas.addEventListener("touchcancel",this.handleTouchEnd.bind(this)),window.addEventListener("keydown",this.handleKeyDown.bind(this)),window.addEventListener("keyup",this.handleKeyUp.bind(this))}getCanvasRect(){return this.canvas.getBoundingClientRect()}getScreenCoords(e,t){const n=this.getCanvasRect();return[e-n.left,t-n.top]}getCanvasSize(){const e=this.getCanvasRect();return[e.width,e.height]}toFractalCoordsWithView(e,t,n,s,c){const r=n/s,h=(e/n-.5)*r,f=t/s-.5,p=c.centerX+h/c.zoom,d=c.centerY-f/c.zoom;return[p,d]}notifyChange(){this.onChange(this.viewState)}handleMouseDown(e){if(e.button!==0)return;const[t,n]=this.getScreenCoords(e.clientX,e.clientY);if(this.juliaPickerMode&&this.onJuliaPick){const[s,c]=this.getCanvasSize();this.juliaPickViewState={centerX:this.viewState.centerX,centerY:this.viewState.centerY,zoom:this.viewState.zoom};const[r,h]=this.toFractalCoordsWithView(t,n,s,c,this.juliaPickViewState);this.isPickingJulia=!0,this.lastX=t,this.lastY=n,this.onJuliaPick(r,h);return}this.isDragging=!0,this.lastX=t,this.lastY=n,this.canvas.style.cursor="grabbing"}handleMouseMove(e){const[t,n]=this.getScreenCoords(e.clientX,e.clientY);if(this.isPickingJulia&&this.onJuliaPick&&this.juliaPickViewState){const[f,p]=this.getCanvasSize(),[d,y]=this.toFractalCoordsWithView(t,n,f,p,this.juliaPickViewState);this.onJuliaPick(d,y),this.lastX=t,this.lastY=n;return}if(!this.isDragging)return;const s=t-this.lastX,c=n-this.lastY,[r,h]=this.getCanvasSize();this.viewState.pan(s,c,r,h),this.notifyChange(),this.lastX=t,this.lastY=n}handleMouseUp(){if(this.isPickingJulia){this.isPickingJulia=!1,this.juliaPickViewState=null,this.onJuliaPickEnd?.();return}this.isDragging&&(this.isDragging=!1,this.canvas.style.cursor="grab")}handleWheel(e){e.preventDefault();const[t,n]=this.getScreenCoords(e.clientX,e.clientY),s=e.deltaY>0?.9:1.1,c=O(s),[r,h]=this.getCanvasSize();this.viewState.zoomAt(t,n,c,r,h),this.notifyChange()}handleDoubleClick(e){const[t,n]=this.getScreenCoords(e.clientX,e.clientY),[s,c]=this.getCanvasSize();this.viewState.zoomToPoint(t,n,O(2),s,c),this.notifyChange()}getTouchDistance(e){if(e.length<2)return 0;const t=e[0].clientX-e[1].clientX,n=e[0].clientY-e[1].clientY;return Math.sqrt(t*t+n*n)}getTouchCenter(e){if(e.length===0)return[0,0];if(e.length===1)return this.getScreenCoords(e[0].clientX,e[0].clientY);const t=(e[0].clientX+e[1].clientX)/2,n=(e[0].clientY+e[1].clientY)/2;return this.getScreenCoords(t,n)}handleTouchStart(e){if(e.touches.length===1){this.isDragging=!0;const[t,n]=this.getScreenCoords(e.touches[0].clientX,e.touches[0].clientY);this.lastX=t,this.lastY=n}else e.touches.length===2&&(this.isDragging=!1,this.lastTouchDistance=this.getTouchDistance(e.touches))}handleTouchMove(e){if(e.preventDefault(),e.touches.length===1&&this.isDragging){const[t,n]=this.getScreenCoords(e.touches[0].clientX,e.touches[0].clientY),s=t-this.lastX,c=n-this.lastY,[r,h]=this.getCanvasSize();this.viewState.pan(s,c,r,h),this.notifyChange(),this.lastX=t,this.lastY=n}else if(e.touches.length===2){const t=this.getTouchDistance(e.touches),n=this.getTouchCenter(e.touches);if(this.lastTouchDistance>0){const s=t/this.lastTouchDistance,c=O(s),[r,h]=this.getCanvasSize();this.viewState.zoomAt(n[0],n[1],c,r,h),this.notifyChange()}this.lastTouchDistance=t}}handleTouchEnd(){this.isDragging=!1,this.lastTouchDistance=0}handleKeyDown(e){if(!(e.target instanceof HTMLInputElement||e.target instanceof HTMLTextAreaElement))switch(e.key){case"+":case"=":e.preventDefault(),this.onIterationAdjust?.(1);break;case"-":case"_":e.preventDefault(),this.onIterationAdjust?.(-1);break;case"0":e.preventDefault(),this.onIterationReset?.();break;case"c":e.preventDefault(),this.onCosinePaletteCycle?.(1);break;case"C":e.preventDefault(),this.onCosinePaletteCycle?.(-1);break;case"g":e.preventDefault(),this.onGradientPaletteCycle?.(1);break;case"G":e.preventDefault(),this.onGradientPaletteCycle?.(-1);break;case"[":case",":e.preventDefault(),this.onColorOffset?.(-.05);break;case"]":case".":e.preventDefault(),this.onColorOffset?.(.05);break;case"{":case"<":e.preventDefault(),this.onColorOffset?.(-.15);break;case"}":case">":e.preventDefault(),this.onColorOffset?.(.15);break;case"r":case"R":e.preventDefault(),this.onColorOffsetReset?.();break;case"a":case"A":e.preventDefault(),this.onToggleAA?.();break;case"b":e.preventDefault(),this.onAdjustHdrBrightness?.(1);break;case"B":e.preventDefault(),this.onAdjustHdrBrightness?.(-1);break;case"d":e.preventDefault(),this.onResetHdrBrightness?.();break;case"f":e.preventDefault(),this.onFractalCycle?.(1);break;case"F":e.preventDefault(),this.onFractalCycle?.(-1);break;case"j":case"J":e.preventDefault(),this.onToggleJuliaMode?.();break;case"s":case"S":e.preventDefault(),this.onShare?.();break;case"1":case"2":case"3":case"4":case"5":case"6":case"7":case"8":case"9":e.preventDefault(),this.onLocationSelect?.(e.key);break;case"h":case"H":e.preventDefault(),this.onToggleHelp?.();break;case" ":e.preventDefault(),this.onToggleScreenshotMode?.();break;case"z":e.preventDefault(),e.repeat||this.startKeyboardZoom(1);break;case"Z":e.preventDefault(),e.repeat||this.startKeyboardZoom(-1);break}}handleKeyUp(e){(e.key==="z"||e.key==="Z")&&this.stopKeyboardZoom()}startKeyboardZoom(e){this.keyboardZoomAnimationId!==null&&this.stopKeyboardZoom(),this.keyboardZoomDirection=e,this.keyboardZoomStartTime=performance.now(),this.keyboardZoomAnimationId=requestAnimationFrame(this.keyboardZoomLoop.bind(this))}stopKeyboardZoom(){this.keyboardZoomAnimationId!==null&&(cancelAnimationFrame(this.keyboardZoomAnimationId),this.keyboardZoomAnimationId=null),this.keyboardZoomDirection=null}keyboardZoomLoop(e){if(this.keyboardZoomDirection===null)return;const t=e-this.keyboardZoomStartTime;this.keyboardZoomStartTime=e;const s=this.keyboardZoomDirection*.7*(t/1e3),c=Math.exp(s),[r,h]=this.getCanvasSize();this.viewState.zoomAt(r/2,h/2,c,r,h),this.notifyChange(),this.keyboardZoomAnimationId=requestAnimationFrame(this.keyboardZoomLoop.bind(this))}destroy(){}}var a=(i=>(i[i.Mandelbrot=0]="Mandelbrot",i[i.MandelbrotJulia=1]="MandelbrotJulia",i[i.BurningShip=2]="BurningShip",i[i.BurningShipJulia=3]="BurningShipJulia",i[i.Tricorn=4]="Tricorn",i[i.TricornJulia=5]="TricornJulia",i[i.Celtic=6]="Celtic",i[i.CelticJulia=7]="CelticJulia",i[i.Buffalo=8]="Buffalo",i[i.BuffaloJulia=9]="BuffaloJulia",i[i.Phoenix=10]="Phoenix",i[i.PhoenixJulia=11]="PhoenixJulia",i[i.Multibrot3=12]="Multibrot3",i[i.Multibrot3Julia=13]="Multibrot3Julia",i[i.Multibrot4=14]="Multibrot4",i[i.Multibrot4Julia=15]="Multibrot4Julia",i[i.Funky=16]="Funky",i[i.FunkyJulia=17]="FunkyJulia",i[i.Perpendicular=18]="Perpendicular",i[i.PerpendicularJulia=19]="PerpendicularJulia",i))(a||{});const Q={0:"Mandelbrot",1:"Mandelbrot Julia",2:"Burning Ship",3:"Burning Ship Julia",4:"Tricorn",5:"Tricorn Julia",6:"Celtic",7:"Celtic Julia",8:"Buffalo",9:"Buffalo Julia",10:"Phoenix",11:"Phoenix Julia",12:"Multibrot (z³)",13:"Multibrot³ Julia",14:"Multibrot (z⁴)",15:"Multibrot⁴ Julia",16:"Funky",17:"Funky Julia",18:"Perpendicular",19:"Perpendicular Julia"},J=10;function T(i){return(i&1)===1}function M(i){return i&-2}function ee(i){return i|1}const u={TYPE:"t",CENTER_X:"x",CENTER_Y:"y",ZOOM:"z",PALETTE:"p",PALETTE_TYPE:"pt",COSINE_PALETTE:"cp",GRADIENT_PALETTE:"gp",COLOR_OFFSET:"o",JULIA_REAL:"jr",JULIA_IMAG:"ji",ITERATIONS:"i",AA:"aa"};function x(i,e=15){return i===0?"0":Math.abs(i)<1e-10||Math.abs(i)>1e10?i.toExponential(e):parseFloat(i.toPrecision(e)).toString()}function g(i){if(i===null||i==="")return null;const e=parseFloat(i);return isNaN(e)?null:e}function G(i){const e=new URLSearchParams;return e.set(u.TYPE,i.fractalType.toString()),e.set(u.CENTER_X,x(i.centerX)),e.set(u.CENTER_Y,x(i.centerY)),e.set(u.ZOOM,x(i.zoom)),e.set(u.PALETTE_TYPE,i.paletteType==="cosine"?"c":"g"),e.set(u.COSINE_PALETTE,i.cosinePaletteIndex.toString()),e.set(u.GRADIENT_PALETTE,i.gradientPaletteIndex.toString()),Math.abs(i.colorOffset)>.001&&e.set(u.COLOR_OFFSET,x(i.colorOffset,4)),T(i.fractalType)&&(e.set(u.JULIA_REAL,x(i.juliaC[0])),e.set(u.JULIA_IMAG,x(i.juliaC[1]))),i.maxIterationsOverride!==null&&e.set(u.ITERATIONS,i.maxIterationsOverride.toString()),i.aaEnabled&&e.set(u.AA,"1"),e.toString()}function te(i){const e=new URLSearchParams(i.replace(/^#/,"")),t={},n=g(e.get(u.TYPE));n!==null&&n>=0&&n<=19&&(t.fractalType=n);const s=g(e.get(u.CENTER_X));s!==null&&(t.centerX=s);const c=g(e.get(u.CENTER_Y));c!==null&&(t.centerY=c);const r=g(e.get(u.ZOOM));r!==null&&r>0&&(t.zoom=r);const h=e.get(u.PALETTE_TYPE);(h==="c"||h==="g")&&(t.paletteType=h==="c"?"cosine":"gradient");const f=g(e.get(u.COSINE_PALETTE));f!==null&&f>=0&&(t.cosinePaletteIndex=Math.floor(f));const p=g(e.get(u.GRADIENT_PALETTE));p!==null&&p>=0&&(t.gradientPaletteIndex=Math.floor(p));const d=g(e.get(u.PALETTE));d!==null&&d>=0&&d<=11&&(t.paletteIndex=Math.floor(d));const y=g(e.get(u.COLOR_OFFSET));y!==null&&(t.colorOffset=y);const z=g(e.get(u.JULIA_REAL)),b=g(e.get(u.JULIA_IMAG));z!==null&&b!==null&&(t.juliaC=[z,b]);const m=g(e.get(u.ITERATIONS));return m!==null&&m>0&&(t.maxIterationsOverride=Math.floor(m)),e.get(u.AA)==="1"&&(t.aaEnabled=!0),t}function ie(i){const e=G(i),t=new URL(window.location.href);return t.hash=e,t.toString()}function ne(i){const e=G(i);window.history.replaceState(null,"","#"+e)}function ae(){return te(window.location.hash)}async function re(i){const e=ie(i);try{return await navigator.clipboard.writeText(e),!0}catch{const t=document.createElement("textarea");t.value=e,t.style.position="fixed",t.style.left="-9999px",document.body.appendChild(t),t.select();try{return document.execCommand("copy"),!0}catch{return!1}finally{document.body.removeChild(t)}}}function l(i,e,t,n,s,c,r,h={}){return{name:i,description:e,key:t,state:{fractalType:n,centerX:s,centerY:c,zoom:r,paletteType:h.paletteType??"cosine",cosinePaletteIndex:h.cosinePaletteIndex??1,gradientPaletteIndex:h.gradientPaletteIndex??0,colorOffset:h.colorOffset??0,juliaC:h.juliaC??[-.7,.27015],maxIterationsOverride:h.maxIterationsOverride??null,aaEnabled:!1}}}const oe=[l("Mandelbrot","The famous Mandelbrot set","1",a.Mandelbrot,-.5,0,.4),l("Seahorse Valley","The iconic seahorse-shaped spirals","2",a.Mandelbrot,-.7581249305506096,.11244273987387937,36.41989684959737,{cosinePaletteIndex:5,colorOffset:.05}),l("Elephant Valley","Elephant trunk-like spirals on the positive real side","3",a.Mandelbrot,.2746341335933571,.0066936145282295205,212.15493874953236,{cosinePaletteIndex:3,colorOffset:-.1}),l("Double Spiral Valley","Beautiful double spirals deep in the set","4",a.Mandelbrot,-.743733589978665,.130905227502858,350,{cosinePaletteIndex:5,colorOffset:.15000000000000002}),l("Spiral Galaxy","Galactic spiral arms emerging from chaos","5",a.Mandelbrot,-.7615484049386866,-.08478444765887823,1506.4927460380957,{cosinePaletteIndex:4,colorOffset:.04999999999999999}),l("Douady Rabbit","The famous rabbit-eared Julia set","6",a.MandelbrotJulia,0,0,.6,{cosinePaletteIndex:4,colorOffset:.2,juliaC:[-.123,.745]}),l("Dragon Julia","Fierce dragon-like Julia set","7",a.MandelbrotJulia,0,0,.45,{cosinePaletteIndex:3,colorOffset:-.49999999999999994,juliaC:[-.8,.156]}),l("Spiral Julia","Delicate spiral arms from the main cardioid edge","8",a.MandelbrotJulia,0,0,.5,{cosinePaletteIndex:8,colorOffset:.65,juliaC:[-.75,.11]}),l("Dendrite Julia","Tree-like branching structure on the real axis","9",a.MandelbrotJulia,0,0,.41791083585808675,{cosinePaletteIndex:5,colorOffset:.1,juliaC:[.285,.01]})],se=[l("Main Ship","The iconic burning ship silhouette","1",a.BurningShip,-.6819541375872399,.5906040268456356,.4,{cosinePaletteIndex:4,colorOffset:.3}),l("The Armada","Mini ships along the antenna","2",a.BurningShip,-1.80173025652805,.0153452534367207,9,{cosinePaletteIndex:4,colorOffset:.2}),l("Bow Detail","Intricate patterns at the ship's bow","3",a.BurningShip,-1.7500929615866607,.0368035491770765,10,{cosinePaletteIndex:10,colorOffset:.1}),l("Bacteria Worm","Worm-like structures with mosaic patterns","4",a.BurningShipJulia,0,0,.3,{cosinePaletteIndex:10,colorOffset:-.5499999999999998,juliaC:[.5179709888623353,.8057669844188748]}),l("Wispy Coils","Wispy coils near the bulbous extrusion from the ship","5",a.BurningShipJulia,0,0,.4,{cosinePaletteIndex:4,colorOffset:.35,juliaC:[.2525994076160102,.0006358222328731386]}),l("Space Brain","Brain-like structures from the bottom of the ship","6",a.BurningShipJulia,0,0,.7,{cosinePaletteIndex:5,colorOffset:.3,juliaC:[-1.059944784917394,-.033218825489255054]}),l("Spiral Patterns","Spiral patterns near the bulbous extrusion","7",a.BurningShipJulia,0,0,.41,{cosinePaletteIndex:11,colorOffset:.55,juliaC:[.28292507376881926,-.007597008191683113]}),l("Detailed Patterns","Beautiful detailed patterns near the bottom of the ship","8",a.BurningShipJulia,0,0,.5,{cosinePaletteIndex:2,colorOffset:.6,juliaC:[-.3967192382583807,-.09102348993288789]})],le=[l("Tricorn","The main tricorn shape with its distinctive three-cornered symmetry","1",a.Tricorn,-.1343398614022916,-.07051105375213641,.24,{cosinePaletteIndex:11,colorOffset:-.45}),l("Skewed Mandelbrot","Skewed Mandelbrot from one of the main bulbs","2",a.Tricorn,-1.0683098234816064,.13055543771605108,722.5553792774821,{cosinePaletteIndex:5,colorOffset:1.1}),l("Lightning Bolts","Lightning bolt-like patterns near the main cardioid edge","3",a.TricornJulia,0,0,.5,{cosinePaletteIndex:5,colorOffset:1.2,juliaC:[-.7092474160797806,-.113024316756254]}),l("Water Lily Leaf","Leaf-like structures from the center of the edge of the main cardioid","4",a.TricornJulia,0,0,.43,{colorOffset:-.7000000000000003,juliaC:[-.1254330794660274,.2407433439223678]}),l("Lightning Brain","Brain-like structures","5",a.TricornJulia,0,0,3.15,{cosinePaletteIndex:5,juliaC:[.8748878776979363,-1.515483485507111]}),l("Spiral Mosaic","Mosaic patterns from the base of one of the main bulbs","6",a.TricornJulia,0,0,.5,{cosinePaletteIndex:11,colorOffset:1.55,juliaC:[-.5647012802389192,-.06508603367125808]}),l("Electric Tendrils","Electric tendril patterns with bright highlights","7",a.TricornJulia,0,0,.5,{cosinePaletteIndex:4,colorOffset:.05,juliaC:[-.511125124692869,.0500484416152959]})],ce=[l("Celtic Knot","The main Celtic fractal shape","1",a.Celtic,-.5,0,.25,{cosinePaletteIndex:10,colorOffset:.05}),l("Celtic Detail","Intricate knotwork patterns","2",a.Celtic,-.7803221774980102,.1635662989215261,119.01480682794772,{cosinePaletteIndex:10,colorOffset:.25,maxIterationsOverride:1e4}),l("Leafy Spirals","Symmetric shapes from the tip of the celtic shape","3",a.CelticJulia,0,0,.55,{cosinePaletteIndex:7,colorOffset:.1,juliaC:[.25345198072532704,.0001580704105713714]}),l("Tendrils","Tendrils emerging from fog","4",a.CelticJulia,-.1649932591722856,-.033582161161888655,.28,{cosinePaletteIndex:5,juliaC:[-.4530201342281876,-.8993288590604025]}),l("Electric Buzz","Electric patterns with uniform patterned regions","5",a.CelticJulia,.2,-.3,.55,{colorOffset:.2000000000000001,juliaC:[-.6378073937333775,1.2082886796996293]}),l("Intricate Patterns","Knotwork patterns with intricate details","6",a.CelticJulia,0,0,.52,{cosinePaletteIndex:10,colorOffset:3.299999999999996,juliaC:[-.7610237673309276,.12050023730653406]}),l("Petri Dish","Bacteria-like patterns that spread outwards","7",a.CelticJulia,0,0,.55,{cosinePaletteIndex:10,colorOffset:4.449999999999991,juliaC:[-1.056655765809614,-.16855216053399263]})],he=[l("Buffalo Overview","The distinctive Buffalo fractal shape","1",a.Buffalo,-.7,.6,.4,{cosinePaletteIndex:2,colorOffset:.49999999999999994}),l("Overgrown Cities","Tree or cathedral-like structures emerging from real axis","2",a.Buffalo,-1.75,.13,2.4,{colorOffset:-5}),l("Industrial Snowflake","Snowflake-like patterns with industrial structures woven in","3",a.BuffaloJulia,.45,0,.85,{cosinePaletteIndex:4,colorOffset:-9.1,juliaC:[-1.62727125821226,.00873720402364775]}),l("Plasma Bursts","Plasma-like bursts of color","4",a.BuffaloJulia,0,0,.5,{cosinePaletteIndex:8,colorOffset:-.75,juliaC:[.2745030250648227,.1797320656871218]}),l("Intricate Patterns","Intricate patterns near the bottom of the main shape","5",a.BuffaloJulia,0,0,.5,{cosinePaletteIndex:4,colorOffset:4.25,juliaC:[-.5828307625231954,-.3049842077590671]}),l("Seed Pods","Spirals bursting with seeds","6",a.BuffaloJulia,0,0,.6,{cosinePaletteIndex:3,colorOffset:-.75,juliaC:[.3056228373702423,-.007698961937716242]})],de=[l("Phoenix Overview","The Phoenix parameter space","1",a.Phoenix,-.15,-.7,.25,{cosinePaletteIndex:5,colorOffset:-.65}),l("Classic Phoenix Julia","The iconic feathery Phoenix fractal","2",a.PhoenixJulia,0,0,.5,{cosinePaletteIndex:2,colorOffset:.45,juliaC:[-.5,.5667],maxIterationsOverride:1152}),l("Phoenix Feathers","Detailed feather-like structures","3",a.PhoenixJulia,.38,.07,3.4,{cosinePaletteIndex:5,juliaC:[-.5,.5667]}),l("Golden Weaves","Bright golden patterns with intricate weaves","4",a.PhoenixJulia,0,.08,.4,{cosinePaletteIndex:2,colorOffset:.35,juliaC:[.656142759731905,.0353380147311402]}),l("Fiery Phoenix","Fiery wings spreading outwards","5",a.PhoenixJulia,0,-.03,.6,{cosinePaletteIndex:4,colorOffset:-1.7,juliaC:[-.272349453272398,.4059142585519806]})],ue=[l("Multibrot³ Overview","The three-fold symmetric z³ Multibrot","1",a.Multibrot3,0,0,.35,{cosinePaletteIndex:5,colorOffset:2.35}),l("The Bulb","A bulbous extrusion from the main shape","2",a.Multibrot3,.5852686308492299,.27,6,{colorOffset:.10000000000000002}),l("Three-fold Spirals","Bright pearly spirals with three-fold symmetry","3",a.Multibrot3Julia,0,0,.4,{cosinePaletteIndex:10,colorOffset:.15,juliaC:[.5448826747676219,.26362559338015445]}),l("Multibrot³ Julia","A Julia set with three-fold symmetry","4",a.Multibrot3Julia,0,0,.434,{cosinePaletteIndex:5,colorOffset:.10000000000000002,juliaC:[-.45963436785036077,.03389484474578987]}),l("Double Elephant Valley","Two elephants in each group","5",a.Multibrot3,.42814685603247177,.012748071569601296,77,{cosinePaletteIndex:3,colorOffset:1}),l("Wonky Spiral","Wonky spiral Julia structure from inside the main set","6",a.Multibrot3Julia,.3695408370900379,.3371264555793177,2.274691481464049,{cosinePaletteIndex:0,colorOffset:0,juliaC:[.5277614770068884,.15853942850341446],maxIterationsOverride:2124}),l("Spiral Galaxies","The wonky spiral Julia structure viewed as galaxies","7",a.Multibrot3Julia,0,0,.4,{paletteType:"gradient",juliaC:[.5277614770068884,.15853942850341446],maxIterationsOverride:1152})],fe=[l("Multibrot⁴ Overview","The four-fold symmetric z⁴ Multibrot","1",a.Multibrot4,0,0,.4,{cosinePaletteIndex:5,colorOffset:0}),l("Atomic Spirals","Structures resembling atomic orbitals with spiral patterns","2",a.Multibrot4Julia,0,-0,.35,{cosinePaletteIndex:5,colorOffset:.4,juliaC:[-.7878865573262246,.02073442187254452]}),l("Triple Elephant Valley","Now there's three elephants in each group!","3",a.Multibrot4,-.2726362830546699,.44295218397589975,42,{cosinePaletteIndex:3}),l("Starscape","Spiraling galaxies surrounding a black hole","4",a.Multibrot4Julia,0,0,.5,{paletteType:"gradient",juliaC:[.634977850702787,.194816172925824],maxIterationsOverride:1152}),l("Static Burst","Burst of electricity","5",a.Multibrot4Julia,0,0,.4,{colorOffset:-1.7500000000000009,juliaC:[-.6179887054490777,.487166930716755]})],pe=[l("Funky Overview","The wonderfully weird Funky fractal","1",a.Funky,-.5,0,.35,{cosinePaletteIndex:4,colorOffset:.25}),l("Tulip Bulb","Extrusions resembling tulips near the top of the main shape","2",a.Funky,.303,.534,6.3,{cosinePaletteIndex:10,colorOffset:-.05000000000000002}),l("Battleship","Spaceship-like structure with double turrets all around","3",a.FunkyJulia,0,0,.45,{cosinePaletteIndex:4,colorOffset:-.7,juliaC:[-1.02568231965141,.128286053018475]}),l("Frog Crab","Crablike structure with brain-like spiral patterns within it","4",a.FunkyJulia,0,0,.37,{colorOffset:.1,juliaC:[.30191025227457674,.5253550579235958]}),l("Spiral Details","Beautiful spiral details without too much clutter","5",a.FunkyJulia,-.2,0,.4,{cosinePaletteIndex:5,colorOffset:.6,juliaC:[-.06404194046216194,.662960137583706]}),l("Migrating Birds","Bird-like shapes flying in formation","6",a.FunkyJulia,.34,0,.35,{cosinePaletteIndex:5,colorOffset:4.4,juliaC:[.5804003550040334,-.9094296635818582]}),l("Glittering Coral","Brightly gleaming coral-like structures","7",a.FunkyJulia,0,0,.5,{cosinePaletteIndex:11,colorOffset:-.39999999999999997,juliaC:[-.45427582797825017,-.06920415224913506]})],ge=[l("Perpendicular Overview","The Perpendicular Mandelbrot variant","1",a.Perpendicular,-.5,0,.32,{cosinePaletteIndex:2,colorOffset:0}),l("Seed Pod","A pod-like structure near the head of the main shape","2",a.Perpendicular,-.7734996631118647,.12393043736115505,250,{cosinePaletteIndex:5}),l("Bird of Prey","Waveform bird flying out to get you","3",a.PerpendicularJulia,0,0,.35,{cosinePaletteIndex:4,colorOffset:.14999999999999986,juliaC:[-1.2870593206662457,.022288689289989876]}),l("Old Dragon","Bird-like shape with leathery frayed wings","4",a.PerpendicularJulia,0,0,.3913248754208607,{cosinePaletteIndex:5,colorOffset:.44999999999999996,juliaC:[-1.0197782349577895,-.13982096184940793]}),l("Peacock Eyes","Glowing eyes of a brightly coloured peacock","5",a.PerpendicularJulia,0,-.8821542839734092,2.8,{cosinePaletteIndex:11,juliaC:[.25987719401314263,-.17615047146201984]}),l("Mask of the Ancients","A detailed mask with intricate patterns","6",a.PerpendicularJulia,0,0,.42,{cosinePaletteIndex:2,colorOffset:-.1,juliaC:[.3021983882651174,.4025604479726435]})],me=new Map([[a.Mandelbrot,oe],[a.BurningShip,se],[a.Tricorn,le],[a.Celtic,ce],[a.Buffalo,he],[a.Phoenix,de],[a.Multibrot3,ue],[a.Multibrot4,fe],[a.Funky,pe],[a.Perpendicular,ge]]);function L(i,e){const t=M(e),n=me.get(t);if(n)return n.find(s=>s.key===i)}const w=[{name:"Rainbow",isMonotonic:!1,params:{type:"cosine",a:[.5,.5,.5],b:[.5,.5,.5],c:[1,1,1],d:[0,.33,.67]}},{name:"Fire",isMonotonic:!1,params:{type:"cosine",a:[.5,.5,.5],b:[.5,.5,.5],c:[1,1,.5],d:[0,.1,.2]}},{name:"Ice",isMonotonic:!1,params:{type:"cosine",a:[.5,.5,.5],b:[.5,.5,.5],c:[1,.7,.4],d:[0,.15,.2]}},{name:"Sunset",isMonotonic:!1,params:{type:"cosine",a:[.5,.3,.2],b:[.5,.4,.3],c:[1,1,.5],d:[0,.1,.2]}},{name:"Electric",isMonotonic:!1,params:{type:"cosine",a:[.5,.5,.5],b:[.6,.6,.6],c:[1,1,1],d:[.3,.2,.2]}},{name:"Neon",isMonotonic:!1,params:{type:"cosine",a:[.5,.5,.5],b:[.5,.5,.5],c:[1,1,1],d:[0,.1,.2]}},{name:"Emerald",isMonotonic:!1,params:{type:"cosine",a:[.2,.5,.3],b:[.3,.5,.3],c:[1,1,1],d:[0,.25,.5]}},{name:"Candy",isMonotonic:!1,params:{type:"cosine",a:[.8,.5,.5],b:[.2,.4,.4],c:[1,1,2],d:[0,.25,.25]}},{name:"Plasma",isMonotonic:!1,params:{type:"cosine",a:[.5,.5,.5],b:[.5,.5,.5],c:[2,1,0],d:[.5,.2,.25]}},{name:"Peacock",isMonotonic:!1,params:{type:"cosine",a:[.3,.5,.5],b:[.4,.4,.3],c:[1,1,1],d:[0,.1,.35]}},{name:"Autumn",isMonotonic:!1,params:{type:"cosine",a:[.6,.4,.2],b:[.4,.3,.2],c:[1,1,1],d:[0,.05,.1]}},{name:"Aurora",isMonotonic:!1,params:{type:"cosine",a:[.3,.5,.5],b:[.5,.5,.5],c:[1,1,.5],d:[.8,.9,.3]}}],k=[{name:"Blue",isMonotonic:!0,params:{type:"gradient",c1:[.02,.01,.08],c2:[.05,.15,.25],c3:[.1,.4,.5],c4:[.3,.6,.8],c5:[.7,.9,1]},hdrParams:{type:"gradient",c1:[.2,.4,1],c2:[.3,.6,1],c3:[.4,.8,1],c4:[.6,.9,1],c5:[.85,1,1]}},{name:"Gold",isMonotonic:!0,params:{type:"gradient",c1:[.04,.02,.01],c2:[.2,.08,.02],c3:[.5,.25,.05],c4:[.85,.6,.2],c5:[1,.95,.7]},hdrParams:{type:"gradient",c1:[1,.5,.1],c2:[1,.65,.2],c3:[1,.8,.3],c4:[1,.9,.5],c5:[1,1,.8]}},{name:"Grayscale",isMonotonic:!0,params:{type:"gradient",c1:[.01,.01,.03],c2:[.15,.15,.17],c3:[.45,.45,.45],c4:[.75,.74,.72],c5:[1,.98,.95]},hdrParams:{type:"gradient",c1:[1,1,1],c2:[1,1,1],c3:[1,1,1],c4:[1,1,1],c5:[1,1,1]}},{name:"Sepia",isMonotonic:!0,params:{type:"gradient",c1:[.03,.02,.01],c2:[.15,.08,.03],c3:[.4,.25,.12],c4:[.7,.55,.35],c5:[1,.95,.85]},hdrParams:{type:"gradient",c1:[1,.7,.4],c2:[1,.8,.55],c3:[1,.88,.7],c4:[1,.95,.85],c5:[1,1,.95]}},{name:"Ocean",isMonotonic:!0,params:{type:"gradient",c1:[0,.02,.05],c2:[.02,.08,.2],c3:[.05,.3,.4],c4:[.2,.6,.6],c5:[.6,.95,.9]},hdrParams:{type:"gradient",c1:[.1,.8,.8],c2:[.2,.9,.85],c3:[.4,.95,.9],c4:[.65,1,.95],c5:[.85,1,1]}},{name:"Purple",isMonotonic:!0,params:{type:"gradient",c1:[.03,.01,.06],c2:[.15,.05,.25],c3:[.4,.15,.5],c4:[.7,.4,.75],c5:[.95,.8,1]},hdrParams:{type:"gradient",c1:[.8,.2,1],c2:[.85,.4,1],c3:[.9,.6,1],c4:[.95,.8,1],c5:[1,.95,1]}},{name:"Forest",isMonotonic:!0,params:{type:"gradient",c1:[.02,.03,.01],c2:[.05,.12,.04],c3:[.1,.35,.15],c4:[.3,.65,.3],c5:[.7,.95,.6]},hdrParams:{type:"gradient",c1:[.3,1,.2],c2:[.5,1,.4],c3:[.7,1,.55],c4:[.85,1,.75],c5:[.95,1,.9]}}],C=w.length,P=k.length;function ye(i){return w[i%C].params}function be(i,e){const t=k[i%P];return e&&t.hdrParams?t.hdrParams:t.params}function ve(i){return w[i%C]}function xe(i){return k[i%P]}function Ce(i){return w[i%C].name}function Pe(i){return k[i%P].name}const Te=`// WebGPU Shader for Mandelbrot Set with HDR support\r
// Version 2: Palette parameters passed from TypeScript (no branching)\r
\r
struct Uniforms {\r
  resolution: vec2f,         // offset 0, size 8\r
  center: vec2f,             // offset 8, size 8\r
  zoom: f32,                 // offset 16, size 4\r
  maxIterations: i32,        // offset 20, size 4\r
  time: f32,                 // offset 24, size 4\r
  colorOffset: f32,          // offset 28, size 4\r
  fractalType: i32,          // offset 32, size 4\r
  _pad_jc: f32,              // offset 36, size 4 (padding for juliaC alignment)\r
  juliaC: vec2f,             // offset 40, size 8\r
  hdrEnabled: i32,           // offset 48, size 4\r
  hdrBrightnessBias: f32,    // offset 52, size 4\r
  paletteType: i32,          // offset 56, size 4\r
  isMonotonic: i32,          // offset 60, size 4\r
  sdrGradientBrightness: f32, // offset 64, size 4\r
  _pad0: f32,                // offset 68, size 4\r
  _pad1: f32,                // offset 72, size 4\r
  _pad2: f32,                // offset 76, size 4\r
  // Now at offset 80 = 16-byte aligned for vec3f\r
  // Cosine palette: color = a + b * cos(2π * (c * t + d))\r
  paletteA: vec3f,           // offset 80, size 12\r
  _padA: f32,                // offset 92, size 4\r
  paletteB: vec3f,           // offset 96, size 12\r
  _padB: f32,                // offset 108, size 4\r
  paletteC: vec3f,           // offset 112, size 12\r
  _padC: f32,                // offset 124, size 4\r
  paletteD: vec3f,           // offset 128, size 12\r
  _padD: f32,                // offset 140, size 4\r
  // Gradient palette: 5 color stops (offset 144)\r
  gradientC1: vec3f,         // offset 144, size 12\r
  _padG1: f32,               // offset 156, size 4\r
  gradientC2: vec3f,         // offset 160, size 12\r
  _padG2: f32,               // offset 172, size 4\r
  gradientC3: vec3f,         // offset 176, size 12\r
  _padG3: f32,               // offset 188, size 4\r
  gradientC4: vec3f,         // offset 192, size 12\r
  _padG4: f32,               // offset 204, size 4\r
  gradientC5: vec3f,         // offset 208, size 12\r
  _padG5: f32,               // offset 220, size 4\r
}\r
\r
@group(0) @binding(0) var<uniform> u: Uniforms;\r
\r
struct VertexOutput {\r
  @builtin(position) position: vec4f,\r
  @location(0) uv: vec2f,\r
}\r
\r
@vertex\r
fn vertexMain(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {\r
  var pos = array<vec2f, 3>(\r
    vec2f(-1.0, -1.0),\r
    vec2f(3.0, -1.0),\r
    vec2f(-1.0, 3.0)\r
  );\r
  var output: VertexOutput;\r
  output.position = vec4f(pos[vertexIndex], 0.0, 1.0);\r
  output.uv = (pos[vertexIndex] + 1.0) * 0.5;\r
  return output;\r
}\r
\r
// Cosine palette formula\r
fn cosineColor(t: f32, a: vec3f, b: vec3f, c: vec3f, d: vec3f) -> vec3f {\r
  return a + b * cos(6.28318 * (c * t + d));\r
}\r
\r
// 5-stop gradient\r
fn gradientColor(t: f32, c1: vec3f, c2: vec3f, c3: vec3f, c4: vec3f, c5: vec3f) -> vec3f {\r
  if (t < 0.25) { return mix(c1, c2, t * 4.0); }\r
  else if (t < 0.5) { return mix(c2, c3, (t - 0.25) * 4.0); }\r
  else if (t < 0.75) { return mix(c3, c4, (t - 0.5) * 4.0); }\r
  else { return mix(c4, c5, (t - 0.75) * 4.0); }\r
}\r
\r
// Get color based on palette type\r
fn getColor(t_in: f32, isCycling: bool) -> vec3f {\r
  var t = t_in;\r
  if (isCycling) {\r
    t = fract(t);\r
  } else {\r
    t = clamp(t, 0.0, 1.0);\r
  }\r
\r
  if (u.paletteType == 0) {\r
    return cosineColor(t, u.paletteA, u.paletteB, u.paletteC, u.paletteD);\r
  } else {\r
    var color = gradientColor(t, u.gradientC1, u.gradientC2, u.gradientC3, u.gradientC4, u.gradientC5);\r
    // Apply SDR gradient brightness adjustment (only affects SDR mode)\r
    if (u.hdrEnabled == 0) {\r
      color = color * u.sdrGradientBrightness;\r
    }\r
    return color;\r
  }\r
}\r
\r
// HDR brightness curve for MONOTONIC palettes\r
// bias: -1 to +1, shifts the bright region earlier (positive) or later (negative)\r
fn hdrBrightnessCurveMonotonic(normalized: f32, bias: f32) -> f32 {\r
  // Shift the normalized value by bias to move bright regions\r
  // bias > 0: more of the image becomes bright (bright region starts earlier)\r
  // bias < 0: less of the image is bright (bright region starts later)\r
  let shifted = clamp(normalized + bias * 0.4, 0.0, 1.0);\r
\r
  let LOW_END = 0.05;\r
  let MID_START = 0.30;\r
  let HIGH_START = 0.60;\r
  let PEAK = 10.0; // Fixed peak multiplier for HDR\r
\r
  if (shifted < LOW_END) {\r
    let t = shifted / LOW_END;\r
    return mix(0.0, 0.15, sqrt(t));\r
  } else if (shifted < MID_START) {\r
    let t = (shifted - LOW_END) / (MID_START - LOW_END);\r
    return mix(0.15, 0.5, t);\r
  } else if (shifted < HIGH_START) {\r
    let t = (shifted - MID_START) / (HIGH_START - MID_START);\r
    return mix(0.5, 1.0, t);\r
  } else {\r
    let t = (shifted - HIGH_START) / (1.0 - HIGH_START);\r
    let eased = pow(t, 1.1);\r
    return mix(1.0, PEAK, eased);\r
  }\r
}\r
\r
// HDR brightness curve for CYCLING palettes\r
// bias: -1 to +1, shifts the HDR highlight region\r
fn hdrBrightnessCurveCycling(normalized: f32, bias: f32) -> f32 {\r
  // Shift where the HDR boost kicks in\r
  // bias > 0: HDR highlights appear earlier (more of image gets boost)\r
  // bias < 0: HDR highlights appear later (only near-boundary gets boost)\r
  let HIGH_START = clamp(0.70 - bias * 0.25, 0.3, 0.95);\r
  let PEAK = 10.0; // Fixed peak multiplier for HDR\r
\r
  if (normalized < HIGH_START) {\r
    let t = normalized / HIGH_START;\r
    return mix(0.85, 1.0, t);\r
  } else {\r
    let t = (normalized - HIGH_START) / (1.0 - HIGH_START);\r
    let eased = pow(t, 1.2);\r
    return mix(1.0, PEAK, eased);\r
  }\r
}\r
\r
@fragment\r
fn fragmentMain(input: VertexOutput) -> @location(0) vec4f {\r
  let aspect = u.resolution.x / u.resolution.y;\r
  var uv = input.uv - 0.5;\r
  uv.x *= aspect;\r
  let pos = u.center + uv / u.zoom;\r
\r
  var z: vec2f;\r
  var c: vec2f;\r
  var zPrev: vec2f = vec2f(0.0); // For Phoenix fractal\r
\r
  // Determine if this is a Julia variant (odd types have bit 0 set)\r
  let fType = u.fractalType;\r
  let isJulia = (fType & 1) == 1;\r
  let baseType = fType >> 1; // 0=Mandelbrot, 1=BurningShip, 2=Tricorn, etc.\r
\r
  // Phoenix is naturally Julia-style - always start z at pixel position\r
  let isPhoenix = baseType == 5;\r
\r
  if (isJulia) {\r
    // For Phoenix Julia, swap and negate to match conventional orientation\r
    // (feathers extending horizontally, correct vertical orientation)\r
    if (isPhoenix) {\r
      z = vec2f(-pos.y, pos.x);  // Rotate 90° CCW to match reference images\r
    } else {\r
      z = pos;\r
    }\r
    c = u.juliaC;\r
  } else {\r
    z = vec2f(0.0);\r
    c = pos;\r
  }\r
\r
  var iterations = 0;\r
  let maxIter = u.maxIterations;\r
\r
  for (var i = 0; i < 65536; i++) {\r
    if (i >= maxIter) { break; }\r
    let zMagSq = dot(z, z);\r
    if (zMagSq > 256.0) { break; } // Larger escape for higher powers\r
\r
    let zTemp = z;\r
\r
    // Fractal type dispatch using base type (fType >> 1 clears Julia bit)\r
    // 0: Mandelbrot/Julia, 1: Burning Ship, 2: Tricorn, 3: Celtic,\r
    // 4: Buffalo, 5: Phoenix, 6: Multibrot3, 7: Multibrot4, 8: Perpendicular\r
\r
    if (baseType == 0) {\r
      // Mandelbrot / Julia: z² + c\r
      z = vec2f(z.x * z.x - z.y * z.y + c.x, 2.0 * z.x * z.y + c.y);\r
    }\r
    else if (baseType == 1) {\r
      // Burning Ship: |z|² + c (take abs before squaring)\r
      z = vec2f(abs(z.x), -abs(z.y));\r
      z = vec2f(z.x * z.x - z.y * z.y + c.x, 2.0 * z.x * z.y + c.y);\r
    }\r
    else if (baseType == 2) {\r
      // Tricorn: conj(z)² + c\r
      z = vec2f(z.x * z.x - z.y * z.y + c.x, -2.0 * z.x * z.y + c.y);\r
    }\r
    else if (baseType == 3) {\r
      // Celtic: |Re(z²)| + Im(z²)i + c\r
      let zSqReal = z.x * z.x - z.y * z.y;\r
      let zSqImag = 2.0 * z.x * z.y;\r
      z = vec2f(abs(zSqReal) + c.x, zSqImag + c.y);\r
    }\r
    else if (baseType == 4) {\r
      // Buffalo: |Re(z²)| - |Im(z²)|i + c\r
      let zSqReal = z.x * z.x - z.y * z.y;\r
      let zSqImag = 2.0 * z.x * z.y;\r
      z = vec2f(abs(zSqReal) + c.x, -abs(zSqImag) + c.y);\r
    }\r
    else if (baseType == 5) {\r
      // Phoenix: z_{n+1} = z_n² + p + q * z_{n-1}\r
      // Classic formula from Shigehiro Ushiki\r
      // We swap real/imag to rotate 90° and match conventional orientation\r
      // where the "beak" points right and "feathers" extend horizontally\r
      let p = c.y;  // Swapped: use imag as real constant\r
      let q = c.x;  // Swapped: use real as coupling constant\r
      let zSq = vec2f(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y);\r
      let newZ = vec2f(\r
        zSq.x + p + q * zPrev.x,\r
        zSq.y + q * zPrev.y\r
      );\r
      zPrev = z;\r
      z = newZ;\r
    }\r
    else if (baseType == 6) {\r
      // Multibrot3: z³ + c\r
      let zSq = vec2f(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y);\r
      z = vec2f(z.x * zSq.x - z.y * zSq.y + c.x, z.x * zSq.y + z.y * zSq.x + c.y);\r
    }\r
    else if (baseType == 7) {\r
      // Multibrot4: z⁴ + c\r
      let zSq = vec2f(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y);\r
      z = vec2f(zSq.x * zSq.x - zSq.y * zSq.y + c.x, 2.0 * zSq.x * zSq.y + c.y);\r
    }\r
    else if (baseType == 8) {\r
      // Funky Mandelbrot (happy accident!): Re(z) + |Im(z)|i then square\r
      z = vec2f(z.x, abs(z.y));\r
      z = vec2f(z.x * z.x - z.y * z.y + c.x, 2.0 * z.x * z.y + c.y);\r
    }\r
    else if (baseType == 9) {\r
      // Perpendicular Mandelbrot: (|Re(z)| - i·Im(z))² + c\r
      // w = |x| - iy, w² = |x|² - y² - 2|x|yi\r
      let ax = abs(z.x);\r
      z = vec2f(ax * ax - z.y * z.y + c.x, -2.0 * ax * z.y + c.y);\r
    }\r
    else {\r
      // Fallback to standard Mandelbrot\r
      z = vec2f(z.x * z.x - z.y * z.y + c.x, 2.0 * z.x * z.y + c.y);\r
    }\r
\r
    iterations++;\r
  }\r
\r
  if (iterations >= maxIter) {\r
    return vec4f(0.0, 0.0, 0.0, 1.0);\r
  }\r
\r
  // Smooth iteration count - adjust log base for higher power fractals\r
  var logBase = 2.0;\r
  if (baseType == 6) { logBase = 3.0; }      // Multibrot3\r
  else if (baseType == 7) { logBase = 4.0; } // Multibrot4\r
\r
  let smoothIter = f32(iterations) + 1.0 - log2(log2(max(dot(z, z), 4.0))) / log2(logBase);\r
  let normalized = smoothIter / f32(maxIter);\r
\r
  let isMonotonic = u.isMonotonic != 0;\r
  let isCycling = !isMonotonic;\r
\r
  var t: f32;\r
  if (isMonotonic) {\r
    t = normalized + u.colorOffset;\r
  } else {\r
    let numCycles = 8.0;\r
    t = normalized * numCycles + u.colorOffset;\r
  }\r
\r
  var color = getColor(t, isCycling);\r
\r
  if (u.hdrEnabled != 0) {\r
    var brightnessMult: f32;\r
\r
    if (isMonotonic) {\r
      brightnessMult = hdrBrightnessCurveMonotonic(normalized, u.hdrBrightnessBias);\r
    } else {\r
      brightnessMult = hdrBrightnessCurveCycling(normalized, u.hdrBrightnessBias);\r
    }\r
\r
    color = color * brightnessMult;\r
    return vec4f(color, 1.0);\r
  } else {\r
    let edgeFactor = 1.0 - f32(iterations) / f32(maxIter);\r
    let glow = pow(edgeFactor, 0.5) * 0.3;\r
    color = color * (1.0 + glow);\r
    return vec4f(min(color, vec3f(1.0)), 1.0);\r
  }\r
}\r
`,ze=256,Se=512,Ie=4096,we=640,ke=1.65,H=1.5;function j(i,e=!1){const t=Math.max(1,i),n=Math.log10(t),s=e?Se:ze,c=s+we*Math.pow(n,ke);return Math.round(Math.max(s,Math.min(Ie,c)))}const _=256;class E{constructor(e,t){o(this,"renderer");o(this,"viewState");o(this,"inputHandler");o(this,"pipeline");o(this,"uniformBuffer");o(this,"bindGroup");o(this,"maxIterationsOverride",null);o(this,"fractalType",a.Mandelbrot);o(this,"juliaC",[-.7,.27015]);o(this,"juliaPickerMode",!1);o(this,"isActivelyPickingJulia",!1);o(this,"savedViewState",null);o(this,"savedFractalType",null);o(this,"paletteType","cosine");o(this,"cosinePaletteIndex",1);o(this,"gradientPaletteIndex",0);o(this,"colorOffset",0);o(this,"hdrBrightnessBias",0);o(this,"sdrGradientBrightness",1);o(this,"debugOverlay",null);o(this,"shareNotification",null);o(this,"helpOverlay",null);o(this,"helpVisible",!1);o(this,"screenshotMode",!1);o(this,"notificationTimeoutId",null);o(this,"handleResize",()=>{this.renderer.resize(window.innerWidth,window.innerHeight),this.render()});o(this,"handleHashChange",()=>{this.loadBookmark()});this.renderer=e,this.viewState=new Z,this.inputHandler=new K(t,this.viewState,()=>{this.render()}),this.setupInputCallbacks(),this.setupOverlays(t)}static async create(e){const t=await I.create(e),n=new E(t,e);return await n.initializePipeline(),t.setOnHdrChange(()=>{console.log("HDR status changed, re-rendering..."),n.render()}),window.addEventListener("resize",n.handleResize),window.addEventListener("hashchange",n.handleHashChange),n.loadBookmark(),n.handleResize(),n}async initializePipeline(){const e=this.renderer.device,t=e.createShaderModule({label:"Mandelbrot Shader",code:Te});this.uniformBuffer=e.createBuffer({label:"Uniforms",size:_,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});const n=e.createBindGroupLayout({label:"Bind Group Layout",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]});this.bindGroup=e.createBindGroup({label:"Bind Group",layout:n,entries:[{binding:0,resource:{buffer:this.uniformBuffer}}]});const s=e.createPipelineLayout({label:"Pipeline Layout",bindGroupLayouts:[n]});this.pipeline=e.createRenderPipeline({label:"Mandelbrot Pipeline",layout:s,vertex:{module:t,entryPoint:"vertexMain"},fragment:{module:t,entryPoint:"fragmentMain",targets:[{format:this.renderer.format}]},primitive:{topology:"triangle-list"}}),console.log("WebGPU pipeline initialized")}setupInputCallbacks(){this.inputHandler.setIterationAdjustCallback(e=>{this.adjustMaxIterations(e)}),this.inputHandler.setIterationResetCallback(()=>{this.clearMaxIterationsOverride()}),this.inputHandler.setCosinePaletteCycleCallback(e=>{this.cycleCosinePalette(e)}),this.inputHandler.setGradientPaletteCycleCallback(e=>{this.cycleGradientPalette(e)}),this.inputHandler.setColorOffsetCallback(e=>{this.adjustColorOffset(e)}),this.inputHandler.setColorOffsetResetCallback(()=>{this.resetColorOffset()}),this.inputHandler.setToggleAACallback(()=>{console.log("AA not available in WebGPU HDR mode")}),this.inputHandler.setToggleHDRCallback(()=>{this.toggleHDR()}),this.inputHandler.setAdjustHdrBrightnessCallback(e=>{this.adjustHdrBrightness(e)}),this.inputHandler.setResetHdrBrightnessCallback(()=>{this.resetHdrBrightness()}),this.inputHandler.setFractalCycleCallback(e=>{this.cycleFractalType(e)}),this.inputHandler.setToggleJuliaModeCallback(()=>{this.toggleJuliaPickerMode()}),this.inputHandler.setJuliaPickCallback((e,t)=>{this.pickJuliaConstant(e,t)}),this.inputHandler.setJuliaPickEndCallback(()=>{this.endJuliaPicking()}),this.inputHandler.setShareCallback(()=>{this.shareBookmark()}),this.inputHandler.setLocationSelectCallback(e=>{this.goToLocation(e)}),this.inputHandler.setToggleHelpCallback(()=>{this.toggleHelp()}),this.inputHandler.setToggleScreenshotModeCallback(()=>{this.toggleScreenshotMode()})}setupOverlays(e){const t=e.parentElement;t&&(this.debugOverlay=document.createElement("div"),this.debugOverlay.id="zoom-debug",t.appendChild(this.debugOverlay),this.shareNotification=document.createElement("div"),this.shareNotification.id="share-notification",this.shareNotification.style.cssText=`
      position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.85); color: #4ade80; padding: 16px 32px;
      border-radius: 8px; font-family: system-ui, sans-serif; font-size: 16px;
      z-index: 1000; opacity: 0; transition: opacity 0.3s ease; pointer-events: none;
    `,t.appendChild(this.shareNotification),this.helpOverlay=document.createElement("div"),this.helpOverlay.id="help-overlay",this.helpOverlay.innerHTML=this.createHelpContent(),this.helpOverlay.style.cssText=`
      position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.92); color: #e5e5e5; padding: 24px 32px;
      border-radius: 12px; font-family: system-ui, -apple-system, sans-serif;
      font-size: 14px; z-index: 1001; opacity: 0; transition: opacity 0.2s ease;
      pointer-events: none; max-width: 90vw; max-height: 90vh; overflow-y: auto;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5); border: 1px solid rgba(255, 255, 255, 0.1);
    `,t.appendChild(this.helpOverlay))}render(){const e=this.renderer.device,t=this.renderer.canvas,n=T(this.fractalType),s=this.maxIterationsOverride??j(this.viewState.zoom,n);if(this.debugOverlay&&!this.screenshotMode){const m=this.viewState.zoom,F=m>=1e6?m.toExponential(2):m<1?m.toPrecision(4):String(Math.round(m)),Y=this.maxIterationsOverride!==null?" (manual)":"",X=this.paletteType==="cosine"?Ce(this.cosinePaletteIndex):Pe(this.gradientPaletteIndex),U=Q[this.fractalType],$=this.renderer.hdrEnabled?Math.abs(this.hdrBrightnessBias)>.01?`HDR (${this.hdrBrightnessBias>0?"+":""}${this.hdrBrightnessBias.toFixed(2)})`:"HDR":this.renderer.displaySupportsHDR?"HDR available":"SDR",A=!this.renderer.hdrEnabled&&this.paletteType==="gradient"&&Math.abs(this.sdrGradientBrightness-1)>.01?`brightness ${this.sdrGradientBrightness.toFixed(1)}`:"",R=this.juliaPickerMode?"🎯 Pick Julia point":"",B=n?`c=(${this.juliaC[0].toFixed(4)}, ${this.juliaC[1].toFixed(4)})`:"",D=Math.abs(this.colorOffset)>.001?`offset ${this.colorOffset.toFixed(1)}`:"",v=[U,`zoom ${F}`,`iterations ${s}${Y}`,X];D&&v.push(D),A&&v.push(A),B&&v.push(B),v.push($),R&&v.push(R),v.push("H = help"),this.debugOverlay.textContent=v.join("  ·  ")}const c=new ArrayBuffer(_),r=new Float32Array(c),h=new Int32Array(c),f=this.paletteType==="cosine",p=f?ve(this.cosinePaletteIndex):xe(this.gradientPaletteIndex),d=f?ye(this.cosinePaletteIndex):be(this.gradientPaletteIndex,this.renderer.hdrEnabled);r[0]=t.width,r[1]=t.height,r[2]=this.viewState.centerX,r[3]=this.viewState.centerY,r[4]=this.viewState.zoom,h[5]=s,r[6]=performance.now()*.001,r[7]=this.colorOffset,h[8]=this.fractalType,r[10]=this.juliaC[0],r[11]=this.juliaC[1],h[12]=this.renderer.hdrEnabled?1:0,r[13]=this.hdrBrightnessBias,h[14]=d.type==="cosine"?0:1,h[15]=p.isMonotonic?1:0,r[16]=this.sdrGradientBrightness,d.type==="cosine"&&(r[20]=d.a[0],r[21]=d.a[1],r[22]=d.a[2],r[24]=d.b[0],r[25]=d.b[1],r[26]=d.b[2],r[28]=d.c[0],r[29]=d.c[1],r[30]=d.c[2],r[32]=d.d[0],r[33]=d.d[1],r[34]=d.d[2]),d.type==="gradient"&&(r[36]=d.c1[0],r[37]=d.c1[1],r[38]=d.c1[2],r[40]=d.c2[0],r[41]=d.c2[1],r[42]=d.c2[2],r[44]=d.c3[0],r[45]=d.c3[1],r[46]=d.c3[2],r[48]=d.c4[0],r[49]=d.c4[1],r[50]=d.c4[2],r[52]=d.c5[0],r[53]=d.c5[1],r[54]=d.c5[2]),e.queue.writeBuffer(this.uniformBuffer,0,c);const y=e.createCommandEncoder(),z=this.renderer.getCurrentTexture().createView(),b=y.beginRenderPass({colorAttachments:[{view:z,clearValue:{r:0,g:0,b:0,a:1},loadOp:"clear",storeOp:"store"}]});b.setPipeline(this.pipeline),b.setBindGroup(0,this.bindGroup),b.draw(3),b.end(),e.queue.submit([y.finish()])}start(){this.renderer.start(()=>this.render())}stop(){this.renderer.stop()}adjustMaxIterations(e){const t=T(this.fractalType),n=this.maxIterationsOverride??j(this.viewState.zoom,t),s=e>0?n*H:n/H;this.maxIterationsOverride=Math.round(Math.max(1,s)),this.render()}clearMaxIterationsOverride(){this.maxIterationsOverride=null,this.render()}toggleHDR(){console.log(`HDR is ${this.renderer.hdrEnabled?"enabled":"not available"}`),this.render()}adjustHdrBrightness(e){this.renderer.hdrEnabled?this.hdrBrightnessBias=Math.max(-1,Math.min(1,this.hdrBrightnessBias+e*.1)):this.paletteType==="gradient"&&(this.sdrGradientBrightness=Math.max(.1,Math.min(10,this.sdrGradientBrightness+e*.2))),this.render()}resetHdrBrightness(){this.hdrBrightnessBias=0,this.sdrGradientBrightness=1,this.render()}cycleCosinePalette(e){this.cosinePaletteIndex=(this.cosinePaletteIndex+e+C)%C,this.paletteType="cosine",this.render()}cycleGradientPalette(e){this.gradientPaletteIndex=(this.gradientPaletteIndex+e+P)%P,this.paletteType="gradient",this.render()}adjustColorOffset(e){this.colorOffset+=e,this.render()}resetColorOffset(){this.colorOffset=0,this.render()}cycleFractalType(e=1){const c=((M(this.fractalType)>>1)+e+J)%J<<1;this.juliaPickerMode&&(this.juliaPickerMode=!1,this.inputHandler.setJuliaPickerMode(!1));const r=L("1",c);r?(this.applyLocationState(r.state),this.showLocationNotification(r.name,r.description)):this.fractalType=c,this.render()}toggleJuliaPickerMode(){if(T(this.fractalType)){this.exitJuliaMode();return}this.juliaPickerMode=!this.juliaPickerMode,this.inputHandler.setJuliaPickerMode(this.juliaPickerMode),this.render()}pickJuliaConstant(e,t){this.juliaPickerMode&&(this.isActivelyPickingJulia||(this.savedViewState={centerX:this.viewState.centerX,centerY:this.viewState.centerY,zoom:this.viewState.zoom},this.savedFractalType=this.fractalType,this.fractalType=ee(this.fractalType),this.viewState.centerX=0,this.viewState.centerY=0,this.viewState.zoom=.5,this.isActivelyPickingJulia=!0),this.juliaC=[e,t],this.render())}endJuliaPicking(){this.isActivelyPickingJulia&&(this.isActivelyPickingJulia=!1,this.juliaPickerMode=!1,this.inputHandler.setJuliaPickerMode(!1),this.render())}exitJuliaMode(){this.savedViewState&&(this.viewState.centerX=this.savedViewState.centerX,this.viewState.centerY=this.savedViewState.centerY,this.viewState.zoom=this.savedViewState.zoom,this.savedViewState=null),this.savedFractalType!==null?(this.fractalType=this.savedFractalType,this.savedFractalType=null):this.fractalType=M(this.fractalType),this.juliaPickerMode=!1,this.inputHandler.setJuliaPickerMode(!1),this.render()}getBookmarkState(){return{fractalType:this.fractalType,centerX:this.viewState.centerX,centerY:this.viewState.centerY,zoom:this.viewState.zoom,paletteType:this.paletteType,cosinePaletteIndex:this.cosinePaletteIndex,gradientPaletteIndex:this.gradientPaletteIndex,colorOffset:this.colorOffset,juliaC:this.juliaC,maxIterationsOverride:this.maxIterationsOverride,aaEnabled:!1}}loadBookmark(){const e=ae();if(e){if(e.centerX!==void 0&&(this.viewState.centerX=e.centerX),e.centerY!==void 0&&(this.viewState.centerY=e.centerY),e.zoom!==void 0&&(this.viewState.zoom=e.zoom),e.maxIterationsOverride!==void 0&&(this.maxIterationsOverride=e.maxIterationsOverride),e.paletteType!==void 0&&(this.paletteType=e.paletteType),e.cosinePaletteIndex!==void 0&&(this.cosinePaletteIndex=e.cosinePaletteIndex%C),e.gradientPaletteIndex!==void 0&&(this.gradientPaletteIndex=e.gradientPaletteIndex%P),e.paletteIndex!==void 0&&e.paletteType===void 0){const t=[0,4,5,10,11];if(t.includes(e.paletteIndex))this.paletteType="cosine",this.cosinePaletteIndex=t.indexOf(e.paletteIndex);else{this.paletteType="gradient";const n=[1,2,3,6,7,8,9];this.gradientPaletteIndex=n.indexOf(e.paletteIndex)}}e.colorOffset!==void 0&&(this.colorOffset=e.colorOffset),e.fractalType!==void 0&&(this.fractalType=e.fractalType),e.juliaC!==void 0&&(this.juliaC=e.juliaC),this.render()}}goToLocation(e){const t=L(e,this.fractalType);t&&(this.applyLocationState(t.state),this.showLocationNotification(t.name,t.description),this.updateUrlBookmark(),this.render())}applyLocationState(e){this.viewState.centerX=e.centerX,this.viewState.centerY=e.centerY,this.viewState.zoom=e.zoom,this.maxIterationsOverride=e.maxIterationsOverride,this.fractalType=e.fractalType,this.juliaC=e.juliaC,this.paletteType=e.paletteType,this.cosinePaletteIndex=e.cosinePaletteIndex,this.gradientPaletteIndex=e.gradientPaletteIndex,this.colorOffset=e.colorOffset}showLocationNotification(e,t){this.shareNotification&&(this.notificationTimeoutId!==null&&clearTimeout(this.notificationTimeoutId),this.shareNotification.innerHTML=`<strong style="font-size: 18px;">📍 ${e}</strong><br><span style="color: #aaa; font-size: 14px;">${t}</span>`,this.shareNotification.style.color="#60a5fa",this.shareNotification.style.opacity="1",this.notificationTimeoutId=setTimeout(()=>{this.shareNotification&&(this.shareNotification.style.opacity="0"),this.notificationTimeoutId=null},2500))}updateUrlBookmark(){ne(this.getBookmarkState())}async shareBookmark(){const e=await re(this.getBookmarkState());this.showShareNotification(e),e&&this.updateUrlBookmark(),(window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1")&&this.logCreateLocationCode()}logCreateLocationCode(){const e=this.getFractalTypeEnumName(this.fractalType),t=T(this.fractalType),n=[];this.paletteType==="gradient"?(n.push("paletteType: 'gradient'"),this.gradientPaletteIndex!==0&&n.push(`gradientPaletteIndex: ${this.gradientPaletteIndex}`)):this.cosinePaletteIndex!==1&&n.push(`cosinePaletteIndex: ${this.cosinePaletteIndex}`),Math.abs(this.colorOffset)>.001&&n.push(`colorOffset: ${this.colorOffset}`),t&&n.push(`juliaC: [${this.juliaC[0]}, ${this.juliaC[1]}]`),this.maxIterationsOverride!==null&&n.push(`maxIterationsOverride: ${this.maxIterationsOverride}`);const s=n.length>0?`,
    { ${n.join(", ")} }`:"",c=`createLocation(
    'TODO: Name',
    'TODO: Description',
    'TODO: Key (1-9)',
    FractalType.${e},
    ${this.viewState.centerX}, ${this.viewState.centerY}, ${this.viewState.zoom}${s}
  ),`;console.log("%c📍 createLocation() code:","color: #4ade80; font-weight: bold; font-size: 14px;"),console.log(c)}getFractalTypeEnumName(e){const t=Object.entries(a);for(const[n,s]of t)if(s===e&&isNaN(Number(n)))return n;return`Unknown(${e})`}showShareNotification(e){this.shareNotification&&(this.notificationTimeoutId!==null&&clearTimeout(this.notificationTimeoutId),this.shareNotification.textContent=e?"📋 Link copied to clipboard!":"❌ Failed to copy link",this.shareNotification.style.color=e?"#4ade80":"#f87171",this.shareNotification.style.opacity="1",this.notificationTimeoutId=setTimeout(()=>{this.shareNotification&&(this.shareNotification.style.opacity="0"),this.notificationTimeoutId=null},2e3))}toggleHelp(){this.helpVisible=!this.helpVisible,this.helpOverlay&&(this.helpOverlay.style.opacity=this.helpVisible?"1":"0",this.helpOverlay.style.pointerEvents=this.helpVisible?"auto":"none")}toggleScreenshotMode(){this.screenshotMode=!this.screenshotMode,this.screenshotMode&&this.helpVisible&&(this.helpVisible=!1,this.helpOverlay&&(this.helpOverlay.style.opacity="0",this.helpOverlay.style.pointerEvents="none")),this.debugOverlay&&(this.debugOverlay.style.display=this.screenshotMode?"none":"block"),this.shareNotification&&(this.notificationTimeoutId!==null&&clearTimeout(this.notificationTimeoutId),this.shareNotification.textContent=this.screenshotMode?"📷 Screenshot mode (Space to exit)":"📷 UI restored",this.shareNotification.style.color="#60a5fa",this.shareNotification.style.opacity="1",this.notificationTimeoutId=setTimeout(()=>{this.shareNotification&&(this.shareNotification.style.opacity="0"),this.notificationTimeoutId=null},1e3))}createHelpContent(){return`
      <h2 style="margin: 0 0 16px 0; color: #60a5fa; font-size: 20px; font-weight: 600;">
        🌀 Fractal Explorer - Keyboard Shortcuts
      </h2>
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px 32px;">
        <div style="margin-bottom: 12px;">
          <h3 style="margin: 0 0 8px 0; color: #a78bfa; font-size: 13px; text-transform: uppercase;">Navigation</h3>
          <div style="display: grid; gap: 4px;">
            ${this.helpRow("Drag","Pan view")}
            ${this.helpRow("Scroll","Zoom in/out")}
            ${this.helpRow("z / Z","Fine zoom (hold)")}
            ${this.helpRow("Double-click","Zoom in at point")}
            ${this.helpRow("1-9","Famous locations")}
          </div>
        </div>
        <div style="margin-bottom: 12px;">
          <h3 style="margin: 0 0 8px 0; color: #a78bfa; font-size: 13px; text-transform: uppercase;">Iterations</h3>
          <div style="display: grid; gap: 4px;">
            ${this.helpRow("+/-","Adjust iterations")}
            ${this.helpRow("0","Reset to auto")}
          </div>
        </div>
        <div style="margin-bottom: 12px;">
          <h3 style="margin: 0 0 8px 0; color: #a78bfa; font-size: 13px; text-transform: uppercase;">Colors</h3>
          <div style="display: grid; gap: 4px;">
            ${this.helpRow("C / Shift+C","Cosine palettes")}
            ${this.helpRow("G / Shift+G","Gradient palettes")}
            ${this.helpRow(", / .","Shift colors (fine)")}
            ${this.helpRow("< / >","Shift colors (coarse)")}
            ${this.helpRow("R","Reset color offset")}
          </div>
        </div>
        <div style="margin-bottom: 12px;">
          <h3 style="margin: 0 0 8px 0; color: #a78bfa; font-size: 13px; text-transform: uppercase;">Fractal Type</h3>
          <div style="display: grid; gap: 4px;">
            ${this.helpRow("F / Shift+F","Cycle fractals")}
            ${this.helpRow("J","Julia picker mode")}
          </div>
        </div>
        <div style="margin-bottom: 12px;">
          <h3 style="margin: 0 0 8px 0; color: #a78bfa; font-size: 13px; text-transform: uppercase;">Brightness</h3>
          <div style="display: grid; gap: 4px;">
            ${this.helpRow("B / Shift+B","Adjust brightness*")}
            ${this.helpRow("D","Reset brightness")}
          </div>
          <div style="color: #888; font-size: 10px; margin-top: 4px;">*HDR bias or SDR gradient brightness</div>
        </div>
        <div style="margin-bottom: 12px;">
          <h3 style="margin: 0 0 8px 0; color: #a78bfa; font-size: 13px; text-transform: uppercase;">UI</h3>
          <div style="display: grid; gap: 4px;">
            ${this.helpRow("H","Toggle this help")}
            ${this.helpRow("Space","Screenshot mode")}
          </div>
        </div>
        <div style="margin-bottom: 12px;">
          <h3 style="margin: 0 0 8px 0; color: #a78bfa; font-size: 13px; text-transform: uppercase;">Share</h3>
          <div style="display: grid; gap: 4px;">
            ${this.helpRow("S","Copy bookmark URL")}
          </div>
        </div>
      </div>
      <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.1); color: #888; font-size: 12px; text-align: center;">
        Press <kbd style="background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px;">H</kbd> to close
      </div>
    `}helpRow(e,t){return`
      <div style="display: flex; align-items: baseline; gap: 8px;">
        <kbd style="background: rgba(255,255,255,0.1); color: #f0f0f0; padding: 2px 8px; border-radius: 4px; font-family: ui-monospace, monospace; font-size: 12px; min-width: 60px; text-align: center;">${e}</kbd>
        <span style="color: #ccc;">${t}</span>
      </div>
    `}destroy(){this.stop(),window.removeEventListener("resize",this.handleResize),window.removeEventListener("hashchange",this.handleHashChange),this.debugOverlay?.remove(),this.shareNotification?.remove(),this.helpOverlay?.remove(),this.inputHandler.destroy(),this.renderer.destroy()}}console.log("Fractal Explorer - Initializing...");let S=null;async function N(){const i=document.getElementById("app");if(!i){console.error("Could not find #app element");return}if(!I.isSupported()){i.innerHTML=`
      <div style="color: white; text-align: center; padding: 40px; font-family: system-ui, sans-serif;">
        <h1>WebGPU Not Supported</h1>
        <p>This application requires WebGPU, which is not available in your browser.</p>
        <p style="margin-top: 20px; color: #888;">
          Please use a modern browser with WebGPU support:<br>
          Chrome 113+, Edge 113+, or Firefox Nightly with WebGPU enabled.
        </p>
      </div>
    `;return}const e=document.createElement("canvas");e.id="fractal-canvas",i.appendChild(e);try{S=await E.create(e),S.start(),console.log("Fractal Explorer initialized successfully"),console.log("Controls:"),console.log("  - Drag to pan"),console.log("  - Scroll to zoom"),console.log("  - Double-click to zoom in"),console.log("  - Touch drag to pan (mobile)"),console.log("  - Pinch to zoom (mobile)"),console.log("  - + / - to adjust max iterations"),console.log("  - 0 to reset iterations to auto-scaling"),console.log("  - c / C to cycle cosine palettes (forward/backward)"),console.log("  - g / G to cycle gradient palettes (forward/backward)"),console.log("  - , / . to shift colors (fine)"),console.log("  - < / > to shift colors (coarse)"),console.log("  - b / B to adjust brightness (HDR bias or SDR gradient)"),console.log("  - d to reset brightness"),console.log("  - s to share/copy bookmark URL"),console.log("  - 1-9 to visit famous locations"),console.log("  - h to toggle help overlay"),console.log("  - Space to toggle screenshot mode")}catch(t){console.error("Failed to initialize Fractal Explorer:",t),i.innerHTML=`
      <div style="color: white; text-align: center; padding: 20px; font-family: system-ui, sans-serif;">
        <h1>Initialization Error</h1>
        <p>Failed to initialize the application.</p>
        <pre style="text-align: left; margin-top: 20px; color: #ff6b6b;">${t instanceof Error?t.message:String(t)}</pre>
      </div>
    `}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>N()):N();window.addEventListener("beforeunload",()=>{S&&S.destroy()});
//# sourceMappingURL=index-BJQW19N3.js.map
