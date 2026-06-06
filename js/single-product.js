const tabs = document.querySelectorAll('.tab-title');
const contents = document.querySelectorAll('.tab-content');
const moreNoteBtn = document.querySelector(".more-note");
const noteParagraph = document.querySelector(".note-paragraph");
const singleProductContainer = document.querySelector(".single-product-container");
const popup = document.querySelector('.product-popup');
const hideModalBtn = document.querySelector(".close-product-popup");
const overlay = document.querySelector('.popup-overlay');
const titlePopupProduct = document.querySelector(".title-popup-product");
const imageProductPopup = document.querySelector(".image-product-popup");
const toast = document.querySelector(".toast-like");
const toastText = document.querySelector(".toast-text");
const toastProgress = document.querySelector(".progress");
const countDisplay = document.getElementById("countDisplay");
const otherProductConatiner = document.querySelector(".product-conatiner");

let count = 1;
let noteBtn = false;
let isLiked = false;

/* Fetching Data  */
document.addEventListener("DOMContentLoaded", async () => {
    if (!singleProductContainer) return;

    try {
        const response = await fetch("data.json");
        const products = await response.json();

        const params = new URLSearchParams(window.location.search);
        const productId = params.get("id");

        if (!productId) {
            singleProductContainer.innerHTML = "<p>محصولی انتخاب نشده است.</p>";
            return;
        }

        const product = products.find((item) => String(item.id) === String(productId));

        if (!product) {
            singleProductContainer.innerHTML = "<p>محصول مورد نظر پیدا نشد.</p>";
            return;
        }

        const sameCategoryProducts = products.filter(
            (item) => item.categorypersian === product.categorypersian && String(item.id) !== String(productId)
        );

        const relatedProducts = sameCategoryProducts.slice(0,4)

        singleProductContainer.insertAdjacentHTML("beforeend",
            `
            <div class="images-single-product">
                <div class="main-image-single-product">
                    <img src="${product.image}" alt="${product.title}">
                </div>
                <div class="other-image-single-product-container">
                    ${product.gallery.slice(0, 5).map((img, index) => `
                        <div>
                            <img class="other-images-single-product ${index === 0 ? "active-single-product-image" : ""}"
                                 src="${img}" alt="${product.title}">
                        </div>
                    `).join("") || ""}
                    ${product.gallery.length > 5 ? `
                <div class="more-image-single-product">
                    <svg><use href="#gallery"></use></svg>
                    <p>${product.gallery?.length > 5 ? `${product.gallery.length - 5}+ تصویر بیشتر` : ""}</p>
                </div>
                `
                : ""}
                </div>
            </div>

            <div class="features-container">
                <h1 class="title-single-product">${product.title}</h1>
                <h3 class="category-single-product">${product.categorypersian}</h3>
                ${product.discountPercent > 0 ?
                `
                <h2 class="price-single-product">${(product.price - (product.price / 100) * product.discountPercent).toLocaleString()} تومان</h2>
                
                <div class="discount-container">
                    <h4 class="main-price-single-product">${product.price.toLocaleString()} تومان</h4>
                    <div class="discount">${product.discountPercent}%</div>
                </div>
                `
                :
                `
                <h2 class="price-single-product">${product.price.toLocaleString()} تومان</h2>
                `
            }
                <div class="size">
                    <h4 class="size-title">سایز</h4>
                    <div class="size-box-container">
                        ${product.sizes?.map((size, index) => `
                            <div class="size-box ${index === 0 ? "active-size" : ""}">${size}</div>
                        `).join("") || ""}
                    </div>
                </div>

                <div class="color">
                    <h4 class="color-title">رنگ</h4>
                    <div class="color-box-container">
                        ${product.colors?.map((color, index) => `
                            <div class="color-box ${index === 0 ? "active-color-custom" : ""}">
                                <div class="color-custom" style="background-color: ${color}"></div>
                                <h3>${color}</h3>
                            </div>
                        `).join("") || ""}
                    </div>
                </div>

                <div class="add-to-basket-container">
                    <div class="count-share-container">
                        <div class="count">
                            <div class="plus" onclick="addProduct()"><svg><use href="#add"></use></svg></div>
                            <div class="count-number" id="countDisplay">1</div>
                            <div class="minus" onclick="removeProduct()"><svg><use href="#minus"></use></svg></div>
                        </div>
                        <div class="like-share-btn-mobile">
                            <svg class="share"><use href="#share"></use></svg>
                            <svg class="like"><use href="#like"></use></svg>
                        </div>
                    </div>
                    <a href="#" class="add-to-basket-btn" onclick="showModal(event, '${product.title}', '${product.image}', ${product.discountPercent > 0 ? (product.price - (product.price / 100) * product.discountPercent) : product.price})">
                        <svg><use href="#shopping-cart"></use></svg>
                        افزودن به سبد خرید
                    </a>
                    <div class="like-share-btn">
                        <svg class="share"><use href="#share"></use></svg>
                        <svg class="like" onclick="showToast()">
                           <use class="use-like" href="#like"></use>
                        </svg>
                    </div>
                </div>

                <div class="star-grade">
                    <svg><use href="#star"></use></svg>
                    <h4 class="grade">3.5</h4>
                </div>
            </div>
        `
        )

        if (relatedProducts.length > 0) {
            relatedProducts.forEach((relatedItem) => {
                const colorBox = relatedItem.colors?.map(color =>
                    `<div class="color" style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; display: inline-block;"></div>`
                ).join("") || "";

                otherProductConatiner.insertAdjacentHTML("beforeend",
                    `
                    <div class="product">
                        <div class="image-product">
                            <img src="${relatedItem.image}" alt="">
                            <div class="label">
                               ${relatedItem.vip ? '<span class="vip">vip</span>' : ""}
                               ${relatedItem.discountPercent > 0 ? `<span class="sale">${relatedItem.discountPercent}%</span>` : ""}
                            </div>
                        </div>
                        <div class="titles-product">
                            <h3 class="title-product">
                               <a href="single-product.html?id=${relatedItem.id}">${relatedItem.title}</a>
                            </h3>
                            <div class="product-price-container">
                            ${relatedItem.discountPercent > 0 ?
                        `<h3 class="main-price">${(relatedItem.price - (relatedItem.price / 100) * relatedItem.discountPercent).toLocaleString()} تومان</h3><h3 class="price">${relatedItem.price.toLocaleString()} تومان</h3>`
                        : `<h3 class="main-price">${relatedItem.price.toLocaleString()} تومان</h3>`}
                            </div>
                            <span class="size">از سایز L تا XXL</span>
                            <div class="colors">
                                ${colorBox}
                            </div>
                        </div >
                    </div >
                    `
                );
            });
        } else {
            otherProductConatiner.insertAdjacentHTML("beforebegin",
                `<p class="no-related-products">محصول دیگری در این دسته‌بندی موجود نیست.</p>`
            );
        }

        initProductEvents();

    } catch (error) {
        console.error("خطا در بارگذاری صفحه محصول:", error);
        singleProductContainer.innerHTML = "<p>خطایی در بارگذاری اطلاعات رخ داد.</p>";
    }
});

