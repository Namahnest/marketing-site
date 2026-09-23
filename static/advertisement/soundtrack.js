// Original soundtrack for live animation playback.
let audioContext, audioBuffer, activeSource;
async function prepareSoundtrack(){
 audioContext ||= new AudioContext();
 await audioContext.resume();
 if(!audioBuffer){
  const response=await fetch('namahnest-tech.wav');
  if(!response.ok)throw new Error('Unable to load the soundtrack.');
  audioBuffer=await audioContext.decodeAudioData(await response.arrayBuffer());
 }
}
function startSoundtrack(){
 activeSource?.stop();
 activeSource=audioContext.createBufferSource();activeSource.buffer=audioBuffer;
 activeSource.connect(audioContext.destination);
 activeSource.start();
}
function stopSoundtrack(){activeSource?.stop();activeSource=null;}
