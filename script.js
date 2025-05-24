// ===== GLOBAL VARIABLES =====
let ganttHorasChartInstance = null;
const sections = document.querySelectorAll('.content-section');
const navLinks = document.querySelectorAll('.nav-item');
const subNavLinks = document.querySelectorAll('.sub-nav-item');
const mobileToggle = document.querySelector('.mobile-menu-toggle');
const sidebar = document.querySelector('.sidebar');
const navSections = document.querySelectorAll('.nav-section');

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeMobileMenu();
    initializeCopyButtons();
    initializeSubNavigation();
    
    // Set initial section
    const initialHash = window.location.hash || '#introduccion';
    showSection(initialHash);
    
    // Render chart if on gantt section
    if (initialHash === '#gantt') {
        setTimeout(renderGanttHorasChart, 100);
    }
});

// ===== NAVIGATION FUNCTIONS =====
function initializeNavigation() {
    // Main navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavClick);
    });
    
    // Sub navigation links
    subNavLinks.forEach(link => {
        link.addEventListener('click', handleSubNavClick);
    });
    
    // Handle browser back/forward
    window.addEventListener('popstate', handlePopState);
}

function handleNavClick(e) {
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute('href');
    
    // Handle sub-navigation toggle
    const navSection = e.currentTarget.closest('.nav-section');
    if (navSection && targetId === '#plan') {
        toggleSubNavigation(navSection);
    }
    
    navigateToSection(targetId);
}

function handleSubNavClick(e) {
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute('href');
    navigateToSection(targetId);
}

function handlePopState() {
    const currentHash = window.location.hash || '#introduccion';
    showSection(currentHash);
    
    if (currentHash === '#gantt') {
        setTimeout(renderGanttHorasChart, 100);
    }
}

function navigateToSection(targetId) {
    history.pushState(null, null, targetId);
    showSection(targetId);
    
    if (targetId === '#gantt') {
        setTimeout(renderGanttHorasChart, 100);
    }
    
    // Close mobile menu if open
    if (window.innerWidth <= 768) {
        sidebar.classList.remove('active');
    }
}

function showSection(hash) {
    // Hide all sections
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    let targetSection;
    if (hash.startsWith('#fase') && hash !== '#plan') {
        // Show plan section for phases
        targetSection = document.getElementById('plan');
        if (targetSection) {
            targetSection.classList.add('active');
            // Scroll to specific phase
            setTimeout(() => {
                const phaseElement = document.querySelector(hash);
                if (phaseElement) {
                    phaseElement.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start',
                        inline: 'nearest'
                    });
                }
            }, 100);
        }
    } else {
        const sectionId = hash.substring(1) || 'introduccion';
        targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            // Smooth scroll to top of section
            setTimeout(() => {
                targetSection.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start',
                    inline: 'nearest'
                });
            }, 100);
        }
    }
    
    updateActiveLinks(hash);
    updateSubNavigation(hash);
}

function updateActiveLinks(hash) {
    // Update main navigation
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === hash || (hash.startsWith('#fase') && linkHref === '#plan')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Update sub navigation
    subNavLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === hash) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

function updateSubNavigation(hash) {
    // Auto-expand plan section if viewing phases
    const planSection = document.querySelector('.nav-section a[href="#plan"]')?.closest('.nav-section');
    if (planSection && (hash === '#plan' || hash.startsWith('#fase'))) {
        planSection.classList.add('active');
    }
}

// ===== SUB-NAVIGATION FUNCTIONS =====
function initializeSubNavigation() {
    navSections.forEach(section => {
        const mainLink = section.querySelector('.nav-item');
        if (mainLink) {
            mainLink.addEventListener('click', (e) => {
                const href = mainLink.getAttribute('href');
                if (href === '#plan') {
                    e.preventDefault();
                    toggleSubNavigation(section);
                    navigateToSection(href);
                }
            });
        }
    });
}

function toggleSubNavigation(section) {
    section.classList.toggle('active');
    
    // Close other sub-navigations
    navSections.forEach(otherSection => {
        if (otherSection !== section) {
            otherSection.classList.remove('active');
        }
    });
}

