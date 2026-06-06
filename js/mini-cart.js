class MinicartManager {
    constructor() {
        this.cartItems = [];
        this.isInitialized = false;
        this.init();
    }

    init() {
        this.loadFromLocalStorage();
        this.updateCartIcon();
        this.renderCartItems();
        this.isInitialized = true;
    }

    loadFromLocalStorage() {
        const savedCart = localStorage.getItem('shoppingCart');
        if (savedCart) {
            try {
                this.cartItems = JSON.parse(savedCart);
            } catch (e) {
                this.cartItems = [];
            }
        }
    }

    saveToLocalStorage() {
        localStorage.setItem('shoppingCart', JSON.stringify(this.cartItems));
    }

    updateCartIcon() {
        const cartCountElements = document.querySelectorAll('.cart-icon .count');
        const totalItems = this.cartItems.reduce((sum, item) => sum + item.quantity, 0);

        cartCountElements.forEach(element => {
            if (element) element.textContent = totalItems;
        });
    }

    calculateTotalPrice() {
        return this.cartItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
    }

    renderCartItems() {
        const cartContainer = document.querySelector('.cart-box-product-container');
        if (!cartContainer) return;

        if (this.cartItems.length === 0) {
            cartContainer.innerHTML = `
                <div class="empty-mini-cart-message">
                    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80" fill="none">
			            <path d="M34.2334 70.0001C34.2334 72.3001 32.3667 74.1667 30.0667 74.1667C27.7701 74.1667 25.8834 72.3001 25.8834 70.0001C25.8834 67.7001 27.7334 65.8334 30.0334 65.8334H30.0667C32.3667 65.8334 34.2334 67.7001 34.2334 70.0001ZM56.7334 65.8334H56.7C54.4 65.8334 52.5501 67.7001 52.5501 70.0001C52.5501 72.3001 54.4334 74.1667 56.7334 74.1667C59.0334 74.1667 60.9001 72.3001 60.9001 70.0001C60.9001 67.7001 59.0334 65.8334 56.7334 65.8334ZM72.3499 28.3067L68.9701 48.8601C68.0935 53.6801 65.9133 59.1667 56.6667 59.1667H29.1134C24.5834 59.1667 20.6799 55.7834 20.0399 51.2968L15.0065 16.0801C14.7132 14.0401 12.9434 12.5034 10.8834 12.5034H10C8.62 12.5034 7.5 11.3834 7.5 10.0034C7.5 8.62342 8.62 7.50342 10 7.50342H10.8866C15.4166 7.50342 19.3201 10.8867 19.9601 15.3734L20.2665 17.5034H63.3333C66.06 17.5034 68.6269 18.7034 70.3735 20.7967C72.1169 22.8867 72.8399 25.6267 72.3499 28.3067ZM66.53 23.9967C65.7366 23.0467 64.5701 22.5001 63.3301 22.5001H20.9766L24.9898 50.5901C25.2832 52.6301 27.0534 54.1667 29.1134 54.1667H56.6667C61.99 54.1667 63.2867 52.1801 64.0434 48.0101L67.4235 27.4534C67.6535 26.1934 67.3233 24.9467 66.53 23.9967ZM50.9334 31.5667C49.9568 30.5901 48.3733 30.5901 47.3966 31.5667L44.1634 34.8001L40.9302 31.5667C39.9535 30.5901 38.3701 30.5901 37.3934 31.5667C36.4167 32.5434 36.4167 34.1267 37.3934 35.1034L40.6266 38.3368L37.3934 41.57C36.4167 42.5467 36.4167 44.1301 37.3934 45.1067C37.8801 45.5934 38.5202 45.8401 39.1602 45.8401C39.8002 45.8401 40.4398 45.5967 40.9265 45.1067L44.1602 41.8734L47.3934 45.1067C47.8801 45.5934 48.5202 45.8401 49.1602 45.8401C49.8002 45.8401 50.4398 45.5967 50.9265 45.1067C51.9032 44.1301 51.9032 42.5467 50.9265 41.57L47.6933 38.3368L50.9265 35.1034C51.9098 34.1234 51.9101 32.5434 50.9334 31.5667Z" fill="#606060"></path>
		            </svg>
                    <p>سبد خرید شما در حال حاضر خالی است!</p>
                </div>
            `;
            return;
        }

        let productsHTML = '';

        this.cartItems.forEach((item, index) => {
            productsHTML += `
                <div class="cart-box-product" data-cart-index="${index}">
                    <div class="cart-box-product-image">
                        <img src="${item.image}" alt="${item.title}">
                    </div>
                    <div class="cart-box-product-info">
                        <div class="cart-box-product-title">
                            <h3>${item.title}</h3>
                        </div>
                        <div class="cart-box-product-price">
                            <span>${item.totalPrice.toLocaleString()}</span>
                            <span> تومان</span>
                        </div>
                        <div class="cart-box-product-color">
                            <div class="color-cart-box-product" style="background-color: ${item.colorCode};"></div>
                            <h4>${item.colorName}</h4>
                        </div>
                        <div class="cart-box-product-count">
                            <h5>${item.quantity} عدد</h5>
                        </div>
                    </div>
                </div>
            `;
        });

        const totalPrice = this.calculateTotalPrice();

        cartContainer.innerHTML = `
            <div class="cart-item">
                ${productsHTML}
            </div>
            <div class="cart-total-price-btn">
                <div class="cart-total-price">
                    <span >جمع کل:</span>
                    <h3 >${totalPrice.toLocaleString()}
                      <span>
                        تومان
                      </span>
                    </h3>
                </div>
                <div class="cart-box-product-btn">
                    <a href="basket.html">
                        <svg>
                            <use href="#buy-crypto"></use>
                        </svg>
                        نهایی کردن خرید
                    </a>
                </div>
            </div>
        `;
    }

    addToCart(productData) {
        const {
            title,
            image,
            price,
            quantity,
            colorName,
            colorCode,
            categorypersian,
            discountPercent,  // اضافه شد
            size              // اضافه شد
        } = productData;

        if (!title || !price || price <= 0) {
            return false;
        }

        const existingIndex = this.cartItems.findIndex(item =>
            item.title === title && item.colorName === colorName
        );

        if (existingIndex !== -1) {
            this.cartItems[existingIndex].quantity += quantity;
            this.cartItems[existingIndex].totalPrice = this.cartItems[existingIndex].quantity * this.cartItems[existingIndex].unitPrice;
        } else {
            this.cartItems.push({
                title: title,
                categorypersian: categorypersian,
                image: image,
                unitPrice: price,
                quantity: quantity,
                totalPrice: price * quantity,
                colorName: colorName,
                colorCode: colorCode || '#000000',
                discountPercent: discountPercent || 0,  // اضافه شد
                size: size || "سایز استاندارد"          // اضافه شد
            });
        }

        this.saveToLocalStorage();
        this.updateCartIcon();
        this.renderCartItems();

        return true;
    }

    clearCart() {
        this.cartItems = [];
        this.saveToLocalStorage();
        this.updateCartIcon();
        this.renderCartItems();
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.minicart = new MinicartManager();
        window.addProductToMinicart = (productDetails) => {
            return window.minicart ? window.minicart.addToCart(productDetails) : false;
        };
    });
} else {
    window.minicart = new MinicartManager();
    window.addProductToMinicart = (productDetails) => {
        return window.minicart ? window.minicart.addToCart(productDetails) : false;
    };
}