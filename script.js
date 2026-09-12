/* ==========================================================================
   Kamin Sprout — Interactivity
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Header shadow on scroll ---------- */
  var header = document.getElementById('siteHeader');
  function onScroll() {
    if (window.scrollY > 12) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.getElementById('navToggle');
  var mainNav = document.getElementById('mainNav');
  navToggle.addEventListener('click', function () {
    var isOpen = mainNav.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  mainNav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      mainNav.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Active nav link on scroll ---------- */
  var sections = ['home', 'products', 'about', 'reviews', 'contact']
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);
  var navLinks = document.querySelectorAll('.nav-link');
  function setActiveLink() {
    var scrollPos = window.scrollY + 140;
    var currentId = sections[0] ? sections[0].id : null;
    sections.forEach(function (section) {
      if (section.offsetTop <= scrollPos) currentId = section.id;
    });
    navLinks.forEach(function (link) {
      var match = link.getAttribute('href') === '#' + currentId;
      link.classList.toggle('active', match);
    });
  }
  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();

  /* ---------- Search panel toggle ---------- */
  var searchToggle = document.getElementById('searchToggle');
  var searchPanel = document.getElementById('searchPanel');
  searchToggle.addEventListener('click', function () {
    var isOpen = searchPanel.classList.toggle('open');
    searchToggle.setAttribute('aria-expanded', String(isOpen));
    if (isOpen) {
      var input = searchPanel.querySelector('input');
      if (input) setTimeout(function () { input.focus(); }, 250);
    }
  });

  /* ---------- Hero carousel ---------- */
  var heroSlides = [
    {
      kicker: 'เริ่มต้นสิ่งดี ๆ จากธรรมชาติ',
      text: 'เมล็ดพันธุ์คุณภาพ ปลูกง่าย โตไว เพื่อพื้นที่สีเขียวของคุณ ไม่ว่าจะเป็นระเบียงเล็ก ๆ หรือสวนหลังบ้าน เราคัดสรรมาให้คุณลงมือปลูกได้ทันที'
    },
    {
      kicker: 'เก็บเกี่ยวได้ในไม่กี่วัน',
      text: 'ผักงอกส่วนใหญ่พร้อมเก็บเกี่ยวภายใน 5-7 วัน เหมาะกับคนที่อยากเห็นผลเร็วและกินผักสดจากมือตัวเอง'
    },
    {
      kicker: 'ดูแลง่าย ไม่ต้องมีสวนใหญ่',
      text: 'แค่แสงแดดอ่อน ๆ และน้ำเปล่า ก็ปลูกผักงอกได้แล้ว เหมาะกับคอนโดและบ้านที่มีพื้นที่จำกัด'
    }
  ];
  var heroTitle = document.getElementById('heroTitle');
  var heroText = document.getElementById('heroText');
  var dotsWrap = document.getElementById('heroDots');
  var dots = Array.prototype.slice.call(dotsWrap.querySelectorAll('.dot'));
  var kickerEl = document.querySelector('.hero-kicker');
  var slideIndex = 0;
  var slideTimer;

  function showSlide(i) {
    slideIndex = i;
    var slide = heroSlides[i];
    heroTitle.style.opacity = 0;
    heroText.style.opacity = 0;
    kickerEl.style.opacity = 0;
    setTimeout(function () {
      kickerEl.textContent = slide.kicker;
      heroText.textContent = slide.text;
      heroTitle.style.opacity = 1;
      heroText.style.opacity = 1;
      kickerEl.style.opacity = 1;
    }, 220);
    dots.forEach(function (dot, idx) {
      dot.classList.toggle('active', idx === i);
      dot.setAttribute('aria-selected', String(idx === i));
    });
  }

  function nextSlide() { showSlide((slideIndex + 1) % heroSlides.length); }

  function startAutoplay() {
    stopAutoplay();
    slideTimer = setInterval(nextSlide, 5500);
  }
  function stopAutoplay() { if (slideTimer) clearInterval(slideTimer); }

  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      showSlide(Number(dot.dataset.index));
      startAutoplay();
    });
  });

  var heroSection = document.querySelector('.hero');
  heroSection.addEventListener('mouseenter', stopAutoplay);
  heroSection.addEventListener('mouseleave', startAutoplay);
  startAutoplay();

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
          setTimeout(function () {
            entry.target.classList.add('in-view');
          }, i * 60);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  }

  /* ---------- Add to cart ---------- */
  var cartCount = document.getElementById('cartCount');
  var toast = document.getElementById('toast');
  var count = 0;
  var toastTimer;

  document.querySelectorAll('.btn-cart').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var name = btn.dataset.name || 'สินค้านี้';
      count += 1;
      cartCount.textContent = String(count);
      cartCount.classList.remove('bump');
      void cartCount.offsetWidth;
      cartCount.classList.add('bump');

      toast.innerHTML = 'เพิ่ม "' + name + '" แล้ว สนใจสั่งซื้อจริงติดต่อผ่าน ' +
        '<a href="https://instagram.com" target="_blank" rel="noopener">Instagram</a>, ' +
        '<a href="https://lazada.co.th" target="_blank" rel="noopener">Lazada</a> หรือ ' +
        '<a href="https://line.me" target="_blank" rel="noopener">LINE</a>';
      toast.classList.add('show');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(function () {
        toast.classList.remove('show');
      }, 4500);
    });
  });

  var cartBtn = document.getElementById('cartBtn');
  cartBtn.addEventListener('click', function () {
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
  });

});
