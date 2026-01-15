export const TableTextScroll = () => {
  const containers = document.querySelectorAll(".scroll-container");

  if (!containers) return;

  containers.forEach((container) => {
    const text = container.querySelector(".scroll-text");

    container.addEventListener("mouseenter", () => {
      const isOverflowing = text.scrollWidth > container.clientWidth;

      if (isOverflowing) {
        const distance = text.scrollWidth - container.clientWidth;

        text.style.transition = "transform 12s linear";
        text.style.transform = `translateX(-${distance}px)`;
      }
    });

    container.addEventListener("mouseleave", () => {
      text.style.transition = "none";
      text.style.transform = `translateX(0)`;
    });
  });
};
