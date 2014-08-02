class KeyboardShortcuts {

  constructor() {
    this.watchKeys();
  }

  watchKeys() {
    document.addEventListener('keydown', function(event) {
      var spaceKey = 32;

      if (event.keyCode === spaceKey) {
        event.preventDefault();
        App.AudioController.toggleCurrentTrackState();
      }
    }, false)
  }

}