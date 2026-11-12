/**
 * VALÉRA — Women's Strength & Wellness Atelier
 * Main Interactive Script (Vanilla JS + GSAP)
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. Theme & RTL Direction Management (with localStorage persistence)
     ========================================================================== */
  const THEME_KEY = 'valera_theme_preference';
  const DIR_KEY = 'valera_dir_preference';

  function getSavedTheme() {
    try {
      return localStorage.getItem(THEME_KEY) || 'light';
    } catch (e) {
      return 'light';
    }
  }

  function getSavedDir() {
    try {
      return localStorage.getItem(DIR_KEY) || 'ltr';
    } catch (e) {
      return 'ltr';
    }
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const toggleBtns = document.querySelectorAll('[data-theme-toggle]');
    toggleBtns.forEach((btn) => {
      const icon = btn.querySelector('i');
      const label = btn.querySelector('.theme-label-text');
      if (theme === 'dark') {
        if (icon) {
          icon.className = 'bi bi-sun-fill';
        }
        if (label) {
          label.textContent = 'Light Mode';
        }
        btn.setAttribute('aria-label', 'Switch to light theme');
        btn.setAttribute('title', 'Switch to light theme');
      } else {
        if (icon) {
          icon.className = 'bi bi-moon-stars-fill';
        }
        if (label) {
          label.textContent = 'Dark Mode';
        }
        btn.setAttribute('aria-label', 'Switch to dark theme');
        btn.setAttribute('title', 'Switch to dark theme');
      }
    });
  }

  function applyDir(dir) {
    document.documentElement.setAttribute('dir', dir);
    const rtlBtns = document.querySelectorAll('[data-rtl-toggle]');
    rtlBtns.forEach((btn) => {
      if (dir === 'rtl') {
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        btn.setAttribute('title', 'Switch to LTR layout');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
        btn.setAttribute('title', 'Switch to RTL layout');
      }
    });
  }

  // Apply immediately on load
  applyTheme(getSavedTheme());
  applyDir(getSavedDir());

  document.addEventListener('DOMContentLoaded', () => {
    applyTheme(getSavedTheme());
    applyDir(getSavedDir());

    document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        try {
          localStorage.setItem(THEME_KEY, next);
        } catch (e) {
          // ignore storage restrictions
        }
        applyTheme(next);
      });
    });

    document.querySelectorAll('[data-rtl-toggle]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('dir') || 'ltr';
        const next = current === 'rtl' ? 'ltr' : 'rtl';
        try {
          localStorage.setItem(DIR_KEY, next);
        } catch (e) {
          // ignore storage restrictions
        }
        applyDir(next);
      });
    });

    /* ==========================================================================
       2. Sticky Navbar, Home Dropdown (Hover + Click), & Mobile Drawer
       ========================================================================== */
    const navbar = document.querySelector('.valera-navbar');
    const hamburger = document.getElementById('valeraHamburger');
    const navCollapse = document.getElementById('valeraNavCollapse');
    const dropdowns = document.querySelectorAll('.valera-dropdown');

    function handleNavbarScroll() {
      if (!navbar) return;
      if (window.scrollY > 24) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
    window.addEventListener('scroll', handleNavbarScroll, { passive: true });
    handleNavbarScroll();

    // Mobile Hamburger Toggle
    if (hamburger && navCollapse) {
      hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = navCollapse.classList.toggle('show');
        hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        const icon = hamburger.querySelector('i');
        if (icon) {
          icon.className = isOpen ? 'bi bi-x-lg' : 'bi bi-list';
        }
      });
    }

    // Home Dropdown (Supports both Hover via CSS on desktop & Click toggle on all devices)
    dropdowns.forEach((dropdown) => {
      const toggle = dropdown.querySelector('.valera-dropdown-toggle');
      if (!toggle) return;

      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const wasOpen = dropdown.classList.contains('open');
        dropdowns.forEach((d) => d.classList.remove('open'));
        if (!wasOpen) {
          dropdown.classList.add('open');
          toggle.setAttribute('aria-expanded', 'true');
        } else {
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // Close dropdowns & mobile drawer when clicking outside
    document.addEventListener('click', (e) => {
      dropdowns.forEach((dropdown) => {
        if (!dropdown.contains(e.target)) {
          dropdown.classList.remove('open');
          const toggle = dropdown.querySelector('.valera-dropdown-toggle');
          if (toggle) toggle.setAttribute('aria-expanded', 'false');
        }
      });

      if (navCollapse && navCollapse.classList.contains('show')) {
        if (!navCollapse.contains(e.target) && (!hamburger || !hamburger.contains(e.target))) {
          navCollapse.classList.remove('show');
          if (hamburger) {
            hamburger.setAttribute('aria-expanded', 'false');
            const icon = hamburger.querySelector('i');
            if (icon) icon.className = 'bi bi-list';
          }
        }
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        dropdowns.forEach((d) => d.classList.remove('open'));
        if (navCollapse && navCollapse.classList.contains('show')) {
          navCollapse.classList.remove('show');
          if (hamburger) {
            hamburger.setAttribute('aria-expanded', 'false');
            const icon = hamburger.querySelector('i');
            if (icon) icon.className = 'bi bi-list';
          }
        }
      }
    });

    /* ==========================================================================
       3. Class Category & Level Filters + Schedule Filters (classes.html)
       ========================================================================== */
    const classCategoryBtns = document.querySelectorAll('[data-class-filter]');
    const classLevelBtns = document.querySelectorAll('[data-level-filter]');
    const classItems = document.querySelectorAll('.class-filter-item');
    const classCountBadge = document.getElementById('activeClassCount');

    let selectedCategory = 'all';
    let selectedLevel = 'all';

    function filterClasses() {
      if (!classItems.length) return;
      let visibleCount = 0;

      classItems.forEach((item) => {
        const itemCat = item.getAttribute('data-category') || '';
        const itemLevel = item.getAttribute('data-level') || '';

        const catMatch = selectedCategory === 'all' || itemCat === selectedCategory;
        const levelMatch = selectedLevel === 'all' || itemLevel.includes(selectedLevel);

        if (catMatch && levelMatch) {
          item.style.display = '';
          visibleCount++;
        } else {
          item.style.display = 'none';
        }
      });

      // Also hide/show category section headers if filtering by category
      document.querySelectorAll('[data-category-section]').forEach((section) => {
        const secCat = section.getAttribute('data-category-section');
        const visibleInSec = section.querySelectorAll('.class-filter-item:not([style*="display: none"])').length;
        if ((selectedCategory === 'all' || secCat === selectedCategory) && visibleInSec > 0) {
          section.style.display = '';
        } else {
          section.style.display = 'none';
        }
      });

      if (classCountBadge) {
        classCountBadge.textContent = `Showing ${visibleCount} class${visibleCount === 1 ? '' : 'es'}`;
      }
    }

    classCategoryBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        classCategoryBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        selectedCategory = btn.getAttribute('data-class-filter') || 'all';
        filterClasses();
      });
    });

    classLevelBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        classLevelBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        selectedLevel = btn.getAttribute('data-level-filter') || 'all';
        filterClasses();
      });
    });

    // Weekly Schedule Day Filter (classes.html)
    const scheduleDayBtns = document.querySelectorAll('[data-schedule-day]');
    const scheduleRows = document.querySelectorAll('[data-day-row]');

    scheduleDayBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        scheduleDayBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const day = btn.getAttribute('data-schedule-day') || 'all';

        scheduleRows.forEach((row) => {
          const rowDays = row.getAttribute('data-day-row') || '';
          if (day === 'all' || rowDays.includes(day)) {
            row.style.display = '';
          } else {
            row.style.display = 'none';
          }
        });
      });
    });

    /* ==========================================================================
       4. Trainer Category Filters (trainers.html)
       ========================================================================== */
    const trainerFilterBtns = document.querySelectorAll('[data-trainer-filter]');
    const trainerItems = document.querySelectorAll('.trainer-filter-item');

    trainerFilterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        trainerFilterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const role = btn.getAttribute('data-trainer-filter') || 'all';

        trainerItems.forEach((item) => {
          const itemRoles = item.getAttribute('data-trainer-role') || '';
          if (role === 'all' || itemRoles.includes(role)) {
            item.style.display = '';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });

    /* ==========================================================================
       5. Interactive Class / Trainer Enquiry Modal & Contact Auto-Prefill
       ========================================================================== */
    const enquiryModalEl = document.getElementById('valeraEnquiryModal');
    const modalTargetTitle = document.getElementById('modalEnquiryTarget');
    const modalProgramInput = document.getElementById('modalProgramSelect');
    const modalForm = document.getElementById('modalEnquiryForm');
    const modalSuccessAlert = document.getElementById('modalEnquirySuccess');

    document.querySelectorAll('[data-enquiry-trigger]').forEach((trigger) => {
      trigger.addEventListener('click', (e) => {
        const subject = trigger.getAttribute('data-enquiry-subject') || 'Studio Class Enquiry';
        const program = trigger.getAttribute('data-enquiry-program') || '';

        if (enquiryModalEl && typeof bootstrap !== 'undefined') {
          e.preventDefault();
          if (modalTargetTitle) modalTargetTitle.textContent = subject;
          if (modalProgramInput && program) {
            modalProgramInput.value = program;
          }
          if (modalSuccessAlert) modalSuccessAlert.classList.add('d-none');
          if (modalForm) {
            modalForm.reset();
            if (modalProgramInput && program) modalProgramInput.value = program;
            modalForm.classList.remove('d-none');
          }
          const bsModal = bootstrap.Modal.getOrCreateInstance(enquiryModalEl);
          bsModal.show();
        }
      });
    });

    if (modalForm) {
      modalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let valid = true;
        modalForm.querySelectorAll('[required]').forEach((field) => {
          if (!field.value.trim()) {
            field.classList.add('is-invalid');
            valid = false;
          } else {
            field.classList.remove('is-invalid');
          }
        });
        if (!valid) return;

        modalForm.classList.add('d-none');
        if (modalSuccessAlert) {
          modalSuccessAlert.classList.remove('d-none');
        }
      });
    }

    // URL Query Parameter Auto-Prefill on contact.html
    const urlParams = new URLSearchParams(window.location.search);
    const paramProgram = urlParams.get('program');
    const paramClass = urlParams.get('class');
    const paramTrainer = urlParams.get('trainer');

    const contactProgramSelect = document.getElementById('contactProgram');
    const contactMessageArea = document.getElementById('contactMessage');

    if (contactProgramSelect && paramProgram) {
      Array.from(contactProgramSelect.options).forEach((opt) => {
        if (opt.value.toLowerCase().includes(paramProgram.toLowerCase())) {
          contactProgramSelect.value = opt.value;
        }
      });
    }

    if (contactMessageArea && (paramClass || paramTrainer)) {
      if (paramClass) {
        contactMessageArea.value = `Hello Valéra Concierge, I would like to enquire about joining the "${paramClass}" sessions and learning more about class availability.`;
      } else if (paramTrainer) {
        contactMessageArea.value = `Hello Valéra Concierge, I would like to request a personal training or coaching consultation with ${paramTrainer}.`;
      }
    }

    /* ==========================================================================
       6. Password Visibility Toggle (Login & Sign Up)
       ========================================================================== */
    document.querySelectorAll('[data-password-toggle]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-password-toggle');
        const input = document.getElementById(targetId);
        const icon = btn.querySelector('i');
        if (!input) return;

        if (input.type === 'password') {
          input.type = 'text';
          if (icon) icon.className = 'bi bi-eye-slash';
          btn.setAttribute('aria-label', 'Hide password');
        } else {
          input.type = 'password';
          if (icon) icon.className = 'bi bi-eye';
          btn.setAttribute('aria-label', 'Show password');
        }
      });
    });

    /* ==========================================================================
       7. Form Validation & Frontend Feedback (Contact, Login, Sign Up, Newsletter)
       ========================================================================== */
    function validateEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Clear invalid state on input
    document.querySelectorAll('.form-control-valera, .form-select-valera, .form-check-input').forEach((input) => {
      input.addEventListener('input', () => input.classList.remove('is-invalid'));
      input.addEventListener('change', () => input.classList.remove('is-invalid'));
    });

    // Contact & Membership Enquiry Form
    const contactForm = document.getElementById('valeraContactForm');
    const contactSuccessBox = document.getElementById('contactFormSuccess');

    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        const nameInput = document.getElementById('contactName');
        const emailInput = document.getElementById('contactEmail');
        const phoneInput = document.getElementById('contactPhone');
        const goalSelect = document.getElementById('contactGoal');
        const programSelect = document.getElementById('contactProgram');
        const levelSelect = document.getElementById('contactLevel');

        if (nameInput && nameInput.value.trim().length < 2) {
          nameInput.classList.add('is-invalid');
          isValid = false;
        }
        if (emailInput && !validateEmail(emailInput.value.trim())) {
          emailInput.classList.add('is-invalid');
          isValid = false;
        }
        if (phoneInput && phoneInput.value.trim().length < 7) {
          phoneInput.classList.add('is-invalid');
          isValid = false;
        }
        if (goalSelect && !goalSelect.value) {
          goalSelect.classList.add('is-invalid');
          isValid = false;
        }
        if (programSelect && !programSelect.value) {
          programSelect.classList.add('is-invalid');
          isValid = false;
        }
        if (levelSelect && !levelSelect.value) {
          levelSelect.classList.add('is-invalid');
          isValid = false;
        }

        if (!isValid) return;

        // Show realistic frontend template confirmation
        if (contactSuccessBox) {
          const submittedName = nameInput ? nameInput.value.trim() : 'Member';
          const nameSpan = contactSuccessBox.querySelector('[data-submitted-name]');
          if (nameSpan) nameSpan.textContent = submittedName;
          contactSuccessBox.classList.remove('d-none');
          contactForm.reset();
          contactSuccessBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });
    }

    // Login Form Validation
    const loginForm = document.getElementById('valeraLoginForm');
    const loginFeedback = document.getElementById('loginDemoFeedback');

    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        const identifier = document.getElementById('loginIdentifier');
        const password = document.getElementById('loginPassword');

        if (identifier && identifier.value.trim().length < 4) {
          identifier.classList.add('is-invalid');
          isValid = false;
        }
        if (password && password.value.length < 6) {
          password.classList.add('is-invalid');
          isValid = false;
        }

        if (!isValid) return;

        if (loginFeedback) {
          loginFeedback.classList.remove('d-none');
        }
      });
    }

    // Forgot Password Trigger on Login Page
    const forgotTrigger = document.getElementById('forgotPasswordTrigger');
    const forgotFeedback = document.getElementById('forgotPasswordBox');
    if (forgotTrigger && forgotFeedback) {
      forgotTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        forgotFeedback.classList.toggle('d-none');
      });
    }

    // Sign Up Form Validation
    const signupForm = document.getElementById('valeraSignupForm');
    const signupFeedback = document.getElementById('signupDemoFeedback');

    if (signupForm) {
      signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        const fullName = document.getElementById('signupName');
        const email = document.getElementById('signupEmail');
        const mobile = document.getElementById('signupMobile');
        const pass = document.getElementById('signupPassword');
        const confirmPass = document.getElementById('signupConfirmPassword');
        const goal = document.getElementById('signupGoal');
        const program = document.getElementById('signupProgram');
        const terms = document.getElementById('signupTerms');

        if (fullName && fullName.value.trim().length < 2) {
          fullName.classList.add('is-invalid');
          isValid = false;
        }
        if (email && !validateEmail(email.value.trim())) {
          email.classList.add('is-invalid');
          isValid = false;
        }
        if (mobile && mobile.value.trim().length < 7) {
          mobile.classList.add('is-invalid');
          isValid = false;
        }
        if (pass && pass.value.length < 8) {
          pass.classList.add('is-invalid');
          isValid = false;
        }
        if (confirmPass && (!pass || confirmPass.value !== pass.value || !confirmPass.value)) {
          confirmPass.classList.add('is-invalid');
          isValid = false;
        }
        if (goal && !goal.value) {
          goal.classList.add('is-invalid');
          isValid = false;
        }
        if (program && !program.value) {
          program.classList.add('is-invalid');
          isValid = false;
        }
        if (terms && !terms.checked) {
          terms.classList.add('is-invalid');
          isValid = false;
        }

        if (!isValid) return;

        if (signupFeedback) {
          const userSpan = signupFeedback.querySelector('[data-signup-name]');
          if (userSpan && fullName) userSpan.textContent = fullName.value.trim();
          signupFeedback.classList.remove('d-none');
          signupForm.reset();
          signupFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });
    }

    // Footer Newsletter Form
    document.querySelectorAll('.valera-newsletter-form').forEach((form) => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = form.querySelector('input[type="email"]');
        const msgEl = form.querySelector('.newsletter-feedback');
        if (emailInput && validateEmail(emailInput.value.trim())) {
          emailInput.classList.remove('is-invalid');
          if (msgEl) {
            msgEl.textContent = 'Thank you for joining the Valéra Journal list.';
            msgEl.classList.remove('d-none');
          }
          form.reset();
        } else if (emailInput) {
          emailInput.classList.add('is-invalid');
        }
      });
    });

    /* ==========================================================================
       8. Back to Top Button
       ========================================================================== */
    const backToTopBtn = document.getElementById('valeraBackToTop');
    if (backToTopBtn) {
      window.addEventListener(
        'scroll',
        () => {
          if (window.scrollY > 420) {
            backToTopBtn.classList.add('visible');
          } else {
            backToTopBtn.classList.remove('visible');
          }
        },
        { passive: true }
      );

      backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    /* ==========================================================================
       9. Graceful Image Fallback & GSAP Subtle Editorial Animations
       ========================================================================== */
    const fallbackSvg =
      "data:image/svg+xml;charset=UTF-8," +
      encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">' +
          '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
          '<stop offset="0%" stop-color="#381D2A"/><stop offset="100%" stop-color="#181517"/>' +
          '</linearGradient></defs>' +
          '<rect width="800" height="600" fill="url(#g)"/>' +
          '<text x="50%" y="48%" dominant-baseline="middle" text-anchor="middle" fill="#C8A273" font-family="Georgia, serif" font-size="34" letter-spacing="6">VALÉRA</text>' +
          '<text x="50%" y="56%" dominant-baseline="middle" text-anchor="middle" fill="#FAF7F2" font-family="sans-serif" font-size="13" letter-spacing="4" opacity="0.75">STRENGTH &amp; WELLNESS ATELIER</text>' +
        '</svg>'
      );

    document.querySelectorAll('img').forEach((img) => {
      img.addEventListener('error', function handleImgError() {
        if (this.src !== fallbackSvg) {
          this.src = fallbackSvg;
        }
      });
    });

    if (typeof gsap !== 'undefined') {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!prefersReducedMotion) {
        const heroElements = document.querySelectorAll('[data-gsap-hero]');
        if (heroElements.length) {
          gsap.fromTo(
            heroElements,
            { y: 24, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.85,
              stagger: 0.12,
              ease: 'power3.out',
              clearProps: 'transform,opacity'
            }
          );
        }
      }
    }
    /* ==========================================================================
       10. Member Dashboard Interactions (dashboard.html)
       ========================================================================== */
    const dashSidebar = document.getElementById('dashSidebar');
    const dashBackdrop = document.getElementById('dashBackdrop');
    const dashMobileOpenBtn = document.getElementById('dashMobileOpen');
    const dashMobileCloseBtn = document.getElementById('dashMobileClose');

    function closeDashSidebar() {
      if (dashSidebar) dashSidebar.classList.remove('open');
      if (dashBackdrop) dashBackdrop.classList.remove('show');
    }

    if (dashMobileOpenBtn && dashSidebar) {
      dashMobileOpenBtn.addEventListener('click', () => {
        dashSidebar.classList.add('open');
        if (dashBackdrop) dashBackdrop.classList.add('show');
      });
    }
    if (dashMobileCloseBtn) {
      dashMobileCloseBtn.addEventListener('click', closeDashSidebar);
    }
    if (dashBackdrop) {
      dashBackdrop.addEventListener('click', closeDashSidebar);
    }

    // Dashboard Section Switching
    const dashNavTriggers = document.querySelectorAll('[data-dash-section]');
    const dashPanels = document.querySelectorAll('[data-dash-panel]');

    dashNavTriggers.forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-dash-section');
        if (!target) return;

        dashNavTriggers.forEach((b) => {
          if (b.classList.contains('dash-nav-btn')) {
            b.classList.toggle('active', b.getAttribute('data-dash-section') === target);
          }
        });

        dashPanels.forEach((panel) => {
          if (panel.getAttribute('data-dash-panel') === target) {
            panel.classList.remove('d-none');
          } else {
            panel.classList.add('d-none');
          }
        });

        closeDashSidebar();
      });
    });

    // Book / Cancel Class Buttons in Dashboard
    const bookedCountEl = document.getElementById('dashBookedCount');
    const bookBtns = document.querySelectorAll('[data-book-class]');

    function refreshBookedCount() {
      if (!bookedCountEl) return;
      const booked = document.querySelectorAll('[data-book-class].is-booked').length;
      bookedCountEl.textContent = booked;
    }

    bookBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const isBooked = btn.classList.toggle('is-booked');
        if (isBooked) {
          btn.classList.remove('btn-valera-primary');
          btn.classList.add('btn-valera-outline');
          btn.innerHTML = '<i class="bi bi-check2-circle me-1"></i> Booked (Cancel)';
        } else {
          btn.classList.remove('btn-valera-outline');
          btn.classList.add('btn-valera-primary');
          btn.innerHTML = 'Book Spot <i class="bi bi-plus-lg ms-1"></i>';
        }
        refreshBookedCount();
      });
    });

    // Dashboard Workout & Diet Day Tabs
    document.querySelectorAll('[data-plan-tab-group]').forEach((group) => {
      const groupName = group.getAttribute('data-plan-tab-group');
      const tabs = group.querySelectorAll('[data-plan-tab]');
      const contents = document.querySelectorAll(`[data-plan-content-group="${groupName}"]`);

      tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
          const key = tab.getAttribute('data-plan-tab');
          tabs.forEach((t) => t.classList.remove('active'));
          tab.classList.add('active');

          contents.forEach((c) => {
            c.classList.toggle('d-none', c.getAttribute('data-plan-content') !== key);
          });
        });
      });
    });

    // Dashboard Membership Renewal Plan Selection & Submit
    const planOptions = document.querySelectorAll('[data-renewal-plan]');
    const selectedPlanLabel = document.getElementById('selectedRenewalPlanName');
    const renewForm = document.getElementById('dashRenewForm');
    const renewSuccess = document.getElementById('dashRenewSuccess');

    planOptions.forEach((opt) => {
      opt.addEventListener('click', () => {
        planOptions.forEach((o) => o.classList.remove('selected'));
        opt.classList.add('selected');
        if (selectedPlanLabel) {
          selectedPlanLabel.textContent = opt.getAttribute('data-renewal-plan') || 'Atelier All-Access';
        }
      });
    });

    if (renewForm && renewSuccess) {
      renewForm.addEventListener('submit', (e) => {
        e.preventDefault();
        renewSuccess.classList.remove('d-none');
      });
    }
  });
})();
