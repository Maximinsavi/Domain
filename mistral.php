'@vibewith_ayat'];

// 🔹 ইউজারের ইনপুট ধরার পালা! যদি কেউ text প্যারামিটার ছাড়া আসে, তাকে বকা দেওয়া হবে!
$text = isset($_GET['text']) ? trim($_GET['text']) : '';

if (empty($text)) {
    echo json_encode(array_merge($credit, ['error' => '❌ দোস্ত, text প্যারামিটারে কিছু একটা তো লেখো!']));
    exit;
}

// Mistral AI এর দরজা
$url = "https://mistral-ai.chat/wp-admin/admin-ajax.php";
$data = [
    'action'  => "ai_chat_response",
    'message' => $text,
    'nonce'   => "83103efe99" // এটা হলো গোপন চাবি!
];

// cURL: আমাদের বার্তা বাহক, যে Mistral AI এর কাছে আমাদের বার্তা নিয়ে যাবে
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'User-Agent: AzRBot/1.6',
    'Accept: application/json',
    'x-requested-with: XMLHttpRequest',
    'Content-Type: application/x-www-form-urlencoded'
]);

// বার্তা বাহক তার কাজ শুরু করলো...
$response = curl_exec($ch);
$error = curl_error($ch);
curl_close($ch); // কাজ শেষে বার্তা বাহককে ছুটি দেওয়া হলো

// যদি বার্তা বাহক কোনো ভুল করে বা রাস্তা হারিয়ে ফেলে
if ($response === false || !empty($error)) {
    echo json_encode(array_merge($credit, ['error' => '⚠️ হায় হায়! API রিকোয়েস্ট ফেইল করেছে: ' . $error]));
    exit;
}

// Mistral AI এর পাঠানো গুপ্ত বার্তা উদ্ধার
$apiResponse = json_decode($response, true);
$finalMessage = isset($apiResponse['data']['message']) ? trim($apiResponse['data']['message']) : 'AI আজকে ছুটিতে আছে, কোনো উত্তর দেয়নি!';

// ফাইনাল আউটপুট ইউজারের স্ক্রিনে দেখানো
echo json_encode(array_merge($credit, [
    'status' => '✅ মিশন সফল!',
    'message' => $finalMessage
]), JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
?>
