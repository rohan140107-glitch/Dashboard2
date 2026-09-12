




















































































// ============================================================
// ID VERIFY — OFFICER VERIFICATION DASHBOARD
// Dashboard 1 receives the FINAL result from Dashboard 2
// ============================================================

let verificationResult = null;


// ============================================================
// SAFE VALUE
// ============================================================

function safeValue(value, fallback = "--") {

    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {
        return fallback;
    }

    return value;
}


// ============================================================
// SET TEXT
// ============================================================

function setText(id, value) {

    const element = document.getElementById(id);

    if (!element) {
        console.warn("Element not found:", id);
        return;
    }

    element.textContent = safeValue(value);
}


// ============================================================
// FORMAT PERCENTAGE
// ============================================================

function formatPercentage(value) {

    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {
        return "--";
    }

    const number = Number(value);

    if (Number.isNaN(number)) {
        return safeValue(value);
    }

    return `${number.toFixed(1)}%`;
}


// ============================================================
// STATUS CLASS
// ============================================================

function getStatusClass(status) {

    if (!status) {
        return "status-unknown";
    }

    const value = String(status).toLowerCase();

    if (
        value.includes("verified") ||
        value.includes("valid") ||
        value.includes("match") ||
        value.includes("matched") ||
        value.includes("pass") ||
        value.includes("passed") ||
        value.includes("low") ||
        value.includes("success")
    ) {
        return "status-success";
    }

    if (
        value.includes("fail") ||
        value.includes("invalid") ||
        value.includes("reject") ||
        value.includes("fraud") ||
        value.includes("high") ||
        value.includes("not matched")
    ) {
        return "status-danger";
    }

    if (
        value.includes("warning") ||
        value.includes("review") ||
        value.includes("medium")
    ) {
        return "status-warning";
    }

    return "status-unknown";
}


// ============================================================
// UPDATE STATUS
// ============================================================

function updateStatus(id, status) {

    const element = document.getElementById(id);

    if (!element) {
        return;
    }

    element.textContent = safeValue(status);

    element.classList.remove(
        "status-success",
        "status-danger",
        "status-warning",
        "status-unknown"
    );

    element.classList.add(
        getStatusClass(status)
    );
}


// ============================================================
// TOAST
// ============================================================

