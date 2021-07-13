const closest = ($startElem, targetClass, endClass) => {
  let elem = $startElem;
  while (!elem.classList.contains(targetClass)) {
    if (elem.classList.contains(endClass)) {
      return null;
    }
    elem = elem.parentNode;
  }
  return elem;
};

/* ==== DOMs ==== */
document.querySelector('.stopwatch').onclick = (() => {
  let isRunning = false;
  let elapsedTime = { hh: 0, mm: 0, ss: 0, ms: 0 };
  const laps = [];

  const [$btnStartOrStop, $btnLap, $btnReset] =
    document.querySelectorAll('.control-btn');

  const formatElapsedTime = (() => {
    const formatTwoDigits = n => (n < 10 ? '0' + n : n + '');
    const formatOneDigit = n => parseInt(n / 10, 10);
    return ({ hh, mm, ss, ms }) =>
      `${formatTwoDigits(hh)}:${formatTwoDigits(mm)}:${formatTwoDigits(
        ss
      )}:${formatOneDigit(ms)}`;
  })();

  const renderElapsedTime = (() => {
    const $display = document.querySelector('.stopwatch > .display');

    return () => {
      $display.textContent = formatElapsedTime(elapsedTime);
    };
  })();

  const renderLaps = (() => {
    const $laps = document.querySelector('.stopwatch > .timer-laps');

    const createLapElement = (newLap, index) => {
      const $fragment = document.createDocumentFragment();
      const $index = document.createElement('div');
      $index.textContent = index;
      $fragment.appendChild($index);

      const $newLap = document.createElement('div');
      $newLap.textContent = formatElapsedTime(newLap);
      $fragment.appendChild($newLap);

      $laps.appendChild($fragment);
      $laps.style.display = 'block';
    };

    const removeLaps = () => {
      document
        .querySelectorAll('.timer-laps > .timer-lap')
        .forEach($lap => $lap.remove());

      $laps.style.display = 'none';
    };

    return () => {
      const { length } = laps;

      if (length) {
        const newLap = laps[length - 1];
        createLapElement(newLap, length);
      } else {
        removeLaps();
      }
    };
  })();

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

  return ({ target }) => {
    console.log(target);
    const $targetBtn = closest(target, 'control-btn', 'stopwatch');
    if (!$targetBtn) return;
    if ($targetBtn === $btnStartOrStop) handleBtnStartOrStop();
  };
})();
