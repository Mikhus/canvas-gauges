function ready (cb) {
  const raf = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
      window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

  if (raf) {
    raf(cb);
  } else {
    window.addEventListener('load', cb);
  }
};

export default ready;
