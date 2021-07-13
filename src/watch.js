let isRunning = false;
let elapsedTime = { hh: 0, mm: 0, ss: 0, ms: 0 };

const [$btnStartOrStop, $btnLap, $btnReset] =
  document.querySelectorAll('.control-btn');

const handleBtnStartOrStop = (() => {
  let timerId = null;

  // Start
  const start = () => {
    let { hh, mm, ss, ms } = elapsedTime;

    timerId = setInterval(() => {
      ms += 1;
      if (ms >= 10) {
        ss += 1;
        ms = 0;
      }
      if (ss >= 60) {
        mm += 1;
        ss = 0;
      }
      if (mm >= 60) {
        hh += 1;
        mm = 0;
      }

      elapsedTime = { hh, mm, ss, ms };
    }, 100);
  };

  return () => {
    isRunning ? stop() : start();
    isRunning = !isRunning;
  };
})();

$btnStartOrStop.addEventListener('click', handleBtnStartOrStop);
