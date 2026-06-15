document.addEventListener('DOMContentLoaded', function () {
    const menuItems = document.querySelectorAll('.menu-categories-item');

    // برای هر آیتم یک event listener اضافه می‌کنیم
    menuItems.forEach(item => {
        item.addEventListener('click', function () {
            // اول کلاس active را از همه آیتم‌ها حذف می‌کنیم
            menuItems.forEach(i => {
                i.classList.remove('menu-categories-item-active');
            });

            // سپس کلاس active را به آیتم کلیک شده اضافه می‌کنیم
            this.classList.add('menu-categories-item-active');
        });
    });
});


document.addEventListener('DOMContentLoaded', function () {
    const dropdownIcons = document.querySelectorAll('.dropdown-menu-filter-item');

    dropdownIcons.forEach(icon => {
        icon.addEventListener('click', function () {
            const dropdownContainer = this.closest('.filter-container').querySelector('.filter-dropdown-container');
            dropdownContainer.classList.toggle('open-filter-dropdown-container');

            // اضافه/حذف کلاس rotate-icon برای چرخش آیکون
            this.classList.toggle('rotate-icon');
        });
    });
});


document.addEventListener('DOMContentLoaded', function () {
    const dropdownBtn = document.querySelector('.sort-mobile-dropdown-btn');
    const dropdownContainer = document.querySelector('.sort-mobile-dropdown-container');
    const dropdownItems = document.querySelectorAll('.sort-mobile-dropdown-item');

    // اضافه کردن رویداد کلیک به دکمه
    dropdownBtn.addEventListener('click', function () {
        // toggle کلاس open-sort-mobile-dropdown-container روی container
        dropdownContainer.classList.toggle('open-sort-mobile-dropdown-container');
    });

    // اضافه کردن رویداد کلیک به هر آیتم
    dropdownItems.forEach(item => {
        item.addEventListener('click', function () {
            // حذف کلاس فعال از همه آیتم‌ها
            dropdownItems.forEach(i => {
                i.classList.remove('sort-mobile-dropdown-item-active');
            });

            // اضافه کردن کلاس فعال به آیتم کلیک شده
            this.classList.add('sort-mobile-dropdown-item-active');
        });
    });
});

const shopContainer = document.querySelector("#shop");
const productLengthDisplay = document.querySelector("#product-shop-length");
const screenLoader = document.querySelector(".loading-screen")
const mostExpensiveElem = document.querySelector("#most-expensive");
const mostCheapElem = document.querySelector("#most-cheap");
const newestElem = document.querySelector("#newest");
const discountProductElem = document.querySelector("#discount-checkbox");
const removeFiltersBtn = document.querySelector("#remove-filters");
const filterColorBtns = document.querySelectorAll(".filter-color-btn");
const filterSizeBtns = document.querySelectorAll(".filter-size-btn");
const paginationContainer = document.querySelector(".number-page-container")

let products = [];
let shopHTML = "";
let isShowDiscountProduct = false;
let activeColor = null;
let activeSize = null;
let page = 1;
let productPerPage = 6;

/* Card Product */
function createShopProductCard(item) {

    const colorBox = item.colors.map(color => {
        return `<div class="color-pro-box" style="background: ${color};"></div>`;
    }).join("");

    const sortedSizes = sortSizes(item.sizes);
    let sizeText = "";
    if (sortedSizes.length > 0) {
        const firstSize = sortedSizes[0];
        const lastSize = sortedSizes[sortedSizes.length - 1];
        sizeText = `از سایز ${firstSize} تا ${lastSize}`;
    }

    return `
        <div class="product">
            <div class="image-product">
                <img src="${item.image}" alt="">
                <div class="label">
                    ${item.vip ? '<span class="vip">vip</span>' : ""}
                    ${item.discountPercent > 0 ? `<span class="sale">${item.discountPercent}%</span>` : ""}
                </div>
            </div>
            <div class="titles-product">
                <h3 class="title-product">
                   <a href ="single-product.html?id=${item.id}">${item.title}</a>
                </h3>
                <div class="product-price-container">
                    ${item.discountPercent > 0 ?
            `<h3 class="main-price">${(item.price - (item.price / 100) * item.discountPercent).toLocaleString()} تومان</h3><h3 class="price">${item.price.toLocaleString()} تومان</h3>`
            : `<h3 class="main-price">${item.price.toLocaleString()} تومان</h3>`}
                </div>
                <span class="size">${sizeText}</span>
                <div class="colors">
                    ${colorBox}
                </div>
            </div>
        </div>
    `;
}

