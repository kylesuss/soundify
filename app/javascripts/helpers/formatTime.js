function formatTime(milli) {
  var milliseconds = milli % 1000,
      seconds = Math.floor((milli / 1000) % 60),
      minutes = Math.floor((milli / (60 * 1000)) % 60);

  if (seconds < 10) { seconds = '0' + seconds; }

  return minutes + ":" + seconds;
}