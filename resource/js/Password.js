// 패스워드 숫자 보여지고 안보여지고

export const Password = () => {
  const passwordContainers = document.querySelectorAll(".input-container");

  passwordContainers.forEach((container) => {
    const inputPw = container.querySelector("input.password");
    const buttonPw = container.querySelector(".btn-toggle-pw");

    if (!inputPw || !buttonPw) return;

    buttonPw.addEventListener("click", (e) => {
      e.currentTarget.classList.toggle("is-active");

      const type = inputPw.getAttribute("type");

      if (type === "text") {
        inputPw.setAttribute("type", "password");
      } else {
        inputPw.setAttribute("type", "text");
      }

      const icon = e.currentTarget.querySelector("i");
      if (icon) {
        icon.classList.toggle("ic-eye");
        icon.classList.toggle("ic-eye-off");
      }
    });
  });
};
