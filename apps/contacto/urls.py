from django.urls import path
from apps.contacto.views.contactViews import contact_form_view

app_name = 'contacto'

urlpatterns = [
    path('contact-form/', contact_form_view, name='contact_form'),
]
