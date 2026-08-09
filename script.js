/**
 * YUVRAJ THAKOR PORTFOLIO — WHITE FUTURISTIC MOTION DESIGN
 * Vanilla JavaScript + GSAP + ScrollTrigger + Lenis
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lenis Smooth Scroll
  let lenis;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Synchronize Lenis with GSAP ScrollTrigger if available
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0, 0);
    }
  }

  // Register ScrollTrigger plugin if GSAP is loaded
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // 2. Signature Portrait Unfolding Effect
  const portraitContainer = document.getElementById('portrait-unfold-container');
  const portraitUrl = 'https://media.licdn.com/dms/image/v2/D4D03AQGyjX9L5rTBDw/profile-displayphoto-crop_800_800/B4DZ65won8KUAI-/0/1781232999502?e=1787788800&v=beta&t=hVaw6FTlKnK1KlbDmljLkmkTqhDB45Iwh9vhGIBWI-c';
  
  if (portraitContainer) {
    const numPanels = 10;
    portraitContainer.innerHTML = ''; // Clear container

    for (let i = 0; i < numPanels; i++) {
      const panel = document.createElement('div');
      panel.classList.add('unfold-panel');
      
      // Panel positioning
      const leftPercent = i * (100 / numPanels);
      panel.style.left = `${leftPercent}%`;
      panel.style.width = `${(100 / numPanels) + 0.15}%`; // slight bleed to prevent gap
      panel.style.backgroundImage = `url("${portraitUrl}")`;
      panel.style.backgroundPosition = `${i * (100 / (numPanels - 1))}% 50%`;
      panel.style.backgroundSize = `${numPanels * 100}% 100%`;
      
      portraitContainer.appendChild(panel);
    }

    // GSAP Unfolding Animation
    if (typeof gsap !== 'undefined') {
      const panels = portraitContainer.querySelectorAll('.unfold-panel');
      
      // Set initial 3D folded state
      panels.forEach((panel, i) => {
        const isEven = i % 2 === 0;
        gsap.set(panel, {
          rotateY: isEven ? -80 : 80,
          rotateX: 12,
          x: (i - numPanels / 2) * 12,
          scale: 0.7,
          opacity: 0,
          transformOrigin: isEven ? 'left center' : 'right center',
        });
      });

      // Staggered Unfolding Reveal Timeline
      const unfoldTl = gsap.timeline({ delay: 0.3 });
      unfoldTl.to(panels, {
        rotateY: 0,
        rotateX: 0,
        x: 0,
        scale: 1,
        opacity: 1,
        duration: 1.1,
        stagger: 0.07,
        ease: 'power3.out',
      });
    }
  }

  // 3. Interactive Mouse Parallax in Hero
  const heroSection = document.querySelector('.hero-section');
  const portraitWrapper = document.querySelector('.portrait-3d-wrapper');
  
  if (heroSection && portraitWrapper && window.innerWidth > 768) {
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 30;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 30;
    });

    function updateHeroParallax() {
      currentX += (mouseX - currentX) * 0.08;
      currentY += (mouseY - currentY) * 0.08;

      portraitWrapper.style.transform = `perspective(1000px) rotateY(${currentX * 0.5}deg) rotateX(${-currentY * 0.5}deg) translateZ(10px)`;
      requestAnimationFrame(updateHeroParallax);
    }
    updateHeroParallax();
  }

  // 4. Custom Cursor Implementation
  const cursorDot = document.querySelector('.custom-cursor');
  const cursorFollower = document.querySelector('.cursor-follower');
  const cursorText = document.querySelector('.cursor-text');

  if (cursorDot && cursorFollower && window.innerWidth > 768) {
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    function animateCursor() {
      followerX += (mouseX - followerX) * 0.15;
      followerY += (mouseY - followerY) * 0.15;

      cursorFollower.style.left = `${followerX}px`;
      cursorFollower.style.top = `${followerY}px`;

      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover interactions
    const interactiveElements = document.querySelectorAll('[data-cursor]');
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        const text = el.getAttribute('data-cursor') || 'VIEW';
        if (cursorText) cursorText.textContent = text;
        document.body.classList.add('cursor-hover');
      });

      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover');
      });
    });
  }

  // 5. Navbar Scroll Effect
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });

  // 6. Mobile Menu Toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
    });

    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
      });
    });
  }

  // 7. Scroll Intro Word Reveal (GSAP ScrollTrigger)
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    const giantWords = document.querySelectorAll('.giant-word');
    giantWords.forEach((word) => {
      gsap.to(word, {
        scrollTrigger: {
          trigger: word,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
      });
    });

    // About Photo Reveal
    const aboutPhoto = document.querySelector('.about-photo');
    if (aboutPhoto) {
      gsap.to(aboutPhoto, {
        scrollTrigger: {
          trigger: '.about-section',
          start: 'top 70%',
          scrub: 1,
        },
        scale: 1,
        duration: 1.5,
      });
    }

    // Stats Counter Animation
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach((stat) => {
      const targetVal = stat.getAttribute('data-target');
      if (targetVal) {
        ScrollTrigger.create({
          trigger: stat,
          start: 'top 85%',
          onEnter: () => {
            let count = 0;
            const numericVal = parseInt(targetVal, 10);
            const suffix = targetVal.includes('+') ? '+' : (targetVal.includes('%') ? '%' : '');
            const duration = 1500;
            const stepTime = 30;
            const steps = duration / stepTime;
            const increment = numericVal / steps;

            const timer = setInterval(() => {
              count += increment;
              if (count >= numericVal) {
                stat.textContent = numericVal + suffix;
                clearInterval(timer);
              } else {
                stat.textContent = Math.floor(count) + suffix;
              }
            }, stepTime);
          },
        });
      }
    });

    // Process Timeline Line Animation
    const processProgress = document.querySelector('.process-timeline-progress');
    const processSection = document.querySelector('.process-section');
    if (processProgress && processSection) {
      gsap.to(processProgress, {
        scrollTrigger: {
          trigger: processSection,
          start: 'top 60%',
          end: 'bottom 80%',
          scrub: true,
        },
        height: '100%',
        ease: 'none',
      });
    }
  }

  // 8. Before / After Interactive Comparison Slider
  const baWrapper = document.querySelector('.ba-slider-wrapper');
  const baAfter = document.querySelector('.ba-after');
  const baHandle = document.querySelector('.ba-slider-handle');

  if (baWrapper && baAfter && baHandle) {
    let isDragging = false;

    function setSliderPos(clientX) {
      const rect = baWrapper.getBoundingClientRect();
      let offsetX = clientX - rect.left;
      if (offsetX < 0) offsetX = 0;
      if (offsetX > rect.width) offsetX = rect.width;

      const percent = (offsetX / rect.width) * 100;
      baAfter.style.clipPath = `polygon(${percent}% 0, 100% 0, 100% 100%, ${percent}% 100%)`;
      baHandle.style.left = `${percent}%`;
    }

    baWrapper.addEventListener('mousedown', (e) => {
      isDragging = true;
      setSliderPos(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
      if (isDragging) setSliderPos(e.clientX);
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Touch support
    baWrapper.addEventListener('touchstart', (e) => {
      isDragging = true;
      setSliderPos(e.touches[0].clientX);
    });

    window.addEventListener('touchmove', (e) => {
      if (isDragging) setSliderPos(e.touches[0].clientX);
    });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });
  }

  // 9. Back to Top Button
  const backTopBtn = document.querySelector('.btn-back-top');
  if (backTopBtn) {
    backTopBtn.addEventListener('click', () => {
      if (lenis) {
        lenis.scrollTo(0, { duration: 1.5 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }
});
