var X=Object.defineProperty;var N=(i,e,t)=>e in i?X(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t;var s=(i,e,t)=>N(i,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))n(o);new MutationObserver(o=>{for(const r of o)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function t(o){const r={};return o.integrity&&(r.integrity=o.integrity),o.referrerPolicy&&(r.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?r.credentials="include":o.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(o){if(o.ep)return;o.ep=!0;const r=t(o);fetch(o.href,r)}})();class S{constructor(e){s(this,"device");s(this,"context");s(this,"canvas");s(this,"format");s(this,"animationFrameId",null);s(this,"renderCallback",null);s(this,"hdrEnabled",!1);s(this,"_displaySupportsHDR",!1);s(this,"hdrMediaQuery",null);s(this,"onHdrChangeCallback",null);this.canvas=e,this._displaySupportsHDR=this.detectHDRDisplay(),this.setupHdrMediaQueryListener()}get displaySupportsHDR(){return this._displaySupportsHDR}static async create(e){const t=new S(e);return await t.initialize(),t}static isSupported(){return"gpu"in navigator}async initialize(){if(!navigator.gpu)throw new Error("WebGPU is not supported in this browser");console.log("WebGPU HDR capability check:"),console.log("  - Display supports HDR:",this.displaySupportsHDR),console.log("  - dynamic-range: high:",window.matchMedia?.("(dynamic-range: high)").matches),console.log("  - color-gamut: p3:",window.matchMedia?.("(color-gamut: p3)").matches);const e=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!e)throw new Error("Failed to get WebGPU adapter");if("info"in e){const t=e.info;console.log("  - Adapter:",t?.vendor,t?.architecture)}if(this.device=await e.requestDevice(),this.context=this.canvas.getContext("webgpu"),!this.context)throw new Error("Failed to get WebGPU context");this.configureContext(),console.log("WebGPU initialized successfully"),this.hdrEnabled&&console.log("HDR mode enabled with rgba16float + extended tone mapping")}configureContext(){const e=navigator.gpu.getPreferredCanvasFormat();if(this.displaySupportsHDR)try{this.format="rgba16float",this.context.configure({device:this.device,format:this.format,alphaMode:"opaque",toneMapping:{mode:"extended"}}),this.hdrEnabled=!0,console.log("  - Configured with rgba16float + extended tone mapping (HDR)")}catch(t){console.log("  - HDR configuration failed, falling back to SDR:",t),this.format=e,this.context.configure({device:this.device,format:this.format,alphaMode:"opaque"}),this.hdrEnabled=!1}else this.format=e,this.context.configure({device:this.device,format:this.format,alphaMode:"opaque"}),this.hdrEnabled=!1,console.log("  - Configured with",this.format,"(SDR)")}resize(e,t){const n=window.devicePixelRatio||1;this.canvas.width=e*n,this.canvas.height=t*n,this.canvas.style.width=`${e}px`,this.canvas.style.height=`${t}px`}getCurrentTexture(){return this.context.getCurrentTexture()}start(e){if(this.animationFrameId!==null)return;this.renderCallback=e;const t=()=>{this.renderCallback&&this.renderCallback(),this.animationFrameId=requestAnimationFrame(t)};this.animationFrameId=requestAnimationFrame(t)}stop(){this.animationFrameId!==null&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null),this.renderCallback=null}detectHDRDisplay(){return!!window.matchMedia?.("(dynamic-range: high)").matches}setupHdrMediaQueryListener(){if(!window.matchMedia)return;this.hdrMediaQuery=window.matchMedia("(dynamic-range: high)");const e=()=>{const t=this.detectHDRDisplay();t!==this._displaySupportsHDR&&(console.log(`HDR display support changed: ${this._displaySupportsHDR} -> ${t}`),this._displaySupportsHDR=t,this.context&&this.device&&this.configureContext(),this.onHdrChangeCallback?.())};this.hdrMediaQuery.addEventListener?.("change",e)}setOnHdrChange(e){this.onHdrChangeCallback=e}destroy(){this.stop(),this.onHdrChangeCallback=null,this.device?.destroy()}}class U{constructor(e=-.5,t=0,n=.4){s(this,"centerX");s(this,"centerY");s(this,"zoom");this.centerX=e,this.centerY=t,this.zoom=n}pan(e,t,n,o){const r=-e/(this.zoom*n),a=t/(this.zoom*o);this.centerX+=r,this.centerY+=a}zoomAt(e,t,n,o,r){const a=this.centerX+(e/o-.5)/this.zoom,c=this.centerY-(t/r-.5)/this.zoom;this.zoom*=n,this.zoom=Math.max(.1,Math.min(this.zoom,1e15));const u=this.centerX+(e/o-.5)/this.zoom,l=this.centerY-(t/r-.5)/this.zoom;this.centerX+=a-u,this.centerY+=c-l}toFractalCoords(e,t,n,o){const r=n/o,a=(e/n-.5)*r,c=t/o-.5,u=this.centerX+a/this.zoom,l=this.centerY-c/this.zoom;return[u,l]}toScreenCoords(e,t,n,o){const r=n/o,a=(e-this.centerX)*this.zoom,c=(t-this.centerY)*this.zoom,u=(a/r+.5)*n,l=(-c+.5)*o;return[u,l]}zoomToPoint(e,t,n,o,r){const[a,c]=this.toFractalCoords(e,t,o,r);this.centerX=a,this.centerY=c,this.zoom*=n,this.zoom=Math.max(.1,Math.min(this.zoom,1e15))}reset(){this.centerX=-.5,this.centerY=0,this.zoom=.4}}const F=.6;function M(i){return 1+(i-1)*F}class G{constructor(e,t,n){s(this,"canvas");s(this,"viewState");s(this,"onChange");s(this,"onIterationAdjust",null);s(this,"onIterationReset",null);s(this,"onPaletteCycle",null);s(this,"onColorOffset",null);s(this,"onColorOffsetReset",null);s(this,"onToggleAA",null);s(this,"onAdjustHdrBrightness",null);s(this,"onResetHdrBrightness",null);s(this,"onFractalCycle",null);s(this,"onToggleJuliaMode",null);s(this,"onJuliaPick",null);s(this,"onShare",null);s(this,"onLocationSelect",null);s(this,"onToggleHelp",null);s(this,"onToggleScreenshotMode",null);s(this,"isDragging",!1);s(this,"lastX",0);s(this,"lastY",0);s(this,"lastTouchDistance",0);s(this,"juliaPickerMode",!1);this.canvas=e,this.viewState=t,this.onChange=n,this.setupEventListeners()}setIterationAdjustCallback(e){this.onIterationAdjust=e}setIterationResetCallback(e){this.onIterationReset=e}setPaletteCycleCallback(e){this.onPaletteCycle=e}setColorOffsetCallback(e){this.onColorOffset=e}setColorOffsetResetCallback(e){this.onColorOffsetReset=e}setToggleAACallback(e){this.onToggleAA=e}setToggleHDRCallback(e){}setAdjustHdrBrightnessCallback(e){this.onAdjustHdrBrightness=e}setResetHdrBrightnessCallback(e){this.onResetHdrBrightness=e}setFractalCycleCallback(e){this.onFractalCycle=e}setToggleJuliaModeCallback(e){this.onToggleJuliaMode=e}setJuliaPickCallback(e){this.onJuliaPick=e}setShareCallback(e){this.onShare=e}setLocationSelectCallback(e){this.onLocationSelect=e}setToggleHelpCallback(e){this.onToggleHelp=e}setToggleScreenshotModeCallback(e){this.onToggleScreenshotMode=e}setJuliaPickerMode(e){this.juliaPickerMode=e,this.canvas.style.cursor=e?"crosshair":"grab"}isJuliaPickerModeActive(){return this.juliaPickerMode}setupEventListeners(){this.canvas.addEventListener("mousedown",this.handleMouseDown.bind(this)),this.canvas.addEventListener("mousemove",this.handleMouseMove.bind(this)),this.canvas.addEventListener("mouseup",this.handleMouseUp.bind(this)),this.canvas.addEventListener("mouseleave",this.handleMouseUp.bind(this)),this.canvas.addEventListener("wheel",this.handleWheel.bind(this),{passive:!1}),this.canvas.addEventListener("dblclick",this.handleDoubleClick.bind(this)),this.canvas.addEventListener("touchstart",this.handleTouchStart.bind(this),{passive:!1}),this.canvas.addEventListener("touchmove",this.handleTouchMove.bind(this),{passive:!1}),this.canvas.addEventListener("touchend",this.handleTouchEnd.bind(this)),this.canvas.addEventListener("touchcancel",this.handleTouchEnd.bind(this)),this.canvas.addEventListener("contextmenu",e=>e.preventDefault()),window.addEventListener("keydown",this.handleKeyDown.bind(this))}getCanvasRect(){return this.canvas.getBoundingClientRect()}getScreenCoords(e,t){const n=this.getCanvasRect();return[e-n.left,t-n.top]}getCanvasSize(){const e=this.getCanvasRect();return[e.width,e.height]}notifyChange(){this.onChange(this.viewState)}handleMouseDown(e){if(e.button!==0)return;const[t,n]=this.getScreenCoords(e.clientX,e.clientY);if(this.juliaPickerMode&&this.onJuliaPick){const[o,r]=this.getCanvasSize(),[a,c]=this.viewState.toFractalCoords(t,n,o,r);this.onJuliaPick(a,c);return}this.isDragging=!0,this.lastX=t,this.lastY=n,this.canvas.style.cursor="grabbing"}handleMouseMove(e){if(!this.isDragging)return;const[t,n]=this.getScreenCoords(e.clientX,e.clientY),o=t-this.lastX,r=n-this.lastY,[a,c]=this.getCanvasSize();this.viewState.pan(o,r,a,c),this.notifyChange(),this.lastX=t,this.lastY=n}handleMouseUp(){this.isDragging&&(this.isDragging=!1,this.canvas.style.cursor="grab")}handleWheel(e){e.preventDefault();const[t,n]=this.getScreenCoords(e.clientX,e.clientY),o=e.deltaY>0?.9:1.1,r=M(o),[a,c]=this.getCanvasSize();this.viewState.zoomAt(t,n,r,a,c),this.notifyChange()}handleDoubleClick(e){const[t,n]=this.getScreenCoords(e.clientX,e.clientY),[o,r]=this.getCanvasSize();this.viewState.zoomToPoint(t,n,M(2),o,r),this.notifyChange()}getTouchDistance(e){if(e.length<2)return 0;const t=e[0].clientX-e[1].clientX,n=e[0].clientY-e[1].clientY;return Math.sqrt(t*t+n*n)}getTouchCenter(e){if(e.length===0)return[0,0];if(e.length===1)return this.getScreenCoords(e[0].clientX,e[0].clientY);const t=(e[0].clientX+e[1].clientX)/2,n=(e[0].clientY+e[1].clientY)/2;return this.getScreenCoords(t,n)}handleTouchStart(e){if(e.touches.length===1){this.isDragging=!0;const[t,n]=this.getScreenCoords(e.touches[0].clientX,e.touches[0].clientY);this.lastX=t,this.lastY=n}else e.touches.length===2&&(this.isDragging=!1,this.lastTouchDistance=this.getTouchDistance(e.touches))}handleTouchMove(e){if(e.preventDefault(),e.touches.length===1&&this.isDragging){const[t,n]=this.getScreenCoords(e.touches[0].clientX,e.touches[0].clientY),o=t-this.lastX,r=n-this.lastY,[a,c]=this.getCanvasSize();this.viewState.pan(o,r,a,c),this.notifyChange(),this.lastX=t,this.lastY=n}else if(e.touches.length===2){const t=this.getTouchDistance(e.touches),n=this.getTouchCenter(e.touches);if(this.lastTouchDistance>0){const o=t/this.lastTouchDistance,r=M(o),[a,c]=this.getCanvasSize();this.viewState.zoomAt(n[0],n[1],r,a,c),this.notifyChange()}this.lastTouchDistance=t}}handleTouchEnd(){this.isDragging=!1,this.lastTouchDistance=0}handleKeyDown(e){if(!(e.target instanceof HTMLInputElement||e.target instanceof HTMLTextAreaElement))switch(e.key){case"+":case"=":e.preventDefault(),this.onIterationAdjust?.(1);break;case"-":case"_":e.preventDefault(),this.onIterationAdjust?.(-1);break;case"0":e.preventDefault(),this.onIterationReset?.();break;case"c":e.preventDefault(),this.onPaletteCycle?.(1);break;case"C":e.preventDefault(),this.onPaletteCycle?.(-1);break;case"[":case",":e.preventDefault(),this.onColorOffset?.(-.1);break;case"]":case".":e.preventDefault(),this.onColorOffset?.(.1);break;case"{":case"<":e.preventDefault(),this.onColorOffset?.(-.5);break;case"}":case">":e.preventDefault(),this.onColorOffset?.(.5);break;case"r":case"R":e.preventDefault(),this.onColorOffsetReset?.();break;case"a":case"A":e.preventDefault(),this.onToggleAA?.();break;case"b":e.preventDefault(),this.onAdjustHdrBrightness?.(1);break;case"B":e.preventDefault(),this.onAdjustHdrBrightness?.(-1);break;case"d":e.preventDefault(),this.onResetHdrBrightness?.();break;case"f":e.preventDefault(),this.onFractalCycle?.(1);break;case"F":e.preventDefault(),this.onFractalCycle?.(-1);break;case"j":case"J":e.preventDefault(),this.onToggleJuliaMode?.();break;case"s":case"S":e.preventDefault(),this.onShare?.();break;case"1":case"2":case"3":case"4":case"5":case"6":case"7":case"8":case"9":e.preventDefault(),this.onLocationSelect?.(e.key);break;case"h":case"H":e.preventDefault(),this.onToggleHelp?.();break;case" ":e.preventDefault(),this.onToggleScreenshotMode?.();break}}destroy(){}}var d=(i=>(i[i.Mandelbrot=0]="Mandelbrot",i[i.MandelbrotJulia=1]="MandelbrotJulia",i[i.BurningShip=2]="BurningShip",i[i.BurningShipJulia=3]="BurningShipJulia",i[i.Tricorn=4]="Tricorn",i[i.TricornJulia=5]="TricornJulia",i[i.Celtic=6]="Celtic",i[i.CelticJulia=7]="CelticJulia",i[i.Buffalo=8]="Buffalo",i[i.BuffaloJulia=9]="BuffaloJulia",i[i.Phoenix=10]="Phoenix",i[i.PhoenixJulia=11]="PhoenixJulia",i[i.Multibrot3=12]="Multibrot3",i[i.Multibrot3Julia=13]="Multibrot3Julia",i[i.Multibrot4=14]="Multibrot4",i[i.Multibrot4Julia=15]="Multibrot4Julia",i[i.Funky=16]="Funky",i[i.FunkyJulia=17]="FunkyJulia",i[i.Perpendicular=18]="Perpendicular",i[i.PerpendicularJulia=19]="PerpendicularJulia",i))(d||{});const q={0:"Mandelbrot",1:"Mandelbrot Julia",2:"Burning Ship",3:"Burning Ship Julia",4:"Tricorn",5:"Tricorn Julia",6:"Celtic",7:"Celtic Julia",8:"Buffalo",9:"Buffalo Julia",10:"Phoenix",11:"Phoenix Julia",12:"Multibrot (z³)",13:"Multibrot³ Julia",14:"Multibrot (z⁴)",15:"Multibrot⁴ Julia",16:"Funky",17:"Funky Julia",18:"Perpendicular",19:"Perpendicular Julia"},R=10;function z(i){return(i&1)===1}function P(i){return i&-2}function $(i){return i|1}const h={TYPE:"t",CENTER_X:"x",CENTER_Y:"y",ZOOM:"z",PALETTE:"p",COLOR_OFFSET:"o",JULIA_REAL:"jr",JULIA_IMAG:"ji",ITERATIONS:"i",AA:"aa"};function m(i,e=15){return i===0?"0":Math.abs(i)<1e-10||Math.abs(i)>1e10?i.toExponential(e):parseFloat(i.toPrecision(e)).toString()}function f(i){if(i===null||i==="")return null;const e=parseFloat(i);return isNaN(e)?null:e}function B(i){const e=new URLSearchParams;return e.set(h.TYPE,i.fractalType.toString()),e.set(h.CENTER_X,m(i.centerX)),e.set(h.CENTER_Y,m(i.centerY)),e.set(h.ZOOM,m(i.zoom)),e.set(h.PALETTE,i.paletteIndex.toString()),Math.abs(i.colorOffset)>.001&&e.set(h.COLOR_OFFSET,m(i.colorOffset,4)),z(i.fractalType)&&(e.set(h.JULIA_REAL,m(i.juliaC[0])),e.set(h.JULIA_IMAG,m(i.juliaC[1]))),i.maxIterationsOverride!==null&&e.set(h.ITERATIONS,i.maxIterationsOverride.toString()),i.aaEnabled&&e.set(h.AA,"1"),e.toString()}function V(i){const e=new URLSearchParams(i.replace(/^#/,"")),t={},n=f(e.get(h.TYPE));n!==null&&n>=0&&n<=19&&(t.fractalType=n);const o=f(e.get(h.CENTER_X));o!==null&&(t.centerX=o);const r=f(e.get(h.CENTER_Y));r!==null&&(t.centerY=r);const a=f(e.get(h.ZOOM));a!==null&&a>0&&(t.zoom=a);const c=f(e.get(h.PALETTE));c!==null&&c>=0&&c<=11&&(t.paletteIndex=Math.floor(c));const u=f(e.get(h.COLOR_OFFSET));u!==null&&(t.colorOffset=u);const l=f(e.get(h.JULIA_REAL)),v=f(e.get(h.JULIA_IMAG));l!==null&&v!==null&&(t.juliaC=[l,v]);const y=f(e.get(h.ITERATIONS));return y!==null&&y>0&&(t.maxIterationsOverride=Math.floor(y)),e.get(h.AA)==="1"&&(t.aaEnabled=!0),t}function W(i){const e=B(i),t=new URL(window.location.href);return t.hash=e,t.toString()}function Z(i){const e=B(i);window.history.replaceState(null,"","#"+e)}function K(){return V(window.location.hash)}async function Q(i){const e=W(i);try{return await navigator.clipboard.writeText(e),!0}catch{const t=document.createElement("textarea");t.value=e,t.style.position="fixed",t.style.left="-9999px",document.body.appendChild(t),t.select();try{return document.execCommand("copy"),!0}catch{return!1}finally{document.body.removeChild(t)}}}const ee=[{name:"Seahorse Valley",description:"The iconic seahorse-shaped spirals in the Mandelbrot set",key:"1",state:{fractalType:d.Mandelbrot,centerX:-.747,centerY:.1,zoom:70,paletteIndex:4,colorOffset:.1,juliaC:[-.7,.27015],maxIterationsOverride:null,aaEnabled:!1}},{name:"Elephant Valley",description:"Elephant trunk-like spirals on the positive real side",key:"2",state:{fractalType:d.Mandelbrot,centerX:.273897508880652,centerY:.00596002252770864,zoom:180,paletteIndex:10,colorOffset:-.1,juliaC:[.273897508880652,.00596002252770864],maxIterationsOverride:null,aaEnabled:!1}},{name:"Double Spiral Valley",description:"Beautiful double spirals deep in the set",key:"3",state:{fractalType:d.Mandelbrot,centerX:-.743733589978665,centerY:.130905227502858,zoom:350,paletteIndex:11,colorOffset:.2,juliaC:[-.7,.27015],maxIterationsOverride:null,aaEnabled:!1}},{name:"Spiral Galaxy",description:"Galactic spiral arms emerging from chaos",key:"4",state:{fractalType:d.Mandelbrot,centerX:-.761542947469557,centerY:-.0848063048239542,zoom:1300,paletteIndex:5,colorOffset:-.6,juliaC:[-.7,.27015],maxIterationsOverride:null,aaEnabled:!1}},{name:"The Armada",description:"Mini ships along the antenna of the Burning Ship fractal",key:"5",state:{fractalType:d.BurningShip,centerX:-1.80173025652805,centerY:.0153452534367207,zoom:9,paletteIndex:11,colorOffset:.2,juliaC:[-.7,.27015],maxIterationsOverride:null,aaEnabled:!1}},{name:"Douady Rabbit",description:"The famous rabbit-eared Julia set",key:"6",state:{fractalType:d.MandelbrotJulia,centerX:0,centerY:0,zoom:.6,paletteIndex:11,colorOffset:.2,juliaC:[-.123,.745],maxIterationsOverride:null,aaEnabled:!1}},{name:"Dragon Julia",description:"Fierce dragon-like Julia set",key:"7",state:{fractalType:d.MandelbrotJulia,centerX:0,centerY:0,zoom:.45,paletteIndex:10,colorOffset:.5,juliaC:[-.8,.156],maxIterationsOverride:null,aaEnabled:!1}},{name:"Lightning Julia",description:"Electric, lightning-like patterns",key:"8",state:{fractalType:d.MandelbrotJulia,centerX:0,centerY:0,zoom:.45,paletteIndex:11,colorOffset:.2,juliaC:[-.7269,.1889],maxIterationsOverride:1e3,aaEnabled:!1}},{name:"Phoenix Julia",description:"The classic Phoenix fractal with feathery tendrils",key:"9",state:{fractalType:d.PhoenixJulia,centerX:0,centerY:0,zoom:.5,paletteIndex:4,colorOffset:.2,juliaC:[.5667,-.5],maxIterationsOverride:null,aaEnabled:!1}}];function te(i){return ee.find(e=>e.key===i)}const p=[{name:"Rainbow",isMonotonic:!1,params:{type:"cosine",a:[.5,.5,.5],b:[.5,.5,.5],c:[1,1,1],d:[0,.33,.67]}},{name:"Blue",isMonotonic:!0,params:{type:"gradient",c1:[.02,.01,.08],c2:[.05,.15,.25],c3:[.1,.4,.5],c4:[.3,.6,.8],c5:[.7,.9,1]},hdrParams:{type:"gradient",c1:[.2,.4,1],c2:[.3,.6,1],c3:[.4,.8,1],c4:[.6,.9,1],c5:[.85,1,1]}},{name:"Gold",isMonotonic:!0,params:{type:"gradient",c1:[.04,.02,.01],c2:[.2,.08,.02],c3:[.5,.25,.05],c4:[.85,.6,.2],c5:[1,.95,.7]},hdrParams:{type:"gradient",c1:[1,.5,.1],c2:[1,.65,.2],c3:[1,.8,.3],c4:[1,.9,.5],c5:[1,1,.8]}},{name:"Grayscale",isMonotonic:!0,params:{type:"gradient",c1:[.01,.01,.03],c2:[.15,.15,.17],c3:[.45,.45,.45],c4:[.75,.74,.72],c5:[1,.98,.95]},hdrParams:{type:"gradient",c1:[1,1,1],c2:[1,1,1],c3:[1,1,1],c4:[1,1,1],c5:[1,1,1]}},{name:"Fire",isMonotonic:!1,params:{type:"cosine",a:[.5,.5,.5],b:[.5,.5,.5],c:[1,1,.5],d:[0,.1,.2]}},{name:"Ice",isMonotonic:!1,params:{type:"cosine",a:[.5,.5,.5],b:[.5,.5,.5],c:[1,.7,.4],d:[0,.15,.2]}},{name:"Sepia",isMonotonic:!0,params:{type:"gradient",c1:[.03,.02,.01],c2:[.15,.08,.03],c3:[.4,.25,.12],c4:[.7,.55,.35],c5:[1,.95,.85]},hdrParams:{type:"gradient",c1:[1,.7,.4],c2:[1,.8,.55],c3:[1,.88,.7],c4:[1,.95,.85],c5:[1,1,.95]}},{name:"Ocean",isMonotonic:!0,params:{type:"gradient",c1:[0,.02,.05],c2:[.02,.08,.2],c3:[.05,.3,.4],c4:[.2,.6,.6],c5:[.6,.95,.9]},hdrParams:{type:"gradient",c1:[.1,.8,.8],c2:[.2,.9,.85],c3:[.4,.95,.9],c4:[.65,1,.95],c5:[.85,1,1]}},{name:"Purple",isMonotonic:!0,params:{type:"gradient",c1:[.03,.01,.06],c2:[.15,.05,.25],c3:[.4,.15,.5],c4:[.7,.4,.75],c5:[.95,.8,1]},hdrParams:{type:"gradient",c1:[.8,.2,1],c2:[.85,.4,1],c3:[.9,.6,1],c4:[.95,.8,1],c5:[1,.95,1]}},{name:"Forest",isMonotonic:!0,params:{type:"gradient",c1:[.02,.03,.01],c2:[.05,.12,.04],c3:[.1,.35,.15],c4:[.3,.65,.3],c5:[.7,.95,.6]},hdrParams:{type:"gradient",c1:[.3,1,.2],c2:[.5,1,.4],c3:[.7,1,.55],c4:[.85,1,.75],c5:[.95,1,.9]}},{name:"Sunset",isMonotonic:!1,params:{type:"cosine",a:[.5,.3,.2],b:[.5,.4,.3],c:[1,1,.5],d:[0,.1,.2]}},{name:"Electric",isMonotonic:!1,params:{type:"cosine",a:[.5,.5,.5],b:[.6,.6,.6],c:[1,1,1],d:[.3,.2,.2]}}],w=p.length;function ie(i,e){const t=p[i%p.length];return e&&t.hdrParams?t.hdrParams:t.params}function ne(i){return p[i%p.length]}function ae(i){return p[i%p.length].name}const se=`// WebGPU Shader for Mandelbrot Set with HDR support
// Version 2: Palette parameters passed from TypeScript (no branching)

struct Uniforms {
  resolution: vec2f,
  center: vec2f,
  zoom: f32,
  maxIterations: i32,
  time: f32,
  colorOffset: f32,
  fractalType: i32,
  juliaC: vec2f,
  hdrEnabled: i32,
  hdrBrightnessBias: f32, // -1 to +1: shifts which iteration ranges are bright
  // Palette parameters
  paletteType: i32,      // 0 = cosine, 1 = gradient
  isMonotonic: i32,      // 0 = cycling, 1 = monotonic
  // Cosine palette: color = a + b * cos(2π * (c * t + d))
  paletteA: vec3f,
  _pad1: f32,
  paletteB: vec3f,
  _pad2: f32,
  paletteC: vec3f,
  _pad3: f32,
  paletteD: vec3f,
  _pad4: f32,
  // Gradient palette: 5 color stops
  gradientC1: vec3f,
  _pad5: f32,
  gradientC2: vec3f,
  _pad6: f32,
  gradientC3: vec3f,
  _pad7: f32,
  gradientC4: vec3f,
  _pad8: f32,
  gradientC5: vec3f,
  _pad9: f32,
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
    return gradientColor(t, u.gradientC1, u.gradientC2, u.gradientC3, u.gradientC4, u.gradientC5);
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
    z = pos;
    c = u.juliaC;
  } else if (isPhoenix) {
    // Phoenix: z starts at pixel (Julia-style), use classic parameters
    z = pos;
    c = vec2f(0.5667, -0.5); // Classic Phoenix (p, q)
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
      // Base Phoenix: c = pixel position = (p, q) for parameter exploration
      // Julia Phoenix: c = juliaC = (p, q) for fixed parameters
      // In both cases, c.x = p, c.y = q
      let p = c.x;
      let q = c.y;
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
`,oe=256,re=512,le=4096,ce=640,he=1.65,E=1.5;function H(i,e=!1){const t=Math.max(1,i),n=Math.log10(t),o=e?re:oe,r=o+ce*Math.pow(n,he);return Math.round(Math.max(o,Math.min(le,r)))}const D=256;class T{constructor(e,t){s(this,"renderer");s(this,"viewState");s(this,"inputHandler");s(this,"pipeline");s(this,"uniformBuffer");s(this,"bindGroup");s(this,"maxIterationsOverride",null);s(this,"fractalType",d.Mandelbrot);s(this,"juliaC",[-.7,.27015]);s(this,"juliaPickerMode",!1);s(this,"savedViewState",null);s(this,"savedFractalType",null);s(this,"paletteIndex",4);s(this,"colorOffset",0);s(this,"hdrBrightnessBias",0);s(this,"debugOverlay",null);s(this,"shareNotification",null);s(this,"helpOverlay",null);s(this,"helpVisible",!1);s(this,"screenshotMode",!1);s(this,"handleResize",()=>{this.renderer.resize(window.innerWidth,window.innerHeight),this.render()});s(this,"handleHashChange",()=>{this.loadBookmark()});this.renderer=e,this.viewState=new U,this.inputHandler=new G(t,this.viewState,()=>{this.render()}),this.setupInputCallbacks(),this.setupOverlays(t)}static async create(e){const t=await S.create(e),n=new T(t,e);return await n.initializePipeline(),t.setOnHdrChange(()=>{console.log("HDR status changed, re-rendering..."),n.render()}),window.addEventListener("resize",n.handleResize),window.addEventListener("hashchange",n.handleHashChange),n.loadBookmark(),n.handleResize(),n}async initializePipeline(){const e=this.renderer.device,t=e.createShaderModule({label:"Mandelbrot Shader",code:se});this.uniformBuffer=e.createBuffer({label:"Uniforms",size:D,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});const n=e.createBindGroupLayout({label:"Bind Group Layout",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]});this.bindGroup=e.createBindGroup({label:"Bind Group",layout:n,entries:[{binding:0,resource:{buffer:this.uniformBuffer}}]});const o=e.createPipelineLayout({label:"Pipeline Layout",bindGroupLayouts:[n]});this.pipeline=e.createRenderPipeline({label:"Mandelbrot Pipeline",layout:o,vertex:{module:t,entryPoint:"vertexMain"},fragment:{module:t,entryPoint:"fragmentMain",targets:[{format:this.renderer.format}]},primitive:{topology:"triangle-list"}}),console.log("WebGPU pipeline initialized")}setupInputCallbacks(){this.inputHandler.setIterationAdjustCallback(e=>{this.adjustMaxIterations(e)}),this.inputHandler.setIterationResetCallback(()=>{this.clearMaxIterationsOverride()}),this.inputHandler.setPaletteCycleCallback(e=>{this.cyclePalette(e)}),this.inputHandler.setColorOffsetCallback(e=>{this.adjustColorOffset(e)}),this.inputHandler.setColorOffsetResetCallback(()=>{this.resetColorOffset()}),this.inputHandler.setToggleAACallback(()=>{console.log("AA not available in WebGPU HDR mode")}),this.inputHandler.setToggleHDRCallback(()=>{this.toggleHDR()}),this.inputHandler.setAdjustHdrBrightnessCallback(e=>{this.adjustHdrBrightness(e)}),this.inputHandler.setResetHdrBrightnessCallback(()=>{this.resetHdrBrightness()}),this.inputHandler.setFractalCycleCallback(e=>{this.cycleFractalType(e)}),this.inputHandler.setToggleJuliaModeCallback(()=>{this.toggleJuliaPickerMode()}),this.inputHandler.setJuliaPickCallback((e,t)=>{this.pickJuliaConstant(e,t)}),this.inputHandler.setShareCallback(()=>{this.shareBookmark()}),this.inputHandler.setLocationSelectCallback(e=>{this.goToLocation(e)}),this.inputHandler.setToggleHelpCallback(()=>{this.toggleHelp()}),this.inputHandler.setToggleScreenshotModeCallback(()=>{this.toggleScreenshotMode()})}setupOverlays(e){const t=e.parentElement;t&&(this.debugOverlay=document.createElement("div"),this.debugOverlay.id="zoom-debug",t.appendChild(this.debugOverlay),this.shareNotification=document.createElement("div"),this.shareNotification.id="share-notification",this.shareNotification.style.cssText=`
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
    `,t.appendChild(this.helpOverlay))}render(){const e=this.renderer.device,t=this.renderer.canvas,n=z(this.fractalType),o=this.maxIterationsOverride??H(this.viewState.zoom,n);if(this.debugOverlay&&!this.screenshotMode){const b=this.viewState.zoom,L=b>=1e6?b.toExponential(2):b<1?b.toPrecision(4):String(Math.round(b)),J=this.maxIterationsOverride!==null?" (manual)":"",_=ae(this.paletteIndex),j=q[this.fractalType],Y=this.renderer.hdrEnabled?Math.abs(this.hdrBrightnessBias)>.01?`HDR (${this.hdrBrightnessBias>0?"+":""}${this.hdrBrightnessBias.toFixed(2)})`:"HDR":this.renderer.displaySupportsHDR?"HDR available":"SDR",k=this.juliaPickerMode?"🎯 Pick Julia point":"",I=n?`c=(${this.juliaC[0].toFixed(4)}, ${this.juliaC[1].toFixed(4)})`:"",O=Math.abs(this.colorOffset)>.001?`offset ${this.colorOffset.toFixed(1)}`:"",g=[j,`zoom ${L}`,`iterations ${o}${J}`,_];O&&g.push(O),I&&g.push(I),g.push(Y),k&&g.push(k),g.push("H = help"),this.debugOverlay.textContent=g.join("  ·  ")}const r=new ArrayBuffer(D),a=new Float32Array(r),c=new Int32Array(r),u=ne(this.paletteIndex),l=ie(this.paletteIndex,this.renderer.hdrEnabled);a[0]=t.width,a[1]=t.height,a[2]=this.viewState.centerX,a[3]=this.viewState.centerY,a[4]=this.viewState.zoom,c[5]=o,a[6]=performance.now()*.001,a[7]=this.colorOffset,c[8]=this.fractalType,a[10]=this.juliaC[0],a[11]=this.juliaC[1],c[12]=this.renderer.hdrEnabled?1:0,a[13]=this.hdrBrightnessBias,c[14]=l.type==="cosine"?0:1,c[15]=u.isMonotonic?1:0,l.type==="cosine"&&(a[16]=l.a[0],a[17]=l.a[1],a[18]=l.a[2],a[20]=l.b[0],a[21]=l.b[1],a[22]=l.b[2],a[24]=l.c[0],a[25]=l.c[1],a[26]=l.c[2],a[28]=l.d[0],a[29]=l.d[1],a[30]=l.d[2]),l.type==="gradient"&&(a[32]=l.c1[0],a[33]=l.c1[1],a[34]=l.c1[2],a[36]=l.c2[0],a[37]=l.c2[1],a[38]=l.c2[2],a[40]=l.c3[0],a[41]=l.c3[1],a[42]=l.c3[2],a[44]=l.c4[0],a[45]=l.c4[1],a[46]=l.c4[2],a[48]=l.c5[0],a[49]=l.c5[1],a[50]=l.c5[2]),e.queue.writeBuffer(this.uniformBuffer,0,r);const v=e.createCommandEncoder(),y=this.renderer.getCurrentTexture().createView(),x=v.beginRenderPass({colorAttachments:[{view:y,clearValue:{r:0,g:0,b:0,a:1},loadOp:"clear",storeOp:"store"}]});x.setPipeline(this.pipeline),x.setBindGroup(0,this.bindGroup),x.draw(3),x.end(),e.queue.submit([v.finish()])}start(){this.renderer.start(()=>this.render())}stop(){this.renderer.stop()}adjustMaxIterations(e){const t=z(this.fractalType),n=this.maxIterationsOverride??H(this.viewState.zoom,t),o=e>0?n*E:n/E;this.maxIterationsOverride=Math.round(Math.max(1,o)),this.render()}clearMaxIterationsOverride(){this.maxIterationsOverride=null,this.render()}toggleHDR(){console.log(`HDR is ${this.renderer.hdrEnabled?"enabled":"not available"}`),this.render()}adjustHdrBrightness(e){this.renderer.hdrEnabled&&(this.hdrBrightnessBias=Math.max(-1,Math.min(1,this.hdrBrightnessBias+e*.1)),this.render())}resetHdrBrightness(){this.hdrBrightnessBias=0,this.render()}cyclePalette(e){this.paletteIndex=(this.paletteIndex+e+w)%w,this.render()}adjustColorOffset(e){this.colorOffset+=e,this.render()}resetColorOffset(){this.colorOffset=0,this.render()}cycleFractalType(e=1){const o=((P(this.fractalType)>>1)+e+R)%R;this.fractalType=o<<1,this.juliaPickerMode&&(this.juliaPickerMode=!1,this.inputHandler.setJuliaPickerMode(!1)),this.render()}toggleJuliaPickerMode(){if(z(this.fractalType)){this.exitJuliaMode();return}this.juliaPickerMode=!this.juliaPickerMode,this.inputHandler.setJuliaPickerMode(this.juliaPickerMode),this.render()}pickJuliaConstant(e,t){this.juliaPickerMode&&(this.savedViewState={centerX:this.viewState.centerX,centerY:this.viewState.centerY,zoom:this.viewState.zoom},this.savedFractalType=this.fractalType,this.juliaC=[e,t],this.fractalType=$(this.fractalType),this.viewState.centerX=0,this.viewState.centerY=0,this.viewState.zoom=.5,this.juliaPickerMode=!1,this.inputHandler.setJuliaPickerMode(!1),this.render())}exitJuliaMode(){this.savedViewState&&(this.viewState.centerX=this.savedViewState.centerX,this.viewState.centerY=this.savedViewState.centerY,this.viewState.zoom=this.savedViewState.zoom,this.savedViewState=null),this.savedFractalType!==null?(this.fractalType=this.savedFractalType,this.savedFractalType=null):this.fractalType=P(this.fractalType),this.juliaPickerMode=!1,this.inputHandler.setJuliaPickerMode(!1),this.render()}getBookmarkState(){return{fractalType:this.fractalType,centerX:this.viewState.centerX,centerY:this.viewState.centerY,zoom:this.viewState.zoom,paletteIndex:this.paletteIndex,colorOffset:this.colorOffset,juliaC:this.juliaC,maxIterationsOverride:this.maxIterationsOverride,aaEnabled:!1}}loadBookmark(){const e=K();e&&(e.centerX!==void 0&&(this.viewState.centerX=e.centerX),e.centerY!==void 0&&(this.viewState.centerY=e.centerY),e.zoom!==void 0&&(this.viewState.zoom=e.zoom),e.maxIterationsOverride!==void 0&&(this.maxIterationsOverride=e.maxIterationsOverride),e.paletteIndex!==void 0&&(this.paletteIndex=e.paletteIndex%w),e.colorOffset!==void 0&&(this.colorOffset=e.colorOffset),e.fractalType!==void 0&&(this.fractalType=e.fractalType),e.juliaC!==void 0&&(this.juliaC=e.juliaC),this.render())}goToLocation(e){const t=te(e);if(!t)return;const n=t.state;this.viewState.centerX=n.centerX,this.viewState.centerY=n.centerY,this.viewState.zoom=n.zoom,this.maxIterationsOverride=n.maxIterationsOverride,this.fractalType=n.fractalType,this.juliaC=n.juliaC,this.paletteIndex=n.paletteIndex,this.colorOffset=n.colorOffset,this.updateUrlBookmark(),this.render()}updateUrlBookmark(){Z(this.getBookmarkState())}async shareBookmark(){const e=await Q(this.getBookmarkState());this.showShareNotification(e),e&&this.updateUrlBookmark()}showShareNotification(e){this.shareNotification&&(this.shareNotification.textContent=e?"📋 Link copied to clipboard!":"❌ Failed to copy link",this.shareNotification.style.color=e?"#4ade80":"#f87171",this.shareNotification.style.opacity="1",setTimeout(()=>{this.shareNotification&&(this.shareNotification.style.opacity="0")},2e3))}toggleHelp(){this.helpVisible=!this.helpVisible,this.helpOverlay&&(this.helpOverlay.style.opacity=this.helpVisible?"1":"0",this.helpOverlay.style.pointerEvents=this.helpVisible?"auto":"none")}toggleScreenshotMode(){this.screenshotMode=!this.screenshotMode,this.screenshotMode&&this.helpVisible&&(this.helpVisible=!1,this.helpOverlay&&(this.helpOverlay.style.opacity="0",this.helpOverlay.style.pointerEvents="none")),this.debugOverlay&&(this.debugOverlay.style.display=this.screenshotMode?"none":"block"),this.shareNotification&&(this.shareNotification.textContent=this.screenshotMode?"📷 Screenshot mode (Space to exit)":"📷 UI restored",this.shareNotification.style.color="#60a5fa",this.shareNotification.style.opacity="1",setTimeout(()=>{this.shareNotification&&(this.shareNotification.style.opacity="0")},1e3))}createHelpContent(){return`
      <h2 style="margin: 0 0 16px 0; color: #60a5fa; font-size: 20px; font-weight: 600;">
        🌀 Fractal Explorer (WebGPU HDR) - Keyboard Shortcuts
      </h2>
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px 32px;">
        <div style="margin-bottom: 12px;">
          <h3 style="margin: 0 0 8px 0; color: #a78bfa; font-size: 13px; text-transform: uppercase;">Navigation</h3>
          <div style="display: grid; gap: 4px;">
            ${this.helpRow("Drag","Pan view")}
            ${this.helpRow("Scroll","Zoom in/out")}
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
            ${this.helpRow("C / Shift+C","Cycle palettes")}
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
          <h3 style="margin: 0 0 8px 0; color: #a78bfa; font-size: 13px; text-transform: uppercase;">HDR Brightness</h3>
          <div style="display: grid; gap: 4px;">
            ${this.helpRow("B","More bright (extend)")}
            ${this.helpRow("Shift+B","Less bright (contract)")}
            ${this.helpRow("D","Reset brightness")}
          </div>
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
    `}destroy(){this.stop(),window.removeEventListener("resize",this.handleResize),window.removeEventListener("hashchange",this.handleHashChange),this.debugOverlay?.remove(),this.shareNotification?.remove(),this.helpOverlay?.remove(),this.inputHandler.destroy(),this.renderer.destroy()}}console.log("Fractal Explorer - Initializing...");let C=null;async function A(){const i=document.getElementById("app");if(!i){console.error("Could not find #app element");return}if(!S.isSupported()){i.innerHTML=`
      <div style="color: white; text-align: center; padding: 40px; font-family: system-ui, sans-serif;">
        <h1>WebGPU Not Supported</h1>
        <p>This application requires WebGPU, which is not available in your browser.</p>
        <p style="margin-top: 20px; color: #888;">
          Please use a modern browser with WebGPU support:<br>
          Chrome 113+, Edge 113+, or Firefox Nightly with WebGPU enabled.
        </p>
      </div>
    `;return}const e=document.createElement("canvas");e.id="fractal-canvas",i.appendChild(e);try{C=await T.create(e),C.start(),console.log("Fractal Explorer initialized successfully"),console.log("Controls:"),console.log("  - Drag to pan"),console.log("  - Scroll to zoom"),console.log("  - Double-click to zoom in"),console.log("  - Touch drag to pan (mobile)"),console.log("  - Pinch to zoom (mobile)"),console.log("  - + / - to adjust max iterations"),console.log("  - 0 to reset iterations to auto-scaling"),console.log("  - c / C to cycle color palettes (forward/backward)"),console.log("  - , / . to shift colors (fine)"),console.log("  - < / > to shift colors (coarse)"),console.log("  - b / B to adjust HDR brightness"),console.log("  - d to reset HDR brightness"),console.log("  - s to share/copy bookmark URL"),console.log("  - 1-9 to visit famous locations"),console.log("  - h to toggle help overlay"),console.log("  - Space to toggle screenshot mode")}catch(t){console.error("Failed to initialize Fractal Explorer:",t),i.innerHTML=`
      <div style="color: white; text-align: center; padding: 20px; font-family: system-ui, sans-serif;">
        <h1>Initialization Error</h1>
        <p>Failed to initialize the application.</p>
        <pre style="text-align: left; margin-top: 20px; color: #ff6b6b;">${t instanceof Error?t.message:String(t)}</pre>
      </div>
    `}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>A()):A();window.addEventListener("beforeunload",()=>{C&&C.destroy()});
//# sourceMappingURL=index-De7bAzpK.js.map
