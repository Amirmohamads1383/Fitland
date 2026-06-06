const cartContainer = document.querySelector(".basket-product-container");
const discountInputElem = document.querySelector(".discount-input");
const discountBtnElem = document.querySelector(".discount-btn");

const discountCodes = [
    { code: "123456", percent: 10 },
    { code: "789012", percent: 15 },
    { code: "345678", percent: 20 },
    { code: "901234", percent: 5 },
    { code: "567890", percent: 25 }
];

let appliedDiscount = 0;

// Get Data From LocalStorage
const getDataFromLocalStorage = () => {
    const data = JSON.parse(localStorage.getItem("shoppingCart") || "[]");
    data.forEach(product => {
        createProductTemplate(product);
    });
    updateTotalPrice();
}

const calculateDiscountedPrice = (unitPrice, discountPercent) => {
    if (discountPercent && discountPercent > 0) {
        return unitPrice - (unitPrice * discountPercent / 100);
    }
    return unitPrice;
}

const createProductTemplate = (product) => {
    // قیمت نهایی همان totalPrice تقسیم بر تعداد است
    const finalPrice = product.totalPrice / product.quantity;
    const hasDiscount = product.discountPercent && product.discountPercent > 0;

    cartContainer.insertAdjacentHTML("beforeend",
        `
        <div class="product" data-product-id="${product.id || Date.now()}" data-product-title="${product.title}" data-product-color="${product.colorName}">
            <div class="image-product">
                <img src="${product.image}" alt="${product.title}">
            </div>
            <div class="product-info">
                <div class="product-title-container">
                    <h2 class="product-title">${product.title}</h2>
                </div>
                <div class="product-categories-container">
                    <h3 class="product-categories">${product.categorypersian || "دسته‌بندی نشده"}</h3>
                </div>
                <div class="product-price-container">
                    <h4 class="product-price">${finalPrice.toLocaleString()} تومان</h4>
                </div>
                ${hasDiscount ? `
                <div class="product-price-discount-container">
                    <h4 class="product-price-discount">${(product.totalPrice / product.quantity * (100 / (100 - product.discountPercent))).toLocaleString()} تومان</h4>
                </div>
                <div class="product-discount-container">
                    <h3 class="product-discount">٪${product.discountPercent}</h3>
                </div>
                ` : ''}
                <div class="product-size-container">
                    <svg><use href="#size"></use></svg>
                    <span class="product-size">${product.size || "سایز استاندارد"}</span>
                </div>
                <div class="product-color-container">
                    <svg><use href="#colorfilter"></use></svg>
                    <div class="color-product-user" style="background : ${product.colorCode}"></div>
                    <span class="color-title">${product.colorName}</span>
                </div>
                <div class="product-cancelled-container" onclick="removeProduct('${product.title}', '${product.colorName}')">
                    <svg><use href="#close-square"></use></svg>
                </div>
                <div class="plus-minus-container">
                    <div class="plus" onclick="plusCountProduct('${product.title}', '${product.colorName}')">
                        <svg><use href="#add"></use></svg>
                    </div>
                    <div class="count-number" id="count-${product.title.replace(/\s/g, '')}-${product.colorName.replace(/\s/g, '')}">${product.quantity}</div>
                    <div class="minus" onclick="removeCountProduct('${product.title}', '${product.colorName}')">
                        <svg><use href="#minus"></use></svg>
                    </div>
                </div>
            </div>
        </div>
        `
    );
}

const updateTotalPrice = () => {
    const priceSent = document.querySelector(".price-sent>h2");
    const profitContainer = document.querySelector(".profit-container");
    const profitPrice = document.querySelector(".profit-price>h2");
    const cartItems = JSON.parse(localStorage.getItem("shoppingCart") || "[]");

    let totalPrice = cartItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0);

    // محاسبه سود از تخفیف محصولات
    let productProfit = 0;
    cartItems.forEach(item => {
        const originalTotal = item.unitPrice * item.quantity;
        const finalTotal = item.totalPrice;
        productProfit += (originalTotal - finalTotal);
    });

    // اعمال تخفیف کد روی جمع کل
    const discountAmount = (totalPrice * appliedDiscount) / 100;
    const discountedTotalPrice = totalPrice - discountAmount;
    const totalProfit = productProfit + discountAmount;

    // نمایش جمع کل بدون تخفیف کد
    const totalPriceContainer = document.querySelector(".total-price>h2");
    if (totalPriceContainer) {
        totalPriceContainer.innerHTML = `${totalPrice.toLocaleString()}`;
    }

    // نمایش سود
    if (profitPrice) {
        profitPrice.innerHTML = `${totalProfit.toLocaleString()}`;
    }

    if (profitContainer) {
        profitContainer.style.display = totalProfit > 0 ? "flex" : "none";
    }

    // هزینه ارسال
    const shippingCost = 50000;
    if (priceSent) {
        priceSent.innerHTML = shippingCost.toLocaleString();
    }

    // قیمت نهایی قابل پرداخت (با اعمال تخفیف کد)
    const finalTotalPrice = discountedTotalPrice + shippingCost;
    const mainTotalPriceElem = document.querySelector(".final-price>h2");
    if (mainTotalPriceElem) {
        mainTotalPriceElem.innerHTML = `${finalTotalPrice.toLocaleString()}`;
    }
}

