// Text-free vector reference art and the exact detail paths used in Rive.
import fs from 'node:fs';
import { commands } from '../outfits/build-rive-wardrobe.mjs';
const out = new URL('./', import.meta.url);
const p = (name, d, color, extra = {}) => ({ name, d, color, ...extra });
export function details(sex, mode) {
  const female = sex === 'woman';
  if (mode === 'romance') return [
    p('CheekLightNear', 'M34 39Q43 34 49 31Q48 45 35 47Z', '#24ffffff'),
    p('CheekLightFar', 'M-43 35Q-34 38-27 40L-31 46Q-42 43-43 35Z', '#1cffffff'),
    p('JawShade', female ? 'M-48 53Q-32 80 1 91Q-28 89-44 72Z' : 'M-51 48L-39 76L-9 91L-28 86L-47 71Z', '#22000000'),
    p('NoseBridgeLight', 'M7 25L9 38L6 42L5 34Z', '#38ffffff'),
    p('HairSweep', 'M-42-47Q-6-69 37-44Q8-56-12-42Q-26-33-40-35Q-23-41-12-49Q-26-49-42-47Z', '#94705a', { colorProperty: 'hairAccentColor', phase: 'middle' }),
    ...(female ? [
      p('LashesNear', 'M14 15Q30 2 50 14L56 8L53 17L59 15L53 21Q36 9 14 18Z', '#3d302c', { colorProperty: 'hairColor' }),
      p('LashesFar', 'M-45 15L-51 9L-48 19L-54 17L-47 23Q-31 11-10 19Q-27 5-45 15Z', '#3d302c', { colorProperty: 'hairColor' }),
      p('LipLight', 'M-5 74Q7 77 16 72Q10 79 0 79Z', '#45ffffff'),
      p('HairRibbonNear', 'M61-32Q73 8 65 56Q62 79 75 87Q57 83 59 63Q68 17 58-28Z', '#94705a', { colorProperty: 'hairAccentColor', phase: 'middle' }),
    ] : [
      p('CheekContour', 'M25 49L42 43L36 50Z', '#22000000'),
      p('BrowDefinition', 'M-42 0Q-28-9-13-2L-13 1Q-29-3-42 4Z', '#3d302c', { colorProperty: 'hairColor' }),
    ]),
  ];
  if (mode === 'heist') return [
    p('CheekPlane', 'M38 32L52 26L47 52L27 65L38 48Z', '#320d2634'),
    p('JawPlane', 'M-49 45L-37 70L-13 83L-29 79L-46 62Z', '#230b2534'),
    p('FocusedLidNear', 'M13 14Q31 4 49 13L49 17Q29 10 13 18Z', '#3d302c', { colorProperty: 'hairColor' }),
    p('FocusedLidFar', 'M-43 13Q-28 4-11 13L-11 17Q-28 11-43 17Z', '#3d302c', { colorProperty: 'hairColor' }),
    p('EyeCreaseNear', 'M19 30Q34 33 45 27', '#550d2634', { stroke: 1.6 }),
    p('SmirkCrease', 'M29 62Q35 59 35 54', '#55342c2c', { stroke: 1.5 }),
    p('SleekHair', 'M-42-44Q-13-61 28-44Q6-48-12-42Q-27-36-42-36Z', '#94705a', { colorProperty: 'hairAccentColor', phase: 'middle' }),
  ];
  return [
    p('FatigueNear', 'M12 28Q31 39 50 26Q45 43 28 41Q18 39 12 28Z', '#51423844'),
    p('FatigueFar', 'M-45 27Q-27 37-10 27Q-12 41-29 40Q-41 38-45 27Z', '#51423844'),
    p('LidNear', 'M13 11Q31 1 50 12L49 18Q30 12 13 18Z', '#CFA17E', { colorProperty: 'skinColor' }),
    p('LidFar', 'M-45 12Q-27 2-10 12L-11 18Q-29 12-44 18Z', '#CFA17E', { colorProperty: 'skinColor' }),
    p('CheekDirt', 'M-49 45L-35 42L-23 51L-36 53L-43 60L-49 56Z', '#66594b37', { phase: 'middle' }),
    p('TempleDirt', 'M43-11L52-5L49 8L43 3Z', '#55594b37', { phase: 'middle' }),
    p('ScarShadow', 'M37 34L29 48L33 50L25 66', '#885b3837', { stroke: 3.2, phase: 'late' }),
    p('ScarLight', 'M38 34L31 47L35 50L27 66', '#99edc0ad', { stroke: 1.4, phase: 'late' }),
    p('ScarCross', 'M29 45L35 48M27 54L32 57', '#885b3837', { stroke: 1.4, phase: 'late' }),
    p('StrayHair', female ? 'M-43-48Q-35-15-18 5Q-41-8-48-35L-54-20L-51-47ZM42-44Q39-18 49 2Q32-12 34-39Z' : 'M-47-48L-42-9L-33-36L-18-11L-25-47L-11-28L-13-54Z', '#3d302c', { colorProperty: 'hairColor', phase: 'middle' }),
    p('Flyaways', 'M-49-57Q-65-74-79-63L-65-80L-80-84Q-60-91-48-66ZM28-66L35-88L39-71L55-83L49-64Z', '#3d302c', { colorProperty: 'hairColor', phase: 'middle' }),
    p('DryLip', 'M-8 73L-4 72M7 74L12 73', '#665b3837', { stroke: 1.2 }),
  ];
}
export function bodyDetails(mode) {
  if (mode === 'survival') return [
    p('FabricDirt', 'M-43-12L-23-2L-34 10L-20 27L-40 17ZM20 76L40 67L45 86L30 91Z', '#664b4534', { phase: 'middle' }),
    p('FabricCreases', 'M-40-29L-27-18L-39-13M40 37L24 46L39 49M-33 69L-15 75', '#550d2028', { stroke: 2 }),
    p('FabricScuffs', 'M-38-10L-30-5M-40-4L-31 1M32 78L40 74M30 84L40 80', '#70e6ddc8', { stroke: 1.5, phase: 'late' }),
    p('FabricTear', 'M18 9L32 17L21 15L31 23L16 14Z', '#77132027', { phase: 'late' }),
  ];
  if (mode === 'heist') return [p('TailoredShade', 'M-44-43L-36 36L-42 87L-48 84L-46 9ZM40-45L46 9L44 84L38 87L33 39Z', '#200b2332', { phase: 'middle' })];
  return [p('FabricLight', 'M-37-54Q-14-65-9-52L-18-49L-32-47Z', '#25ffffff', { phase: 'middle' })];
}
const colors = { skin: '#CFA17E', hair: '#3D302C', accent: '#94705A', bottom: '#344454' };
const svgPath = (part, a=1) => {
  let color=part.color, opacity=a;
  if(color.length===9){opacity*=parseInt(color.slice(1,3),16)/255;color='#'+color.slice(3);}
  return `<path d="${part.d}" ${part.stroke ? `fill="none" stroke="${color}" stroke-width="${part.stroke}" stroke-linecap="round"` : `fill="${color}"`} opacity="${opacity}"/>`;
};
// Reference geometry uses the rig's head and torso coordinates. Detail paths
// are shared verbatim with the native Rive build manifest below.
export function character(sex,mode,a=1) {
  const f=sex==='woman', r=mode==='romance'?a:0, s=mode==='survival'?a:0, h=mode==='heist'?a:0;
  const skin=colors.skin,hair=colors.hair,top=f?'#86658F':'#438F98';
  const path=(d,c)=>svgPath(p('',d,c));
  const eye=(x)=>`<g transform="translate(${x} 17.5) scale(${1+r*.17} ${1+r*(f?.26:.12)-s*.14-h*.09})"><ellipse rx="17" ry="10" fill="#fcf9f4"/><ellipse cx="3" rx="7" ry="8" fill="#58616a"/><ellipse cx="4" rx="3.7" ry="5" fill="#242d36"/><circle cx="5" cy="-3" r="2" fill="white"/>${path('M-18-2Q-1-15 17-3Q0-9-18 1Z',hair)}</g>`;
  const waist=f?46-r*7:52-r*9, shoulder=f?54:62+r*9;
  const limbs=[-1,1].map(sign=>`<g transform="translate(${250+sign*29} 445)">${path('M-23-12H23L20 131L17 270H-17L-20 131Z',f?skin:colors.bottom)}${path('M-18 265H17L22 279L41 289H-22Z','#242d36')}</g>`).join('');
  const arms=[-1,1].map(sign=>`<g transform="translate(${250+sign*(shoulder-5)} 295)">${path('M-13 43H13L11 170L15 184L10 199L3 194L-5 206L-12 192Z',skin)}${path('M-18-18Q0-27 18-16L17 68H-17Z',top)}</g>`).join('');
  const face=`M-60-34Q-58-74 0-74Q58-72 60-33L${57-r*(f?4:0)} 44Q${f?42:49} ${77-r*4} ${f?4:8} ${91-r*(f?0:0)}Q-36 88-51 57Z`;
  const head=`<g transform="translate(250 ${152+s*6}) rotate(${h*-2+s*2})">${f?path('M-67-39Q-67-86 0-84Q67-85 67-39V84Q75 106 85 99Q64 121 54 90L-54 90Q-62 119-84 100Q-72 106-67 84Z',hair):''}<ellipse cx="-63" cy="21" rx="13" ry="23" fill="${skin}"/><ellipse cx="63" cy="21" rx="13" ry="23" fill="${skin}"/>${path(face,skin)}${path('M-62 17L-68-35Q-72-60-52-67Q-52-85-27-80Q-4-104 25-83Q47-86 63-70L76-72L66-56L73-51L64-27L58 15L48-5L45-42Q7-32-30-49L-47-40L-49 0Z',hair)}${path('M-44-65Q-18-86 14-68Q-15-78-44-58Z',colors.accent)}${eye(-25.5)}${eye(31.5)}<g transform="translate(0 ${-h*5})">${path('M-44-3Q-26-15-11-3L-12 1Q-28-6-43 2Z',hair)}</g>${path('M16-5Q32-14 47-2L46 3Q31-6 17 0Z',hair)}${path('M8 21L4 42Q5 48 17 43Q13 53 3 48Q-2 46 0 40Z','#21000000')}<g transform="translate(7 65) rotate(${-h*7}) scale(1 ${1-s*.65})">${path('M-24-3Q0 5 24-6Q17 11 0 10Q-16 9-24-3Z',f?'#A35F69':'#65443E')}${path('M-18-1Q2 4 19-3L16 1Q0 7-15 2Z','#FFF8EE')}</g>${details(sex,mode).map(d=>svgPath(d,a)).join('')}</g>`;
  return `${limbs}${f?path('M202 434H298L344 599H156Z',colors.bottom):''}${arms}<g transform="translate(250 278)">${path(`M-30-22L-${shoulder} -12L-${shoulder-4} 44L-${waist} 96L-${waist+2} 160Q0 169 ${waist+2} 160L${waist} 96L${shoulder-4} 44L${shoulder} -12L30-22Z`,top)}${path('M-19-48H19L22-20L0 4L-22-20Z',skin)}${f?'':path('M-22-23L0 2L-15 21L-34-18ZM22-23L0 2L15 21L34-18Z','#CEE1DF')}${f?'':path('M-2 20H2V160H-2Z','#25ffffff')}<g transform="translate(0 58)">${bodyDetails(mode).map(d=>svgPath(d,a)).join('')}</g></g>${head}`;
}
const svg=(body,w=500,height=800)=>`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${height}" viewBox="0 0 ${w} ${height}">${body}</svg>`;
for(const mode of ['romance','heist','survival'])for(const sex of ['man','woman']) {
  fs.writeFileSync(new URL(`${sex}-${mode}.svg`,out),svg(character(sex,mode)));
  fs.writeFileSync(new URL(`${sex}-${mode}-face.svg`,out),`<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="130 25 240 240">${character(sex,mode)}</svg>`);
  fs.writeFileSync(new URL(`${sex}-${mode}-steps.svg`,out),svg([0,.25,.5,.75,1].map((a,i)=>`<g transform="translate(${i*300} 0) scale(.6)">${character(sex,mode,a)}</g>`).join(''),1500,480));
}
const sheet=['romance','heist','survival'].map((mode,col)=>['man','woman'].map((sex,row)=>`<g transform="translate(${col*400} ${row*600}) scale(.75)">${character(sex,mode)}</g>`).join('')).join('');
fs.writeFileSync(new URL('endpoints.svg',out),svg(`<rect width="1200" height="1200" fill="#edece7"/>${sheet}`,1200,1200));
const rigs={man:{head:'0-392',torso:'0-391'},woman:{head:'0-1772',torso:'0-1771'}};
const manifest=[];
for(const sex of ['man','woman']) for(const mode of ['romance','heist','survival']) for(const [region,parts] of [['head',details(sex,mode)],['torso',bodyDetails(mode)]]) for(const part of parts) {
  manifest.push({sex,mode,region,phase:part.phase??'early',colorProperty:part.colorProperty,
    shape:{name:`Drift_${sex}_${mode}_${part.name}`,parentId:rigs[sex][region],x:0,y:region === 'torso' ? 58 : 0,paths:part.d.match(/M[^M]+/g).map(d=>({commands:commands(d),isClosed:!part.stroke})),paints:[{paintType:part.stroke?'stroke':'fill',color:part.color,...(part.stroke?{thickness:part.stroke}:{})}]}});
}
fs.writeFileSync(new URL('detail-manifest.json',out),JSON.stringify(manifest,null,2));
