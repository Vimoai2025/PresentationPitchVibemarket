// VibeMarket Presentation JavaScript

class PresentationApp {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = 20;
        this.slides = document.querySelectorAll('.slide');
        this.navItems = document.querySelectorAll('.nav-item');
        this.animationActive = false;
        this.touchEnabled = 'ontouchstart' in window;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateUI();
        this.preloadNextSlides();
        this.setupAnimations();
    }

    bindEvents() {
        // Navigation buttons
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const fullscreenBtn = document.getElementById('fullscreenBtn');

        prevBtn.addEventListener('click', () => this.previousSlide());
        nextBtn.addEventListener('click', () => this.nextSlide());
        fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());

        // Slide navigation menu
        this.navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const slideNumber = parseInt(e.target.dataset.slide);
                this.goToSlide(slideNumber);
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowLeft':
                case 'ArrowUp':
                    e.preventDefault();
                    this.previousSlide();
                    break;
                case 'ArrowRight':
                case 'ArrowDown':
                case ' ': // Spacebar
                    e.preventDefault();
                    this.nextSlide();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.goToSlide(1);
                    break;
                case 'End':
                    e.preventDefault();
                    this.goToSlide(this.totalSlides);
                    break;
                case 'F11':
                case 'f':
                    e.preventDefault();
                    this.toggleFullscreen();
                    break;
                case 'Escape':
                    if (document.fullscreenElement) {
                        document.exitFullscreen();
                    }
                    break;
            }
        });

        // Touch/swipe navigation for mobile
        if (this.touchEnabled) {
            let touchStartX = 0;
            let touchEndX = 0;
            let touchStartY = 0;
            let touchEndY = 0;

            document.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
                touchStartY = e.changedTouches[0].screenY;
            });

            document.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                touchEndY = e.changedTouches[0].screenY;
                this.handleSwipe(touchStartX, touchEndX, touchStartY, touchEndY);
            });
        }

        // Mouse wheel navigation
        let wheelTimeout;
        document.addEventListener('wheel', (e) => {
            clearTimeout(wheelTimeout);
            wheelTimeout = setTimeout(() => {
                if (e.deltaY > 0) {
                    this.nextSlide();
                } else if (e.deltaY < 0) {
                    this.previousSlide();
                }
            }, 100);
        }, { passive: true });

        // Fullscreen change event
        document.addEventListener('fullscreenchange', () => {
            this.updateFullscreenButton();
        });

        // CTA buttons on final slide
        const ctaButtons = document.querySelectorAll('.cta-button');
        ctaButtons.forEach(button => {
            button.addEventListener('click', () => {
                // In a real app, these would have actual functionality
                alert('¡Gracias por tu interés en VibeMarket! En un entorno real, esto conectaría con el proceso de inversión o una demo en vivo.');
            });
        });
    }

    handleSwipe(touchStartX, touchEndX, touchStartY, touchEndY) {
        const swipeThreshold = 50;
        const swipeDistanceX = touchEndX - touchStartX;
        const swipeDistanceY = touchEndY - touchStartY;
        
        // Check if horizontal swipe is more significant than vertical
        if (Math.abs(swipeDistanceX) > Math.abs(swipeDistanceY)) {
            if (Math.abs(swipeDistanceX) > swipeThreshold) {
                if (swipeDistanceX > 0) {
                    this.previousSlide();
                } else {
                    this.nextSlide();
                }
            }
        }
    }

    previousSlide() {
        if (this.currentSlide > 1 && !this.animationActive) {
            this.animationActive = true;
            this.currentSlide--;
            this.updateSlides('previous');
            this.updateUI();
            setTimeout(() => {
                this.animationActive = false;
            }, 500); // Match transition duration
        }
    }

    nextSlide() {
        if (this.currentSlide < this.totalSlides && !this.animationActive) {
            this.animationActive = true;
            this.currentSlide++;
            this.updateSlides('next');
            this.updateUI();
            setTimeout(() => {
                this.animationActive = false;
            }, 500); // Match transition duration
        }
    }

    goToSlide(slideNumber) {
        if (slideNumber >= 1 && slideNumber <= this.totalSlides && !this.animationActive) {
            this.animationActive = true;
            const direction = slideNumber > this.currentSlide ? 'next' : 'previous';
            this.currentSlide = slideNumber;
            this.updateSlides(direction);
            this.updateUI();
            setTimeout(() => {
                this.animationActive = false;
            }, 500); // Match transition duration
        }
    }

    updateSlides(direction) {
        this.slides.forEach((slide, index) => {
            const slideNumber = index + 1;
            
            if (slideNumber === this.currentSlide) {
                slide.classList.add('active');
                slide.style.transform = 'translateX(0)';
                slide.style.opacity = '1';
                this.animateSlideContent(slide);
            } else if (direction === 'next' && slideNumber < this.currentSlide) {
                slide.classList.remove('active');
                slide.style.transform = 'translateX(-100px)';
                slide.style.opacity = '0';
            } else if (direction === 'previous' && slideNumber > this.currentSlide) {
                slide.classList.remove('active');
                slide.style.transform = 'translateX(100px)';
                slide.style.opacity = '0';
            } else if (direction === 'next' && slideNumber > this.currentSlide) {
                slide.classList.remove('active');
                slide.style.transform = 'translateX(100px)';
                slide.style.opacity = '0';
            } else if (direction === 'previous' && slideNumber < this.currentSlide) {
                slide.classList.remove('active');
                slide.style.transform = 'translateX(-100px)';
                slide.style.opacity = '0';
            }
        });
    }

    animateSlideContent(slide) {
        // Select all animatable elements
        const elements = slide.querySelectorAll('.hover-lift, .hover-glow, .hover-scale, .hover-pulse, .content-grid > *, .feature, .tier, .metric-card, .stat');
        
        // Create staggered animation
        elements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 100 + (index * 50)); // Stagger the animations
        });
    }

    updateUI() {
        this.updateProgressBar();
        this.updateSlideCounter();
        this.updateNavigationButtons();
        this.updateNavigationMenu();
        this.preloadNextSlides();
    }

    updateProgressBar() {
        const progressFill = document.getElementById('progressFill');
        const progressPercentage = (this.currentSlide / this.totalSlides) * 100;
        progressFill.style.width = `${progressPercentage}%`;
    }

    updateSlideCounter() {
        const slideCounter = document.getElementById('slideCounter');
        slideCounter.textContent = `${this.currentSlide} / ${this.totalSlides}`;
    }

    updateNavigationButtons() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        prevBtn.disabled = this.currentSlide === 1;
        nextBtn.disabled = this.currentSlide === this.totalSlides;
    }

    updateNavigationMenu() {
        this.navItems.forEach((item, index) => {
            const slideNumber = index + 1;
            
            if (slideNumber === this.currentSlide) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    }

    updateFullscreenButton() {
        const fullscreenBtn = document.getElementById('fullscreenBtn');
        
        if (document.fullscreenElement) {
            fullscreenBtn.innerHTML = '⛶'; // Exit fullscreen icon
            fullscreenBtn.title = 'Salir de pantalla completa (F11)';
        } else {
            fullscreenBtn.innerHTML = '⛶'; // Fullscreen icon
            fullscreenBtn.title = 'Pantalla completa (F11)';
        }
    }

    preloadNextSlides() {
        // Preload next 2 slides and previous slide for smooth transitions
        const slidesToPreload = [
            this.currentSlide + 1,
            this.currentSlide + 2,
            this.currentSlide - 1
        ];
        
        slidesToPreload.forEach(slideNumber => {
            if (slideNumber >= 1 && slideNumber <= this.totalSlides) {
                const slide = this.slides[slideNumber - 1];
                if (slide) {
                    slide.style.display = 'flex'; // Ensure the slide is in the DOM
                    slide.style.visibility = 'hidden'; // But don't show it
                    
                    // After a moment, hide it completely again
                    setTimeout(() => {
                        if (slideNumber !== this.currentSlide) {
                            slide.style.display = '';
                            slide.style.visibility = '';
                        }
                    }, 100);
                }
            }
        });
    }

    setupAnimations() {
        // Add animation classes to elements
        document.querySelectorAll('.hover-lift').forEach(el => {
            el.addEventListener('mouseenter', () => {
                el.style.transform = 'translateY(-4px)';
                el.style.boxShadow = 'var(--shadow-lg)';
            });
            
            el.addEventListener('mouseleave', () => {
                el.style.transform = '';
                el.style.boxShadow = '';
            });
        });

        document.querySelectorAll('.hover-glow').forEach(el => {
            el.addEventListener('mouseenter', () => {
                el.style.boxShadow = '0 0 20px rgba(66, 133, 244, 0.3)';
            });
            
            el.addEventListener('mouseleave', () => {
                el.style.boxShadow = '';
            });
        });

        document.querySelectorAll('.hover-scale').forEach(el => {
            el.addEventListener('mouseenter', () => {
                el.style.transform = 'scale(1.05)';
            });
            
            el.addEventListener('mouseleave', () => {
                el.style.transform = '';
            });
        });

        document.querySelectorAll('.hover-highlight').forEach(el => {
            el.addEventListener('mouseenter', () => {
                el.style.backgroundColor = 'rgba(66, 133, 244, 0.1)';
            });
            
            el.addEventListener('mouseleave', () => {
                el.style.backgroundColor = '';
            });
        });
    }

    // Method to programmatically start presentation
    startPresentation() {
        this.goToSlide(1);
        document.documentElement.requestFullscreen().catch(err => {
            console.log(`Error attempting to enable fullscreen: ${err.message}`);
        });
    }

    // Method to end presentation
    endPresentation() {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
        this.goToSlide(1);
    }
}

// Initialize the presentation app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new PresentationApp();
    
    // Make app globally available for debugging/external control
    window.presentationApp = app;
    
    // Add some helpful console messages
    console.log('VibeMarket Presentation App initialized');
    console.log('Keyboard shortcuts:');
    console.log('  Arrow keys: Navigate slides');
    console.log('  Spacebar: Next slide');
    console.log('  Home/End: First/Last slide');
    console.log('  F11 or F: Toggle fullscreen');
    console.log('  Escape: Exit fullscreen');
    
    // Apply animations to the first slide immediately
    const firstSlide = document.querySelector('.slide.active');
    if (firstSlide) {
        app.animateSlideContent(firstSlide);
    }
    
    // Setup chart animations
    setupCharts();
});