function initProductEvents() {
    const mainImage = document.querySelector(".main-image-single-product img");
    const thumbnails = document.querySelectorAll(".other-images-single-product");

    thumbnails.forEach((thumb) => {
        thumb.addEventListener("click", () => {
            thumbnails.forEach((img) => img.classList.remove("active-single-product-image"));
            thumb.classList.add("active-single-product-image");
            mainImage.src = thumb.src;
        });
    });

    document.querySelectorAll(".size-box").forEach((box) => {
        box.addEventListener("click", () => {
            document.querySelectorAll(".size-box").forEach((b) => b.classList.remove("active-size"));
            box.classList.add("active-size");
        });
    });

    document.querySelectorAll(".color-box").forEach((box) => {
        box.addEventListener("click", () => {
            document.querySelectorAll(".color-box").forEach((b) => b.classList.remove("active-color-custom"));
            box.classList.add("active-color-custom");
        });
    });
}

/* Tabs */
if (tabs) {
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            const targetId = tab.getAttribute('data-target');
            const targetElement = document.getElementById(targetId);
            if (targetElement) targetElement.classList.add('active');
        });
    });
}

/* More Note */
if (moreNoteBtn) {
    moreNoteBtn.addEventListener("click", function () {
        if (noteBtn) {
            noteParagraph.classList.remove("note-paragraph-active");
            noteBtn = false;
        } else {
            noteParagraph.classList.add("note-paragraph-active");
            noteBtn = true;
        }
    });
}

/* Add Product */
window.addProduct = () => {
    count++;
    if (countDisplay) {
        countDisplay.textContent = count;
    } else {
        // اگر countDisplay پیدا نشد، دوباره سعی کن پیدا کنی
        const elem = document.getElementById("countDisplay");
        if (elem) elem.textContent = count;
    }
    console.log("تعداد جدید:", count); // برای دیباگ
};

