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
  let laps = [];

  const [$btnStartOrStop, $btnLap, $btnReset] =
    document.querySelectorAll('.control-btn');

  const formatElapsedTime = (() => {
    const formatTwoDigits = n => (n < 10 ? '0' + n : n + '');
    const formatOneDigit = n => parseInt(n / 10, 10);
    return ({ hh, mm, ss, ms }) =>
      `${formatTwoDigits(hh)}:${formatTwoDigits(mm)}:${formatTwoDigits(
        ss
      )}.${ms}`;
  })();

  const renderElapsedTime = (() => {
    const $display = document.querySelector('.stopwatch > .display');

    return () => {
      $display.textContent = formatElapsedTime(elapsedTime);
    };
  })();

  const renderLaps = (() => {
    const $laps = document.querySelector('.timer-laps');

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
    const startTimer = () => {
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
        renderElapsedTime();
      }, 100);
    };

    const toggleBtnStartOrStop = (() => {
      $iconStartOrStop = $btnStartOrStop.querySelector('.fas');

      return () => {
        $btnStartOrStop.classList.toggle('start', !isRunning);
        $btnStartOrStop.classList.toggle('pause', isRunning);
        $btnStartOrStop.setAttribute('aria-label', isRunning ? '정지' : '시작');
        $iconStartOrStop.classList.toggle('fa-play', !isRunning);
        $iconStartOrStop.classList.toggle('fa-pause', isRunning);
      };
    })();

    const start = () => {
      startTimer();
      toggleBtnStartOrStop();
    };

    const stop = () => {
      toggleBtnStartOrStop();
    };

    return () => {
      isRunning = !isRunning;
      isRunning ? start() : stop();
    };
  })();

  const resetOrLap = (() => {
    const reset = () => {
      $btnReset.disabled = true;
      $btnLap.disabled = true;

      elapsedTime = { hh: 0, mm: 0, ss: 0, ms: 0 };
      renderElapsedTime();

      laps = [];
      renderLaps();
    };

    const addLap = () => {
      laps = [...laps, elapsedTime];
      renderLaps();
    };

    return () => {
      isRunning ? addLap() : reset();
    };
  })();

  return ({ target }) => {
    const $targetBtn = closest(target, 'control-btn', 'stopwatch');
    console.log($targetBtn);
    if (!$targetBtn) return;
    if ($targetBtn === $btnStartOrStop) handleBtnStartOrStop();
    if ($targetBtn === $btnLap || $targetBtn === $btnReset) resetOrLap();
  };
})();
