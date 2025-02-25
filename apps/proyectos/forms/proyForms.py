from django import forms
from apps.proyectos.models import Proyecto

class ProyectoForm(forms.ModelForm):
    class Meta:
        model = Proyecto
        fields = ['titulo', 'descripcion', 'categoria', 'url', 'imagen']
        widgets = {
            'descripcion': forms.Textarea(attrs={'rows': 4}),
        }
        labels = {
            'titulo': 'Título del Proyecto',
            'descripcion': 'Descripción',
            'url': 'URL del Proyecto',
            'imagen': 'Imagen del Proyecto',
        }
