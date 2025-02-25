from django import forms
from apps.contacto.models import Mensaje

class MensajeForm(forms.ModelForm):
    class Meta:
        model = Mensaje
        fields = ['nombre', 'email', 'asunto', 'mensaje']
        widgets = {
            'mensaje': forms.Textarea(attrs={'rows': 5}),
        }
        labels = {
            'nombre': 'Nombre',
            'email': 'Correo Electrónico',
            'asunto': 'Asunto',
            'mensaje': 'Mensaje',
        }
