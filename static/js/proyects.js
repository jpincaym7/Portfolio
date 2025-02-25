// script.js - Funcionalidad para proyectos

document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos del DOM
    const proyectoCards = document.querySelectorAll('.proyecto-card');
    const panelDetalle = document.getElementById('panel-detalle');
    const contenidoDetalle = document.getElementById('contenido-detalle');
    const cerrarPanel = document.getElementById('cerrar-panel');
    const overlay = document.getElementById('overlay');
    
    // Función para abrir el panel de detalles
    function abrirPanel(proyectoId) {
        const proyecto = document.querySelector(`.proyecto-card[data-proyecto-id="${proyectoId}"]`);
        const detalleData = proyecto.querySelector('.proyecto-detalle-data').cloneNode(true);
        
        // Limpiamos el contenido anterior y añadimos el nuevo
        contenidoDetalle.innerHTML = '';
        detalleData.style.display = 'block';
        contenidoDetalle.appendChild(detalleData);
        
        // Activamos el panel y el overlay
        panelDetalle.classList.add('abierto');
        overlay.classList.add('activo');
        
        // Bloqueamos el scroll en el body
        document.body.style.overflow = 'hidden';
        
        // Añadimos clase para animación secuencial
        setTimeout(() => {
            const elementos = contenidoDetalle.querySelectorAll('*');
            elementos.forEach((el, index) => {
                el.style.animationDelay = `${0.1 * index}s`;
            });
        }, 100);
    }
    
    // Función para cerrar el panel
    function cerrarPanel() {
        panelDetalle.classList.remove('abierto');
        overlay.classList.remove('activo');
        
        // Restauramos el scroll
        document.body.style.overflow = '';
        
        // Limpiamos el contenido después de la animación
        setTimeout(() => {
            contenidoDetalle.innerHTML = '';
        }, 300);
    }
    
    // Event listeners para los botones de ver detalles
    proyectoCards.forEach(card => {
        const btnVerDetalles = card.querySelector('.btn-ver-detalles');
        const proyectoId = card.dataset.proyectoId;
        
        btnVerDetalles.addEventListener('click', () => {
            abrirPanel(proyectoId);
        });
    });
    
    // Event listener para cerrar el panel
    cerrarPanel.addEventListener('click', cerrarPanel);
    overlay.addEventListener('click', cerrarPanel);
    
    // Cerrar con tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && panelDetalle.classList.contains('abierto')) {
            cerrarPanel();
        }
    });
    
    // Añadir animación al cargar la página
    setTimeout(() => {
        proyectoCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.transitionDelay = `${0.1 * index}s`;
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);
        });
    }, 300);
    
    // Implementación de lazy loading para las imágenes
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    if (src) {
                        img.src = src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback para navegadores que no soportan IntersectionObserver
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.getAttribute('data-src');
            img.removeAttribute('data-src');
        });
    }
});