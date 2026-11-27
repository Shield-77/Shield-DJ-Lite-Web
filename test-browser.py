# SPDX-License-Identifier: GPL-3.0-only
from pathlib import Path
from playwright.sync_api import sync_playwright
import json, tempfile, subprocess, os
fixture=Path(tempfile.mkdtemp(prefix="shield-test-"))
for fmt,codec,freq in [("mp3","libmp3lame",440),("ogg","libvorbis",660)]:
 subprocess.run(["ffmpeg","-v","error","-f","lavfi","-i",f"sine=frequency={freq}:sample_rate=44100:duration=5","-ac","2","-c:a",codec,"-y",str(fixture/("shield_format."+fmt))],check=True)
f=Path(__file__).resolve().with_name('index.html');errors=[];r={}
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH','/usr/bin/chromium'),headless=True,args=['--no-sandbox','--disable-dev-shm-usage','--mute-audio','--autoplay-policy=no-user-gesture-required']);p=b.new_page(viewport={'width':1536,'height':791});p.set_default_timeout(6000);p.on('pageerror',lambda e:errors.append(str(e)));p.set_content(f.read_text())
 p.evaluate('''()=>{const bytes=new Uint8Array(16044),d=new DataView(bytes.buffer);bytes.set([82,73,70,70],0);d.setUint32(4,16036,true);bytes.set([87,65,86,69,102,109,116,32],8);d.setUint32(16,16,true);d.setUint16(20,1,true);d.setUint16(22,1,true);d.setUint32(24,8000,true);d.setUint32(28,16000,true);d.setUint16(32,2,true);d.setUint16(34,16,true);bytes.set([100,97,116,97],36);d.setUint32(40,16000,true);importFiles(Array.from({length:100},(_,i)=>new File([bytes],'Test '+String(i).padStart(3,'0')+'.wav',{type:'audio/wav',lastModified:1700000000000+i*86400000}))) }''');assert p.evaluate('tracks.length===100 && filtered[0]===99 && audio.paused');r['import_sort_100']=True
 q=p.evaluate('''()=>{let a=[current];for(let i=1;i<100;i++){startNext(false);a.push(current)}const last=current;startNext(false);return {unique:new Set(a).size,noBoundaryRepeat:current!==last}}''');print(q,flush=True);assert q['unique']==100 and q['noBoundaryRepeat'];r['shuffle']=q
 r['viewport']=[]
 for w,h in [(1536,791),(1366,768),(1280,720),(1366,625),(1024,600)]:
  p.set_viewport_size({'width':w,'height':h});p.wait_for_timeout(40)
  v=p.evaluate('''()=>({pageHeight:document.documentElement.scrollHeight,pageWidth:document.documentElement.scrollWidth,viewportHeight:innerHeight,viewportWidth:innerWidth,panels:[...document.querySelectorAll('.panel')].map(e=>({label:e.getAttribute('aria-label'),lastBottom:Math.round(e.lastElementChild.getBoundingClientRect().bottom),bottom:Math.round(e.getBoundingClientRect().bottom)}))})''')
  r['viewport'].append(v);assert v['pageHeight']<=h and v['pageWidth']<=w and all(x['lastBottom']<=x['bottom'] for x in v['panels']),v
 p.set_viewport_size({'width':1536,'height':791});r['formats']={}
 for fmt in ['mp3','ogg']:
  p.locator('#fileInput').set_input_files(str(fixture/('shield_format.'+fmt)));p.wait_for_function('tracks.length===1');p.locator('#play').click();p.wait_for_function('!audio.paused && audio.currentTime>.15 && ctx.state==="running"');p.locator('#remix').select_option('6');p.wait_for_function('effectiveRate()===0 && (!!graph.rateNode || !!graph.rateScriptConnected)');assert p.locator('#qualityVal').inner_text()=='ORIGINALE';r['formats'][fmt]=p.evaluate('({engine:metrics.rateEngine,events:graph.remixCore?.events??null,rate:effectiveRate(),mediaError:audio.error?.code||null})');assert r['formats'][fmt]['mediaError'] is None
  p.locator('#remix').select_option('5');assert p.evaluate('p.remix===5');p.locator('#stop').click();p.locator('#reset').click()
 p.locator('#speedReset').click();p.locator('body').click(position={'x':5,'y':5});p.keyboard.press('h');assert p.evaluate('p.remix===6 && effectiveRate()===0');p.keyboard.press('h');assert p.evaluate('p.remix===0');r['shortcut']=True
 p.locator('#remix').select_option('6');p.locator('#quality').select_option('15');p.locator('#speedReset').click();p.keyboard.press('ArrowUp');assert p.evaluate('p.remix===6 && effectiveRate()===7000');r['quality_arrow']=True
 p.locator('#speedReset').click();p.locator('#pitchPlus').click();assert p.evaluate('audio.playbackRate===1.025 && p.speed===1.025');assert p.locator('#speedVal').inner_text()=='1.025×';p.keyboard.press('ArrowRight');assert p.evaluate('p.speed===1.05');p.keyboard.press('Shift+ArrowLeft');assert p.evaluate('p.speed===1.025');p.locator('#speedReset').click();assert p.evaluate('audio.playbackRate===1 && p.speed===1');p.locator('#speed').evaluate("el=>{el.value='1.013';el.dispatchEvent(new Event('input',{bubbles:true}))}");assert p.evaluate('p.speed===1.013');p.locator('#pitchPlus').click();assert p.evaluate('p.speed===1.038');assert p.locator('#crush').count()==0 and p.locator('#reset').count()==1;p.locator('#reset').click();assert p.evaluate('p.speed===1');r['pitch_grid']=True
 p.locator('#reverb').select_option('4');assert p.locator('#freeRoom').is_visible();p.locator('#roomSeconds').select_option('5');p.locator('#roomTone').select_option('2');p.locator('#roomPre').select_option('100');p.locator('#wet').evaluate("el=>{el.value='100';el.dispatchEvent(new Event('input',{bubbles:true}))}");assert p.evaluate('roomSettings(p).secs===5 && roomSettings(p).dry===0 && roomSettings(p).pr.pre===.1');r['free_room']=True
 p.locator('#reset').click();assert p.evaluate('p.remix===0 && p.quality===0 && p.roomSeconds===1.78 && p.roomTone===1 && p.roomPre===18 && p.wet===50');assert not p.locator('#freeRoom').is_visible();r['reset']=True
 p.evaluate("p.shuffle=false;syncUI()")
 Path(str(fixture/'shield_bad.mp3')).write_bytes(b'Not a valid MPEG audio file')
 p.locator('#fileInput').set_input_files([str(fixture/'shield_bad.mp3'),str(fixture/'shield_format.mp3')])
 p.wait_for_function('tracks.length===2 && current===1 && failed.size===1');assert p.evaluate('audio.paused && !playWanted');r['corrupt_import_skips_without_autoplay']=True
 p.locator('#play').click();p.wait_for_function('!audio.paused && audio.currentTime>.15');r['valid_mp3_after_corrupt']=True
 p.evaluate('choose(0)');p.wait_for_function('current===1 && !audio.paused && failed.has(0)');r['corrupt_during_play_skips']=True
 p.locator('#stop').click();p.locator('#fileInput').set_input_files(str(fixture/'shield_bad.mp3'));p.wait_for_function('stopped && failed.size===1');assert p.evaluate('audio.paused && !playWanted');r['all_corrupt_stops']=True
 p.locator('#fileInput').set_input_files(str(fixture/'shield_format.mp3'));p.locator('#play').click();p.wait_for_function('!audio.paused && audio.currentTime>.1');p.locator('#eq').select_option('1');p.wait_for_timeout(300)
 r['rock']=p.evaluate('''()=>{const f=new Float32Array([60,105,320,1550,3400,7600,12000]),v=new Float32Array(f.length).fill(graph.eqHead.gain.value),a=new Float32Array(f.length),phase=new Float32Array(f.length);for(const n of [graph.low,graph.punch,graph.mud,graph.mid,graph.attack,graph.harsh,graph.high]){n.getFrequencyResponse(f,a,phase);for(let i=0;i<f.length;i++)v[i]*=a[i]}return {frequencies:Array.from(f),db:Array.from(v,x=>20*Math.log10(x)),headroom:graph.eqHead.gain.value,ratio:graph.comp.ratio.value}}''');assert r['rock']['db'][3]>r['rock']['db'][2] and r['rock']['headroom']<1
 p.locator('body').click(position={'x':5,'y':5});p.keyboard.press('f');p.wait_for_function('!!document.fullscreenElement');p.keyboard.press('f');p.wait_for_function('!document.fullscreenElement');r['fullscreen_f']=True
 p.locator('#search').fill('');p.locator('#search').focus();p.keyboard.press('f');assert not p.evaluate('!!document.fullscreenElement');r['fullscreen_does_not_intercept_search']=True
 p.locator('#stop').click()
 p.screenshot(path=str(fixture/'preview.png'));b.close()
assert not errors,errors
report={'environment':'Chromium headless injected HTML; synthetic MP3/OGG and invalid MP3; no physical audio','tests':r,'pageErrors':errors};Path(__file__).resolve().with_name('BROWSER-TESTS.json').write_text(json.dumps(report,indent=2));print(json.dumps(report,indent=2))
