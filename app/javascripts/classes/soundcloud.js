
/////////////////////
/// Soundcloud & audio management
/////////////////////

class SoundCloud {

  constructor() {
    this.clientId = Config.clientId;
    this.initialize();
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
        var songPercentage = App.AudioController.audioElement.currentTime / App.AudioController.audioElement.duration;

        if (percentageOfWaveform > songPercentage || isNaN(percentageOfWaveform) === true || isNaN(App.AudioController.audioElement.duration) || typeof(percentageOfWaveform) === 'undefined') {
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

  // Changing the default of a solid color as the fill layer
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
          seekTo = App.AudioController.audioElement.duration * percentage;

      App.AudioController.audioElement.currentTime = seekTo;
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