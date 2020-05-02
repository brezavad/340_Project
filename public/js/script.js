function resizeImages(event) {
  if ((window.innerWidth / window.innerHeight) < 1.77) {
    document.body.style.backgroundSize = "auto 100%";
  }
  else {
    document.body.style.backgroundSize = "100% auto";
  }

  event.preventDefault();
}

document.addEventListener("DOMContentLoaded", resizeImages);
window.addEventListener('resize', resizeImages);
