from django.contrib import admin
from apps.proyectos.models import Categoria, Proyecto

@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ('id', 'nombre')
    search_fields = ('nombre',)

@admin.register(Proyecto)
class ProyectoAdmin(admin.ModelAdmin):
    list_display = ('id', 'titulo', 'categoria', 'fecha_creacion', 'url')
    list_filter = ('categoria', 'fecha_creacion')
    search_fields = ('titulo', 'descripcion')
    date_hierarchy = 'fecha_creacion'
