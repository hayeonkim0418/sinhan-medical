export const SelectEvent = () => {
  // 모든 셀렉션 박스 엘리먼트 선택
  const selectBoxElements = document.querySelectorAll(".select-box");

  if (!selectBoxElements) return;

  //.optionList
  function toggleSelectBox(selectBox) {
    selectBox.classList.toggle("is-active");
  }

  // 옵션 선택 함수 / closest() - 가장 가까운 조상
  function selectOption(optionElement) {
    const selectBox = optionElement.closest(".select-box");
    const selectedElement = selectBox.querySelector(".selected__value");
    selectedElement.textContent = optionElement.textContent;
  }

  // 각 셀렉션 박스에 클릭 이벤트 리스너 추가
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

  // 문서 전체에 클릭 이벤트 리스너 추가
  // 모든 셀렉션 박스 이외의 부분을 클릭했을 때,
  // 모든 셀렉션 박스에서 'active' 클래스를 제거하여 옵션 목록을 숨긴다.
  document.addEventListener("click", function (e) {
    const targetElement = e.target;
    const isSelect =
      targetElement.classList.contains("select-box") ||
      targetElement.closest(".select-box");

    if (isSelect) {
      return;
    }

    // 모든 셀렉션 박스에서 'active' 클래스 제거
    const allSelectBoxElements = document.querySelectorAll(".select-box");

    allSelectBoxElements.forEach((boxElement) => {
      boxElement.classList.remove("is-active");
    });
  });
};