function showToast(
    message,
    icon = "fa-circle-check"
) {

    const container =
        document.getElementById("toast-container");

    if (!container) {
        console.log(message);
        return;
    }

    const toast =
        document.createElement("div");

    toast.className = "toast";

    toast.innerHTML = `
        <i class="fa-solid ${icon}"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}


// ============================================================
// IDENTITY
// ============================================================

function updateIdentity(identity) {

    if (!identity) {
        console.warn("Identity data missing.");
        return;
    }

    setText(
        "doc-type",
        identity.document_type ||
        identity.documentType ||
        "PASSPORT"
    );

    setText(
        "doc-no",
        identity.passport_number ||
        identity.document_number ||
        identity.documentNumber
    );

    setText(
        "full-name",
        identity.name ||
        identity.full_name ||
        identity.fullName
    );

    const overallMatch =
        verificationResult?.risk?.overall_match_percentage ??
        verificationResult?.risk?.overall_match ??
        identity.match_score;

    setText(
        "match-score",
        overallMatch !== undefined
            ? formatPercentage(overallMatch)
            : "--"
    );
}


// ============================================================
// OCR
// ============================================================

function updateOCR(data) {

    if (!data) {
        console.warn("OCR data missing.");
        return;
    }

    const score =
        data.percentage ??
        data.score ??
        0;

    const status =
        data.success
            ? "Verified"
            : "Failed";

    setText(
        "ocr-score",
        formatPercentage(score)
    );

    updateStatus(
        "ocr-status",
        status
    );

    updateProgress(
        "ocr-progress",
        score
    );
}


// ============================================================
// MRZ
// ============================================================

function updateMRZ(data) {

    if (!data) {
        console.warn("MRZ data missing.");
        return;
    }

    const score =
        data.percentage ??
        data.score ??
        0;

    const status =
        data.valid
            ? "Valid"
            : "Invalid";

    setText(
        "mrz-score",
        formatPercentage(score)
    );

    updateStatus(
        "mrz-status",
        status
    );

    updateProgress(
        "mrz-progress",
        score
    );
}


// ============================================================
// PASSPORT
// ============================================================

function updatePassport(data) {

    if (!data) {
        console.warn("Passport data missing.");
        return;
    }

    const score =
        data.percentage ??
        data.score ??
        0;

    const status =
        data.valid
            ? "Valid"
            : "Invalid";

    setText(
        "passport-score",
        formatPercentage(score)
    );

    updateStatus(
        "passport-status",
        status
    );

    updateProgress(
        "passport-progress",
        score
    );
}


// ============================================================
// DATABASE
// ============================================================

function updateDatabase(data) {

    if (!data) {
        console.warn("Database data missing.");
        return;
    }

    const score =
        data.percentage ??
        data.score ??
        0;

    const status =
        data.match
            ? "Matched"
            : "Not Matched";

    setText(
        "database-score",
        formatPercentage(score)
    );

    updateStatus(
        "database-status",
        status
    );

    updateProgress(
        "database-progress",
        score
    );

    setText(
        "database-match",
        data.match
            ? "MATCHED"
            : "NOT MATCHED"
    );
}


// ============================================================
// FACE
// ============================================================

function updateFace(data) {

    if (!data) {
        console.warn("Face data missing.");
        return;
    }

    const similarity =
        Number(
            data.similarity ??
            data.percentage ??
            data.score ??
            0
        );

    const score =
        similarity <= 1
            ? similarity * 100
            : similarity;

    const status =
        data.match
            ? "Matched"
            : data.detected
                ? "Not Matched"
                : "Face Not Detected";

    setText(
        "face-score",
        formatPercentage(score)
    );

    updateStatus(
        "face-status",
        status
    );

    updateProgress(
        "face-progress",
        score
    );

    setText(
        "face-similarity",
        formatPercentage(score)
    );

    setText(
        "face-message",
        data.match
            ? "Face successfully matched."
            : "Face verification did not match."
    );
}


// ============================================================
// FORENSICS
// ============================================================

function updateForensics(data) {

    if (!data) {
        console.warn("Forensics data missing.");
        return;
    }

    if (data.available === false) {

        setText(
            "forensics-status",
            "Not Implemented"
        );

        setText(
            "forensics-score",
            "--"
        );

        setText(
            "forensics-message",
            "Forensic analysis is currently unavailable."
        );

        return;
    }

    const score =
        data.percentage ??
        data.score ??
        0;

    const status =
        data.valid
            ? "Passed"
            : "Failed";

    setText(
        "forensics-score",
        formatPercentage(score)
    );

    updateStatus(
        "forensics-status",
        status
    );

    updateProgress(
        "forensics-progress",
        score
    );
}


// ============================================================
// PROGRESS BAR
// ============================================================

function updateProgress(id, value) {

    const bar =
        document.getElementById(id);

    if (!bar) {
        return;
    }

    let percentage =
        Number(value);

    if (Number.isNaN(percentage)) {
        percentage = 0;
    }

    percentage =
        Math.max(
            0,
            Math.min(
                100,
                percentage
            )
        );

    bar.style.width =
        `${percentage}%`;
}


// ============================================================
// RISK
// ============================================================

function updateRisk(risk) {

    if (!risk) {
        console.warn("Risk data missing.");
        return;
    }

    const riskScore =
        Number(
            risk.score ??
            risk.risk_score ??
            risk.riskScore ??
            0
        );

    const riskLevel =
        risk.level ??
        risk.risk_level ??
        risk.riskLevel ??
        "--";

    const decision =
        risk.decision ??
        "--";

    setText(
        "risk-score",
        formatPercentage(riskScore)
    );

    setText(
        "risk-level",
        riskLevel
    );

    setText(
        "decision",
        decision
    );

    updateStatus(
        "risk-status",
        riskLevel
    );

    updateStatus(
        "decision-status",
        decision
    );

    updateProgress(
        "risk-progress",
        riskScore
    );

    updateReasons(
        risk.reasons
    );
}


// ============================================================
// RISK REASONS
// ============================================================

function updateReasons(reasons) {

    const container =
        document.getElementById(
            "risk-reasons"
        );

    if (!container) {
        return;
    }

    container.innerHTML = "";

    if (
        !Array.isArray(reasons) ||
        reasons.length === 0
    ) {

        container.innerHTML = `
            <div class="reason-item">
                <i class="fa-solid fa-circle-check"></i>
                <span>No risk factors detected.</span>
            </div>
        `;

        return;
    }

    reasons.forEach(reason => {

        const item =
            document.createElement("div");

        item.className =
            "reason-item";

        item.innerHTML = `
            <i class="fa-solid fa-circle-exclamation"></i>
            <span>${safeValue(reason)}</span>
        `;

        container.appendChild(item);
    });
}


// ============================================================
// OVERALL RESULT
// ============================================================

function updateOverall(result) {

    const risk =
        result.risk || {};

    const decision =
        risk.decision ||
        "--";

    const level =
        risk.risk_level ||
        risk.level ||
        "--";

    const overall =
        risk.overall_match_percentage ??
        risk.overall_match ??
        0;

    setText(
        "overall-score",
        formatPercentage(overall)
    );

    setText(
        "overall-status",
        level
    );

    setText(
        "overall-decision",
        decision
    );

    updateStatus(
        "overall-status",
        level
    );

    updateStatus(
        "overall-decision",
        decision
    );

    updateProgress(
        "overall-progress",
        overall
    );
}


// ============================================================
// COMPLETION
// ============================================================

function calculateCompletion(result) {

    let completed = 0;
    let total = 0;

    const checks =
        result.checks || {};


    // OCR
    if (checks.ocr) {

        total++;

        if (checks.ocr.success) {
            completed++;
        }
    }


    // MRZ
    if (checks.mrz) {

        total++;

        if (checks.mrz.valid) {
            completed++;
        }
    }


    // Passport
    if (checks.passport) {

        total++;

        if (checks.passport.valid) {
            completed++;
        }
    }


    // Database
    if (checks.database) {

        total++;

        if (checks.database.match) {
            completed++;
        }
    }


    // Face
    if (checks.face) {

        total++;

        if (
            checks.face.detected &&
            checks.face.match
        ) {
            completed++;
        }
    }


    if (total === 0) {
        return 0;
    }

    return (
        completed / total
    ) * 100;
}


// ============================================================
// UPDATE COMPLETION GAUGE
// ============================================================

function updateCompletion(result) {

    const percentage =
        calculateCompletion(result);

    const text =
        document.getElementById(
            "completion-text"
        );

    const ring =
        document.getElementById(
            "gauge-ring"
        );

    if (!text || !ring) {
        return;
    }

    text.textContent =
        `${Math.round(percentage)}%`;

    ring.style.background =
        `
        conic-gradient(
            #0d9488 0% ${percentage}%,
            #1e293b ${percentage}% 100%
        )
        `;
}


// ============================================================
// MICRO CHECKS
// ============================================================

function updateMicroChecks(result) {

    const checks =
        result.checks || {};

    setMicroTag(
        "tag-cross",
        checks.database?.match
    );

    setMicroTag(
        "tag-security",
        checks.passport?.valid
    );

    setMicroTag(
        "tag-liveness",
        checks.face?.match
    );
}


function setMicroTag(id, passed) {

    const element =
        document.getElementById(id);

    if (!element) {
        return;
    }

    if (passed) {

        element.textContent =
            "• VERIFIED";

        element.className =
            "tag tag-green";

    } else {

        element.textContent =
            "• FAILED";

        element.className =
            "tag tag-red";
    }
}


// ============================================================
// AUDIT TRAIL
// ============================================================

function updateAuditTrail(result) {

    const container =
        document.getElementById(
            "audit-trail-container"
        );

    if (!container) {
        return;
    }

    container.innerHTML = "";

    const checks =
        result.checks || {};

    const steps = [

        {
            name: "Document uploaded",
            status: true
        },

        {
            name: "OCR completed",
            status: checks.ocr?.success
        },

        {
            name: "MRZ verification",
            status: checks.mrz?.valid
        },

        {
            name: "Passport validation",
            status: checks.passport?.valid
        },

        {
            name: "Database verification",
            status: checks.database?.match
        },

        {
            name: "Face verification",
            status:
                checks.face?.detected &&
                checks.face?.match
        },

        {
            name: "Risk assessment",
            status: Boolean(result.risk)
        },

        {
            name: "Verification report generated",
            status: true
        }

    ];

    steps.forEach(step => {

        const item =
            document.createElement("div");

        item.className =
            "audit-item";

        item.innerHTML = `
            <div class="audit-dot"></div>

            <div>
                <strong>
                    ${step.name}
                </strong>

                <span>
                    ${step.status
                        ? "Completed"
                        : "Failed"}
                </span>
            </div>
        `;

        container.appendChild(item);
    });
}


// ============================================================
// PDF BUTTON
// ============================================================

function setupPDFButton(result) {

    const button =
        document.getElementById(
            "btn-pdf-download"
        );

    if (!button) {
        return;
    }

    button.onclick = async () => {

        if (
            !result ||
            !result.report
        ) {

            showToast(
                "PDF report is not available.",
                "fa-circle-exclamation"
            );

            return;
        }

        if (result.report.pdfUrl) {

            try {

                const response =
                    await fetch(
                        `http://127.0.0.1:8000${result.report.pdfUrl}`
                    );

                if (!response.ok) {
                    throw new Error(
                        "PDF request failed"
                    );
                }

                const blob =
                    await response.blob();

                const url =
                    window.URL.createObjectURL(
                        blob
                    );

                const link =
                    document.createElement("a");

                link.href = url;

                link.download =
                    "verification-report.pdf";

                document.body.appendChild(link);

                link.click();

                link.remove();

                window.URL.revokeObjectURL(url);

                showToast(
                    "PDF report downloaded.",
                    "fa-file-pdf"
                );

            } catch (error) {

                console.error(
                    "PDF ERROR:",
                    error
                );

                showToast(
                    "Unable to download PDF.",
                    "fa-circle-exclamation"
                );
            }

            return;
        }

        showToast(
            "PDF endpoint is not connected yet.",
            "fa-circle-exclamation"
        );
    };
}


















