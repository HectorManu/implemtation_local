/*
================================================================================
SISTEMA DE NAVEGACIÓN INTERACTIVA PARA PROPUESTAS EMPRESARIALES
================================================================================

PROPÓSITO:
Este código implementa un sistema de navegación avanzado para presentaciones 
técnicas empresariales, diseñado específicamente para mejorar la experiencia 
del usuario al revisar propuestas complejas de proyectos de infraestructura.

PROBLEMA QUE RESUELVE:
- Las propuestas técnicas tradicionales son documentos estáticos y difíciles de navegar
- Los ejecutivos necesitan acceso rápido a información específica sin perderse en detalles técnicos
- La presentación de cronogramas y costos requiere visualización interactiva para facilitar la toma de decisiones

VALOR DE NEGOCIO:
- Reduce el tiempo de revisión de propuestas de horas a minutos
- Mejora la comprensión de proyectos complejos mediante navegación visual
- Aumenta la profesionalidad percibida y diferenciación competitiva
- Facilita la presentación ejecutiva con gráficos interactivos en tiempo real

TECNOLOGÍA UTILIZADA:
- JavaScript vanilla para máxima compatibilidad
- Chart.js para visualizaciones profesionales
- Responsive design para acceso multi-dispositivo
================================================================================
*/

// ==================== VARIABLES GLOBALES DEL SISTEMA ====================
let projectTimelineChart = null;
const navigationSections = document.querySelectorAll('.content-section');
const mainNavigationLinks = document.querySelectorAll('.nav-item');
const subNavigationLinks = document.querySelectorAll('.sub-nav-item');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const sidebarNavigation = document.querySelector('.sidebar');
const collapsibleSections = document.querySelectorAll('.nav-section');

// ==================== INICIALIZACIÓN DEL SISTEMA ====================
document.addEventListener('DOMContentLoaded', function() {
    initializePrimaryNavigation();
    initializeMobileMenuSystem();
    initializeCodeCopyButtons();
    initializeCollapsibleNavigation();
    
    // Establecer sección inicial del documento
    const initialSection = window.location.hash || '#introduccion';
    displaySelectedSection(initialSection);
    
    // Renderizar gráficos si la sección lo requiere
    if (initialSection === '#gantt') {
        setTimeout(renderProjectTimelineChart, 100);
    }
});

// ==================== SISTEMA DE NAVEGACIÓN PRINCIPAL ====================
function initializePrimaryNavigation() {
    // Configurar enlaces de navegación principal
    mainNavigationLinks.forEach(navigationLink => {
        navigationLink.addEventListener('click', handlePrimaryNavigation);
    });
    
    // Configurar navegación secundaria (sub-secciones)
    subNavigationLinks.forEach(subLink => {
        subLink.addEventListener('click', handleSecondaryNavigation);
    });
    
    // Manejar navegación del historial del navegador (botones atrás/adelante)
    window.addEventListener('popstate', handleBrowserNavigation);
}

function handlePrimaryNavigation(clickEvent) {
    clickEvent.preventDefault();
    const targetSectionId = clickEvent.currentTarget.getAttribute('href');
    
    // Manejar expansión de sub-navegación para secciones complejas
    const parentSection = clickEvent.currentTarget.closest('.nav-section');
    if (parentSection && targetSectionId === '#plan') {
        toggleSubNavigationVisibility(parentSection);
    }
    
    navigateToSection(targetSectionId);
}

function handleSecondaryNavigation(clickEvent) {
    clickEvent.preventDefault();
    const targetSectionId = clickEvent.currentTarget.getAttribute('href');
    navigateToSection(targetSectionId);
}

function handleBrowserNavigation() {
    const currentSection = window.location.hash || '#introduccion';
    displaySelectedSection(currentSection);
    
    // Renderizar gráficos específicos si es necesario
    if (currentSection === '#gantt') {
        setTimeout(renderProjectTimelineChart, 100);
    }
}

