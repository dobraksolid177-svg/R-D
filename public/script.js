const urlInput = document.getElementById("url");
const checkButton = document.getElementById("check");
const downloadButton = document.getElementById("download");
const clearButton = document.getElementById("clear");

const loading = document.getElementById("loading");
const result = document.getElementById("result");
const errorBox = document.getElementById("error");

const errorText = document.getElementById("errorText");
const filename = document.getElementById("filename");
const details = document.getElementById("details");

let currentFile = null;

function showError(message) {
  errorText.textContent = message;
  errorBox.classList.remove("hidden");
}

function hideError() {
  errorBox.classList.add("hidden");
}

function formatBytes(bytes) {
  if (!bytes || Number.isNaN(Number(bytes))) {
    return "Ukuran tidak diketahui";
  }

  const units = ["B", "KB", "MB", "GB"];

  let size = Number(bytes);
  let index = 0;

  while (
    size >= 1024 &&
    index < units.length - 1
  ) {
    size /= 1024;
    index++;
  }

  return `${size.toFixed(2)} ${units[index]}`;
}

function resetResult() {
  currentFile = null;

  result.classList.add("hidden");

  downloadButton.disabled = true;
}

clearButton.addEventListener("click", () => {
  urlInput.value = "";

  resetResult();
  hideError();

  urlInput.focus();
});

checkButton.addEventListener("click", async () => {
  const url = urlInput.value.trim();

  if (!url) {
    showError("Masukkan URL media terlebih dahulu.");
    return;
  }

  let parsedURL;

  try {
    parsedURL = new URL(url);

    if (
      parsedURL.protocol !== "http:" &&
      parsedURL.protocol !== "https:"
    ) {
      throw new Error("URL harus menggunakan HTTP atau HTTPS.");
    }
  } catch {
    showError("URL yang kamu masukkan tidak valid.");
    return;
  }

  resetResult();
  hideError();

  loading.classList.remove("hidden");
  checkButton.disabled = true;

  try {
    const response = await fetch(
      `/api/info?url=${encodeURIComponent(url)}`,
      {
        method: "GET",
        headers: {
          "Accept": "application/json"
        }
      }
    );

    /*
     * Jangan langsung response.json().
     * Kita baca sebagai text dulu supaya kalau
     * Vercel mengirim "File not found!" kita
     * bisa menampilkan error yang normal.
     */
    const raw = await response.text();

    let data;

    try {
      data = JSON.parse(raw);
    } catch {
      console.error("Response API:", raw);

      throw new Error(
        response.status === 404
          ? "API tidak ditemukan. Periksa konfigurasi Vercel."
          : "Server mengirim response yang tidak valid."
      );
    }

    if (!response.ok || !data.success) {
      throw new Error(
        data.message ||
        `Request gagal (HTTP ${response.status}).`
      );
    }

    currentFile = {
      url,
      filename: data.filename || "media-download"
    };

    filename.textContent =
      currentFile.filename;

    details.textContent =
      `${data.contentType || "Media"} • ${formatBytes(data.size)}`;

    result.classList.remove("hidden");

    downloadButton.disabled = false;

  } catch (error) {
    console.error(error);

    showError(
      error.message ||
      "Tidak dapat memeriksa media."
    );

  } finally {
    loading.classList.add("hidden");
    checkButton.disabled = false;
  }
});

downloadButton.addEventListener("click", () => {
  if (!currentFile) {
    return;
  }

  const downloadURL =
    `/api/download?url=${encodeURIComponent(
      currentFile.url
    )}&filename=${encodeURIComponent(
      currentFile.filename
    )}`;

  window.location.href = downloadURL;
});

urlInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    checkButton.click();
  }
});