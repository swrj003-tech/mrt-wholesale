/**
 * MRT INTERNATIONAL HOLDING LLC - B2B WHOLESALE & SOURCING
 * Interactive Frontend Client Script (Vanilla JS)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Core Systems
  initHeaderScroll();
  initMobileMenu();
  initThemeToggle();
  initWholesaleCalculator();
  initSourcingForm();
  initFaqAccordion();
});

/**
 * 1. Sticky Header Scroll Effect
 */
function initHeaderScroll() {
  const header = document.querySelector('.mrt-nav');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  // Initial trigger in case of page refresh mid-scroll
  handleScroll();
  window.addEventListener('scroll', handleScroll);
}

/**
 * 2. Mobile Drawer Navigation Panel
 */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const closeBtn = document.getElementById('mobileMenuClose');
  const overlay = document.getElementById('mobileNavOverlay');
  const navLinks = document.querySelectorAll('.mobile-nav-item');

  if (!toggleBtn || !overlay) return;

  const openMenu = () => {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Stop background scrolling
  };

  const closeMenu = () => {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  toggleBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeMenu();
  });

  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

/**
 * 3. Color Theme System (Obsidian Dark vs Warm Cream Light)
 */
function initThemeToggle() {
  const themeBtn = document.getElementById('themeToggleBtn');
  if (!themeBtn) return;

  const icon = themeBtn.querySelector('span');

  // Check saved preferences
  let savedTheme = 'light';
  try {
    savedTheme = localStorage.getItem('mrt-theme') || 'light';
  } catch (e) {
    console.warn('localStorage is not accessible:', e);
  }
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme, icon);

  themeBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    try {
      localStorage.setItem('mrt-theme', newTheme);
    } catch (e) {
      console.warn('localStorage is not writable:', e);
    }
    updateThemeIcon(newTheme, icon);
  });
}

function updateThemeIcon(theme, iconSpan) {
  if (!iconSpan) return;
  if (theme === 'dark') {
    iconSpan.textContent = 'light_mode'; // Material Symbol icon for light theme option
    iconSpan.style.color = '#e5a93b';
  } else {
    iconSpan.textContent = 'dark_mode'; // Material Symbol icon for dark theme option
    iconSpan.style.color = 'var(--accent-gold)';
  }
}

/**
/**
 * 4. B2B Sourcing Logistics & Feasibility Configurator
 */