// ============================================================
// PDF BUTTON
// ============================================================

function setupPDFButton(result) {

    const button =
        document.getElementById(
            "btn-pdf-download"
        );

    if (!button) {
        console.warn(
            "PDF download button not found."
        );
        return;
    }

    button.onclick = async () => {

        // --------------------------------------------------------
        // CHECK RESULT
        // --------------------------------------------------------

        if (!result) {

            showToast(
                "Verification result is not available.",
                "fa-circle-exclamation"
            );

            return;
        }


        // --------------------------------------------------------
        // GET PDF URL
        // Backend currently returns:
        //
        // result.pdfUrl
        //
        // We also keep result.report.pdfUrl as a fallback.
        // --------------------------------------------------------

        const pdfUrl =
            result.pdfUrl ||
            (
                result.report &&
                result.report.pdfUrl
            );


        // --------------------------------------------------------
        // NO PDF URL
        // --------------------------------------------------------

        if (!pdfUrl) {

            console.error(
                "PDF URL not found in verification result:"
            );

            console.error(
                result
            );

            showToast(
                "PDF report URL not found.",
                "fa-circle-exclamation"
            );

            return;
        }


        // --------------------------------------------------------
        // BUILD FULL BACKEND URL
        // --------------------------------------------------------

        const fullPdfUrl =
            pdfUrl.startsWith("http")
                ? pdfUrl
                : `http://127.0.0.1:8000${pdfUrl}`;


        console.log(
            "PDF URL:",
            fullPdfUrl
        );


        // --------------------------------------------------------
        // DOWNLOAD PDF
        // --------------------------------------------------------

        try {

            const response =
                await fetch(
                    fullPdfUrl
                );


            if (!response.ok) {

                throw new Error(
                    `PDF request failed: ${response.status}`
                );
            }


            const blob =
                await response.blob();


            const url =
                window.URL.createObjectURL(
                    blob
                );


            const link =
                document.createElement("a");


            link.href =
                url;


            link.download =
                "verification-report.pdf";


            document.body.appendChild(
                link
            );


            link.click();


            link.remove();


            window.URL.revokeObjectURL(
                url
            );


            showToast(
                "PDF report downloaded successfully.",
                "fa-file-pdf"
            );


        } catch (error) {

            console.error(
                "PDF DOWNLOAD ERROR:",
                error
            );


            showToast(
                "Unable to download PDF.",
                "fa-circle-exclamation"
            );
        }
    };
}


