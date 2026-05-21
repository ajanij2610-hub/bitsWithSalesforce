const contactForm = document.getElementById("contactForm");
const newsletterForm = document.getElementById("newsletterForm");
const currentYearEl = document.getElementById("currentYear");
const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const nameRegex = /^[A-Za-z][A-Za-z .'-]*$/;
const successReloadDelayMs = 5000;

if (window.AOS) {
  AOS.init({
    duration: 850,
    easing: "ease-out-cubic",
    once: false,
    mirror: true,
  });
}

if (currentYearEl) {
  currentYearEl.textContent = new Date().getFullYear();
}

if (contactForm) {
  const emailField = document.getElementById("email");
  const nameField = document.getElementById("name");
  const messageField = document.getElementById("message");
  const statusEl = document.getElementById("formStatus");
  const fields = [emailField, nameField, messageField].filter(Boolean);
  let contactMessageTimer = null;

  function labelText(field) {
    return field?.labels?.[0]?.textContent?.trim() || "This field";
  }

  function fieldErrorEl(field) {
    return document.getElementById(`${field.id}Error`);
  }

  function clearStatus() {
    if (!statusEl) return;
    statusEl.textContent = "";
    statusEl.classList.remove("error", "success");
  }

  function clearContactValidationMessages() {
    fields.forEach((field) => {
      setFieldState(field, "");
    });
  }

  function cancelContactMessageTimer() {
    if (!contactMessageTimer) return;
    clearTimeout(contactMessageTimer);
    contactMessageTimer = null;
  }

  function scheduleContactMessageCleanup(shouldReload = false) {
    cancelContactMessageTimer();
    contactMessageTimer = setTimeout(() => {
      clearStatus();
      clearContactValidationMessages();
      if (shouldReload) {
        window.location.reload();
      }
      contactMessageTimer = null;
    }, successReloadDelayMs);
  }

  function setFieldState(field, errorMessage) {
    const errorEl = fieldErrorEl(field);
    if (errorMessage) {
      field.classList.add("is-invalid");
      field.setAttribute("aria-invalid", "true");
      if (errorEl) errorEl.textContent = errorMessage;
      return false;
    }

    field.classList.remove("is-invalid");
    field.removeAttribute("aria-invalid");
    if (errorEl) errorEl.textContent = "";
    return true;
  }

  function validateField(field) {
    const value = field.value.trim();
    const label = labelText(field);

    if (!value) {
      return setFieldState(field, `${label} is required.`);
    }

    if (field.id === "email" && !emailRegex.test(value)) {
      return setFieldState(field, "Enter a valid email address (for example: name@gmail.com).");
    }

    if (field.id === "name" && !nameRegex.test(value)) {
      return setFieldState(field, "Name should not include numbers.");
    }

    return setFieldState(field, "");
  }

  fields.forEach((field) => {
    field.addEventListener("blur", () => {
      validateField(field);
    });

    field.addEventListener("input", () => {
      cancelContactMessageTimer();
      if (field.classList.contains("is-invalid")) {
        validateField(field);
      }
      clearStatus();
    });
  });

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    let isFormValid = true;
    fields.forEach((field) => {
      if (!validateField(field)) {
        isFormValid = false;
      }
    });

    if (!statusEl) return;

    if (!isFormValid) {
      cancelContactMessageTimer();
      statusEl.textContent = "Please enter valid details in all required fields.";
      statusEl.classList.remove("success");
      statusEl.classList.add("error");
      scheduleContactMessageCleanup(false);

      const firstInvalid = contactForm.querySelector(".is-invalid");
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    statusEl.textContent = "Thank you! Your message was sent successfully.";
    statusEl.classList.remove("error");
    statusEl.classList.add("success");
    contactForm.reset();
    scheduleContactMessageCleanup(true);
  });
}

if (newsletterForm) {
  const newsletterEmailField = document.getElementById("newsletterEmail");
  const newsletterErrorEl = document.getElementById("newsletterEmailError");
  const newsletterStatusEl = document.getElementById("newsletterStatus");
  let newsletterMessageTimer = null;

  function clearNewsletterStatus() {
    if (!newsletterStatusEl) return;
    newsletterStatusEl.textContent = "";
    newsletterStatusEl.classList.remove("error", "success");
  }

  function cancelNewsletterMessageTimer() {
    if (!newsletterMessageTimer) return;
    clearTimeout(newsletterMessageTimer);
    newsletterMessageTimer = null;
  }

  function scheduleNewsletterMessageCleanup(shouldReload = false) {
    cancelNewsletterMessageTimer();
    newsletterMessageTimer = setTimeout(() => {
      clearNewsletterStatus();
      setNewsletterError("");
      if (shouldReload) {
        window.location.reload();
      }
      newsletterMessageTimer = null;
    }, successReloadDelayMs);
  }

  function setNewsletterError(message) {
    if (!newsletterEmailField) return false;

    if (message) {
      newsletterEmailField.classList.add("is-invalid");
      newsletterEmailField.setAttribute("aria-invalid", "true");
      if (newsletterErrorEl) newsletterErrorEl.textContent = message;
      return false;
    }

    newsletterEmailField.classList.remove("is-invalid");
    newsletterEmailField.removeAttribute("aria-invalid");
    if (newsletterErrorEl) newsletterErrorEl.textContent = "";
    return true;
  }

  function validateNewsletterEmail() {
    if (!newsletterEmailField) return false;

    const value = newsletterEmailField.value.trim();
    if (!value) {
      return setNewsletterError("Email is required.");
    }

    if (!emailRegex.test(value)) {
      return setNewsletterError("Enter a valid email address (for example: name@gmail.com).");
    }

    return setNewsletterError("");
  }

  if (newsletterEmailField) {
    newsletterEmailField.addEventListener("blur", () => {
      validateNewsletterEmail();
    });

    newsletterEmailField.addEventListener("input", () => {
      cancelNewsletterMessageTimer();
      if (newsletterEmailField.classList.contains("is-invalid")) {
        validateNewsletterEmail();
      }
      clearNewsletterStatus();
    });
  }

  newsletterForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const isValid = validateNewsletterEmail();

    if (!newsletterStatusEl) return;

    if (!isValid) {
      cancelNewsletterMessageTimer();
      newsletterStatusEl.textContent = "Please enter a valid newsletter email.";
      newsletterStatusEl.classList.remove("success");
      newsletterStatusEl.classList.add("error");
      scheduleNewsletterMessageCleanup(false);
      if (newsletterEmailField) newsletterEmailField.focus();
      return;
    }

    newsletterStatusEl.textContent = "Success! You are subscribed to the newsletter.";
    newsletterStatusEl.classList.remove("error");
    newsletterStatusEl.classList.add("success");
    newsletterForm.reset();
    scheduleNewsletterMessageCleanup(true);
  });
}
