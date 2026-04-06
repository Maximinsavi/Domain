import aiohttp
from telegram import Update
from telegram.ext import ContextTypes


API_KEY = "AIzaSyDbLr0gx5ldIDqxXt9D0iUl77fGUI-QDEM"


API_URL = (
    "https://generativelanguage.googleapis.com/v1beta/models/"
    f"gemini-2.5-flash:generateContent?key={API_KEY}"
)

SYSTEM_RULE = (
    "Tu es Kyotaka, une IA dark, cool et sobre. "
    "Ne mentionne jamais un quelconque « messie Osango ». "
    "Si l’on te demande qui t’a créé, réponds : "
    "« Je suis Kyotaka, IA développée par ᏦᎽᎾᎿᎯᏦᎯ. » "
    "Réponds normalement à tout le reste."
)

async def ai_kyo(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    if context.args:
        user_msg = " ".join(context.args)
    elif update.message.reply_to_message and update.message.reply_to_message.text:
        user_msg = update.message.reply_to_message.text
    else:
        await update.message.reply_text(
            "Utilisation : /ai <question> (ou réponds à un message)."
        )
        return

    prompt = f"{SYSTEM_RULE}\n\nUtilisateur : {user_msg}"

    payload = {
        "contents": [
            {
                "parts": [{"text": prompt}]
            }
        ],
        "generationConfig": {"temperature": 0.7}
    }

    await update.message.chat.send_action("typing")

    try:
        async with aiohttp.ClientSession(timeout=aiohttp.ClientTimeout(total=15)) as session:
            async with session.post(API_URL, json=payload) as response:
                if response.status != 200:
                    await update.message.reply_text(f"❌ Erreur Gemini : {response.status}")
                    return
                data = await response.json()
    except Exception as e:
        await update.message.reply_text(f"❌ Erreur réseau : {e}")
        return

    try:
        answer = data["candidates"][0]["content"]["parts"][0]["text"]
    except (KeyError, IndexError):
        answer = "Je n’ai aucune réponse pour l’instant."

    answer = answer.replace("messie Osango", "[nom masqué]")

    await update.message.reply_text(
        answer, disable_web_page_preview=True, quote=True
    )