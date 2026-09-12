// document.addEventListener("DOMContentLoaded", () => {

//   // ============================================================
//   // ELEMENTS
//   // ============================================================

//   const captureBtn = document.getElementById("btn-capture-selfie");
//   const cameraModal = document.getElementById("camera-modal");
//   const closeModalBtn = document.getElementById("close-modal-btn");
//   const video = document.getElementById("webcam-video");
//   const takeSnapBtn = document.getElementById("btn-take-snap");
//   const canvas = document.getElementById("snapshot-canvas");

//   const selfiePreview = document.getElementById("selfie-preview");
//   const selfieIcon = document.getElementById("selfie-icon");
//   const selfieFileInput = document.getElementById("selfie-file-input");

//   const docTypeSelect = document.getElementById("document-type");
//   const fileInput = document.getElementById("id-file-input");
//   const statusText = document.getElementById("upload-status-text");
//   const dropZone = document.getElementById("drop-zone");

//   const verifyBtn = document.getElementById("btn-verify-details");


//   // ============================================================
//   // VARIABLES
//   // ============================================================

//   let capturedSelfieBlob = null;
//   let selectedDocFile = null;
//   let streamInstance = null;


//   // ============================================================
//   // SHOW SELFIE PREVIEW
//   // ============================================================

//   function displaySelfieInCircle(imageSrc) {

//     selfiePreview.src = imageSrc;

//     selfiePreview.style.display = "block";

//     selfieIcon.style.display = "none";
//   }


//   // ============================================================
//   // CAMERA
//   // ============================================================

//   captureBtn.addEventListener("click", async () => {

//     try {

//       streamInstance =
//         await navigator.mediaDevices.getUserMedia({
//           video: {
//             facingMode: "user"
//           },
//           audio: false
//         });

//       video.srcObject = streamInstance;

//       cameraModal.style.display = "flex";

//     } catch (error) {

//       console.error("Camera error:", error);

//       alert(
//         "Camera access failed. Please upload a selfie image instead."
//       );

//       selfieFileInput.click();
//     }

//   });


//   // ============================================================
//   // TAKE SELFIE
//   // ============================================================

//   takeSnapBtn.addEventListener("click", () => {

//     if (!streamInstance) {
//       return;
//     }


//     canvas.width =
//       video.videoWidth || 640;

//     canvas.height =
//       video.videoHeight || 480;


//     const context =
//       canvas.getContext("2d");


//     context.drawImage(
//       video,
//       0,
//       0,
//       canvas.width,
//       canvas.height
//     );


//     // Preview
//     const dataUrl =
//       canvas.toDataURL("image/jpeg");


//     displaySelfieInCircle(dataUrl);


//     // Convert canvas to file/blob
//     canvas.toBlob(
//       (blob) => {

//         capturedSelfieBlob = blob;

//       },
//       "image/jpeg",
//       0.95
//     );


//     stopCamera();

//   });


//   // ============================================================
//   // STOP CAMERA
//   // ============================================================

//   function stopCamera() {

//     if (streamInstance) {

//       streamInstance
//         .getTracks()
//         .forEach((track) => track.stop());

//       streamInstance = null;
//     }

//     cameraModal.style.display = "none";
//   }


//   // ============================================================
//   // CLOSE CAMERA
//   // ============================================================

//   closeModalBtn.addEventListener(
//     "click",
//     stopCamera
//   );


//   // ============================================================
//   // SELFIE FILE UPLOAD
//   // ============================================================

//   selfieFileInput.addEventListener(
//     "change",
//     (event) => {

//       const file =
//         event.target.files[0];


//       if (!file) {
//         return;
//       }


//       // Check image
//       if (!file.type.startsWith("image/")) {

//         alert(
//           "Please select a valid image for the selfie."
//         );

//         return;
//       }


//       // 5 MB limit
//       if (file.size > 5 * 1024 * 1024) {

//         alert(
//           "Selfie image must be smaller than 5 MB."
//         );

//         return;
//       }


//       capturedSelfieBlob = file;


//       const reader =
//         new FileReader();


//       reader.onload = (e) => {

//         displaySelfieInCircle(
//           e.target.result
//         );

//       };


//       reader.readAsDataURL(file);

//     }
//   );


//   // ============================================================
//   // DOCUMENT UI
//   // ============================================================

//   function updateDocumentUI(file) {

//     if (!file) {
//       return;
//     }


//     selectedDocFile = file;


//     const fileSizeMB =
//       file.size / (1024 * 1024);


//     statusText.innerHTML =
//       `Selected File: <strong style="color:#a5f3fc;">
//         ${file.name}
//       </strong> (${fileSizeMB.toFixed(2)} MB)`;


//     console.log(
//       "Selected document:",
//       file.name
//     );

//   }


//   // ============================================================
//   // DOCUMENT FILE INPUT
//   // ============================================================

//   fileInput.addEventListener(
//     "change",
//     (event) => {

//       const file =
//         event.target.files[0];

//       updateDocumentUI(file);

//     }
//   );


//   // ============================================================
//   // DRAG ENTER / DRAG OVER
//   // ============================================================

//   ["dragenter", "dragover"].forEach(
//     (eventName) => {

//       dropZone.addEventListener(
//         eventName,
//         (event) => {

//           event.preventDefault();
//           event.stopPropagation();

//           dropZone.style.borderColor =
//             "#a5f3fc";

//           dropZone.style.backgroundColor =
//             "rgba(165, 243, 252, 0.05)";

//         }
//       );

//     }
//   );


//   // ============================================================
//   // DRAG LEAVE / DROP
//   // ============================================================