// ==================== CONTROL DE VISUALIZACIÓN DE SECCIONES ====================
function navigateToSection(targetSectionId) {
    // Actualizar historial del navegador sin recargar página
    history.pushState(null, null, targetSectionId);
    displaySelectedSection(targetSectionId);
    
    // Renderizar contenido específico de la sección
    if (targetSectionId === '#gantt') {
        setTimeout(renderProjectTimelineChart, 100);
    }
    
    // Cerrar menú móvil automáticamente en dispositivos pequeños
    if (window.innerWidth <= 768) {
        sidebarNavigation.classList.remove('active');
    }
}

function displaySelectedSection(sectionHash) {
    // Ocultar todas las secciones del contenido
    navigationSections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Mostrar la sección objetivo
    let targetContentSection;
    if (sectionHash.startsWith('#fase') && sectionHash !== '#plan') {
        // Caso especial: mostrar sección de plan para fases específicas
        targetContentSection = document.getElementById('plan');
        if (targetContentSection) {
            targetContentSection.classList.add('active');
            // Desplazamiento suave a la fase específica
            setTimeout(() => {
                const specificPhaseElement = document.querySelector(sectionHash);
                if (specificPhaseElement) {
                    specificPhaseElement.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start',
                        inline: 'nearest'
                    });
                }
            }, 100);
        }
    } else {
        // Navegación estándar a secciones principales
        const sectionIdentifier = sectionHash.substring(1) || 'introduccion';
        targetContentSection = document.getElementById(sectionIdentifier);
        if (targetContentSection) {
            targetContentSection.classList.add('active');
            // Desplazamiento suave al inicio de la sección
            setTimeout(() => {
                targetContentSection.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start',
                    inline: 'nearest'
                });
            }, 100);
        }
    }
    
    updateNavigationHighlights(sectionHash);
    updateSubNavigationExpansion(sectionHash);
}

function updateNavigationHighlights(activeSection) {
    // Actualizar resaltado en navegación principal
    mainNavigationLinks.forEach(navLink => {
        const linkTarget = navLink.getAttribute('href');
        if (linkTarget === activeSection || (activeSection.startsWith('#fase') && linkTarget === '#plan')) {
            navLink.classList.add('active');
        } else {
            navLink.classList.remove('active');
        }
    });
    
    // Actualizar resaltado en sub-navegación
    subNavigationLinks.forEach(subLink => {
        const subLinkTarget = subLink.getAttribute('href');
        if (subLinkTarget === activeSection) {
            subLink.classList.add('active');
        } else {
            subLink.classList.remove('active');
        }
    });
}

function updateSubNavigationExpansion(currentSection) {
    // Expandir automáticamente la sección de plan si se visualizan fases
    const planSectionContainer = document.querySelector('.nav-section a[href="#plan"]')?.closest('.nav-section');
    if (planSectionContainer && (currentSection === '#plan' || currentSection.startsWith('#fase'))) {
        planSectionContainer.classList.add('active');
    }
}

// ==================== SISTEMA DE NAVEGACIÓN COLAPSIBLE ====================
function initializeCollapsibleNavigation() {
    collapsibleSections.forEach(section => {
        const primaryLink = section.querySelector('.nav-item');
        if (primaryLink) {
            primaryLink.addEventListener('click', (clickEvent) => {
                const linkTarget = primaryLink.getAttribute('href');
                if (linkTarget === '#plan') {
                    clickEvent.preventDefault();
                    toggleSubNavigationVisibility(section);
                    navigateToSection(linkTarget);
                }
            });
        }
    });
}

function toggleSubNavigationVisibility(targetSection) {
    targetSection.classList.toggle('active');
    
    // Cerrar otras sub-navegaciones para mantener interfaz limpia
    collapsibleSections.forEach(otherSection => {
        if (otherSection !== targetSection) {
            otherSection.classList.remove('active');
        }
    });
}

// ==================== SISTEMA DE MENÚ MÓVIL RESPONSIVO ====================
function initializeMobileMenuSystem() {
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleMobileMenuVisibility);
    }
    
    // Cerrar menú móvil al hacer clic fuera del área de navegación
    document.addEventListener('click', (clickEvent) => {
        if (window.innerWidth <= 768 && sidebarNavigation.classList.contains('active')) {
            if (!sidebarNavigation.contains(clickEvent.target) && !mobileMenuToggle.contains(clickEvent.target)) {
                sidebarNavigation.classList.remove('active');
            }
        }
    });
    
    // Manejar cambios de tamaño de pantalla para responsividad
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            sidebarNavigation.classList.remove('active');
        }
    });
}

