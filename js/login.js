const phoneMessage = document.querySelector(".phone-message");
const loginBtn = document.querySelector(".login-button");
const loginInput = document.querySelector(".login-input");
const inputNumberCodes = document.querySelectorAll(".input-number");

loginBtn.addEventListener("click", function () {
    const phoneNumber = loginInput.value;

    if (phoneNumber.length != 11) {
        phoneMessage.classList.add("message");
        loginInput.classList.add("wrong-input");
        loginInput.classList.remove("correct-input");
    } else {
        phoneMessage.classList.remove("message");
        loginInput.classList.remove("wrong-input");
        loginInput.classList.add("correct-input");
    }
})

inputNumberCodes.forEach((input, index) => {
  input.addEventListener("keyup", (event) => {
    const { target } = event;

    if (target.value.length === 1 && index + 1 < inputNumberCodes.length) {
      inputNumberCodes[index + 1].focus();
    } else if (target.value.length > 1) {
      target.value = target.value.slice(0, 1);
      inputNumberCodes[index + 1]?.focus();
    }
  });
});