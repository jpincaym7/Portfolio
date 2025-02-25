from django.views.generic import ListView, DetailView, CreateView
from apps.proyectos.models import Proyecto
from apps.proyectos.forms.proyForms import ProyectoForm
from django.urls import reverse_lazy

class ProyectoListView(ListView):
    model = Proyecto
    template_name = 'proyectos/listado.html'
    context_object_name = 'proyectos'

class ProyectoDetailView(DetailView):
    model = Proyecto
    template_name = 'proyectos/detalle.html'
    context_object_name = 'proyecto'

class ProyectoCreateView(CreateView):
    model = Proyecto
    form_class = ProyectoForm
    template_name = 'proyectos/crear.html'
    success_url = reverse_lazy('proyectos:listado')
