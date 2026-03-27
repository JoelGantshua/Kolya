from rest_framework import serializers
from .models import Order

class OrderSerializer(serializers.ModelSerializer):
    # Mapping des champs frontend (camelCase) vers backend (snake_case)
    total = serializers.DecimalField(max_digits=10, decimal_places=2, source='total_amount', write_only=True)
    deliveryAddress = serializers.CharField(source='delivery_address', write_only=True, required=False, allow_blank=True, allow_null=True)
    specialRequests = serializers.CharField(source='delivery_notes', write_only=True, required=False, allow_blank=True, allow_null=True)
    
    # Champs optionnels car ils peuvent être remplis par la vue
    customer_name = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    customer_email = serializers.EmailField(required=False, allow_blank=True, allow_null=True)
    customer_phone = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    
    # Champ calculé pour le nom du client (pour l'affichage admin)
    customer = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            'id', 'user', 'customer', 'customer_name', 'customer_email', 'customer_phone',
            'items', 'total_amount', 'total', 'status', 'delivery_address', 
            'deliveryAddress', 'delivery_notes', 'specialRequests',
            'created_at', 'updated_at'
        ]
        # Ne PAS mettre total_amount, delivery_address ou delivery_notes ici 
        # car ils sont la source de champs write_only
        read_only_fields = ['id', 'user', 'customer', 'created_at', 'updated_at']
        extra_kwargs = {
            'total_amount': {'required': False},
            'delivery_address': {'required': False},
            'delivery_notes': {'required': False},
            'customer_name': {'required': False},
            'customer_email': {'required': False},
        }

    def get_customer(self, obj):
        if obj.user:
            if obj.user.first_name or obj.user.last_name:
                return f"{obj.user.first_name} {obj.user.last_name}".strip()
            return obj.user.username
        return obj.customer_name or obj.customer_email or "Client anonyme"
