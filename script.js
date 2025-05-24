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
        console.error("Error: No se encontró la sección con ID:", sectionId);
    }

    // Update nav active state
    document.querySelectorAll('.nav-item').forEach(nav => {
        nav.classList.remove('active');
    });
    if (navElement && navElement.classList) {
         navElement.classList.add('active');
    }

    // Initialize charts when showing relevant sections
    // Ensure charts are initialized only if the section is now active and the canvas exists
    if (sectionId === 'cronograma' && targetSection && targetSection.classList.contains('active')) {
        // Delay slightly to ensure section is rendered and visible for chart sizing
        setTimeout(() => initChart('timelineChart', createTimelineChartConfig()), 50);
    } else if (sectionId === 'costos' && targetSection && targetSection.classList.contains('active')) {
        setTimeout(() => initChart('costChart', createCostChartConfig()), 50);
    }

    // Optional: Manually scroll to the section if default anchor behavior is not enough
    // This can provide more control if scroll-margin-top is not perfect in all browsers/cases
    // if (targetSection) {
    //     const navHeight = document.querySelector('.nav')?.offsetHeight || 70; // Get nav height or fallback
    //     const elementPosition = targetSection.getBoundingClientRect().top + window.pageYOffset;
    //     const offsetPosition = elementPosition - navHeight;
    //
    //     window.scrollTo({
    //         top: offsetPosition,
    //         behavior: "smooth"
    //     });
    // }
}

// Copy code functionality
function copyCode(button) {
    const codeBlock = button.nextElementSibling;
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
            console.error('Error al copiar el código: ', err);
            // Fallback or user notification can be added here
        });
    } else {
        console.error('No se pudo encontrar el bloque de código para copiar.');
    }
}


// Generic Chart Initializer
let charts = {}; // To keep track of chart instances and destroy if re-initializing

function initChart(canvasId, config) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        console.error(`Elemento canvas '${canvasId}' no encontrado.`);
        return;
    }
    // If chart for this canvas already exists, destroy it before creating a new one
    if (charts[canvasId]) {
        charts[canvasId].destroy();
    }

    // Check if canvas is visible and has dimensions, Chart.js might need this
    if (canvas.offsetParent === null) {
         console.warn(`Canvas '${canvasId}' podría no estar visible al inicializar Chart.js, lo que puede afectar el tamaño.`);
    }

    const ctx = canvas.getContext('2d');
    try {
        charts[canvasId] = new Chart(ctx, config);
    } catch (error) {
        console.error(`Error al crear el gráfico en '${canvasId}':`, error);
    }
}

// Configuration for Timeline Chart
function createTimelineChartConfig() {
    return {
        type: 'bar',
        data: {
            labels: ['Preparación', 'Ollama', 'OpenWebUI', 'API Keys', 'Seguridad', 'Escalabilidad'],
            datasets: [{
                label: 'Horas',
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
                            return `${context.dataset.label}: ${context.parsed.y} horas`;
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
            labels: ['Preparación', 'Pruebas Integrales', 'Seguridad Básica', 'Documentación', 'Config. API Keys', 'Inst. Ollama', 'Inst. OpenWebUI', 'Escalabilidad Inicial'],
            datasets: [{
                label: 'Costo (%)',
                data: [13, 26, 13, 13, 10, 7, 7, 7], // Based on percentages: 8, 16, 8, 8, 6, 4, 4, 4 (sum=58, not 61/100%) Recalculating based on 61h total.
                                                // Prep: 8/61 = 13.1%
                                                // Ollama: 4/61 = 6.5%
                                                // OpenWebUI: 4/61 = 6.5%
                                                // API Keys: 6/61 = 9.8%
                                                // Seguridad: 8/61 = 13.1%
                                                // Escalabilidad: 4/61 = 6.5%
                                                // Pruebas: 16/61 = 26.2%
                                                // Documentación: 8/61 = 13.1%
                                                // Sum = 94.8%, remaining 5.2% for contingency or rounding.
                                                // Let's use provided table percentages
                data: [13, 7, 7, 10, 13, 7, 26, 13], // Corresponds to table: Prep, Ollama, OpenWebUI, API, Sec, Esc, Pruebas, Doc
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)', // Preparación
                    'rgba(245, 158, 11, 0.7)', // Ollama
                    'rgba(16, 185, 129, 0.7)', // OpenWebUI
                    'rgba(239, 68, 68, 0.8)', // API Keys
                    'rgba(139, 92, 246, 0.8)', // Seguridad
                    'rgba(6, 182, 212, 0.7)',  // Escalabilidad
                    'rgba(245, 158, 11, 0.9)', // Pruebas (stronger orange)
                    'rgba(107, 114, 128, 0.8)' // Documentación (gray)
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
                            return `${context.label}: ${context.parsed}%`;
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
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                // Si quieres que la animación se reinicie al salir de la vista, descomenta:
                // entry.target.classList.remove('visible');
            }
        });
    }, { threshold: 0.1 }); // El 10% del elemento debe estar visible

    elements.forEach(el => observer.observe(el));
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add .animate-on-scroll class to relevant elements for observation
    document.querySelectorAll('.card, .benefit-card, .phase-card, .rec-card, .highlight-box, .hero > *').forEach(el => {
        el.classList.add('animate-on-scroll');
    });
    animateOnScroll(); // Setup the observers

    // Show the initial active section's charts if any (e.g., if 'cronograma' or 'costos' were default active)
    const initialActiveSection = document.querySelector('.section.active');
    if (initialActiveSection) {
        const id = initialActiveSection.id;
        if (id === 'cronograma') {
            setTimeout(() => initChart('timelineChart', createTimelineChartConfig()), 50);
        } else if (id === 'costos') {
            setTimeout(() => initChart('costChart', createCostChartConfig()), 50);
        }
    }
});