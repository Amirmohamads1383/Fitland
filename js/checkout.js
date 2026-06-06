const summaryProductsContainer = document.querySelector("#summary-products");
const mapDetailsContainer = document.querySelector("#map-details-container");
const dateSentContainer = document.querySelector("#date-sent-container");

/* Products */
const getProductFromLocalStorage = () => {
    let products = JSON.parse(localStorage.getItem("shoppingCart"));
    summaryProductsContainer.innerHTML = "";
    products.forEach((product) => {
        summaryProductsContainer.insertAdjacentHTML("beforeend", `
            <div class="finall-product-info-container">
                <!-- Image -->
                <div class="finall-product-image-container">
                    <img src="${product.image}" alt="">
                </div>
                <!-- Product Info -->
                <div class="product-info-container">
                    <!-- Title -->
                    <div class="finall-title-product-info-container">
                        <h2 class="finall-title-product-info">${product.title}</h2>
                    </div>
                    <div class="finall-point-product-info-container">
                        <!-- Color -->
                        <div class="finall-color-product-container">
                            <div class="finall-color-product" style="background: ${product.colorCode}"></div>
                            <h5 class="finall-title-color-product">${product.colorName}</h5>
                        </div>
                        <!-- Size -->
                        <div class="finall-size-product-container">
                            <h5 class="finall-size-product">${product.size}</h5>
                            <span>سایز</span>
                        </div>
                        <!-- Count -->
                        <div class="finall-size-product-container">
                            <h5>${product.quantity}</h5>
                            <span>عدد</span>
                        </div>
                        <!-- Price -->
                        <div class="finall-price-product-container">
                            <h5 class="finall-price-product">${product.totalPrice.toLocaleString()}</h5>
                            <span>تومان</span>
                        </div>
                    </div>
                </div>
            </div>
            `)
    });
}

/* Location */
const getLocationFromLocalStorage = () => {
    const location = JSON.parse(localStorage.getItem("add-location"));
    mapDetailsContainer.insertAdjacentHTML("beforeend", `
            <!-- Postal Address -->
            <div class="postal-address-container">
                <h3 class="postal-address">${location.province}، ${location.city}، ${location.houseNumber}، ${location.unit}</h3>
            </div>
            <!-- City Address Container -->
            <div class="city-address-container">
                <span class="city-address">${location.province}، ${location.city}</span>
            </div>
            <!-- User Phone Number Container -->
            <div class="user-phone-number-container">
                <h4 class="user-phone-number">09106478941</h4>
            </div>
            <!-- User Name -->
            <div class="user-name-container">
                <h4 class="user-name">امیرمحمد ستاری</h4>
            </div>
        `)
}

/* Send Time */
const getSentTimeFromLocalStorage = () => {
    const sendTime = localStorage.getItem("selected-send-day");
    dateSentContainer.innerHTML = `<span>${sendTime}</span>`;
}

window.addEventListener("load", () => {
    getProductFromLocalStorage();
    getLocationFromLocalStorage();
    getSentTimeFromLocalStorage();
});