<?php
header('Content-Type: application/json; charset=utf-8');

// Auteur / Crédit
$credit = ['author' => 'Maximin'];

// Récupération du texte (GET) ou valeur par défaut
$text = isset($_GET['text']) && trim($_GET['text']) !== '' ? trim($_GET['text']) : 'hello';

// URL et données à envoyer
$url = "https://mistral-ai.chat/wp-admin/admin-ajax.php";
$data = [
    'action'  => "ai_chat_response",
    'message' => $text,
    'nonce'   => "83103efe99" // ⚠️ doit être valide
];

// Prépare la requête cURL
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

// Exécute la requête
$response = curl_exec($ch);
$error = curl_error($ch);
curl_close($ch);

// Vérifie les erreurs
if ($response === false || $error) {
    echo json_encode(array_merge($credit, [
        'error' => "⚠️ Erreur cURL : $error"
    ]));
    exit;
}

// Décode la réponse JSON
$apiResponse = json_decode($response, true);

// Vérifie si JSON valide
if ($apiResponse === null) {
    echo json_encode(array_merge($credit, [
        'error' => "⚠️ Réponse invalide",
        'raw_response' => $response
    ]), JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

// Récupère le message
$finalMessage = $apiResponse['data']['message'] ?? '⚠️ Pas de message retourné';

// Affiche le résultat final
echo json_encode(array_merge($credit, [
    'status'  => '✅ OK',
    'text_envoye' => $text,
    'message' => $finalMessage
]), JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);