<?php
// fichier : like.php
header('Content-Type: application/json');

// fichier pour stocker les likes
$filename = 'likes.txt';

// récupérer les paramètres
$post = isset($_GET['post']) ? $_GET['post'] : 'post_1';
$user = isset($_GET['user']) ? $_GET['user'] : 'unknown';
$action = isset($_GET['action']) ? $_GET['action'] : 'get';

// lire les données
if(file_exists($filename)){
    $data = json_decode(file_get_contents($filename), true);
} else {
    $data = [];
}

// initialiser compteur et utilisateurs
if(!isset($data[$post])) $data[$post] = ['count'=>0, 'users'=>[]];

// action
if($action == 'like'){
    if(!in_array($user, $data[$post]['users'])){
        $data[$post]['count'] += 1;
        $data[$post]['users'][] = $user;
    }
} elseif($action == 'unlike'){
    $key = array_search($user, $data[$post]['users']);
    if($key !== false){
        $data[$post]['count'] -= 1;
        if($data[$post]['count'] < 0) $data[$post]['count'] = 0;
        unset($data[$post]['users'][$key]);
        $data[$post]['users'] = array_values($data[$post]['users']);
    }
}

// sauvegarder
file_put_contents($filename, json_encode($data));

// retourner le résultat
echo json_encode([
    'count' => $data[$post]['count'],
    'liked' => in_array($user, $data[$post]['users'])
]);
?>