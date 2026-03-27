window.addEventListener("scroll", () => {
  const header = document.querySelector(".header");
  header.classList.toggle("sticky", window.scrollY > 0);
});

const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-links a");

window.onscroll = () => {
  sections.forEach((sec) => {
    let top = window.scrollY;
    let offset = sec.offsetTop - 150;
    let height = sec.offsetHeight;
    let id = sec.getAttribute("id");

    if (top >= offset && top < offset + height) {
      navLinks.forEach((links) => {
        links.classList.remove("active");
        document
          .querySelector(".nav-links a[href*=" + id + "]")
          .classList.add("active");
      });
    }
  });
};

// --- SLIDER PENGUMUMAN ---
const wrapper = document.querySelector(".slider-wrapper");
const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");

let currentIndex = 0;
let isDragging = false;
let startPos = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let animationID = 0;

function nextSlide() {
  currentIndex = (currentIndex + 1) % slides.length;
  updateSlider();
}

let slideInterval = setInterval(nextSlide, 3000);

function updateSlider() {
  currentTranslate = currentIndex * -wrapper.offsetWidth;
  prevTranslate = currentTranslate;
  wrapper.style.transform = `translateX(${currentTranslate}px)`;

  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === currentIndex);
  });
}

wrapper.addEventListener("mousedown", dragStart);
wrapper.addEventListener("touchstart", dragStart);
wrapper.addEventListener("mouseup", dragEnd);
wrapper.addEventListener("touchend", dragEnd);
wrapper.addEventListener("mousemove", dragAction);
wrapper.addEventListener("touchmove", dragAction);

function dragStart(e) {
  clearInterval(slideInterval);
  isDragging = true;
  startPos = getPositionX(e);
  animationID = requestAnimationFrame(animation);
}

function dragAction(e) {
  if (isDragging) {
    const currentPosition = getPositionX(e);
    currentTranslate = prevTranslate + currentPosition - startPos;
  }
}

function dragEnd() {
  isDragging = false;
  cancelAnimationFrame(animationID);
  const movedBy = currentTranslate - prevTranslate;

  if (movedBy < -100 && currentIndex < slides.length - 1) currentIndex += 1;
  if (movedBy > 100 && currentIndex > 0) currentIndex -= 1;

  updateSlider();
  slideInterval = setInterval(nextSlide, 3000);
}

function getPositionX(e) {
  return e.type.includes("mouse") ? e.pageX : e.touches[0].clientX;
}

function animation() {
  if (isDragging) {
    wrapper.style.transform = `translateX(${currentTranslate}px)`;
    requestAnimationFrame(animation);
  }
}

window.addEventListener("resize", updateSlider);

// --- PERBAIKAN INFINITE AUTO SCROLL & DRAG PRODUK ---
const pWrapper = document.getElementById("productWrapper");
pWrapper.innerHTML += pWrapper.innerHTML; 

let pCurrentPos = 0;
let pSpeed = 0.8; 
let isDraggingProduct = false;
let pStartX, pScrollLeft;

function animateProducts() {
  if (!isDraggingProduct) {
    pCurrentPos -= pSpeed;

    if (Math.abs(pCurrentPos) >= pWrapper.scrollWidth / 2) {
      pCurrentPos = 0;
    }
    pWrapper.style.transform = `translateX(${pCurrentPos}px)`;
  }
  requestAnimationFrame(animateProducts);
}

animateProducts();

const startDraggingProduct = (e) => {
  isDraggingProduct = true;
  pWrapper.style.transition = "none";
  pStartX = (e.pageX || e.touches[0].pageX) - pWrapper.offsetLeft;
  pScrollLeft = pCurrentPos;
  pWrapper.style.cursor = "grabbing";
};

const moveDraggingProduct = (e) => {
  if (!isDraggingProduct) return;
  
  const x = (e.pageX || e.touches[0].pageX) - pWrapper.offsetLeft;
  const walk = x - pStartX;
  pCurrentPos = pScrollLeft + walk;

  const halfWidth = pWrapper.scrollWidth / 2;
  if (pCurrentPos > 0) {
    pCurrentPos = -halfWidth;
    pScrollLeft = pCurrentPos;
    pStartX = x; 
  } else if (Math.abs(pCurrentPos) >= halfWidth) {
    pCurrentPos = 0;
    pScrollLeft = pCurrentPos;
    pStartX = x;
  }

  pWrapper.style.transform = `translateX(${pCurrentPos}px)`;
};

const stopDraggingProduct = () => {
  isDraggingProduct = false;
  pWrapper.style.cursor = "grab";
};

pWrapper.addEventListener("mousedown", startDraggingProduct);
pWrapper.addEventListener("touchstart", startDraggingProduct, { passive: true });

window.addEventListener("mousemove", moveDraggingProduct);
window.addEventListener("touchmove", moveDraggingProduct, { passive: false });

window.addEventListener("mouseup", stopDraggingProduct);
window.addEventListener("touchend", stopDraggingProduct);

// --- NAVIGASI PRODUK ---
const productNavBtns = document.querySelectorAll(".prod-link");

productNavBtns.forEach((btn) => {
  btn.addEventListener("click", function () {
    productNavBtns.forEach((nav) => nav.classList.remove("active"));
    this.classList.add("active");
  });
});

// --- MENU MOBILE ---
const menuIcon = document.querySelector(".menu-icon");
const navLinksContainer = document.querySelector(".nav-links");

menuIcon.addEventListener("click", () => {
  navLinksContainer.classList.toggle("active");

  const icon = menuIcon.querySelector("i");
  if (navLinksContainer.classList.contains("active")) {
    icon.classList.replace("bx-menu", "bx-x");
  } else {
    icon.classList.replace("bx-x", "bx-menu");
  }
});

const links = document.querySelectorAll(".nav-links a");
links.forEach((link) => {
  link.addEventListener("click", () => {
    navLinksContainer.classList.remove("active");
    menuIcon.querySelector("i").classList.replace("bx-x", "bx-menu");
  });
});

// --- DARK MODE THEME ---
const themeToggle = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme');

if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
}

themeToggle.addEventListener('click', () => {
    let theme = document.documentElement.getAttribute('data-theme');
    
    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    }
});