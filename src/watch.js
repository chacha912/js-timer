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
};
