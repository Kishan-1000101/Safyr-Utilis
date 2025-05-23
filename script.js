// Header scroll effect
const header = document.querySelector('.header');
const mobileToggle = document.querySelector('.header__mobile-toggle');
const nav = document.querySelector('.header__nav');

window.addEventListener('scroll', () => {
  if (window.scrollY > 100) {
    header.classList.add('header--scrolled');
  } else {
    header.classList.remove('header--scrolled');
  }
});

// Mobile menu toggle
if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        nav.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a nav link
    const navLinks = document.querySelectorAll('.nav__link:not(.nav__dropdown .nav__link)');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            nav.classList.remove('active');
        });
    });
    
    // Handle dropdown toggle on mobile
    const navDropdown = document.querySelector('.nav__dropdown');
    const servicesLink = navDropdown.querySelector('.nav__link');
    
    servicesLink.addEventListener('click', (e) => {
        if (window.innerWidth <= 992) {
            e.preventDefault();
            navDropdown.classList.toggle('active');
        }
    });

    // Handle nested dropdown toggle on mobile
    const nestedDropdown = document.querySelector('.nested-dropdown');
    if (nestedDropdown) {
        // Find the clickable area (text, not the link)
        const nestedDropdownText = nestedDropdown.querySelector('.dropdown-service-text');
        
        nestedDropdownText.addEventListener('click', (e) => {
            if (window.innerWidth <= 992) {
                // If we're clicking on the link itself, don't interfere
                if (e.target.tagName === 'A' || e.target.closest('a')) {
                    return;
                }
                
                e.stopPropagation();
                nestedDropdown.classList.toggle('active');
            }
        });
        
        // Make sure clicking inside the nested dropdown content doesn't close it on mobile
        const nestedContent = nestedDropdown.querySelector('.nested-dropdown-content');
        if (nestedContent) {
            nestedContent.addEventListener('click', (e) => {
                if (window.innerWidth <= 992) {
                    // If we're clicking on a link, allow it to work
                    if (!e.target.closest('a')) {
                        e.stopPropagation();
                    }
                }
            });
        }
    }
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (nav.classList.contains('active') && 
        !nav.contains(e.target) && 
        !mobileToggle.contains(e.target)) {
        mobileToggle.classList.remove('active');
        nav.classList.remove('active');
    }
});

// Close nested dropdown when clicking outside
document.addEventListener('click', (e) => {
    const nestedDropdown = document.querySelector('.nested-dropdown');
    if (nestedDropdown && nestedDropdown.classList.contains('active') && 
        !nestedDropdown.contains(e.target)) {
        nestedDropdown.classList.remove('active');
    }
});

