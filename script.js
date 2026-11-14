const menuToggle = document.querySelector("#menu-toggle");
const siteNav = document.querySelector("#site-nav");

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    menuToggle.setAttribute("aria-label", isExpanded ? "Open navigation" : "Close navigation");
    siteNav.classList.toggle("is-open", !isExpanded);
  });

  siteNav.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
      siteNav.classList.remove("is-open");
    }
  });
}

const projectSlider = document.querySelector(".project-slider");
const projectTrack = document.querySelector(".project-track");
const slides = Array.from(document.querySelectorAll(".project-slide"));
const sliderButtons = Array.from(document.querySelectorAll(".slider-button"));
const sliderDots = Array.from(document.querySelectorAll(".slider-dot"));

if (projectSlider && projectTrack && slides.length) {
  let currentIndex = 0;
  const updateSlider = (index) => {
    currentIndex = (index + slides.length) % slides.length;
    projectTrack.style.transform = `translateX(-${currentIndex * 100}%)`;

    sliderDots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === currentIndex);
    });
  };

  sliderButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const direction = button.dataset.direction === "next" ? 1 : -1;
      updateSlider(currentIndex + direction);
    });
  });

  sliderDots.forEach((dot) => {
    dot.addEventListener("click", () => {
      updateSlider(Number(dot.dataset.index));
    });
  });

  let startX = 0;
  let isDragging = false;

  projectSlider.addEventListener("pointerdown", (event) => {
    startX = event.clientX;
    isDragging = true;
  });

  projectSlider.addEventListener("pointerup", (event) => {
    if (!isDragging) return;
    const distance = event.clientX - startX;
    if (distance < -50) updateSlider(currentIndex + 1);
    if (distance > 50) updateSlider(currentIndex - 1);
    isDragging = false;
  });

  projectSlider.addEventListener("pointerleave", () => {
    isDragging = false;
  });

  if (slides.length === 1) {
    sliderButtons.forEach((button) => {
      button.disabled = true;
      button.style.opacity = "0.4";
      button.style.cursor = "default";
    });
    sliderDots.forEach((dot) => {
      dot.style.display = "none";
    });
  } else {
    updateSlider(0);
  }
}

const currentYearNode = document.querySelector("#current-year");
if (currentYearNode) {
  currentYearNode.textContent = new Date().getFullYear();
}