function toggleMobileMenuVisibility() {
    sidebarNavigation.classList.toggle('active');
}

// ==================== SISTEMA DE COPIADO DE CÓDIGO TÉCNICO ====================
function initializeCodeCopyButtons() {
    const copyCodeButtons = document.querySelectorAll('.copy-btn');
    copyCodeButtons.forEach(button => {
        button.addEventListener('click', handleCodeCopyAction);
    });
}

async function handleCodeCopyAction(clickEvent) {
    const copyButton = clickEvent.currentTarget;
    const codeBlock = copyButton.nextElementSibling;
    const codeContent = codeBlock.innerText;
    
    try {
        await navigator.clipboard.writeText(codeContent);
        showCopySuccessIndicator(copyButton);
    } catch (error) {
        console.error('Error al copiar código técnico: ', error);
        showCopyErrorIndicator(copyButton);
    }
}

function showCopySuccessIndicator(button) {
    const originalButtonContent = button.innerHTML;
    button.innerHTML = '<i class="fas fa-check"></i>';
    button.style.background = '#10b981';
    
    setTimeout(() => {
        button.innerHTML = originalButtonContent;
        button.style.background = '';
    }, 2000);
}

function showCopyErrorIndicator(button) {
    const originalButtonContent = button.innerHTML;
    button.innerHTML = '<i class="fas fa-times"></i>';
    button.style.background = '#ef4444';
    
    setTimeout(() => {
        button.innerHTML = originalButtonContent;
        button.style.background = '';
    }, 2000);
}

// ==================== GENERACIÓN DE GRÁFICOS EJECUTIVOS ====================
function renderProjectTimelineChart() {
    const chartCanvas = document.getElementById('ganttChartHoras');
    if (!chartCanvas) return;
    
    const chartContext = chartCanvas.getContext('2d');
    
    // Destruir gráfico existente para evitar superposiciones
    if (projectTimelineChart) {
        projectTimelineChart.destroy();
    }
    
    // Datos del proyecto estructurados para presentación ejecutiva
    const projectPhaseData = {
        labels: [
            "Planificación Estratégica",
            "Preparación Infraestructura",
            "Instalación Ollama",
            "Instalación OpenWebUI",
            "Configuración APIs",
            "Implementación Seguridad",
            "Optimización Escalabilidad",
            "Pruebas Integrales",
            "Documentación Final"
        ],
        datasets: [{
            label: 'Horas de Inversión Estimadas',
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
            borderColor: 'rgba(245, 158, 11, 1)',
            borderWidth: 2,
            borderRadius: 6,
            borderSkipped: false,
        }]
    };
    
    // Configuración profesional del gráfico para presentación ejecutiva
    const chartConfiguration = {
        type: 'bar',
        data: projectPhaseData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y', // Gráfico horizontal para mejor legibilidad
            animation: {
                duration: 1500,
                easing: 'easeOutQuart'
            },
            scales: {
                x: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Horas de Inversión Requeridas',
                        font: { size: 14, weight: 'bold' },
                        color: '#374151'
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#6b7280',
                        font: { size: 12 }
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Fases del Proyecto',
                        font: { size: 14, weight: 'bold' },
                        color: '#374151'
                    },
                    grid: { display: false },
                    ticks: {
                        color: '#6b7280',
                        font: { size: 12 },
                        callback: function(value, index, values) {
                            const labelText = this.getLabelForValue(value);
                            return labelText.length > 20 ? labelText.substring(0, 20) + '...' : labelText;
                        }
                    }
                }
            },
            plugins: {
                legend: { display: false },
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
                            return `${context.raw} horas de inversión`;
                        }
                    }
                }
            },
            layout: {
                padding: { top: 20, right: 20, bottom: 20, left: 20 }
            }
        }
    };
    
    // Crear instancia del gráfico ejecutivo
    projectTimelineChart = new Chart(chartContext, chartConfiguration);
}

