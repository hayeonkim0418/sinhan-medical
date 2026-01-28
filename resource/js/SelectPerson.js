// 성인 소아 선택 이벤트

export const SelectPerson = () => {
  const personBtns = document.querySelectorAll(".select-person__btn");

  if (!personBtns) return;

  personBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();

      personBtns.forEach((item) => item.classList.remove("is-active"));
      e.currentTarget.classList.add("is-active");
    });
  });
};