// Add some utility functions for external control
window.goToSlide = (slideNumber) => {
    if (window.presentationApp) {
        window.presentationApp.goToSlide(slideNumber);
    }
};

window.nextSlide = () => {
    if (window.presentationApp) {
        window.presentationApp.nextSlide();
    }
};

window.previousSlide = () => {
    if (window.presentationApp) {
        window.presentationApp.previousSlide();
    }
};

window.startPresentation = () => {
    if (window.presentationApp) {
        window.presentationApp.startPresentation();
    }
};

window.endPresentation = () => {
    if (window.presentationApp) {
        window.presentationApp.endPresentation();
    }
};

// Setup funding chart animation
function setupCharts() {
    const fundingBars = document.querySelectorAll('.funding-fill');
    
    if (fundingBars.length > 0) {
        // Reset initial state
        fundingBars.forEach(bar => {
            bar.style.width = '0%';
        });
        
        // Set up observer to animate when visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const targetWidth = bar.style.getPropertyValue('--target-width') || bar.getAttribute('style').match(/width:\s*(\d+)%/)[1] + '%';
                    
                    // Animate the bar filling
                    setTimeout(() => {
                        bar.style.transition = 'width 1s ease-out';
                        bar.style.width = targetWidth;
                    }, 300);
                    
                    // Unobserve after animation
                    observer.unobserve(bar);
                }
            });
        }, { threshold: 0.1 });
        
        // Observe each bar
        fundingBars.forEach(bar => {
            observer.observe(bar);
        });
    }
}

// Handle page visibility changes (useful for presentations)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('Presentation paused (tab hidden)');
    } else {
        console.log('Presentation resumed (tab visible)');
    }
});

// Handle beforeunload to confirm leaving during presentation
window.addEventListener('beforeunload', (e) => {
    if (window.presentationApp && window.presentationApp.currentSlide > 1) {
        e.preventDefault();
        e.returnValue = '¿Estás seguro de que quieres salir de la presentación?';
        return e.returnValue;
    }
});

// Add smooth scrolling behavior for any internal links
document.addEventListener('click', (e) => {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    }
});

// Performance optimization: Preload slide images
function preloadSlideImages() {
    const images = document.querySelectorAll('.slide img');
    images.forEach(img => {
        if (img.dataset.src) {
            const imageLoader = new Image();
            imageLoader.src = img.dataset.src;
        }
    });
}

// Call preload function after a short delay
setTimeout(preloadSlideImages, 1000);