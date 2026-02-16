var ie=Object.defineProperty;var se=(i,e,t)=>e in i?ie(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t;var o=(i,e,t)=>se(i,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const r of a)if(r.type==="childList")for(const h of r.addedNodes)h.tagName==="LINK"&&h.rel==="modulepreload"&&s(h)}).observe(document,{childList:!0,subtree:!0});function t(a){const r={};return a.integrity&&(r.integrity=a.integrity),a.referrerPolicy&&(r.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?r.credentials="include":a.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(a){if(a.ep)return;a.ep=!0;const r=t(a);fetch(a.href,r)}})();class _{constructor(e){o(this,"device");o(this,"context");o(this,"canvas");o(this,"format");o(this,"animationFrameId",null);o(this,"renderCallback",null);o(this,"hdrEnabled",!1);o(this,"_displaySupportsHDR",!1);o(this,"hdrMediaQuery",null);o(this,"onHdrChangeCallback",null);this.canvas=e,this._displaySupportsHDR=this.detectHDRDisplay(),this.setupHdrMediaQueryListener()}get displaySupportsHDR(){return this._displaySupportsHDR}static async create(e){const t=new _(e);return await t.initialize(),t}static isSupported(){return"gpu"in navigator}async initialize(){if(!navigator.gpu)throw new Error("WebGPU is not supported in this browser");console.log("WebGPU HDR capability check:"),console.log("  - Display supports HDR:",this.displaySupportsHDR),console.log("  - dynamic-range: high:",window.matchMedia?.("(dynamic-range: high)").matches),console.log("  - color-gamut: p3:",window.matchMedia?.("(color-gamut: p3)").matches);const e=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!e)throw new Error("Failed to get WebGPU adapter");if("info"in e){const t=e.info;console.log("  - Adapter:",t?.vendor,t?.architecture)}if(this.device=await e.requestDevice(),this.context=this.canvas.getContext("webgpu"),!this.context)throw new Error("Failed to get WebGPU context");this.configureContext(),console.log("WebGPU initialized successfully"),this.hdrEnabled&&console.log("HDR mode enabled with rgba16float + extended tone mapping")}configureContext(){const e=navigator.gpu.getPreferredCanvasFormat();if(this.displaySupportsHDR)try{this.format="rgba16float",this.context.configure({device:this.device,format:this.format,alphaMode:"opaque",toneMapping:{mode:"extended"}}),this.hdrEnabled=!0,console.log("  - Configured with rgba16float + extended tone mapping (HDR)")}catch(t){console.log("  - HDR configuration failed, falling back to SDR:",t),this.format=e,this.context.configure({device:this.device,format:this.format,alphaMode:"opaque"}),this.hdrEnabled=!1}else this.format=e,this.context.configure({device:this.device,format:this.format,alphaMode:"opaque"}),this.hdrEnabled=!1,console.log("  - Configured with",this.format,"(SDR)")}resize(e,t){const s=window.devicePixelRatio||1;this.canvas.width=e*s,this.canvas.height=t*s,this.canvas.style.width=`${e}px`,this.canvas.style.height=`${t}px`}getCurrentTexture(){return this.context.getCurrentTexture()}start(e){if(this.animationFrameId!==null)return;this.renderCallback=e;const t=()=>{this.renderCallback&&this.renderCallback(),this.animationFrameId=requestAnimationFrame(t)};this.animationFrameId=requestAnimationFrame(t)}stop(){this.animationFrameId!==null&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null),this.renderCallback=null}detectHDRDisplay(){return!!window.matchMedia?.("(dynamic-range: high)").matches}setupHdrMediaQueryListener(){if(!window.matchMedia)return;this.hdrMediaQuery=window.matchMedia("(dynamic-range: high)");const e=()=>{const t=this.detectHDRDisplay();t!==this._displaySupportsHDR&&(console.log(`HDR display support changed: ${this._displaySupportsHDR} -> ${t}`),this._displaySupportsHDR=t,this.context&&this.device&&this.configureContext(),this.onHdrChangeCallback?.())};this.hdrMediaQuery.addEventListener?.("change",e)}setOnHdrChange(e){this.onHdrChangeCallback=e}destroy(){this.stop(),this.onHdrChangeCallback=null,this.device?.destroy()}}const ae=.6;function B(i){return 1+(i-1)*ae}const O=class O{constructor(e,t,s,a={}){o(this,"canvas");o(this,"viewState");o(this,"onChange");o(this,"callbacks");o(this,"isDragging",!1);o(this,"lastX",0);o(this,"lastY",0);o(this,"lastTouchDistance",0);o(this,"juliaPickerMode",!1);o(this,"isPickingJulia",!1);o(this,"juliaPickViewState",null);o(this,"keyboardZoomDirection",null);o(this,"keyboardZoomStartTime",0);o(this,"keyboardZoomAnimationId",null);o(this,"locationKeyHeld",null);o(this,"locationLongPressTimeout",null);this.canvas=e,this.viewState=t,this.onChange=s,this.callbacks=a,this.setupEventListeners()}setCallbacks(e){this.callbacks={...this.callbacks,...e}}setJuliaPickerMode(e){this.juliaPickerMode=e,this.canvas.style.cursor=e?"crosshair":"grab"}isJuliaPickerModeActive(){return this.juliaPickerMode}setupEventListeners(){this.canvas.addEventListener("mousedown",this.handleMouseDown.bind(this)),this.canvas.addEventListener("mousemove",this.handleMouseMove.bind(this)),this.canvas.addEventListener("mouseup",this.handleMouseUp.bind(this)),this.canvas.addEventListener("mouseleave",this.handleMouseUp.bind(this)),this.canvas.addEventListener("wheel",this.handleWheel.bind(this),{passive:!1}),this.canvas.addEventListener("dblclick",this.handleDoubleClick.bind(this)),this.canvas.addEventListener("touchstart",this.handleTouchStart.bind(this),{passive:!1}),this.canvas.addEventListener("touchmove",this.handleTouchMove.bind(this),{passive:!1}),this.canvas.addEventListener("touchend",this.handleTouchEnd.bind(this)),this.canvas.addEventListener("touchcancel",this.handleTouchEnd.bind(this)),window.addEventListener("keydown",this.handleKeyDown.bind(this)),window.addEventListener("keyup",this.handleKeyUp.bind(this))}getCanvasRect(){return this.canvas.getBoundingClientRect()}getScreenCoords(e,t){const s=this.getCanvasRect();return[e-s.left,t-s.top]}getCanvasSize(){const e=this.getCanvasRect();return[e.width,e.height]}toFractalCoordsWithView(e,t,s,a,r){const h=s/a,d=(e/s-.5)*h,p=t/a-.5,c=r.centerX+d/r.zoom,f=r.centerY-p/r.zoom;return[c,f]}notifyChange(){this.onChange(this.viewState)}handleMouseDown(e){if(e.button!==0)return;const[t,s]=this.getScreenCoords(e.clientX,e.clientY);if(this.juliaPickerMode&&this.callbacks.onJuliaPick){const[a,r]=this.getCanvasSize();this.juliaPickViewState={centerX:this.viewState.centerX,centerY:this.viewState.centerY,zoom:this.viewState.zoom};const[h,d]=this.toFractalCoordsWithView(t,s,a,r,this.juliaPickViewState);this.isPickingJulia=!0,this.lastX=t,this.lastY=s,this.callbacks.onJuliaPick(h,d);return}this.isDragging=!0,this.lastX=t,this.lastY=s,this.canvas.style.cursor="grabbing"}handleMouseMove(e){const[t,s]=this.getScreenCoords(e.clientX,e.clientY);if(this.isPickingJulia&&this.callbacks.onJuliaPick&&this.juliaPickViewState){const[p,c]=this.getCanvasSize(),[f,m]=this.toFractalCoordsWithView(t,s,p,c,this.juliaPickViewState);this.callbacks.onJuliaPick(f,m),this.lastX=t,this.lastY=s;return}if(!this.isDragging)return;const a=t-this.lastX,r=s-this.lastY,[h,d]=this.getCanvasSize();this.viewState.pan(a,r,h,d),this.notifyChange(),this.lastX=t,this.lastY=s}handleMouseUp(){if(this.isPickingJulia){this.isPickingJulia=!1,this.juliaPickViewState=null,this.callbacks.onJuliaPickEnd?.();return}this.isDragging&&(this.isDragging=!1,this.canvas.style.cursor="grab")}handleWheel(e){e.preventDefault(),this.callbacks.onUserInput?.();const[t,s]=this.getScreenCoords(e.clientX,e.clientY),a=e.deltaY>0?.9:1.1,r=B(a),[h,d]=this.getCanvasSize();this.viewState.zoomAt(t,s,r,h,d),this.notifyChange()}handleDoubleClick(e){const[t,s]=this.getScreenCoords(e.clientX,e.clientY),[a,r]=this.getCanvasSize();this.viewState.zoomToPoint(t,s,B(2),a,r),this.notifyChange()}getTouchDistance(e){if(e.length<2)return 0;const t=e[0].clientX-e[1].clientX,s=e[0].clientY-e[1].clientY;return Math.sqrt(t*t+s*s)}getTouchCenter(e){if(e.length===0)return[0,0];if(e.length===1)return this.getScreenCoords(e[0].clientX,e[0].clientY);const t=(e[0].clientX+e[1].clientX)/2,s=(e[0].clientY+e[1].clientY)/2;return this.getScreenCoords(t,s)}handleTouchStart(e){if(this.callbacks.onUserInput?.(),e.touches.length===1){this.isDragging=!0;const[t,s]=this.getScreenCoords(e.touches[0].clientX,e.touches[0].clientY);this.lastX=t,this.lastY=s}else e.touches.length===2&&(this.isDragging=!1,this.lastTouchDistance=this.getTouchDistance(e.touches))}handleTouchMove(e){if(e.preventDefault(),e.touches.length===1&&this.isDragging){const[t,s]=this.getScreenCoords(e.touches[0].clientX,e.touches[0].clientY),a=t-this.lastX,r=s-this.lastY,[h,d]=this.getCanvasSize();this.viewState.pan(a,r,h,d),this.notifyChange(),this.lastX=t,this.lastY=s}else if(e.touches.length===2){const t=this.getTouchDistance(e.touches),s=this.getTouchCenter(e.touches);if(this.lastTouchDistance>0){const a=t/this.lastTouchDistance,r=B(a),[h,d]=this.getCanvasSize();this.viewState.zoomAt(s[0],s[1],r,h,d),this.notifyChange()}this.lastTouchDistance=t}}handleTouchEnd(){this.isDragging=!1,this.lastTouchDistance=0}handleKeyDown(e){if(!(e.target instanceof HTMLInputElement||e.target instanceof HTMLTextAreaElement))switch(e.key){case"+":case"=":e.preventDefault(),this.callbacks.onIterationAdjust?.(1);break;case"-":case"_":e.preventDefault(),this.callbacks.onIterationAdjust?.(-1);break;case"0":e.preventDefault(),this.callbacks.onIterationReset?.();break;case"c":e.preventDefault(),this.callbacks.onCosinePaletteCycle?.(1);break;case"C":e.preventDefault(),this.callbacks.onCosinePaletteCycle?.(-1);break;case"g":e.preventDefault(),this.callbacks.onGradientPaletteCycle?.(1);break;case"G":e.preventDefault(),this.callbacks.onGradientPaletteCycle?.(-1);break;case"[":case",":e.preventDefault(),this.callbacks.onColorOffsetAdjust?.(-.05);break;case"]":case".":e.preventDefault(),this.callbacks.onColorOffsetAdjust?.(.05);break;case"{":case"<":e.preventDefault(),this.callbacks.onColorOffsetAdjust?.(-.15);break;case"}":case">":e.preventDefault(),this.callbacks.onColorOffsetAdjust?.(.15);break;case"r":case"R":e.preventDefault(),this.callbacks.onColorOffsetReset?.();break;case"b":e.preventDefault(),this.callbacks.onBrightnessAdjust?.(1);break;case"B":e.preventDefault(),this.callbacks.onBrightnessAdjust?.(-1);break;case"d":e.preventDefault(),this.callbacks.onBrightnessReset?.();break;case"f":e.preventDefault(),this.callbacks.onFractalCycle?.(1);break;case"F":e.preventDefault(),this.callbacks.onFractalCycle?.(-1);break;case"j":case"J":e.preventDefault(),this.callbacks.onToggleJuliaMode?.();break;case"s":case"S":e.preventDefault(),this.callbacks.onShare?.();break;case"1":case"2":case"3":case"4":case"5":case"6":case"7":case"8":case"9":e.preventDefault(),!e.repeat&&this.locationKeyHeld!==e.key&&(this.locationKeyHeld=e.key,this.locationLongPressTimeout=setTimeout(()=>{this.locationKeyHeld===e.key&&(this.callbacks.onLocationAnimate?.(e.key),this.locationKeyHeld=null)},O.LONG_PRESS_THRESHOLD));break;case"h":case"H":e.preventDefault(),this.callbacks.onToggleHelp?.();break;case" ":e.preventDefault(),this.callbacks.onToggleScreenshotMode?.();break;case"t":case"T":e.preventDefault(),this.callbacks.onToggleTouristMode?.();break;case"z":e.preventDefault(),e.repeat||this.startKeyboardZoom(1);break;case"Z":e.preventDefault(),e.repeat||this.startKeyboardZoom(-1);break}}handleKeyUp(e){(e.key==="z"||e.key==="Z")&&this.stopKeyboardZoom(),e.key>="1"&&e.key<="9"&&this.locationKeyHeld===e.key&&(this.locationLongPressTimeout!==null&&(clearTimeout(this.locationLongPressTimeout),this.locationLongPressTimeout=null),this.callbacks.onLocationSelect?.(e.key),this.locationKeyHeld=null)}startKeyboardZoom(e){this.keyboardZoomAnimationId!==null&&this.stopKeyboardZoom(),this.keyboardZoomDirection=e,this.keyboardZoomStartTime=performance.now(),this.keyboardZoomAnimationId=requestAnimationFrame(this.keyboardZoomLoop.bind(this))}stopKeyboardZoom(){this.keyboardZoomAnimationId!==null&&(cancelAnimationFrame(this.keyboardZoomAnimationId),this.keyboardZoomAnimationId=null),this.keyboardZoomDirection=null}keyboardZoomLoop(e){if(this.keyboardZoomDirection===null)return;const t=e-this.keyboardZoomStartTime;this.keyboardZoomStartTime=e;const a=this.keyboardZoomDirection*.7*(t/1e3),r=Math.exp(a),[h,d]=this.getCanvasSize();this.viewState.zoomAt(h/2,d/2,r,h,d),this.notifyChange(),this.keyboardZoomAnimationId=requestAnimationFrame(this.keyboardZoomLoop.bind(this))}destroy(){}};o(O,"LONG_PRESS_THRESHOLD",400);let L=O;var n=(i=>(i[i.Mandelbrot=0]="Mandelbrot",i[i.MandelbrotJulia=1]="MandelbrotJulia",i[i.BurningShip=2]="BurningShip",i[i.BurningShipJulia=3]="BurningShipJulia",i[i.Tricorn=4]="Tricorn",i[i.TricornJulia=5]="TricornJulia",i[i.Celtic=6]="Celtic",i[i.CelticJulia=7]="CelticJulia",i[i.Buffalo=8]="Buffalo",i[i.BuffaloJulia=9]="BuffaloJulia",i[i.Phoenix=10]="Phoenix",i[i.PhoenixJulia=11]="PhoenixJulia",i[i.Multibrot3=12]="Multibrot3",i[i.Multibrot3Julia=13]="Multibrot3Julia",i[i.Multibrot4=14]="Multibrot4",i[i.Multibrot4Julia=15]="Multibrot4Julia",i[i.Funky=16]="Funky",i[i.FunkyJulia=17]="FunkyJulia",i[i.Perpendicular=18]="Perpendicular",i[i.PerpendicularJulia=19]="PerpendicularJulia",i))(n||{});const ne={0:"Mandelbrot",1:"Mandelbrot Julia",2:"Burning Ship",3:"Burning Ship Julia",4:"Tricorn",5:"Tricorn Julia",6:"Celtic",7:"Celtic Julia",8:"Buffalo",9:"Buffalo Julia",10:"Phoenix",11:"Phoenix Julia",12:"Multibrot (z³)",13:"Multibrot³ Julia",14:"Multibrot (z⁴)",15:"Multibrot⁴ Julia",16:"Funky",17:"Funky Julia",18:"Perpendicular",19:"Perpendicular Julia"},S=10;function w(i){return(i&1)===1}function M(i){return i&-2}function oe(i){return i|1}const g={TYPE:"t",CENTER_X:"x",CENTER_Y:"y",ZOOM:"z",PALETTE:"p",PALETTE_TYPE:"pt",COSINE_PALETTE:"cp",GRADIENT_PALETTE:"gp",COLOR_OFFSET:"o",JULIA_REAL:"jr",JULIA_IMAG:"ji",ITERATIONS:"i",AA:"aa"};function C(i,e=15){return i===0?"0":Math.abs(i)<1e-10||Math.abs(i)>1e10?i.toExponential(e):parseFloat(i.toPrecision(e)).toString()}function b(i){if(i===null||i==="")return null;const e=parseFloat(i);return isNaN(e)?null:e}function K(i){const e=new URLSearchParams;return e.set(g.TYPE,i.fractalType.toString()),e.set(g.CENTER_X,C(i.centerX)),e.set(g.CENTER_Y,C(i.centerY)),e.set(g.ZOOM,C(i.zoom)),e.set(g.PALETTE_TYPE,i.paletteType==="cosine"?"c":"g"),e.set(g.COSINE_PALETTE,i.cosinePaletteIndex.toString()),e.set(g.GRADIENT_PALETTE,i.gradientPaletteIndex.toString()),Math.abs(i.colorOffset)>.001&&e.set(g.COLOR_OFFSET,C(i.colorOffset,4)),w(i.fractalType)&&(e.set(g.JULIA_REAL,C(i.juliaC[0])),e.set(g.JULIA_IMAG,C(i.juliaC[1]))),i.maxIterationsOverride!==null&&e.set(g.ITERATIONS,i.maxIterationsOverride.toString()),i.aaEnabled&&e.set(g.AA,"1"),e.toString()}function re(i){const e=new URLSearchParams(i.replace(/^#/,"")),t={},s=b(e.get(g.TYPE));s!==null&&s>=0&&s<=19&&(t.fractalType=s);const a=b(e.get(g.CENTER_X));a!==null&&(t.centerX=a);const r=b(e.get(g.CENTER_Y));r!==null&&(t.centerY=r);const h=b(e.get(g.ZOOM));h!==null&&h>0&&(t.zoom=h);const d=e.get(g.PALETTE_TYPE);(d==="c"||d==="g")&&(t.paletteType=d==="c"?"cosine":"gradient");const p=b(e.get(g.COSINE_PALETTE));p!==null&&p>=0&&(t.cosinePaletteIndex=Math.floor(p));const c=b(e.get(g.GRADIENT_PALETTE));c!==null&&c>=0&&(t.gradientPaletteIndex=Math.floor(c));const f=b(e.get(g.PALETTE));f!==null&&f>=0&&f<=11&&(t.paletteIndex=Math.floor(f));const m=b(e.get(g.COLOR_OFFSET));m!==null&&(t.colorOffset=m);const x=b(e.get(g.JULIA_REAL)),u=b(e.get(g.JULIA_IMAG));x!==null&&u!==null&&(t.juliaC=[x,u]);const I=b(e.get(g.ITERATIONS));return I!==null&&I>0&&(t.maxIterationsOverride=Math.floor(I)),e.get(g.AA)==="1"&&(t.aaEnabled=!0),t}function le(i){const e=K(i),t=new URL(window.location.href);return t.hash=e,t.toString()}function ce(i){const e=K(i);window.history.replaceState(null,"","#"+e)}function he(){return re(window.location.hash)}async function de(i){const e=le(i);try{return await navigator.clipboard.writeText(e),!0}catch{const t=document.createElement("textarea");t.value=e,t.style.position="fixed",t.style.left="-9999px",document.body.appendChild(t),t.select();try{return document.execCommand("copy"),!0}catch{return!1}finally{document.body.removeChild(t)}}}function l(i,e,t,s,a,r,h,d={}){return{name:i,description:e,key:t,state:{fractalType:s,centerX:a,centerY:r,zoom:h,paletteType:d.paletteType??"cosine",cosinePaletteIndex:d.cosinePaletteIndex??1,gradientPaletteIndex:d.gradientPaletteIndex??0,colorOffset:d.colorOffset??0,juliaC:d.juliaC??[-.7,.27015],maxIterationsOverride:d.maxIterationsOverride??null,aaEnabled:!1}}}const ue=[l("Mandelbrot","The famous Mandelbrot set","1",n.Mandelbrot,-.5,0,.4),l("Seahorse Valley","The iconic seahorse-shaped spirals","2",n.Mandelbrot,-.7581249305506096,.11244273987387937,36.41989684959737,{cosinePaletteIndex:5,colorOffset:.05}),l("Elephant Valley","Elephant trunk-like spirals on the positive real side","3",n.Mandelbrot,.2746341335933571,.0066936145282295205,212.15493874953236,{cosinePaletteIndex:3,colorOffset:-.1}),l("Double Spiral Valley","Beautiful double spirals deep in the set","4",n.Mandelbrot,-.743733589978665,.130905227502858,350,{cosinePaletteIndex:5,colorOffset:.15}),l("Spiral Galaxy","Galactic spiral arms emerging from chaos","5",n.Mandelbrot,-.7615484049386866,-.08478444765887823,1506.4927460380957,{cosinePaletteIndex:4,colorOffset:.05}),l("Douady Rabbit","The famous rabbit-eared Julia set","6",n.MandelbrotJulia,0,0,.6,{cosinePaletteIndex:4,colorOffset:.2,juliaC:[-.123,.745]}),l("Dragon Julia","Fierce dragon-like Julia set","7",n.MandelbrotJulia,0,0,.45,{cosinePaletteIndex:3,colorOffset:-.5,juliaC:[-.8,.156]}),l("Spiral Julia","Delicate spiral arms from the main cardioid edge","8",n.MandelbrotJulia,0,0,.5,{cosinePaletteIndex:8,colorOffset:.65,juliaC:[-.75,.11]}),l("Dendrite Julia","Tree-like branching structure on the real axis","9",n.MandelbrotJulia,0,0,.41791083585808675,{cosinePaletteIndex:5,colorOffset:.1,juliaC:[.285,.01]})],fe=[l("Main Ship","The iconic burning ship silhouette","1",n.BurningShip,-.6819541375872399,.5906040268456356,.4,{cosinePaletteIndex:4,colorOffset:.3}),l("The Armada","Mini ships along the antenna","2",n.BurningShip,-1.80173025652805,.0153452534367207,9,{cosinePaletteIndex:4,colorOffset:.2}),l("Bow Detail","Intricate patterns at the ship's bow","3",n.BurningShip,-1.7500929615866607,.0368035491770765,10,{cosinePaletteIndex:10,colorOffset:.1}),l("Bacteria Worm","Worm-like structures with mosaic patterns","4",n.BurningShipJulia,0,0,.3,{cosinePaletteIndex:10,colorOffset:-.55,juliaC:[.5179709888623353,.8057669844188748]}),l("Wispy Coils","Wispy coils near the bulbous extrusion from the ship","5",n.BurningShipJulia,0,0,.4,{cosinePaletteIndex:4,colorOffset:.35,juliaC:[.2525994076160102,.0006358222328731386]}),l("Space Brain","Brain-like structures from the bottom of the ship","6",n.BurningShipJulia,0,0,.7,{cosinePaletteIndex:5,colorOffset:.3,juliaC:[-1.059944784917394,-.033218825489255054]}),l("Spiral Patterns","Spiral patterns near the bulbous extrusion","7",n.BurningShipJulia,0,0,.41,{cosinePaletteIndex:11,colorOffset:.55,juliaC:[.28292507376881926,-.007597008191683113]}),l("Detailed Patterns","Beautiful detailed patterns near the bottom of the ship","8",n.BurningShipJulia,0,0,.5,{cosinePaletteIndex:2,colorOffset:.6,juliaC:[-.3967192382583807,-.09102348993288789]})],pe=[l("Tricorn","The main tricorn shape with its distinctive three-cornered symmetry","1",n.Tricorn,-.1343398614022916,-.07051105375213641,.24,{cosinePaletteIndex:11,colorOffset:-.45}),l("Skewed Mandelbrot","Skewed Mandelbrot from one of the main bulbs","2",n.Tricorn,-1.0683098234816064,.13055543771605108,722.5553792774821,{cosinePaletteIndex:5,colorOffset:.1}),l("Lightning Bolts","Lightning bolt-like patterns near the main cardioid edge","3",n.TricornJulia,0,0,.5,{cosinePaletteIndex:5,colorOffset:.2,juliaC:[-.7092474160797806,-.113024316756254]}),l("Water Lily Leaf","Leaf-like structures from the center of the edge of the main cardioid","4",n.TricornJulia,0,0,.43,{colorOffset:-.7,juliaC:[-.1254330794660274,.2407433439223678]}),l("Lightning Brain","Brain-like structures","5",n.TricornJulia,0,0,3.15,{cosinePaletteIndex:5,juliaC:[.8748878776979363,-1.515483485507111]}),l("Spiral Mosaic","Mosaic patterns from the base of one of the main bulbs","6",n.TricornJulia,0,0,.5,{cosinePaletteIndex:11,colorOffset:.55,juliaC:[-.5647012802389192,-.06508603367125808]}),l("Electric Tendrils","Electric tendril patterns with bright highlights","7",n.TricornJulia,0,0,.5,{cosinePaletteIndex:4,colorOffset:.05,juliaC:[-.511125124692869,.0500484416152959]})],ge=[l("Celtic Knot","The main Celtic fractal shape","1",n.Celtic,-.5,0,.25,{cosinePaletteIndex:10,colorOffset:.05}),l("Celtic Detail","Intricate knotwork patterns","2",n.Celtic,-.7803221774980102,.1635662989215261,120,{cosinePaletteIndex:10,colorOffset:.25,maxIterationsOverride:1e4}),l("Leafy Spirals","Symmetric shapes from the tip of the celtic shape","3",n.CelticJulia,0,0,.55,{cosinePaletteIndex:7,colorOffset:.1,juliaC:[.25345198072532704,.0001580704105713714]}),l("Tendrils","Tendrils emerging from fog","4",n.CelticJulia,-.1649932591722856,-.033582161161888655,.28,{cosinePaletteIndex:5,juliaC:[-.4530201342281876,-.8993288590604025]}),l("Electric Buzz","Electric patterns with uniform patterned regions","5",n.CelticJulia,.2,-.3,.55,{colorOffset:.2,juliaC:[-.6378073937333775,1.2082886796996293]}),l("Intricate Patterns","Knotwork patterns with intricate details","6",n.CelticJulia,0,0,.52,{cosinePaletteIndex:10,colorOffset:.3,juliaC:[-.7610237673309276,.12050023730653406]}),l("Petri Dish","Bacteria-like patterns that spread outwards","7",n.CelticJulia,0,0,.55,{cosinePaletteIndex:10,colorOffset:.45,juliaC:[-1.056655765809614,-.16855216053399263]})],me=[l("Buffalo Overview","The distinctive Buffalo fractal shape","1",n.Buffalo,-.7,.6,.4,{cosinePaletteIndex:2,colorOffset:.45}),l("Overgrown Cities","Tree or cathedral-like structures emerging from real axis","2",n.Buffalo,-1.75,.13,2.4,{colorOffset:0}),l("Industrial Snowflake","Snowflake-like patterns with industrial structures woven in","3",n.BuffaloJulia,.45,0,.85,{cosinePaletteIndex:4,colorOffset:-.1,juliaC:[-1.62727125821226,.00873720402364775]}),l("Plasma Bursts","Plasma-like bursts of color","4",n.BuffaloJulia,0,0,.5,{cosinePaletteIndex:8,colorOffset:-.75,juliaC:[.2745030250648227,.1797320656871218]}),l("Intricate Patterns","Intricate patterns near the bottom of the main shape","5",n.BuffaloJulia,0,0,.5,{cosinePaletteIndex:4,colorOffset:.25,juliaC:[-.5828307625231954,-.3049842077590671]}),l("Seed Pods","Spirals bursting with seeds","6",n.BuffaloJulia,0,0,.6,{cosinePaletteIndex:3,colorOffset:-.75,juliaC:[.3056228373702423,-.007698961937716242]})],ye=[l("Phoenix Overview","The Phoenix parameter space","1",n.Phoenix,-.15,-.7,.25,{cosinePaletteIndex:5,colorOffset:-.65}),l("Classic Phoenix Julia","The iconic feathery Phoenix fractal","2",n.PhoenixJulia,0,0,.5,{cosinePaletteIndex:2,colorOffset:.45,juliaC:[-.5,.5667],maxIterationsOverride:1152}),l("Phoenix Feathers","Detailed feather-like structures","3",n.PhoenixJulia,.38,.07,3.4,{cosinePaletteIndex:5,juliaC:[-.5,.5667]}),l("Golden Weaves","Bright golden patterns with intricate weaves","4",n.PhoenixJulia,0,.08,.4,{cosinePaletteIndex:2,colorOffset:.35,juliaC:[.656142759731905,.0353380147311402]}),l("Fiery Phoenix","Fiery wings spreading outwards","5",n.PhoenixJulia,0,-.03,.6,{cosinePaletteIndex:4,colorOffset:-.7,juliaC:[-.272349453272398,.4059142585519806]})],ve=[l("Multibrot³ Overview","The three-fold symmetric z³ Multibrot","1",n.Multibrot3,0,0,.35,{cosinePaletteIndex:5,colorOffset:.35}),l("The Bulb","A bulbous extrusion from the main shape","2",n.Multibrot3,.5852686308492299,.27,6,{colorOffset:.1}),l("Three-fold Spirals","Bright pearly spirals with three-fold symmetry","3",n.Multibrot3Julia,0,0,.4,{cosinePaletteIndex:10,colorOffset:.15,juliaC:[.5448826747676219,.26362559338015445]}),l("Multibrot³ Julia","A Julia set with three-fold symmetry","4",n.Multibrot3Julia,0,0,.434,{cosinePaletteIndex:5,colorOffset:.1,juliaC:[-.45963436785036077,.03389484474578987]}),l("Double Elephant Valley","Two elephants in each group","5",n.Multibrot3,.42814685603247177,.012748071569601296,77,{cosinePaletteIndex:3,colorOffset:0}),l("Wonky Spiral","Wonky spiral Julia structure from inside the main set","6",n.Multibrot3Julia,.3695408370900379,.3371264555793177,2.274691481464049,{cosinePaletteIndex:0,colorOffset:0,juliaC:[.5277614770068884,.15853942850341446],maxIterationsOverride:2124}),l("Spiral Galaxies","The wonky spiral Julia structure viewed as galaxies","7",n.Multibrot3Julia,0,0,.4,{paletteType:"gradient",juliaC:[.5277614770068884,.15853942850341446],maxIterationsOverride:1152})],be=[l("Multibrot⁴ Overview","The four-fold symmetric z⁴ Multibrot","1",n.Multibrot4,0,0,.4,{cosinePaletteIndex:5,colorOffset:0}),l("Atomic Spirals","Structures resembling atomic orbitals with spiral patterns","2",n.Multibrot4Julia,0,-0,.35,{cosinePaletteIndex:5,colorOffset:.4,juliaC:[-.7878865573262246,.02073442187254452]}),l("Triple Elephant Valley","Now there's three elephants in each group!","3",n.Multibrot4,-.2726362830546699,.44295218397589975,42,{cosinePaletteIndex:3}),l("Starscape","Spiraling galaxies surrounding a black hole","4",n.Multibrot4Julia,0,0,.5,{paletteType:"gradient",juliaC:[.634977850702787,.194816172925824],maxIterationsOverride:1152}),l("Static Burst","Burst of electricity","5",n.Multibrot4Julia,0,0,.4,{colorOffset:-.75,juliaC:[-.6179887054490777,.487166930716755]})],xe=[l("Funky Overview","The wonderfully weird Funky fractal","1",n.Funky,-.5,0,.35,{cosinePaletteIndex:4,colorOffset:.25}),l("Tulip Bulb","Extrusions resembling tulips near the top of the main shape","2",n.Funky,.303,.534,6.3,{cosinePaletteIndex:10}),l("Battleship","Spaceship-like structure with double turrets all around","3",n.FunkyJulia,0,0,.45,{cosinePaletteIndex:4,colorOffset:-.7,juliaC:[-1.02568231965141,.128286053018475]}),l("Frog Crab","Crablike structure with brain-like spiral patterns within it","4",n.FunkyJulia,0,0,.37,{colorOffset:.1,juliaC:[.30191025227457674,.5253550579235958]}),l("Spiral Details","Beautiful spiral details without too much clutter","5",n.FunkyJulia,-.2,0,.4,{cosinePaletteIndex:5,colorOffset:.6,juliaC:[-.06404194046216194,.662960137583706]}),l("Migrating Birds","Bird-like shapes flying in formation","6",n.FunkyJulia,.34,0,.35,{cosinePaletteIndex:5,colorOffset:.4,juliaC:[.5804003550040334,-.9094296635818582]}),l("Glittering Coral","Brightly gleaming coral-like structures","7",n.FunkyJulia,0,0,.5,{cosinePaletteIndex:11,colorOffset:-.4,juliaC:[-.45427582797825017,-.06920415224913506]})],Te=[l("Perpendicular Overview","The Perpendicular Mandelbrot variant","1",n.Perpendicular,-.5,0,.32,{cosinePaletteIndex:2,colorOffset:0}),l("Seed Pod","A pod-like structure near the head of the main shape","2",n.Perpendicular,-.7734996631118647,.12393043736115505,250,{cosinePaletteIndex:5}),l("Bird of Prey","Waveform bird flying out to get you","3",n.PerpendicularJulia,0,0,.35,{cosinePaletteIndex:4,colorOffset:.15,juliaC:[-1.2870593206662457,.022288689289989876]}),l("Old Dragon","Bird-like shape with leathery frayed wings","4",n.PerpendicularJulia,0,0,.3913248754208607,{cosinePaletteIndex:5,colorOffset:.45,juliaC:[-1.0197782349577895,-.13982096184940793]}),l("Peacock Eyes","Glowing eyes of a brightly coloured peacock","5",n.PerpendicularJulia,0,-.8821542839734092,2.8,{cosinePaletteIndex:11,juliaC:[.25987719401314263,-.17615047146201984]}),l("Mask of the Ancients","A detailed mask with intricate patterns","6",n.PerpendicularJulia,0,0,.42,{cosinePaletteIndex:2,colorOffset:-.1,juliaC:[.3021983882651174,.4025604479726435]})],W=new Map([[n.Mandelbrot,ue],[n.BurningShip,fe],[n.Tricorn,pe],[n.Celtic,ge],[n.Buffalo,me],[n.Phoenix,ye],[n.Multibrot3,ve],[n.Multibrot4,be],[n.Funky,xe],[n.Perpendicular,Te]]);function R(i,e){const t=M(e),s=W.get(t);if(s)return s.find(a=>a.key===i)}function Pe(i){const e=M(i);return W.get(e)??[]}const A=[{name:"Rainbow",isMonotonic:!1,params:{type:"cosine",a:[.5,.5,.5],b:[.5,.5,.5],c:[1,1,1],d:[0,.33,.67]}},{name:"Fire",isMonotonic:!1,params:{type:"cosine",a:[.5,.5,.5],b:[.5,.5,.5],c:[1,1,.5],d:[0,.1,.2]}},{name:"Ice",isMonotonic:!1,params:{type:"cosine",a:[.5,.5,.5],b:[.5,.5,.5],c:[1,.7,.4],d:[0,.15,.2]}},{name:"Sunset",isMonotonic:!1,params:{type:"cosine",a:[.5,.3,.2],b:[.5,.4,.3],c:[1,1,.5],d:[0,.1,.2]}},{name:"Electric",isMonotonic:!1,params:{type:"cosine",a:[.5,.5,.5],b:[.6,.6,.6],c:[1,1,1],d:[.3,.2,.2]}},{name:"Neon",isMonotonic:!1,params:{type:"cosine",a:[.5,.5,.5],b:[.5,.5,.5],c:[1,1,1],d:[0,.1,.2]}},{name:"Emerald",isMonotonic:!1,params:{type:"cosine",a:[.2,.5,.3],b:[.3,.5,.3],c:[1,1,1],d:[0,.25,.5]}},{name:"Candy",isMonotonic:!1,params:{type:"cosine",a:[.8,.5,.5],b:[.2,.4,.4],c:[1,1,2],d:[0,.25,.25]}},{name:"Plasma",isMonotonic:!1,params:{type:"cosine",a:[.5,.5,.5],b:[.5,.5,.5],c:[2,1,0],d:[.5,.2,.25]}},{name:"Peacock",isMonotonic:!1,params:{type:"cosine",a:[.3,.5,.5],b:[.4,.4,.3],c:[1,1,1],d:[0,.1,.35]}},{name:"Autumn",isMonotonic:!1,params:{type:"cosine",a:[.6,.4,.2],b:[.4,.3,.2],c:[1,1,1],d:[0,.05,.1]}},{name:"Aurora",isMonotonic:!1,params:{type:"cosine",a:[.3,.5,.5],b:[.5,.5,.5],c:[1,1,.5],d:[.8,.9,.3]}}],T=A.length,E=[{name:"Blue",isMonotonic:!0,params:{type:"gradient",c1:[.02,.01,.08],c2:[.05,.15,.25],c3:[.1,.4,.5],c4:[.3,.6,.8],c5:[.7,.9,1]},hdrParams:{type:"gradient",c1:[.2,.4,1],c2:[.3,.6,1],c3:[.4,.8,1],c4:[.6,.9,1],c5:[.85,1,1]}},{name:"Gold",isMonotonic:!0,params:{type:"gradient",c1:[.04,.02,.01],c2:[.2,.08,.02],c3:[.5,.25,.05],c4:[.85,.6,.2],c5:[1,.95,.7]},hdrParams:{type:"gradient",c1:[1,.5,.1],c2:[1,.65,.2],c3:[1,.8,.3],c4:[1,.9,.5],c5:[1,1,.8]}},{name:"Grayscale",isMonotonic:!0,params:{type:"gradient",c1:[.01,.01,.03],c2:[.15,.15,.17],c3:[.45,.45,.45],c4:[.75,.74,.72],c5:[1,.98,.95]},hdrParams:{type:"gradient",c1:[1,1,1],c2:[1,1,1],c3:[1,1,1],c4:[1,1,1],c5:[1,1,1]}},{name:"Sepia",isMonotonic:!0,params:{type:"gradient",c1:[.03,.02,.01],c2:[.15,.08,.03],c3:[.4,.25,.12],c4:[.7,.55,.35],c5:[1,.95,.85]},hdrParams:{type:"gradient",c1:[1,.7,.4],c2:[1,.8,.55],c3:[1,.88,.7],c4:[1,.95,.85],c5:[1,1,.95]}},{name:"Ocean",isMonotonic:!0,params:{type:"gradient",c1:[0,.02,.05],c2:[.02,.08,.2],c3:[.05,.3,.4],c4:[.2,.6,.6],c5:[.6,.95,.9]},hdrParams:{type:"gradient",c1:[.1,.8,.8],c2:[.2,.9,.85],c3:[.4,.95,.9],c4:[.65,1,.95],c5:[.85,1,1]}},{name:"Purple",isMonotonic:!0,params:{type:"gradient",c1:[.03,.01,.06],c2:[.15,.05,.25],c3:[.4,.15,.5],c4:[.7,.4,.75],c5:[.95,.8,1]},hdrParams:{type:"gradient",c1:[.8,.2,1],c2:[.85,.4,1],c3:[.9,.6,1],c4:[.95,.8,1],c5:[1,.95,1]}},{name:"Forest",isMonotonic:!0,params:{type:"gradient",c1:[.02,.03,.01],c2:[.05,.12,.04],c3:[.1,.35,.15],c4:[.3,.65,.3],c5:[.7,.95,.6]},hdrParams:{type:"gradient",c1:[.3,1,.2],c2:[.5,1,.4],c3:[.7,1,.55],c4:[.85,1,.75],c5:[.95,1,.9]}}],P=E.length;function Q(i){return A[i%T].params}function ee(i,e){const t=E[i%P];return e&&t.hdrParams?t.hdrParams:t.params}function Ie(i){return A[i%T]}function Ce(i){return E[i%P]}function we(i){return A[i%T].name}function Me(i){return E[i%P].name}const ze=3e3,F=3e3,Se=8e3,ke=2e3,N=.5,Oe=.25,H=2,G=.6,Y=.5;function _e(i,e,t){if(i<H&&e<H)return D(i,e,t);const s=Math.min(i,e),a=Math.max(Y,s*(1-G)+Y*G);if(a>=s)return D(i,e,t);const r=Math.log(i),h=Math.log(e),d=Math.log(a),p=1-t,c=p*p*r+2*p*t*d+t*t*h;return Math.exp(c)}function U(i){return i<.5?4*i*i*i:1-Math.pow(-2*i+2,3)/2}function v(i,e,t){return i+(e-i)*t}function y(i,e,t){return[v(i[0],e[0],t),v(i[1],e[1],t),v(i[2],e[2],t)]}function Ae(i){return i.paletteType==="cosine"?Q(i.cosinePaletteIndex):ee(i.gradientPaletteIndex,!1)}function Ee(i,e,t){if(i.type==="cosine"&&e.type==="cosine")return{type:"cosine",a:y(i.a,e.a,t),b:y(i.b,e.b,t),c:y(i.c,e.c,t),d:y(i.d,e.d,t)};if(i.type==="gradient"&&e.type==="gradient")return{type:"gradient",c1:y(i.c1,e.c1,t),c2:y(i.c2,e.c2,t),c3:y(i.c3,e.c3,t),c4:y(i.c4,e.c4,t),c5:y(i.c5,e.c5,t)};if(t<.5)if(i.type==="cosine"){const s=t*2;return{type:"cosine",a:y(i.a,[.5,.5,.5],s*.3),b:y(i.b,[.3,.3,.3],s*.3),c:i.c,d:i.d}}else return i;else if(e.type==="cosine"){const s=(t-.5)*2;return{type:"cosine",a:y([.5,.5,.5],e.a,s),b:y([.3,.3,.3],e.b,s),c:e.c,d:e.d}}else return e}function D(i,e,t){const s=Math.log(i),a=Math.log(e);return Math.exp(v(s,a,t))}function X(i,e,t,s,a){const r=Math.sqrt(i*i+e*e),h=Math.sqrt(t*t+s*s);let d=Math.atan2(e,i),p=Math.atan2(s,t);const c=.01;if(r<c&&h<c)return[v(i,t,a),v(e,s,a)];if(r<c)return[v(0,t,a),v(0,s,a)];if(h<c)return[v(i,0,a),v(e,0,a)];let f=p-d;f>Math.PI?f-=2*Math.PI:f<-Math.PI&&(f+=2*Math.PI);const m=d+f*a,x=v(r,h,a);return[x*Math.cos(m),x*Math.sin(m)]}class ${constructor(e,t){o(this,"active",!1);o(this,"state",{type:"idle"});o(this,"animationFrameId",null);o(this,"callbacks");o(this,"currentTarget");o(this,"visitedLocations",new Set);o(this,"tick",e=>{this.active&&(this.updateAnimation(e),this.animationFrameId=requestAnimationFrame(this.tick))});this.callbacks=e,this.currentTarget=this.bookmarkToTarget(t)}bookmarkToTarget(e){return{centerX:e.centerX,centerY:e.centerY,zoom:e.zoom,fractalType:e.fractalType,paletteType:e.paletteType,cosinePaletteIndex:e.cosinePaletteIndex,gradientPaletteIndex:e.gradientPaletteIndex,paletteParams:Ae(e),colorOffset:e.colorOffset,juliaC:e.juliaC}}start(e){this.active||(this.active=!0,this.currentTarget=this.bookmarkToTarget(e),this.visitedLocations.clear(),this.state={type:"paused",startTime:performance.now(),duration:1e3},this.animationFrameId=requestAnimationFrame(this.tick),console.log("🚀 Tourist mode started"))}stop(){this.active&&(this.active=!1,this.state={type:"idle"},this.animationFrameId!==null&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null),console.log("🛑 Tourist mode stopped"))}isActive(){return this.active}updateCurrentState(e){this.currentTarget=this.bookmarkToTarget(e)}animateToLocation(e,t){this.animationFrameId!==null&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null),this.active=!0,this.currentTarget=this.bookmarkToTarget(t),this.transitionTo(e,!0),this.animationFrameId=requestAnimationFrame(this.tick),console.log(`🎯 Animating to: ${e.name}`)}updateAnimation(e){switch(this.state.type){case"idle":this.pickNextDestination();break;case"paused":e-this.state.startTime>=this.state.duration&&this.pickNextDestination();break;case"transitioning":{const t=e-this.state.startTime,s=Math.min(1,t/this.state.duration),a=U(s),r=X(this.state.from.juliaC[0],this.state.from.juliaC[1],this.state.to.juliaC[0],this.state.to.juliaC[1],a),h=this.state.from.zoom,d=this.state.to.zoom,p=_e(h,d,s),[c,f]=X(this.state.from.centerX,this.state.from.centerY,this.state.to.centerX,this.state.to.centerY,a),m=Ee(this.state.from.paletteParams,this.state.to.paletteParams,a),x={centerX:c,centerY:f,zoom:p,fractalType:this.state.to.fractalType,paletteType:this.state.to.paletteType,cosinePaletteIndex:this.state.to.cosinePaletteIndex,gradientPaletteIndex:this.state.to.gradientPaletteIndex,colorOffset:v(this.state.from.colorOffset,this.state.to.colorOffset,a),juliaC:r};this.currentTarget={...this.state.to,centerX:c,centerY:f,zoom:p,paletteParams:m,colorOffset:x.colorOffset,juliaC:r},this.callbacks.onUpdate(x,m),this.callbacks.onRender(),s>=1&&(this.state.singleTransition?(this.active=!1,this.state={type:"idle"},this.animationFrameId!==null&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null),console.log("🎯 Single transition complete")):this.state={type:"paused",startTime:e,duration:ze});break}case"zoomingOut":{const t=e-this.state.startTime,s=Math.min(1,t/this.state.duration),a=U(s),r=D(this.state.from.zoom,this.state.targetZoom,a),h={centerX:this.state.from.centerX,centerY:this.state.from.centerY,zoom:r};this.currentTarget={...this.currentTarget,zoom:r},this.callbacks.onUpdate(h),this.callbacks.onRender(),s>=1&&(this.currentTarget.fractalType=this.state.nextFractalType,this.callbacks.onUpdate({fractalType:this.state.nextFractalType}),this.visitedLocations.clear(),this.pickDestinationForCurrentFractal());break}}}pickNextDestination(){Math.random()<Oe?this.initiateFractalSwitch():this.pickDestinationForCurrentFractal()}initiateFractalSwitch(){const t=M(this.currentTarget.fractalType)>>1;let s=Math.floor(Math.random()*S);s===t&&(s=(s+1)%S);const a=s<<1;if(this.currentTarget.zoom<=N*1.5){this.currentTarget.fractalType=a,this.callbacks.onUpdate({fractalType:a}),this.visitedLocations.clear(),this.pickDestinationForCurrentFractal();return}this.state={type:"zoomingOut",startTime:performance.now(),duration:ke,from:{...this.currentTarget},targetZoom:N,nextFractalType:a}}pickDestinationForCurrentFractal(){const e=Pe(this.currentTarget.fractalType);if(e.length===0){this.currentTarget.fractalType=n.Mandelbrot,this.callbacks.onUpdate({fractalType:n.Mandelbrot}),this.pickDestinationForCurrentFractal();return}let t=e.filter(a=>!this.visitedLocations.has(this.getLocationKey(a)));t.length===0&&(this.visitedLocations.clear(),t=e);const s=t[Math.floor(Math.random()*t.length)];this.transitionTo(s)}getLocationKey(e){return`${e.state.fractalType}-${e.key}`}transitionTo(e,t=!1){const s=this.bookmarkToTarget(e.state),a=Math.abs(Math.log(s.zoom)-Math.log(this.currentTarget.zoom)),r=Math.sqrt(Math.pow(s.centerX-this.currentTarget.centerX,2)+Math.pow(s.centerY-this.currentTarget.centerY,2)),h=Math.min(Se,Math.max(F,F+a*500+r*2e3)),d=this.getLocationKey(e);this.visitedLocations.add(d),this.callbacks.onLocationNotification?.(e.name,e.description),this.state={type:"transitioning",startTime:performance.now(),duration:h,from:{...this.currentTarget},to:s,singleTransition:t}}}class Be{constructor(e){o(this,"element");o(this,"visible",!0);this.element=document.createElement("div"),this.element.id="zoom-debug",e.appendChild(this.element)}update(e){if(!this.visible)return;const t=e.zoom,s=t>=1e6?t.toExponential(2):t<1?t.toPrecision(4):String(Math.round(t)),a=e.isManualIterations?" (manual)":"",r=e.hdrEnabled?Math.abs(e.hdrBrightnessBias)>.01?`HDR (${e.hdrBrightnessBias>0?"+":""}${e.hdrBrightnessBias.toFixed(2)})`:"HDR":e.displaySupportsHDR?"HDR available":"SDR",h=!e.hdrEnabled&&e.paletteType==="gradient"&&Math.abs(e.sdrGradientBrightness-1)>.01?`brightness ${e.sdrGradientBrightness.toFixed(1)}`:"",d=e.juliaPickerMode?"🎯 Pick Julia point":"",p=e.isJulia?`c=(${e.juliaC[0].toFixed(4)}, ${e.juliaC[1].toFixed(4)})`:"",c=Math.abs(e.colorOffset)>.001?`offset ${e.colorOffset.toFixed(1)}`:"",f=[e.fractalName,`zoom ${s}`,`iterations ${e.maxIterations}${a}`,e.paletteName];c&&f.push(c),h&&f.push(h),p&&f.push(p),f.push(r),d&&f.push(d),f.push("H = help"),this.element.textContent=f.join("  ·  ")}show(){this.visible=!0,this.element.style.display="block"}hide(){this.visible=!1,this.element.style.display="none"}destroy(){this.element.remove()}}class Re{constructor(e){o(this,"element");o(this,"frameCount",0);o(this,"fps",0);o(this,"lastUpdate",0);o(this,"updateInterval",500);o(this,"visible",!0);this.element=document.createElement("div"),this.element.id="fps-overlay",this.element.style.cssText=`
      position: fixed; bottom: 12px; right: 12px;
      background: rgba(0, 0, 0, 0.6); color: #888;
      padding: 4px 8px; border-radius: 4px;
      font-family: ui-monospace, monospace; font-size: 12px;
      pointer-events: none; z-index: 100;
    `,this.element.textContent="-- FPS",e.appendChild(this.element)}tick(e){this.frameCount++,e-this.lastUpdate>=this.updateInterval&&(this.fps=Math.round(this.frameCount*1e3/(e-this.lastUpdate)),this.frameCount=0,this.lastUpdate=e,this.visible&&(this.element.textContent=`${this.fps} FPS`))}getFPS(){return this.fps}show(){this.visible=!0,this.element.style.display="block"}hide(){this.visible=!1,this.element.style.display="none"}destroy(){this.element.remove()}}class Le{constructor(e){o(this,"element");o(this,"visible",!1);this.element=document.createElement("div"),this.element.id="help-overlay",this.element.innerHTML=this.createContent(),this.element.style.cssText=`
      position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.92); color: #e5e5e5; padding: 24px 32px;
      border-radius: 12px; font-family: system-ui, -apple-system, sans-serif;
      font-size: 14px; z-index: 1001; opacity: 0; transition: opacity 0.2s ease;
      pointer-events: none; max-width: 90vw; max-height: 90vh; overflow-y: auto;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5); border: 1px solid rgba(255, 255, 255, 0.1);
    `,e.appendChild(this.element)}toggle(){return this.visible=!this.visible,this.element.style.opacity=this.visible?"1":"0",this.element.style.pointerEvents=this.visible?"auto":"none",this.visible}show(){this.visible=!0,this.element.style.opacity="1",this.element.style.pointerEvents="auto"}hide(){this.visible=!1,this.element.style.opacity="0",this.element.style.pointerEvents="none"}isVisible(){return this.visible}createContent(){return`
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
            ${this.helpRow("T","Tourist mode (auto-tour)")}
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
    `}destroy(){this.element.remove()}}class De{constructor(e){o(this,"element");o(this,"timeoutId",null);this.element=document.createElement("div"),this.element.id="share-notification",this.element.style.cssText=`
      position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.85); color: #4ade80; padding: 16px 32px;
      border-radius: 8px; font-family: system-ui, sans-serif; font-size: 16px;
      z-index: 1000; opacity: 0; transition: opacity 0.3s ease; pointer-events: none;
    `,e.appendChild(this.element)}show(e,t={}){const{color:s="#4ade80",duration:a=2e3,html:r=!1}=t;this.timeoutId!==null&&clearTimeout(this.timeoutId),r?this.element.innerHTML=e:this.element.textContent=e,this.element.style.color=s,this.element.style.opacity="1",this.timeoutId=setTimeout(()=>{this.element.style.opacity="0",this.timeoutId=null},a)}success(e,t=2e3){this.show(e,{color:"#4ade80",duration:t})}error(e,t=2e3){this.show(e,{color:"#f87171",duration:t})}info(e,t=2e3){this.show(e,{color:"#60a5fa",duration:t})}showLocation(e,t,s=2500){const a=`<strong style="font-size: 18px;">📍 ${e}</strong><br><span style="color: #aaa; font-size: 14px;">${t}</span>`;this.show(a,{color:"#60a5fa",duration:s,html:!0})}showTouristMode(e){e?this.show('🚀 <strong>Tourist Mode</strong> — Sit back and enjoy the ride!<br><span style="color: #aaa; font-size: 12px;">Click or press T to take control</span>',{color:"#60a5fa",duration:3e3,html:!0}):this.show("🎮 <strong>Manual Control</strong> — You're driving now",{color:"#4ade80",duration:1500,html:!0})}showScreenshotMode(e){const t=e?"📷 Screenshot mode (Space to exit)":"📷 UI restored";this.info(t,1e3)}showShareResult(e){e?this.success("📋 Link copied to clipboard!"):this.error("❌ Failed to copy link")}destroy(){this.timeoutId!==null&&clearTimeout(this.timeoutId),this.element.remove()}}class Je{constructor(e){o(this,"debug");o(this,"fps");o(this,"help");o(this,"notification");o(this,"screenshotMode",!1);this.debug=new Be(e),this.fps=new Re(e),this.help=new Le(e),this.notification=new De(e)}toggleScreenshotMode(){return this.screenshotMode=!this.screenshotMode,this.screenshotMode?(this.help.isVisible()&&this.help.hide(),this.debug.hide(),this.fps.hide()):(this.debug.show(),this.fps.show()),this.notification.showScreenshotMode(this.screenshotMode),this.screenshotMode}isScreenshotMode(){return this.screenshotMode}toggleHelp(){return this.help.toggle()}updateDebug(e){this.screenshotMode||this.debug.update(e)}tickFPS(e){this.screenshotMode||this.fps.tick(e)}destroy(){this.debug.destroy(),this.fps.destroy(),this.help.destroy(),this.notification.destroy()}}class je{constructor(e=-.5,t=0,s=.4){o(this,"centerX");o(this,"centerY");o(this,"zoom");this.centerX=e,this.centerY=t,this.zoom=s}pan(e,t,s,a){const r=-e/(this.zoom*s),h=t/(this.zoom*a);this.centerX+=r,this.centerY+=h}zoomAt(e,t,s,a,r){const h=this.centerX+(e/a-.5)/this.zoom,d=this.centerY-(t/r-.5)/this.zoom;this.zoom*=s,this.zoom=Math.max(.1,Math.min(this.zoom,1e15));const p=this.centerX+(e/a-.5)/this.zoom,c=this.centerY-(t/r-.5)/this.zoom;this.centerX+=h-p,this.centerY+=d-c}toFractalCoords(e,t,s,a){const r=s/a,h=(e/s-.5)*r,d=t/a-.5,p=this.centerX+h/this.zoom,c=this.centerY-d/this.zoom;return[p,c]}toScreenCoords(e,t,s,a){const r=s/a,h=(e-this.centerX)*this.zoom,d=(t-this.centerY)*this.zoom,p=(h/r+.5)*s,c=(-d+.5)*a;return[p,c]}zoomToPoint(e,t,s,a,r){const[h,d]=this.toFractalCoords(e,t,a,r);this.centerX=h,this.centerY=d,this.zoom*=s,this.zoom=Math.max(.1,Math.min(this.zoom,1e15))}reset(){this.centerX=-.5,this.centerY=0,this.zoom=.4}}const Fe=256,Ne=512,He=4096,Ge=640,Ye=1.65;function J(i,e=!1){const t=Math.max(1,i),s=Math.log10(t),a=e?Ne:Fe,r=a+Ge*Math.pow(s,Ye);return Math.round(Math.max(a,Math.min(He,r)))}class Ue{constructor(){o(this,"view");o(this,"_fractalType",n.Mandelbrot);o(this,"_juliaC",[-.7,.27015]);o(this,"_juliaPickerMode",!1);o(this,"_isActivelyPickingJulia",!1);o(this,"_savedViewState",null);o(this,"_savedFractalType",null);o(this,"_paletteType","cosine");o(this,"_cosinePaletteIndex",1);o(this,"_gradientPaletteIndex",0);o(this,"_colorOffset",0);o(this,"_maxIterationsOverride",null);o(this,"_hdrBrightnessBias",0);o(this,"_sdrGradientBrightness",1);o(this,"_interpolatedPaletteParams",null);o(this,"listeners",new Set);this.view=new je}get fractalType(){return this._fractalType}get juliaC(){return this._juliaC}get juliaPickerMode(){return this._juliaPickerMode}get isActivelyPickingJulia(){return this._isActivelyPickingJulia}get savedViewState(){return this._savedViewState}get savedFractalType(){return this._savedFractalType}get paletteType(){return this._paletteType}get cosinePaletteIndex(){return this._cosinePaletteIndex}get gradientPaletteIndex(){return this._gradientPaletteIndex}get colorOffset(){return this._colorOffset}get maxIterationsOverride(){return this._maxIterationsOverride}get hdrBrightnessBias(){return this._hdrBrightnessBias}get sdrGradientBrightness(){return this._sdrGradientBrightness}get interpolatedPaletteParams(){return this._interpolatedPaletteParams}get isJulia(){return w(this._fractalType)}get maxIterations(){return this._maxIterationsOverride??J(this.view.zoom,this.isJulia)}set fractalType(e){this._fractalType!==e&&(this._fractalType=e,this.emit("fractalType"))}set juliaC(e){this._juliaC=e,this.emit("julia")}set juliaPickerMode(e){this._juliaPickerMode=e,this.emit("julia")}set isActivelyPickingJulia(e){this._isActivelyPickingJulia=e}set savedViewState(e){this._savedViewState=e}set savedFractalType(e){this._savedFractalType=e}set paletteType(e){this._paletteType!==e&&(this._paletteType=e,this.emit("palette"))}set cosinePaletteIndex(e){const t=(e%T+T)%T;this._cosinePaletteIndex!==t&&(this._cosinePaletteIndex=t,this.emit("palette"))}set gradientPaletteIndex(e){const t=(e%P+P)%P;this._gradientPaletteIndex!==t&&(this._gradientPaletteIndex=t,this.emit("palette"))}set colorOffset(e){this._colorOffset=e,this.emit("palette")}set maxIterationsOverride(e){this._maxIterationsOverride=e,this.emit("iterations")}set hdrBrightnessBias(e){this._hdrBrightnessBias=Math.max(-1,Math.min(1,e)),this.emit("brightness")}set sdrGradientBrightness(e){this._sdrGradientBrightness=Math.max(.1,Math.min(10,e)),this.emit("brightness")}set interpolatedPaletteParams(e){this._interpolatedPaletteParams=e}toBookmark(){return{fractalType:this._fractalType,centerX:this.view.centerX,centerY:this.view.centerY,zoom:this.view.zoom,paletteType:this._paletteType,cosinePaletteIndex:this._cosinePaletteIndex,gradientPaletteIndex:this._gradientPaletteIndex,colorOffset:this._colorOffset,juliaC:this._juliaC,maxIterationsOverride:this._maxIterationsOverride,aaEnabled:!1}}fromBookmark(e){e.centerX!==void 0&&(this.view.centerX=e.centerX),e.centerY!==void 0&&(this.view.centerY=e.centerY),e.zoom!==void 0&&(this.view.zoom=e.zoom),e.fractalType!==void 0&&(this._fractalType=e.fractalType),e.paletteType!==void 0&&(this._paletteType=e.paletteType),e.cosinePaletteIndex!==void 0&&(this._cosinePaletteIndex=e.cosinePaletteIndex%T),e.gradientPaletteIndex!==void 0&&(this._gradientPaletteIndex=e.gradientPaletteIndex%P),e.colorOffset!==void 0&&(this._colorOffset=e.colorOffset),e.juliaC!==void 0&&(this._juliaC=e.juliaC),e.maxIterationsOverride!==void 0&&(this._maxIterationsOverride=e.maxIterationsOverride),this.emit("all")}applyBookmark(e){this.view.centerX=e.centerX,this.view.centerY=e.centerY,this.view.zoom=e.zoom,this._fractalType=e.fractalType,this._paletteType=e.paletteType,this._cosinePaletteIndex=e.cosinePaletteIndex,this._gradientPaletteIndex=e.gradientPaletteIndex,this._colorOffset=e.colorOffset,this._juliaC=e.juliaC,this._maxIterationsOverride=e.maxIterationsOverride,this.emit("all")}applyPartial(e){e.centerX!==void 0&&(this.view.centerX=e.centerX),e.centerY!==void 0&&(this.view.centerY=e.centerY),e.zoom!==void 0&&(this.view.zoom=e.zoom),e.fractalType!==void 0&&(this._fractalType=e.fractalType),e.paletteType!==void 0&&(this._paletteType=e.paletteType),e.cosinePaletteIndex!==void 0&&(this._cosinePaletteIndex=e.cosinePaletteIndex),e.gradientPaletteIndex!==void 0&&(this._gradientPaletteIndex=e.gradientPaletteIndex),e.colorOffset!==void 0&&(this._colorOffset=e.colorOffset),e.juliaC!==void 0&&(this._juliaC=e.juliaC)}addListener(e){return this.listeners.add(e),()=>this.listeners.delete(e)}emit(e){for(const t of this.listeners)t(e)}notifyViewChange(){this.emit("view")}}const Xe=`// WebGPU Shader for Mandelbrot Set with HDR support
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
`,q=1.5,V=256;class j{constructor(e,t){o(this,"renderer");o(this,"state");o(this,"inputHandler");o(this,"pipeline");o(this,"uniformBuffer");o(this,"bindGroup");o(this,"overlays");o(this,"touristMode",null);o(this,"handleResize",()=>{this.renderer.resize(window.innerWidth,window.innerHeight),this.render()});o(this,"handleHashChange",()=>{this.loadBookmark()});this.renderer=e,this.state=new Ue,this.inputHandler=new L(t,this.state.view,()=>this.render(),this.createInputCallbacks()),this.setupOverlays(t)}static async create(e){const t=await _.create(e),s=new j(t,e);return await s.initializePipeline(),t.setOnHdrChange(()=>{console.log("HDR status changed, re-rendering..."),s.render()}),window.addEventListener("resize",s.handleResize),window.addEventListener("hashchange",s.handleHashChange),s.loadBookmark(),s.handleResize(),s}async initializePipeline(){const e=this.renderer.device,t=e.createShaderModule({label:"Mandelbrot Shader",code:Xe});this.uniformBuffer=e.createBuffer({label:"Uniforms",size:V,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});const s=e.createBindGroupLayout({label:"Bind Group Layout",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]});this.bindGroup=e.createBindGroup({label:"Bind Group",layout:s,entries:[{binding:0,resource:{buffer:this.uniformBuffer}}]});const a=e.createPipelineLayout({label:"Pipeline Layout",bindGroupLayouts:[s]});this.pipeline=e.createRenderPipeline({label:"Mandelbrot Pipeline",layout:a,vertex:{module:t,entryPoint:"vertexMain"},fragment:{module:t,entryPoint:"fragmentMain",targets:[{format:this.renderer.format}]},primitive:{topology:"triangle-list"}}),console.log("WebGPU pipeline initialized")}createInputCallbacks(){return{onIterationAdjust:e=>this.adjustMaxIterations(e),onIterationReset:()=>this.clearMaxIterationsOverride(),onCosinePaletteCycle:e=>this.cycleCosinePalette(e),onGradientPaletteCycle:e=>this.cycleGradientPalette(e),onColorOffsetAdjust:e=>this.adjustColorOffset(e),onColorOffsetReset:()=>this.resetColorOffset(),onBrightnessAdjust:e=>this.adjustHdrBrightness(e),onBrightnessReset:()=>this.resetHdrBrightness(),onFractalCycle:e=>this.cycleFractalType(e),onToggleJuliaMode:()=>this.toggleJuliaPickerMode(),onJuliaPick:(e,t)=>this.pickJuliaConstant(e,t),onJuliaPickEnd:()=>this.endJuliaPicking(),onShare:()=>this.shareBookmark(),onLocationSelect:e=>this.goToLocation(e),onLocationAnimate:e=>this.animateToLocation(e),onToggleHelp:()=>this.toggleHelp(),onToggleScreenshotMode:()=>this.toggleScreenshotMode(),onToggleTouristMode:()=>this.toggleTouristMode(),onUserInput:()=>this.handleUserInput()}}setupOverlays(e){const t=e.parentElement;if(!t)throw new Error("Canvas must have a parent element for overlays");this.overlays=new Je(t)}render(){const e=this.renderer.device,t=this.renderer.canvas,s=performance.now();this.overlays.tickFPS(s);const a=w(this.state.fractalType),r=this.state.maxIterationsOverride??J(this.state.view.zoom,a),h=this.state.paletteType==="cosine"?we(this.state.cosinePaletteIndex):Me(this.state.gradientPaletteIndex),d={fractalName:ne[this.state.fractalType],zoom:this.state.view.zoom,maxIterations:r,isManualIterations:this.state.maxIterationsOverride!==null,paletteName:h,colorOffset:this.state.colorOffset,isJulia:a,juliaC:this.state.juliaC,hdrEnabled:this.renderer.hdrEnabled,hdrBrightnessBias:this.state.hdrBrightnessBias,displaySupportsHDR:this.renderer.displaySupportsHDR,sdrGradientBrightness:this.state.sdrGradientBrightness,paletteType:this.state.paletteType,juliaPickerMode:this.state.juliaPickerMode};this.overlays.updateDebug(d);const p=new ArrayBuffer(V),c=new Float32Array(p),f=new Int32Array(p),m=this.state.paletteType==="cosine",x=m?Ie(this.state.cosinePaletteIndex):Ce(this.state.gradientPaletteIndex),u=this.state.interpolatedPaletteParams??(m?Q(this.state.cosinePaletteIndex):ee(this.state.gradientPaletteIndex,this.renderer.hdrEnabled));c[0]=t.width,c[1]=t.height,c[2]=this.state.view.centerX,c[3]=this.state.view.centerY,c[4]=this.state.view.zoom,f[5]=r,c[6]=performance.now()*.001,c[7]=this.state.colorOffset,f[8]=this.state.fractalType,c[10]=this.state.juliaC[0],c[11]=this.state.juliaC[1],f[12]=this.renderer.hdrEnabled?1:0,c[13]=this.state.hdrBrightnessBias,f[14]=u.type==="cosine"?0:1,f[15]=x.isMonotonic?1:0,c[16]=this.state.sdrGradientBrightness,u.type==="cosine"&&(c[20]=u.a[0],c[21]=u.a[1],c[22]=u.a[2],c[24]=u.b[0],c[25]=u.b[1],c[26]=u.b[2],c[28]=u.c[0],c[29]=u.c[1],c[30]=u.c[2],c[32]=u.d[0],c[33]=u.d[1],c[34]=u.d[2]),u.type==="gradient"&&(c[36]=u.c1[0],c[37]=u.c1[1],c[38]=u.c1[2],c[40]=u.c2[0],c[41]=u.c2[1],c[42]=u.c2[2],c[44]=u.c3[0],c[45]=u.c3[1],c[46]=u.c3[2],c[48]=u.c4[0],c[49]=u.c4[1],c[50]=u.c4[2],c[52]=u.c5[0],c[53]=u.c5[1],c[54]=u.c5[2]),e.queue.writeBuffer(this.uniformBuffer,0,p);const I=e.createCommandEncoder(),te=this.renderer.getCurrentTexture().createView(),z=I.beginRenderPass({colorAttachments:[{view:te,clearValue:{r:0,g:0,b:0,a:1},loadOp:"clear",storeOp:"store"}]});z.setPipeline(this.pipeline),z.setBindGroup(0,this.bindGroup),z.draw(3),z.end(),e.queue.submit([I.finish()])}start(){this.renderer.start(()=>this.render())}stop(){this.renderer.stop()}adjustMaxIterations(e){const t=w(this.state.fractalType),s=this.state.maxIterationsOverride??J(this.state.view.zoom,t),a=e>0?s*q:s/q;this.state.maxIterationsOverride=Math.round(Math.max(1,a)),this.render()}clearMaxIterationsOverride(){this.state.maxIterationsOverride=null,this.render()}adjustHdrBrightness(e){this.renderer.hdrEnabled?this.state.hdrBrightnessBias=Math.max(-1,Math.min(1,this.state.hdrBrightnessBias+e*.1)):this.state.paletteType==="gradient"&&(this.state.sdrGradientBrightness=Math.max(.1,Math.min(10,this.state.sdrGradientBrightness+e*.2))),this.render()}resetHdrBrightness(){this.state.hdrBrightnessBias=0,this.state.sdrGradientBrightness=1,this.render()}cycleCosinePalette(e){this.state.cosinePaletteIndex=(this.state.cosinePaletteIndex+e+T)%T,this.state.paletteType="cosine",this.render()}cycleGradientPalette(e){this.state.gradientPaletteIndex=(this.state.gradientPaletteIndex+e+P)%P,this.state.paletteType="gradient",this.render()}adjustColorOffset(e){this.state.colorOffset+=e,this.render()}resetColorOffset(){this.state.colorOffset=0,this.render()}cycleFractalType(e=1){const r=((M(this.state.fractalType)>>1)+e+S)%S<<1;this.state.juliaPickerMode&&(this.state.juliaPickerMode=!1,this.inputHandler.setJuliaPickerMode(!1));const h=R("1",r);h?(this.applyLocationState(h.state),this.showLocationNotification(h.name,h.description)):this.state.fractalType=r,this.render()}toggleJuliaPickerMode(){if(w(this.state.fractalType)){this.exitJuliaMode();return}this.state.juliaPickerMode=!this.state.juliaPickerMode,this.inputHandler.setJuliaPickerMode(this.state.juliaPickerMode),this.render()}pickJuliaConstant(e,t){this.state.juliaPickerMode&&(this.state.isActivelyPickingJulia||(this.state.savedViewState={centerX:this.state.view.centerX,centerY:this.state.view.centerY,zoom:this.state.view.zoom},this.state.savedFractalType=this.state.fractalType,this.state.fractalType=oe(this.state.fractalType),this.state.view.centerX=0,this.state.view.centerY=0,this.state.view.zoom=.5,this.state.isActivelyPickingJulia=!0),this.state.juliaC=[e,t],this.render())}endJuliaPicking(){this.state.isActivelyPickingJulia&&(this.state.isActivelyPickingJulia=!1,this.state.juliaPickerMode=!1,this.inputHandler.setJuliaPickerMode(!1),this.render())}exitJuliaMode(){this.state.savedViewState&&(this.state.view.centerX=this.state.savedViewState.centerX,this.state.view.centerY=this.state.savedViewState.centerY,this.state.view.zoom=this.state.savedViewState.zoom,this.state.savedViewState=null),this.state.savedFractalType!==null?(this.state.fractalType=this.state.savedFractalType,this.state.savedFractalType=null):this.state.fractalType=M(this.state.fractalType),this.state.juliaPickerMode=!1,this.inputHandler.setJuliaPickerMode(!1),this.render()}getBookmarkState(){return this.state.toBookmark()}loadBookmark(){const e=he();if(e){if(e.paletteIndex!==void 0&&e.paletteType===void 0){const t=[0,4,5,10,11];if(t.includes(e.paletteIndex))e.paletteType="cosine",e.cosinePaletteIndex=t.indexOf(e.paletteIndex);else{e.paletteType="gradient";const s=[1,2,3,6,7,8,9];e.gradientPaletteIndex=s.indexOf(e.paletteIndex)}}this.state.fromBookmark(e),this.render()}}goToLocation(e){const t=R(e,this.state.fractalType);t&&(this.applyLocationState(t.state),this.showLocationNotification(t.name,t.description),this.updateUrlBookmark(),this.render())}animateToLocation(e){const t=R(e,this.state.fractalType);t&&(this.touristMode||(this.touristMode=new $({onUpdate:s=>this.applyTouristUpdate(s),onRender:()=>this.render(),onLocationNotification:(s,a)=>this.showLocationNotification(s,a)},this.getBookmarkState())),this.touristMode.animateToLocation(t,this.getBookmarkState()))}applyLocationState(e){this.state.applyBookmark(e)}showLocationNotification(e,t){this.overlays.notification.showLocation(e,t)}updateUrlBookmark(){ce(this.getBookmarkState())}async shareBookmark(){const e=await de(this.getBookmarkState());this.showShareNotification(e),e&&this.updateUrlBookmark(),(window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1")&&this.logCreateLocationCode()}logCreateLocationCode(){const e=this.getFractalTypeEnumName(this.state.fractalType),t=w(this.state.fractalType),s=[];this.state.paletteType==="gradient"?(s.push("paletteType: 'gradient'"),this.state.gradientPaletteIndex!==0&&s.push(`gradientPaletteIndex: ${this.state.gradientPaletteIndex}`)):this.state.cosinePaletteIndex!==1&&s.push(`cosinePaletteIndex: ${this.state.cosinePaletteIndex}`),Math.abs(this.state.colorOffset)>.001&&s.push(`colorOffset: ${this.state.colorOffset}`),t&&s.push(`juliaC: [${this.state.juliaC[0]}, ${this.state.juliaC[1]}]`),this.state.maxIterationsOverride!==null&&s.push(`maxIterationsOverride: ${this.state.maxIterationsOverride}`);const a=s.length>0?`,
    { ${s.join(", ")} }`:"",r=`createLocation(
    'TODO: Name',
    'TODO: Description',
    'TODO: Key (1-9)',
    FractalType.${e},
    ${this.state.view.centerX}, ${this.state.view.centerY}, ${this.state.view.zoom}${a}
  ),`;console.log("%c📍 createLocation() code:","color: #4ade80; font-weight: bold; font-size: 14px;"),console.log(r)}getFractalTypeEnumName(e){const t=Object.entries(n);for(const[s,a]of t)if(a===e&&isNaN(Number(s)))return s;return`Unknown(${e})`}showShareNotification(e){this.overlays.notification.showShareResult(e)}toggleHelp(){this.overlays.toggleHelp()}toggleScreenshotMode(){this.overlays.toggleScreenshotMode()}toggleTouristMode(){this.touristMode?.isActive()?this.stopTouristMode():this.startTouristMode()}startTouristMode(){this.touristMode||(this.touristMode=new $({onUpdate:(e,t)=>this.applyTouristUpdate(e,t),onRender:()=>this.render(),onLocationNotification:(e,t)=>this.showLocationNotification(e,t)},this.getBookmarkState())),this.touristMode.start(this.getBookmarkState()),this.showTouristModeNotification(!0)}stopTouristMode(){this.touristMode&&(this.touristMode.stop(),this.state.interpolatedPaletteParams=null,this.showTouristModeNotification(!1),this.updateUrlBookmark())}handleUserInput(){this.touristMode?.isActive()&&this.stopTouristMode()}applyTouristUpdate(e,t){this.state.applyPartial(e),this.state.interpolatedPaletteParams=t??null}showTouristModeNotification(e){this.overlays.notification.showTouristMode(e)}destroy(){this.touristMode?.stop(),this.stop(),window.removeEventListener("resize",this.handleResize),window.removeEventListener("hashchange",this.handleHashChange),this.overlays.destroy(),this.inputHandler.destroy(),this.renderer.destroy()}}console.log("Fractal Explorer - Initializing...");let k=null;async function Z(){const i=document.getElementById("app");if(!i){console.error("Could not find #app element");return}if(!_.isSupported()){i.innerHTML=`
      <div style="color: white; text-align: center; padding: 40px; font-family: system-ui, sans-serif;">
        <h1>WebGPU Not Supported</h1>
        <p>This application requires WebGPU, which is not available in your browser.</p>
        <p style="margin-top: 20px; color: #888;">
          Please use a modern browser with WebGPU support:<br>
          Chrome 113+, Edge 113+, or Firefox Nightly with WebGPU enabled.
        </p>
      </div>
    `;return}const e=document.createElement("canvas");e.id="fractal-canvas",i.appendChild(e);try{k=await j.create(e),k.start(),console.log("Fractal Explorer initialized successfully"),console.log("Controls:"),console.log("  - Drag to pan"),console.log("  - Scroll to zoom"),console.log("  - Double-click to zoom in"),console.log("  - Touch drag to pan (mobile)"),console.log("  - Pinch to zoom (mobile)"),console.log("  - + / - to adjust max iterations"),console.log("  - 0 to reset iterations to auto-scaling"),console.log("  - c / C to cycle cosine palettes (forward/backward)"),console.log("  - g / G to cycle gradient palettes (forward/backward)"),console.log("  - , / . to shift colors (fine)"),console.log("  - < / > to shift colors (coarse)"),console.log("  - b / B to adjust brightness (HDR bias or SDR gradient)"),console.log("  - d to reset brightness"),console.log("  - s to share/copy bookmark URL"),console.log("  - 1-9 to visit famous locations"),console.log("  - h to toggle help overlay"),console.log("  - Space to toggle screenshot mode")}catch(t){console.error("Failed to initialize Fractal Explorer:",t),i.innerHTML=`
      <div style="color: white; text-align: center; padding: 20px; font-family: system-ui, sans-serif;">
        <h1>Initialization Error</h1>
        <p>Failed to initialize the application.</p>
        <pre style="text-align: left; margin-top: 20px; color: #ff6b6b;">${t instanceof Error?t.message:String(t)}</pre>
      </div>
    `}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>Z()):Z();window.addEventListener("beforeunload",()=>{k&&k.destroy()});
//# sourceMappingURL=index-Bq715ESl.js.map
