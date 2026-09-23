/* Original vector motion graphics. No external services or runtime dependencies. */
const canvas = document.querySelector('canvas'), ctx = canvas.getContext('2d');
const duration = 24, W = 1920, H = 1080;
const mint = '#a3e6bb', white = '#eef1f5', muted = '#9199a8', indigo = '#818cf8';
const clamp = x => Math.max(0, Math.min(1, x));
const ease = x => 1 - Math.pow(1 - clamp(x), 3);
function box(x,y,w,h,color,r=20){ctx.fillStyle=color;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill();}
function text(s,x,y,size=40,color=white,weight=500){ctx.fillStyle=color;ctx.font=`${weight} ${size}px Inter`;ctx.fillText(s,x,y);}
function mark(x,y,scale=1){ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);box(15,0,58,60,indigo,12);box(0,18,64,58,mint,12);ctx.strokeStyle='#11241a';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(27,43);ctx.lineTo(19,50);ctx.lineTo(27,57);ctx.moveTo(39,43);ctx.lineTo(47,50);ctx.lineTo(39,57);ctx.stroke();ctx.restore();}
function label(s,x,y){text(s,x,y,23,mint,600);}
function reveal(t,delay,draw){const a=ease((t-delay)/0.8);ctx.save();ctx.globalAlpha*=a;ctx.translate(0,45*(1-a));draw();ctx.restore();}
function browser(x,y,w,h,kind=0){
 box(x,y,w,h,'#111620',18);box(x,y,w,40,'#1d2533',18);
 for(let i=0;i<3;i++)box(x+18+i*17,y+15,8,8,['#fb7185','#fbbf24',mint][i],4);
 text('namahnest.com',x+w/2-49,y+26,12,muted);
 if(kind===0){box(x+20,y+62,w*.23,h-84,'#151b26',8);for(let i=0;i<6;i++)box(x+35,y+85+i*32,w*.15,7,i===1?indigo:'#354154',3);text('Build something great.',x+w*.3,y+103,w*.039,white,600);text('Your documentation starts here.',x+w*.3,y+135,w*.021,muted);for(let i=0;i<4;i++)box(x+w*.3,y+167+i*23,w*(.5-i*.035),6,'#354154',3);box(x+w*.3,y+h*.66,w*.61,h*.23,'#1a2332',8);text('> hugo server',x+w*.33,y+h*.78,w*.023,mint);}
 else {text(kind===1?'Your next big idea.':'Good work. Great presence.',x+32,y+h*.36,w*.044,white,600);text(kind===1?'Give it a beautiful beginning.':'A home for your ambition.',x+32,y+h*.47,w*.025,muted);box(x+32,y+h*.54,w*.29,34,mint,6);text('Get started',x+45,y+h*.54+23,w*.022,'#11241a',600);for(let i=0;i<3;i++)box(x+32+i*(w-48)/3,y+h*.76,(w-72)/3,h*.15,['#253849','#283c36','#2d2d49'][i],8);}
}
function scene(t,start,end,draw){if(t<start||t>=end)return;ctx.save();ctx.globalAlpha=clamp((t-start)/.35)*clamp((end-t)/.35);draw(t-start);ctx.restore();}
function draw(t){
 ctx.clearRect(0,0,W,H);box(0,0,W,H,'#090d16',0);
 const glow=ctx.createRadialGradient(1300+Math.sin(t*.25)*140,400,10,1200,500,1000);glow.addColorStop(0,'#252743');glow.addColorStop(1,'#090d16');ctx.fillStyle=glow;ctx.fillRect(0,0,W,H);
 ctx.strokeStyle='#ffffff06';ctx.lineWidth=1;for(let x=0;x<W;x+=80){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}for(let y=0;y<H;y+=80){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
 mark(110,70,.65);text('NamahNest',175,108,34,white,650);text('HUGO + TAILWIND',1510,105,22,muted,500);
 scene(t,0,5,s=>{reveal(s,0,()=>label('LESS SETUP. MORE POSSIBILITY.',110,300));reveal(s,.2,()=>{text('Your next website.',110,450,116,white,650);text('A better foundation.',110,595,116,mint,650);});reveal(s,.6,()=>text('Beautiful website kits. Built to make your next move.',115,700,35,muted));reveal(s,.9,()=>{box(115,785,320,65,mint,12);text('Meet NamahNest  →',140,828,26,'#11241a',600);});});
 scene(t,5,11,s=>{reveal(s,0,()=>{label('YOUR SHORTCUT TO SHIPPED.',110,250);text('Start with something beautiful.',110,340,76,white,650);});const names=['Atlas Docs','Launchpad','Mono Studio'],cats=['Documentation','Startup & SaaS','Business & agency'];for(let i=0;i<3;i++)reveal(s,.25+i*.18,()=>{let x=110+i*575,y=425+Math.sin(s*1.1+i)*7;browser(x,y,550,325,i);text(names[i],x,y+385,34,white,600);text(cats[i],x,y+430,25,muted);});});
 scene(t,11,17,s=>{reveal(s,0,()=>{label('A FOUNDATION THAT IS YOURS.',110,280);text('Own your code.',110,395,86,white,650);text('Choose your future.',110,502,86,mint,650);});['One-time kit purchase','Full Hugo & Tailwind source','Deploy to your preferred host'].forEach((v,i)=>reveal(s,.5+i*.35,()=>{box(115,595+i*81,34,34,'#203b30',10);text('✓',122,620+i*81,25,mint);text(v,172,624+i*81,31,white);}));reveal(s,.3,()=>{ctx.save();ctx.translate(1210,410);ctx.rotate(-.035);browser(-160,-80,660,450,0);ctx.restore();box(1180,830,390,63,'#273b32',12);text('No platform lock-in.',1210,872,29,mint,600);});});
 scene(t,17,25,s=>{reveal(s,0,()=>{mark(903,240,1.5);});reveal(s,.2,()=>{ctx.textAlign='center';text('Your next chapter starts here.',960,530,86,white,650);text('Less time setting up. More time making your mark.',960,615,34,muted);ctx.textAlign='left';});reveal(s,.65,()=>{box(695,695,530,91,mint,16);ctx.textAlign='center';text('Explore the website kits  →',960,753,32,'#11241a',650);text('namahnest.com',960,865,48,white,600);ctx.textAlign='left';});});
 box(110,1007,1700,3,'#242b37',1);box(110,1007,1700*clamp(t/duration),3,mint,1);
}
let playing=false, frame;
async function play(){if(playing)return;await prepareSoundtrack();playing=true;startSoundtrack();const start=performance.now();document.querySelector('#play').disabled=true;await new Promise(resolve=>{function tick(now){const t=Math.min(duration,(now-start)/1000);draw(t);if(t<duration)frame=requestAnimationFrame(tick);else resolve();}frame=requestAnimationFrame(tick);});stopSoundtrack();playing=false;document.querySelector('#play').disabled=false;}
document.querySelector('#play').onclick=()=>play().catch(e=>{document.querySelector('#status').textContent=e.message;});
window.advertisement={draw,duration};
document.fonts.ready.then(()=>draw(2));
document.querySelector('#export').onclick=()=>{const a=document.createElement('a');a.href='namahnest-ad.mp4';a.download='namahnest-ad.mp4';a.click();};