// ============================================================
// MAIN DASHBOARD UPDATE
// ============================================================

function updateDashboard(result) {

    if (!result) {

        console.error(
            "No verification result."
        );

        return;
    }

    console.log(
        "========================================"
    );

    console.log(
        "FINAL VERIFICATION RESULT"
    );

    console.log(
        result
    );

    console.log(
        "========================================"
    );


    verificationResult =
        result;


    // ========================================================
    // IDENTITY
    // ========================================================

    updateIdentity(
        result.identity
    );


    // ========================================================
    // VERIFICATION MODULES
    // ========================================================

    updateOCR(
        result.checks?.ocr
    );

    updateMRZ(
        result.checks?.mrz
    );

    updatePassport(
        result.checks?.passport
    );

    updateDatabase(
        result.checks?.database
    );

    updateFace(
        result.checks?.face
    );

    updateForensics(
        result.checks?.forensics
    );


    // ========================================================
    // RISK
    // ========================================================

    updateRisk(
        result.risk
    );


    // ========================================================
    // OVERALL
    // ========================================================

    updateOverall(
        result
    );


    // ========================================================
    // COMPLETION
    // ========================================================

    updateCompletion(
        result
    );


    // ========================================================
    // MICRO CHECKS
    // ========================================================

    updateMicroChecks(
        result
    );


    // ========================================================
    // AUDIT TRAIL
    // ========================================================

    updateAuditTrail(
        result
    );


    // ========================================================
    // PDF
    // ========================================================

    setupPDFButton(
        result
    );


    showToast(
        "Verification completed successfully.",
        "fa-circle-check"
    );
}


