const closeNavBtn = document.querySelector(".close-nav-btn");
const nav = document.querySelector(".nav-container");
const openNavBtn = document.querySelector(".open-nav-btn");
const overlay = document.querySelector(".overlay");

let navOpen = false;
openNavBtn.addEventListener("click", function () {
    if (navOpen) {
        nav.classList.remove("nav-open");
        navOpen = false
    } else {
        nav.classList.add("nav-open");
        overlay.classList.add("overlay-open");
        navOpen = true
    }
})

closeNavBtn.addEventListener("click", function () {
    nav.classList.remove("nav-open");
    overlay.classList.remove("overlay-open");
})