// ===== MOBILE MENU FUNCTIONS =====
function initializeMobileMenu() {
    if (mobileToggle) {
        mobileToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && sidebar.classList.contains('active')) {
            if (!sidebar.contains(e.target) && !mobileToggle.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            sidebar.classList.remove('active');
        }
    });
}

function toggleMobileMenu() {
    sidebar.classList.toggle('active');
}

// ===== COPY BUTTON FUNCTIONS =====
function initializeCopyButtons() {
    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach(button => {
        button.addEventListener('click', handleCopyClick);
    });
}

async function handleCopyClick(e) {
    const button = e.currentTarget;
    const codeBlock = button.nextElementSibling;
    const code = codeBlock.innerText;
    
    try {
        await navigator.clipboard.writeText(code);
        showCopySuccess(button);
    } catch (err) {
        console.error('Error al copiar: ', err);
        showCopyError(button);
    }
}

function showCopySuccess(button) {
    const originalContent = button.innerHTML;
    button.innerHTML = '<i class="fas fa-check"></i>';
    button.style.background = '#10b981';
    
    setTimeout(() => {
        button.innerHTML = originalContent;
        button.style.background = '';
    }, 2000);
}

function showCopyError(button) {
    const originalContent = button.innerHTML;
    button.innerHTML = '<i class="fas fa-times"></i>';
    button.style.background = '#ef4444';
    
    setTimeout(() => {
        button.innerHTML = originalContent;
        button.style.background = '';
    }, 2000);
}

// ===== CHART FUNCTIONS =====
function renderGanttHorasChart() {
    const canvas = document.getElementById('ganttChartHoras');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Destroy existing chart
    if (ganttHorasChartInstance) {
        ganttHorasChartInstance.destroy();
    }
    
    const data = {
        labels: [
            "Planificación",
            "Preparación Entorno",
            "Instalación Ollama",
            "Instalación OpenWebUI",
            "Configuración API",
            "Seguridad Básica",
            "Escalabilidad",
            "Pruebas Integrales",
            "Documentación"
        ],
        datasets: [{
            label: 'Horas Estimadas',
            data: [3, 8, 4, 4, 6, 8, 4, 16, 8],
            backgroundColor: [
                'rgba(245, 158, 11, 0.8)',
                'rgba(217, 119, 6, 0.8)',
                'rgba(180, 83, 9, 0.8)',
                'rgba(146, 64, 14, 0.8)',
                'rgba(120, 53, 15, 0.8)',
                'rgba(245, 158, 11, 0.6)',
                'rgba(217, 119, 6, 0.6)',
                'rgba(180, 83, 9, 0.6)',
                'rgba(146, 64, 14, 0.6)'
            ],
            borderColor: [
                'rgba(245, 158, 11, 1)',
                'rgba(217, 119, 6, 1)',
                'rgba(180, 83, 9, 1)',
                'rgba(146, 64, 14, 1)',
                'rgba(120, 53, 15, 1)',
                'rgba(245, 158, 11, 1)',
                'rgba(217, 119, 6, 1)',
                'rgba(180, 83, 9, 1)',
                'rgba(146, 64, 14, 1)'
            ],
            borderWidth: 2,
            borderRadius: 6,
            borderSkipped: false,
        }]
    };
    
    const config = {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            animation: {
                duration: 1500,
                easing: 'easeOutQuart'
            },
            scales: {
                x: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Horas Estimadas',
                        font: {
                            size: 14,
                            weight: 'bold'
                        },
                        color: '#374151'
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#6b7280',
                        font: {
                            size: 12
                        }
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Fases del Proyecto',
                        font: {
                            size: 14,
                            weight: 'bold'
                        },
                        color: '#374151'
                    },
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#6b7280',
                        font: {
                            size: 12
                        },
                        callback: function(value, index, values) {
                            const label = this.getLabelForValue(value);
                            return label.length > 20 ? label.substring(0, 20) + '...' : label;
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: '#f59e0b',
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: false,
                    callbacks: {
                        title: function(context) {
                            return context[0].label;
                        },
                        label: function(context) {
                            return `${context.raw} horas estimadas`;
                        }
                    }
                }
            },
            layout: {
                padding: {
                    top: 20,
                    right: 20,
                    bottom: 20,
                    left: 20
                }
            }
        }
    };
    
    ganttHorasChartInstance = new Chart(ctx, config);
}

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait) {
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

function throttle(func, limit) {
    let lastFunc;
    let lastRan;
    return function() {
        const context = this;
        const args = arguments;
        if (!lastRan) {
            func.apply(context, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(function() {
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    }
}

// ===== PERFORMANCE OPTIMIZATIONS =====
// Optimize scroll handling
const debouncedScrollHandler = debounce(() => {
    // Add any scroll-based functionality here if needed
}, 100);

window.addEventListener('scroll', debouncedScrollHandler);

// Optimize resize handling
const debouncedResizeHandler = debounce(() => {
    if (ganttHorasChartInstance) {
        ganttHorasChartInstance.resize();
    }
}, 250);

window.addEventListener('resize', debouncedResizeHandler);

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements that should animate on scroll
    const animatedElements = document.querySelectorAll(
        '.content-card, .phase-card, .recommendation-card, .conclusion-point'
    );
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initializeAnimations, 500);
});

// ===== KEYBOARD NAVIGATION =====
document.addEventListener('keydown', (e) => {
    // ESC key to close mobile menu
    if (e.key === 'Escape' && sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
    }
    
    // Arrow keys for section navigation
    if (e.ctrlKey || e.metaKey) {
        const currentHash = window.location.hash || '#introduccion';
        const sectionOrder = [
            '#introduccion',
            '#plan',
            '#gantt',
            '#costos',
            '#recomendaciones',
            '#conclusion'
        ];
        
        const currentIndex = sectionOrder.indexOf(currentHash);
        
        if (e.key === 'ArrowRight' && currentIndex < sectionOrder.length - 1) {
            e.preventDefault();
            navigateToSection(sectionOrder[currentIndex + 1]);
        } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
            e.preventDefault();
            navigateToSection(sectionOrder[currentIndex - 1]);
        }
    }
});

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.error);
    // Could implement user-friendly error reporting here
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled Promise Rejection:', e.reason);
    // Could implement user-friendly error reporting here
});

