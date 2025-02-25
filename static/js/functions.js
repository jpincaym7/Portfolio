document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll(".section-content");
    const navItems = document.querySelectorAll("nav ul li");
  
    // Función para ocultar todas las secciones y mostrar solo la seleccionada
    function showSection(sectionId) {
      sections.forEach(section => {
        if (section.id === sectionId) {
          section.classList.remove("hidden");
        } else {
          section.classList.add("hidden");
        }
      });
    }
  
    // Añade evento de clic a cada elemento de navegación
    navItems.forEach((item, index) => {
      item.addEventListener("click", () => {
        const sectionIds = ["about", "experience", "projects"];
        showSection(sectionIds[index]);
        
        // Actualiza la clase activa en el elemento de navegación
        navItems.forEach(nav => nav.classList.remove("text-teal-300", "font-semibold"));
        item.classList.add("text-teal-300", "font-semibold");
      });
    });
  });

 //FUNCION PARA ANIMACION DE EXPERIENCIAS 
 document.addEventListener('DOMContentLoaded', function() {
    const nodes = document.querySelectorAll('#experience .group');
    
    // Añade animación de entrada escalonada
    nodes.forEach((node, index) => {
      node.style.animationDelay = `${index * 100}ms`;
      node.classList.add('animate-fadeIn');
    });
  
   
  });