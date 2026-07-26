(() => {
  const headerStyle = document.createElement('link');
  headerStyle.rel = 'stylesheet';
  headerStyle.href = 'header.css';
  document.head.appendChild(headerStyle);

  const presentation = document.getElementById('presentation');
  const slides = [...document.querySelectorAll('.slide')];
  const progressCurrent = document.querySelector('.progress-current');
  const progressBar = document.querySelector('.progress-track i');
  const prevButton = document.querySelector('[data-prev]');
  const nextButton = document.querySelector('[data-next]');
  const header = document.querySelector('.site-header');
  const legacyTitle = document.querySelector('.header-title');
  const legacyToggle = document.querySelector('.menu-toggle');
  const legacyMenu = document.getElementById('section-menu');
  let currentIndex = 0;

  legacyTitle?.remove();
  legacyToggle?.remove();
  legacyMenu?.remove();

  const navigation = document.createElement('nav');
  navigation.className = 'guide-nav';
  navigation.setAttribute('aria-label', '프로젝트 안내 메뉴');
  navigation.innerHTML = `
    <a href="#scope" data-nav-group="scope">업무 범위</a>
    <a href="#expertise-a" data-nav-group="expertise">전문 역량</a>
    <a href="#process" data-nav-group="process">진행 방식</a>
    <a href="#partnership" data-nav-group="terms">견적·계약 안내</a>
    <a class="nav-inquiry" href="#contact" data-nav-group="inquiry">프로젝트 문의</a>
  `;
  header?.appendChild(navigation);

  const navLinks = [...navigation.querySelectorAll('a')];
  const sectionGroups = {
    cover: null,
    need: null,
    'expertise-a': 'expertise',
    'expertise-b': 'expertise',
    scope: 'scope',
    outputs: 'scope',
    process: 'process',
    partnership: 'terms',
    contact: 'inquiry'
  };

  const pad = (number) => String(number).padStart(2, '0');

  function setActiveNavigation(slide) {
    const activeGroup = sectionGroups[slide.id] || null;
    navLinks.forEach((link) => {
      const isActive = link.dataset.navGroup === activeGroup;
      link.classList.toggle('is-active', isActive);
      if (isActive) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }

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
    setActiveNavigation(slides[currentIndex]);
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

  document.addEventListener('keydown', (event) => {
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
