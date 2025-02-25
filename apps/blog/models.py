from django.db import models
from django.contrib.auth.models import User

class Entrada(models.Model):
    titulo = models.CharField(max_length=200)
    contenido = models.TextField()
    autor = models.ForeignKey(User, on_delete=models.CASCADE)
    fecha_publicacion = models.DateTimeField(auto_now_add=True)
    imagen = models.ImageField(upload_to='blog/', blank=True, null=True)

    def __str__(self):
        return self.titulo

class Comentario(models.Model):
    entrada = models.ForeignKey(Entrada, related_name='comentarios', on_delete=models.CASCADE)
    nombre = models.CharField(max_length=100)
    email = models.EmailField()
    contenido = models.TextField()
    fecha_publicacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Comentario de {self.nombre} en {self.entrada.titulo}'
