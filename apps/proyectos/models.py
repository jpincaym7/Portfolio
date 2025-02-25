from django.db import models

class Categoria(models.Model):
    nombre = models.CharField(max_length=100)

    def __str__(self):
        return self.nombre

class Proyecto(models.Model):
    titulo = models.CharField(max_length=200)
    descripcion = models.TextField()
    fecha_creacion = models.DateField(auto_now_add=True)
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE)
    url = models.URLField(blank=True, null=True)
    imagen = models.ImageField(upload_to='proyectos/', blank=True, null=True)

    def __str__(self):
        return self.titulo
