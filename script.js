(() => {
  const presentation = document.getElementById('presentation');
  const slides = [...document.querySelectorAll('.slide')];
  const progressCurrent = document.querySelector('.progress-current');
  const progressBar = document.querySelector('.progress-track i');
  const prevButton = document.querySelector('[data-prev]');
  const nextButton = document.querySelector('[data-next]');
  const menu = document.getElementById('section-menu');
  const menuToggle = document.querySelector('.menu-toggle');
  const menuClose = document.querySelector('[data-menu-close]');
  let currentIndex = 0;

  const pad = (number) => String(number).padStart(2, '0');

  function setActiveSlide(index) {
    currentIndex = Math.max(0, Math.min(index, slides.length - 1));
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle('is-active', slideIndex === currentIndex);
    });
    progressCurrent.textContent = pad(currentIndex + 1);
    progressBar.style.height = `${100 / slides.length}%`;
    progressBar.style.transform = `translateY(${currentIndex * 100}%)`;
    prevButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex === slides.length - 1;
    document.title = `${pad(currentIndex + 1)} — ${slides[currentIndex].dataset.title} | UNDEFINERY`;
  }

  function moveTo(index) {
    const target = slides[Math.max(0, Math.min(index, slides.length - 1))];
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  const observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    const index = slides.indexOf(visible.target);
    if (index >= 0) setActiveSlide(index);
  }, { root: presentation, threshold: [0.45, 0.6, 0.75] });

  slides.forEach((slide) => observer.observe(slide));
  setActiveSlide(0);

  prevButton.addEventListener('click', () => moveTo(currentIndex - 1));
  nextButton.addEventListener('click', () => moveTo(currentIndex + 1));

  function openMenu() {
    menu.classList.add('is-open');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    menu.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  menuToggle.addEventListener('click', () => {
    menu.classList.contains('is-open') ? closeMenu() : openMenu();
  });
  menuClose.addEventListener('click', closeMenu);
  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
    if (menu.classList.contains('is-open')) return;
    if (['ArrowDown', 'PageDown', ' '].includes(event.key)) {
      event.preventDefault();
      moveTo(currentIndex + 1);
    }
    if (['ArrowUp', 'PageUp'].includes(event.key)) {
      event.preventDefault();
      moveTo(currentIndex - 1);
    }
    if (event.key === 'Home') moveTo(0);
    if (event.key === 'End') moveTo(slides.length - 1);
  });

  document.querySelectorAll('[data-accordion]').forEach((group) => {
    group.querySelectorAll('article > button').forEach((button) => {
      button.addEventListener('click', () => {
        const item = button.parentElement;
        const alreadyOpen = item.classList.contains('is-open');
        group.querySelectorAll('article').forEach((article) => {
          article.classList.remove('is-open');
          const articleButton = article.querySelector(':scope > button');
          articleButton.setAttribute('aria-expanded', 'false');
          articleButton.querySelector('i').textContent = '＋';
        });
        if (!alreadyOpen) {
          item.classList.add('is-open');
          button.setAttribute('aria-expanded', 'true');
          button.querySelector('i').textContent = '−';
        }
      });
    });
  });

  const cover = document.getElementById('cover');
  const ambient = cover.querySelector('.ambient-light');
  if (window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
    cover.addEventListener('pointermove', (event) => {
      ambient.style.left = `${event.clientX}px`;
      ambient.style.top = `${event.clientY}px`;
    });
  }
})();
