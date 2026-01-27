export const Gsap = () => {
  const loginBtn = document.querySelector(".login-input-box__btn");

  if (!loginBtn) return;

  loginBtn.addEventListener("click", function (e) {
    e.preventDefault();

    if (typeof gsap === "undefined") {
      console.error("GSAP library is not loaded.");
      return;
    }

    const tl = gsap.timeline();

    tl.to(".contents__login", {
      x: 100,
      opacity: 0,
      duration: 1.5,
      ease: "power2.inOut",
    });

    tl.to(
      ".header",
      {
        y: -50,
        opacity: 0,
        duration: 0.8,
        ease: "power2.inOut",
      },
      "-=1",
    );

    tl.to(
      ".login-side",
      {
        x: -1000,
        opacity: 0,
        duration: 2,
        ease: "power1.inOut",
      },
      "-=0.5",
    );
    // .to(".login-side__header-title, .login-side__header .body2-regular, .login-side__img", {
    //   // x: -50,
    //   opacity: 0,
    //   duration: 0.5,
    //   ease: "power2.in",
    //   onComplete: () => {
    //     console.log("애니메이션 종료");
    //   },
    // });
    //   .to(".login-side__img, .login-side", {
    //     x: -50,
    //     opacity: 0,
    //     duration: 0.5,
    //     ease: "power2.in",
    //     onComplete: () => {
    //       console.log("애니메이션 종료");
    //     },
    //   });
  });
};
