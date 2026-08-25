import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

const menuToggle = document.querySelector("#menu-toggle");
const navigation = document.querySelector("#site-nav");
const themeToggle = document.querySelector("#theme-toggle");
const savedTheme = localStorage.getItem("portfolio-theme");
if (savedTheme === "dark") document.documentElement.dataset.theme = "dark";

function updateThemeButton() {
  const darkMode = document.documentElement.dataset.theme === "dark";
  themeToggle.textContent = darkMode ? "☀" : "☾";
  themeToggle.setAttribute(
    "aria-label",
    darkMode ? "Switch to light mode" : "Switch to dark mode",
  );
}
updateThemeButton();
themeToggle.addEventListener("click", () => {
  const darkMode = document.documentElement.dataset.theme === "dark";
  document.documentElement.dataset.theme = darkMode ? "light" : "dark";
  localStorage.setItem("portfolio-theme", darkMode ? "light" : "dark");
  updateThemeButton();
});

menuToggle.addEventListener("click", () => {
  const isOpen = navigation.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});
navigation.addEventListener("click", (event) => {
  if (event.target.tagName === "A") navigation.classList.remove("open");
});
document.querySelector("#year").textContent = new Date().getFullYear();
const typedFirst = document.querySelector("#typed-first");
const typedLast = document.querySelector("#typed-last");
const nameParts = [
  { element: typedFirst, text: "Joemar" },
  { element: typedLast, text: "Resmondo." },
];
let typedPart = 0;
let typedCharacter = 0;
let typingForward = true;
function typeName() {
  const currentPart = nameParts[typedPart];
  currentPart.element.textContent = currentPart.text.slice(0, typedCharacter);
  if (typingForward && typedCharacter < currentPart.text.length) {
    typedCharacter += 1;
    setTimeout(typeName, 115);
  } else if (typingForward && typedPart < nameParts.length - 1) {
    typedPart += 1;
    typedCharacter = 0;
    setTimeout(typeName, 260);
  } else if (typingForward) {
    typingForward = false;
    setTimeout(typeName, 1500);
  } else if (typedCharacter > 0) {
    typedCharacter -= 1;
    setTimeout(typeName, 75);
  } else if (typedPart > 0) {
    typedPart -= 1;
    typedCharacter = nameParts[typedPart].text.length;
    setTimeout(typeName, 260);
  } else {
    typingForward = true;
    setTimeout(typeName, 700);
  }
}
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  nameParts.forEach((part) => {
    part.element.textContent = part.text;
  });
} else {
  typeName();
}
const revealItems = document.querySelectorAll(".scroll-reveal");
const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 },
);
revealItems.forEach((item) => revealObserver.observe(item));
const pageLoader = document.querySelector("#page-loader");
const loaderProgress = document.querySelector("#loader-progress");
const loaderPercent = document.querySelector("#loader-percent");
const payModal = document.querySelector("#pay-modal");
const payButton = document.querySelector("#pay-button");
const paymentModal = document.querySelector("#payment-modal");
const continueButton = document.querySelector("#continue-button");
const cardNumberInput = document.querySelector("#card-number");
payButton.addEventListener("click", () => {
  payModal.classList.add("is-hidden");
  paymentModal.classList.remove("is-hidden");
});
continueButton.addEventListener("click", () => {
  if (!cardNumberInput.value.trim()) {
    cardNumberInput.classList.add("is-invalid");
    cardNumberInput.focus();
    return;
  }
  cardNumberInput.classList.remove("is-invalid");
  paymentModal.classList.add("is-hidden");
  finishLoading();
});
cardNumberInput.addEventListener("input", () => {
  cardNumberInput.classList.remove("is-invalid");
});
let loadingComplete = false;
let progress = 0;
const progressTimer = setInterval(() => {
  progress = Math.min(progress + Math.ceil((92 - progress) * 0.08), 92);
  loaderProgress.style.width = `${progress}%`;
  loaderPercent.textContent = `${progress}%`;
}, 70);
function finishLoading() {
  if (loadingComplete) return;
  loadingComplete = true;
  clearInterval(progressTimer);
  loaderProgress.style.width = "100%";
  loaderPercent.textContent = "100%";
  setTimeout(() => {
    pageLoader.classList.add("is-hidden");
    document.body.classList.remove("is-loading");
  }, 450);
}
window.addEventListener("load", () => setTimeout(finishLoading, 650), {
  once: true,
});
setTimeout(finishLoading, 3500);
const siteHeader = document.querySelector(".site-header");
const tiltItems = document.querySelectorAll(".project-visual, .skill-card");
const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
if (!reducedMotion && window.matchMedia("(pointer: fine)").matches) {
  siteHeader.addEventListener("pointermove", (event) => {
    const bounds = siteHeader.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    siteHeader.style.transform = `perspective(900px) rotateX(${y * -2}deg) rotateY(${x * 3}deg) translateZ(4px)`;
  });
  siteHeader.addEventListener("pointerleave", () => {
    siteHeader.style.transform = "";
  });
  tiltItems.forEach((item) => {
    item.addEventListener("pointermove", (event) => {
      const bounds = item.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      item.style.transform = `perspective(900px) rotateX(${y * -8}deg) rotateY(${x * 8}deg) translateZ(8px)`;
    });
    item.addEventListener("pointerleave", () => {
      item.style.transform = "";
    });
  });
}

const sceneHost = document.querySelector("#hero-scene");
const canvas = document.querySelector("#scene-canvas");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha: true,
  antialias: true,
});
const group = new THREE.Group();
const pointer = new THREE.Vector2();
const targetRotation = new THREE.Vector2();
const sceneReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

camera.position.z = 8;
scene.add(group);
const shell = new THREE.Mesh(
  new THREE.IcosahedronGeometry(1.75, 2),
  new THREE.MeshBasicMaterial({
    color: 0xd7f35d,
    wireframe: true,
    transparent: true,
    opacity: 0.72,
  }),
);
const core = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.82, 0.16, 128, 18),
  new THREE.MeshBasicMaterial({
    color: 0x36526d,
    wireframe: true,
    transparent: true,
    opacity: 0.8,
  }),
);
const orbit = new THREE.Mesh(
  new THREE.TorusGeometry(2.35, 0.012, 8, 96),
  new THREE.MeshBasicMaterial({
    color: 0x1a1b19,
    transparent: true,
    opacity: 0.35,
  }),
);
group.add(shell, core, orbit);
group.position.set(2.4, 0.15, 0);

function resizeScene() {
  const { width, height } = sceneHost.getBoundingClientRect();
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
  renderer.setSize(width, height, false);
  if (window.innerWidth < 700) group.position.set(1.35, -0.15, 0);
  else group.position.set(2.4, 0.15, 0);
}

function moveScene(event) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
  targetRotation.y = pointer.x * 0.35;
  targetRotation.x = pointer.y * 0.2;
}

function animate() {
  requestAnimationFrame(animate);
  if (!sceneReducedMotion) {
    shell.rotation.y += 0.0025;
    core.rotation.x -= 0.004;
    core.rotation.z += 0.002;
    orbit.rotation.z += 0.003;
  }
  group.rotation.y += (targetRotation.y - group.rotation.y) * 0.03;
  group.rotation.x += (targetRotation.x - group.rotation.x) * 0.03;
  renderer.render(scene, camera);
}

resizeScene();
window.addEventListener("resize", resizeScene);
window.addEventListener("pointermove", moveScene, { passive: true });
animate();
