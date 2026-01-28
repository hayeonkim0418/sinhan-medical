// 헤더, 헤더 상단 아이콘 클릭시

import { IncludeHTML } from "./IncludeHTML.js";
import { HeaderClickEvent } from "./HeaderClickEvent.js";

export const Header = () => {
  IncludeHTML("../component/header.html", ".header")
    .then(() => {
      HeaderClickEvent();
    })
    .catch((error) => {
      console.error(error);
    });
};
