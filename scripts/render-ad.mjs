// Render the advertisement with local Chrome and ffmpeg-static.
import { spawn, execFileSync } from 'node:child_process';
import { once } from 'node:events';
import ffmpeg from 'ffmpeg-static';
import { createServer } from 'node:http';
import { readFile, writeFile, mkdtemp, rename } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
const root=path.resolve('static');
const server=createServer(async(req,res)=>{try{const file=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]));if(!file.startsWith(root+path.sep))throw Error('Invalid path');res.setHeader('Content-Type',file.endsWith('.html')?'text/html':file.endsWith('.js')?'text/javascript':file.endsWith('.woff2')?'font/woff2':file.endsWith('.mp4')?'video/mp4':'application/octet-stream');res.end(await readFile(file));}catch{res.writeHead(404);res.end();}});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base=`http://127.0.0.1:${server.address().port}`;
const profile=await mkdtemp(path.join(tmpdir(),'namahnest-ad-'));
const browser=spawn(process.env.CHROME_PATH||'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',['--headless=new','--autoplay-policy=no-user-gesture-required','--no-first-run','--no-default-browser-check','--disable-background-timer-throttling','--disable-renderer-backgrounding','--remote-debugging-port=9337',`--user-data-dir=${profile}`,'about:blank'],{stdio:'ignore',windowsHide:true});
let socket;
const pause=ms=>new Promise(r=>setTimeout(r,ms));
try{
 let target;for(let i=0;i<60;i++){try{target=(await(await fetch('http://127.0.0.1:9337/json')).json()).find(t=>t.type==='page');if(target)break;}catch{}await pause(200);}
 if(!target)throw Error('Chrome unavailable');socket=new WebSocket(target.webSocketDebuggerUrl);await new Promise((resolve,reject)=>{socket.onopen=resolve;socket.onerror=reject;});let id=0;const pending=new Map();socket.onmessage=e=>{const m=JSON.parse(e.data);if(m.id){const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(m.error):p.resolve(m.result);}};
 const call=(method,params={})=>new Promise((resolve,reject)=>{const n=++id;pending.set(n,{resolve,reject});socket.send(JSON.stringify({id:n,method,params}));});
 const evaluate=async expression=>{const r=await call('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value;};
 await call('Page.enable');await call('Page.navigate',{url:base+'/advertisement/index.html'});
 for(let i=0;i<50;i++){if(await evaluate('!!window.advertisement'))break;await pause(100);}
 await evaluate('document.fonts.ready.then(()=>true)');
 for(const t of [2,8,14,21]){const data=await evaluate(`advertisement.draw(${t});document.querySelector('canvas').toDataURL('image/png').split(',')[1]`);await writeFile(path.join(root,`advertisement/frame-${t}.png`),Buffer.from(data,'base64'));}
 console.log('Rendering 24-second 1080p advertisement…');
 const output=path.join(root,'advertisement/namahnest-ad.mp4');
 {
  const normalized=path.join(root,'advertisement/normalized.mp4');
  const silent=path.join(profile,'silent.mp4');
  const encoder=spawn(ffmpeg,['-y','-loglevel','error','-f','image2pipe','-framerate','30','-i','pipe:0','-vf','format=yuv420p','-c:v','libx264','-preset','veryfast','-crf','18','-t','24',silent],{windowsHide:true,stdio:['pipe','ignore','inherit']});
  const finished=once(encoder,'exit');
  for(let frame=0;frame<720;frame++){
   const png=await evaluate(`advertisement.draw(${frame/30});document.querySelector('canvas').toDataURL('image/jpeg',0.96).split(',')[1]`);
   if(!encoder.stdin.write(Buffer.from(png,'base64')))await once(encoder.stdin,'drain');
   if(frame%180===0)console.log(`Rendered ${frame}/720 frames`);
  }
  encoder.stdin.end();const [code]=await finished;if(code!==0)throw Error('Video encoding failed');
  execFileSync(ffmpeg,['-y','-loglevel','error','-i',silent,'-i',path.join(root,'advertisement/namahnest-tech.wav'),'-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-b:a','192k','-t','24','-movflags','+faststart',normalized],{windowsHide:true});
  await rename(normalized,output);
 }
 const metadata=await evaluate(`new Promise((resolve,reject)=>{const v=document.createElement('video');v.preload='auto';v.src='${base}/advertisement/namahnest-ad.mp4';v.onloadedmetadata=()=>resolve({duration:v.duration,width:v.videoWidth,height:v.videoHeight});v.onerror=()=>reject(Error('Video decode failed'));})`);
 console.log(JSON.stringify({output,...metadata}));if(metadata.width!==1920||metadata.height!==1080||Math.abs(metadata.duration-24)>.5)throw Error('Incorrect video size or duration');
}finally{socket?.close();browser.kill();server.close();}