// Slider functionality for hero, testimonials, and Why Mauritius sections
document.addEventListener('DOMContentLoaded', function() {
    // Hero slider navigation with logo position changes and slide transitions
    const heroSliderPrev = document.querySelector('.hero .slider-btn--prev');
    const heroSliderNext = document.querySelector('.hero .slider-btn--next');
    const heroLogo = document.querySelector('.hero__logo');
    const heroSlides = document.querySelectorAll('.hero__slide');
    
    // Set initial position class
    heroLogo.classList.add('position-center');
    
    // Track current position: -1 (left), 0 (center), 1 (right)
    let currentPosition = 0;
    let currentHeroSlide = 0;
    const totalHeroSlides = heroSlides.length;
    
    // Function for cycling the logo from right to left
    function cycleLogoRight() {
        // Remove all position classes first
        heroLogo.classList.remove('position-left', 'position-center', 'position-right', 
                                 'position-far-left', 'position-far-right', 
                                 'position-enter-left', 'position-enter-right');
        
        // First move to far right (off screen)
        heroLogo.classList.add('position-far-right');
        
        // After a small delay, remove transition, add the enter-left class
        // This positions the logo off-screen to the left without animation
        setTimeout(() => {
            heroLogo.style.transition = 'none';
            heroLogo.classList.remove('position-far-right');
            heroLogo.classList.add('position-enter-left');
            
            // Force a reflow to ensure the transition removal takes effect
            void heroLogo.offsetWidth;
            
            // After another small delay, restore transition and move to the left position
            setTimeout(() => {
                heroLogo.style.transition = '';
                heroLogo.classList.remove('position-enter-left');
                heroLogo.classList.add('position-left');
                currentPosition = -1;
            }, 50);
        }, 300);
    }
    
    // Function for cycling the logo from left to right
    function cycleLogoLeft() {
        // Remove all position classes first
        heroLogo.classList.remove('position-left', 'position-center', 'position-right', 
                                 'position-far-left', 'position-far-right', 
                                 'position-enter-left', 'position-enter-right');
        
        // First move to far left (off screen)
        heroLogo.classList.add('position-far-left');
        
        // After a small delay, remove transition, add the enter-right class
        // This positions the logo off-screen to the right without animation
        setTimeout(() => {
            heroLogo.style.transition = 'none';
            heroLogo.classList.remove('position-far-left');
            heroLogo.classList.add('position-enter-right');
            
            // Force a reflow to ensure the transition removal takes effect
            void heroLogo.offsetWidth;
            
            // After another small delay, restore transition and move to the right position
            setTimeout(() => {
                heroLogo.style.transition = '';
                heroLogo.classList.remove('position-enter-right');
                heroLogo.classList.add('position-right');
                currentPosition = 1;
            }, 50);
        }, 300);
    }
    
    // Function to move the logo to a specific position
    function moveToPosition(position) {
        // Remove all position classes
        heroLogo.classList.remove('position-left', 'position-center', 'position-right',
                                 'position-far-left', 'position-far-right', 
                                 'position-enter-left', 'position-enter-right');
        
        // Add the appropriate class based on position
        if (position === -1) {
            heroLogo.classList.add('position-left');
        } else if (position === 0) {
            heroLogo.classList.add('position-center');
        } else if (position === 1) {
            heroLogo.classList.add('position-right');
        }
        
        // Update current position
        currentPosition = position;
    }
    
    // Function to show a specific slide
    function showHeroSlide(index) {
        // Hide all slides
        heroSlides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Show the target slide
        heroSlides[index].classList.add('active');
        
        // Animate the content elements
        const activeTitle = heroSlides[index].querySelector('h1');
        const activeButtons = heroSlides[index].querySelector('.hero__cta');
        
        if (activeTitle) {
            // Reset animation
            activeTitle.style.opacity = '0';
            activeTitle.style.transform = 'translateY(30px)';
            
            // Trigger reflow to restart animation
            void activeTitle.offsetWidth;
            
            // Start animation
            setTimeout(() => {
                activeTitle.style.opacity = '1';
                activeTitle.style.transform = 'translateY(0)';
            }, 50);
        }
        
        if (activeButtons) {
            // Reset animation
            activeButtons.style.opacity = '0';
            activeButtons.style.transform = 'translateY(30px)';
            
            // Trigger reflow to restart animation
            void activeButtons.offsetWidth;
            
            // Start animation with a slight delay after title
            setTimeout(() => {
                activeButtons.style.opacity = '1';
                activeButtons.style.transform = 'translateY(0)';
            }, 300);
        }
        
        // Update current slide
        currentHeroSlide = index;
    }
    
    // Next button click handler
    heroSliderNext.addEventListener('click', function() {
        console.log('Next button clicked');
        
        // Handle logo animation
        if (currentPosition === 1) {
            // If at rightmost position, cycle to left
            cycleLogoRight();
        } else {
            // Otherwise move one position to the right
            moveToPosition(currentPosition + 1);
        }
        
        // Handle slide change
        let nextSlide = (currentHeroSlide + 1) % totalHeroSlides;
        showHeroSlide(nextSlide);
    });
    
    // Previous button click handler
    heroSliderPrev.addEventListener('click', function() {
        console.log('Previous button clicked');
        
        // Handle logo animation
        if (currentPosition === -1) {
            // If at leftmost position, cycle to right
            cycleLogoLeft();
        } else {
            // Otherwise move one position to the left
            moveToPosition(currentPosition - 1);
        }
        
        // Handle slide change
        let prevSlide = (currentHeroSlide - 1 + totalHeroSlides) % totalHeroSlides;
        showHeroSlide(prevSlide);
    });
    
    // Add console log to verify DOM loading
    console.log('Hero slider initialized');
    console.log('Prev button:', heroSliderPrev);
    console.log('Next button:', heroSliderNext);
    console.log('Total slides:', totalHeroSlides);
    
    // Why Mauritius slider navigation
    const mauritiusSliderPrev = document.querySelector('.why-mauritius .slider-btn--prev');
    const mauritiusSliderNext = document.querySelector('.why-mauritius .slider-btn--next');
    
    if (mauritiusSliderPrev && mauritiusSliderNext) {
        mauritiusSliderPrev.addEventListener('click', function() {
            console.log('Previous Mauritius slide');
            // Add slide change logic here
        });
        
        mauritiusSliderNext.addEventListener('click', function() {
            console.log('Next Mauritius slide');
            // Add slide change logic here
        });
    }
    
    // Why Mauritius carousel functionality
    const carouselSlides = document.querySelectorAll('.carousel-slide');
    const carouselIndicators = document.querySelectorAll('.indicator');
    const carouselPrev = document.querySelector('.carousel-btn--prev');
    const carouselNext = document.querySelector('.carousel-btn--next');
    
    let currentCarouselSlide = 0;
    const carouselSlideCount = carouselSlides.length;
    
    function showCarouselSlide(slideIndex) {
        // Wrap around if index is out of bounds
        if (slideIndex >= carouselSlideCount) {
            slideIndex = 0;
        } else if (slideIndex < 0) {
            slideIndex = carouselSlideCount - 1;
        }
        
        // Update current slide index
        currentCarouselSlide = slideIndex;
        
        // Remove active class from all slides and indicators
        carouselSlides.forEach(slide => slide.classList.remove('active'));
        carouselIndicators.forEach(indicator => indicator.classList.remove('active'));
        
        // Add active class to current slide and indicator
        carouselSlides[currentCarouselSlide].classList.add('active');
        if (carouselIndicators[currentCarouselSlide]) {
            carouselIndicators[currentCarouselSlide].classList.add('active');
        }
    }
    
    // Event listeners for carousel navigation
    if (carouselNext && carouselPrev) {
        carouselNext.addEventListener('click', () => {
            showCarouselSlide(currentCarouselSlide + 1);
            resetCarouselAutoSlide(); // Reset timer when manually changing slides
        });
        
        carouselPrev.addEventListener('click', () => {
            showCarouselSlide(currentCarouselSlide - 1);
            resetCarouselAutoSlide(); // Reset timer when manually changing slides
        });
        
        // Add click events to indicators
        carouselIndicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                showCarouselSlide(index);
                resetCarouselAutoSlide(); // Reset timer when manually changing slides
            });
        });
        
        // Auto-advance slides every 5 seconds
        let carouselInterval;
        
        function startCarouselAutoSlide() {
            carouselInterval = setInterval(() => {
                if (document.hasFocus()) { // Only advance if the page is focused
                    showCarouselSlide(currentCarouselSlide + 1);
                }
            }, 5000); // Changed from 8000 to 5000 ms (5 seconds)
        }
        
        function resetCarouselAutoSlide() {
            clearInterval(carouselInterval);
            startCarouselAutoSlide();
        }
        
        // Initialize the auto-slide
        startCarouselAutoSlide();
        
        // Pause auto-slide when hovering over the carousel
        const carouselContainer = document.querySelector('.carousel-container');
        
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', () => {
                clearInterval(carouselInterval);
            });
            
            carouselContainer.addEventListener('mouseleave', () => {
                startCarouselAutoSlide();
            });
        }
    }
    
    // Testimonials slider
    function initTestimonialsSlider() {
        const slider = document.querySelector('.testimonials__slider');
        const testimonials = document.querySelectorAll('.testimonial');
        const prevBtn = document.querySelector('.testimonial-btn--prev');
        const nextBtn = document.querySelector('.testimonial-btn--next');
        let currentIndex = 0;

        function updateTestimonials() {
            testimonials.forEach((testimonial, index) => {
                testimonial.className = 'testimonial';
                
                // Calculate the relative position from current
                const position = (index - currentIndex + testimonials.length) % testimonials.length;
                
                if (position === 0) {
                    testimonial.classList.add('active');
                } else if (position === 1 || position === (testimonials.length - 1)) {
                    testimonial.classList.add(position === 1 ? 'next-1' : 'prev-1');
                } else if (position === 2 || position === (testimonials.length - 2)) {
                    testimonial.classList.add(position === 2 ? 'next-2' : 'prev-2');
                }
            });
        }

        function nextTestimonial() {
            currentIndex = (currentIndex + 1) % testimonials.length;
            updateTestimonials();
        }

        function prevTestimonial() {
            currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
            updateTestimonials();
        }

        // Initialize positions
        updateTestimonials();

        // Event listeners
        prevBtn.addEventListener('click', prevTestimonial);
        nextBtn.addEventListener('click', nextTestimonial);

        // Auto-advance if not hovered
        let autoAdvanceInterval;
        
        function startAutoAdvance() {
            autoAdvanceInterval = setInterval(() => {
                if (document.hasFocus()) {
                    nextTestimonial();
                }
            }, 5000);
        }

        function stopAutoAdvance() {
            clearInterval(autoAdvanceInterval);
        }

        slider.addEventListener('mouseenter', stopAutoAdvance);
        slider.addEventListener('mouseleave', startAutoAdvance);

        // Start auto-advance
        startAutoAdvance();
    }

    // Initialize all sliders when DOM is loaded
    initTestimonialsSlider();
});

