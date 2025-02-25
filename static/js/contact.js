/**
 * Contact Form and Map Scripts
 * Handles contact form submission and initializes the OpenStreetMap
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize contact form functionality
    initContactForm();
    
    // Initialize map
    initMap();
});

/**
 * Initializes and handles the contact form submission
 */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    const formError = document.getElementById('formError');
    const formStatus = document.getElementById('formStatus');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Show loading indicator
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="animate-pulse">Sending...</span>';
        
        // Reset status messages
        resetFormStatus(formSuccess, formError, formStatus);
        
        // Collect and validate form data
        const formData = new FormData(contactForm);
        const csrfToken = formData.get('csrfmiddlewaretoken');
        
        // Basic client-side validation
        const name = formData.get('name').trim();
        const email = formData.get('email').trim();
        const subject = formData.get('subject').trim();
        const message = formData.get('message').trim();
        
        if (!name || !email || !subject || !message) {
            showErrorMessage(formError, 'All fields are required.');
            resetSubmitButton();
            return;
        }
        
        // Email validation
        if (!validateEmail(email)) {
            showErrorMessage(formError, 'Please enter a valid email address.');
            resetSubmitButton();
            return;
        }
        
        try {
            // Send the form data using fetch API
            const response = await fetch("/contacto/contact-form/", {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRFToken': csrfToken
                }
            });
            
            if (!response.ok) {
                throw new Error(`Server returned ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (data.success) {
                // Show success message
                showSuccessMessage(formSuccess, contactForm);
                // Scroll to success message
                formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                // Show error message
                showErrorMessage(formError, data.message);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            showErrorMessage(formError, 'Network error. Please check your connection and try again.');
        } finally {
            // Reset button state
            resetSubmitButton();
        }
        
        function resetSubmitButton() {
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        }
    });
    
    // Add input event listeners for real-time validation feedback
    Array.from(contactForm.elements).forEach(element => {
        if (['text', 'email', 'textarea'].includes(element.type)) {
            element.addEventListener('input', function() {
                // Remove error styling when user starts typing
                this.classList.remove('border-red-500');
                this.classList.add('border-gray-700');
            });
            
            // Add blur event for validation
            element.addEventListener('blur', function() {
                if (!this.value.trim()) {
                    this.classList.add('border-red-500');
                    this.classList.remove('border-gray-700');
                }
            });
        }
    });
}

/**
 * Validates email format
 * @param {string} email - The email to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email.toLowerCase());
}

/**
 * Resets all form status messages
 */
function resetFormStatus(successElement, errorElement, statusContainer) {
    successElement.classList.add('hidden');
    errorElement.classList.add('hidden');
    statusContainer.classList.remove('hidden');
}

/**
 * Shows success message and resets the form
 */
function showSuccessMessage(successElement, formElement) {
    successElement.classList.remove('hidden');
    formElement.reset();
    
    // Automatically hide success message after 5 seconds
    setTimeout(() => {
        successElement.classList.add('hidden');
    }, 5000);
}

/**
 * Shows error message with custom text if provided
 */
function showErrorMessage(errorElement, customMessage = null) {
    errorElement.classList.remove('hidden');
    
    if (customMessage) {
        errorElement.textContent = customMessage;
    } else {
        errorElement.textContent = 'There was an error sending your message. Please try again.';
    }
}

/**
 * Debounce function to limit function calls
 */
function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Initializes the OpenStreetMap
 */
function initMap() {
    const mapElement = document.getElementById('map');
    
    if (!mapElement || typeof L === 'undefined') return;
    
    // Coordinates for Guayaquil, Ecuador
    const guayaquil = {
        lat: -2.1709,
        lng: -79.9223,
        zoom: 13
    };
    
    // Create map and set view to Guayaquil coordinates
    const map = L.map('map', {
        scrollWheelZoom: false,  // Disable scroll zoom for better UX
        dragging: !L.Browser.mobile, // Disable dragging on mobile
    }).setView([guayaquil.lat, guayaquil.lng], guayaquil.zoom);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(map);
    
    // Add a marker at Guayaquil
    const marker = L.marker([guayaquil.lat, guayaquil.lng]).addTo(map);
    
    // Add popup with info
    marker.bindPopup(`
        <b>Jordy Pincay</b><br>
        Software Engineer<br>
        Guayaquil, Ecuador
    `).openPopup();
    
    // Enable map interaction on click/touch
    mapElement.addEventListener('click', function() {
        map.scrollWheelZoom.enable();
    });
    
    // Disable scroll zoom when mouse leaves the map
    mapElement.addEventListener('mouseleave', function() {
        map.scrollWheelZoom.disable();
    });
    
    // Handle window resize to recalculate map size
    window.addEventListener('resize', debounce(() => {
        map.invalidateSize();
    }, 250));
}

// Export functions for testing or direct use from other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initContactForm,
        initMap,
        validateEmail
    };
}