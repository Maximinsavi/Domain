const form = document.getElementById("chat-form");
const conversationEl = document.getElementById("conversation");
const imageUrlInput = document.getElementById("image-url");
const fileInput = document.getElementById("image-file");
const fileDrop = document.getElementById("file-drop");
const previewCard = document.getElementById("image-preview");
const previewImage = document.getElementById("preview-image");
const previewMeta = document.getElementById("preview-meta");
const clearPreviewBtn = document.getElementById("clear-preview");
const clearFormBtn = document.getElementById("clear-form");

const renderConversation = (history = []) => {
  conversationEl.innerHTML = "";

  history.forEach((entry) => {
    const wrapper = document.createElement("div");
    wrapper.className = `chat-entry ${entry.role}`;

    const roleLabel = document.createElement("strong");
    roleLabel.textContent = entry.role;
    wrapper.appendChild(roleLabel);

    entry.parts.forEach((part) => {
      if (part.type === "text") {
        const paragraph = document.createElement("p");
        paragraph.textContent = part.text;
        wrapper.appendChild(paragraph);
      } else if (part.type === "image") {
        const image = document.createElement("img");
        if (part.sourceUrl) {
          image.src = part.sourceUrl;
          image.alt = "User supplied image";
        } else {
          image.alt = "Image attachment";
        }
        wrapper.appendChild(image);
      } else {
        const fallback = document.createElement("p");
        fallback.textContent = "[Unsupported content]";
        wrapper.appendChild(fallback);
      }
    });

    conversationEl.appendChild(wrapper);
  });

  conversationEl.scrollTo({ top: conversationEl.scrollHeight, behavior: "smooth" });
};

const setLoading = (isLoading) => {
  const primaryButton = form.querySelector("button.primary");
  primaryButton.disabled = isLoading;
  primaryButton.textContent = isLoading ? "Sending…" : "Send to Gemini";
};

const clearPreview = () => {
  previewCard.hidden = true;
  previewImage.src = "";
  previewMeta.textContent = "";
  fileInput.value = "";
};

const showPreview = ({ src, label }) => {
  if (!src) {
    clearPreview();
    return;
  }

  previewImage.src = src;
  previewMeta.textContent = label ?? "";
  previewCard.hidden = false;
};

const updatePreviewFromFile = (file) => {
  if (!file) {
    clearPreview();
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    showPreview({
      src: reader.result,
      label: `${file.name} • ${(file.size / 1024).toFixed(1)} KB`,
    });
  };
  reader.readAsDataURL(file);
};

const updatePreviewFromUrl = (url) => {
  if (!url) {
    if (!fileInput.files.length) {
      clearPreview();
    }
    return;
  }

  showPreview({ src: url, label: url });
};

fileInput.addEventListener("change", () => {
  const [file] = fileInput.files;
  updatePreviewFromFile(file);
});

imageUrlInput.addEventListener("input", (event) => {
  const value = event.target.value.trim();
  updatePreviewFromUrl(value);
});

if (fileDrop) {
  ["dragenter", "dragover"].forEach((eventName) => {
    fileDrop.addEventListener(eventName, (event) => {
      event.preventDefault();
      fileDrop.classList.add("dragging");
    });
  });

  ["dragleave", "drop"].forEach((eventName) => {
    fileDrop.addEventListener(eventName, (event) => {
      event.preventDefault();
      fileDrop.classList.remove("dragging");
    });
  });

  fileDrop.addEventListener("drop", (event) => {
    const [file] = event.dataTransfer.files;
    if (file) {
      fileInput.files = event.dataTransfer.files;
      updatePreviewFromFile(file);
    }
  });
}

clearPreviewBtn.addEventListener("click", () => {
  clearPreview();
  imageUrlInput.value = "";
});

clearFormBtn.addEventListener("click", () => {
  form.reset();
  clearPreview();
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const uid = form.uid.value.trim();
  const ask = form.ask.value.trim();
  const imageUrl = imageUrlInput.value.trim();
  const imageFile = fileInput.files[0];

  if (!uid) {
    alert("User ID is required.");
    return;
  }

  const formData = new FormData();
  formData.set("uid", uid);
  formData.set("ask", ask);
  formData.set("include_history", "true");
  if (imageUrl) {
    formData.set("image_url", imageUrl);
  }
  if (imageFile && ask.toLowerCase() !== "clear") {
    formData.set("image_file", imageFile);
  }

  setLoading(true);

  try {
    const response = await fetch("//gemini-web-api.onrender.com/gemini", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(error.error || "Request failed.");
    }

    const payload = await response.json();
    const history = Array.isArray(payload.history) ? payload.history : [];

    renderConversation(history);

    if (!history.length && payload.response) {
      const notice = document.createElement("div");
      notice.className = `chat-entry ${payload.author ?? "system"}`;
      const heading = document.createElement("strong");
      heading.textContent = payload.author ?? "system";
      notice.appendChild(heading);
      const paragraph = document.createElement("p");
      paragraph.textContent = payload.response;
      notice.appendChild(paragraph);
      conversationEl.appendChild(notice);
    }

    form.ask.value = "";
    if (ask.toLowerCase() === "clear") {
      clearPreview();
      imageUrlInput.value = "";
    }
  } catch (error) {
    alert(error.message);
  } finally {
    setLoading(false);
  }
});
