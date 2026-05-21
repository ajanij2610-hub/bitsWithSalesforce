(function () {

  function getAuthPagePath() {
    const path = window.location.pathname.replace(/\\/g, "/");

    if (path.includes("/pages/techDetails/") || path.includes("/pages/diplomaDetails/")) {
      return "../signin.html";
    }

    if (path.includes("/pages/")) {
      return "./signin.html";
    }

    return "./pages/signin.html";
  }

  function buildAuthUrl(mode) {
    const authUrl = new URL(getAuthPagePath(), window.location.href);
    authUrl.searchParams.set("embedded", "1");
    authUrl.searchParams.set("mode", mode === "signup" ? "signup" : "signin");
    return authUrl.toString();
  }

  function injectStyles() {
    if (document.getElementById("authPopupStyles")) return;

    const style = document.createElement("style");
    style.id = "authPopupStyles";
    style.textContent = `
      .auth-popup-overlay {
        position: fixed;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 18px;
        background: rgba(4, 18, 35, 0.7);
        backdrop-filter: blur(8px);
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
        transition: opacity 0.28s ease, visibility 0.28s ease;
        z-index: 2000;
      }

      .auth-popup-overlay.is-open {
        opacity: 1;
        visibility: visible;
        pointer-events: auto;
      }

      .auth-popup-dialog {
        position: relative;
        width: min(1080px, 100%);
        height: min(92vh, 820px);
        border-radius: 28px;
        overflow: hidden;
        background: #ffffff;
        box-shadow: 0 30px 60px rgba(3, 12, 27, 0.35);
        transform: translateY(18px) scale(0.98);
        transition: transform 0.28s ease;
      }

      .auth-popup-overlay.is-open .auth-popup-dialog {
        transform: translateY(0) scale(1);
      }

      .auth-popup-close {
        position: absolute;
        top: 14px;
        right: 14px;
        width: 42px;
        height: 42px;
        border: 0;
        border-radius: 50%;
        background: rgba(8, 29, 54, 0.82);
        color: #ffffff;
        font-size: 1.15rem;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 2;
      }

      .auth-popup-close:hover {
        background: rgba(8, 29, 54, 0.96);
      }

      .auth-popup-frame {
        width: 100%;
        height: 100%;
        border: 0;
        background: #ffffff;
      }

      body.auth-popup-open {
        overflow: hidden;
      }

      @media (max-width: 767.98px) {
        .auth-popup-overlay {
          padding: 10px;
        }

        .auth-popup-dialog {
          height: min(94vh, 920px);
          border-radius: 22px;
        }

        .auth-popup-close {
          top: 10px;
          right: 10px;
          width: 38px;
          height: 38px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function createModal() {
    const overlay = document.createElement("div");
    overlay.className = "auth-popup-overlay";
    overlay.id = "authPopupOverlay";
    overlay.setAttribute("aria-hidden", "true");

    overlay.innerHTML = `
      <div class="auth-popup-dialog" role="dialog" aria-modal="true" aria-label="Sign in or sign up form">
        <button type="button" class="auth-popup-close" aria-label="Close authentication popup">&times;</button>
        <iframe class="auth-popup-frame" title="Authentication form"></iframe>
      </div>
    `;

    document.body.appendChild(overlay);
    return overlay;
  }

  function initPopup() {
    injectStyles();
    const overlay = createModal();
    const frame = overlay.querySelector(".auth-popup-frame");
    const closeButton = overlay.querySelector(".auth-popup-close");

    function openPopup(mode) {
      frame.src = buildAuthUrl(mode);
      overlay.classList.add("is-open");
      overlay.setAttribute("aria-hidden", "false");
      document.body.classList.add("auth-popup-open");
    }

    function closePopup() {
      overlay.classList.remove("is-open");
      overlay.setAttribute("aria-hidden", "true");
      document.body.classList.remove("auth-popup-open");
      window.setTimeout(() => {
        if (!overlay.classList.contains("is-open")) {
          frame.src = "about:blank";
        }
      }, 280);
    }

    document.querySelectorAll(".sign-in").forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        openPopup("signin");
      });
    });

    closeButton.addEventListener("click", closePopup);
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) {
        closePopup();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && overlay.classList.contains("is-open")) {
        closePopup();
      }
    });

  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPopup);
  } else {
    initPopup();
  }
})();