function sortSizes(sizes) {
    const sizeOrder = {
        'XS': 1, 'S': 2, 'M': 3, 'L': 4, 'XL': 5, 'XXL': 6, 'XXXL': 7,
        'xs': 1, 's': 2, 'm': 3, 'l': 4, 'xl': 5, 'xxl': 6, 'xxxl': 7
    };

    return [...sizes].sort((a, b) => {
        const aIsNumber = !isNaN(parseFloat(a)) && isFinite(a);
        const bIsNumber = !isNaN(parseFloat(b)) && isFinite(b);

        if (aIsNumber && bIsNumber) {
            return parseFloat(a) - parseFloat(b);
        }
        if (aIsNumber && !bIsNumber) return -1;
        if (!aIsNumber && bIsNumber) return 1;

        const aOrder = sizeOrder[a] || 100;
        const bOrder = sizeOrder[b] || 100;
        return aOrder - bOrder;
    });
}

/* دریافت محصولات فیلتر شده */
const getFilteredProducts = () => {
    let filteredProducts = [...products];

    // Discount filter
    if (isShowDiscountProduct) {
        filteredProducts = filteredProducts.filter(
            (item) => item.discountPercent > 0
        );
    }

    // Color filter
    if (activeColor) {
        filteredProducts = filteredProducts.filter((item) =>
            item.colors?.includes(activeColor)
        );
    }

    // Size filter
    if (activeSize) {
        filteredProducts = filteredProducts.filter((item) =>
            item.sizes?.includes(activeSize)
        );
    }

    return filteredProducts;
};

/* رندر محصولات با صفحه‌بندی */
const renderProducts = (filteredProducts, resetPage = true) => {
    if (!shopContainer) return;

    // ریست صفحه به 1 برای فیلترهای جدید
    if (resetPage) {
        page = 1;
    }

    // محاسبه محصولات صفحه جاری
    const startIndex = (page - 1) * productPerPage;
    const lastIndex = startIndex + productPerPage;
    const shownProduct = filteredProducts.slice(startIndex, lastIndex);

    let shopHTML = "";
    shownProduct.forEach((item) => {
        shopHTML += createShopProductCard(item);
    });

    shopContainer.innerHTML = shopHTML;
    counterProduct(filteredProducts);

    // رندر صفحه‌بندی
    renderPagination(filteredProducts);
};

/* رندر صفحه‌بندی */
const renderPagination = (filteredProducts) => {
    if (!paginationContainer) return;

    paginationContainer.innerHTML = '';
    const pageCount = Math.ceil(filteredProducts.length / productPerPage);

    if (pageCount <= 1) return;

    for (let i = 0; i < pageCount; i++) {
        paginationContainer.insertAdjacentHTML("beforeend",
            `
               <span class="page ${(i + 1) === page ? "active" : ""}" onclick="changePageHandler(${i + 1})">${i + 1}</span>
            `
        )
    }
};

/* تغییر صفحه */
window.changePageHandler = (userSelectedPage) => {
    page = userSelectedPage;

    // دریافت محصولات فیلتر شده
    const filteredProducts = getFilteredProducts();

    // رندر محصولات صفحه جدید (بدون ریست کردن صفحه)
    const startIndex = (page - 1) * productPerPage;
    const lastIndex = startIndex + productPerPage;
    const shownProduct = filteredProducts.slice(startIndex, lastIndex);

    let shopHTML = "";
    shownProduct.forEach((item) => {
        shopHTML += createShopProductCard(item);
    });

    shopContainer.innerHTML = shopHTML;
    counterProduct(filteredProducts);

    // به‌روزرسانی کلاس active صفحه‌بندی
    const pageNumbers = document.querySelectorAll(".page");
    pageNumbers.forEach((pageNumber) => {
        if (+pageNumber.innerHTML === page) {
            pageNumber.classList.add("active");
        } else {
            pageNumber.classList.remove("active");
        }
    });
};

