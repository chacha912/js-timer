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
  let timerId = null;

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

    const createLapElement = newLap => {
      const $newLap = document.createElement('li');
      $newLap.textContent = formatElapsedTime(newLap);

      $laps.appendChild($newLap);
      $laps.style.display = 'block';
    };

    const removeLaps = () => {
      $laps.innerHTML = '';
      $laps.style.display = 'none';
    };

    return () => {
      const { length } = laps;

      if (length) {
        const newLap = laps[length - 1];
        createLapElement(newLap);
      } else {
        removeLaps();
      }
    };
  })();

  const setLaps = _laps => {
    laps = _laps;
    renderLaps();
  };

  const setElapsedTime = _elapsedTime => {
    elapsedTime = _elapsedTime;
    renderElapsedTime();
  };

  const toggleControlBtns = (() => {
    $iconStartOrStop = $btnStartOrStop.querySelector('.fas');

    return isStart => {
      isStart = isStart ?? isRunning;
      $btnStartOrStop.classList.toggle('start', isStart);
      $btnStartOrStop.classList.toggle('pause', !isStart);
      $btnStartOrStop.setAttribute('aria-label', isStart ? '정지' : '시작');
      $iconStartOrStop.classList.toggle('fa-play', !isStart);
      $iconStartOrStop.classList.toggle('fa-pause', isStart);
    };
  })();

  const runTimer = () => {
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

      setElapsedTime({ hh, mm, ss, ms });
    }, 100);
  };

  const startTimer = () => {
    isRunning = true;
    runTimer();
    toggleControlBtns();
  };

  const stopTimer = () => {
    isRunning = false;
    clearInterval(timerId);
    toggleControlBtns();
  };

  const resetTimer = () => {
    stopTimer();
    setElapsedTime({ hh: 0, mm: 0, ss: 0, ms: 0 });
    setLaps([]);
    toggleControlBtns(false);
  };

  const lapTimer = () => {
    setLaps([...laps, elapsedTime]);
  };

  return ({ target }) => {
    const $targetBtn = closest(target, 'control-btn', 'stopwatch');
    if (!$targetBtn) return;
    if ($targetBtn === $btnLap) lapTimer();
    if ($targetBtn === $btnReset) resetTimer();
    if ($targetBtn === $btnStartOrStop) {
      isRunning ? stopTimer() : startTimer();
    }
  };
})();
