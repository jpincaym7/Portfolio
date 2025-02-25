from django.urls import path
from apps.proyectos.views.proyViews import ProyectoListView, ProyectoDetailView, ProyectoCreateView
from apps.proyectos.views.home.homeview import  HomeView

app_name = 'proyectos'

urlpatterns = [
    path('', HomeView.as_view(), name='home'),
    path('nuevo/', ProyectoCreateView.as_view(), name='crear'),
    path('<int:pk>/', ProyectoDetailView.as_view(), name='detalle'),
    
]
