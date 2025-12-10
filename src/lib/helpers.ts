export function scrollToImage(src: string) {
  function getOffset(el: HTMLImageElement) {
    const rect = el.getBoundingClientRect(),
      scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
      scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
  }

  const image: HTMLImageElement = document.querySelector(`img[src='${src}']`);
  const offset = getOffset(image);
  window.scrollTo(0, offset.top - 50);
}
