from django.urls import path
from . import views

urlpatterns = [
    path('', views.contact_messages_list, name='contact_messages_list'),
    path('create/', views.create_contact_message, name='create_contact_message'),
    path('<int:pk>/read/', views.mark_read, name='mark_read'),
    path('<int:pk>/replied/', views.mark_replied, name='mark_replied'),
    path('<int:pk>/archive/', views.mark_archived, name='mark_archived'),
    path('<int:pk>/delete/', views.delete_message, name='delete_message'),
    path('bulk/read/', views.bulk_mark_read, name='bulk_mark_read'),
]
