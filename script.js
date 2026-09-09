document.addEventListener("DOMContentLoaded", () => {
  const captureBtn = document.getElementById("btn-capture-selfie");
  const cameraModal = document.getElementById("camera-modal");
  const closeModalBtn = document.getElementById("close-modal-btn");
  const video = document.getElementById("webcam-video");
  const takeSnapBtn = document.getElementById("btn-take-snap");
  const canvas = document.getElementById("snapshot-canvas");
  const selfiePreview = document.getElementById("selfie-preview");
  const selfieIcon = document.getElementById("selfie-icon");
  const selfieFileInput = document.getElementById("selfie-file-input");

  const docTypeSelect = document.getElementById("document-type");
  const fileInput = document.getElementById("id-file-input");
  const statusText = document.getElementById("upload-status-text");
  const dropZone = document.getElementById("drop-zone");
  const verifyBtn = document.getElementById("btn-verify-details");

  let capturedSelfieBlob = null;
  let selectedDocFile = null;
  let streamInstance = null;

  function displaySelfieInCircle(imageSrc) {
    selfiePreview.src = imageSrc;
    selfiePreview.style.display = "block";
    selfieIcon.style.display = "none";
  }

  captureBtn.addEventListener("click", async () => {
    try {
      streamInstance = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false
      });
      video.srcObject = streamInstance;
      cameraModal.style.display = "flex";
    } catch (err) {
      selfieFileInput.click();
    }
  });

  takeSnapBtn.addEventListener("click", () => {
    if (streamInstance) {
      canvas.width = video.videoWidth || 320;
      canvas.height = video.videoHeight || 240;
      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const dataUrl = canvas.toDataURL("image/jpeg");
      displaySelfieInCircle(dataUrl);

      canvas.toBlob((blob) => {
        capturedSelfieBlob = blob;
      }, "image/jpeg");

      stopCamera();
    }
  });

  function stopCamera() {
    if (streamInstance) {
      streamInstance.getTracks().forEach((track) => track.stop());
      streamInstance = null;
    }
    cameraModal.style.display = "none";
  }

  closeModalBtn.addEventListener("click", stopCamera);

  selfieFileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      capturedSelfieBlob = file; // Save file reference
      const reader = new FileReader();
      reader.onload = (event) => {
        displaySelfieInCircle(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  });

  function updateDocumentUI(file) {
    if (file) {
      selectedDocFile = file;
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      statusText.innerHTML = `Selected File: <strong style="color: #a5f3fc;">${file.name}</strong> (${fileSizeMB} MB)`;
    }
  }

  fileInput.addEventListener("change", (e) => {
    updateDocumentUI(e.target.files[0]);
  });

  ["dragenter", "dragover"].forEach((eventName) => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.style.borderColor = "#a5f3fc";
      dropZone.style.backgroundColor = "rgba(165, 243, 252, 0.05)";
    });
  });

  ["dragleave", "drop"].forEach((eventName) => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.style.borderColor = "#30363d";
      dropZone.style.backgroundColor = "rgba(255, 255, 255, 0.01)";
    });
  });

  dropZone.addEventListener("drop", (e) => {
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      fileInput.files = droppedFiles;
      updateDocumentUI(droppedFiles[0]);
    }
  });

  verifyBtn.addEventListener("click", async () => {
    const docType = docTypeSelect.value;

    if (!capturedSelfieBlob) {
      alert("Please upload or capture a selfie photo first.");
      return;
    }

    if (!selectedDocFile) {
      alert("Please select or drop an ID document file.");
      return;
    }

    const formData = new FormData();
    formData.append("documentType", docType);
    formData.append("selfieImage", capturedSelfieBlob, "selfie.jpg");
    formData.append("documentImage", selectedDocFile);

    verifyBtn.disabled = true;
    const originalBtnText = verifyBtn.innerHTML;
    verifyBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Verifying...`;

    try {
      const response = await fetch("https://your-api-domain.com/api/verify-id", {
        method: "POST",
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        alert("Verification submitted successfully!");
        console.log("Server Response:", result);
      } else {
        const errorData = await response.json();
        alert(`Verification failed: ${errorData.message || 'Server error'}`);
      }
    } catch (err) {
      console.error("Network Error:", err);
      alert("Form submitted! (Replace 'https://your-api-domain.com/api/verify-id' in script.js with your backend endpoint)");
    } finally {
      verifyBtn.disabled = false;
      verifyBtn.innerHTML = originalBtnText;
    }
  });
});