// ============================================================
// RECEIVE RESULT FROM DASHBOARD 2
// ============================================================

function receiveVerificationResult() {

    console.log(
        "Looking for verification result..."
    );


    // IMPORTANT:
    // Dashboard 2 stores the result in localStorage.
    const storedResult =
        localStorage.getItem(
            "verification_result"
        );


    if (!storedResult) {

        console.warn(
            "No verification result found in localStorage."
        );

        showToast(
            "No verification result found.",
            "fa-circle-exclamation"
        );

        return false;
    }


    try {

        const result =
            JSON.parse(
                storedResult
            );


        console.log(
            "Verification result loaded from Dashboard 2:"
        );

        console.log(
            result
        );


        updateDashboard(
            result
        );


        return true;

    } catch (error) {

        console.error(
            "Unable to parse verification result:",
            error
        );

        showToast(
            "Invalid verification result.",
            "fa-circle-exclamation"
        );

        return false;
    }
}


// ============================================================
// LOGOUT
// ============================================================

function setupLogout() {

    const button =
        document.getElementById(
            "btn-logout"
        );

    if (!button) {
        return;
    }

    button.addEventListener(
        "click",
        () => {

            localStorage.removeItem(
                "verification_id"
            );

            localStorage.removeItem(
                "verification_result"
            );


            showToast(
                "Logging out...",
                "fa-right-from-bracket"
            );


            setTimeout(() => {

                window.location.href =
                    "../index.html";

            }, 800);

        }
    );
}


// ============================================================
// COPY LINK
// ============================================================

function setupCopyLink() {

    const button =
        document.getElementById(
            "btn-copy-link"
        );

    if (!button) {
        return;
    }

    button.addEventListener(
        "click",
        async () => {

            try {

                await navigator.clipboard.writeText(
                    window.location.href
                );

                showToast(
                    "Report link copied.",
                    "fa-link"
                );

            } catch (error) {

                console.error(
                    error
                );

                showToast(
                    "Could not copy link.",
                    "fa-circle-exclamation"
                );
            }

        }
    );
}


// ============================================================
// PAGE LOAD
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        console.log(
            "========================================"
        );

        console.log(
            "ID VERIFY — OFFICER DASHBOARD 1"
        );

        console.log(
            "========================================"
        );


        setupLogout();

        setupCopyLink();

        receiveVerificationResult();

    }
);