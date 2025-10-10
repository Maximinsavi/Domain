<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST["username"] ?? '';
    $password = $_POST["password"] ?? '';

    // Connexion à la base de données (MySQL par exemple)
    $conn = new mysqli("localhost", "root", "", "maxchat");

    if ($conn->connect_error) {
        die("Connexion échouée : " . $conn->connect_error);
    }

    // Sécurisation des données
    $username = $conn->real_escape_string($username);
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // Insertion
    $sql = "INSERT INTO users (username, password) VALUES ('$username', '$hashedPassword')";
    
    if ($conn->query($sql) === TRUE) {
        echo "Inscription réussie !";
    } else {
        echo "Erreur : " . $conn->error;
    }

    $conn->close();
}
?>

<form method="POST" action="register.php">
  <input type="text" name="username" placeholder="Nom d'utilisateur" required>
  <input type="password" name="password" placeholder="Mot de passe" required>
  <button type="submit">S'inscrire</button>
</form>