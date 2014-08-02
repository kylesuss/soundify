class AudioController {

  constructor() {
    this.setupElements();
    this.setupVolume();
  }

  /////////////////////
  /// Setup
  /////////////////////

  setupElements() {
    // Not using React for this
    this.audioElement = document.getElementById('current-track');
    this.audioElement.addEventListener('timeupdate', _.throttle(function() {
      App.SoundCloud.getWaveform().redraw();
    }, 350), false);
    this.audioElement.addEventListener('ended', _.bind(function() {
      this.playNextTrack();
    }, this), false);
    this.audioContext = new webkitAudioContext();
    this.audioSource  = this.audioContext.createMediaElementSource(this.audioElement);
    this.audioSource.connect(this.audioContext.destination);
  }

  setupVolume() {
    var volume = readCookie('volume') || 1;
    document.cookie = `volume=${volume}`

    this.volumeSlider = new Dragdealer('volume-slider', {
      x: volume,
      requestAnimationFrame: true,
      steps: 100,
      snap: true,
      animationCallback: _.bind(function(x, y) {
        this.currentTrack && this.setVolume(x);
      }, this)
    });
  }

  /////////////////////
  /// Streaming
  /////////////////////

  setVolume(number) {
    number = number || readCookie('volume');

    // number = parseFloat(number);
    number = Math.round(number * 100);
    if (number < 5) { number = 0; }
    this.currentTrack.volume = number / 100;
    document.cookie = `volume=${number / 100}`
  }

  playTrack(track) {
    var url = `${track.stream_url}?client_id=${App.SoundCloud.clientId}`;
    
    // Handle the current song
    this.currentTrack && this.pauseCurrentTrack() && this.clearCurrentTrack();

    // Template the now playing view
    App.Views.NowPlayingView.render(track);

    // Change the source of the audio element and play the new track
    this.audioElement.src = url;
    this.currentTrackId = track.id;
    this.currentTrackIndex = this.getCurrentTrackIndex(this.currentTrackId);
    this.currentTrack = this.audioSource.mediaElement;
    this.setVolume();
    this.currentTrack.play();
    App.SoundCloud.getWaveform().dataFromSoundCloudTrack(track);
  }

  getCurrentTrackIndex(currentTrackId) {
    // App.Collections.currentTrackCollection
    var model = App.Collections.FavoritesCollection.find( function(model) {
      return model.get('id') === currentTrackId;
    });

    var index = App.Collections.FavoritesCollection.indexOf(model);

    return index;
  }

  /////////////////////
  /// State Helpers
  /////////////////////

  clearCurrentTrack() {
    this.audioElement.currentTime = 0;
    this.audioElement.duration = 1;
  }

  pauseCurrentTrack() {
    this.currentTrack.pause();
  }

  playCurrentTrack() {
    this.currentTrack.play();
  }

  changeTrack(trackIndex) {
    this.currentTrackComponent && this.currentTrackComponent.setState({status: 'stopped'});
    var model = App.Collections.FavoritesCollection.at(trackIndex);
    // Play the next track if it exists
    model && this.playTrack(model.attributes);

    App.SoundCloud.fetchComments(model.get('id'));

    React.renderComponent(
      Controls({nextAction: 'pause'}),
      document.getElementById('controls-wrap')
    )

    React.renderComponent(
      UserBlurb({data: model.attributes}),
      document.getElementById('user-blurb-wrap')
    )
  }

  playNextTrack() {
    var index = this.currentTrackIndex + 1;

    this.changeTrack(index);
  }

  playPreviousTrack() {
    var index = this.currentTrackIndex - 1;

    this.changeTrack(index);
  }

  toggleCurrentTrackState() {
    if (this.currentTrack.paused) {
      this.playCurrentTrack();
    } else {
      this.pauseCurrentTrack();
    }
  }

}