from django.urls import path
from . import views

urlpatterns = [
    path('', views.dishes_list, name='dishes_list'),
    path('<int:dish_id>/', views.dish_detail, name='dish_detail'),
    path('create/', views.create_dish, name='create_dish'),
    path('<int:dish_id>/update/', views.update_dish, name='update_dish'),
    path('<int:dish_id>/delete/', views.delete_dish, name='delete_dish'),
    path('<int:dish_id>/upload-image/', views.upload_dish_image, name='upload_dish_image'),
]
