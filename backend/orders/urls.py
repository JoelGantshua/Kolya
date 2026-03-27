from django.urls import path
from . import views

urlpatterns = [
    path('', views.orders_list, name='orders_list'),
    path('<int:order_id>/', views.order_detail, name='order_detail'),
    path('create/', views.create_order, name='create_order'),
    path('<int:order_id>/update/', views.update_order, name='update_order'),
    path('<int:order_id>/delete/', views.delete_order, name='delete_order'),
]
