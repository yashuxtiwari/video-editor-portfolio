
// ═══════════════════════════════════════
// LOADER
// ═══════════════════════════════════════
window.addEventListener('load',()=>{
  setTimeout(()=>{
    document.getElementById('loader').classList.add('hidden');
    startCounters();
  },2600);
});

// ═══════════════════════════════════════
// CURSOR
// ═══════════════════════════════════════
const cursor=document.getElementById('cursor');
const ring=document.getElementById('cursor-ring');
const glow=document.getElementById('mouse-glow');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{
  mx=e.clientX;my=e.clientY;
  cursor.style.left=mx+'px';cursor.style.top=my+'px';
  glow.style.left=mx+'px';glow.style.top=my+'px';
});
function animRing(){
  rx+=(mx-rx)*0.12;ry+=(my-ry)*0.12;
  ring.style.left=rx+'px';ring.style.top=ry+'px';
  requestAnimationFrame(animRing);
}
animRing();
document.querySelectorAll('a,button,.project-card,.cat-card,.tool-item').forEach(el=>{
  el.addEventListener('mouseenter',()=>{cursor.classList.add('hover');});
  el.addEventListener('mouseleave',()=>{cursor.classList.remove('hover');});
});

// ═══════════════════════════════════════
// NAVBAR SCROLL
// ═══════════════════════════════════════
window.addEventListener('scroll',()=>{
  document.getElementById('navbar').classList.toggle('scrolled',window.scrollY>50);
});

// ═══════════════════════════════════════
// MOBILE MENU
// ═══════════════════════════════════════
const ham=document.getElementById('hamburger');
const mob=document.getElementById('mobile-menu');
ham.addEventListener('click',()=>{
  const open=mob.classList.toggle('active');
  ham.setAttribute('aria-expanded',open);
  ham.querySelectorAll('span')[0].style.transform=open?'rotate(45deg) translate(5px,5px)':'';
  ham.querySelectorAll('span')[1].style.opacity=open?'0':'1';
  ham.querySelectorAll('span')[2].style.transform=open?'rotate(-45deg) translate(5px,-5px)':'';
});
function closeMobile(){
  mob.classList.remove('active');
  ham.setAttribute('aria-expanded','false');
  ham.querySelectorAll('span').forEach(s=>{s.style.transform='';s.style.opacity='';});
}

// ═══════════════════════════════════════
// THREE.JS HERO
// ═══════════════════════════════════════
const hc=document.getElementById('hero-canvas');
hc.width=window.innerWidth;
hc.height=window.innerHeight;
const renderer=new THREE.WebGLRenderer({canvas:hc,alpha:true,antialias:true});
renderer.setSize(window.innerWidth,window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;

const scene=new THREE.Scene();
const camera3=new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,100);
camera3.position.set(0,0,6);

// Lighting
const amb=new THREE.AmbientLight(0x0a1560,0.8);
scene.add(amb);
const keyLight=new THREE.DirectionalLight(0x4488ff,3);
keyLight.position.set(3,4,5);
keyLight.castShadow=true;
scene.add(keyLight);
const rimLight=new THREE.DirectionalLight(0x00d4ff,2);
rimLight.position.set(-4,0,-2);
scene.add(rimLight);
const fillLight=new THREE.PointLight(0x0066ff,2,15);
fillLight.position.set(0,0,3);
scene.add(fillLight);

// Camera body
const camMat=new THREE.MeshStandardMaterial({
  color:0x0a1530,metalness:0.9,roughness:0.15,
  envMapIntensity:1.5
});
const camGroup=new THREE.Group();

// Main body
const body=new THREE.Mesh(new THREE.BoxGeometry(2.2,1.2,1.6),camMat);
body.castShadow=true;
camGroup.add(body);

// Lens
const lensMat=new THREE.MeshStandardMaterial({color:0x001133,metalness:0.95,roughness:0.05});
const lens=new THREE.Mesh(new THREE.CylinderGeometry(0.45,0.55,0.9,32),lensMat);
lens.rotation.z=Math.PI/2;lens.position.x=1.55;
camGroup.add(lens);
const lensGlass=new THREE.Mesh(new THREE.CylinderGeometry(0.35,0.35,0.05,32),
  new THREE.MeshStandardMaterial({color:0x0022ff,transparent:true,opacity:0.8,metalness:1,roughness:0}));
lensGlass.rotation.z=Math.PI/2;lensGlass.position.x=2.05;
camGroup.add(lensGlass);

// Viewfinder
const vf=new THREE.Mesh(new THREE.BoxGeometry(0.7,0.45,0.35),camMat);
vf.position.set(0.2,0.82,0);
camGroup.add(vf);

// Grip
const grip=new THREE.Mesh(new THREE.BoxGeometry(0.55,0.7,1.4),
  new THREE.MeshStandardMaterial({color:0x050d20,metalness:0.5,roughness:0.6}));
grip.position.set(-0.85,-0.7,0);
camGroup.add(grip);