//   ["dragleave", "drop"].forEach(
//     (eventName) => {

//       dropZone.addEventListener(
//         eventName,
//         (event) => {

//           event.preventDefault();
//           event.stopPropagation();

//           dropZone.style.borderColor =
//             "#30363d";

//           dropZone.style.backgroundColor =
//             "rgba(255, 255, 255, 0.01)";

//         }
//       );

//     }
//   );


//   // ============================================================
//   // DROP DOCUMENT
//   // ============================================================

//   dropZone.addEventListener(
//     "drop",
//     (event) => {

//       const droppedFiles =
//         event.dataTransfer.files;


//       if (droppedFiles.length === 0) {
//         return;
//       }


//       const file =
//         droppedFiles[0];


//       updateDocumentUI(file);

//     }
//   );


//   // ============================================================
//   // VERIFY BUTTON
//   // ============================================================

//   verifyBtn.addEventListener(
//     "click",
//     async () => {

//       // --------------------------------------------------------
//       // CHECK SELFIE
//       // --------------------------------------------------------

//       if (!capturedSelfieBlob) {

//         alert(
//           "Please upload or capture a selfie photo first."
//         );

//         return;
//       }


//       // --------------------------------------------------------
//       // CHECK DOCUMENT
//       // --------------------------------------------------------

//       if (!selectedDocFile) {

//         alert(
//           "Please select or drop a document file."
//         );

//         return;
//       }


//       // --------------------------------------------------------
//       // DOCUMENT TYPE
//       // --------------------------------------------------------

//       const docType =
//         docTypeSelect.value;


//       console.log(
//         "Document type:",
//         docType
//       );

//       console.log(
//         "Document:",
//         selectedDocFile.name
//       );

//       console.log(
//         "Selfie:",
//         capturedSelfieBlob.name ||
//         "captured_selfie.jpg"
//       );


//       // ========================================================
//       // CREATE FORM DATA
//       // ========================================================

//       const formData =
//         new FormData();


//       // IMPORTANT:
//       // These names MUST match FastAPI:
//       //
//       // document: UploadFile
//       // selfie: UploadFile
//       //

//       formData.append(
//         "document",
//         selectedDocFile
//       );


//       // Captured camera image does not have a filename
//       // so give it one.

//       if (
//         capturedSelfieBlob instanceof File
//       ) {

//         formData.append(
//           "selfie",
//           capturedSelfieBlob
//         );

//       } else {

//         formData.append(
//           "selfie",
//           capturedSelfieBlob,
//           "selfie.jpg"
//         );

//       }


//       // ========================================================
//       // BUTTON LOADING
//       // ========================================================

//       verifyBtn.disabled = true;

//       const originalButtonText =
//         verifyBtn.innerHTML;


//       verifyBtn.innerHTML =
//         `<i class="fa-solid fa-spinner fa-spin"></i>
//          Verifying...`;


//       // ========================================================
//       // SEND TO FASTAPI
//       // ========================================================

//       try {

//         console.log(
//           "Sending verification request..."
//         );


//         const response =
//           await fetch(
//             "http://127.0.0.1:8000/api/verify",
//             {
//               method: "POST",

//               body: formData
//             }
//           );


//         console.log(
//           "Backend status:",
//           response.status
//         );


//         // ======================================================
//         // READ RESPONSE
//         // ======================================================

//         const result =
//           await response.json();


//         console.log(
//           "REAL VERIFICATION RESULT:",
//           result
//         );


//         // ======================================================
//         // BACKEND ERROR
//         // ======================================================

//         if (!response.ok) {

//           console.error(
//             "Backend error:",
//             result
//           );


//           alert(
//             "Verification failed: " +
//             (
//               result.detail ||
//               "Backend error"
//             )
//           );


//           return;
//         }


//         // ======================================================
//         // SUCCESS
//         // ======================================================

//         if (result.success) {

//           console.log(
//             "Verification completed successfully."
//           );


//           // Store REAL result temporarily
//           // so Officer Dashboard can later retrieve it.

//           sessionStorage.setItem(
//             "verificationResult",
//             JSON.stringify(result)
//           );


//           // Show short success message

//           alert(
//             "Document verification completed successfully!"
//           );


//           // ====================================================
//           // SHOW RESULT IN CONSOLE
//           // ====================================================

//           console.log(
//             "========================================"
//           );

//           console.log(
//             "VERIFICATION RESULT"
//           );

//           console.log(
//             "========================================"
//           );


//           console.log(
//             "Identity:",
//             result.identity
//           );


//           console.log(
//             "Checks:",
//             result.checks
//           );


//           console.log(
//             "Risk:",
//             result.risk
//           );


//           console.log(
//             "Report:",
//             result.report
//           );


//         } else {

//           alert(
//             "Verification failed."
//           );

//         }

//       } catch (error) {

//         console.error(
//           "NETWORK ERROR:",
//           error
//         );


//         alert(
//           "Cannot connect to the verification server.\n\n" +
//           "Make sure FastAPI is running on:\n" +
//           "http://127.0.0.1:8000"
//         );

//       } finally {

//         // ======================================================
//         // RESTORE BUTTON
//         // ======================================================

//         verifyBtn.disabled = false;

//         verifyBtn.innerHTML =
//           originalButtonText;

//       }

//     }
//   );

// });






























































// document.addEventListener("DOMContentLoaded", () => {

//     // ============================================================
//     // ELEMENTS
//     // ============================================================