// اعمال کد تخفیف
const applyDiscountCode = (event) => {

event.preventDefault();

    const discountMessage = document.querySelector(".discount-message p");
    console.log(discountMessage);
    
    const code = discountInputElem?.value.trim();

    if (!code) {
        discountMessage.innerHTML = "یک کد تخفیف وارد کنید !";
        discountMessage.style.display = "block";
        return;
    }

    const foundCode = discountCodes.find(dc => dc.code === code);

    if (foundCode) {
        appliedDiscount = foundCode.percent;
        updateTotalPrice();
        discountMessage.innerHTML = "کد تخفیف صحیح می باشد";
        discountMessage.style.display = "block";
        discountMessage.style.color = "rgba(102, 187, 106, 1)";
        if (discountInputElem) discountInputElem.value = "";
    } else {
        discountMessage.style.display = "block";
        discountMessage.innerHTML = "کد تخفیف وارد شده صحیح نمی باشد";
    }
}

// رویداد دکمه تخفیف
if (discountBtnElem) {
    discountBtnElem.addEventListener("click", applyDiscountCode);
}

window.removeProduct = (title, colorName) => {
    let cartItems = JSON.parse(localStorage.getItem("shoppingCart") || "[]");
    cartItems = cartItems.filter(item => !(item.title === title && item.colorName === colorName));
    localStorage.setItem("shoppingCart", JSON.stringify(cartItems));

    if (window.minicart) {
        window.minicart.cartItems = cartItems;
        window.minicart.saveToLocalStorage();
        window.minicart.updateCartIcon();
        window.minicart.renderCartItems();
    }

    productLoad();
}

window.removeCountProduct = (title, colorName) => {
    let cartItems = JSON.parse(localStorage.getItem("shoppingCart") || "[]");
    const productIndex = cartItems.findIndex(item => item.title === title && item.colorName === colorName);

    if (productIndex !== -1) {
        const currentQuantity = cartItems[productIndex].quantity;

        if (currentQuantity > 1) {
            cartItems[productIndex].quantity--;
            cartItems[productIndex].totalPrice = cartItems[productIndex].quantity * cartItems[productIndex].unitPrice;
            localStorage.setItem("shoppingCart", JSON.stringify(cartItems));

            const countId = `count-${title.replace(/\s/g, '')}-${colorName.replace(/\s/g, '')}`;
            const countElement = document.getElementById(countId);
            if (countElement) {
                countElement.textContent = cartItems[productIndex].quantity;
            }

            if (window.minicart) {
                window.minicart.cartItems = cartItems;
                window.minicart.saveToLocalStorage();
                window.minicart.updateCartIcon();
                window.minicart.renderCartItems();
            }

            updateTotalPrice();
        } else {
            removeProduct(title, colorName);
        }
    }
}

window.plusCountProduct = (title, colorName) => {
    let cartItems = JSON.parse(localStorage.getItem("shoppingCart") || "[]");
    const productIndex = cartItems.findIndex(item => item.title === title && item.colorName === colorName);

    if (productIndex !== -1) {
        cartItems[productIndex].quantity++;
        cartItems[productIndex].totalPrice = cartItems[productIndex].quantity * cartItems[productIndex].unitPrice;
        localStorage.setItem("shoppingCart", JSON.stringify(cartItems));

        const countId = `count-${title.replace(/\s/g, '')}-${colorName.replace(/\s/g, '')}`;
        const countElement = document.getElementById(countId);
        if (countElement) {
            countElement.textContent = cartItems[productIndex].quantity;
        }

        if (window.minicart) {
            window.minicart.cartItems = cartItems;
            window.minicart.saveToLocalStorage();
            window.minicart.updateCartIcon();
            window.minicart.renderCartItems();
        }

        updateTotalPrice();
    }
}

const productLoad = () => {
    if (!cartContainer) return;
    cartContainer.innerHTML = "";
    appliedDiscount = 0;

    const cartItems = JSON.parse(localStorage.getItem("shoppingCart") || "[]");

    if (cartItems.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-basket" style="text-align: center; padding: 60px 20px;">
                <h2>🛒 سبد خرید شما خالی است</h2>
                <p>برای مشاهده محصولات به صفحه محصولات مراجعه کنید</p>
                <a href="products.html" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background: #000; color: #fff; text-decoration: none; border-radius: 8px;">مشاهده محصولات</a>
            </div>
        `;
        return;
    }

    getDataFromLocalStorage();
}

window.addEventListener("beforeunload", () => {
    if (window.minicart) {
        const cartItems = JSON.parse(localStorage.getItem("shoppingCart") || "[]");
        window.minicart.cartItems = cartItems;
        window.minicart.saveToLocalStorage();
    }
});

window.addEventListener("load", productLoad);