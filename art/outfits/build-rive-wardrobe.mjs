import fs from 'node:fs';

// Converts the approved SVG garment paths to native Rive path commands.
export function commands(d) {
  const t = d.match(/[A-Za-z]|[-+]?(?:\d*\.\d+|\d+)(?:[eE][-+]?\d+)?/g);
  let i=0, x=0, y=0, sx=0, sy=0, op;
  const out=[]; const n=()=>Number(t[i++]);
  while(i<t.length) {
    if(/[A-Za-z]/.test(t[i])) op=t[i++];
    if(op==='M'||op==='L') { x=n();y=n();out.push({commandType:op==='M'?'moveTo':'lineTo',x,y});if(op==='M'){sx=x;sy=y;op='L';} }
    else if(op==='H') {x=n();out.push({commandType:'lineTo',x,y});}
    else if(op==='V') {y=n();out.push({commandType:'lineTo',x,y});}
    else if(op==='Q') {const cx=n(),cy=n(),ex=n(),ey=n();out.push({commandType:'cubicTo',control1X:x+(cx-x)*2/3,control1Y:y+(cy-y)*2/3,control2X:ex+(cx-ex)*2/3,control2Y:ey+(cy-ey)*2/3,endX:ex,endY:ey});x=ex;y=ey;}
    else if(op==='Z') {out.push({commandType:'close'});x=sx;y=sy;op=undefined;}
    else throw new Error(`Unsupported SVG command ${op}`);
  }
  return out;
}

export function build(drafts) {
 const free=[], primitives=[], meta=[];
 const rigs={Man:{torso:'0-391',hips:'0-390',arms:['0-629','0-508'],forearms:['0-630','0-509'],legs:['0-701','0-668'],shins:['0-702','0-669']},Woman:{torso:'0-1771',hips:'0-1770',arms:['0-2055','0-1908'],forearms:['0-2056','0-1909'],legs:['0-2156','0-2119'],shins:['0-2157','0-2120']}};
 const add=(shape,family,character,colorProperty,primitive=false)=>{(primitive?primitives:free).push(shape);meta.push({name:shape.name,parentId:shape.parentId,family,character,colorProperty});};
 for(const character of ['Man','Woman']) {
  const r=rigs[character];
  for(const kind of ['Suit','Casual']) {
   const draft=drafts.find(g=>g.name===character+kind);
   for(const part of draft.parts) {
    const a=part.attrs, short=(a.id??'Button').replace(character+kind+'_','');
    if(/Trouser|Pelvis|Shorts|Jeans/.test(short))continue;
    const side=short.includes('Far')?0:1;
    let parentId=r.torso,x=0,y=13.8333435;
    if(/Sleeve/.test(short)) {parentId=/Lower/.test(short)?r.forearms[side]:r.arms[side];x=side?-58.5:58.5;y=/Lower/.test(short)?(side?-82:-141.6666565):0;}
    let prop=kind==='Suit'?'suitColor':'outfitPrimaryColor';
    if(/Shirt$|Blouse$|Cuffs/.test(short)&&kind==='Suit')prop='outfitSecondaryColor';
    if(/Tie/.test(short))prop='outfitAccentColor';
    if(a.opacity||a.stroke||!a.id)prop=null;
    const alpha=a.opacity??a['stroke-opacity'];
    let color=a.stroke??a.fill??'#14212c';
    if(alpha)color='#'+Math.round(Number(alpha)*255).toString(16).padStart(2,'0')+color.slice(1);
    const shape={name:`Wardrobe_${character}_${kind}_${short}`,parentId,x,y,paints:[{paintType:a.stroke?'stroke':'fill',color,...(a.stroke?{thickness:Number(a['stroke-width']??1)}:{})}]};
    if(part.type==='circle'){Object.assign(shape,{shapeType:'ellipse',x:x+Number(a.cx),y:y+Number(a.cy),width:Number(a.r)*2,height:Number(a.r)*2});add(shape,kind,character,prop,true);}
    else {shape.paths=[{commands:commands(a.d),isClosed:!a.stroke}];add(shape,kind,character,prop);}
   }
  }
  for(const family of ['SuitLegs','Shorts',...(character==='Woman'?['Jeans']:[]),'BareLegs']) {
   const prop=family==='SuitLegs'?'suitColor':family==='BareLegs'?'skinColor':'pantsColor';
   const color=family==='BareLegs'?'#CFA17E':family==='Jeans'?'#486D89':'#344454';
   for(let side=0;side<2;side++) {
    const center=side?-11.1666565:-9.333328;
    const bottom=family==='Shorts'?128:143;
    add({name:`Wardrobe_${character}_${family}_Upper${side}`,parentId:r.legs[side],x:center,y:0,paths:[{commands:commands(`M-23 0H23L${family==='Shorts'?24:20} ${bottom}H${family==='Shorts'?-24:-20}Z`)}],paints:[{paintType:'fill',color}]},family,character,prop);
    if(family!=='Shorts')add({name:`Wardrobe_${character}_${family}_Lower${side}`,parentId:r.shins[side],x:side?-11.6666565:-9.333328,y:0,paths:[{commands:commands('M-20 0H20L17 153H-16Z')}],paints:[{paintType:'fill',color}]},family,character,prop);
   }
   if(family!=='BareLegs')add({name:`Wardrobe_${character}_${family}_Pelvis`,parentId:r.hips,x:0,y:80,width:98,height:44,shapeType:'rectangle',paints:[{paintType:'fill',color}]},family,character,prop,true);
  }
  if(character==='Woman')add({name:'Wardrobe_Woman_SuitSkirt_Body',parentId:r.hips,x:0,y:35.5,paths:[{commands:commands('M-44 0H44L74 165Q0 170-74 165Z')}],paints:[{paintType:'fill',color:'#344454'}]},'SuitSkirt',character,'suitColor');
 }
 return {free,primitives,meta};
}
if(process.argv[2]) {
 const result=build(JSON.parse(fs.readFileSync(process.argv[2],'utf8')));
 fs.writeFileSync(new URL('./rive-wardrobe-plan.json',import.meta.url),JSON.stringify(result,null,2));
}
