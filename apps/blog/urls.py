from django.urls import path
from apps.blog.views.blogViews import EntradaListView, EntradaDetailView, EntradaCreateView

app_name = 'blog'

urlpatterns = [
    path('', EntradaListView.as_view(), name='listado'),
    path('nuevo/', EntradaCreateView.as_view(), name='crear'),
    path('<int:pk>/', EntradaDetailView.as_view(), name='detalle'),
]
