document.addEventListener('DOMContentLoaded', () => {

  const topTrack = document.getElementById('topMarquee');
  if (topTrack && !topTrack.classList.contains('is-cloned')) {
    topTrack.innerHTML += topTrack.innerHTML;
    topTrack.classList.add('is-cloned');
  }

  const cards = Array.from(document.querySelectorAll('.acc-card'));
  const rail  = document.getElementById('accordion');
  if (!cards.length || !rail) return;

  const isMobile = () => window.matchMedia('(max-width: 768px)').matches;

  const centerCard = (card) => {
    if (!rail || !card) return;
    try { card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' }); return; } catch (e) {}
    const railRect = rail.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const current = rail.scrollLeft;
    const cardCenter = (cardRect.left - railRect.left) + (cardRect.width / 2);
    const railCenter = railRect.width / 2;
    rail.scrollTo({ left: current + (cardCenter - railCenter), behavior: 'smooth' });
  };

  const setActiveByIndex = (idx, doCenter = false) => {
    const safe = (idx + cards.length) % cards.length;
    cards.forEach(c => c.classList.remove('active'));
    const next = cards[safe];
    next.classList.add('active');
    if (doCenter && isMobile()) centerCard(next);
  };

  const getActiveIndex = () => cards.findIndex(c => c.classList.contains('active'));

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let introDone = false, introCanceled = false, introRunning = false;

  const cancelIntro = () => { introCanceled = true; introRunning = false; };
  ['pointerdown','touchstart','mousedown','keydown','wheel'].forEach(evt => {
    rail.addEventListener(evt, cancelIntro, { passive: true, once: true });
  });

  cards.forEach((card, i) => {
    card.addEventListener('mouseenter', () => {
      if (introRunning) return;
      if (window.matchMedia('(hover: hover)').matches) setActiveByIndex(i, false);
    });

    card.addEventListener('click', () => {
      if (introRunning) cancelIntro();
      if (!isMobile()) { setActiveByIndex(i, false); return; }
      const activeIdx = getActiveIndex();
      if (i === activeIdx) setActiveByIndex(activeIdx + 1, true);
      else setActiveByIndex(i, true);
    });

    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (introRunning) cancelIntro();
        if (isMobile()) {
          const activeIdx = getActiveIndex();
          if (i === activeIdx) setActiveByIndex(activeIdx + 1, true);
          else setActiveByIndex(i, true);
        } else {
          setActiveByIndex(i, false);
        }
      }
    });
  });

  window.addEventListener('load', () => {
    if (isMobile()) {
      const active = cards.find(c => c.classList.contains('active')) || cards[0];
      centerCard(active);
    }
  });

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  async function playIntro() {
    if (introDone || introCanceled || reduceMotion) return;
    introDone = true;
    introRunning = true;

    const start = Math.max(0, getActiveIndex());
    const sequence = [start + 1, start + 2, start + 3];
    const stepDelay = 620;

    await sleep(240);
    if (introCanceled) return;

    for (let k = 0; k < sequence.length; k++) {
      if (introCanceled) return;
      const idx = sequence[k];
      const last = (k === sequence.length - 1);
      setActiveByIndex(idx, last);
      await sleep(stepDelay);
    }

    introRunning = false;
  }
if (!isMobile()) {
  requestAnimationFrame(() => { playIntro(); });
}
  if (!reduceMotion && window.gsap) {
    gsap.from(".hero-kicker", { opacity: 0, y: 12, duration: 0.7, ease: "power2.out" });
    gsap.from(".hero-title",  { opacity: 0, y: 26, duration: 0.9, delay: 0.05, ease: "power2.out" });
    gsap.from(".hero-sub",    { opacity: 0, y: 18, duration: 0.9, delay: 0.10, ease: "power2.out" });
  }
});
