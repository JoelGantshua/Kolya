from django.urls import path
from . import views

urlpatterns = [
    path('', views.reservations_list, name='reservations_list'),
    path('create/', views.create_reservations, name='create_reservations'),
    path('<int:pk>/', views.reservations_detail, name='reservations_detail'),
    path('<int:pk>/update/', views.update_reservations, name='update_reservations'),
    path('<int:pk>/delete/', views.delete_reservations, name='delete_reservations'),
]