//     const captureBtn = document.getElementById("btn-capture-selfie");
//     const cameraModal = document.getElementById("camera-modal");
//     const closeModalBtn = document.getElementById("close-modal-btn");
//     const video = document.getElementById("webcam-video");
//     const takeSnapBtn = document.getElementById("btn-take-snap");
//     const canvas = document.getElementById("snapshot-canvas");

//     const selfiePreview = document.getElementById("selfie-preview");
//     const selfieIcon = document.getElementById("selfie-icon");
//     const selfieFileInput = document.getElementById("selfie-file-input");

//     const docTypeSelect = document.getElementById("document-type");
//     const fileInput = document.getElementById("id-file-input");
//     const statusText = document.getElementById("upload-status-text");
//     const dropZone = document.getElementById("drop-zone");

//     const verifyBtn = document.getElementById("btn-verify-details");


//     // ============================================================
//     // VARIABLES
//     // ============================================================

//     let capturedSelfieBlob = null;
//     let selectedDocFile = null;
//     let streamInstance = null;


//     // ============================================================
//     // BACKEND
//     // ============================================================

//     const API_URL = "http://127.0.0.1:8000/api/verify";


//     // ============================================================
//     // INITIALIZATION
//     // ============================================================

//     console.log("========================================");
//     console.log("ID VERIFY — DASHBOARD 2");
//     console.log("FRONTEND INITIALIZED");
//     console.log("========================================");

//     console.log("Capture button:", captureBtn);
//     console.log("Selfie input:", selfieFileInput);
//     console.log("Document input:", fileInput);
//     console.log("Verify button:", verifyBtn);
//     console.log("Backend:", API_URL);


//     if (!verifyBtn || !fileInput || !selfieFileInput) {

//         console.error(
//             "Required HTML elements are missing."
//         );

//         return;
//     }


//     // ============================================================
//     // SHOW SELFIE PREVIEW
//     // ============================================================

//     function displaySelfieInCircle(imageSrc) {

//         if (!selfiePreview) {
//             return;
//         }

//         selfiePreview.src = imageSrc;
//         selfiePreview.style.display = "block";

//         if (selfieIcon) {
//             selfieIcon.style.display = "none";
//         }
//     }


//     // ============================================================
//     // CAMERA
//     // ============================================================

//     if (captureBtn) {

//         captureBtn.addEventListener("click", async () => {

//             try {

//                 if (
//                     !navigator.mediaDevices ||
//                     !navigator.mediaDevices.getUserMedia
//                 ) {

//                     throw new Error(
//                         "Camera API is not supported."
//                     );
//                 }


//                 streamInstance =
//                     await navigator.mediaDevices.getUserMedia({
//                         video: {
//                             facingMode: "user"
//                         },
//                         audio: false
//                     });


//                 if (video) {
//                     video.srcObject = streamInstance;
//                 }


//                 if (cameraModal) {
//                     cameraModal.style.display = "flex";
//                 }


//             } catch (error) {

//                 console.error(
//                     "Camera error:",
//                     error
//                 );


//                 alert(
//                     "Camera access failed.\n\n" +
//                     "Please upload a selfie image instead."
//                 );


//                 if (selfieFileInput) {
//                     selfieFileInput.click();
//                 }

//             }

//         });

//     }


//     // ============================================================
//     // TAKE SELFIE
//     // ============================================================

//     if (takeSnapBtn) {

//         takeSnapBtn.addEventListener("click", () => {

//             if (!streamInstance) {

//                 alert(
//                     "Camera is not active."
//                 );

//                 return;
//             }


//             const width =
//                 video.videoWidth || 640;

//             const height =
//                 video.videoHeight || 480;


//             canvas.width = width;
//             canvas.height = height;


//             const context =
//                 canvas.getContext("2d");


//             if (!context) {

//                 alert(
//                     "Unable to capture image."
//                 );

//                 return;
//             }


//             context.drawImage(
//                 video,
//                 0,
//                 0,
//                 width,
//                 height
//             );


//             // ----------------------------------------------------
//             // PREVIEW
//             // ----------------------------------------------------

//             const dataUrl =
//                 canvas.toDataURL(
//                     "image/jpeg",
//                     0.95
//                 );


//             displaySelfieInCircle(
//                 dataUrl
//             );


//             // ----------------------------------------------------
//             // CREATE BLOB
//             // ----------------------------------------------------

//             canvas.toBlob(
//                 (blob) => {

//                     if (!blob) {

//                         alert(
//                             "Failed to capture selfie."
//                         );

//                         return;
//                     }


//                     capturedSelfieBlob = blob;


//                     console.log(
//                         "Selfie captured successfully:",
//                         blob.size,
//                         "bytes"
//                     );

//                 },
//                 "image/jpeg",
//                 0.95
//             );


//             stopCamera();

//         });

//     }


//     // ============================================================
//     // STOP CAMERA
//     // ============================================================

//     function stopCamera() {

//         if (streamInstance) {

//             streamInstance
//                 .getTracks()
//                 .forEach((track) => {
//                     track.stop();
//                 });

//             streamInstance = null;
//         }


//         if (video) {
//             video.srcObject = null;
//         }


//         if (cameraModal) {
//             cameraModal.style.display = "none";
//         }

//     }


//     // ============================================================
//     // CLOSE CAMERA
//     // ============================================================

//     if (closeModalBtn) {

//         closeModalBtn.addEventListener(
//             "click",
//             stopCamera
//         );

//     }


//     // ============================================================
//     // SELFIE FILE UPLOAD
//     // ============================================================

//     selfieFileInput.addEventListener(
//         "change",
//         (event) => {

//             const file =
//                 event.target.files[0];


//             if (!file) {
//                 return;
//             }


