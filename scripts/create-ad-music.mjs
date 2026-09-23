// Original procedural composition. All sounds synthesized; no samples or recordings.
import { writeFileSync } from 'node:fs';
const rate=48000, seconds=24, length=rate*seconds;
const left=new Float32Array(length), right=new Float32Array(length);
const hz=n=>440*2**((n-69)/12), tau=2*Math.PI;
let seed=47291;
const noise=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2147483648-1;};
function add(start,duration,voice,level=.1,pan=0){
 const offset=Math.round(start*rate), count=Math.round(duration*rate);
 for(let i=0;i<count&&offset+i<length;i++){
  const t=i/rate, fade=Math.min(1,t/.008,(duration-t)/.035);
  const value=voice(t)*level*Math.max(0,fade);
  left[offset+i]+=value*Math.sqrt((1-pan)/2);right[offset+i]+=value*Math.sqrt((1+pan)/2);
 }
}
// 120 BPM: twelve bars, with a soft opening and a resolved ending.
const chords=[[57,60,64,71],[53,57,60,64],[48,55,60,64],[55,59,62,69]];
for(let bar=0;bar<12;bar++){
 const start=bar*2, notes=chords[bar%4];
 for(const [j,n] of notes.entries())add(start,2.5,t=>{
  const f=hz(n), env=Math.min(1,t/.35)*Math.exp(-t/1.5);
  return env*(Math.sin(tau*f*t)+.25*Math.sin(tau*f*1.002*t));
 },.055,(j-1.5)*.4);
 const pattern=[0,2,1,3,2,1,3,2];
 for(let step=0;step<8;step++){
  if(bar===11&&step>3)continue;
  const note=hz(notes[pattern[step]]+12), onset=start+step*.25;
  const pluck=t=>(Math.sin(tau*note*t)+.22*Math.sin(tau*note*2*t))*Math.exp(-t*10);
  add(onset,.65,pluck,.105,step%2?.45:-.45);
  if(onset+.375<23.2)add(onset+.375,.6,pluck,.025,step%2?-.6:.6);
 }
 if(bar>0&&bar<11)for(let beat=0;beat<4;beat++){
  const onset=start+beat*.5;
  add(onset,.35,t=>Math.sin(tau*(48*t+8*(1-Math.exp(-t*35))))*Math.exp(-t*12),.34);
  add(onset,.42,t=>(Math.sin(tau*hz(notes[0]-12)*t)+.16*Math.sin(tau*hz(notes[0])*t))*Math.exp(-t*7),.18);
  if(beat%2)add(onset,.18,t=>noise()*Math.exp(-t*24),.095,.1);
  add(onset+.25,.085,t=>noise()*Math.exp(-t*55),.047,-.25);
 }
}
// Quiet transition accents and a final A-minor resolution.
for(const time of [5,11,17])add(time,.9,t=>Math.sin(tau*(1100*t-220*t*t))*noise()*Math.exp(-t*5),.04,.4);
for(const n of [57,60,64,81])add(22,2,t=>Math.sin(tau*hz(n)*t)*Math.exp(-t*2),.08);
let peak=0;for(let i=0;i<length;i++){
 const fade=Math.min(1,i/rate/.35,(seconds-i/rate)/1.3);
 left[i]*=fade;right[i]*=fade;peak=Math.max(peak,Math.abs(left[i]),Math.abs(right[i]));
}
const gain=.79/peak, wav=Buffer.alloc(44+length*4);
wav.write('RIFF');wav.writeUInt32LE(wav.length-8,4);wav.write('WAVEfmt ',8);wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);wav.writeUInt16LE(2,22);wav.writeUInt32LE(rate,24);wav.writeUInt32LE(rate*4,28);wav.writeUInt16LE(4,32);wav.writeUInt16LE(16,34);wav.write('data',36);wav.writeUInt32LE(length*4,40);
for(let i=0;i<length;i++){wav.writeInt16LE(Math.round(left[i]*gain*32767),44+i*4);wav.writeInt16LE(Math.round(right[i]*gain*32767),46+i*4);}
writeFileSync('static/advertisement/namahnest-tech.wav',wav);
console.log('Created original 24-second stereo synth soundtrack, 120 BPM, peak -2 dBFS.');
