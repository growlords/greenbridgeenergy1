export function initNavbar() {
  const header = document.querySelector('.site-header');
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-nav-drawer');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const quoteModal = document.getElementById('quick-quote-modal');
  const quoteClose = document.getElementById('quick-quote-close');
  const getQuoteBtns = document.querySelectorAll('.btn-get-quote-trigger');

  // Compact glassmorphism on scroll
  function onScroll() {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu toggle
  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('active');
      mobileToggle.setAttribute('aria-expanded', String(isOpen));
      mobileToggle.classList.toggle('open', isOpen);
    });

    // Close mobile menu on clicking any link
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        mobileToggle.classList.remove('open');
      });
    });
  }

  // Quick Quote Modal
  function openQuoteModal() {
    if (quoteModal) {
      quoteModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeQuoteModal() {
    if (quoteModal) {
      quoteModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  getQuoteBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      // If we are already on contact page, scroll to form, else navigate or open modal
      if (window.location.hash === '#contact') {
        const form = document.getElementById('contact-form');
        form?.scrollIntoView({ behavior: 'smooth' });
      } else {
        openQuoteModal();
      }
    });
  });

  if (quoteClose) quoteClose.addEventListener('click', closeQuoteModal);
  if (quoteModal) {
    quoteModal.addEventListener('click', (e) => {
      if (e.target === quoteModal) closeQuoteModal();
    });
  }

  // Quick quote form submission inside modal
  const modalForm = document.getElementById('modal-quote-form');
  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = modalForm.querySelector('button[type="submit"]');
      const original = btn.innerHTML;
      btn.innerHTML = '<span>Processing Consultation...</span>';
      setTimeout(() => {
        closeQuoteModal();
        window.location.hash = '#contact';
        alert('Thank you! Your quote request has been initiated. Our engineers are reviewing your location.');
        btn.innerHTML = original;
        modalForm.reset();
      }, 900);
    });
  }
}