/* Remove Product */
window.removeProduct = () => {
    if (count > 1) {
        count--;
        if (countDisplay) {
            countDisplay.textContent = count;
        } else {
            const elem = document.getElementById("countDisplay");
            if (elem) elem.textContent = count;
        }
        console.log("تعداد جدید:", count);
    }
};

/* Show Popup */
window.showModal = (event, title, img) => {
    event.preventDefault();

    // دریافت تعداد
    const quantity = parseInt(document.getElementById("countDisplay")?.innerText || "1");

    const activeColorCustom = document.querySelector(".active-color-custom>h3");
    const colorPopupProduct = document.querySelector(".color-popup-product");
    const titleColorPopupProduct = document.querySelector(".title-color-popup-product");

    if (!activeColorCustom || !colorPopupProduct || !titleColorPopupProduct) {
        console.error("عناصر مورد نیاز پیدا نشدند!");
        return;
    }

    const colorSelected = activeColorCustom.textContent;

    const activeColorElement = document.querySelector(".active-color-custom .color-custom");
    let colorCode = "#000000";
    if (activeColorElement) {
        const bgColor = window.getComputedStyle(activeColorElement).backgroundColor;
        colorCode = bgColor;
    }

    titleColorPopupProduct.textContent = colorSelected;
    colorPopupProduct.style.backgroundColor = colorSelected;

    popup.classList.add('active');
    titlePopupProduct.innerHTML = title;
    imageProductPopup.src = img;

    // دریافت قیمت
    let productPrice = 0;
    const priceElement = document.querySelector(".price-single-product");
    if (priceElement) {
        let priceText = priceElement.innerText;
        priceText = priceText.replace("تومان", "").replace(/,/g, "").trim();
        productPrice = parseInt(priceText);
    }

    // دریافت دسته‌بندی محصول
    const categoryElement = document.querySelector(".category-single-product");
    let category = "";
    if (categoryElement) {
        category = categoryElement.innerText;
    }

    // دریافت درصد تخفیف (از المنت discount)
    let discount = 0;
    const discountElement = document.querySelector(".discount");
    if (discountElement) {
        let discountText = discountElement.innerText;
        discountText = discountText.replace("%", "").trim();
        discount = parseInt(discountText) || 0;
    }

    // دریافت سایز انتخاب شده
    const activeSize = document.querySelector(".size-box.active-size");
    let selectedSize = "سایز استاندارد";
    if (activeSize) {
        selectedSize = activeSize.innerText;
    }

    // افزودن به مینی کارت
    if (window.addProductToMinicart) {
        window.addProductToMinicart({
            title: title,
            categorypersian: category,
            image: img,
            price: productPrice,
            quantity: quantity,
            colorName: colorSelected,
            colorCode: colorCode,
            discountPercent: discount,
            size: selectedSize
        });
    }
};

/* Hide Popup */
const hideModal = () => {
    if (popup) popup.classList.remove('active');
};

/* Show Toast */
const showToast = () => {
    const useElement = document.querySelector(".use-like");
    let progressSteps = 0;

    if (toast) toast.classList.add("active");

    if (!isLiked) {
        if (toastText) toastText.innerHTML = "محصول به علاقه مندی ها پیوست";
        if (toastProgress) toastProgress.style.backgroundColor = "rgba(102, 187, 106, 1)";
        if (useElement) useElement.setAttribute("href", "#heart-bold");
        isLiked = true;
    } else {
        if (toastText) toastText.innerHTML = "محصول از علاقه مندی ها حذف شد";
        if (toastProgress) toastProgress.style.backgroundColor = "rgba(229, 57, 53, 1)";
        if (useElement) useElement.setAttribute("href", "#like");
        isLiked = false;
    }

    const progressInterval = setInterval(function () {
        progressSteps++;

        if (progressSteps > 110) {
            if (toastProgress) toastProgress.style.width = `0%`;
            if (toast) toast.classList.remove("active");
            clearInterval(progressInterval);
        } else {
            if (toastProgress) toastProgress.style.width = `${progressSteps}%`;
        }
    }, 30);
};

if (hideModalBtn) hideModalBtn.addEventListener("click", hideModal);
if (overlay) overlay.addEventListener('click', hideModal);
window.addEventListener("keyup", (event) => {
    if (event.key === "Escape") {
        hideModal();
    }
});