function initWholesaleCalculator() {
  const slider = document.getElementById('wholesaleSlider');
  if (!slider) return;

  // Output Elements
  const volDisplay = document.getElementById('calcVolumeDisplay');
  const tierNameDisplay = document.getElementById('calcTierName');
  const discountDisplay = document.getElementById('calcDiscountVal');
  const speedDisplay = document.getElementById('calcSpeedVal');
  const supportDisplay = document.getElementById('calcSupportVal');
  const brandingDisplay = document.getElementById('calcBrandingVal');
  const portSelect = document.getElementById('calcDestinationPort');
  const catButtons = document.querySelectorAll('.calc-cat-card');
  const timelineBar = document.getElementById('timelineBar');

  // Highlights
  const starterCard = document.getElementById('tierStarterCard');
  const scaleCard = document.getElementById('tierScaleCard');
  const eliteCard = document.getElementById('tierEliteCard');

  let selectedCategory = 'home';
  let selectedPort = 'lax';

  // Category select handlers
  catButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      catButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedCategory = btn.getAttribute('data-category');
      updateCalculator();
    });
  });

  // Port select handler
  if (portSelect) {
    portSelect.addEventListener('change', () => {
      selectedPort = portSelect.value;
      updateCalculator();
    });
  }

  const updateCalculator = () => {
    const value = parseInt(slider.value, 10);
    
    // Format volume to string
    volDisplay.textContent = value.toLocaleString() + ' Units';

    // 1. Math for CBM (Cubic Meters) based on category factors
    const cbmFactors = {
      home: 0.045,   // bulky furniture & wooden decor
      beauty: 0.004, // compact skincare & cosmetics packaging
      tech: 0.008,   // smart home devices & OEM audio parts
      pets: 0.018    // premium pet structures & infant gear
    };
    
    const factor = cbmFactors[selectedCategory] || 0.02;
    const totalCbm = parseFloat((value * factor).toFixed(2));

    // Calculate Container Type and Fleet count
    let containerSpaceText = "";
    if (totalCbm <= 15) {
      containerSpaceText = `${totalCbm.toLocaleString()} CBM (Consolidated LCL Allocation)`;
    } else if (totalCbm <= 28) {
      containerSpaceText = `${totalCbm.toLocaleString()} CBM (1x 20ft GP - FCL Cargo Space)`;
    } else if (totalCbm <= 68) {
      containerSpaceText = `${totalCbm.toLocaleString()} CBM (1x 40ft HQ - FCL Cargo Space)`;
    } else {
      const fleets = Math.ceil(totalCbm / 68);
      containerSpaceText = `${totalCbm.toLocaleString()} CBM (${fleets}x 40ft HQ Containers Fleet)`;
    }
    
    discountDisplay.textContent = containerSpaceText;

    // 2. Production & Transit lead time calculation
    let productionDays = 25;
    if (value >= 50000 && value < 250000) {
      productionDays = 30;
    } else if (value >= 250000) {
      productionDays = 35;
    }

    const voyageTransits = {
      lax: 30, // Jebel Ali/Asia to LAX/LGB via Pacific/Indian lane
      nyc: 38, // Jebel Ali/Asia to NYC/NJ via Suez/Atlantic lane
      rot: 24, // Jebel Ali/Asia to Rotterdam via Suez
      dxb: 4   // Regional Middle-East hub distribution feeder
    };
    const voyageDays = voyageTransits[selectedPort] || 30;
    const portClearingDays = 5;
    const totalTransit = productionDays + voyageDays + portClearingDays;

    const portLabels = {
      lax: 'Port of LAX/LGB',
      nyc: 'Port of NYC/NJ',
      rot: 'Port of Rotterdam',
      dxb: 'Port of Jebel Ali'
    };
    const destPortName = portLabels[selectedPort] || 'Destination Port';

    // Display formatted delivery timeline text
    speedDisplay.textContent = `Production: ${productionDays}d | Voyage: ${voyageDays}d | Port: ${portClearingDays}d — Est. Total: ${totalTransit} Days to ${destPortName}`;

    // Update the visual timeline bar
    if (timelineBar) {
      const prodPercent = Math.round((productionDays / totalTransit) * 100);
      const voyagePercent = Math.round((voyageDays / totalTransit) * 100);
      const portPercent = 100 - prodPercent - voyagePercent;

      timelineBar.innerHTML = `
        <div class="timeline-segment production-seg" style="width: ${prodPercent}%;" data-label="Prod: ${productionDays}d" title="Production: ${productionDays} days"></div>
        <div class="timeline-segment voyage-seg" style="width: ${voyagePercent}%;" data-label="Sea: ${voyageDays}d" title="Ocean Voyage: ${voyageDays} days"></div>
        <div class="timeline-segment customs-seg" style="width: ${portPercent}%;" data-label="Port: ${portClearingDays}d" title="Customs Clearing: ${portClearingDays} days"></div>
      `;
    }

    // 3. Trade Milestones & QA Inspections based on Sourcing Volume Tiers
    if (value < 50000) {
      // Tier 1: Consolidated LCL Cargo
      if (tierNameDisplay) tierNameDisplay.textContent = 'Consolidated LCL';
      supportDisplay.textContent = 'Standard Level II Pre-Shipment Inspections (AQL 2.5)';
      brandingDisplay.textContent = '30% T/T Deposit / 70% against Telex B/L Release';
      
      starterCard?.classList.add('active');
      scaleCard?.classList.remove('active');
      eliteCard?.classList.remove('active');
    } else if (value < 250000) {
      // Tier 2: Dedicated FCL Contract
      if (tierNameDisplay) tierNameDisplay.textContent = 'Dedicated FCL Sourcing';
      supportDisplay.textContent = 'Inline DUPRO + Pre-Shipment Inspections (AQL 1.5)';
      brandingDisplay.textContent = '30% T/T Deposit / 70% CAD Escrow (Wyoming Contract)';
      
      starterCard?.classList.remove('active');
      scaleCard?.classList.add('active');
      eliteCard?.classList.remove('active');
    } else {
      // Tier 3: Enterprise Sourcing Desk
      if (tierNameDisplay) tierNameDisplay.textContent = 'Enterprise Sourcing Desk';
      supportDisplay.textContent = 'Permanent Factory Floor QA Representative (AQL 1.0)';
      brandingDisplay.textContent = '100% Irrevocable Letter of Credit (L/C) at Sight / 60-Day Terms';
      
      starterCard?.classList.remove('active');
      scaleCard?.classList.remove('active');
      eliteCard?.classList.add('active');
    }

    // Update redirect button URL with chosen parameters
    const submitBtn = document.getElementById('calcSubmitBtn');
    if (submitBtn) {
      submitBtn.href = `contact.html?cat=${selectedCategory}&vol=${value}&port=${selectedPort}`;
    }
  };

  slider.addEventListener('input', updateCalculator);
  updateCalculator(); // Initial calculation
}

/**
 * 5. B2B Sourcing Inquiry Intake Form Submission Simulation
 */
