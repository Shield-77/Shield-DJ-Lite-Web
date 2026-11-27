/* SPDX-License-Identifier: GPL-3.0-only */
const fs=require('node:fs'),path=require('node:path');
function testVisual(html){
const a=html.indexOf('// VISUAL STUDIO:'),b=html.indexOf("$('vinylExpand').addEventListener",a);
const bytes=Uint8Array.from([137,80,78,71,13,10,26,10,0,0,0,0]);
const mime=Array.from('image/png',c=>c.charCodeAt(0));
const picture=Uint8Array.from([0,0,0,3,0,0,0,9,...mime,0,0,0,0,...new Array(16).fill(0),0,0,0,12,...bytes]);
const payload=[0,...mime,0,3,0,...bytes],n=payload.length;
const id3=Uint8Array.from([73,68,51,3,0,0,0,0,0,n+10,65,80,73,67,0,0,0,n,0,0,...payload]);
const flac=Uint8Array.from([102,76,97,67,134,0,0,picture.length,...picture]);
const element=()=>({src:'data:image/webp;base64,logo',style:{},setAttribute(){},dataset:{mode:'spectrum'},clientHeight:180,clientWidth:320,width:640,height:260,getContext:()=>({clearRect(){},fillRect(){}})});
const elements={},$=id=>elements[id]??(elements[id]=element());
let queued=0,connected=0,disconnected=0;
const graph={gate:{connect(){connected++},disconnect(){disconnected++}}},ctx={state:'running',sampleRate:48000,createAnalyser(){return {fftSize:2048,get frequencyBinCount(){return this.fftSize/2},getFloatFrequencyData(a){a.fill(-45)}}}},audio={paused:false,playbackRate:1,readyState:4},document={hidden:false},p={visualMode:'spectrum'},env={graph,ctx,audio,document,p,$,requestAnimationFrame:()=>++queued,cancelAnimationFrame:()=>{},matchMedia:()=>({matches:false})};
const api=new Function('e','const {graph,ctx,audio,document,p,$,requestAnimationFrame,cancelAnimationFrame,matchMedia}=e;let stopped=false;'+html.slice(a,b)+';return {setVinylExpanded,shakeStep,resetShake,parseCover,coverMime,makeVisualBins,syncVisual,stopVisual,visualTick,visualAllowed,active:()=>visualRunning,angle:()=>visualAngle,fft:()=>visualNode?.fftSize,smoothing:()=>visualNode?.smoothingTimeConstant};')(env);
const checks=[];function check(name,ok){if(!ok)throw Error(name);checks.push(name)}
check('ID3 APIC',api.coverMime(api.parseCover(id3))==='image/png');
check('FLAC PICTURE',api.coverMime(api.parseCover(flac))==='image/png');
check('missing art',api.parseCover(new Uint8Array(20))===null);
check('truncated ID3',api.parseCover(id3.subarray(0,15))===null);
check('bounded FFT bin mapping',api.makeVisualBins(48000,1024).every(([l,h])=>l>=1&&h>l&&h<=1024));
api.syncVisual();check('spectrum connects once',connected===1&&api.active());api.syncVisual();check('no duplicate analyser',connected===1);
api.visualTick(100);check('spectrum tick',api.active());
p.visualMode='shake';api.syncVisual();api.visualTick(200);check('shake transforms cover',$('visualArt').style.transform.includes('scale('));check('shake short unsmoothed FFT',api.fft()===1024&&api.smoothing()===0);
p.visualMode='vinyl';api.syncVisual();api.visualTick(300);check('vinyl rotates at 10 rpm',Math.abs(api.angle()-2)<1e-8&&$('visualArt').style.transform.includes('rotate('));audio.playbackRate=2;api.visualTick(350);check('vinyl follows pitch',Math.abs(api.angle()-8)<1e-8);audio.playbackRate=1;api.setVinylExpanded(true);check('expanded deck',$('visualStage').dataset.expanded==='true');api.setVinylExpanded(false);check('normal deck',$('visualStage').dataset.expanded==='false');
check('vinyl analyser disconnected',connected===disconnected);
audio.paused=true;api.syncVisual();check('pause cancels animation',!api.active());
audio.paused=false;p.visualMode='static';api.syncVisual();check('static no processing',!api.active()&&connected===disconnected);api.setVinylExpanded(true);check('only vinyl expands',$('visualStage').dataset.expanded==='false');
p.visualMode='spectrum';document.hidden=true;api.syncVisual();check('hidden tab no processing',!api.active());
document.hidden=false;api.syncVisual();check('resume connects',api.active()&&connected===disconnected+1);check('spectrum retains FFT and smoothing',api.fft()===2048&&api.smoothing()===.48);
api.stopVisual();check('stop disconnects',!api.active()&&connected===disconnected);
const state={};api.resetShake(state);for(let i=0;i<60;i++)api.shakeStep(state,-100,1/30);
let hit=api.shakeStep(state,-35,1/30);check('strong bass impulse expands artwork',hit.scale>=1.15&&hit.scale<=1.18&&Math.abs(hit.x)<=1);
let after=api.shakeStep(state,-35,1/30);check('elastic rebound',Math.abs(after.x)<Math.abs(hit.x)&&after.scale<hit.scale);
for(let i=0;i<45;i++)after=api.shakeStep(state,-35,1/30);check('steady bass settles without fake shake',after.scale===1&&after.x===0);
for(let i=0;i<60;i++)api.shakeStep(state,-78,1/30);hit=api.shakeStep(state,-55,1/30);check('quieter bass onset still reacts',hit.scale>1.1);
for(let i=0;i<20;i++)after=api.shakeStep(state,-100,1/30);check('silence returns to rest',after.scale===1&&after.x===0);
api.resetShake(state);check('track or pause reset',state.pulse===0&&state.age===1);
api.resetShake(state);for(let i=0;i<30;i++)api.shakeStep(state,-75,1/30);
api.shakeStep(state,-35,1/30);api.shakeStep(state,-75,1/30);api.shakeStep(state,-35,1/30);check('double trigger suppressed within 160 ms',state.age>0);
for(let i=0;i<6;i++)api.shakeStep(state,-75,1/30);hit=api.shakeStep(state,-35,1/30);check('next distinct bass hit triggers',state.age===0&&hit.scale>1.1);
api.resetShake(state);for(let i=0;i<60;i++)api.shakeStep(state,-60,1/60);
api.shakeStep(state,-56,1/60);check('small rise no trigger',state.age>0);api.shakeStep(state,-48,1/60);check('two-frame onset triggers',state.age===0);
return checks;
}
if(typeof require!=='undefined'&&typeof module!=='undefined'&&require.main===module)console.log('PASS',testVisual(fs.readFileSync(path.join(__dirname,'index.html'),'utf8')));
