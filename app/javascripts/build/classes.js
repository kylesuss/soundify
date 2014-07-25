"use strict";
var Application = function Application() {
  this.startSoundCloud();
  this.setStructure();
};
($traceurRuntime.createClass)(Application, {
  startSoundCloud: function() {
    this.SoundCloud = new SoundCloud();
    this.SoundCloud.connect({success: _.bind(function(userId) {
        this.getInitialCollection();
      }, this)});
  },
  getInitialCollection: function() {
    this.favorites = new FavoritesCollection({userId: this.SoundCloud.userId});
    this.favorites.fetch({success: _.bind(function(collection) {
        this.SoundCloud.favorites = collection;
        this.startBackbone();
        this.SoundCloud.setupVolume();
      }, this)});
  },
  startBackbone: function() {
    this.Router = new Router();
    Backbone.history.start();
  },
  setStructure: function() {
    this.Views = {};
  }
}, {});
$((function() {
  window.App = new Application();
}));
;
var Router = function Router() {
  this.routes = {'': 'player'};
  $traceurRuntime.superCall(this, $Router.prototype, "constructor", []);
};
var $Router = Router;
($traceurRuntime.createClass)(Router, {player: function() {
    new PlayerView();
  }}, {}, Backbone.Router);
;
var SoundCloud = function SoundCloud() {
  this.clientId = Config.clientId;
  this.initialize();
  this.favorites = [];
  this.setupAudio();
};
($traceurRuntime.createClass)(SoundCloud, {
  initialize: function() {
    SC.initialize({
      client_id: this.clientId,
      redirect_uri: Config.redirectUri
    });
  },
  setupAudio: function() {
    this.audioElement = document.getElementById('current-track');
    this.audioElement.addEventListener('timeupdate', _.throttle(function() {
      App.SoundCloud.getWaveform().redraw();
    }, 350), false);
    this.audioContext = new webkitAudioContext();
    this.audioSource = this.audioContext.createMediaElementSource(this.audioElement);
    this.audioSource.connect(this.audioContext.destination);
  },
  setupVolume: function() {
    var volume = readCookie('volume') || 1;
    document.cookie = ("volume=" + volume);
    this.volumeSlider = new Dragdealer('volume-slider', {
      x: volume,
      animationCallback: _.bind(function(x, y) {
        this.currentTrack && this.setVolume(x);
      }, this)
    });
  },
  connect: function(options) {
    var self = this,
        userId = readCookie('userId'),
        success = options.success;
    if (!userId) {
      SC.connect(function() {
        SC.get('/me', function(me) {
          self.userId = me.id;
          self.publicFavoritesCount = me.public_favorites_count;
          document.cookie = ("userId=" + me.id);
          document.cookie = ("publicFavoritesCount=" + me.public_favorites_count);
          document.cookie = ("avatarUrl=" + me.avatar_url);
          document.cookie = ("username=" + me.username);
          success(userId);
        });
      });
    } else {
      this.userId = userId;
      success(userId);
    }
  },
  setVolume: function(number) {
    number = number || readCookie('volume');
    number = Math.round(number * 100);
    if (number < 5) {
      number = 0;
    }
    this.currentTrack.volume = number / 100;
    document.cookie = ("volume=" + number / 100);
  },
  playTrack: function(track) {
    var url = (track.stream_url + "?client_id=" + this.clientId);
    this.currentTrack && this.pauseCurrentTrack() && this.clearCurrentTrack();
    App.Views.NowPlayingView.render(track);
    this.audioElement.src = url;
    this.currentTrack = this.audioSource.mediaElement;
    this.setVolume();
    this.currentTrack.play();
    this.getWaveform().dataFromSoundCloudTrack(track);
  },
  clearCurrentTrack: function() {
    this.audioElement.currentTime = 0;
    this.audioElement.duration = 1;
  },
  pauseCurrentTrack: function() {
    this.currentTrack.pause();
  },
  playCurrentTrack: function() {
    this.currentTrack.play();
  },
  fetchComments: function(trackId) {
    SC.get(("/tracks/" + trackId + "/comments"), function(comments) {
      $('#comments-wrap').scrollTop(0);
      React.renderComponent(Comments({data: comments}), document.getElementById('comments-wrap'));
    });
  },
  getWaveform: function() {
    if (!this.waveform) {
      var container = document.getElementById('waveform'),
          width = container.getBoundingClientRect().width - 300;
      this.createWaveform(container, width);
      this.createGradient();
      this.watchWaveformClickEvents();
    }
    return this.waveform;
  },
  createWaveform: function(container, width) {
    this.waveform = new Waveform({
      container: container,
      width: width,
      innerColor: _.bind(function(percentageOfWaveform, d) {
        var songPercentage = this.audioElement.currentTime / this.audioElement.duration;
        if (percentageOfWaveform > songPercentage || isNaN(percentageOfWaveform) === true || isNaN(this.audioElement.duration) || typeof(percentageOfWaveform) === 'undefined') {
          return '#444';
        } else {
          return this.gradient;
        }
      }, this)
    });
    this.waveformCanvas = document.querySelectorAll('#waveform canvas')[0];
  },
  createGradient: function() {
    var waveformContext = this.waveform.context,
        gradient = waveformContext.createLinearGradient(0, 0, 0, this.waveform.height);
    gradient.addColorStop(0.0, "#f60");
    gradient.addColorStop(1.0, "#ff1b00");
    this.gradient = gradient;
  },
  watchWaveformClickEvents: function() {
    this.waveformCanvas.addEventListener('click', _.bind(function(event) {
      var mousePos = this.getMousePosition(this.waveformCanvas, event),
          percentage = mousePos.x / mousePos.width,
          seekTo = this.audioElement.duration * percentage;
      this.audioElement.currentTime = seekTo;
    }, this), false);
  },
  getMousePosition: function(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      width: rect.width
    };
  }
}, {});

//# sourceMappingURL=classes.js.map