function initSourcingForm() {
  const form = document.getElementById('b2bSourcingForm');
  const overlay = document.getElementById('formSuccessOverlay');
  const closeOverlayBtn = document.getElementById('closeSuccessOverlayBtn');

  if (!form) return;

  // Auto-populate Sourcing Form based on URL query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const catParam = urlParams.get('cat');
  const volParam = urlParams.get('vol');
  const portParam = urlParams.get('port');

  if (catParam) {
    const catSelect = document.getElementById('formCategory');
    if (catSelect) {
      let targetVal = catParam;
      if (catParam === 'tech') targetVal = 'electronics';
      if (catParam === 'pets') targetVal = 'lifestyle';
      catSelect.value = targetVal;
    }
  }

  if (volParam) {
    const volSelect = document.getElementById('formVolume');
    if (volSelect) {
      const units = parseInt(volParam, 10);
      if (!isNaN(units)) {
        volSelect.value = units < 50000 ? 'starter' : (units < 250000 ? 'scale' : 'elite');
      }
    }
  }

  if (portParam) {
    const incotermSelect = document.getElementById('formIncoterms');
    if (incotermSelect) {
      incotermSelect.value = portParam === 'dxb' ? 'exw' : (['lax', 'nyc'].includes(portParam) ? 'ddp' : 'fob');
    }

    const messageText = document.getElementById('formMessage');
    if (messageText && !messageText.value) {
      const portLabels = {
        lax: 'Port of Los Angeles/Long Beach (LAX/LGB)',
        nyc: 'Port of New York/New Jersey (NYC/NJ)',
        rot: 'Port of Rotterdam (ROT)',
        dxb: 'Port of Jebel Ali, Dubai (DXB)'
      };
      const categoryLabels = {
        home: 'Home, Decor & Living',
        beauty: 'Beauty, Cosmetics & Wellness',
        tech: 'Consumer Electronics & Accessories',
        pets: 'Premium Pet Products & Baby Essentials'
      };
      
      const targetPort = portLabels[portParam] || 'Specified Discharge Port';
      const catName = categoryLabels[catParam] || (catParam ? catParam.toUpperCase() : 'General Sourcing');
      const unitsNum = volParam ? parseInt(volParam, 10).toLocaleString() : '5,000';
      const incotermName = portParam === 'dxb' ? 'EXW (Ex Works)' : (['lax', 'nyc'].includes(portParam) ? 'DDP (Delivered Duty Paid)' : 'FOB (Free On Board)');

      messageText.value = `Feasibility Configuration request from homepage logistics estimator:\n` +
                          `- Sourcing Division: ${catName}\n` +
                          `- Destination Discharge Port: ${targetPort}\n` +
                          `- Target Incoterm: ${incotermName}\n` +
                          `- Annual Sourcing Volume Target: ${unitsNum} Units.\n\n` +
                          `Please supply formal manufacturing options, estimated FOB product unit budgets, raw material qualification protocols, and quality control representative fees for this project vertical.`;
    }
  }

  // Floating Labels
  const inputs = form.querySelectorAll('.form-input-text, .form-select');
  inputs.forEach(input => {
    const toggleHasValue = () => {
      if (input.value.trim() !== '') {
        input.classList.add('has-value');
      } else {
        input.classList.remove('has-value');
      }
    };

    // Check initial state
    toggleHasValue();

    input.addEventListener('blur', toggleHasValue);
    input.addEventListener('input', toggleHasValue);
    input.addEventListener('change', toggleHasValue);
  });

  // Handle Form Submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Standard Client-Side Validation check
    let isValid = true;
    inputs.forEach(input => {
      if (input.hasAttribute('required') && input.value.trim() === '') {
        isValid = false;
        input.style.borderBottomColor = '#ef4444'; // Red error alert
      } else {
        input.style.borderBottomColor = '';
      }
    });

    if (!isValid) return;

    // Simulate Sourcing Intake Submission
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="material-symbols-outlined animate-spin" style="animation: spin 1.5s linear infinite;">sync</span> PROCESSING REQUEST...`;

    setTimeout(() => {
      // Success Callback
      if (overlay) {
        overlay.classList.add('active');
      }
      form.reset();
      inputs.forEach(input => input.classList.remove('has-value'));
      
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }, 1800);
  });

  if (closeOverlayBtn && overlay) {
    closeOverlayBtn.addEventListener('click', () => {
      overlay.classList.remove('active');
    });
  }
}

/**
 * 6. FAQ Accordion Toggle System
 */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    const body = item.querySelector('.faq-body');

    if (!header || !body) return;

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items first (B2B clean aesthetic choice)
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherBody = otherItem.querySelector('.faq-body');
          if (otherBody) otherBody.style.maxHeight = null;
        }
      });

      // Toggle current item
      if (isActive) {
        item.classList.remove('active');
        body.style.maxHeight = null;
      } else {
        item.classList.add('active');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });
}
