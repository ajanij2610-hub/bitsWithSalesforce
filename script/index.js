if (window.AOS) {
  const mobileViewport = window.matchMedia("(max-width: 991.98px)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  AOS.init({
    duration: 850,
    easing: "ease-out-cubic",
    once: false,
    mirror: true,
    disable: function () {
      return mobileViewport.matches || reducedMotion.matches;
    },
  });
}

const heroCarouselEl = document.getElementById("heroCarousel");
if (heroCarouselEl) {
  const heroCarousel = new bootstrap.Carousel(heroCarouselEl, {
    interval: 4500,
    ride: "carousel",
    pause: false,
    wrap: true,
  });
  heroCarousel.cycle();

  heroCarouselEl.addEventListener("slid.bs.carousel", () => {
    if (!window.AOS) return;
    AOS.refresh();
    const activeAosElements = heroCarouselEl.querySelectorAll(".carousel-item.active [data-aos]");
    activeAosElements.forEach((el) => {
      el.classList.remove("aos-animate");
      void el.offsetWidth;
      el.classList.add("aos-animate");
    });
  });
}

const yearEl = document.getElementById("currentYear");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}
