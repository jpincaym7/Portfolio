from django.views.generic import TemplateView
from apps.proyectos.models import Proyecto
from apps.technology.models import Technology, TechnologyCategory  # Ajusta el import según tu estructura

class HomeView(TemplateView):
    template_name = 'home.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        # Obtiene todos los proyectos
        context['proyectos'] = Proyecto.objects.all()
        
        # Get all technology categories with optimized prefetching
        context['technology_categories'] = TechnologyCategory.objects.prefetch_related(
            'technologies__subtechnologies',
            'technologies__expertise',
        ).all()
        
        # Color mapping for expertise levels
        context['level_color_map'] = {
            'Beginner': 'blue-400',
            'Intermediate': 'teal-400',
            'Advanced': 'indigo-400',
            'Expert': 'purple-400'
        }
        
        # Get technologies separately if needed elsewhere
        context['technologies'] = Technology.objects.select_related(
            'category',
            'expertise'
        ).prefetch_related(
            'subtechnologies'
        ).all()
        
        # Add extra classes for styling
        context['extra_classes'] = 'technology-card'
        
        return context