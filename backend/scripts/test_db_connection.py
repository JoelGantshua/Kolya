import os
import sys
import psycopg2
from urllib.parse import urlparse
from dotenv import load_dotenv

# Load .env from project root
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '..', '.env'))

def test_connection():
    db_url = os.getenv('DATABASE_URL')
    if not db_url:
        print("❌ Error: DATABASE_URL not found in environment.")
        return

    print(f"🔍 Testing connection to: {db_url.split('@')[-1]}")
    
    try:
        # Parse URL for manual connection if needed, but psycopg2 can handle the URL
        conn = psycopg2.connect(db_url, sslmode='require')
        cursor = conn.cursor()
        
        # 1. Check if we can execute a simple query
        cursor.execute("SELECT version();")
        version = cursor.fetchone()
        print(f"✅ Connection successful! DB Version: {version[0]}")
        
        # 2. Check for required tables
        tables_to_check = [
            'dishes_dish',
            'gallery_galleryitem',
            'authentication_user',
            'reservations_reservation',
            'orders_order'
        ]
        
        print("\n📋 Checking tables:")
        for table in tables_to_check:
            cursor.execute(f"SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = '{table}');")
            exists = cursor.fetchone()[0]
            status = "✅ Found" if exists else "❌ NOT FOUND"
            print(f"  - {table}: {status}")
            
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        print("\n💡 Suggestions:")
        print("  - Check if your IP is allowlisted in Supabase settings.")
        print("  - Verify that the password doesn't contain special characters that need encoding.")
        print("  - Ensure you are using the transaction pooler (port 6543) with sslmode=require.")

if __name__ == "__main__":
    test_connection()
