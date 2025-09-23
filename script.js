const FAQS = [
  { id: 1, q: 'How is the DOM selected and manipulated?', a: 'Using querySelector / querySelectorAll and safe element creation via createElement.' },
  { id: 2, q: 'Are events and listeners properly handled?', a: 'Yes — listeners with keyboard handlers; delegation for scalable lists.' },
  { id: 3, q: 'How does interactivity enhance usability?', a: 'Progressive disclosure, keyboard access, and screen-reader support.' }
];

const EVENTS = [
  { id: 101, title: 'Campus Hackathon', date: '2025-10-15', short: '24-hour hackathon', detail: 'Teams up to 4. Bring laptops and hardware.' },
  { id: 102, title: 'Tech Talk: Accessibility', date: '2025-11-02', short: 'Web accessibility fundamentals', detail: 'ARIA, keyboard support, semantic HTML.' },
  { id: 103, title: 'Career Fair', date: '2025-12-05', short: 'Meet recruiters', detail: 'Multiple companies recruiting on campus.' }
];

const $ = sel => document.querySelector(sel);

function createElement(tag, attrs = {}, children = []) {
  const el = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'class') el.className = v;
    else if (k.startsWith('aria-')) el.setAttribute(k, v);
    else if (k === 'text') el.textContent = v;
    else el[k] = v;
  });
  children.forEach(c => el.append(typeof c === 'string' ? document.createTextNode(c) : c));
  return el;
}

function renderFaqs(list = FAQS) {
  const root = $('#accordionRoot');
  root.innerHTML = '';
  list.forEach((item, idx) => {
    const acc = createElement('div', { class: 'acc-item', role: 'presentation', id: `faq-${item.id}` });
    acc.setAttribute('aria-expanded', 'false');

    const head = createElement('div', { class: 'acc-head' });
    const btn = createElement('button', { type: 'button', 'aria-controls': `faq-body-${item.id}`, 'aria-expanded': 'false' });
    btn.innerHTML = `<strong>${item.q}</strong><span style="color:var(--muted);font-size:13px;margin-left:8px">FAQ ${idx + 1}</span>`;

    const chevron = createElement('span', { class: 'chev', 'aria-hidden': 'true', style: 'margin-left:auto' });
    chevron.textContent = '▸';
    btn.appendChild(chevron);

    head.appendChild(btn);
    acc.appendChild(head);

    const body = createElement('div', { class: 'acc-body', id: `faq-body-${item.id}`, role: 'region', 'aria-labelledby': `faq-${item.id}` }, [
      createElement('div', { text: item.a })
    ]);
    acc.appendChild(body);

    btn.addEventListener('click', () => toggleAccordion(acc, btn, body));
    btn.addEventListener('keydown', e => handleAccordionKey(e, root));

    root.appendChild(acc);
  });
}

function toggleAccordion(acc, btn, body) {
  const expanded = acc.getAttribute('aria-expanded') === 'true';
  if (expanded) {
    acc.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-expanded', 'false');
    body.style.maxHeight = 0;
    const ch = btn.querySelector('.chev');
    if (ch) ch.textContent = '▸';
  } else {
    acc.setAttribute('aria-expanded', 'true');
    btn.setAttribute('aria-expanded', 'true');
    body.style.maxHeight = body.scrollHeight + 'px';
    const ch = btn.querySelector('.chev');
    if (ch) ch.textContent = '▾';
  }
}

function handleAccordionKey(e, root) {
  const all = Array.from(root.querySelectorAll('button[aria-controls]'));
  const idx = all.indexOf(e.currentTarget);
  if (e.key === 'ArrowDown') { e.preventDefault(); all[(idx + 1) % all.length].focus(); }
  if (e.key === 'ArrowUp') { e.preventDefault(); all[(idx - 1 + all.length) % all.length].focus(); }
  if (e.key === 'Home') { e.preventDefault(); all[0].focus(); }
  if (e.key === 'End') { e.preventDefault(); all[all.length - 1].focus(); }
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); const acc = e.currentTarget.closest('.acc-item'); const body = document.getElementById(e.currentTarget.getAttribute('aria-controls')); toggleAccordion(acc, e.currentTarget, body); }
}

function renderSlides(items = EVENTS) {
  const track = $('#slidesTrack');
  const dots = $('#sliderDots');
  track.innerHTML = '';
  dots.innerHTML = '';
  items.forEach((ev, i) => {
    const slide = createElement('div', { class: 'slide', tabindex: 0 });
    slide.innerHTML = `<div class="title">${ev.title}<span style="font-size:13px;color:var(--muted);font-weight:500"> — ${ev.date}</span></div><div style="color:var(--muted)">${ev.short}</div>`;
    const btn = createElement('button', { class: 'btn', 'data-id': ev.id, type: 'button' });
    btn.textContent = 'View details';
    btn.addEventListener('click', () => openModal(ev));
    slide.appendChild(btn);
    track.appendChild(slide);

    const dot = createElement('button', { class: 'dot', role: 'tab', 'aria-selected': 'false', 'aria-controls': 'slidesTrack', type: 'button' });
    dot.dataset.index = i;
    dot.addEventListener('click', () => goToSlide(i));
    dots.appendChild(dot);
  });
  updateSlider();
  startAutoplay();
}

let currentIndex = 0;
let sliderTimer = null;

