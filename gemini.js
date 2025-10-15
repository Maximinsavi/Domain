import express from "express";
import multer from "multer";

const app = express();
const upload = multer(); // pour gérer le form-data

app.use(express.static("public")); // ton dossier contenant bots.html et app.js

app.post("/gemini", upload.single("image_file"), async (req, res) => {
  try {
    const { uid, ask } = req.body;

    // Exemple : si l'utilisateur tape "clear"
    if (ask && ask.toLowerCase() === "clear") {
      return res.json({
        author: "system",
        response: "Historique effacé avec succès.",
      });
    }

    // Réponse simple simulée
    const responseText = `Salut ${uid || "inconnu"} ! Comment puis-je t'aider aujourd'hui ?`;

    res.json({
      author: uid || "syntaxt0x1c",
      response: responseText,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`)
);