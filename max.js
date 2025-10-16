var form = document.getElementById("chat-form");
  var conversationEl = document.getElementById("conversation");
  var imageUrlInput = document.getElementById("image-url");
  var fileInput = document.getElementById("image-file");
  var fileDrop = document.getElementById("file-drop");
  var previewCard = document.getElementById("image-preview");
  var previewImage = document.getElementById("preview-image");
  var previewMeta = document.getElementById("preview-meta");
  var clearPreviewBtn = document.getElementById("clear-preview");
  var clearFormBtn = document.getElementById("clear-form");
  var sendBtn = form.querySelector("button.primary");

  function renderConversation(history) {
    conversationEl.innerHTML = "";
    if (!history) history = [];

    for (var i = 0; i < history.length; i++) {
      var entry = history[i];
      var wrapper = document.createElement("div");
      wrapper.className = "chat-entry " + entry.role;

      var roleLabel = document.createElement("strong");
      roleLabel.textContent = entry.role;
      wrapper.appendChild(roleLabel);

      for (var j = 0; j < entry.parts.length; j++) {
        var part = entry.parts[j];
        if (part.type === "text") {
          var p = document.createElement("p");
          p.textContent = part.text;
          wrapper.appendChild(p);
        } else if (part.type === "image") {
          var img = document.createElement("img");
          img.src = part.sourceUrl || "";
          img.alt = "Image";
          wrapper.appendChild(img);
        } else {
          var fb = document.createElement("p");
          fb.textContent = "[Unsupported content]";
          wrapper.appendChild(fb);
        }
      }

      conversationEl.appendChild(wrapper);
    }

    conversationEl.scrollTop = conversationEl.scrollHeight;
  }

  function clearPreview() {
    previewCard.hidden = true;
    previewImage.src = "";
    previewMeta.textContent = "";
    fileInput.value = "";
  }

  function showPreview(opts) {
    if (!opts || !opts.src) {
      clearPreview();
      return;
    }
    previewImage.src = opts.src;
    previewMeta.textContent = opts.label || "";
    previewCard.hidden = false;
  }

  function updatePreviewFromFile(file) {
    if (!file) {
      clearPreview();
      return;
    }
    var reader = new FileReader();
    reader.onload = function () {
      showPreview({
        src: reader.result,
        label: file.name + " • " + (file.size / 1024).toFixed(1) + " KB",
      });
    };
    reader.readAsDataURL(file);
  }

  function updatePreviewFromUrl(url) {
    if (!url) {
      if (!fileInput.files.length) clearPreview();
      return;
    }
    showPreview({ src: url, label: url });
  }

  fileInput.onchange = function () {
    var file = fileInput.files[0];
    updatePreviewFromFile(file);
  };

  imageUrlInput.oninput = function (e) {
    var value = e.target.value.trim();
    updatePreviewFromUrl(value);
  };

  clearPreviewBtn.onclick = function () {
    clearPreview();
    imageUrlInput.value = "";
  };

  clearFormBtn.onclick = function () {
    form.reset();
    clearPreview();
  };

  // === Fonction principale, lancée au clic ===
  sendBtn.onclick = function () {
    var uid = form.uid.value.trim();
    var ask = form.ask.value.trim();
    var imageUrl = imageUrlInput.value.trim();
    var imageFile = fileInput.files[0];

    if (!uid) {
      alert("User ID is required.");
      return;
    }

    var formData = new FormData();
    formData.set("uid", uid);
    formData.set("ask", ask);
    formData.set("include_history", "true");
    if (imageUrl) formData.set("image_url", imageUrl);
    if (imageFile && ask.toLowerCase() !== "clear") {
      formData.set("image_file", imageFile);
    }

    fetch("//gemini-web-api.onrender.com/gemini", {
      method: "POST",
      body: formData,
    })
      .then(function (res) {
        if (!res.ok) throw new Error("Server error: " + res.status);
        return res.json();
      })
      .then(function (payload) {
        var history = Array.isArray(payload.history) ? payload.history : [];

        renderConversation(history);

        if (!history.length && payload.response) {
          var notice = document.createElement("div");
          notice.className = "chat-entry " + (payload.author || "system");
          var head = document.createElement("strong");
          head.textContent = payload.author || "system";
          notice.appendChild(head);
          var para = document.createElement("p");
          para.textContent = payload.response;
          notice.appendChild(para);
          conversationEl.appendChild(notice);
        }

        conversationEl.scrollTop = conversationEl.scrollHeight;
        form.ask.value = "";
        if (ask.toLowerCase() === "clear") {
          clearPreview();
          imageUrlInput.value = "";
        }
      })
      .catch(function (err) {
        alert("Error: " + err.message);
      });
  };