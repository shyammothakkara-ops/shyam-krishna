// All editable event content is centralized here for quick future CMS/backend integration.
const WEDDING = { date: new Date('2026-11-15T09:30:00+05:30'), gallery: [
  {src:'public/images/gallery-3.jpg', alt:'Krishna and Shyam smiling together'},
  {src:'public/images/gallery-4.jpg', alt:'Krishna and Shyam exchanging rings'},
  {src:'public/images/gallery-5.JPG', alt:'Shyam in her wedding attire'},
  {src:'public/images/gallery-6.jpg', alt:'Krishna and Shyam holding hands'},
  {src:'public/images/gallery-7.jpg', alt:'Krishna arriving for the celebration'},
  {src:'public/images/gallery-8.jpg', alt:"Shyam's initial ring"},
  {src:'public/images/gallery-9.jpg', alt:'Krishna and Shyam walking together'}
]};

if('scrollRestoration' in history)history.scrollRestoration='manual';
window.addEventListener('load',()=>{if(location.hash)history.replaceState(null,'',location.pathname+location.search);requestAnimationFrame(()=>window.scrollTo(0,0));});
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.14});document.querySelectorAll('.reveal').forEach(e=>observer.observe(e));
const nav=document.querySelector('.nav');addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>80),{passive:true});
const sections=[...document.querySelectorAll('main section[id]')], links=[...document.querySelectorAll('.nav-links a')];const sectionObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id))}),{rootMargin:'-45% 0px -45%'});sections.forEach(s=>sectionObserver.observe(s));

const dialog=document.querySelector('#lightbox'),lightboxImage=document.querySelector('#lightboxImage'),count=document.querySelector('#lightboxCount');let index=0;
function show(i){index=(i+WEDDING.gallery.length)%WEDDING.gallery.length;const p=WEDDING.gallery[index];lightboxImage.src=p.src;lightboxImage.alt=p.alt;count.textContent=`${index+1} / ${WEDDING.gallery.length}`;}
function openSlide(button){show(+button.dataset.index);if(!dialog.open)dialog.showModal();}
document.querySelectorAll('.gallery-slide').forEach(button=>button.addEventListener('click',()=>openSlide(button)));
const openGallery=document.querySelector('#openGallery');if(openGallery)openGallery.addEventListener('click',()=>{show(0);dialog.showModal();});
document.querySelector('.close').addEventListener('click',()=>dialog.close());document.querySelector('.prev').addEventListener('click',()=>show(index-1));document.querySelector('.next').addEventListener('click',()=>show(index+1));dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});let x;dialog.addEventListener('touchstart',event=>x=event.changedTouches[0].screenX,{passive:true});dialog.addEventListener('touchend',event=>{const dx=event.changedTouches[0].screenX-x;if(Math.abs(dx)>45)show(index+(dx<0?1:-1));},{passive:true});
const track=document.querySelector('.gallery-track'),dots=document.querySelector('.gallery-dots'),slides=[...document.querySelectorAll('.gallery-slide')];
const lastClone=slides.at(-1).cloneNode(true),firstClone=slides[0].cloneNode(true);lastClone.dataset.clone='last';firstClone.dataset.clone='first';track.prepend(lastClone);track.append(firstClone);[lastClone,firstClone].forEach(button=>button.addEventListener('click',()=>openSlide(button)));
const visualSlides=[lastClone,...slides,firstClone];let carouselIndex=0,settleTimer;
function scrollGalleryTo(slide,behavior='smooth'){track.scrollTo({left:slide.offsetLeft-(track.clientWidth-slide.offsetWidth)/2,behavior});}
function goTo(i,behavior='smooth'){carouselIndex=(i+slides.length)%slides.length;scrollGalleryTo(slides[carouselIndex],behavior);updateDots();}
function goNext(){if(carouselIndex===slides.length-1)scrollGalleryTo(firstClone);else goTo(carouselIndex+1);}
function goPrevious(){if(carouselIndex===0)scrollGalleryTo(lastClone);else goTo(carouselIndex-1);}
WEDDING.gallery.forEach((_,i)=>{const dot=document.createElement('button');dot.setAttribute('aria-label',`Show photo ${i+1}`);dot.addEventListener('click',()=>goTo(i));dots.append(dot);});
function closestSlide(){const center=track.scrollLeft+track.clientWidth/2;return visualSlides.reduce((nearest,slide)=>Math.abs(slide.offsetLeft+slide.offsetWidth/2-center)<Math.abs(nearest.offsetLeft+nearest.offsetWidth/2-center)?slide:nearest,visualSlides[0]);}
function updateDots(){const closest=closestSlide();carouselIndex=+closest.dataset.index;slides.forEach((slide,i)=>slide.classList.toggle('is-active',i===carouselIndex));[...dots.children].forEach((dot,i)=>dot.classList.toggle('active',i===carouselIndex));}
function settleLoop(){const closest=closestSlide();if(closest===firstClone)scrollGalleryTo(slides[0],'auto');if(closest===lastClone)scrollGalleryTo(slides.at(-1),'auto');updateDots();}
track.addEventListener('scroll',()=>{updateDots();clearTimeout(settleTimer);settleTimer=setTimeout(settleLoop,180);},{passive:true});
document.querySelector('.gallery-prev').addEventListener('click',goPrevious);document.querySelector('.gallery-next').addEventListener('click',goNext);scrollGalleryTo(slides[0],'auto');updateDots();
