<?php
// Connexion à la base de données
$host = 'localhost';
$db = 'maxchat';
$user = 'root';
$pass = '';
$conn = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);

session_start();
$message = "";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email']);
    $password = $_POST['password'];

    $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password'])) {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        header('Location: home.php');
        exit();
    } else {
        $message = "Email ou mot de passe incorrect.";
    }
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Connexion - MaxChat</title>
  <style>
    body {
      font-family: sans-serif;
      background: #f0f0f0;
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
      background: #007bff;
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

<h2 style="text-align:center;">Connexion</h2>

<form method="POST" action="">
  <input type="email" name="email" placeholder="Email" required>
  <input type="password" name="password" placeholder="Mot de passe" required>
  <button type="submit">Se connecter</button>
</form>

<div class="message"><?= $message ?></div>

</body>
</html>