/* Fetching Data */
async function fetchAndRenderProducts() {
    try {
        const response = await fetch("data.json");

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} `);
        }

        const data = await response.json();

        products = data;

        // رندر اولیه محصولات
        const filteredProducts = getFilteredProducts();
        renderProducts(filteredProducts);

    } catch (error) {
        console.error("Failed to fetch or render products:", error);
        if (shopContainer) {
            shopContainer.innerHTML = '<p class="error-message">خطا در بارگیری محصولات ویژه.</p>';
        }
    }
}

/* Apply Filter */
const applyFilters = () => {
    loader();
    const filteredProducts = getFilteredProducts();
    renderProducts(filteredProducts);
};

/* Loader */
const loader = () => {
    screenLoader.classList.add("active");
    setTimeout(() => {
        screenLoader.classList.remove("active");
    }, 1000);
}

/* Show Expensive Product */
const mostExpensive = () => {
    loader();
    products.sort((a, b) => b.price - a.price);

    // reset all filters
    isShowDiscountProduct = false;
    activeColor = null;
    activeSize = null;

    // reset checkbox
    if (discountProductElem) {
        discountProductElem.checked = false;
    }

    // reset active classes
    filterColorBtns?.forEach((btn) => btn.classList.remove("active"));
    filterSizeBtns?.forEach((btn) => btn.classList.remove("active"));

    const filteredProducts = getFilteredProducts();
    renderProducts(filteredProducts);
}

/* Show Cheap Product */
const mostCheap = () => {
    loader();
    products.sort((a, b) => a.price - b.price);

    // reset all filters
    isShowDiscountProduct = false;
    activeColor = null;
    activeSize = null;

    // reset checkbox
    if (discountProductElem) {
        discountProductElem.checked = false;
    }

    // reset active classes
    filterColorBtns?.forEach((btn) => btn.classList.remove("active"));
    filterSizeBtns?.forEach((btn) => btn.classList.remove("active"));

    const filteredProducts = getFilteredProducts();
    renderProducts(filteredProducts);
}

/* Show New Product */
const newest = () => {
    loader();
    products.sort((a, b) => b.id - a.id);

    // reset all filters
    isShowDiscountProduct = false;
    activeColor = null;
    activeSize = null;

    // reset checkbox
    if (discountProductElem) {
        discountProductElem.checked = false;
    }

    // reset active classes
    filterColorBtns?.forEach((btn) => btn.classList.remove("active"));
    filterSizeBtns?.forEach((btn) => btn.classList.remove("active"));

    const filteredProducts = getFilteredProducts();
    renderProducts(filteredProducts);
}

/* Show Discount Product */
const discountProduct = () => {
    loader();

    isShowDiscountProduct = !isShowDiscountProduct;

    // همگام‌سازی وضعیت چک‌باکس
    if (discountProductElem) {
        discountProductElem.checked = isShowDiscountProduct;
    }

    applyFilters();
};

/* Remove Filter */
const removeFilter = () => {
    loader();

    // reset state
    isShowDiscountProduct = false;
    activeColor = null;
    activeSize = null;

    // reset checkbox
    if (discountProductElem) {
        discountProductElem.checked = false;
    }

    // clear active classes safely
    filterColorBtns?.forEach((btn) => btn.classList.remove("active"));
    filterSizeBtns?.forEach((btn) => btn.classList.remove("active"));

    // show all
    const filteredProducts = getFilteredProducts();
    renderProducts(filteredProducts);
};

/* Color Filter */
if (filterColorBtns?.length) {
    filterColorBtns.forEach((filterColorBtn) => {
        filterColorBtn.addEventListener("click", (event) => {
            loader();

            // remove active only within color buttons
            filterColorBtns.forEach((btn) => btn.classList.remove("active"));

            // set active
            event.currentTarget.classList.add("active");

            activeColor = event.currentTarget.dataset.color || null;

            applyFilters();
        });
    });
}

/* Size Filter */
if (filterSizeBtns?.length) {
    filterSizeBtns.forEach((filterSizeBtn) => {
        filterSizeBtn.addEventListener("click", (event) => {
            loader();

            // remove active only within size buttons
            filterSizeBtns.forEach((btn) => btn.classList.remove("active"));

            // set active
            event.currentTarget.classList.add("active");

            activeSize = event.currentTarget.dataset.size || null;

            applyFilters();
        });
    });
}

/* Product Counter */
const counterProduct = (filteredPro) => {
    if (productLengthDisplay) {
        productLengthDisplay.textContent = filteredPro.length;
    }
};

/* Event Listeners */
window.addEventListener("load", fetchAndRenderProducts);
mostExpensiveElem.addEventListener("click", mostExpensive);
mostCheapElem.addEventListener("click", mostCheap);
newestElem.addEventListener("click", newest);

if (discountProductElem) {
    discountProductElem.addEventListener("change", discountProduct);
}

removeFiltersBtn.addEventListener("click", removeFilter);