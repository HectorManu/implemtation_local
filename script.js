// script.js

// Navigation functionality
function showSection(sectionId, navElement) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });

    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    } else {
        console.error("Error: Section with ID not found:", sectionId);
    }

    // Update nav active state
    document.querySelectorAll('.nav-item').forEach(nav => {
        nav.classList.remove('active');
    });
    if (navElement && navElement.classList) { // Check that navElement is a valid element
         navElement.classList.add('active');
    }

    // Initialize charts when showing relevant sections using new English IDs
    if (sectionId === 'timeline' && targetSection && targetSection.classList.contains('active')) {
        // Delay slightly to ensure section is rendered and visible for chart sizing
        setTimeout(() => initChart('timelineChart', createTimelineChartConfig()), 50);
    } else if (sectionId === 'costs' && targetSection && targetSection.classList.contains('active')) {
        setTimeout(() => initChart('costChart', createCostChartConfig()), 50);
    }
}

// Copy code functionality
function copyCode(button) {
    const codeBlock = button.nextElementSibling; // Expects <pre> to be the next sibling
    if (codeBlock && codeBlock.querySelector('code')) {
        const text = codeBlock.querySelector('code').textContent;
        navigator.clipboard.writeText(text).then(() => {
            const originalHTML = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check"></i>';
            button.style.background = 'var(--accent)';

            setTimeout(() => {
                button.innerHTML = originalHTML;
                button.style.background = 'var(--secondary)';
            }, 2000);
        }).catch(err => {
            console.error('Error copying code: ', err);
            // Fallback or user notification can be added here
        });
    } else {
        console.error('Could not find the code block to copy.');
    }
}

// Generic Chart Initializer
let charts = {}; // To keep track of chart instances and destroy if re-initializing

function initChart(canvasId, config) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        console.error(`Canvas element '${canvasId}' not found.`);
        return;
    }
    // If chart for this canvas already exists, destroy it before creating a new one
    if (charts[canvasId]) {
        charts[canvasId].destroy();
    }

    // Check if canvas is visible and has dimensions, Chart.js might need this
    if (canvas.offsetParent === null) { // A way to check if it's visible
         console.warn(`Canvas '${canvasId}' might not be visible when initializing Chart.js, which can affect sizing.`);
    }

    const ctx = canvas.getContext('2d');
    try {
        charts[canvasId] = new Chart(ctx, config);
    } catch (error) {
        console.error(`Error creating chart on '${canvasId}':`, error);
    }
}

// Configuration for Timeline Chart
function createTimelineChartConfig() {
    return {
        type: 'bar',
        data: {
            labels: ['Preparation', 'Ollama', 'OpenWebUI', 'API Keys', 'Security', 'Scalability'], // Translated
            datasets: [{
                label: 'Hours', // Translated
                data: [8, 4, 4, 6, 8, 4],
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(139, 92, 246, 0.8)',
                    'rgba(6, 182, 212, 0.8)'
                ],
                borderColor: [
                    'rgba(59, 130, 246, 1)',
                    'rgba(245, 158, 11, 1)',
                    'rgba(16, 185, 129, 1)',
                    'rgba(239, 68, 68, 1)',
                    'rgba(139, 92, 246, 1)',
                    'rgba(6, 182, 212, 1)'
                ],
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.parsed.y} hours`; // Translated "horas"
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: 'white' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                },
                x: {
                    ticks: { color: 'white' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                }
            }
        }
    };
}

// Configuration for Cost Chart
function createCostChartConfig() {
    return {
        type: 'doughnut',
        data: {
            labels: [ // Translated labels matching the table structure + percentages
                'Environment Setup (13%)',
                'Ollama Installation (7%)',
                'OpenWebUI Installation (7%)',
                'API Keys Configuration (10%)',
                'Basic Security (13%)',
                'Initial Scalability (7%)',
                'Comprehensive Testing (26%)',
                'Documentation (13%)'
            ],
            datasets: [{
                label: 'Cost (%)', // Translated
                data: [13, 7, 7, 10, 13, 7, 26, 13], // Data from the table
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',    // Environment Setup
                    'rgba(245, 158, 11, 0.7)',    // Ollama Installation
                    'rgba(16, 185, 129, 0.7)',    // OpenWebUI Installation
                    'rgba(239, 68, 68, 0.8)',    // API Keys Configuration
                    'rgba(139, 92, 246, 0.8)',   // Basic Security
                    'rgba(6, 182, 212, 0.7)',     // Initial Scalability
                    'rgba(245, 158, 11, 0.9)',   // Comprehensive Testing (stronger orange)
                    'rgba(107, 114, 128, 0.8)'   // Documentation (gray)
                ],
                borderColor: 'rgba(255, 255, 255, 0.2)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: 'white', padding: 15 }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            // context.label will already be the translated full label with percentage
                            return `${context.label}`;
                        }
                    }
                }
            }
        }
    };
}


// Scroll animations
function animateOnScroll() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    if (!elements.length) return; // Don't proceed if no elements to observe

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing the element once it's visible if the animation is one-time
                // observer.unobserve(entry.target);
            } else {
                // Optional: If you want the animation to reverse when scrolling out of view
                // entry.target.classList.remove('visible');
            }
        });
    }, { threshold: 0.1 }); // 10% of the element must be visible

    elements.forEach(el => observer.observe(el));
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add .animate-on-scroll class to relevant elements for observation
    // Ensure this targets elements you want animated
    document.querySelectorAll('.card, .benefit-card, .phase-card, .rec-card, .highlight-box, .hero > *, .phases-grid > .phase-card, .rec-grid > .rec-card, .benefits-grid > .benefit-card').forEach(el => {
        el.classList.add('animate-on-scroll');
    });
    animateOnScroll(); // Then, setup the observers

    // Show the initial active section's charts if any
    const initialActiveSection = document.querySelector('.section.active');
    if (initialActiveSection) {
        const id = initialActiveSection.id;
        // Corrected IDs here for initial chart load
        if (id === 'timeline') { // Was 'cronograma'
            setTimeout(() => initChart('timelineChart', createTimelineChartConfig()), 50);
        } else if (id === 'costs') { // Was 'costos'
            setTimeout(() => initChart('costChart', createCostChartConfig()), 50);
        }
    }
});