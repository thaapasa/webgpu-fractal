var $=Object.defineProperty;var q=(i,e,t)=>e in i?$(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t;var o=(i,e,t)=>q(i,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const c of r)if(c.type==="childList")for(const a of c.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function t(r){const c={};return r.integrity&&(c.integrity=r.integrity),r.referrerPolicy&&(c.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?c.credentials="include":r.crossOrigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function n(r){if(r.ep)return;r.ep=!0;const c=t(r);fetch(r.href,c)}})();class I{constructor(e){o(this,"device");o(this,"context");o(this,"canvas");o(this,"format");o(this,"animationFrameId",null);o(this,"renderCallback",null);o(this,"hdrEnabled",!1);o(this,"_displaySupportsHDR",!1);o(this,"hdrMediaQuery",null);o(this,"onHdrChangeCallback",null);this.canvas=e,this._displaySupportsHDR=this.detectHDRDisplay(),this.setupHdrMediaQueryListener()}get displaySupportsHDR(){return this._displaySupportsHDR}static async create(e){const t=new I(e);return await t.initialize(),t}static isSupported(){return"gpu"in navigator}async initialize(){if(!navigator.gpu)throw new Error("WebGPU is not supported in this browser");console.log("WebGPU HDR capability check:"),console.log("  - Display supports HDR:",this.displaySupportsHDR),console.log("  - dynamic-range: high:",window.matchMedia?.("(dynamic-range: high)").matches),console.log("  - color-gamut: p3:",window.matchMedia?.("(color-gamut: p3)").matches);const e=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!e)throw new Error("Failed to get WebGPU adapter");if("info"in e){const t=e.info;console.log("  - Adapter:",t?.vendor,t?.architecture)}if(this.device=await e.requestDevice(),this.context=this.canvas.getContext("webgpu"),!this.context)throw new Error("Failed to get WebGPU context");this.configureContext(),console.log("WebGPU initialized successfully"),this.hdrEnabled&&console.log("HDR mode enabled with rgba16float + extended tone mapping")}configureContext(){const e=navigator.gpu.getPreferredCanvasFormat();if(this.displaySupportsHDR)try{this.format="rgba16float",this.context.configure({device:this.device,format:this.format,alphaMode:"opaque",toneMapping:{mode:"extended"}}),this.hdrEnabled=!0,console.log("  - Configured with rgba16float + extended tone mapping (HDR)")}catch(t){console.log("  - HDR configuration failed, falling back to SDR:",t),this.format=e,this.context.configure({device:this.device,format:this.format,alphaMode:"opaque"}),this.hdrEnabled=!1}else this.format=e,this.context.configure({device:this.device,format:this.format,alphaMode:"opaque"}),this.hdrEnabled=!1,console.log("  - Configured with",this.format,"(SDR)")}resize(e,t){const n=window.devicePixelRatio||1;this.canvas.width=e*n,this.canvas.height=t*n,this.canvas.style.width=`${e}px`,this.canvas.style.height=`${t}px`}getCurrentTexture(){return this.context.getCurrentTexture()}start(e){if(this.animationFrameId!==null)return;this.renderCallback=e;const t=()=>{this.renderCallback&&this.renderCallback(),this.animationFrameId=requestAnimationFrame(t)};this.animationFrameId=requestAnimationFrame(t)}stop(){this.animationFrameId!==null&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null),this.renderCallback=null}detectHDRDisplay(){return!!window.matchMedia?.("(dynamic-range: high)").matches}setupHdrMediaQueryListener(){if(!window.matchMedia)return;this.hdrMediaQuery=window.matchMedia("(dynamic-range: high)");const e=()=>{const t=this.detectHDRDisplay();t!==this._displaySupportsHDR&&(console.log(`HDR display support changed: ${this._displaySupportsHDR} -> ${t}`),this._displaySupportsHDR=t,this.context&&this.device&&this.configureContext(),this.onHdrChangeCallback?.())};this.hdrMediaQuery.addEventListener?.("change",e)}setOnHdrChange(e){this.onHdrChangeCallback=e}destroy(){this.stop(),this.onHdrChangeCallback=null,this.device?.destroy()}}class V{constructor(e=-.5,t=0,n=.4){o(this,"centerX");o(this,"centerY");o(this,"zoom");this.centerX=e,this.centerY=t,this.zoom=n}pan(e,t,n,r){const c=-e/(this.zoom*n),a=t/(this.zoom*r);this.centerX+=c,this.centerY+=a}zoomAt(e,t,n,r,c){const a=this.centerX+(e/r-.5)/this.zoom,h=this.centerY-(t/c-.5)/this.zoom;this.zoom*=n,this.zoom=Math.max(.1,Math.min(this.zoom,1e15));const f=this.centerX+(e/r-.5)/this.zoom,p=this.centerY-(t/c-.5)/this.zoom;this.centerX+=a-f,this.centerY+=h-p}toFractalCoords(e,t,n,r){const c=n/r,a=(e/n-.5)*c,h=t/r-.5,f=this.centerX+a/this.zoom,p=this.centerY-h/this.zoom;return[f,p]}toScreenCoords(e,t,n,r){const c=n/r,a=(e-this.centerX)*this.zoom,h=(t-this.centerY)*this.zoom,f=(a/c+.5)*n,p=(-h+.5)*r;return[f,p]}zoomToPoint(e,t,n,r,c){const[a,h]=this.toFractalCoords(e,t,r,c);this.centerX=a,this.centerY=h,this.zoom*=n,this.zoom=Math.max(.1,Math.min(this.zoom,1e15))}reset(){this.centerX=-.5,this.centerY=0,this.zoom=.4}}const Z=.6;function O(i){return 1+(i-1)*Z}class W{constructor(e,t,n){o(this,"canvas");o(this,"viewState");o(this,"onChange");o(this,"onIterationAdjust",null);o(this,"onIterationReset",null);o(this,"onCosinePaletteCycle",null);o(this,"onGradientPaletteCycle",null);o(this,"onColorOffset",null);o(this,"onColorOffsetReset",null);o(this,"onToggleAA",null);o(this,"onAdjustHdrBrightness",null);o(this,"onResetHdrBrightness",null);o(this,"onFractalCycle",null);o(this,"onToggleJuliaMode",null);o(this,"onJuliaPick",null);o(this,"onJuliaPickEnd",null);o(this,"onShare",null);o(this,"onLocationSelect",null);o(this,"onToggleHelp",null);o(this,"onToggleScreenshotMode",null);o(this,"isDragging",!1);o(this,"lastX",0);o(this,"lastY",0);o(this,"lastTouchDistance",0);o(this,"juliaPickerMode",!1);o(this,"isPickingJulia",!1);o(this,"juliaPickViewState",null);o(this,"keyboardZoomDirection",null);o(this,"keyboardZoomStartTime",0);o(this,"keyboardZoomAnimationId",null);this.canvas=e,this.viewState=t,this.onChange=n,this.setupEventListeners()}setIterationAdjustCallback(e){this.onIterationAdjust=e}setIterationResetCallback(e){this.onIterationReset=e}setCosinePaletteCycleCallback(e){this.onCosinePaletteCycle=e}setGradientPaletteCycleCallback(e){this.onGradientPaletteCycle=e}setColorOffsetCallback(e){this.onColorOffset=e}setColorOffsetResetCallback(e){this.onColorOffsetReset=e}setToggleAACallback(e){this.onToggleAA=e}setToggleHDRCallback(e){}setAdjustHdrBrightnessCallback(e){this.onAdjustHdrBrightness=e}setResetHdrBrightnessCallback(e){this.onResetHdrBrightness=e}setFractalCycleCallback(e){this.onFractalCycle=e}setToggleJuliaModeCallback(e){this.onToggleJuliaMode=e}setJuliaPickCallback(e){this.onJuliaPick=e}setJuliaPickEndCallback(e){this.onJuliaPickEnd=e}setShareCallback(e){this.onShare=e}setLocationSelectCallback(e){this.onLocationSelect=e}setToggleHelpCallback(e){this.onToggleHelp=e}setToggleScreenshotModeCallback(e){this.onToggleScreenshotMode=e}setJuliaPickerMode(e){this.juliaPickerMode=e,this.canvas.style.cursor=e?"crosshair":"grab"}isJuliaPickerModeActive(){return this.juliaPickerMode}setupEventListeners(){this.canvas.addEventListener("mousedown",this.handleMouseDown.bind(this)),this.canvas.addEventListener("mousemove",this.handleMouseMove.bind(this)),this.canvas.addEventListener("mouseup",this.handleMouseUp.bind(this)),this.canvas.addEventListener("mouseleave",this.handleMouseUp.bind(this)),this.canvas.addEventListener("wheel",this.handleWheel.bind(this),{passive:!1}),this.canvas.addEventListener("dblclick",this.handleDoubleClick.bind(this)),this.canvas.addEventListener("touchstart",this.handleTouchStart.bind(this),{passive:!1}),this.canvas.addEventListener("touchmove",this.handleTouchMove.bind(this),{passive:!1}),this.canvas.addEventListener("touchend",this.handleTouchEnd.bind(this)),this.canvas.addEventListener("touchcancel",this.handleTouchEnd.bind(this)),window.addEventListener("keydown",this.handleKeyDown.bind(this)),window.addEventListener("keyup",this.handleKeyUp.bind(this))}getCanvasRect(){return this.canvas.getBoundingClientRect()}getScreenCoords(e,t){const n=this.getCanvasRect();return[e-n.left,t-n.top]}getCanvasSize(){const e=this.getCanvasRect();return[e.width,e.height]}toFractalCoordsWithView(e,t,n,r,c){const a=n/r,h=(e/n-.5)*a,f=t/r-.5,p=c.centerX+h/c.zoom,d=c.centerY-f/c.zoom;return[p,d]}notifyChange(){this.onChange(this.viewState)}handleMouseDown(e){if(e.button!==0)return;const[t,n]=this.getScreenCoords(e.clientX,e.clientY);if(this.juliaPickerMode&&this.onJuliaPick){const[r,c]=this.getCanvasSize();this.juliaPickViewState={centerX:this.viewState.centerX,centerY:this.viewState.centerY,zoom:this.viewState.zoom};const[a,h]=this.toFractalCoordsWithView(t,n,r,c,this.juliaPickViewState);this.isPickingJulia=!0,this.lastX=t,this.lastY=n,this.onJuliaPick(a,h);return}this.isDragging=!0,this.lastX=t,this.lastY=n,this.canvas.style.cursor="grabbing"}handleMouseMove(e){const[t,n]=this.getScreenCoords(e.clientX,e.clientY);if(this.isPickingJulia&&this.onJuliaPick&&this.juliaPickViewState){const[f,p]=this.getCanvasSize(),[d,y]=this.toFractalCoordsWithView(t,n,f,p,this.juliaPickViewState);this.onJuliaPick(d,y),this.lastX=t,this.lastY=n;return}if(!this.isDragging)return;const r=t-this.lastX,c=n-this.lastY,[a,h]=this.getCanvasSize();this.viewState.pan(r,c,a,h),this.notifyChange(),this.lastX=t,this.lastY=n}handleMouseUp(){if(this.isPickingJulia){this.isPickingJulia=!1,this.juliaPickViewState=null,this.onJuliaPickEnd?.();return}this.isDragging&&(this.isDragging=!1,this.canvas.style.cursor="grab")}handleWheel(e){e.preventDefault();const[t,n]=this.getScreenCoords(e.clientX,e.clientY),r=e.deltaY>0?.9:1.1,c=O(r),[a,h]=this.getCanvasSize();this.viewState.zoomAt(t,n,c,a,h),this.notifyChange()}handleDoubleClick(e){const[t,n]=this.getScreenCoords(e.clientX,e.clientY),[r,c]=this.getCanvasSize();this.viewState.zoomToPoint(t,n,O(2),r,c),this.notifyChange()}getTouchDistance(e){if(e.length<2)return 0;const t=e[0].clientX-e[1].clientX,n=e[0].clientY-e[1].clientY;return Math.sqrt(t*t+n*n)}getTouchCenter(e){if(e.length===0)return[0,0];if(e.length===1)return this.getScreenCoords(e[0].clientX,e[0].clientY);const t=(e[0].clientX+e[1].clientX)/2,n=(e[0].clientY+e[1].clientY)/2;return this.getScreenCoords(t,n)}handleTouchStart(e){if(e.touches.length===1){this.isDragging=!0;const[t,n]=this.getScreenCoords(e.touches[0].clientX,e.touches[0].clientY);this.lastX=t,this.lastY=n}else e.touches.length===2&&(this.isDragging=!1,this.lastTouchDistance=this.getTouchDistance(e.touches))}handleTouchMove(e){if(e.preventDefault(),e.touches.length===1&&this.isDragging){const[t,n]=this.getScreenCoords(e.touches[0].clientX,e.touches[0].clientY),r=t-this.lastX,c=n-this.lastY,[a,h]=this.getCanvasSize();this.viewState.pan(r,c,a,h),this.notifyChange(),this.lastX=t,this.lastY=n}else if(e.touches.length===2){const t=this.getTouchDistance(e.touches),n=this.getTouchCenter(e.touches);if(this.lastTouchDistance>0){const r=t/this.lastTouchDistance,c=O(r),[a,h]=this.getCanvasSize();this.viewState.zoomAt(n[0],n[1],c,a,h),this.notifyChange()}this.lastTouchDistance=t}}handleTouchEnd(){this.isDragging=!1,this.lastTouchDistance=0}handleKeyDown(e){if(!(e.target instanceof HTMLInputElement||e.target instanceof HTMLTextAreaElement))switch(e.key){case"+":case"=":e.preventDefault(),this.onIterationAdjust?.(1);break;case"-":case"_":e.preventDefault(),this.onIterationAdjust?.(-1);break;case"0":e.preventDefault(),this.onIterationReset?.();break;case"c":e.preventDefault(),this.onCosinePaletteCycle?.(1);break;case"C":e.preventDefault(),this.onCosinePaletteCycle?.(-1);break;case"g":e.preventDefault(),this.onGradientPaletteCycle?.(1);break;case"G":e.preventDefault(),this.onGradientPaletteCycle?.(-1);break;case"[":case",":e.preventDefault(),this.onColorOffset?.(-.05);break;case"]":case".":e.preventDefault(),this.onColorOffset?.(.05);break;case"{":case"<":e.preventDefault(),this.onColorOffset?.(-.15);break;case"}":case">":e.preventDefault(),this.onColorOffset?.(.15);break;case"r":case"R":e.preventDefault(),this.onColorOffsetReset?.();break;case"a":case"A":e.preventDefault(),this.onToggleAA?.();break;case"b":e.preventDefault(),this.onAdjustHdrBrightness?.(1);break;case"B":e.preventDefault(),this.onAdjustHdrBrightness?.(-1);break;case"d":e.preventDefault(),this.onResetHdrBrightness?.();break;case"f":e.preventDefault(),this.onFractalCycle?.(1);break;case"F":e.preventDefault(),this.onFractalCycle?.(-1);break;case"j":case"J":e.preventDefault(),this.onToggleJuliaMode?.();break;case"s":case"S":e.preventDefault(),this.onShare?.();break;case"1":case"2":case"3":case"4":case"5":case"6":case"7":case"8":case"9":e.preventDefault(),this.onLocationSelect?.(e.key);break;case"h":case"H":e.preventDefault(),this.onToggleHelp?.();break;case" ":e.preventDefault(),this.onToggleScreenshotMode?.();break;case"z":e.preventDefault(),e.repeat||this.startKeyboardZoom(1);break;case"Z":e.preventDefault(),e.repeat||this.startKeyboardZoom(-1);break}}handleKeyUp(e){(e.key==="z"||e.key==="Z")&&this.stopKeyboardZoom()}startKeyboardZoom(e){this.keyboardZoomAnimationId!==null&&this.stopKeyboardZoom(),this.keyboardZoomDirection=e,this.keyboardZoomStartTime=performance.now(),this.keyboardZoomAnimationId=requestAnimationFrame(this.keyboardZoomLoop.bind(this))}stopKeyboardZoom(){this.keyboardZoomAnimationId!==null&&(cancelAnimationFrame(this.keyboardZoomAnimationId),this.keyboardZoomAnimationId=null),this.keyboardZoomDirection=null}keyboardZoomLoop(e){if(this.keyboardZoomDirection===null)return;const t=e-this.keyboardZoomStartTime;this.keyboardZoomStartTime=e;const r=this.keyboardZoomDirection*.7*(t/1e3),c=Math.exp(r),[a,h]=this.getCanvasSize();this.viewState.zoomAt(a/2,h/2,c,a,h),this.notifyChange(),this.keyboardZoomAnimationId=requestAnimationFrame(this.keyboardZoomLoop.bind(this))}destroy(){}}var s=(i=>(i[i.Mandelbrot=0]="Mandelbrot",i[i.MandelbrotJulia=1]="MandelbrotJulia",i[i.BurningShip=2]="BurningShip",i[i.BurningShipJulia=3]="BurningShipJulia",i[i.Tricorn=4]="Tricorn",i[i.TricornJulia=5]="TricornJulia",i[i.Celtic=6]="Celtic",i[i.CelticJulia=7]="CelticJulia",i[i.Buffalo=8]="Buffalo",i[i.BuffaloJulia=9]="BuffaloJulia",i[i.Phoenix=10]="Phoenix",i[i.PhoenixJulia=11]="PhoenixJulia",i[i.Multibrot3=12]="Multibrot3",i[i.Multibrot3Julia=13]="Multibrot3Julia",i[i.Multibrot4=14]="Multibrot4",i[i.Multibrot4Julia=15]="Multibrot4Julia",i[i.Funky=16]="Funky",i[i.FunkyJulia=17]="FunkyJulia",i[i.Perpendicular=18]="Perpendicular",i[i.PerpendicularJulia=19]="PerpendicularJulia",i))(s||{});const K={0:"Mandelbrot",1:"Mandelbrot Julia",2:"Burning Ship",3:"Burning Ship Julia",4:"Tricorn",5:"Tricorn Julia",6:"Celtic",7:"Celtic Julia",8:"Buffalo",9:"Buffalo Julia",10:"Phoenix",11:"Phoenix Julia",12:"Multibrot (z³)",13:"Multibrot³ Julia",14:"Multibrot (z⁴)",15:"Multibrot⁴ Julia",16:"Funky",17:"Funky Julia",18:"Perpendicular",19:"Perpendicular Julia"},J=10;function z(i){return(i&1)===1}function M(i){return i&-2}function Q(i){return i|1}const u={TYPE:"t",CENTER_X:"x",CENTER_Y:"y",ZOOM:"z",PALETTE:"p",PALETTE_TYPE:"pt",COSINE_PALETTE:"cp",GRADIENT_PALETTE:"gp",COLOR_OFFSET:"o",JULIA_REAL:"jr",JULIA_IMAG:"ji",ITERATIONS:"i",AA:"aa"};function x(i,e=15){return i===0?"0":Math.abs(i)<1e-10||Math.abs(i)>1e10?i.toExponential(e):parseFloat(i.toPrecision(e)).toString()}function g(i){if(i===null||i==="")return null;const e=parseFloat(i);return isNaN(e)?null:e}function N(i){const e=new URLSearchParams;return e.set(u.TYPE,i.fractalType.toString()),e.set(u.CENTER_X,x(i.centerX)),e.set(u.CENTER_Y,x(i.centerY)),e.set(u.ZOOM,x(i.zoom)),e.set(u.PALETTE_TYPE,i.paletteType==="cosine"?"c":"g"),e.set(u.COSINE_PALETTE,i.cosinePaletteIndex.toString()),e.set(u.GRADIENT_PALETTE,i.gradientPaletteIndex.toString()),Math.abs(i.colorOffset)>.001&&e.set(u.COLOR_OFFSET,x(i.colorOffset,4)),z(i.fractalType)&&(e.set(u.JULIA_REAL,x(i.juliaC[0])),e.set(u.JULIA_IMAG,x(i.juliaC[1]))),i.maxIterationsOverride!==null&&e.set(u.ITERATIONS,i.maxIterationsOverride.toString()),i.aaEnabled&&e.set(u.AA,"1"),e.toString()}function ee(i){const e=new URLSearchParams(i.replace(/^#/,"")),t={},n=g(e.get(u.TYPE));n!==null&&n>=0&&n<=19&&(t.fractalType=n);const r=g(e.get(u.CENTER_X));r!==null&&(t.centerX=r);const c=g(e.get(u.CENTER_Y));c!==null&&(t.centerY=c);const a=g(e.get(u.ZOOM));a!==null&&a>0&&(t.zoom=a);const h=e.get(u.PALETTE_TYPE);(h==="c"||h==="g")&&(t.paletteType=h==="c"?"cosine":"gradient");const f=g(e.get(u.COSINE_PALETTE));f!==null&&f>=0&&(t.cosinePaletteIndex=Math.floor(f));const p=g(e.get(u.GRADIENT_PALETTE));p!==null&&p>=0&&(t.gradientPaletteIndex=Math.floor(p));const d=g(e.get(u.PALETTE));d!==null&&d>=0&&d<=11&&(t.paletteIndex=Math.floor(d));const y=g(e.get(u.COLOR_OFFSET));y!==null&&(t.colorOffset=y);const S=g(e.get(u.JULIA_REAL)),b=g(e.get(u.JULIA_IMAG));S!==null&&b!==null&&(t.juliaC=[S,b]);const m=g(e.get(u.ITERATIONS));return m!==null&&m>0&&(t.maxIterationsOverride=Math.floor(m)),e.get(u.AA)==="1"&&(t.aaEnabled=!0),t}function te(i){const e=N(i),t=new URL(window.location.href);return t.hash=e,t.toString()}function ie(i){const e=N(i);window.history.replaceState(null,"","#"+e)}function ne(){return ee(window.location.hash)}async function ae(i){const e=te(i);try{return await navigator.clipboard.writeText(e),!0}catch{const t=document.createElement("textarea");t.value=e,t.style.position="fixed",t.style.left="-9999px",document.body.appendChild(t),t.select();try{return document.execCommand("copy"),!0}catch{return!1}finally{document.body.removeChild(t)}}}function l(i,e,t,n,r,c,a,h={}){return{name:i,description:e,key:t,state:{fractalType:n,centerX:r,centerY:c,zoom:a,paletteType:h.paletteType??"cosine",cosinePaletteIndex:h.cosinePaletteIndex??1,gradientPaletteIndex:h.gradientPaletteIndex??0,colorOffset:h.colorOffset??0,juliaC:h.juliaC??[-.7,.27015],maxIterationsOverride:h.maxIterationsOverride??null,aaEnabled:!1}}}const se=[l("Mandelbrot","The famous Mandelbrot set","1",s.Mandelbrot,-.5,0,.4),l("Seahorse Valley","The iconic seahorse-shaped spirals","2",s.Mandelbrot,-.7581249305506096,.11244273987387937,36.41989684959737,{cosinePaletteIndex:5,colorOffset:.05}),l("Elephant Valley","Elephant trunk-like spirals on the positive real side","3",s.Mandelbrot,.2746341335933571,.0066936145282295205,212.15493874953236,{cosinePaletteIndex:3,colorOffset:-.1}),l("Double Spiral Valley","Beautiful double spirals deep in the set","4",s.Mandelbrot,-.743733589978665,.130905227502858,350,{cosinePaletteIndex:5,colorOffset:.15000000000000002}),l("Spiral Galaxy","Galactic spiral arms emerging from chaos","5",s.Mandelbrot,-.7615484049386866,-.08478444765887823,1506.4927460380957,{cosinePaletteIndex:4,colorOffset:.04999999999999999}),l("Douady Rabbit","The famous rabbit-eared Julia set","6",s.MandelbrotJulia,0,0,.6,{cosinePaletteIndex:4,colorOffset:.2,juliaC:[-.123,.745]}),l("Dragon Julia","Fierce dragon-like Julia set","7",s.MandelbrotJulia,0,0,.45,{cosinePaletteIndex:3,colorOffset:-.49999999999999994,juliaC:[-.8,.156]}),l("Spiral Julia","Delicate spiral arms from the main cardioid edge","8",s.MandelbrotJulia,0,0,.5,{cosinePaletteIndex:8,colorOffset:.65,juliaC:[-.75,.11]}),l("Dendrite Julia","Tree-like branching structure on the real axis","9",s.MandelbrotJulia,0,0,.41791083585808675,{cosinePaletteIndex:5,colorOffset:.1,juliaC:[.285,.01]})],oe=[l("Main Ship","The iconic burning ship silhouette","1",s.BurningShip,-.6819541375872399,.5906040268456356,.4,{cosinePaletteIndex:4,colorOffset:.3}),l("The Armada","Mini ships along the antenna","2",s.BurningShip,-1.80173025652805,.0153452534367207,9,{cosinePaletteIndex:4,colorOffset:.2}),l("Bow Detail","Intricate patterns at the ship's bow","3",s.BurningShip,-1.7500929615866607,.0368035491770765,10,{cosinePaletteIndex:10,colorOffset:.1}),l("Bacteria Worm","Worm-like structures with mosaic patterns","4",s.BurningShipJulia,0,0,.3,{cosinePaletteIndex:10,colorOffset:-.5499999999999998,juliaC:[.5179709888623353,.8057669844188748]}),l("Wispy Coils","Wispy coils near the bulbous extrusion from the ship","5",s.BurningShipJulia,0,0,.4,{cosinePaletteIndex:4,colorOffset:.35,juliaC:[.2525994076160102,.0006358222328731386]}),l("Space Brain","Brain-like structures from the bottom of the ship","6",s.BurningShipJulia,0,0,.7,{cosinePaletteIndex:5,colorOffset:.3,juliaC:[-1.059944784917394,-.033218825489255054]}),l("Spiral Patterns","Spiral patterns near the bulbous extrusion","7",s.BurningShipJulia,0,0,.41,{cosinePaletteIndex:11,colorOffset:.55,juliaC:[.28292507376881926,-.007597008191683113]}),l("Detailed Patterns","Beautiful detailed patterns near the bottom of the ship","8",s.BurningShipJulia,0,0,.5,{cosinePaletteIndex:2,colorOffset:.6,juliaC:[-.3967192382583807,-.09102348993288789]})],re=[l("Tricorn","The main tricorn shape with its distinctive three-cornered symmetry","1",s.Tricorn,-.1343398614022916,-.07051105375213641,.24,{cosinePaletteIndex:11,colorOffset:-.45}),l("Skewed Mandelbrot","Skewed Mandelbrot from one of the main bulbs","2",s.Tricorn,-1.0683098234816064,.13055543771605108,722.5553792774821,{cosinePaletteIndex:5,colorOffset:1.1}),l("Lightning Bolts","Lightning bolt-like patterns near the main cardioid edge","3",s.TricornJulia,0,0,.5,{cosinePaletteIndex:5,colorOffset:1.2,juliaC:[-.7092474160797806,-.113024316756254]}),l("Water Lily Leaf","Leaf-like structures from the center of the edge of the main cardioid","4",s.TricornJulia,0,0,.43,{colorOffset:-.7000000000000003,juliaC:[-.1254330794660274,.2407433439223678]}),l("Lightning Brain","Brain-like structures","5",s.TricornJulia,0,0,3.15,{cosinePaletteIndex:5,juliaC:[.8748878776979363,-1.515483485507111]}),l("Spiral Mosaic","Mosaic patterns from the base of one of the main bulbs","6",s.TricornJulia,0,0,.5,{cosinePaletteIndex:11,colorOffset:1.55,juliaC:[-.5647012802389192,-.06508603367125808]}),l("Electric Tendrils","Electric tendril patterns with bright highlights","7",s.TricornJulia,0,0,.5,{cosinePaletteIndex:4,colorOffset:.05,juliaC:[-.511125124692869,.0500484416152959]})],le=[l("Celtic Knot","The main Celtic fractal shape","1",s.Celtic,-.5,0,.25,{cosinePaletteIndex:10,colorOffset:.05}),l("Celtic Detail","Intricate knotwork patterns","2",s.Celtic,-.7803221774980102,.1635662989215261,119.01480682794772,{cosinePaletteIndex:10,colorOffset:.25,maxIterationsOverride:1e4}),l("Leafy Spirals","Symmetric shapes from the tip of the celtic shape","3",s.CelticJulia,0,0,.55,{cosinePaletteIndex:7,colorOffset:.1,juliaC:[.25345198072532704,.0001580704105713714]}),l("Tendrils","Tendrils emerging from fog","4",s.CelticJulia,-.1649932591722856,-.033582161161888655,.28,{cosinePaletteIndex:5,juliaC:[-.4530201342281876,-.8993288590604025]}),l("Electric Buzz","Electric patterns with uniform patterned regions","5",s.CelticJulia,.2,-.3,.55,{colorOffset:.2000000000000001,juliaC:[-.6378073937333775,1.2082886796996293]}),l("Intricate Patterns","Knotwork patterns with intricate details","6",s.CelticJulia,0,0,.52,{cosinePaletteIndex:10,colorOffset:3.299999999999996,juliaC:[-.7610237673309276,.12050023730653406]}),l("Petri Dish","Bacteria-like patterns that spread outwards","7",s.CelticJulia,0,0,.55,{cosinePaletteIndex:10,colorOffset:4.449999999999991,juliaC:[-1.056655765809614,-.16855216053399263]})],ce=[l("Buffalo Overview","The distinctive Buffalo fractal shape","1",s.Buffalo,-.7,.6,.4,{cosinePaletteIndex:2,colorOffset:.49999999999999994}),l("Overgrown Cities","Tree or cathedral-like structures emerging from real axis","2",s.Buffalo,-1.75,.13,2.4,{colorOffset:-5}),l("Industrial Snowflake","Snowflake-like patterns with industrial structures woven in","3",s.BuffaloJulia,.45,0,.85,{cosinePaletteIndex:4,colorOffset:-9.1,juliaC:[-1.62727125821226,.00873720402364775]}),l("Plasma Bursts","Plasma-like bursts of color","4",s.BuffaloJulia,0,0,.5,{cosinePaletteIndex:8,colorOffset:-.75,juliaC:[.2745030250648227,.1797320656871218]}),l("Intricate Patterns","Intricate patterns near the bottom of the main shape","5",s.BuffaloJulia,0,0,.5,{cosinePaletteIndex:4,colorOffset:4.25,juliaC:[-.5828307625231954,-.3049842077590671]})],he=[l("Phoenix Overview","The Phoenix parameter space","1",s.Phoenix,-.15,-.7,.25,{cosinePaletteIndex:5,colorOffset:-.65}),l("Classic Phoenix Julia","The iconic feathery Phoenix fractal","2",s.PhoenixJulia,0,0,.5,{cosinePaletteIndex:2,colorOffset:.45,juliaC:[-.5,.5667],maxIterationsOverride:1152}),l("Phoenix Feathers","Detailed feather-like structures","3",s.PhoenixJulia,.38,.07,3.4,{cosinePaletteIndex:5,juliaC:[-.5,.5667]}),l("Golden Weaves","Bright golden patterns with intricate weaves","4",s.PhoenixJulia,0,.08,.4,{cosinePaletteIndex:2,colorOffset:.35,juliaC:[.656142759731905,.0353380147311402]}),l("Fiery Phoenix","Fiery wings spreading outwards","5",s.PhoenixJulia,0,-.03,.6,{cosinePaletteIndex:4,colorOffset:-1.7,juliaC:[-.272349453272398,.4059142585519806]})],de=[l("Multibrot³ Overview","The three-fold symmetric z³ Multibrot","1",s.Multibrot3,0,0,.35,{cosinePaletteIndex:5,colorOffset:2.35}),l("The Bulb","A bulbous extrusion from the main shape","2",s.Multibrot3,.5852686308492299,.27,6,{colorOffset:.10000000000000002}),l("Three-fold Spirals","Bright pearly spirals with three-fold symmetry","3",s.Multibrot3Julia,0,0,.4,{cosinePaletteIndex:10,colorOffset:.15,juliaC:[.5448826747676219,.26362559338015445]}),l("Multibrot³ Julia","A Julia set with three-fold symmetry","4",s.Multibrot3Julia,0,0,.434,{cosinePaletteIndex:5,colorOffset:.10000000000000002,juliaC:[-.45963436785036077,.03389484474578987]}),l("Double Elephant Valley","Two elephants in each group","5",s.Multibrot3,.42814685603247177,.012748071569601296,77,{cosinePaletteIndex:3,colorOffset:1}),l("Wonky Spiral","Wonky spiral Julia structure from inside the main set","6",s.Multibrot3Julia,.3695408370900379,.3371264555793177,2.274691481464049,{cosinePaletteIndex:0,colorOffset:0,juliaC:[.5277614770068884,.15853942850341446],maxIterationsOverride:2124}),l("Spiral Galaxies","The wonky spiral Julia structure viewed as galaxies","7",s.Multibrot3Julia,0,0,.4,{paletteType:"gradient",juliaC:[.5277614770068884,.15853942850341446],maxIterationsOverride:1152})],ue=[l("Multibrot⁴ Overview","The four-fold symmetric z⁴ Multibrot","1",s.Multibrot4,0,0,.4,{cosinePaletteIndex:5,colorOffset:0}),l("Atomic Spirals","Structures resembling atomic orbitals with spiral patterns","2",s.Multibrot4Julia,0,-0,.35,{cosinePaletteIndex:5,colorOffset:.4,juliaC:[-.7878865573262246,.02073442187254452]})],fe=[l("Funky Overview","The wonderfully weird Funky fractal","1",s.Funky,-.5,0,.35,{cosinePaletteIndex:4,colorOffset:.25}),l("Tulip Bulb","Extrusions resembling tulips near the top of the main shape","2",s.Funky,.303,.534,6.3,{cosinePaletteIndex:10,colorOffset:-.05000000000000002}),l("Battleship","Spaceship-like structure with double turrets all around","3",s.FunkyJulia,0,0,.45,{cosinePaletteIndex:4,colorOffset:-.7,juliaC:[-1.02568231965141,.128286053018475]}),l("Frog Crab","Crablike structure with brain-like spiral patterns within it","4",s.FunkyJulia,0,0,.37,{colorOffset:.1,juliaC:[.30191025227457674,.5253550579235958]}),l("Spiral Details","Beautiful spiral details without too much clutter","5",s.FunkyJulia,-.2,0,.4,{cosinePaletteIndex:5,colorOffset:.6,juliaC:[-.06404194046216194,.662960137583706]}),l("Migrating Birds","Bird-like shapes flying in formation","6",s.FunkyJulia,.34,0,.35,{cosinePaletteIndex:5,colorOffset:4.4,juliaC:[.5804003550040334,-.9094296635818582]})],pe=[l("Perpendicular Overview","The Perpendicular Mandelbrot variant","1",s.Perpendicular,-.5,0,.4,{cosinePaletteIndex:2,colorOffset:0}),l("Perpendicular Spirals","Unique spiral formations","2",s.Perpendicular,-.75,.1,8,{cosinePaletteIndex:4,colorOffset:.1}),l("Perpendicular Julia","A Julia set from the Perpendicular fractal","3",s.PerpendicularJulia,0,0,.5,{cosinePaletteIndex:0,colorOffset:0,juliaC:[-.5,.5]})],ge=new Map([[s.Mandelbrot,se],[s.BurningShip,oe],[s.Tricorn,re],[s.Celtic,le],[s.Buffalo,ce],[s.Phoenix,he],[s.Multibrot3,de],[s.Multibrot4,ue],[s.Funky,fe],[s.Perpendicular,pe]]);function me(i,e){const t=M(e),n=ge.get(t);if(n)return n.find(r=>r.key===i)}const w=[{name:"Rainbow",isMonotonic:!1,params:{type:"cosine",a:[.5,.5,.5],b:[.5,.5,.5],c:[1,1,1],d:[0,.33,.67]}},{name:"Fire",isMonotonic:!1,params:{type:"cosine",a:[.5,.5,.5],b:[.5,.5,.5],c:[1,1,.5],d:[0,.1,.2]}},{name:"Ice",isMonotonic:!1,params:{type:"cosine",a:[.5,.5,.5],b:[.5,.5,.5],c:[1,.7,.4],d:[0,.15,.2]}},{name:"Sunset",isMonotonic:!1,params:{type:"cosine",a:[.5,.3,.2],b:[.5,.4,.3],c:[1,1,.5],d:[0,.1,.2]}},{name:"Electric",isMonotonic:!1,params:{type:"cosine",a:[.5,.5,.5],b:[.6,.6,.6],c:[1,1,1],d:[.3,.2,.2]}},{name:"Neon",isMonotonic:!1,params:{type:"cosine",a:[.5,.5,.5],b:[.5,.5,.5],c:[1,1,1],d:[0,.1,.2]}},{name:"Emerald",isMonotonic:!1,params:{type:"cosine",a:[.2,.5,.3],b:[.3,.5,.3],c:[1,1,1],d:[0,.25,.5]}},{name:"Candy",isMonotonic:!1,params:{type:"cosine",a:[.8,.5,.5],b:[.2,.4,.4],c:[1,1,2],d:[0,.25,.25]}},{name:"Plasma",isMonotonic:!1,params:{type:"cosine",a:[.5,.5,.5],b:[.5,.5,.5],c:[2,1,0],d:[.5,.2,.25]}},{name:"Peacock",isMonotonic:!1,params:{type:"cosine",a:[.3,.5,.5],b:[.4,.4,.3],c:[1,1,1],d:[0,.1,.35]}},{name:"Autumn",isMonotonic:!1,params:{type:"cosine",a:[.6,.4,.2],b:[.4,.3,.2],c:[1,1,1],d:[0,.05,.1]}},{name:"Aurora",isMonotonic:!1,params:{type:"cosine",a:[.3,.5,.5],b:[.5,.5,.5],c:[1,1,.5],d:[.8,.9,.3]}}],k=[{name:"Blue",isMonotonic:!0,params:{type:"gradient",c1:[.02,.01,.08],c2:[.05,.15,.25],c3:[.1,.4,.5],c4:[.3,.6,.8],c5:[.7,.9,1]},hdrParams:{type:"gradient",c1:[.2,.4,1],c2:[.3,.6,1],c3:[.4,.8,1],c4:[.6,.9,1],c5:[.85,1,1]}},{name:"Gold",isMonotonic:!0,params:{type:"gradient",c1:[.04,.02,.01],c2:[.2,.08,.02],c3:[.5,.25,.05],c4:[.85,.6,.2],c5:[1,.95,.7]},hdrParams:{type:"gradient",c1:[1,.5,.1],c2:[1,.65,.2],c3:[1,.8,.3],c4:[1,.9,.5],c5:[1,1,.8]}},{name:"Grayscale",isMonotonic:!0,params:{type:"gradient",c1:[.01,.01,.03],c2:[.15,.15,.17],c3:[.45,.45,.45],c4:[.75,.74,.72],c5:[1,.98,.95]},hdrParams:{type:"gradient",c1:[1,1,1],c2:[1,1,1],c3:[1,1,1],c4:[1,1,1],c5:[1,1,1]}},{name:"Sepia",isMonotonic:!0,params:{type:"gradient",c1:[.03,.02,.01],c2:[.15,.08,.03],c3:[.4,.25,.12],c4:[.7,.55,.35],c5:[1,.95,.85]},hdrParams:{type:"gradient",c1:[1,.7,.4],c2:[1,.8,.55],c3:[1,.88,.7],c4:[1,.95,.85],c5:[1,1,.95]}},{name:"Ocean",isMonotonic:!0,params:{type:"gradient",c1:[0,.02,.05],c2:[.02,.08,.2],c3:[.05,.3,.4],c4:[.2,.6,.6],c5:[.6,.95,.9]},hdrParams:{type:"gradient",c1:[.1,.8,.8],c2:[.2,.9,.85],c3:[.4,.95,.9],c4:[.65,1,.95],c5:[.85,1,1]}},{name:"Purple",isMonotonic:!0,params:{type:"gradient",c1:[.03,.01,.06],c2:[.15,.05,.25],c3:[.4,.15,.5],c4:[.7,.4,.75],c5:[.95,.8,1]},hdrParams:{type:"gradient",c1:[.8,.2,1],c2:[.85,.4,1],c3:[.9,.6,1],c4:[.95,.8,1],c5:[1,.95,1]}},{name:"Forest",isMonotonic:!0,params:{type:"gradient",c1:[.02,.03,.01],c2:[.05,.12,.04],c3:[.1,.35,.15],c4:[.3,.65,.3],c5:[.7,.95,.6]},hdrParams:{type:"gradient",c1:[.3,1,.2],c2:[.5,1,.4],c3:[.7,1,.55],c4:[.85,1,.75],c5:[.95,1,.9]}}],C=w.length,P=k.length;function ye(i){return w[i%C].params}function be(i,e){const t=k[i%P];return e&&t.hdrParams?t.hdrParams:t.params}function ve(i){return w[i%C]}function xe(i){return k[i%P]}function Ce(i){return w[i%C].name}function Pe(i){return k[i%P].name}const ze=`// WebGPU Shader for Mandelbrot Set with HDR support
// Version 2: Palette parameters passed from TypeScript (no branching)

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
  _pad0: f32,                // offset 68, size 4
  _pad1: f32,                // offset 72, size 4
  _pad2: f32,                // offset 76, size 4
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

  if (isJulia) {
    // For Phoenix Julia, swap and negate to match conventional orientation
    // (feathers extending horizontally, correct vertical orientation)
    if (isPhoenix) {
      z = vec2f(-pos.y, pos.x);  // Rotate 90° CCW to match reference images
    } else {
      z = pos;
    }
    c = u.juliaC;
  } else {
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

    // Fractal type dispatch using base type (fType >> 1 clears Julia bit)
    // 0: Mandelbrot/Julia, 1: Burning Ship, 2: Tricorn, 3: Celtic,
    // 4: Buffalo, 5: Phoenix, 6: Multibrot3, 7: Multibrot4, 8: Perpendicular

    if (baseType == 0) {
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
`,Se=256,Te=512,Ie=4096,we=640,ke=1.65,H=1.5;function L(i,e=!1){const t=Math.max(1,i),n=Math.log10(t),r=e?Te:Se,c=r+we*Math.pow(n,ke);return Math.round(Math.max(r,Math.min(Ie,c)))}const j=256;class E{constructor(e,t){o(this,"renderer");o(this,"viewState");o(this,"inputHandler");o(this,"pipeline");o(this,"uniformBuffer");o(this,"bindGroup");o(this,"maxIterationsOverride",null);o(this,"fractalType",s.Mandelbrot);o(this,"juliaC",[-.7,.27015]);o(this,"juliaPickerMode",!1);o(this,"isActivelyPickingJulia",!1);o(this,"savedViewState",null);o(this,"savedFractalType",null);o(this,"paletteType","cosine");o(this,"cosinePaletteIndex",1);o(this,"gradientPaletteIndex",0);o(this,"colorOffset",0);o(this,"hdrBrightnessBias",0);o(this,"sdrGradientBrightness",1);o(this,"debugOverlay",null);o(this,"shareNotification",null);o(this,"helpOverlay",null);o(this,"helpVisible",!1);o(this,"screenshotMode",!1);o(this,"handleResize",()=>{this.renderer.resize(window.innerWidth,window.innerHeight),this.render()});o(this,"handleHashChange",()=>{this.loadBookmark()});this.renderer=e,this.viewState=new V,this.inputHandler=new W(t,this.viewState,()=>{this.render()}),this.setupInputCallbacks(),this.setupOverlays(t)}static async create(e){const t=await I.create(e),n=new E(t,e);return await n.initializePipeline(),t.setOnHdrChange(()=>{console.log("HDR status changed, re-rendering..."),n.render()}),window.addEventListener("resize",n.handleResize),window.addEventListener("hashchange",n.handleHashChange),n.loadBookmark(),n.handleResize(),n}async initializePipeline(){const e=this.renderer.device,t=e.createShaderModule({label:"Mandelbrot Shader",code:ze});this.uniformBuffer=e.createBuffer({label:"Uniforms",size:j,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});const n=e.createBindGroupLayout({label:"Bind Group Layout",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]});this.bindGroup=e.createBindGroup({label:"Bind Group",layout:n,entries:[{binding:0,resource:{buffer:this.uniformBuffer}}]});const r=e.createPipelineLayout({label:"Pipeline Layout",bindGroupLayouts:[n]});this.pipeline=e.createRenderPipeline({label:"Mandelbrot Pipeline",layout:r,vertex:{module:t,entryPoint:"vertexMain"},fragment:{module:t,entryPoint:"fragmentMain",targets:[{format:this.renderer.format}]},primitive:{topology:"triangle-list"}}),console.log("WebGPU pipeline initialized")}setupInputCallbacks(){this.inputHandler.setIterationAdjustCallback(e=>{this.adjustMaxIterations(e)}),this.inputHandler.setIterationResetCallback(()=>{this.clearMaxIterationsOverride()}),this.inputHandler.setCosinePaletteCycleCallback(e=>{this.cycleCosinePalette(e)}),this.inputHandler.setGradientPaletteCycleCallback(e=>{this.cycleGradientPalette(e)}),this.inputHandler.setColorOffsetCallback(e=>{this.adjustColorOffset(e)}),this.inputHandler.setColorOffsetResetCallback(()=>{this.resetColorOffset()}),this.inputHandler.setToggleAACallback(()=>{console.log("AA not available in WebGPU HDR mode")}),this.inputHandler.setToggleHDRCallback(()=>{this.toggleHDR()}),this.inputHandler.setAdjustHdrBrightnessCallback(e=>{this.adjustHdrBrightness(e)}),this.inputHandler.setResetHdrBrightnessCallback(()=>{this.resetHdrBrightness()}),this.inputHandler.setFractalCycleCallback(e=>{this.cycleFractalType(e)}),this.inputHandler.setToggleJuliaModeCallback(()=>{this.toggleJuliaPickerMode()}),this.inputHandler.setJuliaPickCallback((e,t)=>{this.pickJuliaConstant(e,t)}),this.inputHandler.setJuliaPickEndCallback(()=>{this.endJuliaPicking()}),this.inputHandler.setShareCallback(()=>{this.shareBookmark()}),this.inputHandler.setLocationSelectCallback(e=>{this.goToLocation(e)}),this.inputHandler.setToggleHelpCallback(()=>{this.toggleHelp()}),this.inputHandler.setToggleScreenshotModeCallback(()=>{this.toggleScreenshotMode()})}setupOverlays(e){const t=e.parentElement;t&&(this.debugOverlay=document.createElement("div"),this.debugOverlay.id="zoom-debug",t.appendChild(this.debugOverlay),this.shareNotification=document.createElement("div"),this.shareNotification.id="share-notification",this.shareNotification.style.cssText=`
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
    `,t.appendChild(this.helpOverlay))}render(){const e=this.renderer.device,t=this.renderer.canvas,n=z(this.fractalType),r=this.maxIterationsOverride??L(this.viewState.zoom,n);if(this.debugOverlay&&!this.screenshotMode){const m=this.viewState.zoom,G=m>=1e6?m.toExponential(2):m<1?m.toPrecision(4):String(Math.round(m)),F=this.maxIterationsOverride!==null?" (manual)":"",Y=this.paletteType==="cosine"?Ce(this.cosinePaletteIndex):Pe(this.gradientPaletteIndex),X=K[this.fractalType],U=this.renderer.hdrEnabled?Math.abs(this.hdrBrightnessBias)>.01?`HDR (${this.hdrBrightnessBias>0?"+":""}${this.hdrBrightnessBias.toFixed(2)})`:"HDR":this.renderer.displaySupportsHDR?"HDR available":"SDR",A=!this.renderer.hdrEnabled&&this.paletteType==="gradient"&&Math.abs(this.sdrGradientBrightness-1)>.01?`brightness ${this.sdrGradientBrightness.toFixed(1)}`:"",R=this.juliaPickerMode?"🎯 Pick Julia point":"",B=n?`c=(${this.juliaC[0].toFixed(4)}, ${this.juliaC[1].toFixed(4)})`:"",D=Math.abs(this.colorOffset)>.001?`offset ${this.colorOffset.toFixed(1)}`:"",v=[X,`zoom ${G}`,`iterations ${r}${F}`,Y];D&&v.push(D),A&&v.push(A),B&&v.push(B),v.push(U),R&&v.push(R),v.push("H = help"),this.debugOverlay.textContent=v.join("  ·  ")}const c=new ArrayBuffer(j),a=new Float32Array(c),h=new Int32Array(c),f=this.paletteType==="cosine",p=f?ve(this.cosinePaletteIndex):xe(this.gradientPaletteIndex),d=f?ye(this.cosinePaletteIndex):be(this.gradientPaletteIndex,this.renderer.hdrEnabled);a[0]=t.width,a[1]=t.height,a[2]=this.viewState.centerX,a[3]=this.viewState.centerY,a[4]=this.viewState.zoom,h[5]=r,a[6]=performance.now()*.001,a[7]=this.colorOffset,h[8]=this.fractalType,a[10]=this.juliaC[0],a[11]=this.juliaC[1],h[12]=this.renderer.hdrEnabled?1:0,a[13]=this.hdrBrightnessBias,h[14]=d.type==="cosine"?0:1,h[15]=p.isMonotonic?1:0,a[16]=this.sdrGradientBrightness,d.type==="cosine"&&(a[20]=d.a[0],a[21]=d.a[1],a[22]=d.a[2],a[24]=d.b[0],a[25]=d.b[1],a[26]=d.b[2],a[28]=d.c[0],a[29]=d.c[1],a[30]=d.c[2],a[32]=d.d[0],a[33]=d.d[1],a[34]=d.d[2]),d.type==="gradient"&&(a[36]=d.c1[0],a[37]=d.c1[1],a[38]=d.c1[2],a[40]=d.c2[0],a[41]=d.c2[1],a[42]=d.c2[2],a[44]=d.c3[0],a[45]=d.c3[1],a[46]=d.c3[2],a[48]=d.c4[0],a[49]=d.c4[1],a[50]=d.c4[2],a[52]=d.c5[0],a[53]=d.c5[1],a[54]=d.c5[2]),e.queue.writeBuffer(this.uniformBuffer,0,c);const y=e.createCommandEncoder(),S=this.renderer.getCurrentTexture().createView(),b=y.beginRenderPass({colorAttachments:[{view:S,clearValue:{r:0,g:0,b:0,a:1},loadOp:"clear",storeOp:"store"}]});b.setPipeline(this.pipeline),b.setBindGroup(0,this.bindGroup),b.draw(3),b.end(),e.queue.submit([y.finish()])}start(){this.renderer.start(()=>this.render())}stop(){this.renderer.stop()}adjustMaxIterations(e){const t=z(this.fractalType),n=this.maxIterationsOverride??L(this.viewState.zoom,t),r=e>0?n*H:n/H;this.maxIterationsOverride=Math.round(Math.max(1,r)),this.render()}clearMaxIterationsOverride(){this.maxIterationsOverride=null,this.render()}toggleHDR(){console.log(`HDR is ${this.renderer.hdrEnabled?"enabled":"not available"}`),this.render()}adjustHdrBrightness(e){this.renderer.hdrEnabled?this.hdrBrightnessBias=Math.max(-1,Math.min(1,this.hdrBrightnessBias+e*.1)):this.paletteType==="gradient"&&(this.sdrGradientBrightness=Math.max(.1,Math.min(10,this.sdrGradientBrightness+e*.2))),this.render()}resetHdrBrightness(){this.hdrBrightnessBias=0,this.sdrGradientBrightness=1,this.render()}cycleCosinePalette(e){this.cosinePaletteIndex=(this.cosinePaletteIndex+e+C)%C,this.paletteType="cosine",this.render()}cycleGradientPalette(e){this.gradientPaletteIndex=(this.gradientPaletteIndex+e+P)%P,this.paletteType="gradient",this.render()}adjustColorOffset(e){this.colorOffset+=e,this.render()}resetColorOffset(){this.colorOffset=0,this.render()}cycleFractalType(e=1){const r=((M(this.fractalType)>>1)+e+J)%J;this.fractalType=r<<1,this.juliaPickerMode&&(this.juliaPickerMode=!1,this.inputHandler.setJuliaPickerMode(!1)),this.render()}toggleJuliaPickerMode(){if(z(this.fractalType)){this.exitJuliaMode();return}this.juliaPickerMode=!this.juliaPickerMode,this.inputHandler.setJuliaPickerMode(this.juliaPickerMode),this.render()}pickJuliaConstant(e,t){this.juliaPickerMode&&(this.isActivelyPickingJulia||(this.savedViewState={centerX:this.viewState.centerX,centerY:this.viewState.centerY,zoom:this.viewState.zoom},this.savedFractalType=this.fractalType,this.fractalType=Q(this.fractalType),this.viewState.centerX=0,this.viewState.centerY=0,this.viewState.zoom=.5,this.isActivelyPickingJulia=!0),this.juliaC=[e,t],this.render())}endJuliaPicking(){this.isActivelyPickingJulia&&(this.isActivelyPickingJulia=!1,this.juliaPickerMode=!1,this.inputHandler.setJuliaPickerMode(!1),this.render())}exitJuliaMode(){this.savedViewState&&(this.viewState.centerX=this.savedViewState.centerX,this.viewState.centerY=this.savedViewState.centerY,this.viewState.zoom=this.savedViewState.zoom,this.savedViewState=null),this.savedFractalType!==null?(this.fractalType=this.savedFractalType,this.savedFractalType=null):this.fractalType=M(this.fractalType),this.juliaPickerMode=!1,this.inputHandler.setJuliaPickerMode(!1),this.render()}getBookmarkState(){return{fractalType:this.fractalType,centerX:this.viewState.centerX,centerY:this.viewState.centerY,zoom:this.viewState.zoom,paletteType:this.paletteType,cosinePaletteIndex:this.cosinePaletteIndex,gradientPaletteIndex:this.gradientPaletteIndex,colorOffset:this.colorOffset,juliaC:this.juliaC,maxIterationsOverride:this.maxIterationsOverride,aaEnabled:!1}}loadBookmark(){const e=ne();if(e){if(e.centerX!==void 0&&(this.viewState.centerX=e.centerX),e.centerY!==void 0&&(this.viewState.centerY=e.centerY),e.zoom!==void 0&&(this.viewState.zoom=e.zoom),e.maxIterationsOverride!==void 0&&(this.maxIterationsOverride=e.maxIterationsOverride),e.paletteType!==void 0&&(this.paletteType=e.paletteType),e.cosinePaletteIndex!==void 0&&(this.cosinePaletteIndex=e.cosinePaletteIndex%C),e.gradientPaletteIndex!==void 0&&(this.gradientPaletteIndex=e.gradientPaletteIndex%P),e.paletteIndex!==void 0&&e.paletteType===void 0){const t=[0,4,5,10,11];if(t.includes(e.paletteIndex))this.paletteType="cosine",this.cosinePaletteIndex=t.indexOf(e.paletteIndex);else{this.paletteType="gradient";const n=[1,2,3,6,7,8,9];this.gradientPaletteIndex=n.indexOf(e.paletteIndex)}}e.colorOffset!==void 0&&(this.colorOffset=e.colorOffset),e.fractalType!==void 0&&(this.fractalType=e.fractalType),e.juliaC!==void 0&&(this.juliaC=e.juliaC),this.render()}}goToLocation(e){const t=me(e,this.fractalType);if(!t)return;const n=t.state;this.viewState.centerX=n.centerX,this.viewState.centerY=n.centerY,this.viewState.zoom=n.zoom,this.maxIterationsOverride=n.maxIterationsOverride,this.fractalType=n.fractalType,this.juliaC=n.juliaC,this.paletteType=n.paletteType,this.cosinePaletteIndex=n.cosinePaletteIndex,this.gradientPaletteIndex=n.gradientPaletteIndex,this.colorOffset=n.colorOffset,this.showLocationNotification(t.name,t.description),this.updateUrlBookmark(),this.render()}showLocationNotification(e,t){this.shareNotification&&(this.shareNotification.innerHTML=`<strong style="font-size: 18px;">📍 ${e}</strong><br><span style="color: #aaa; font-size: 14px;">${t}</span>`,this.shareNotification.style.color="#60a5fa",this.shareNotification.style.opacity="1",setTimeout(()=>{this.shareNotification&&(this.shareNotification.style.opacity="0")},2500))}updateUrlBookmark(){ie(this.getBookmarkState())}async shareBookmark(){const e=await ae(this.getBookmarkState());this.showShareNotification(e),e&&this.updateUrlBookmark(),(window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1")&&this.logCreateLocationCode()}logCreateLocationCode(){const e=this.getFractalTypeEnumName(this.fractalType),t=z(this.fractalType),n=[];this.paletteType==="gradient"?(n.push("paletteType: 'gradient'"),this.gradientPaletteIndex!==0&&n.push(`gradientPaletteIndex: ${this.gradientPaletteIndex}`)):this.cosinePaletteIndex!==1&&n.push(`cosinePaletteIndex: ${this.cosinePaletteIndex}`),Math.abs(this.colorOffset)>.001&&n.push(`colorOffset: ${this.colorOffset}`),t&&n.push(`juliaC: [${this.juliaC[0]}, ${this.juliaC[1]}]`),this.maxIterationsOverride!==null&&n.push(`maxIterationsOverride: ${this.maxIterationsOverride}`);const r=n.length>0?`,
    { ${n.join(", ")} }`:"",c=`createLocation(
    'TODO: Name',
    'TODO: Description',
    'TODO: Key (1-9)',
    FractalType.${e},
    ${this.viewState.centerX}, ${this.viewState.centerY}, ${this.viewState.zoom}${r}
  ),`;console.log("%c📍 createLocation() code:","color: #4ade80; font-weight: bold; font-size: 14px;"),console.log(c)}getFractalTypeEnumName(e){const t=Object.entries(s);for(const[n,r]of t)if(r===e&&isNaN(Number(n)))return n;return`Unknown(${e})`}showShareNotification(e){this.shareNotification&&(this.shareNotification.textContent=e?"📋 Link copied to clipboard!":"❌ Failed to copy link",this.shareNotification.style.color=e?"#4ade80":"#f87171",this.shareNotification.style.opacity="1",setTimeout(()=>{this.shareNotification&&(this.shareNotification.style.opacity="0")},2e3))}toggleHelp(){this.helpVisible=!this.helpVisible,this.helpOverlay&&(this.helpOverlay.style.opacity=this.helpVisible?"1":"0",this.helpOverlay.style.pointerEvents=this.helpVisible?"auto":"none")}toggleScreenshotMode(){this.screenshotMode=!this.screenshotMode,this.screenshotMode&&this.helpVisible&&(this.helpVisible=!1,this.helpOverlay&&(this.helpOverlay.style.opacity="0",this.helpOverlay.style.pointerEvents="none")),this.debugOverlay&&(this.debugOverlay.style.display=this.screenshotMode?"none":"block"),this.shareNotification&&(this.shareNotification.textContent=this.screenshotMode?"📷 Screenshot mode (Space to exit)":"📷 UI restored",this.shareNotification.style.color="#60a5fa",this.shareNotification.style.opacity="1",setTimeout(()=>{this.shareNotification&&(this.shareNotification.style.opacity="0")},1e3))}createHelpContent(){return`
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
    `}destroy(){this.stop(),window.removeEventListener("resize",this.handleResize),window.removeEventListener("hashchange",this.handleHashChange),this.debugOverlay?.remove(),this.shareNotification?.remove(),this.helpOverlay?.remove(),this.inputHandler.destroy(),this.renderer.destroy()}}console.log("Fractal Explorer - Initializing...");let T=null;async function _(){const i=document.getElementById("app");if(!i){console.error("Could not find #app element");return}if(!I.isSupported()){i.innerHTML=`
      <div style="color: white; text-align: center; padding: 40px; font-family: system-ui, sans-serif;">
        <h1>WebGPU Not Supported</h1>
        <p>This application requires WebGPU, which is not available in your browser.</p>
        <p style="margin-top: 20px; color: #888;">
          Please use a modern browser with WebGPU support:<br>
          Chrome 113+, Edge 113+, or Firefox Nightly with WebGPU enabled.
        </p>
      </div>
    `;return}const e=document.createElement("canvas");e.id="fractal-canvas",i.appendChild(e);try{T=await E.create(e),T.start(),console.log("Fractal Explorer initialized successfully"),console.log("Controls:"),console.log("  - Drag to pan"),console.log("  - Scroll to zoom"),console.log("  - Double-click to zoom in"),console.log("  - Touch drag to pan (mobile)"),console.log("  - Pinch to zoom (mobile)"),console.log("  - + / - to adjust max iterations"),console.log("  - 0 to reset iterations to auto-scaling"),console.log("  - c / C to cycle cosine palettes (forward/backward)"),console.log("  - g / G to cycle gradient palettes (forward/backward)"),console.log("  - , / . to shift colors (fine)"),console.log("  - < / > to shift colors (coarse)"),console.log("  - b / B to adjust brightness (HDR bias or SDR gradient)"),console.log("  - d to reset brightness"),console.log("  - s to share/copy bookmark URL"),console.log("  - 1-9 to visit famous locations"),console.log("  - h to toggle help overlay"),console.log("  - Space to toggle screenshot mode")}catch(t){console.error("Failed to initialize Fractal Explorer:",t),i.innerHTML=`
      <div style="color: white; text-align: center; padding: 20px; font-family: system-ui, sans-serif;">
        <h1>Initialization Error</h1>
        <p>Failed to initialize the application.</p>
        <pre style="text-align: left; margin-top: 20px; color: #ff6b6b;">${t instanceof Error?t.message:String(t)}</pre>
      </div>
    `}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>_()):_();window.addEventListener("beforeunload",()=>{T&&T.destroy()});
//# sourceMappingURL=index-CY3EKhT-.js.map
