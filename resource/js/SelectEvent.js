// 셀렉트 박스

export const SelectEvent = () => {
  const selectBoxElements = document.querySelectorAll(".select-box");

  if (!selectBoxElements) return;

  function toggleSelectBox(selectBox) {
    selectBox.classList.toggle("is-active");
  }

  function selectOption(optionElement) {
    const selectBox = optionElement.closest(".select-box");
    const selectedElement = selectBox.querySelector(".selected__value");
    selectedElement.textContent = optionElement.textContent;
  }

  selectBoxElements.forEach((selectBoxElement) => {
    selectBoxElement.addEventListener("click", function (e) {
      const targetElement = e.target;
      const isOptionElement = targetElement.classList.contains("option");

      if (isOptionElement) {
        selectOption(targetElement);
      }

      toggleSelectBox(selectBoxElement);
    });
  });

  document.addEventListener("click", function (e) {
    const targetElement = e.target;
    const isSelect = targetElement.classList.contains("select-box") || targetElement.closest(".select-box");

    if (isSelect) {
      return;
    }

    const allSelectBoxElements = document.querySelectorAll(".select-box");

    allSelectBoxElements.forEach((boxElement) => {
      boxElement.classList.remove("is-active");
    });
  });
};
