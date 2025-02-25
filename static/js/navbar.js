/**
 * Modern Portfolio Navigation Script
 * Handles navigation tabs, mobile menu, scroll effects, and theme toggling
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // DOM Element Selectors
    const tabs = document.querySelectorAll('.nav-tab a');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    const navbar = document.querySelector('.bg-gradient-to-r');
    const themeToggle = document.getElementById('theme-toggle');
    const mobileMenuLinks = document.querySelectorAll('#mobile-menu a');
  
    // Cache DOM elements and create TabNavigation namespace
    window.TabNavigation = {
      // Method to activate tab content sections
      activateTab: function(targetId) {
        // Find all content sections and hide them
        const sections = document.querySelectorAll('section[id]');
        sections.forEach(section => {
          section.classList.add('hidden');
        });
        
        // Show the target section
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
          targetSection.classList.remove('hidden');
          // Smooth scroll to section
          targetSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };
  
    /**
     * Updates visual state of a tab to active
     * @param {HTMLElement} targetTab - The tab element to activate
     */
    function activateTab(targetTab) {
      // Reset all tabs to inactive state
      tabs.forEach(tab => {
        const indicator = tab.querySelector('.tab-indicator');
        tab.classList.replace('text-white', 'text-gray-300');
        
        if (indicator) {
          indicator.classList.replace('scale-x-100', 'scale-x-0');
        }
        
        // Reset background effect
        const bgEffect = tab.closest('.nav-tab').querySelector('.absolute.inset-0');
        if (bgEffect) {
          bgEffect.classList.remove('scale-100');
        }
      });
      
      // Set active tab styles
      targetTab.classList.replace('text-gray-300', 'text-white');
      
      const indicator = targetTab.querySelector('.tab-indicator');
      if (indicator) {
        indicator.classList.replace('scale-x-0', 'scale-x-100');
      }
      
      // Apply highlight effect for active tab
      const bgEffect = targetTab.closest('.nav-tab').querySelector('.absolute.inset-0');
      if (bgEffect) {
        bgEffect.classList.add('scale-100');
      }
    }
  
    /**
     * Handles tab click events
     * @param {Event} e - The click event
     */
    function handleTabClick(e) {
      e.preventDefault();
      const tab = e.currentTarget;
      
      // Activate visual tab state
      activateTab(tab);
      
      // Get target section ID
      const targetId = tab.getAttribute('href').substring(1);
      
      // Update URL hash without scrolling
      history.pushState(null, '', `#${targetId}`);
      
      // Show corresponding section
      window.TabNavigation.activateTab(targetId);
      
      // Close mobile menu if open
      closeMobileMenu();
    }
  
    /**
     * Toggles mobile menu visibility
     */
    function toggleMobileMenu() {
      const isHidden = mobileMenu.classList.contains('hidden');
      
      if (isHidden) {
        // Show menu
        mobileMenu.classList.remove('hidden');
        // Animate menu appearance
        mobileMenu.classList.add('animate-fadeIn');
        // Change to close icon
        menuIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />`;
      } else {
        closeMobileMenu();
      }
    }
  
    /**
     * Closes the mobile menu
     */
    function closeMobileMenu() {
      mobileMenu.classList.add('hidden');
      menuIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />`;
    }
  
    /**
     * Handles navbar appearance changes on scroll
     */
    function handleScroll() {
      if (window.scrollY > 20) {
        navbar.classList.replace('py-2', 'py-1');
        navbar.classList.add('shadow-xl');
      } else {
        navbar.classList.replace('py-1', 'py-2');
        navbar.classList.remove('shadow-xl');
      }
    }
  
    /**
     * Toggles between light and dark themes
     */
    function toggleTheme() {
      document.documentElement.classList.toggle('dark-mode');
      localStorage.setItem('darkMode', document.documentElement.classList.contains('dark-mode'));
      
      // Update theme toggle icon
      updateThemeIcon();
    }
  
    /**
     * Updates theme toggle icon based on current theme
     */
    function updateThemeIcon() {
      const isDarkMode = document.documentElement.classList.contains('dark-mode');
      
      themeToggle.innerHTML = isDarkMode 
        ? `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>`;
    }
  
    /**
     * Initialize theme based on user preference or previous session
     */
    function initTheme() {
      // Check for saved theme preference or system preference
      const savedDarkMode = localStorage.getItem('darkMode');
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      // Set initial theme
      if (savedDarkMode === 'true' || (savedDarkMode === null && prefersDarkMode)) {
        document.documentElement.classList.add('dark-mode');
      }
      
      // Update theme icon
      updateThemeIcon();
    }
  
    /**
     * Initialize active tab based on URL hash
     */
    function initActiveTab() {
      const currentHash = window.location.hash.substring(1) || 'about';
      const activeTab = document.querySelector(`.nav-tab a[href="#${currentHash}"]`);
      
      if (activeTab) {
        activateTab(activeTab);
        // Initialize content section visibility
        if (window.TabNavigation && typeof window.TabNavigation.activateTab === 'function') {
          window.TabNavigation.activateTab(currentHash);
        }
      }
    }
  
    // Set up event listeners
    function setupEventListeners() {
      // Tab click events
      tabs.forEach(tab => {
        tab.addEventListener('click', handleTabClick);
      });
      
      // Mobile menu toggle
      if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', toggleMobileMenu);
      }
      
      // Mobile menu links
      mobileMenuLinks.forEach(link => {
        link.addEventListener('click', handleTabClick);
      });
      
      // Scroll effects
      window.addEventListener('scroll', handleScroll);
      
      // Theme toggle
      if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
      }
      
      // Listen for hash changes to update active tab
      window.addEventListener('hashchange', () => {
        const hash = window.location.hash.substring(1) || 'about';
        const tab = document.querySelector(`.nav-tab a[href="#${hash}"]`);
        if (tab) {
          activateTab(tab);
          window.TabNavigation.activateTab(hash);
        }
      });
  
      // Handle clicks outside mobile menu to close it
      document.addEventListener('click', (e) => {
        if (mobileMenu && !mobileMenu.classList.contains('hidden') && 
            !mobileMenu.contains(e.target) && 
            !mobileMenuButton.contains(e.target)) {
          closeMobileMenu();
        }
      });
    }
  
    // Initialize everything
    function init() {
      initTheme();
      initActiveTab();
      setupEventListeners();
      handleScroll(); // Apply scroll effect based on initial position
    }
  
    // Start the application
    init();
  });