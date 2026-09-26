export const formats = [{name:'横版',w:1200,h:675},{name:'方形',w:1080,h:1080},{name:'竖版',w:900,h:1200}];
export function plan(w,h,box,ratio){
 if(![w,h,ratio,...box].every(Number.isFinite)||w<=0||h<=0||ratio<=0||box.length!==4) throw Error('尺寸无效');
 const [l,t,r,b]=box;
 if(l<0||t<0||r>1||b>1||r-l<.01-1e-9||b-t<.01-1e-9) throw Error('右边需大于左边、下边需大于上边，至少相差1%。');
 const cw=Math.min(w,h*ratio),ch=cw/ratio;
 if((r-l)*w>cw+1e-7||(b-t)*h>ch+1e-7) return {mode:'pad',x:0,y:0,w,h};
 const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
 return {mode:'crop',x:clamp((l+r)*w/2-cw/2,Math.max(0,r*w-cw),Math.min(l*w,w-cw)),y:clamp((t+b)*h/2-ch/2,Math.max(0,b*h-ch),Math.min(t*h,h-ch)),w:cw,h:ch};
}
export function destination(p,w,h){
 const scale=Math.min(w/p.w,h/p.h);
 return {x:(w-p.w*scale)/2,y:(h-p.h*scale)/2,w:p.w*scale,h:p.h*scale};
}