// Accent strip
const strip=new THREE.Mesh(new THREE.BoxGeometry(2.22,0.08,0.1),
  new THREE.MeshStandardMaterial({color:0x00d4ff,emissive:0x00d4ff,emissiveIntensity:0.8,metalness:1,roughness:0}));
strip.position.y=0.61;
camGroup.add(strip);

camGroup.position.set(1.5,0,0);
scene.add(camGroup);

// Floating elements
const floatGroup=new THREE.Group();
function makeFloat(geo,mat,pos,rot=[0,0,0]){
  const m=new THREE.Mesh(geo,mat);
  m.position.set(...pos);
  m.rotation.set(...rot);
  floatGroup.add(m);
  return m;
}
const glowMat=new THREE.MeshStandardMaterial({color:0x0066ff,emissive:0x0066ff,emissiveIntensity:0.6,transparent:true,opacity:0.85,metalness:0.8,roughness:0.2});
const cyanMat=new THREE.MeshStandardMaterial({color:0x00d4ff,emissive:0x00d4ff,emissiveIntensity:0.5,transparent:true,opacity:0.7,metalness:0.9,roughness:0.1});

// Timeline bars
for(let i=0;i<4;i++){
  const bar=new THREE.Mesh(new THREE.BoxGeometry(0.8+Math.random()*0.6,0.08,0.06),
    i%2===0?glowMat:cyanMat);
  bar.position.set(-3+Math.random()*0.5,-0.8+i*0.25,(Math.random()-0.5)*1.5);
  floatGroup.add(bar);
}
// Film reel
const reel=makeFloat(new THREE.TorusGeometry(0.55,0.08,8,32),glowMat,[-2.8,1.2,0.5]);
const reelCenter=makeFloat(new THREE.CylinderGeometry(0.15,0.15,0.1,16),cyanMat,[-2.8,1.2,0.5],[Math.PI/2,0,0]);

// Play triangle
const tGeo=new THREE.CylinderGeometry(0,0.25,0.4,3);
const play=makeFloat(tGeo,cyanMat,[-2,1.8,-0.5],[0,0,-Math.PI/2]);

// Particles
const pGeo=new THREE.BufferGeometry();
const pCount=120;
const pPos=new Float32Array(pCount*3);
for(let i=0;i<pCount*3;i++) pPos[i]=(Math.random()-0.5)*12;
pGeo.setAttribute('position',new THREE.BufferAttribute(pPos,3));
const pMat=new THREE.PointsMaterial({color:0x0066ff,size:0.04,transparent:true,opacity:0.7});
const particles=new THREE.Points(pGeo,pMat);
scene.add(particles);

scene.add(floatGroup);

// Mouse target
let targetX=0,targetY=0,currentX=0,currentY=0;
document.addEventListener('mousemove',e=>{
  targetX=(e.clientX/window.innerWidth-0.5)*0.6;
  targetY=-(e.clientY/window.innerHeight-0.5)*0.4;
});

const clock=new THREE.Clock();
function animate3D(){
  requestAnimationFrame(animate3D);
  const t=clock.getElapsedTime();
  currentX+=(targetX-currentX)*0.05;
  currentY+=(targetY-currentY)*0.05;
  camGroup.rotation.y=currentX*0.8+Math.sin(t*0.3)*0.1;
  camGroup.rotation.x=currentY*0.5+Math.sin(t*0.4)*0.05;
  floatGroup.rotation.y=t*0.12;
  floatGroup.children.forEach((c,i)=>{
    c.position.y+=Math.sin(t*0.8+i*1.2)*0.003;
    c.rotation.z+=0.003+i*0.001;
  });
  particles.rotation.y=t*0.03;
  fillLight.position.x=Math.sin(t*0.5)*3;
  fillLight.position.y=Math.cos(t*0.4)*2;
  renderer.render(scene,camera3);
}
animate3D();

window.addEventListener('resize',()=>{
  camera3.aspect=window.innerWidth/window.innerHeight;
  camera3.updateProjectionMatrix();
  renderer.setSize(window.innerWidth,window.innerHeight);
  hc.width=window.innerWidth;hc.height=window.innerHeight;
});

