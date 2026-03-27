import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

def test_db(url, name):
    print(f"\n--- Testing {name} ---")
    try:
        conn = psycopg2.connect(url, sslmode='require', connect_timeout=5)
        print(f"✅ {name}: Connection successful")
        conn.close()
    except Exception as e:
        print(f"❌ {name}: Connection failed: {e}")

if __name__ == "__main__":
    # 1. Pooler (Current)
    pooler_url = os.getenv('DATABASE_URL')
    test_db(pooler_url, "Pooler (Port 6543)")
    
    # 2. Direct Connection Guess
    # Expected: postgresql://postgres.jrhpyjpengwpbcukdzop:Kolya1%40@db.jrhpyjpengwpbcukdzop.supabase.co:5432/postgres
    pass_part = "Kolya1%40"
    user_part = "postgres.jrhpyjpengwpbcukdzop"
    host_part = "db.jrhpyjpengwpbcukdzop.supabase.co"
    direct_url = f"postgresql://{user_part}:{pass_part}@{host_part}:5432/postgres"
    test_db(direct_url, "Direct Connection (Port 5432)")
