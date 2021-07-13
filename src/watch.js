/* ==== DOMs ==== */
document.querySelector('.stopwatch').onclick = () => {
  const isRunning = false;
  const elapsedTime = { hh: 0, mm: 0, ss: 0, ms: 0 };
  const laps = [];

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
};
