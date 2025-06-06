// DOM Elements
const navMenuToggle = document.getElementById('navMenuToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const submitBtn = document.getElementById('submitBtn');

// State
let activeSection = 'home';
let isMenuOpen = false;

// Initialize
document.addEventListener('DOMContentLoaded', function () {
  initializeNavigation();
  initializeScrollDetection();
  initializeAnimations();
  addScrollToTop();
});

// Navigation Functions
function initializeNavigation() {
  navMenuToggle.addEventListener('click', toggleMobileMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', handleNavClick);
  });

  document.addEventListener('click', function (e) {
    if (!navMenu.contains(e.target) && !navMenuToggle.contains(e.target)) {
      closeMobileMenu();
    }
  });
}

function toggleMobileMenu() {
  isMenuOpen = !isMenuOpen;
  navMenu.classList.toggle('active', isMenuOpen);
  const icon = navMenuToggle.querySelector('i');
  icon.className = isMenuOpen ? 'fas fa-times' : 'fas fa-bars';
}

function closeMobileMenu() {
  isMenuOpen = false;
  navMenu.classList.remove('active');
  const icon = navMenuToggle.querySelector('i');
  icon.className = 'fas fa-bars';
}

function handleNavClick(e) {
  e.preventDefault();
  const targetSection = e.target.getAttribute('data-section');
  scrollToSection(targetSection);
  closeMobileMenu();
}

// Scroll Functions
function initializeScrollDetection() {
  window.addEventListener('scroll', debouncedScrollHandler);
  window.addEventListener('resize', handleScroll);
}

function handleScroll() {
  const sections = ['home', 'about', 'skills', 'projects', 'contact'];
  const scrollPosition = window.pageYOffset + 100;

  for (const sectionId of sections) {
    const element = document.getElementById(sectionId);
    if (element) {
      const { offsetTop, offsetHeight } = element;
      if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
        setActiveSection(sectionId);
        break;
      }
    }
  }
}

function setActiveSection(sectionId) {
  if (activeSection !== sectionId) {
    activeSection = sectionId;
    updateActiveNavLink(sectionId);
  }
}

function updateActiveNavLink(sectionId) {
  navLinks.forEach(link => {
    const linkSection = link.getAttribute('data-section');
    link.classList.toggle('active', linkSection === sectionId);
  });
}

function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId);
  if (element) {
    const offsetTop = element.offsetTop - 80;
    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth',
    });
  }
}

// Contact Form Functions
function handleFormSubmit(e) {
  e.preventDefault();

  const formData = new FormData(contactForm);
  const name = formData.get('name').trim();
  const email = formData.get('email').trim();
  const message = formData.get('message').trim();

  if (!name || !email || !message) {
    showFormStatus('Please fill in all fields', 'error');
    return;
  }

  if (!isValidEmail(email)) {
    showFormStatus('Please enter a valid email address', 'error');
    return;
  }

  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

  setTimeout(() => {
    showFormStatus("Message sent successfully! I'll get back to you soon.", 'success');
    contactForm.reset();
    submitBtn.disabled = false;
    submitBtn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';

    setTimeout(() => hideFormStatus(), 5000);
  }, 1500);
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function showFormStatus(message, type) {
  formStatus.textContent = message;
  formStatus.className = `form-status ${type}`;
  formStatus.style.display = 'block';
}

function hideFormStatus() {
  formStatus.style.display = 'none';
  formStatus.className = 'form-status';
}

// Animation Functions
function initializeAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
  };

  const observer = new IntersectionObserver(handleIntersection, observerOptions);

  const elementsToAnimate = document.querySelectorAll(
    '.skill-card, .project-card, .info-item, .detail-card, .contact-item'
  );

  elementsToAnimate.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

function handleIntersection(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}

// Scroll to Top Button
function addScrollToTop() {
  const scrollToTopBtn = document.createElement('button');
  scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
  scrollToTopBtn.className = 'scroll-to-top';
  scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: #2563eb;
        color: white;
        border: none;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    `;

  document.body.appendChild(scrollToTopBtn);

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      scrollToTopBtn.style.opacity = '1';
      scrollToTopBtn.style.visibility = 'visible';
    } else {
      scrollToTopBtn.style.opacity = '0';
      scrollToTopBtn.style.visibility = 'hidden';
    }
  });

  scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });
}

// Utility Functions
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

const debouncedScrollHandler = debounce(handleScroll, 10);

// Loading Spinner
function showLoadingAnimation() {
  const loader = document.createElement('div');
  loader.className = 'page-loader';
  loader.innerHTML = '<div class="loader-spinner"></div>';
  loader.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: #111827;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      transition: opacity 0.5s ease;
  `;

  const spinner = loader.querySelector('.loader-spinner');
  spinner.style.cssText = `
      width: 50px;
      height: 50px;
      border: 3px solid #374151;
      border-top: 3px solid #2563eb;
      border-radius: 50%;
      animation: spin 1s linear infinite;
  `;

  const style = document.createElement('style');
  style.textContent = `
      @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
      }
  `;
  document.head.appendChild(style);
  document.body.appendChild(loader);

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.style.opacity = '0';
      setTimeout(() => {
        loader.remove();
        style.remove();
      }, 500);
    }, 500);
  });
}

if (document.readyState === 'loading') {
  showLoadingAnimation();
}

// Global Error Handling
window.addEventListener('error', function (e) {
  console.error('JavaScript Error:', e.error);
});

// Prevent form resubmission
if (window.history.replaceState) {
  window.history.replaceState(null, null, window.location.href);
}

document.addEventListener('DOMContentLoaded', () => {
    if (window.location.hash === '#thankyou') {
        const thankyouSection = document.getElementById('thankyou');
        thankyouSection.classList.remove('hidden');
        scrollToSection('thankyou');
    }
});
