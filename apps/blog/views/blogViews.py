from django.views.generic import ListView, DetailView, CreateView
from apps.blog.models import Entrada
from apps.blog.forms.blogForms import EntradaForm
from django.urls import reverse_lazy

class EntradaListView(ListView):
    model = Entrada
    template_name = 'blog/listado.html'
    context_object_name = 'entradas'

class EntradaDetailView(DetailView):
    model = Entrada
    template_name = 'blog/detalle.html'
    context_object_name = 'entrada'

class EntradaCreateView(CreateView):
    model = Entrada
    form_class = EntradaForm
    template_name = 'blog/crear.html'
    success_url = reverse_lazy('blog:listado')
