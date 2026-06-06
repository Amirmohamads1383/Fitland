const offerSwiperContainer = document.querySelector("#offer");
const shoesSwiperContainer = document.querySelector("#shoes");
const bicycleSwiperContainer = document.querySelector("#bicycle");
const productNumber = document.querySelector("#product-number");
const timeNumber = document.querySelector("#time");
const customerSatisfactionNumber = document.querySelector("#customer-satisfaction-percent");

const makeCounter = (max, elem, durationMs) => {
  const interval = durationMs / max;
  let counter = 0;
  const intervalId = setInterval(() => {
    if (counter === max) {
      clearInterval(intervalId);
    }

    elem.innerHTML = counter;
    counter++;
  }, interval);
}

function createProductCard(item) {

    const colorBox = item.colors.map(color => {
        return `<div class="color-pro-box" style="background: ${color};"></div>`;
    }).join("");

    return `
        <div class="swiper-slide">
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
                    <span class="size">از سایز L تا XXL</span>
                    <div class="colors">
                        ${colorBox}
                    </div>
                </div >
            </div >
        </div >
    `;
}

async function fetchAndRenderProducts() {
    try {
        const response = await fetch("data.json");

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${ response.status } `);
        }

        const data = await response.json();

        let offerHTML = "";
        let shoesHTML = "";
        let bicycleHTML = "";

        data.forEach(item => {
            if (item.discountPercent > 0) {
                offerHTML += createProductCard(item);
            }

            if (item.category === "shoes") {
                shoesHTML += createProductCard(item);
            }

            if (item.category === "bicycle") {
                bicycleHTML += createProductCard(item);
            }
        });

        
        if (offerSwiperContainer) {
            offerSwiperContainer.innerHTML = offerHTML;
        }
        if (shoesSwiperContainer) {
            shoesSwiperContainer.innerHTML = shoesHTML;
        }
        if (bicycleSwiperContainer) {
            bicycleSwiperContainer.innerHTML = bicycleHTML;
        }

    } catch (error) {
        console.error("Failed to fetch or render products:", error);
        if (offerSwiperContainer) {
            offerSwiperContainer.innerHTML = '<p class="error-message">خطا در بارگیری محصولات ویژه.</p>';
        }
        if (shoesSwiperContainer) {
            shoesSwiperContainer.innerHTML = '<p class="error-message">خطا در بارگیری کفش‌ها.</p>';
        }
        if (bicycleSwiperContainer) {
            bicycleSwiperContainer.innerHTML = '<p class="error-message">خطا در بارگیری کفش‌ها.</p>';
        }
    }
}

fetchAndRenderProducts();
makeCounter(300, productNumber, 1000);
makeCounter(95, customerSatisfactionNumber, 1000);
makeCounter(4 , time , 1000);