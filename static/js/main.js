const dropzone = document.getElementById("dropzone");
const fileInput = document.getElementById("file-input");
const fileInfo = document.getElementById("file-info");
const fileName = document.getElementById("file-name");
const clearBtn = document.getElementById("clear-btn");
const summarizeBtn = document.getElementById("summarize-btn");
const alertBox = document.getElementById("alert");
const loading = document.getElementById("loading");
const results = document.getElementById("results");
const originalContent = document.getElementById("original-content");
const summaryContent = document.getElementById("summary-content");
const resultFilename = document.getElementById("result-filename");

let selectedFile = null;

function showAlert(message) {
  alertBox.textContent = message;
  alertBox.classList.remove("hidden");
}

function hideAlert() {
  alertBox.classList.add("hidden");
}

function setFile(file) {
  if (!file) return;

  if (!file.name.toLowerCase().endsWith(".txt")) {
    showAlert("Only .txt files are supported.");
    return;
  }

  selectedFile = file;
  fileName.textContent = file.name;
  fileInfo.classList.remove("hidden");
  summarizeBtn.disabled = false;
  hideAlert();
  results.classList.add("hidden");
}

function clearFile() {
  selectedFile = null;
  fileInput.value = "";
  fileInfo.classList.add("hidden");
  summarizeBtn.disabled = true;
  results.classList.add("hidden");
  hideAlert();
}

dropzone.addEventListener("click", () => fileInput.click());

dropzone.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    fileInput.click();
  }
});

fileInput.addEventListener("change", () => {
  if (fileInput.files.length) setFile(fileInput.files[0]);
});

dropzone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropzone.classList.add("dropzone--active");
});

dropzone.addEventListener("dragleave", () => {
  dropzone.classList.remove("dropzone--active");
});

dropzone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropzone.classList.remove("dropzone--active");
  if (e.dataTransfer.files.length) setFile(e.dataTransfer.files[0]);
});

clearBtn.addEventListener("click", clearFile);

summarizeBtn.addEventListener("click", async () => {
  if (!selectedFile) return;

  hideAlert();
  results.classList.add("hidden");
  loading.classList.remove("hidden");
  summarizeBtn.disabled = true;

  const formData = new FormData();
  formData.append("file", selectedFile);

  try {
    const response = await fetch("/summarize", { method: "POST", body: formData });
    const data = await response.json();

    if (!response.ok) {
      showAlert(data.error || "Something went wrong.");
      return;
    }

    originalContent.textContent = data.original;
    summaryContent.textContent = data.summary;
    resultFilename.textContent = data.filename;
    results.classList.remove("hidden");
  } catch {
    showAlert("Network error. Please try again.");
  } finally {
    loading.classList.add("hidden");
    summarizeBtn.disabled = false;
  }
});
