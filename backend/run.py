import os
from app import create_app

# The 'app' object here is what the production worker (Gunicorn) will look for
app = create_app()

# --- LOCAL ---
if __name__ == "__main__":
    # --- LOCAL DEVELOPMENT (with hot-reloading) ---
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)

# --- PRODUCTION ---
# To run this with workers on Render/Railway, use the following command 
# in your 'Start Command' or 'Procfile':
# gunicorn --workers 4 --bind 0.0.0.0:$PORT run:app