// Animation on scroll
document.addEventListener('DOMContentLoaded', function() {
    // Find all elements with the animate-on-scroll class
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    // Function to check if an element is in the viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
            rect.bottom >= 0
        );
    }
    
    // Function to handle scroll events
    function handleScroll() {
        animatedElements.forEach(element => {
            if (isInViewport(element) && !element.classList.contains('visible')) {
                element.classList.add('visible');
            }
        });
    }
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Trigger once on page load
    handleScroll();
});

// Testimonial Carousel
document.addEventListener('DOMContentLoaded', function() {
    const testimonialSlider = document.querySelector('.testimonials__slider');
    const testimonials = document.querySelectorAll('.testimonial');
    let currentIndex = 0;
    const totalSlides = testimonials.length;

    function updateSlideClasses() {
        testimonials.forEach((testimonial, index) => {
            testimonial.classList.remove('active', 'prev-2', 'prev-1', 'next-1', 'next-2');
            
            // Calculate the relative position from current slide
            let position = (index - currentIndex + totalSlides) % totalSlides;
            
            // Assign appropriate classes based on position
            if (position === 0) {
                testimonial.classList.add('active');
            } else if (position === 1) {
                testimonial.classList.add('next-1');
            } else if (position === 2) {
                testimonial.classList.add('next-2');
            } else if (position === totalSlides - 1) {
                testimonial.classList.add('prev-1');
            } else if (position === totalSlides - 2) {
                testimonial.classList.add('prev-2');
            }
        });
    }

    function handleSlideClick(e) {
        const clickedSlide = e.currentTarget;
        
        // Don't do anything if clicking the active slide
        if (clickedSlide.classList.contains('active')) {
            return;
        }

        // Determine if we should go forward or backward
        if (clickedSlide.classList.contains('next-1') || clickedSlide.classList.contains('next-2')) {
            currentIndex = (currentIndex + 1) % totalSlides;
        } else if (clickedSlide.classList.contains('prev-1') || clickedSlide.classList.contains('prev-2')) {
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        }

        updateSlideClasses();
    }

    // Add click event listeners to all testimonials
    testimonials.forEach(testimonial => {
        testimonial.addEventListener('click', handleSlideClick);
    });

    // Initialize the carousel
    updateSlideClasses();
});

// Footer contact cards expand/collapse
document.addEventListener('DOMContentLoaded', function() {
    const footerContactCards = document.querySelectorAll('.footer__contact-card');
    
    // The contact links now handle the click functionality
    // We'll keep the expand/collapse for accessibility reasons but
    // it's no longer the primary interaction method
    
    // This code is kept for backwards compatibility with any
    // contact cards that don't have the contact-link class
    footerContactCards.forEach(card => {
        const contactLink = card.querySelector('.contact-link');
        
        // Only attach click handler if there's no contact link
        if (!contactLink) {
            card.addEventListener('click', function(e) {
                // Prevent event from bubbling up to document
                e.stopPropagation();
                
                // Toggle expanded class
                if (this.classList.contains('expanded')) {
                    this.classList.remove('expanded');
                } else {
                    // Close any other expanded cards first
                    footerContactCards.forEach(c => c.classList.remove('expanded'));
                    // Then expand this card
                    this.classList.add('expanded');
                }
            });
        }
    });
    
    // Close expanded cards when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.footer__contact-card')) {
            footerContactCards.forEach(card => card.classList.remove('expanded'));
        }
    });
}); 