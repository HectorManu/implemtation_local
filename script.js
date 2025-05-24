// Función mejorada para mostrar secciones
function showSection(sectionId, navElement) {
    console.log('Cambiando a sección:', sectionId);
    
    // Ocultar todas las secciones
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Mostrar la sección objetivo
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        console.log('Sección activada:', sectionId);
        
        // Para debugging
        if (window.debugMode) {
            document.getElementById('debugInfo').textContent = `Sección activa: ${sectionId}`;
        }
    } else {
        console.error('Error: No se encontró la sección con ID:', sectionId);
        // Para debugging
        if (window.debugMode) {
            document.getElementById('debugInfo').textContent = `ERROR: No se encontró la sección #${sectionId}`;
        }
    }
    
    // Actualizar estado activo de navegación
    document.querySelectorAll('.nav-item').forEach(nav => {
        nav.classList.remove('active');
    });
    
    if (navElement) {
        navElement.classList.add('active');
    }

    // Inicializar gráficos cuando se muestran secciones relevantes
    if (sectionId === 'cronograma') {
        setTimeout(initTimelineChart, 100);
    } else if (sectionId === 'costos') {
        setTimeout(initCostChart, 100);
    }
}

// Copy code functionality
function copyCode(button) {
    const codeBlock = button.nextElementSibling.querySelector('code');
    const text = codeBlock.textContent;
    
    navigator.clipboard.writeText(text).then(() => {
        const originalHTML = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i>';
        button.style.background = 'var(--accent)';
        
        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.style.background = 'var(--secondary)';
        }, 2000);
    });
}

// Initialize timeline chart
function initTimelineChart() {
    const canvas = document.getElementById('timelineChart');
    if (!canvas) {
        console.error('No se encontró el elemento canvas #timelineChart');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    
    new Chart(ctx, {
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
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: 'white'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: 'white'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            }
        }
    });
    
    console.log('Gráfico de cronograma inicializado');
}

// Initialize cost chart
function initCostChart() {
    const canvas = document.getElementById('costChart');
    if (!canvas) {
        console.error('No se encontró el elemento canvas #costChart');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Preparación (13%)', 'Pruebas (26%)', 'Seguridad (13%)', 'Documentación (13%)', 'API Keys (10%)', 'Otros (25%)'],
            datasets: [{
                data: [13, 26, 13, 13, 10, 25],
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(139, 92, 246, 0.8)',
                    'rgba(6, 182, 212, 0.8)'
                ],
                borderColor: 'rgba(255, 255, 255, 0.2)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        color: 'white'
                    }
                }
            }
        }
    });
    
    console.log('Gráfico de costos inicializado');
}

// Scroll animations
function animateOnScroll() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(el => observer.observe(el));
}

// Función para activar/desactivar el modo de depuración
function toggleDebugMode() {
    window.debugMode = !window.debugMode;
    
    if (window.debugMode) {
        document.body.classList.add('debug-mode');
        document.getElementById('debugPanel').style.display = 'block';
        console.log('Modo de depuración activado');
        
        // Verificar secciones
        checkSections();
    } else {
        document.body.classList.remove('debug-mode');
        document.getElementById('debugPanel').style.display = 'none';
        console.log('Modo de depuración desactivado');
    }
}

// Función para verificar el estado de las secciones
function checkSections() {
    console.log('Verificando secciones...');
    
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        const id = section.id;
        const isActive = section.classList.contains('active');
        const display = window.getComputedStyle(section).display;
        
        console.log(`Sección #${id}: ${isActive ? 'ACTIVA' : 'inactiva'}, display: ${display}`);
    });
    
    const activeNav = document.querySelector('.nav-item.active');
    if (activeNav) {
        console.log(`Navegación activa: ${activeNav.textContent.trim()}, href: ${activeNav.getAttribute('href')}`);
    } else {
        console.log('No hay navegación activa');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado, inicializando...');
    
    // Variables globales
    window.debugMode = false;
    
    // Inicializar animaciones de scroll
    animateOnScroll();
    
    // Añadir animaciones a elementos
    document.querySelectorAll('.card, .benefit-card, .phase-card, .rec-card').forEach(el => {
        el.classList.add('animate-on-scroll');
    });
    
    // Verificar que la sección inicial esté activa
    const activeSection = document.querySelector('.section.active');
    if (!activeSection) {
        console.warn('No hay sección activa al cargar la página, activando sección introduccion');
        showSection('introduccion', document.querySelector('.nav-item[href="#introduccion"]'));
    } else {
        console.log('Sección activa al cargar:', activeSection.id);
    }
    
    // Añadir acceso rápido al modo de depuración desde la consola
    window.debug = {
        toggle: toggleDebugMode,
        check: checkSections,
        showSection: showSection
    };
    
    console.log('Inicialización completa');
});

// Método alternativo de navegación para fallback
function navigateTo(sectionId) {
    // Oculta todas las secciones manualmente
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
        section.classList.remove('active');
    });
    
    // Muestra solo la sección seleccionada
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = 'block';
        targetSection.classList.add('active');
        console.log('Navegación alternativa a:', sectionId);
    } else {
        console.error('Navegación alternativa: No se encontró la sección', sectionId);
    }
    
    // Actualiza los enlaces de navegación
    document.querySelectorAll('.nav-item').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + sectionId) {
            link.classList.add('active');
        }
    });
    
    // Inicializa los gráficos si es necesario
    if (sectionId === 'cronograma') {
        setTimeout(initTimelineChart, 100);
    } else if (sectionId === 'costos') {
        setTimeout(initCostChart, 100);
    }
}

// Para activar el modo de depuración desde la consola
// Uso: debug.toggle()