function updateSlider() {
  const track = $('#slidesTrack');
  track.style.transform = `translateX(-${currentIndex * 100}%)`;
  const dots = Array.from($('#sliderDots').children);
  dots.forEach((d, i) => {
    d.setAttribute('aria-selected', String(i === currentIndex));
    if (i === currentIndex) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current');
  });
}

function goToSlide(i) { currentIndex = (i + EVENTS.length) % EVENTS.length; updateSlider(); restartAutoplay(); }
function nextSlide() { goToSlide(currentIndex + 1); }
function prevSlide() { goToSlide(currentIndex - 1); }
function startAutoplay() { stopAutoplay(); sliderTimer = setInterval(nextSlide, 5000); }
function stopAutoplay() { if (sliderTimer) clearInterval(sliderTimer); sliderTimer = null; }
function restartAutoplay() { stopAutoplay(); startAutoplay(); }

function openModal(ev) {
  const backdrop = $('#modalBackdrop');
  $('#modalTitle').textContent = `${ev.title} — ${ev.date}`;
  $('#modalBody').textContent = ev.detail;
  backdrop.classList.add('show');
  backdrop.setAttribute('aria-hidden', 'false');
  $('#modalClose').focus();
  document.addEventListener('keydown', modalEscHandler);
}

function closeModal() {
  const backdrop = $('#modalBackdrop');
  backdrop.classList.remove('show');
  backdrop.setAttribute('aria-hidden', 'true');
  document.removeEventListener('keydown', modalEscHandler);
}

function modalEscHandler(e) { if (e.key === 'Escape') closeModal(); }

function showBanner(message = 'You have new updates — click to view.', timeout = 0) {
  if ($('#bannerPlaceholder').firstElementChild) return;
  const placeholder = $('#bannerPlaceholder');
  const banner = createElement('div', { class: 'banner' });
  banner.innerHTML = `<div style="display:flex;gap:12px;align-items:center"><strong>Notice</strong><div style="font-size:13px;color:white;opacity:0.95">${message}</div></div>`;
  const controls = createElement('div', {}, [
    createElement('button', { class: 'btn', id: 'bannerOpen', type: 'button' }, ['Open']),
    createElement('button', { class: 'btn', id: 'bannerClose', type: 'button' }, ['Dismiss'])
  ]);
  banner.appendChild(controls);
  placeholder.appendChild(banner);
  placeholder.style.pointerEvents = 'auto';
  $('#bannerClose').addEventListener('click', hideBanner);
  $('#bannerOpen').addEventListener('click', () => alert('Open clicked — go to notifications.'));
  if (timeout > 0) setTimeout(hideBanner, timeout);
}

function hideBanner() {
  const placeholder = $('#bannerPlaceholder');
  placeholder.innerHTML = '';
  placeholder.style.pointerEvents = 'none';
}

function setTheme(dark) {
  if (dark) {
    document.documentElement.setAttribute('data-theme', 'dark');
    $('#themeToggle').setAttribute('aria-pressed', 'true');
    $('#themeToggle').textContent = '🌙 Dark';
  } else {
    document.documentElement.removeAttribute('data-theme');
    $('#themeToggle').setAttribute('aria-pressed', 'false');
    $('#themeToggle').textContent = '🌓 Light';
  }
  localStorage.setItem('prefersDark', dark ? '1' : '0');
}

function accessibilityQuickCheck() {
  const issues = [];
  if (!document.querySelector('meta[name="viewport"]')) issues.push('No viewport meta');
  if (!$('#accordionRoot')?.querySelector('[role="region"]')) issues.push('Accordion regions missing');
  console.log('A11y quick-check results:', issues.length ? issues : 'No obvious issues found');
  alert('Accessibility quick-check complete. See console.');
}

function init() {
  renderFaqs();
  renderSlides();
  setTheme(localStorage.getItem('prefersDark') === '1');
  $('#prevSlide').addEventListener('click', prevSlide);
  $('#nextSlide').addEventListener('click', nextSlide);
  $('#openBanner').addEventListener('click', () => showBanner('Reminder: Submit your assignment by Friday', 0));
  $('#dismissBanner').addEventListener('click', hideBanner);
  $('#addFaq').addEventListener('click', () => {
    const newFaq = { id: Date.now(), q: 'New sample FAQ: How to test?', a: 'Use keyboard or run the accessibility check.' };
    FAQS.push(newFaq);
    renderFaqs();
    setTimeout(() => document.getElementById(`faq-${newFaq.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 120);
  });
  $('#testA11y').addEventListener('click', accessibilityQuickCheck);
  $('#collapseAll').addEventListener('click', () => {
    Array.from(document.querySelectorAll('.acc-item')).forEach(acc => {
      const btn = acc.querySelector('button[aria-controls]');
      const body = acc.querySelector('.acc-body');
      if (btn && body) {
        acc.setAttribute('aria-expanded', 'false');
        btn.setAttribute('aria-expanded', 'false');
        body.style.maxHeight = 0;
        const ch = btn.querySelector('.chev'); if (ch) ch.textContent = '▸';
      }
    });
  });
  $('#modalClose').addEventListener('click', closeModal);
  $('#modalBackdrop').addEventListener('click', e => { if (e.target === $('#modalBackdrop')) closeModal(); });
  document.addEventListener('focusin', stopAutoplay);
  document.addEventListener('focusout', startAutoplay);
  Array.from($('#sliderDots').children).forEach((d, i) => d.setAttribute('aria-label', `Go to slide ${i + 1}`));
}

document.addEventListener('DOMContentLoaded', init);
