// 헤더 인클루드

export const IncludeHTML = async (location, target) => {
  try {
    const response = await fetch(location);
    const result = await response.text();
    const element = document.querySelector(target);

    if (element) {
      element.innerHTML = result;
    } else {
      return;
    }
  } catch (error) {
    console.log(error);
  }
};