//             // ----------------------------------------------------
//             // TYPE
//             // ----------------------------------------------------

//             if (!file.type.startsWith("image/")) {

//                 alert(
//                     "Please select a valid image for the selfie."
//                 );

//                 selfieFileInput.value = "";

//                 return;
//             }


//             // ----------------------------------------------------
//             // SIZE
//             // ----------------------------------------------------

//             if (
//                 file.size >
//                 5 * 1024 * 1024
//             ) {

//                 alert(
//                     "Selfie image must be smaller than 5 MB."
//                 );

//                 selfieFileInput.value = "";

//                 return;
//             }


//             capturedSelfieBlob = file;


//             // ----------------------------------------------------
//             // PREVIEW
//             // ----------------------------------------------------

//             const reader =
//                 new FileReader();


//             reader.onload = (e) => {

//                 displaySelfieInCircle(
//                     e.target.result
//                 );

//             };


//             reader.readAsDataURL(file);


//             console.log(
//                 "Selfie uploaded:",
//                 file.name,
//                 file.size,
//                 "bytes"
//             );

//         }
//     );


//     // ============================================================
//     // DOCUMENT UI
//     // ============================================================

//     function updateDocumentUI(file) {

//         if (!file) {
//             return;
//         }


//         // --------------------------------------------------------
//         // ALLOWED TYPES
//         // --------------------------------------------------------

//         const allowedTypes = [
//             "image/png",
//             "image/jpeg",
//             "application/pdf"
//         ];


//         const isAllowed =
//             allowedTypes.includes(file.type);


//         if (!isAllowed) {

//             alert(
//                 "Invalid document format.\n\n" +
//                 "Please upload PNG, JPG, JPEG or PDF."
//             );

//             return;
//         }


//         // --------------------------------------------------------
//         // SIZE
//         // --------------------------------------------------------

//         if (
//             file.size >
//             10 * 1024 * 1024
//         ) {

//             alert(
//                 "Document must be smaller than 10 MB."
//             );

//             return;
//         }


//         // --------------------------------------------------------
//         // SAVE
//         // --------------------------------------------------------

//         selectedDocFile = file;


//         // --------------------------------------------------------
//         // UI
//         // --------------------------------------------------------

//         const fileSizeMB =
//             file.size /
//             (1024 * 1024);


//         if (statusText) {

//             statusText.innerHTML =
//                 `Selected File: <strong style="color:#a5f3fc;">
//                     ${escapeHtml(file.name)}
//                 </strong> (${fileSizeMB.toFixed(2)} MB)`;

//         }


//         console.log(
//             "Document selected:",
//             file.name,
//             file.type,
//             file.size,
//             "bytes"
//         );

//     }


//     // ============================================================
//     // HTML ESCAPE
//     // ============================================================

//     function escapeHtml(value) {

//         const div =
//             document.createElement("div");

//         div.textContent = value;

//         return div.innerHTML;
//     }


//     // ============================================================
//     // DOCUMENT INPUT
//     // ============================================================

//     fileInput.addEventListener(
//         "change",
//         (event) => {

//             const file =
//                 event.target.files[0];

//             updateDocumentUI(file);

//         }
//     );


//     // ============================================================
//     // DRAG & DROP
//     // ============================================================

//     if (dropZone) {

//         ["dragenter", "dragover"].forEach(
//             (eventName) => {

//                 dropZone.addEventListener(
//                     eventName,
//                     (event) => {

//                         event.preventDefault();
//                         event.stopPropagation();

//                         dropZone.style.borderColor =
//                             "#a5f3fc";

//                         dropZone.style.backgroundColor =
//                             "rgba(165, 243, 252, 0.05)";
//                     }
//                 );

//             }
//         );


//         ["dragleave", "drop"].forEach(
//             (eventName) => {

//                 dropZone.addEventListener(
//                     eventName,
//                     (event) => {

//                         event.preventDefault();
//                         event.stopPropagation();

//                         dropZone.style.borderColor =
//                             "#30363d";

//                         dropZone.style.backgroundColor =
//                             "rgba(255, 255, 255, 0.01)";
//                     }
//                 );

//             }
//         );


//         dropZone.addEventListener(
//             "drop",
//             (event) => {

//                 const droppedFiles =
//                     event.dataTransfer.files;


//                 if (
//                     !droppedFiles ||
//                     droppedFiles.length === 0
//                 ) {
//                     return;
//                 }


//                 const file =
//                     droppedFiles[0];


//                 updateDocumentUI(file);

//             }
//         );

//     }


//     // ============================================================
//     // VERIFY BUTTON
//     // ============================================================

//     verifyBtn.addEventListener(
//         "click",
//         async () => {

//             console.log("");
//             console.log("========================================");
//             console.log("VERIFICATION STARTED");
//             console.log("========================================");


//             // ====================================================
//             // SELFIE CHECK
//             // ====================================================

//             if (!capturedSelfieBlob) {

//                 alert(
//                     "Please upload or capture a selfie photo first."
//                 );

//                 console.warn(
//                     "Selfie missing."
//                 );

//                 return;
//             }


//             // ====================================================
//             // DOCUMENT CHECK
//             // ====================================================

//             if (!selectedDocFile) {

//                 alert(
//                     "Please select or drop a document file."
//                 );

//                 console.warn(
//                     "Document missing."
//                 );

//                 return;
//             }


//             // ====================================================
//             // DOCUMENT TYPE
//             // ====================================================

//             const docType =
//                 docTypeSelect
//                     ? docTypeSelect.value
//                     : "passport";


//             console.log(
//                 "Document type:",
//                 docType
//             );

