export const IncludeHTML = async (location, target) => {
  try {
    const response = await fetch(location);
    const result = await response.text(); //text 메서드로 문자화 시켜준다.

    document.querySelector(target).innerHTML = result;
  } catch (error) {
    console.log(error);
  }
};
