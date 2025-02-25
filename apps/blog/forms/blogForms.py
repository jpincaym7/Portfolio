from django import forms
from apps.blog.models import Entrada

class EntradaForm(forms.ModelForm):
    class Meta:
        model = Entrada
        fields = ['titulo', 'contenido', 'autor', 'imagen']
        widgets = {
            'contenido': forms.Textarea(attrs={'rows': 8}),
        }
        labels = {
            'titulo': 'Título de la Entrada',
            'contenido': 'Contenido',
            'imagen': 'Imagen de la Entrada',
        }
