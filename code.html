<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Source Code Getter</title>
</head>
<body>
  <input type="text" id="url" placeholder="Entrer l'URL de la page" style="width:300px;">
  <button onclick="loadPage()">Charger</button>
  <button onclick="showSource()">Source Code</button>

  <iframe id="viewer" style="width:100%;height:300px;border:1px solid #ccc;"></iframe>

  <pre id="source" style="background:#111;color:#0f0;padding:10px;display:none;white-space:pre-wrap;"></pre>

  <script>
    function loadPage(){
      const url = document.getElementById('url').value;
      document.getElementById('viewer').src = url;
      document.getElementById('source').style.display = 'none';
    }

    async function showSource(){
      const url = document.getElementById('url').value;
      try {
        const res = await fetch(url);
        const text = await res.text();
        document.getElementById('source').textContent = text;
        document.getElementById('source').style.display = 'block';
      } catch(e){
        alert("Impossible de récupérer le code source (CORS).");
      }
    }
  </script>
</body>
</html>