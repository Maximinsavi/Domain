import requests
import time

# Identifiants
USERNAME = "Maximin"
PASSWORD = "64932261"

# URLs
LOGIN_URL = "http://maxgram.wapaxo.com/site_login.html"
POST_URL = "http://maxgram.wapaxo.com/page-creat-post.html"

# Créer une session pour garder la connexion
session = requests.Session()

def login():
    payload = {
        "user_name_": USERNAME,
        "password_": PASSWORD,
        "login_user": "Login"
    }
    r = session.post(LOGIN_URL, data=payload)
    print("Connexion:", r.status_code)

def publier():
    payload = {
        "text": "Salut",
        "blog_submit": "Post"
    }
    r = session.post(POST_URL, data=payload)
    print("Publication:", r.status_code)

# --- Script principal ---
login()

while True:
    try:
        publier()
    except Exception as e:
        print("⚠️ Erreur:", e)
        login()  # re-login si la session saute
    print("⏳ Attente 1h...")
    time.sleep(3600)  # attendre 1h