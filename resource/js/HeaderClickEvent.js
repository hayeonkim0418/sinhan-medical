// 헤더 상단 아이콘 클릭 이벤트

export const HeaderClickEvent = () => {
  const userBtnOpen = document.querySelector(".user__btn");
  const userInfo = document.querySelector(".user-info");

  if (!userBtnOpen || !userInfo) return;

  userBtnOpen.addEventListener("click", () => {
    userInfo.classList.toggle("is-active");
  });
};
