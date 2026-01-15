import { IncludeHTML } from "./IncludeHTML.js";
import { HeaderClickEvent } from "./HeaderClickEvent.js";

export const Header = () => {
  IncludeHTML("../component/header.html", ".header")
    .then(() => {
      HeaderClickEvent();
      console.log("Header loaded");
    })
    .catch((error) => {
      console.error(error);
    });
};