//             console.log(
//                 "Document:",
//                 selectedDocFile.name
//             );

//             console.log(
//                 "Selfie:",
//                 capturedSelfieBlob.name ||
//                 "captured_selfie.jpg"
//             );


//             // ====================================================
//             // FORM DATA
//             // ====================================================

//             const formData =
//                 new FormData();


//             formData.append(
//                 "document",
//                 selectedDocFile
//             );


//             if (
//                 capturedSelfieBlob instanceof File
//             ) {

//                 formData.append(
//                     "selfie",
//                     capturedSelfieBlob,
//                     capturedSelfieBlob.name
//                 );

//             } else {

//                 formData.append(
//                     "selfie",
//                     capturedSelfieBlob,
//                     "selfie.jpg"
//                 );

//             }


//             // ====================================================
//             // DEBUG FORM DATA
//             // ====================================================

//             console.log("----------------------------------------");
//             console.log("FORM DATA");
//             console.log("----------------------------------------");


//             for (
//                 const [key, value]
//                 of formData.entries()
//             ) {

//                 if (value instanceof File) {

//                     console.log(
//                         key,
//                         "=>",
//                         value.name,
//                         value.type,
//                         value.size,
//                         "bytes"
//                     );

//                 } else {

//                     console.log(
//                         key,
//                         "=>",
//                         value
//                     );

//                 }

//             }


//             // ====================================================
//             // BUTTON LOADING
//             // ====================================================

//             verifyBtn.disabled = true;


//             const originalButtonText =
//                 verifyBtn.innerHTML;


//             verifyBtn.innerHTML =
//                 `<i class="fa-solid fa-spinner fa-spin"></i>
//                  Verifying...`;


//             // ====================================================
//             // SEND TO FASTAPI
//             // ====================================================

//             try {

//                 console.log("");
//                 console.log(
//                     "Sending request to FastAPI..."
//                 );

//                 console.log(
//                     "Endpoint:",
//                     API_URL
//                 );


//                 const response =
//                     await fetch(
//                         API_URL,
//                         {
//                             method: "POST",
//                             body: formData
//                         }
//                     );


//                 console.log(
//                     "Backend HTTP status:",
//                     response.status
//                 );


//                 // =================================================
//                 // READ RESPONSE
//                 // =================================================

//                 const responseText =
//                     await response.text();


//                 console.log("----------------------------------------");
//                 console.log("RAW BACKEND RESPONSE");
//                 console.log("----------------------------------------");

//                 console.log(
//                     responseText
//                 );


//                 let result;


//                 try {

//                     result =
//                         JSON.parse(
//                             responseText
//                         );

//                 } catch (jsonError) {

//                     console.error(
//                         "Backend did not return valid JSON.",
//                         jsonError
//                     );


//                     alert(
//                         "Backend returned an invalid response.\n\n" +
//                         "Check the browser console."
//                     );

//                     return;
//                 }


//                 // =================================================
//                 // COMPLETE RESULT
//                 // =================================================

//                 console.log("----------------------------------------");
//                 console.log("COMPLETE VERIFICATION RESULT");
//                 console.log("----------------------------------------");

//                 console.log(
//                     JSON.stringify(
//                         result,
//                         null,
//                         2
//                     )
//                 );


//                 // =================================================
//                 // BACKEND ERROR
//                 // =================================================

//                 if (!response.ok) {

//                     console.error(
//                         "Backend verification error:",
//                         result
//                     );


//                     const errorMessage =
//                         result.detail ||
//                         result.message ||
//                         "Verification request failed.";


//                     alert(
//                         "Verification failed.\n\n" +
//                         errorMessage
//                     );

//                     return;
//                 }


//                 // =================================================
//                 // SAVE RESULT FOR DASHBOARD 1
//                 // =================================================

//                 localStorage.setItem(
//                     "verification_result",
//                     JSON.stringify(result)
//                 );


//                 console.log("");
//                 console.log("========================================");
//                 console.log("FINAL RESULT SAVED");
//                 console.log("========================================");

//                 console.log(
//                     "localStorage key:",
//                     "verification_result"
//                 );

//                 console.log(
//                     "Saved result:",
//                     result
//                 );


//                 // =================================================
//                 // ALSO SAVE A TIMESTAMP
//                 // =================================================

//                 localStorage.setItem(
//                     "verification_timestamp",
//                     new Date().toISOString()
//                 );


//                 // =================================================
//                 // SUCCESS MESSAGE
//                 // =================================================

//                 if (result.success === true) {

//                     console.log(
//                         "Verification completed successfully."
//                     );

//                 } else {

//                     console.log(
//                         "Verification completed with failed/review checks."
//                     );

//                 }


//                 // =================================================
//                 // REDIRECT TO DASHBOARD 1
//                 // =================================================

//                 /*
//                     IMPORTANT:

//                     Change "dashboard1.html" ONLY if your actual
//                     officer dashboard has a different filename.
//                 */

//                 window.location.href =
//                     window.location.href = "../Dasboard1/dashboard1.html";


//             } catch (error) {

//                 console.error(
//                     "========================================"
//                 );

//                 console.error(
//                     "FRONTEND → BACKEND CONNECTION ERROR"
//                 );

//                 console.error(
//                     "========================================"
//                 );

//                 console.error(
//                     error
//                 );


//                 alert(
//                     "Cannot connect to the verification server.\n\n" +
//                     "Make sure FastAPI is running at:\n" +
//                     "http://127.0.0.1:8000"
//                 );

//             } finally {

//                 // =================================================
//                 // RESTORE BUTTON
//                 // =================================================

