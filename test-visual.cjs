/* SPDX-License-Identifier: GPL-3.0-only */
const fs=require('node:fs'),path=require('node:path');
function testVisual(html){
const a=html.indexOf('// VISUAL STUDIO:'),b=html.indexOf("$('visualMode').addEventListener",a);
const bytes=Uint8Array.from([137,80,78,71,13,10,26,10,0,0,0,0]);
const mime=Array.from('image/png',c=>c.charCodeAt(0));
const picture=Uint8Array.from([0,0,0,3,0,0,0,9,...mime,0,0,0,0,...new Array(16).fill(0),0,0,0,12,...bytes]);
const payload=[0,...mime,0,3,0,...bytes],n=payload.length;
const id3=Uint8Array.from([73,68,51,3,0,0,0,0,0,n+10,65,80,73,67,0,0,0,n,0,0,...payload]);
const flac=Uint8Array.from([102,76,97,67,134,0,0,picture.length,...picture]);
const element=()=>({src:'data:image/webp;base64,logo',style:{},dataset:{mode:'spectrum'},clientHeight:180,clientWidth:320,width:640,height:260,getContext:()=>({clearRect(){},fillRect(){}})});
const elements={},$=id=>elements[id]??(elements[id]=element());
let queued=0,connected=0,disconnected=0;
const graph={gate:{connect(){connected++},disconnect(){disconnected++}}},ctx={state:'running',sampleRate:48000,createAnalyser(){return {frequencyBinCount:1024,getFloatFrequencyData(a){a.fill(-45)}}}},audio={paused:false,playbackRate:1},document={hidden:false},p={visualMode:'spectrum'},env={graph,ctx,audio,document,p,$,requestAnimationFrame:()=>++queued,cancelAnimationFrame:()=>{},matchMedia:()=>({matches:false})};
const api=new Function('e','const {graph,ctx,audio,document,p,$,requestAnimationFrame,cancelAnimationFrame,matchMedia}=e;let stopped=false;'+html.slice(a,b)+';return {parseCover,coverMime,makeVisualBins,syncVisual,stopVisual,visualTick,visualAllowed,active:()=>visualRunning,angle:()=>visualAngle};')(env);
const checks=[];function check(name,ok){if(!ok)throw Error(name);checks.push(name)}
check('ID3 APIC',api.coverMime(api.parseCover(id3))==='image/png');
check('FLAC PICTURE',api.coverMime(api.parseCover(flac))==='image/png');
check('missing art',api.parseCover(new Uint8Array(20))===null);
check('truncated ID3',api.parseCover(id3.subarray(0,15))===null);
check('bounded FFT bin mapping',api.makeVisualBins(48000,1024).every(([l,h])=>l>=1&&h>l&&h<=1024));
api.syncVisual();check('spectrum connects once',connected===1&&api.active());api.syncVisual();check('no duplicate analyser',connected===1);
api.visualTick(100);check('spectrum tick',api.active());
p.visualMode='shake';api.syncVisual();api.visualTick(200);check('shake transforms cover',$('visualArt').style.transform.includes('scale('));
p.visualMode='vinyl';api.syncVisual();api.visualTick(300);check('vinyl rotates',api.angle()>0&&$('visualArt').style.transform.includes('rotate('));
check('vinyl analyser disconnected',connected===disconnected);
audio.paused=true;api.syncVisual();check('pause cancels animation',!api.active());
audio.paused=false;p.visualMode='static';api.syncVisual();check('static no processing',!api.active()&&connected===disconnected);
p.visualMode='spectrum';document.hidden=true;api.syncVisual();check('hidden tab no processing',!api.active());
document.hidden=false;api.syncVisual();check('resume connects',api.active()&&connected===disconnected+1);
api.stopVisual();check('stop disconnects',!api.active()&&connected===disconnected);
return checks;
}
if(typeof require!=='undefined'&&typeof module!=='undefined'&&require.main===module)console.log('PASS',testVisual(fs.readFileSync(path.join(__dirname,'index.html'),'utf8')));