// ===== ACCESSIBILITY IMPROVEMENTS =====
function improveAccessibility() {
    // Add skip link for keyboard users
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Saltar al contenido principal';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #000;
        color: #fff;
        padding: 8px;
        text-decoration: none;
        z-index: 9999;
        border-radius: 4px;
    `;
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main content ID
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.id = 'main-content';
    }
    
    // Improve focus management
    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    
    // Trap focus in mobile menu when open
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab' && sidebar.classList.contains('active')) {
            const focusableContent = sidebar.querySelectorAll(focusableElements);
            const firstFocusableElement = focusableContent[0];
            const lastFocusableElement = focusableContent[focusableContent.length - 1];
            
            if (e.shiftKey) {
                if (document.activeElement === firstFocusableElement) {
                    lastFocusableElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusableElement) {
                    firstFocusableElement.focus();
                    e.preventDefault();
                }
            }
        }
    });
}

// Initialize accessibility improvements
document.addEventListener('DOMContentLoaded', improveAccessibility);

// ===== PRINT SUPPORT =====
window.addEventListener('beforeprint', () => {
    // Show all sections for printing
    sections.forEach(section => {
        section.style.display = 'block';
    });
});

window.addEventListener('afterprint', () => {
    // Restore section visibility
    const currentHash = window.location.hash || '#introduccion';
    showSection(currentHash);
});

// ===== EXPORT FUNCTIONALITY =====
function exportToPDF() {
    // This would require a PDF library like jsPDF or html2pdf
    // Implementation would depend on specific requirements
    console.log('PDF export functionality would be implemented here');
}

// ===== ANALYTICS TRACKING (Optional) =====
function trackSectionView(sectionId) {
    // Implementation would depend on analytics provider (GA4, etc.)
    // console.log('Section viewed:', sectionId);
}

// ===== PERFORMANCE MONITORING =====
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
        }, 0);
    });
}