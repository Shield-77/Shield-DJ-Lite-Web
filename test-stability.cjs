// SPDX-License-Identifier: GPL-3.0-only
function runStabilityTests(html){
 const checks=[];function check(name,ok){if(!ok)throw Error(name);checks.push(name)}
 function section(a,b){const x=html.indexOf(a),y=html.indexOf(b,x);if(x<0||y<0)throw Error(a);return html.slice(x,y)}
 class Param{constructor(v=0){this.value=v;this.at=0}cancelScheduledValues(){}setValueAtTime(v,t){this.value=v;this.at=t}setTargetAtTime(v,t){this.value=v;this.at=t}}
 class Node{constructor(){this.edges=new Set();this.gain=new Param();this.parameters=new Map(['rate','mode','intensity','amount'].map(k=>[k,new Param()]));this.port={postMessage(){},close(){}}}connect(n){if(!n)throw Error('missing node');this.edges.add(n);return n}disconnect(n){if(n===undefined){this.edges.clear();return}if(!this.edges.delete(n))throw Error('missing edge')}}
 const ctx={currentTime:1,sampleRate:48000,createScriptProcessor(){const n=new Node();n.bufferSize=8192;return n},createWaveShaper(){return new Node()}},metrics={},p={remix:0,remixAmount:55,crush:0},g={ratePre:new Node(),ratePost:new Node(),rateDry:new Node(),rateWet:new Node(),qualityOut:new Node(),fx:new Node(),rateNode:new Node()},env={ctx,metrics,p,graph:g,worklet:new Node(),hz:0};
 g.ratePre.connect(g.rateNode).connect(g.ratePost);g.qualityOut.connect(env.worklet).connect(g.fx);
 const f=new Function('env','const {ctx,metrics,p}=env;let graph=env.graph,worklet=env.worklet;const performance={now:()=>1};const $=()=>({});const effectiveRate=()=>env.hz;const syncQuality=()=>{},syncRemix=()=>{},updateFallback=()=>{};const ThemeRateCore=class{reset(){}process(a,b,c,d){c.set(a);d.set(b)}};const RemixCore=class{reset(){}process(){}};'+section('function disconnectEdge(','function stepQuality(')+section('function installFallback(','// Native mid/side focus')+';return {updateQuality,resetQuality,recoverWorklets,worklet:()=>worklet};')(env);
 const evt=()=>{const l=new Float32Array(8192),r=new Float32Array(8192),a=new Float32Array(8192);return{playbackTime:ctx.currentTime+.17,inputBuffer:{numberOfChannels:1,getChannelData:()=>a},outputBuffer:{getChannelData:i=>i?r:l}}};
 f.updateQuality();check('worklet dry bypass',g.rateDry.gain.value===1);
 env.hz=6000;f.updateQuality();check('worklet wet enabled',g.rateWet.gain.value===1);
 f.recoverWorklets('forced failure',g);check('recovery selects original audio',g.rateDry.gain.value===1&&g.rateWet.gain.value===0);check('dead worklets removed',!g.rateNode&&!f.worklet());check('fallback routes only once',g.qualityOut.edges.size===1&&g.qualityOut.edges.has(g.fallback));check('fallback connected',g.rateScriptConnected&&g.ratePre.edges.has(g.rateScript));
 const script=g.rateScript;script.onaudioprocess(evt());check('first buffer stays dry',g.rateDry.gain.value===1&&!g.rateUnavailable);script.onaudioprocess(evt());check('second buffer schedules wet at playback time',g.rateWet.gain.value===1&&g.rateWet.gain.at>ctx.currentTime);
 env.hz=0;f.updateQuality();check('disable fades before disconnect',g.rateDry.gain.value===1&&g.rateScriptConnected);ctx.currentTime+=.2;script.onaudioprocess(evt());check('inactive fallback disconnects',!g.rateScriptConnected&&g.ratePre.edges.size===0);
 env.hz=6000;f.updateQuality();check('reenable primes again',g.rateScriptConnected&&g.rateDry.gain.value===1);script.onaudioprocess(evt());script.onaudioprocess(evt());f.resetQuality();check('track reset returns to dry',!g.rateReady&&g.rateWet.gain.value===0);
 script.onaudioprocess({});check('DSP exception fails open',g.rateUnavailable&&g.rateDry.gain.value===1&&!g.rateScript&&script.onaudioprocess===null);
 f.recoverWorklets('duplicate',g);check('duplicate failure ignored',metrics.workletRecoveries===1);
 const fx=new Node(),conv=new Node(),gain=new Node();fx.connect(conv).connect(gain);let attempts=0;Object.defineProperty(conv,'buffer',{set(){attempts++;throw Error('buffer locked')}});const room={conv,gain,timer:null};
 const drop=new Function('graph','clearTimeout',section('function disconnectEdge(','function selectRatePath(')+section('function dropRoom(','function retireRoom(')+';return dropRoom;')({fx},()=>{});
 drop(room);drop(room);check('reverb cleanup idempotent',room.disposed&&attempts===1&&fx.edges.size===0&&conv.edges.size===0);
 return checks;
}
const fs=require('node:fs');const path=require('node:path');const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');new Function(html.slice(html.indexOf('<script>')+8,html.lastIndexOf('</script>')));console.log('PASS',runStabilityTests(html));
