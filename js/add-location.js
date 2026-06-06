const provinceInput = document.querySelector("#province");
const cityInput = document.querySelector("#city");
const houseNumberInput = document.querySelector("#house-number");
const unitInput = document.querySelector("#unit");
const postalCodeInput = document.querySelector("#postal-code");
const addLocationBtn = document.querySelector("#add-location-btn");
const addLocationBodyContainer = document.querySelector(".add-location-body-container");
const sendTimeBoxes = document.querySelectorAll(".send-time-box");
const screenLoader = document.querySelector(".loading-screen");

/* Location Form */
const addLocationHandler = (event) => {
    event.preventDefault();

    const province = provinceInput.value;
    const city = cityInput.value;
    const houseNumber = houseNumberInput.value;
    const unit = unitInput.value;
    const postalCode = postalCodeInput.value;

    const locationData = {
        province,
        city,
        houseNumber,
        unit,
        postalCode
    };

    localStorage.setItem("add-location", JSON.stringify(locationData));

    loader();

    addLocationBodyContainer.innerHTML = "";

    addLocationBodyContainer.insertAdjacentHTML("beforeend",
        `
        <div class="accept-location">
            <div class="accept-location-map-img">
               <img src="image/a180aec27be6dfa035028177161328a4513b7a32.png" alt="">
            </div>
            <div class="accept-location-info">
               <span class="accept-location-addres">${province}، ${city}، ${houseNumber}، ${unit}</span>
               <span class="accept-location-province">${province}، ${city}</span>
               <span class="accept-location-postal">${postalCode}</span>
               <span class="accept-location-phone">09109945421</span>
               <span class="accept-location-name">امیرمحمد ستاری</span>
            </div>
        </div>
        `
    )
}

/* Select Day */
sendTimeBoxes.forEach((sendTimeBox) => {
    sendTimeBox.addEventListener("click", (event) => {
        const selectedSendTimeBox = document.querySelector(".active");
        selectedSendTimeBox.classList.remove("active");
        event.target.classList.add("active");
        const selectDay = event.target.innerText
        localStorage.setItem("selected-send-day", selectDay);
    });
});

/* Loader */
const loader = () => {
    screenLoader.classList.add("active");
    setTimeout(() => {
        screenLoader.classList.remove("active");
    }, 1000);
}

addLocationBtn.addEventListener("click", addLocationHandler);