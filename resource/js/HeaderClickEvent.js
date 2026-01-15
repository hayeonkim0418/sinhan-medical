export const HeaderClickEvent = () => {
  const userBtnOpen = document.querySelector(".user__btn");
  const userInfo = document.querySelector(".user-info");

  userBtnOpen.addEventListener("click", () => {
    userInfo.classList.toggle("is-active");
  });
};