// ═══════════════════════════════════════
// PARTICLES CANVAS (background)
// ═══════════════════════════════════════
const pc=document.getElementById('particles-canvas');
const ctx=pc.getContext('2d');
pc.width=window.innerWidth;pc.height=window.innerHeight;
window.addEventListener('resize',()=>{pc.width=window.innerWidth;pc.height=window.innerHeight;});
const dots=Array.from({length:80},()=>({
  x:Math.random()*window.innerWidth,
  y:Math.random()*window.innerHeight,
  r:Math.random()*1.5+0.5,
  vx:(Math.random()-0.5)*0.3,
  vy:(Math.random()-0.5)*0.3,
  alpha:Math.random()*0.4+0.1
}));
function animDots(){
  ctx.clearRect(0,0,pc.width,pc.height);
  dots.forEach(d=>{
    d.x+=d.vx;d.y+=d.vy;
    if(d.x<0)d.x=pc.width;if(d.x>pc.width)d.x=0;
    if(d.y<0)d.y=pc.height;if(d.y>pc.height)d.y=0;
    ctx.beginPath();
    ctx.arc(d.x,d.y,d.r,0,Math.PI*2);
    ctx.fillStyle=`rgba(0,102,255,${d.alpha})`;
    ctx.fill();
  });
  // Connect nearby
  for(let i=0;i<dots.length;i++){
    for(let j=i+1;j<dots.length;j++){
      const dx=dots[i].x-dots[j].x,dy=dots[i].y-dots[j].y;
      const dist=Math.sqrt(dx*dx+dy*dy);
      if(dist<120){
        ctx.beginPath();
        ctx.moveTo(dots[i].x,dots[i].y);
        ctx.lineTo(dots[j].x,dots[j].y);
        ctx.strokeStyle=`rgba(0,102,255,${0.06*(1-dist/120)})`;
        ctx.lineWidth=0.5;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(animDots);
}
animDots();

// ═══════════════════════════════════════
// INTERSECTION OBSERVER
// ═══════════════════════════════════════
const obs=new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('visible');
      // Skill bars
      if(e.target.classList.contains('about-skills')){
        setTimeout(()=>{
          e.target.querySelectorAll('.skill-fill').forEach(f=>f.classList.add('animate'));
        },300);
      }
    }
  });
},{threshold:0.15,rootMargin:'0px 0px -60px 0px'});

document.querySelectorAll(
  '.section-label,.section-title,.section-sub,.about-visual,.about-skills,.project-card,.cat-card,.testi-card,.timeline-item,.tool-item,.pricing-card,.contact-info,.contact-form'
).forEach(el=>obs.observe(el));

// Project card stagger
document.querySelectorAll('.project-card').forEach((c,i)=>{
  c.style.transitionDelay=`${i*0.1}s`;
});
document.querySelectorAll('.cat-card').forEach((c,i)=>{
  c.style.transitionDelay=`${i*0.08}s`;
});
document.querySelectorAll('.tool-item').forEach((c,i)=>{
  c.style.transitionDelay=`${i*0.06}s`;
});
document.querySelectorAll('.pricing-card').forEach((c,i)=>{
  c.style.transitionDelay=`${i*0.12}s`;
});

// ═══════════════════════════════════════
// COUNTERS
// ═══════════════════════════════════════
function startCounters(){
  function countUp(el,target,suffix,dur=1800){
    let start=0,step=target/dur*16;
    const t=setInterval(()=>{
      start=Math.min(start+step,target);
      el.textContent=Math.floor(start)+suffix;
      if(start>=target)clearInterval(t);
    },16);
  }
  setTimeout(()=>{
    countUp(document.getElementById('stat1'),200,'+');
    countUp(document.getElementById('stat2'),140,'+');
    countUp(document.getElementById('stat3'),4,'yrs');
  },400);
}

// ═══════════════════════════════════════
// PROJECT FILTERS
// ═══════════════════════════════════════
document.querySelectorAll('.filter-btn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const filter=btn.dataset.filter;
    document.querySelectorAll('.project-card').forEach(card=>{
      const show=filter==='all'||card.dataset.cat===filter;
      card.style.opacity=show?'1':'0.25';
      card.style.transform=show?'scale(1)':'scale(0.96)';
    });
  });
});

// ═══════════════════════════════════════
// FORM
// ═══════════════════════════════════════
function handleSubmit(e){
  e.preventDefault();
  const btn=e.target.querySelector('button[type=submit]');
  btn.textContent='Message Sent ✓';
  btn.style.background='linear-gradient(135deg,#0a5c2a,#12a050)';
  setTimeout(()=>{
    btn.innerHTML='<span>Send Message</span><span aria-hidden="true">→</span>';
    btn.style.background='';
    e.target.reset();
  },3000);
}

// Keyboard nav for project cards
document.querySelectorAll('.project-card').forEach(card=>{
  card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' ')card.click();});
});

// form
function handleSubmit(event){

  event.preventDefault();

  // GET VALUES

  const fname =
    document.getElementById("fname").value;

  const lname =
    document.getElementById("lname").value;

  const email =
    document.getElementById("email").value;

  const service =
    document.getElementById("service").value;

  const budget =
    document.getElementById("budget").value;

  const message =
    document.getElementById("message").value;

  // WHATSAPP NUMBER

  const phoneNumber = "918233592116";

  // MESSAGE

  const text =

`🎬 NEW PROJECT INQUIRY


👤 CLIENT NAME
${fname} ${lname}


📧 EMAIL ADDRESS
${email}


🎥 SERVICE TYPE
${service}


💰 BUDGET RANGE
${budget}


📝 PROJECT DETAILS
${message}`;


  // WHATSAPP URL

  const whatsappURL =

`https://wa.me/${+918233592116}?text=${encodeURIComponent(text)}`;


  // OPEN WHATSAPP

  window.open(whatsappURL, "_blank");

}