// ==================== FUNCIONES DE OPTIMIZACIÓN DE RENDIMIENTO ====================
function createDebounceFunction(targetFunction, delayMilliseconds) {
    let timeoutReference;
    return function executeDebouncedFunction(...arguments) {
        const laterExecution = () => {
            clearTimeout(timeoutReference);
            targetFunction(...arguments);
        };
        clearTimeout(timeoutReference);
        timeoutReference = setTimeout(laterExecution, delayMilliseconds);
    };
}

function createThrottleFunction(targetFunction, limitMilliseconds) {
    let lastExecutionTime;
    let lastTimeoutReference;
    return function executeThrottledFunction() {
        const executionContext = this;
        const functionArguments = arguments;
        
        if (!lastExecutionTime) {
            targetFunction.apply(executionContext, functionArguments);
            lastExecutionTime = Date.now();
        } else {
            clearTimeout(lastTimeoutReference);
            lastTimeoutReference = setTimeout(function() {
                if ((Date.now() - lastExecutionTime) >= limitMilliseconds) {
                    targetFunction.apply(executionContext, functionArguments);
                    lastExecutionTime = Date.now();
                }
            }, limitMilliseconds - (Date.now() - lastExecutionTime));
        }
    }
}

// ==================== OPTIMIZACIONES DE RENDIMIENTO DEL SISTEMA ====================
const optimizedScrollHandler = createDebounceFunction(() => {
    // Funcionalidad de scroll optimizada se implementaría aquí según necesidades
}, 100);

window.addEventListener('scroll', optimizedScrollHandler);

const optimizedResizeHandler = createDebounceFunction(() => {
    if (projectTimelineChart) {
        projectTimelineChart.resize();
    }
}, 250);

window.addEventListener('resize', optimizedResizeHandler);

// ==================== SISTEMA DE ANIMACIONES PROFESIONALES ====================
function initializeScrollAnimations() {
    const observerConfiguration = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const animationObserver = new IntersectionObserver((observedEntries) => {
        observedEntries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerConfiguration);
    
    // Observar elementos que requieren animación al aparecer en pantalla
    const animatedElements = document.querySelectorAll(
        '.content-card, .phase-card, .recommendation-card, .conclusion-point'
    );
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        animationObserver.observe(element);
    });
}

// Inicializar animaciones después de que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initializeScrollAnimations, 500);
});

// ==================== NAVEGACIÓN POR TECLADO PARA ACCESIBILIDAD ====================
document.addEventListener('keydown', (keyEvent) => {
    // Tecla ESC para cerrar menú móvil
    if (keyEvent.key === 'Escape' && sidebarNavigation.classList.contains('active')) {
        sidebarNavigation.classList.remove('active');
    }
    
    // Navegación con flechas del teclado (Ctrl + flecha)
    if (keyEvent.ctrlKey || keyEvent.metaKey) {
        const currentSection = window.location.hash || '#introduccion';
        const sectionSequence = [
            '#introduccion', '#plan', '#gantt', '#costos', '#recomendaciones', '#conclusion'
        ];
        
        const currentIndex = sectionSequence.indexOf(currentSection);
        
        if (keyEvent.key === 'ArrowRight' && currentIndex < sectionSequence.length - 1) {
            keyEvent.preventDefault();
            navigateToSection(sectionSequence[currentIndex + 1]);
        } else if (keyEvent.key === 'ArrowLeft' && currentIndex > 0) {
            keyEvent.preventDefault();
            navigateToSection(sectionSequence[currentIndex - 1]);
        }
    }
});

// ==================== MANEJO PROFESIONAL DE ERRORES ====================
window.addEventListener('error', (errorEvent) => {
    console.error('Error del sistema detectado:', errorEvent.error);
    // Implementar reporte de errores empresarial aquí si es necesario
});

window.addEventListener('unhandledrejection', (rejectionEvent) => {
    console.error('Promesa rechazada sin manejo:', rejectionEvent.reason);
    // Implementar manejo de promesas rechazadas aquí si es necesario
});