
/////////////////////
/// Soundcloud & audio management
/////////////////////

class SoundCloud {

  constructor() {
    this.clientId = Config.clientId;
    this.initialize();
    this.favorites = [];
    this.setupAudio();
  }

  /////////////////////
  /// App setup
  /////////////////////

  initialize() {
    SC.initialize({
      client_id: this.clientId,
      redirect_uri: Config.redirectUri
    });
  }

  setupAudio() {
    // Not using React for this
    this.audioElement = document.getElementById('current-track');
    this.audioElement.addEventListener('timeupdate', _.throttle(function() {
      App.SoundCloud.getWaveform().redraw();
    }, 350), false);
    this.audioContext = new webkitAudioContext();
    this.audioSource  = this.audioContext.createMediaElementSource(this.audioElement);
    this.audioSource.connect(this.audioContext.destination);
  }

  setupVolume() {
    var volume = readCookie('volume') || 1;
    document.cookie = `volume=${volume}`

    this.volumeSlider = new Dragdealer('volume-slider', {
      x: volume,
      animationCallback: _.bind(function(x, y) {
        this.currentTrack && this.setVolume(x);
      }, this)
    });
  }

  /////////////////////
  /// Get user data
  /////////////////////

  connect(options) {

    var self   = this,
        userId = readCookie('userId'),
        success = options.success;

    // If the userId is null
    if (!userId) {

      // Make the user login
      SC.connect(function() {
        SC.get('/me', function(me) {
          self.userId = me.id;
          self.publicFavoritesCount = me.public_favorites_count;

          document.cookie = `userId=${me.id}`
          document.cookie = `publicFavoritesCount=${me.public_favorites_count}`
          document.cookie = `avatarUrl=${me.avatar_url}`
          document.cookie = `username=${me.username}`

          success(userId);
        });
      });

    } else {

      // Save the userId
      this.userId = userId;
      success(userId);

    }
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
    var url = `${track.stream_url}?client_id=${this.clientId}`;
    
    // Handle the current song
    this.currentTrack && this.pauseCurrentTrack() && this.clearCurrentTrack();

    // Template the now playing view
    App.Views.NowPlayingView.render(track);

    // Change the source of the audio element and play the new track
    this.audioElement.src = url;
    this.currentTrack = this.audioSource.mediaElement;
    this.setVolume();
    this.currentTrack.play();
    this.getWaveform().dataFromSoundCloudTrack(track);
  }

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

  /////////////////////
  /// Comments
  /////////////////////

  fetchComments(trackId) {
    // Fetch the comments for the track
    SC.get(`/tracks/${trackId}/comments`, function(comments) {
      // TODO: Boo jQuery
      $('#comments-wrap').scrollTop(0)
      React.renderComponent(
        Comments({data: comments}),
        document.getElementById('comments-wrap')
      )
    });
  }

  /////////////////////
  /// Waveform
  /////////////////////

  getWaveform() {
    if (!this.waveform) {
      var container = document.getElementById('waveform'),
          width     = container.getBoundingClientRect().width - 300; // Subtract 300 as the sidebar is that wide and this element is positioned with 100% window width but with padding on the left.

      this.createWaveform(container, width);
      this.createGradient();
      this.watchWaveformClickEvents();
    }

    return this.waveform;
  }

  createWaveform(container, width) {
    this.waveform = new Waveform({
      container: container,
      width: width,
      innerColor: _.bind(function(percentageOfWaveform, d) {
        var songPercentage = this.audioElement.currentTime / this.audioElement.duration;

        if (percentageOfWaveform > songPercentage || isNaN(percentageOfWaveform) === true || isNaN(this.audioElement.duration) || typeof(percentageOfWaveform) === 'undefined') {
          // If this portion of the track hasn't played yet
          return '#444';
        } else {
          // If this portion of the track has already played
          return this.gradient;
        }
      }, this)
    });

    this.waveformCanvas = document.querySelectorAll('#waveform canvas')[0];
  }

  createGradient() {
    var waveformContext = this.waveform.context,
        gradient = waveformContext.createLinearGradient(0, 0, 0, this.waveform.height);

    gradient.addColorStop(0.0, "#f60");
    gradient.addColorStop(1.0, "#ff1b00");
    this.gradient = gradient;
  }

  // Change the track position upon click
  watchWaveformClickEvents() {
    this.waveformCanvas.addEventListener('click', _.bind(function(event) {
      var mousePos = this.getMousePosition(this.waveformCanvas, event),
          percentage = mousePos.x / mousePos.width,
          seekTo = this.audioElement.duration * percentage;

      this.audioElement.currentTime = seekTo;
    }, this), false);
  }

  // Get the mouse position over the canvas
  getMousePosition(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      width: rect.width
    };
  }

}