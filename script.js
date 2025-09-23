const FAQS = [
const slidesTrack = $('#slidesTrack');
const sliderDots = $('#sliderDots');
let currentIndex = 0; let sliderTimer = null;
function renderSlides(items=EVENTS){
slidesTrack.innerHTML = ''; sliderDots.innerHTML = '';
items.forEach((ev, i) => {
const slide = createElement('div',{class:'slide',tabindex:0});
slide.innerHTML = `<div class=\"title\">${ev.title} <span style=\"font-size:13px;color:var(--muted);font-weight:500\"> — ${ev.date}</span></div><div style=\"color:var(--muted)\">${ev.short}</div><div style=\"margin-top:10px\"><button class=\"btn\" data-id=\"${ev.id}\">View details</button></div>`;
slide.querySelector('button').addEventListener('click', ()=> openModal(ev));
slidesTrack.appendChild(slide);


const dot = createElement('button',{class:'dot',role:'tab','aria-selected':'false', 'aria-controls':'slidesTrack'});
dot.dataset.index = i; dot.addEventListener('click', ()=> goToSlide(i)); sliderDots.appendChild(dot);
});
updateSlider(); startAutoplay();
}
function updateSlider(){ slidesTrack.style.transform = `translateX(-${currentIndex * 100}%)`; Array.from(sliderDots.children).forEach((d,i)=>{ d.setAttribute('aria-selected', i===currentIndex); d.setAttribute('aria-current', i===currentIndex); }); }
function goToSlide(i){ currentIndex = (i + EVENTS.length) % EVENTS.length; updateSlider(); restartAutoplay(); }
function nextSlide(){ goToSlide(currentIndex+1); }
function prevSlide(){ goToSlide(currentIndex-1); }
function startAutoplay(){ stopAutoplay(); sliderTimer = setInterval(()=> nextSlide(), 5000); }
function stopAutoplay(){ if (sliderTimer) clearInterval(sliderTimer); }
function restartAutoplay(){ stopAutoplay(); startAutoplay(); }


// Modal
const modalBackdrop = $('#modalBackdrop');
const modalBody = $('#modalBody');
const modalTitle = $('#modalTitle');
const modalClose = $('#modalClose');
function openModal(ev){ modalTitle.textContent = ev.title + ' — ' + ev.date; modalBody.textContent = ev.detail; modalBackdrop.classList.add('show'); modalBackdrop.setAttribute('aria-hidden','false'); modalClose.focus(); document.addEventListener('keydown', escHandler); }
function closeModal(){ modalBackdrop.classList.remove('show'); modalBackdrop.setAttribute('aria-hidden','true'); document.removeEventListener('keydown', escHandler); }
function escHandler(e){ if (e.key === 'Escape') closeModal(); }
modalClose.addEventListener('click', closeModal); modalBackdrop.addEventListener('click', e => { if (e.target === modalBackdrop) closeModal(); });


// Banner
const bannerPlaceholder = $('#bannerPlaceholder'); let bannerEl = null;
function showBanner(message = 'You have new updates — click to view.', timeout=0){ if (bannerEl) return; bannerEl = createElement('div',{class:'banner'}); bannerEl.innerHTML = `<div style=\"display:flex;gap:12px;align-items:center\"><strong>Notice</strong><div style=\"font-size:13px;color:white;opacity:0.95\">${message}</div></div><div style=\"display:flex;gap:8px\"><button id=\"bannerOpen\" class=\"btn\">Open</button><button id=\"bannerClose\" class=\"btn\">Dismiss</button></div>`; bannerPlaceholder.appendChild(bannerEl); bannerPlaceholder.style.pointerEvents = 'auto'; bannerPlaceholder.setAttribute('role','status');
$('#bannerClose').addEventListener('click', hideBanner); $('#bannerOpen').addEventListener('click', ()=>{ alert('Open clicked — would take user to notifications.'); }); if (timeout>0) setTimeout(hideBanner, timeout);
}
function hideBanner(){ if (!bannerEl) return; bannerEl.remove(); bannerEl = null; bannerPlaceholder.style.pointerEvents='none'; }


// Theme
const themeToggle = $('#themeToggle');
function setTheme(dark){ if (dark){ document.documentElement.setAttribute('data-theme','dark'); themeToggle.setAttribute('aria-pressed','true'); themeToggle.textContent='🌙 Dark'; } else { document.documentElement.removeAttribute('data-theme'); themeToggle.setAttribute('aria-pressed','false'); themeToggle.textContent='🌓 Light'; } localStorage.setItem('prefersDark', dark ? '1' : '0'); }
themeToggle.addEventListener('click', ()=> setTheme(localStorage.getItem('prefersDark') !== '1'));


// misc binds
$('#prevSlide').addEventListener('click', prevSlide); $('#nextSlide').addEventListener('click', nextSlide);
$('#openBanner').addEventListener('click', ()=> showBanner('Reminder: Submit your assignment by Friday', 0)); $('#dismissBanner').addEventListener('click', hideBanner);
$('#addFaq').addEventListener('click', ()=>{ const newFaq = {id: Date.now(), q: 'New sample FAQ: How to test?', a: 'Click "Run accessibility check" or use keyboard to navigate the accordion.'}; FAQS.push(newFaq); renderFaqs(FAQS); setTimeout(()=> document.getElementById('faq-'+newFaq.id).scrollIntoView({behavior:'smooth', block:'center'}), 100); });
$('#testA11y').addEventListener('click', ()=>{ const issues = []; if (!document.querySelector('meta[name="viewport"]')) issues.push('No viewport meta'); if (!accordionRoot.querySelector('[role="region"]')) issues.push('Accordion regions missing'); console.log('A11y quick-check results:', issues.length ? issues : 'No obvious issues found'); alert('Accessibility quick-check run; see console for results.'); });


$('#collapseAll').addEventListener('click', ()=>{ accordionRoot.querySelectorAll('.acc-item').forEach(acc=>{ const btn = acc.querySelector('button[aria-controls]'); const body = acc.querySelector('.acc-body'); acc.setAttribute('aria-expanded','false'); btn.setAttribute('aria-expanded','false'); body.style.maxHeight = 0; if (btn.querySelector('.chev')) btn.querySelector('.chev').textContent='▸'; }) });


function init(){ renderFaqs(); renderSlides(); setTheme(localStorage.getItem('prefersDark') === '1'); document.addEventListener('focusin', stopAutoplay); document.addEventListener('focusout', startAutoplay); Array.from(sliderDots.children).forEach((d,i)=> d.setAttribute('aria-label', `Go to slide ${i+1}`)); }
init();
