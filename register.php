<?php
// Connexion à la base de données
$host = 'localhost';
$db = 'maxchat';
$user = 'root';
$pass = '';
$conn = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);

// Crée la table users si elle n'existe pas déjà
$conn->exec("CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)");

$message = "";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username']);
    $email    = trim($_POST['email']);
    $password = $_POST['password'];

    if ($username && $email && $password) {
        // Sécurise le mot de passe
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        $stmt = $conn->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
        try {
            $stmt->execute([$username, $email, $hashedPassword]);
            $message = "Inscription réussie. <a href='login.php'>Connecte-toi ici</a>.";
        } catch (PDOException $e) {
            $message = "Erreur : " . $e->getMessage();
        }
    } else {
        $message = "Tous les champs sont obligatoires.";
    }
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Inscription - MaxChat</title>
  <style>
    body {
      font-family: sans-serif;
      background: #f5f5f5;
      margin: 0;
      padding: 2em;
    }

    form {
      max-width: 400px;
      margin: auto;
      background: white;
      padding: 2em;
      border-radius: 8px;
      box-shadow: 0 0 10px #ccc;
    }

    input {
      width: 100%;
      padding: 1em;
      margin-bottom: 1em;
      border: 1px solid #ddd;
      border-radius: 5px;
    }

    button {
      width: 100%;
      padding: 1em;
      background: #28a745;
      color: white;
      border: none;
      border-radius: 5px;
      font-size: 1em;
    }

    .message {
      text-align: center;
      margin-top: 1em;
      color: #d00;
    }
  </style>
</head>
<body>

<h2 style="text-align:center;">Créer un compte</h2>

<form method="POST" action="">
  <input type="text" name="username" placeholder="Nom d'utilisateur" required>
  <input type="email" name="email" placeholder="Email" required>
  <input type="password" name="password" placeholder="Mot de passe" required>
  <button type="submit">S'inscrire</button>
</form>

<div class="message"><?= $message ?></div>

</body>
</html>