//                 verifyBtn.disabled = false;

//                 verifyBtn.innerHTML =
//                     originalButtonText;

//             }

//         }
//     );


//     // ============================================================
//     // PAGE CLEANUP
//     // ============================================================

//     window.addEventListener(
//         "beforeunload",
//         () => {

//             stopCamera();

//         }
//     );

// });




































































document.addEventListener("DOMContentLoaded", () => {

    // ============================================================
    // ELEMENTS
    // ============================================================

    const captureBtn =
        document.getElementById("btn-capture-selfie");

    const cameraModal =
        document.getElementById("camera-modal");

    const closeModalBtn =
        document.getElementById("close-modal-btn");

    const video =
        document.getElementById("webcam-video");

    const takeSnapBtn =
        document.getElementById("btn-take-snap");

    const canvas =
        document.getElementById("snapshot-canvas");

    const selfiePreview =
        document.getElementById("selfie-preview");

    const selfieIcon =
        document.getElementById("selfie-icon");

    const selfieFileInput =
        document.getElementById("selfie-file-input");

    const docTypeSelect =
        document.getElementById("document-type");

    const fileInput =
        document.getElementById("id-file-input");

    const statusText =
        document.getElementById("upload-status-text");

    const dropZone =
        document.getElementById("drop-zone");

    const verifyBtn =
        document.getElementById("btn-verify-details");


    // ============================================================
    // VARIABLES
    // ============================================================

    let capturedSelfieBlob = null;
    let selectedDocFile = null;
    let streamInstance = null;


    // ============================================================
    // BASIC ELEMENT CHECK
    // ============================================================

    console.log("========================================");
    console.log("ID VERIFY FRONTEND INITIALIZED");
    console.log("========================================");

    console.log("Capture button:", captureBtn);
    console.log("Selfie input:", selfieFileInput);
    console.log("Document input:", fileInput);
    console.log("Verify button:", verifyBtn);

    if (!verifyBtn || !fileInput || !selfieFileInput) {

        console.error(
            "Required HTML elements are missing."
        );

        return;
    }


    // ============================================================
    // SHOW SELFIE PREVIEW
    // ============================================================

    function displaySelfieInCircle(imageSrc) {

        if (!selfiePreview) {
            return;
        }

        selfiePreview.src = imageSrc;
        selfiePreview.style.display = "block";

        if (selfieIcon) {
            selfieIcon.style.display = "none";
        }
    }


    // ============================================================
    // CAMERA
    // ============================================================

    if (captureBtn) {

        captureBtn.addEventListener(
            "click",
            async () => {

                try {

                    if (
                        !navigator.mediaDevices ||
                        !navigator.mediaDevices.getUserMedia
                    ) {

                        throw new Error(
                            "Camera API is not supported."
                        );
                    }

                    streamInstance =
                        await navigator.mediaDevices.getUserMedia({
                            video: {
                                facingMode: "user"
                            },
                            audio: false
                        });

                    video.srcObject =
                        streamInstance;

                    cameraModal.style.display =
                        "flex";

                } catch (error) {

                    console.error(
                        "Camera error:",
                        error
                    );

                    alert(
                        "Camera access failed.\n\n" +
                        "Please upload a selfie image instead."
                    );

                    selfieFileInput.click();
                }

            }
        );

    }


    // ============================================================
    // TAKE SELFIE
    // ============================================================

    if (takeSnapBtn) {

        takeSnapBtn.addEventListener(
            "click",
            () => {

                if (!streamInstance) {

                    alert(
                        "Camera is not active."
                    );

                    return;
                }

                const width =
                    video.videoWidth || 640;

                const height =
                    video.videoHeight || 480;

                canvas.width = width;
                canvas.height = height;

                const context =
                    canvas.getContext("2d");

                if (!context) {

                    alert(
                        "Unable to capture image."
                    );

                    return;
                }

                context.drawImage(
                    video,
                    0,
                    0,
                    width,
                    height
                );


                // ------------------------------------------------
                // PREVIEW
                // ------------------------------------------------

                const dataUrl =
                    canvas.toDataURL(
                        "image/jpeg",
                        0.95
                    );

                displaySelfieInCircle(
                    dataUrl
                );


                // ------------------------------------------------
                // CREATE BLOB
                // ------------------------------------------------

                canvas.toBlob(
                    (blob) => {

                        if (!blob) {

                            alert(
                                "Failed to capture selfie."
                            );

                            return;
                        }

                        capturedSelfieBlob =
                            blob;

                        console.log(
                            "Selfie captured successfully:",
                            blob.size,
                            "bytes"
                        );

                    },
                    "image/jpeg",
                    0.95
                );


                stopCamera();

            }
        );

    }


    // ============================================================
    // STOP CAMERA
    // ============================================================

    function stopCamera() {

        if (streamInstance) {

            streamInstance
                .getTracks()
                .forEach(
                    (track) => track.stop()
                );

            streamInstance = null;
        }

        if (video) {
            video.srcObject = null;
        }

        if (cameraModal) {
            cameraModal.style.display =
                "none";
        }
    }


    // ============================================================
    // CLOSE CAMERA
    // ============================================================

    if (closeModalBtn) {

        closeModalBtn.addEventListener(
            "click",
            stopCamera
        );

    }


    // ============================================================
    // SELFIE FILE UPLOAD
    // ============================================================

    selfieFileInput.addEventListener(
        "change",
        (event) => {

            const file =
                event.target.files[0];

            if (!file) {
                return;
            }


            // ----------------------------------------------------
            // CHECK FILE TYPE
            // ----------------------------------------------------

            if (!file.type.startsWith("image/")) {

                alert(
                    "Please select a valid image for the selfie."
                );

                selfieFileInput.value = "";

                return;
            }


            // ----------------------------------------------------
            // CHECK FILE SIZE
            // ----------------------------------------------------

            if (
                file.size >
                5 * 1024 * 1024
            ) {

                alert(
                    "Selfie image must be smaller than 5 MB."
                );

                selfieFileInput.value = "";

                return;
            }


            capturedSelfieBlob =
                file;


            // ----------------------------------------------------
            // PREVIEW
            // ----------------------------------------------------

            const reader =
                new FileReader();

            reader.onload =
                (e) => {

                    displaySelfieInCircle(
                        e.target.result
                    );

                };

            reader.readAsDataURL(file);


            console.log(
                "Selfie uploaded:",
                file.name,
                file.size,
                "bytes"
            );

        }
    );


    // ============================================================
    // DOCUMENT UI
    // ============================================================

    function updateDocumentUI(file) {

        if (!file) {
            return;
        }


        // --------------------------------------------------------
        // CHECK FILE TYPE
        // --------------------------------------------------------

        const allowedTypes = [
            "image/png",
            "image/jpeg",
            "application/pdf"
        ];

        const isAllowed =
            allowedTypes.includes(
                file.type
            );

        if (!isAllowed) {

            alert(
                "Invalid document format.\n\n" +
                "Please upload PNG, JPG, JPEG or PDF."
            );

            return;
        }


        // --------------------------------------------------------
        // CHECK FILE SIZE
        // --------------------------------------------------------

        if (
            file.size >
            10 * 1024 * 1024
        ) {

            alert(
                "Document must be smaller than 10 MB."
            );

            return;
        }


        // --------------------------------------------------------
        // SAVE FILE
        // --------------------------------------------------------

        selectedDocFile =
            file;


        // --------------------------------------------------------
        // UPDATE UI
        // --------------------------------------------------------

        const fileSizeMB =
            file.size /
            (1024 * 1024);

        statusText.innerHTML =
            `Selected File: <strong style="color:#a5f3fc;">
                ${escapeHtml(file.name)}
            </strong> (${fileSizeMB.toFixed(2)} MB)`;


        console.log(
            "Document selected:",
            file.name,
            file.type,
            file.size,
            "bytes"
        );

    }


    // ============================================================
    // HTML ESCAPE
    // ============================================================

    function escapeHtml(value) {

        const div =
            document.createElement("div");

        div.textContent =
            value;

        return div.innerHTML;
    }


    // ============================================================
    // DOCUMENT FILE INPUT
    // ============================================================

    fileInput.addEventListener(
        "change",
        (event) => {

            const file =
                event.target.files[0];

            updateDocumentUI(file);

        }
    );


    // ============================================================
    // DRAG ENTER / DRAG OVER
    // ============================================================

    if (dropZone) {

        ["dragenter", "dragover"].forEach(
            (eventName) => {

                dropZone.addEventListener(
                    eventName,
                    (event) => {

                        event.preventDefault();
                        event.stopPropagation();

                        dropZone.style.borderColor =
                            "#a5f3fc";

                        dropZone.style.backgroundColor =
                            "rgba(165, 243, 252, 0.05)";
                    }
                );

            }
        );


        // ========================================================
        // DRAG LEAVE / DROP
        // ========================================================

        ["dragleave", "drop"].forEach(
            (eventName) => {

                dropZone.addEventListener(
                    eventName,
                    (event) => {

                        event.preventDefault();
                        event.stopPropagation();

                        dropZone.style.borderColor =
                            "#30363d";

                        dropZone.style.backgroundColor =
                            "rgba(255, 255, 255, 0.01)";
                    }
                );

            }
        );


        // ========================================================
        // DROP DOCUMENT
        // ========================================================

        dropZone.addEventListener(
            "drop",
            (event) => {

                const droppedFiles =
                    event.dataTransfer.files;

                if (
                    !droppedFiles ||
                    droppedFiles.length === 0
                ) {
                    return;
                }

                const file =
                    droppedFiles[0];

                updateDocumentUI(file);

            }
        );

    }


    // ============================================================
    // VERIFY BUTTON
    // ============================================================

    verifyBtn.addEventListener(
        "click",
        async () => {

            console.log("");
            console.log("========================================");
            console.log("VERIFICATION STARTED");
            console.log("========================================");


            // ====================================================
            // CHECK SELFIE
            // ====================================================

            if (!capturedSelfieBlob) {

                alert(
                    "Please upload or capture a selfie photo first."
                );

                console.warn(
                    "Selfie missing."
                );

                return;
            }


            // ====================================================
            // CHECK DOCUMENT
            // ====================================================

            if (!selectedDocFile) {

                alert(
                    "Please select or drop a document file."
                );

                console.warn(
                    "Document missing."
                );

                return;
            }


            // ====================================================
            // DOCUMENT TYPE
            // ====================================================

            const docType =
                docTypeSelect
                    ? docTypeSelect.value
                    : "passport";

            console.log(
                "Document type:",
                docType
            );

            console.log(
                "Document:",
                selectedDocFile.name
            );

            console.log(
                "Selfie:",
                capturedSelfieBlob.name ||
                "captured_selfie.jpg"
            );


            // ====================================================
            // CREATE FORM DATA
            // ====================================================

            const formData =
                new FormData();


            // ====================================================
            // DOCUMENT
            // ====================================================

            formData.append(
                "document",
                selectedDocFile
            );


            // ====================================================
            // SELFIE
            // ====================================================

            if (
                capturedSelfieBlob instanceof File
            ) {

                formData.append(
                    "selfie",
                    capturedSelfieBlob,
                    capturedSelfieBlob.name
                );

            } else {

                formData.append(
                    "selfie",
                    capturedSelfieBlob,
                    "selfie.jpg"
                );

            }


            // ====================================================
            // DEBUG FORMDATA
            // ====================================================

            console.log("----------------------------------------");
            console.log("FORM DATA");
            console.log("----------------------------------------");

            for (
                const [key, value]
                of formData.entries()
            ) {

                if (
                    value instanceof File
                ) {

                    console.log(
                        key,
                        "=>",
                        value.name,
                        value.type,
                        value.size,
                        "bytes"
                    );

                } else {

                    console.log(
                        key,
                        "=>",
                        value
                    );

                }
            }


            // ====================================================
            // BUTTON LOADING
            // ====================================================

            verifyBtn.disabled =
                true;

            const originalButtonText =
                verifyBtn.innerHTML;

            verifyBtn.innerHTML =
                `<i class="fa-solid fa-spinner fa-spin"></i>
                 Verifying...`;


            // ====================================================
            // SEND REQUEST
            // ====================================================

            try {

                console.log("");
                console.log(
                    "Sending request to FastAPI..."
                );

                console.log(
                    "Endpoint:",
                    "http://127.0.0.1:8000/api/verify"
                );


                const response =
                    await fetch(
                        "http://127.0.0.1:8000/api/verify",
                        {
                            method: "POST",
                            body: formData
                        }
                    );


                console.log(
                    "Backend HTTP status:",
                    response.status
                );


                // =================================================
                // READ RESPONSE
                // =================================================

                const responseText =
                    await response.text();


                console.log("----------------------------------------");
                console.log("RAW BACKEND RESPONSE");
                console.log("----------------------------------------");

                console.log(
                    responseText
                );


                let result;


                try {

                    result =
                        JSON.parse(
                            responseText
                        );

                } catch (jsonError) {

                    console.error(
                        "Backend did not return valid JSON.",
                        jsonError
                    );

                    alert(
                        "Backend returned an invalid response.\n\n" +
                        "Check the browser console."
                    );

                    return;
                }


                // =================================================
                // SHOW COMPLETE RESULT
                // =================================================

                console.log("----------------------------------------");
                console.log("COMPLETE VERIFICATION RESULT");
                console.log("----------------------------------------");

                console.log(
                    JSON.stringify(
                        result,
                        null,
                        2
                    )
                );


                // =================================================
                // BACKEND ERROR
                // =================================================

                if (!response.ok) {

                    console.error(
                        "Backend verification error:",
                        result
                    );

                    const errorMessage =
                        result.detail ||
                        result.message ||
                        "Verification request failed.";

                    alert(
                        "Verification failed.\n\n" +
                        errorMessage
                    );

                    return;
                }


                // =================================================
                // IMPORTANT
                // SAVE RESULT FOR DASHBOARD 1
                // =================================================
                //
                // Dashboard 1 reads:
                //
                // localStorage.getItem(
                //     "verification_result"
                // )
                //
                // Therefore Dashboard 2 MUST use exactly
                // the same storage and exactly the same key.
                //
                // =================================================

                localStorage.setItem(
                    "verification_result",
                    JSON.stringify(result)
                );


                console.log("----------------------------------------");
                console.log("RESULT SAVED TO LOCAL STORAGE");
                console.log("----------------------------------------");

                console.log(
                    "verification_result:",
                    localStorage.getItem(
                        "verification_result"
                    )
                );


                // =================================================
                // LOG EVERY MAJOR RESULT
                // =================================================

                console.log("");
                console.log("========================================");
                console.log("BACKEND PIPELINE RESULT");
                console.log("========================================");

                console.log(
                    "SUCCESS:",
                    result.success
                );

                console.log(
                    "IDENTITY:",
                    result.identity
                );

                console.log(
                    "CHECKS:",
                    result.checks
                );

                console.log(
                    "RISK:",
                    result.risk
                );

                console.log(
                    "REPORT:",
                    result.report
                );

                console.log(
                    "FULL RESULT:",
                    result
                );


                // =================================================
                // SUCCESS MESSAGE
                // =================================================

                if (
                    result.success === true
                ) {

                    console.log(
                        "Verification completed successfully."
                    );

                } else {

                    console.log(
                        "Verification completed with a non-success result."
                    );

                }


                // =================================================
                // REDIRECT TO DASHBOARD 1
                // =================================================
                //
                // dashboard2 folder
                //       ↓
                // ../
                //       ↓
                // dashboard1
                //       ↓
                // dashboard1.html
                //
                // =================================================

                console.log(
                    "Redirecting to Dashboard 1..."
                );

                window.location.href =
                    "police_index.html";


            } catch (error) {

                console.error(
                    "========================================"
                );

                console.error(
                    "FRONTEND → BACKEND CONNECTION ERROR"
                );

                console.error(
                    "========================================"
                );

                console.error(
                    error
                );


                alert(
                    "Cannot connect to the verification server.\n\n" +
                    "Make sure FastAPI is running at:\n" +
                    "http://127.0.0.1:8000"
                );


            } finally {

                // =================================================
                // RESTORE BUTTON
                // =================================================

                verifyBtn.disabled =
                    false;

                verifyBtn.innerHTML =
                    originalButtonText;

            }

        }
    );


    // ============================================================
    // PAGE CLEANUP
    // ============================================================

    window.addEventListener(
        "beforeunload",
        () => {

            stopCamera();

        }
    );

});