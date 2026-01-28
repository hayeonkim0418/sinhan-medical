// 로그인 홈 - 로그인 버튼 클릭 시 모션

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
      x: 200,
      opacity: 0,
      duration: 1.5,
      ease: "power1.inOut",
    });

    tl.to(".header", {
      y: -50,
      opacity: 0,
      duration: 0.8,
      ease: "power1.inOut",
    });

    tl.to(
      ".login-side",
      {
        x: -500,
        opacity: 0,
        duration: 1.5,
        ease: "power1.inOut",
        onComplete: () => {
          console.log("애니메이션 종료");
        },
      },
      "<",
    );
  });
};
