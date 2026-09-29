import { Rive, RuntimeLoader, Layout, Fit } from '@rive-app/canvas';
RuntimeLoader.setWasmUrl('/node_modules/@rive-app/canvas/rive.wasm');
const q = new URLSearchParams(location.search);
const root = document.querySelector('main');
const variants = [];
const modes = q.has('mode') ? [q.get('mode')] : ['romance', 'heist', 'survival'];
for (const mode of modes) for (const sex of (q.has('sex')?[q.get('sex')]:['man', 'woman'])) {
  if (q.has('wardrobe')) {
    for (let top=0; top<3; top++) for (let bottom=0; bottom<(sex==='man'?3:5); bottom++) variants.push({mode,sex,top,bottom,blend:Number(q.get('blend') ?? 1)});
  } else if (q.has('steps')) {
    for (const blend of [0,.25,.5,.75,1]) variants.push({mode,sex,top:Number(q.get('top')??0),bottom:0,blend});
  } else variants.push({mode,sex,top:0,bottom:0,blend:1});
}
if (q.has('steps')) root.style.gridTemplateColumns='repeat(5,200px)';
if (!q.has('steps') && !q.has('wardrobe')) {
  variants.sort((a,b)=>a.sex.localeCompare(b.sex));
  root.style.gridTemplateColumns='repeat(3,300px)';
}
let ready=0;
root.dataset.expected=String(variants.length);
const buffer=await (await fetch('/rive/compliance-characters.riv?v=drift-review')).arrayBuffer();
for(const v of variants) {
  let elapsed=0;
  const canvas=document.createElement('canvas'); canvas.width=400;canvas.height=640;
  if (!q.has('steps') && !q.has('wardrobe')) { canvas.style.width='300px'; canvas.style.height='480px'; }
  Object.assign(canvas.dataset, v); root.append(canvas);
  const r=new Rive({buffer:buffer.slice(0),canvas,artboard:`generic-${v.sex}`,stateMachines:q.has('timeline')?undefined:'State Machine 1',autoBind:false,autoplay:!q.has('timeline'),
    layout:new Layout({fit:Fit.Contain}),onAdvance(event){
      elapsed+=event.data;
      if(q.has('time') && elapsed>=Number(q.get('time'))) r.pause();
      if(q.has('timeline') && elapsed>=Math.max(.001,v.blend)) r.pause();
    },onLoad(){
      const vm=r.viewModelByName('CharacterData').instanceByName(v.sex==='man'?'Instance':'Instance 1'); r.bindViewModelInstance(vm);
      for(const [key,value] of Object.entries({numberProperty:v.mode==='romance'?v.blend:0,heistDrift:v.mode==='heist'?v.blend:0,survivalDrift:v.mode==='survival'?v.blend:0,topId:v.top,bottomId:v.bottom,sitAmount:q.has('front')?1:0,sideSitAmount:q.has('profile')?1:q.has('sit')?-1:0})) {
        const prop=vm.number(key); if(!prop)throw new Error(`Missing rig property: ${key}`); prop.value=value;
      }
      const palette=q.has('palette')?{skinColor:q.get('palette')==='dark'?'#442b25':'#f0d5bf',hairColor:'#492f8c',hairAccentColor:'#b294e7',eyeColor:'#4ca487',outfitPrimaryColor:'#9b594b',pantsColor:'#486579'}:{};
      for(const [key,hex]of Object.entries(palette))vm.color(key).rgb(...hex.slice(1).match(/../g).map(x=>parseInt(x,16)));
      if(q.has('action')) {
        r.play(q.get('action'));
      }
      if(q.has('timeline')) r.play(q.get('timeline'));
      root.dataset.ready=String(++ready);
    },onLoadError(){root.dataset.error='load';}});
}
