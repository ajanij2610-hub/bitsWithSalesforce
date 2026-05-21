const backToTopBtn = document.getElementById("backToTop");

if (backToTopBtn) {
  const toggleBackToTop = () => {
    if (window.scrollY > 260) {
      backToTopBtn.classList.add("show");
    } else {
      backToTopBtn.classList.remove("show");
    }
  };

  window.addEventListener("scroll", toggleBackToTop, { passive: true });
  toggleBackToTop();

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
