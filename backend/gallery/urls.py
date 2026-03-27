from django.urls import path
from . import views

urlpatterns = [
    path('', views.gallery_list, name='gallery_list'),
    path('<int:item_id>/', views.gallery_item_detail, name='gallery_item_detail'),
    path('create/', views.create_gallery_item, name='create_gallery_item'),
    path('upload-image/', views.upload_gallery_image, name='upload_gallery_image'),
    path('<int:item_id>/update/', views.update_gallery_item, name='update_gallery_item'),
    path('<int:item_id>/delete/', views.delete_gallery_item, name='delete_gallery_item'),
]
