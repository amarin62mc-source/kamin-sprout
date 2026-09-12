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
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  mainNav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      mainNav.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  /* ---------- Active nav link on scroll ---------- */
  var sectionIds = ['home', 'products', 'promo', 'contact'];
  var sections = sectionIds.map(function (id) { return document.getElementById(id); }).filter(Boolean);
  var navLinks = document.querySelectorAll('.nav-link');
  function setActiveLink() {
    var scrollPos = window.scrollY + 160;
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

  /* ---------- Toast helper ---------- */
  var toast = document.getElementById('toast');
  var toastTimer;
  function showToast(html, duration) {
    toast.innerHTML = html;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove('show');
    }, duration || 4000);
  }

  /* ---------- Account button ---------- */
  var accountBtn = document.getElementById('accountBtn');
  accountBtn.addEventListener('click', function () {
    showToast('ระบบสมาชิกยังไม่เปิดให้บริการ ติดตามข่าวสารได้ทาง ' +
      '<a href="https://instagram.com" target="_blank" rel="noopener">Instagram</a> หรือ ' +
      '<a href="https://line.me" target="_blank" rel="noopener">LINE</a>');
  });

  /* ---------- Cart button (scroll to contact) ---------- */
  var cartBtn = document.getElementById('cartBtn');
  cartBtn.addEventListener('click', function () {
    var contact = document.getElementById('contact');
    if (contact) contact.scrollIntoView({ behavior: 'smooth' });
  });

  /* ---------- Wishlist toggle ---------- */
  document.querySelectorAll('.wishlist-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var isActive = btn.classList.toggle('active');
      btn.setAttribute('aria-pressed', String(isActive));
    });
  });

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
  var count = 0;

  document.querySelectorAll('.btn-cart').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var name = btn.dataset.name || 'สินค้านี้';
      count += 1;
      cartCount.textContent = String(count);
      cartCount.classList.remove('bump');
      void cartCount.offsetWidth;
      cartCount.classList.add('bump');

      showToast('เพิ่ม "' + name + '" แล้ว สนใจสั่งซื้อจริงติดต่อผ่าน ' +
        '<a href="https://instagram.com" target="_blank" rel="noopener">Instagram</a>, ' +
        '<a href="https://lazada.co.th" target="_blank" rel="noopener">Lazada</a> หรือ ' +
        '<a href="https://line.me" target="_blank" rel="noopener">LINE</a>', 4500);
    });
  });

});
