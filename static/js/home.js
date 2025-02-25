/**
 * Portfolio JavaScript with Clean Code principles
 * - Organized using module pattern
 * - Clear naming and documentation
 * - Single responsibility for each module
 * - Centralized configuration
 */

// Configuration object for app-wide settings
const CONFIG = {
    animation: {
      scrollOffset: 100,
      sectionFadeDuration: '0.3s',
      cardDelay: 50,
      intersectionThreshold: 0.1
    },
    selectors: {
      sections: '.section-content',
      navItems: '.nav-item',
      hashLinks: 'a[href^="#"]',
      techButtons: '.tech-category-btn',
      techPanels: '.tech-category-panel',
      techElements: '.tech-card, .tech-pill'
    }
  };
  
  // Main application module
  const PortfolioApp = (function() {
    // Private utility functions
    const dom = {
      get: selector => document.querySelector(selector),
      getAll: selector => document.querySelectorAll(selector),
      addClass: (element, ...classes) => element.classList.add(...classes),
      removeClass: (element, ...classes) => element.classList.remove(...classes),
      setStyles: (element, styles) => Object.assign(element.style, styles)
    };
  
    // Section Management Module
    const SectionManager = {
      sections: null,
      navItems: null,
  
      init() {
        this.sections = dom.getAll(CONFIG.selectors.sections);
        this.navItems = dom.getAll(CONFIG.selectors.navItems);
        this.initializeFirstSection();
        this.handleHashChange();
      },
  
      initializeFirstSection() {
        const initialSection = window.location.hash ? 
          window.location.hash.slice(1) : 
          'about';
        this.showSection(initialSection);
      },
  
      handleHashChange() {
        window.addEventListener('hashchange', () => {
          const sectionId = window.location.hash.slice(1) || 'about';
          this.showSection(sectionId);
        });
      },
  
      showSection(sectionId) {
        // Reset all sections
        this.sections.forEach(section => {
          section.style.transition = 'none';
          section.style.opacity = '0';
          dom.addClass(section, 'hidden');
        });
  
        // Show and animate target section
        const targetSection = dom.get(`#${sectionId}`);
        if (targetSection) {
          dom.removeClass(targetSection, 'hidden');
          void targetSection.offsetWidth; // Force reflow
          dom.setStyles(targetSection, {
            transition: `opacity ${CONFIG.animation.sectionFadeDuration} ease-in-out`,
            opacity: '1'
          });
        }
  
        this.updateNavigation(sectionId);
      },
  
      updateNavigation(activeSectionId) {
        this.navItems.forEach(item => {
          const itemSectionId = item.querySelector('a').getAttribute('href').slice(1);
          item.classList.toggle('active', itemSectionId === activeSectionId);
        });
      }
    };
  
    // Smooth Scroll Module
    const SmoothScroll = {
      init() {
        dom.getAll(CONFIG.selectors.hashLinks).forEach(anchor => {
          anchor.addEventListener('click', this.handleAnchorClick.bind(this));
        });
      },
  
      handleAnchorClick(event) {
        event.preventDefault();
        const targetId = event.currentTarget.getAttribute('href');
        SectionManager.showSection(targetId.slice(1));
        
        requestAnimationFrame(() => {
          this.scrollToTarget(targetId);
        });
      },
  
      scrollToTarget(targetId) {
        const section = dom.get(targetId);
        if (!section) return;
  
        const elementPosition = section.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - CONFIG.animation.scrollOffset;
  
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    };
  
    // Technology Categories Module
    const TechCategories = {
      buttons: null,
      panels: null,
      observer: null,
  
      init() {
        this.buttons = dom.getAll(CONFIG.selectors.techButtons);
        this.panels = dom.getAll(CONFIG.selectors.techPanels);
        
        this.initializeButtons();
        this.initializeIntersectionObserver();
        this.setupInitialCardStates();
      },
  
      initializeButtons() {
        this.buttons.forEach(btn => {
          btn.addEventListener('click', () => {
            const categoryId = btn.getAttribute('data-category');
            this.updateButtonStyles(btn);
            this.updatePanels(categoryId);
          });
        });
      },
  
      updateButtonStyles(selectedBtn) {
        this.buttons.forEach(btn => {
          const indicator = btn.querySelector('div');
          const isSelected = btn === selectedBtn;
  
          // Reset styles
          const baseClasses = ['text-gray-400', 'hover:text-white'];
          const activeClasses = [
            'bg-gradient-to-r', 
            'from-indigo-500/30', 
            'to-teal-500/30', 
            'text-white'
          ];
  
          if (isSelected) {
            dom.removeClass(btn, ...baseClasses);
            dom.addClass(btn, ...activeClasses);
            dom.addClass(indicator, 'w-full');
          } else {
            dom.removeClass(btn, ...activeClasses);
            dom.addClass(btn, ...baseClasses);
            dom.removeClass(indicator, 'w-full');
          }
  
          btn.setAttribute('aria-selected', isSelected);
        });
      },
  
      updatePanels(selectedCategoryId) {
        this.panels.forEach(panel => {
          const isSelected = panel.id === `panel-${selectedCategoryId}`;
          this.animatePanel(panel, isSelected);
        });
      },
  
      animatePanel(panel, show) {
        const baseStyles = {
          opacity: '0',
          transform: 'translateY(20px)',
          transition: 'opacity 0.3s ease-out, transform 0.3s ease-out'
        };
  
        if (show) {
          dom.removeClass(panel, 'hidden');
          dom.setStyles(panel, baseStyles);
  
          requestAnimationFrame(() => {
            dom.setStyles(panel, {
              opacity: '1',
              transform: 'translateY(0)'
            });
          });
        } else {
          dom.addClass(panel, 'hidden');
          dom.setStyles(panel, baseStyles);
        }
      },
  
      initializeIntersectionObserver() {
        this.observer = new IntersectionObserver(
          entries => this.handleIntersection(entries),
          { threshold: CONFIG.animation.intersectionThreshold }
        );
  
        this.panels.forEach(panel => this.observer.observe(panel));
      },
  
      handleIntersection(entries) {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll(CONFIG.selectors.techElements);
            this.animateCards(cards);
            this.observer.unobserve(entry.target);
          }
        });
      },
  
      animateCards(cards) {
        cards.forEach((card, index) => {
          setTimeout(() => {
            dom.setStyles(card, {
              opacity: '1',
              transform: 'translateY(0)'
            });
          }, index * CONFIG.animation.cardDelay);
        });
      },
  
      setupInitialCardStates() {
        this.panels.forEach(panel => {
          const cards = panel.querySelectorAll(CONFIG.selectors.techElements);
          cards.forEach(card => {
            dom.setStyles(card, {
              opacity: '0',
              transform: 'translateY(20px)',
              transition: 'opacity 0.3s ease-out, transform 0.3s ease-out'
            });
          });
        });
      }
    };
  
    // Public initialization method
    function init() {
      // Initialize AOS
      AOS.init({
        duration: 800,
        offset: CONFIG.animation.scrollOffset,
        once: true,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        mirror: false,
        disable: window.innerWidth < 768
      });
  
      // Initialize all modules
      SectionManager.init();
      SmoothScroll.init();
      TechCategories.init();
    }
  
    // Return public API
    return { init };
  })();

    document.addEventListener('DOMContentLoaded', () => {
        PortfolioApp.init();
        NavbarManager.init(); 
    });