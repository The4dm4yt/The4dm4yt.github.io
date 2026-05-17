/* ================================================================
   GOLDEN ERA — main.js
   Shared across all pages
   ================================================================ */

'use strict';

// ── THEME ────────────────────────────────────────────────────────
(function initTheme() {
  const saved = localStorage.getItem('ge-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
})();

document.addEventListener('DOMContentLoaded', () => {

  // ── THEME TOGGLE ──────────────────────────────────────────────
  const themeBtn = document.getElementById('btn-theme');
  const html = document.documentElement;

  function setTheme(t) {
    html.setAttribute('data-theme', t);
    localStorage.setItem('ge-theme', t);
    if (themeBtn) {
      themeBtn.setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      themeBtn.querySelector('.theme-icon').textContent = t === 'dark' ? '☀️' : '🌙';
    }
  }

  if (themeBtn) {
    const current = html.getAttribute('data-theme') || 'dark';
    setTheme(current);
    themeBtn.addEventListener('click', () => {
      setTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
  }

  // ── HAMBURGER / MOBILE NAV ────────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const navRight  = document.getElementById('nav-right');

  if (hamburger && navRight) {
    hamburger.addEventListener('click', () => {
      const open = navRight.classList.toggle('is-open');
      hamburger.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });

    // Close on link click
    navRight.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('click', () => {
        navRight.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('pointerdown', e => {
      const navbar = document.getElementById('main-nav');
      if (navbar && !navbar.contains(e.target) && navRight.classList.contains('is-open')) {
        navRight.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });

    // Close on Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && navRight.classList.contains('is-open')) {
        navRight.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        hamburger.focus();
      }
    });
  }

  // ── NAVBAR SCROLL SHADOW ──────────────────────────────────────
  const navbar = document.getElementById('main-nav');
  if (navbar) {
    const onScroll = () => {
      navbar.style.boxShadow = window.scrollY > 10
        ? '0 2px 24px rgba(0,0,0,0.5)'
        : 'none';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ── ACCORDION ────────────────────────────────────────────────
  function closeAccordionItem(item) {
    item.classList.remove('is-open');
    const t = item.querySelector('.accordion__trigger');
    const p = item.querySelector('.accordion__panel');
    if (t) t.setAttribute('aria-expanded', 'false');
    if (p) p.style.maxHeight = '0';
  }

  function openAccordionItem(item) {
    item.classList.add('is-open');
    const t = item.querySelector('.accordion__trigger');
    const p = item.querySelector('.accordion__panel');
    const inner = p && p.querySelector('.accordion__panel-inner');
    if (t) t.setAttribute('aria-expanded', 'true');
    if (p && inner) p.style.maxHeight = (inner.scrollHeight + 32) + 'px';
  }

  document.querySelectorAll('.accordion__item').forEach(item => {
    const trigger = item.querySelector('.accordion__trigger');
    const panel   = item.querySelector('.accordion__panel');
    if (!trigger || !panel) return;

    // Initialise
    if (item.classList.contains('is-open')) {
      openAccordionItem(item);
    } else {
      panel.style.maxHeight = '0';
    }

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      item.closest('.accordion').querySelectorAll('.accordion__item').forEach(i => closeAccordionItem(i));
      if (!isOpen) openAccordionItem(item);
    });
  });

  // ── LIGHTBOX ─────────────────────────────────────────────────
  const lightbox   = document.getElementById('lightbox');
  const lbImg      = document.getElementById('lb-img');
  const lbCaption  = document.getElementById('lb-caption');
  const lbClose    = document.getElementById('lb-close');
  const lbPrev     = document.getElementById('lb-prev');
  const lbNext     = document.getElementById('lb-next');
  const lbAnnounce = document.getElementById('lb-announce');

  let galleryCards = [];
  let currentLbIdx = 0;

  function openLightbox(idx) {
    galleryCards = Array.from(document.querySelectorAll('.gallery-card[data-img]'));
    if (!galleryCards.length || !lightbox || !lbImg) return;
    currentLbIdx = idx;
    const card = galleryCards[idx];
    lbImg.src     = card.dataset.img;
    lbImg.alt     = card.dataset.alt || '';
    if (lbCaption) lbCaption.textContent = card.dataset.caption || '';
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    lbClose?.focus();
    if (lbAnnounce) lbAnnounce.textContent = `Image ${idx + 1} of ${galleryCards.length}: ${card.dataset.caption || ''}`;
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    // Return focus to the card that opened it
    galleryCards[currentLbIdx]?.focus();
  }

  function shiftLightbox(dir) {
    galleryCards = Array.from(document.querySelectorAll('.gallery-card[data-img]'));
    currentLbIdx = (currentLbIdx + dir + galleryCards.length) % galleryCards.length;
    const card = galleryCards[currentLbIdx];
    if (lbImg) { lbImg.src = card.dataset.img; lbImg.alt = card.dataset.alt || ''; }
    if (lbCaption) lbCaption.textContent = card.dataset.caption || '';
    if (lbAnnounce) lbAnnounce.textContent = `Image ${currentLbIdx + 1} of ${galleryCards.length}: ${card.dataset.caption || ''}`;
  }

  if (lbClose)  lbClose.addEventListener('click', closeLightbox);
  if (lbPrev)   lbPrev.addEventListener('click',  () => shiftLightbox(-1));
  if (lbNext)   lbNext.addEventListener('click',  () => shiftLightbox(1));

  if (lightbox) {
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  }

  document.addEventListener('keydown', e => {
    if (!lightbox || lightbox.getAttribute('aria-hidden') === 'true') return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   shiftLightbox(-1);
    if (e.key === 'ArrowRight')  shiftLightbox(1);
  });

  // Wire up gallery cards
  document.querySelectorAll('.gallery-card[data-img]').forEach((card, idx) => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `View image: ${card.dataset.caption || card.dataset.alt || 'gallery image'}`);
    card.addEventListener('click', () => openLightbox(idx));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(idx); }
    });
  });

  // ── ARTIST MODAL ─────────────────────────────────────────────
  const modalBackdrop = document.getElementById('artist-modal');
  const modalTitle    = document.getElementById('modal-title');
  const modalRole     = document.getElementById('modal-role');
  const modalBody     = document.getElementById('modal-body');
  const modalClose    = document.getElementById('modal-close');
  let   modalOpener   = null;

  const PROFILES = {
    herc: {
      name: 'DJ Kool Herc',
      role: 'The Father of Hip-Hop',
      bio: 'Born Clive Campbell in Kingston, Jamaica, DJ Kool Herc moved to the South Bronx as a child. On August 11, 1973, he threw a back-to-school party at 1520 Sedgwick Avenue — an event widely recognised as the birth of hip-hop. His "Merry-Go-Round" technique of looping the percussion break sections of records using two turntables created the musical and cultural foundation upon which everything else was built.'
    },
    flash: {
      name: 'Grandmaster Flash',
      role: 'DJ Pioneer & Innovator',
      bio: 'Joseph Saddler, known as Grandmaster Flash, elevated DJing into a precise art form. He developed cutting, scratching, and the "Quick Mix Theory" — techniques that transformed turntables into instruments. His 1982 track "The Message" with the Furious Five brought social commentary to mainstream audiences, proving hip-hop could be both artistically ambitious and politically powerful.'
    },
    bambaataa: {
      name: 'Afrika Bambaataa',
      role: 'The Godfather of Hip-Hop',
      bio: 'Lance Taylor, aka Afrika Bambaataa, founded the Universal Zulu Nation in 1973 and codified hip-hop\'s four elements: MCing, DJing, b-boying, and graffiti art. His 1982 electro classic "Planet Rock" fused hip-hop with Kraftwerk\'s electronic sounds, influencing electronic dance music for decades. His Zulu Nation organisation channelled gang energy into creative expression.'
    },
    rundmc: {
      name: 'Run-DMC',
      role: 'Kings of Rock',
      bio: 'Run-DMC smashed the wall between hip-hop and rock with their 1986 collaboration "Walk This Way" with Aerosmith. Their album "Raising Hell" became the first hip-hop record to go platinum, opening mainstream doors. Their aesthetic — Adidas, black leather, no laces — defined a generation\'s style and proved rap had commercial staying power.'
    },
    pe: {
      name: 'Public Enemy',
      role: 'Political Missionaries',
      bio: 'Formed in Long Island in 1985, Public Enemy used hip-hop as a vehicle for Black empowerment and political activism. Chuck D\'s dense, confrontational rhymes paired with the Bomb Squad\'s layered, noise-heavy productions created an entirely new sonic template. Albums like "It Takes a Nation of Millions to Hold Us Back" and "Fear of a Black Planet" remain benchmarks of politically conscious music.'
    },
    nwa: {
      name: 'N.W.A',
      role: 'Gangsta Rap Pioneers',
      bio: 'Straight Outta Compton, N.W.A brought the realities of life in Compton, California to a global audience. Their unfiltered language and raw storytelling was controversial and revolutionary in equal measure. The group launched the careers of Dr. Dre, Ice Cube, Eazy-E, MC Ren, and DJ Yella — artists who would go on to reshape popular music for the next three decades.'
    },
    llcoolj: {
      name: 'LL Cool J',
      role: 'Ladies Love Cool James',
      bio: 'James Todd Smith signed to the newly founded Def Jam Recordings at just 16. His debut single "I Need a Beat" helped establish Def Jam as a label. LL Cool J became one of the first solo rap superstars, balancing hard-hitting street rap with romantic ballads like "I Need Love" — proving hip-hop could have commercial breadth without sacrificing credibility.'
    },
    rakim: {
      name: 'Rakim',
      role: 'The God MC',
      bio: 'William Griffin Jr., known as Rakim, is widely regarded as one of the greatest MCs in history. With Eric B., he redefined what was possible in rap lyricism — introducing complex internal rhyme schemes, multisyllabic patterns, and a cool, controlled delivery that stood in sharp contrast to the shouting styles of the era. Albums like "Paid in Full" and "Follow the Leader" set a standard that rappers have chased ever since.'
    }
  };

  function openModal(id) {
    const p = PROFILES[id];
    if (!p || !modalBackdrop) return;
    modalOpener = document.activeElement;
    if (modalTitle) modalTitle.textContent = p.name;
    if (modalRole)  modalRole.textContent  = p.role;
    if (modalBody)  modalBody.textContent  = p.bio;
    modalBackdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    modalClose?.focus();
  }

  function closeModal() {
    if (!modalBackdrop) return;
    modalBackdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    modalOpener?.focus();
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', e => { if (e.target === modalBackdrop) closeModal(); });
  }
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modalBackdrop?.getAttribute('aria-hidden') === 'false') closeModal();
  });

  // Wire up artist cards
  document.querySelectorAll('.btn-view[data-artist]').forEach(btn => {
    btn.addEventListener('click', () => openModal(btn.dataset.artist));
  });

  // ── REQUEST FORM ─────────────────────────────────────────────
  const reqForm    = document.getElementById('request-form');
  const reqSuccess = document.getElementById('req-success');

  if (reqForm) {
    reqForm.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;

      // Simple validation
      reqForm.querySelectorAll('[required]').forEach(field => {
        const group = field.closest('.form-group');
        if (!field.value.trim()) {
          valid = false;
          group?.classList.add('has-error');
        } else {
          group?.classList.remove('has-error');
        }
      });

      // Email format check
      const emailField = reqForm.querySelector('input[type="email"]');
      if (emailField && emailField.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
        valid = false;
        emailField.closest('.form-group')?.classList.add('has-error');
      }

      if (!valid) return;

      reqForm.reset();
      reqForm.querySelectorAll('.form-group').forEach(g => g.classList.remove('has-error'));
      if (reqSuccess) {
        reqSuccess.classList.add('is-visible');
        reqSuccess.focus();
        setTimeout(() => reqSuccess.classList.remove('is-visible'), 6000);
      }
    });

    // Live validation on blur
    reqForm.querySelectorAll('input, textarea').forEach(field => {
      field.addEventListener('blur', () => {
        const group = field.closest('.form-group');
        if (field.hasAttribute('required') && !field.value.trim()) {
          group?.classList.add('has-error');
        } else {
          group?.classList.remove('has-error');
        }
      });
    });
  }

  // ── MUSIC PLAYER ─────────────────────────────────────────────
  const TRACKS = [
    { name: "Rapper's Delight", artist: 'The Sugarhill Gang',     dur: '6:30', secs: 390,
      img: '../assets/images/rappers-delight.jpg',
      desc: 'Classic hip-hop track with funky bassline and call-and-response vocals. 1979.' },
    { name: 'The Message',       artist: 'Grandmaster Flash',      dur: '7:11', secs: 431,
      img: '../assets/images/the-message.jpg',
      desc: 'Groundbreaking social commentary over a sparse electronic beat. 1982.' },
    { name: 'Planet Rock',       artist: 'Afrika Bambaataa',       dur: '4:57', secs: 297,
      img: '../assets/images/planet-rock.jpg',
      desc: 'Electro hip-hop fusion that bridged Bronx block parties and Düsseldorf synthesisers. 1982.' },
    { name: 'Walk This Way',     artist: 'Run-DMC ft. Aerosmith',  dur: '5:10', secs: 310,
      img: '../assets/images/raising-hell.jpg',
      desc: 'The track that broke down the wall between hip-hop and rock. 1986.' },
    { name: 'Fight the Power',   artist: 'Public Enemy',           dur: '4:42', secs: 282,
      img: '../assets/images/fight-the-power.jpg',
      desc: 'An anthem of resistance and empowerment. Dense Bomb Squad production. 1989.' },
  ];

  let currentTrack = 0;
  let playing      = false;
  let progress     = 0;
  let ticker       = null;

  const playBtn     = document.getElementById('player-play');
  const prevBtn     = document.getElementById('player-prev');
  const nextBtn     = document.getElementById('player-next');
  const trackName   = document.getElementById('player-track-name');
  const artistName  = document.getElementById('player-artist-name');
  const artImg      = document.getElementById('player-art');
  const currentTime = document.getElementById('player-current');
  const totalTime   = document.getElementById('player-total');
  const progFill    = document.getElementById('player-fill');
  const progTrack   = document.getElementById('player-track');
  const audioDesc   = document.getElementById('player-desc');

  function fmtTime(s) {
    return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  }

  function loadTrack(idx, autoPlay) {
    currentTrack = idx;
    progress = 0;
    const t = TRACKS[idx];
    if (trackName)  trackName.textContent  = t.name;
    if (artistName) artistName.textContent = t.artist;
    if (artImg)     { artImg.src = t.img; artImg.alt = t.name + ' album art'; }
    if (currentTime) currentTime.textContent = '0:00';
    if (totalTime)   totalTime.textContent   = t.dur;
    if (progFill)    progFill.style.width    = '0%';
    if (audioDesc)   audioDesc.innerHTML     = `<strong>Audio Description:</strong> ${t.desc}`;
    document.querySelectorAll('.playlist__item').forEach((el, i) =>
      el.classList.toggle('is-active', i === idx)
    );
    if (playBtn) playBtn.setAttribute('aria-label', 'Play ' + t.name);
    if (autoPlay) startPlay();
  }

  function startPlay() {
    playing = true;
    if (playBtn) { playBtn.textContent = '⏸'; playBtn.setAttribute('aria-label', 'Pause'); }
    clearInterval(ticker);
    ticker = setInterval(() => {
      progress++;
      const t = TRACKS[currentTrack];
      if (progress >= t.secs) { progress = 0; loadTrack((currentTrack + 1) % TRACKS.length, true); return; }
      const pct = (progress / t.secs) * 100;
      if (progFill)    progFill.style.width    = pct + '%';
      if (currentTime) currentTime.textContent = fmtTime(progress);
    }, 1000);
  }

  function stopPlay() {
    playing = false;
    clearInterval(ticker);
    if (playBtn) { playBtn.textContent = '▶'; playBtn.setAttribute('aria-label', 'Play'); }
  }

  if (playBtn) {
    playBtn.addEventListener('click', () => { playing ? stopPlay() : startPlay(); });
  }
  if (prevBtn) prevBtn.addEventListener('click', () => loadTrack((currentTrack - 1 + TRACKS.length) % TRACKS.length, playing));
  if (nextBtn) nextBtn.addEventListener('click', () => loadTrack((currentTrack + 1) % TRACKS.length, playing));

  if (progTrack) {
    progTrack.addEventListener('click', e => {
      const pct = e.offsetX / progTrack.offsetWidth;
      progress = Math.floor(pct * TRACKS[currentTrack].secs);
      if (progFill)    progFill.style.width    = (pct * 100) + '%';
      if (currentTime) currentTime.textContent = fmtTime(progress);
    });
  }

  document.querySelectorAll('.playlist__item[data-track]').forEach(item => {
    item.addEventListener('click', () => loadTrack(+item.dataset.track, playing));
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); loadTrack(+item.dataset.track, playing); }
    });
  });

  // Init player if on artists page
  if (playBtn) loadTrack(0, false);

  // ── GALLERY FILTER ───────────────────────────────────────────
  document.querySelectorAll('.filter-btn[data-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      const f = btn.dataset.filter;
      document.querySelectorAll('.filter-btn').forEach(b => {
        b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
      });
      document.querySelectorAll('.gallery-card[data-cat]').forEach(card => {
        const show = f === 'all' || card.dataset.cat === f;
        card.style.display = show ? '' : 'none';
        card.setAttribute('aria-hidden', show ? 'false' : 'true');
      });
    });
  });

  // ── TIMELINE SEARCH ──────────────────────────────────────────
  const tlSearch = document.getElementById('timeline-search');
  const tlBtn    = document.getElementById('timeline-search-btn');

  function doTimelineSearch() {
    const q = tlSearch?.value.toLowerCase().trim() || '';
    document.querySelectorAll('.timeline__entry[data-keywords]').forEach(entry => {
      const hit = !q || entry.dataset.keywords.includes(q) || entry.textContent.toLowerCase().includes(q);
      entry.style.display = hit ? '' : 'none';
    });
  }
  if (tlBtn)    tlBtn.addEventListener('click', doTimelineSearch);
  if (tlSearch) tlSearch.addEventListener('keydown', e => { if (e.key === 'Enter') doTimelineSearch(); });

  // ── ARTIST SEARCH ────────────────────────────────────────────
  const artistSearch    = document.getElementById('artist-search');
  const artistSearchBtn = document.getElementById('artist-search-btn');

  function doArtistSearch() {
    const q = artistSearch?.value.toLowerCase().trim() || '';
    document.querySelectorAll('.artist-card[data-keywords]').forEach(card => {
      const hit = !q || card.dataset.keywords.includes(q);
      card.style.display = hit ? '' : 'none';
    });
  }
  if (artistSearchBtn) artistSearchBtn.addEventListener('click', doArtistSearch);
  if (artistSearch)    artistSearch.addEventListener('keydown', e => { if (e.key === 'Enter') doArtistSearch(); });

  // ── SCROLL REVEAL (cards) ────────────────────────────────────
  if ('IntersectionObserver' in window) {
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.opacity  = '1';
          e.target.style.transform = 'translateY(0)';
          revealObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.artist-card, .resource-card, .gallery-card, .video-card').forEach((el, i) => {
      el.style.opacity   = '0';
      el.style.transform = 'translateY(18px)';
      el.style.transition = `opacity 0.45s ease ${(i % 4) * 0.07}s, transform 0.45s ease ${(i % 4) * 0.07}s`;
      revealObs.observe(el);
    });
  }

  // ── TRANSCRIPT TOGGLE ────────────────────────────────────────
  const transcriptBtn  = document.getElementById('transcript-toggle');
  const transcriptBody = document.getElementById('transcript-body');

  if (transcriptBtn && transcriptBody) {
    transcriptBtn.addEventListener('click', () => {
      const open = transcriptBody.hidden;
      transcriptBody.hidden = !open;
      transcriptBtn.setAttribute('aria-expanded', String(open));
    });
  }

});