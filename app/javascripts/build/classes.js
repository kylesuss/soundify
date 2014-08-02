"use strict";
var Application = function Application() {
  this.setStructure();
  this.startSoundCloud();
  this.watchKeyboardShortcuts();
};
($traceurRuntime.createClass)(Application, {
  setStructure: function() {
    this.Views = {};
    this.Collections = {};
    this.Models = {};
  },
  startSoundCloud: function() {
    this.SoundCloud = new SoundCloud();
    this.SoundCloud.connect({success: _.bind(function(userId) {
        this.getInitialCollection();
      }, this)});
  },
  getInitialCollection: function() {
    this.Collections.FavoritesCollection = new FavoritesCollection([], {userId: this.SoundCloud.userId});
    this.Collections.FavoritesCollection.fetch({success: _.bind(function() {
        this.startBackbone();
        this.startAudio();
      }, this)});
  },
  startBackbone: function() {
    this.Router = new Router();
    Backbone.history.start();
  },
  startAudio: function() {
    this.AudioController = new AudioController();
  },
  watchKeyboardShortcuts: function() {
    new KeyboardShortcuts();
  }
}, {});
$((function() {
  window.App = new Application();
}));
;
var AudioController = function AudioController() {
  this.setupElements();
  this.setupVolume();
};
($traceurRuntime.createClass)(AudioController, {
  setupElements: function() {
    this.audioElement = document.getElementById('current-track');
    this.audioElement.addEventListener('timeupdate', _.throttle(function() {
      App.SoundCloud.getWaveform().redraw();
    }, 350), false);
    this.audioElement.addEventListener('ended', _.bind(function() {
      this.playNextTrack();
    }, this), false);
    this.audioContext = new webkitAudioContext();
    this.audioSource = this.audioContext.createMediaElementSource(this.audioElement);
    this.audioSource.connect(this.audioContext.destination);
  },
  setupVolume: function() {
    var volume = readCookie('volume') || 1;
    document.cookie = ("volume=" + volume);
    this.volumeSlider = new Dragdealer('volume-slider', {
      x: volume,
      requestAnimationFrame: true,
      steps: 100,
      snap: true,
      animationCallback: _.bind(function(x, y) {
        this.currentTrack && this.setVolume(x);
      }, this)
    });
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
    var url = (track.stream_url + "?client_id=" + App.SoundCloud.clientId);
    this.currentTrack && this.pauseCurrentTrack() && this.clearCurrentTrack();
    App.Views.NowPlayingView.render(track);
    this.audioElement.src = url;
    this.currentTrackId = track.id;
    this.currentTrackIndex = this.getCurrentTrackIndex(this.currentTrackId);
    this.currentTrack = this.audioSource.mediaElement;
    this.setVolume();
    this.currentTrack.play();
    App.SoundCloud.getWaveform().dataFromSoundCloudTrack(track);
  },
  getCurrentTrackIndex: function(currentTrackId) {
    var model = App.Collections.FavoritesCollection.find(function(model) {
      return model.get('id') === currentTrackId;
    });
    var index = App.Collections.FavoritesCollection.indexOf(model);
    return index;
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
  changeTrack: function(trackIndex) {
    this.currentTrackComponent && this.currentTrackComponent.setState({status: 'stopped'});
    var model = App.Collections.FavoritesCollection.at(trackIndex);
    model && this.playTrack(model.attributes);
    App.SoundCloud.fetchComments(model.get('id'));
    React.renderComponent(Controls({nextAction: 'pause'}), document.getElementById('controls-wrap'));
    React.renderComponent(UserBlurb({data: model.attributes}), document.getElementById('user-blurb-wrap'));
  },
  playNextTrack: function() {
    var index = this.currentTrackIndex + 1;
    this.changeTrack(index);
  },
  playPreviousTrack: function() {
    var index = this.currentTrackIndex - 1;
    this.changeTrack(index);
  },
  toggleCurrentTrackState: function() {
    if (this.currentTrack.paused) {
      this.playCurrentTrack();
    } else {
      this.pauseCurrentTrack();
    }
  }
}, {});
;
var KeyboardShortcuts = function KeyboardShortcuts() {
  this.watchKeys();
};
($traceurRuntime.createClass)(KeyboardShortcuts, {watchKeys: function() {
    document.addEventListener('keydown', function(event) {
      var spaceKey = 32;
      if (event.keyCode === spaceKey) {
        event.preventDefault();
        App.AudioController.toggleCurrentTrackState();
      }
    }, false);
  }}, {});
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
};
($traceurRuntime.createClass)(SoundCloud, {
  initialize: function() {
    SC.initialize({
      client_id: this.clientId,
      redirect_uri: Config.redirectUri
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
        var songPercentage = App.AudioController.audioElement.currentTime / App.AudioController.audioElement.duration;
        if (percentageOfWaveform > songPercentage || isNaN(percentageOfWaveform) === true || isNaN(App.AudioController.audioElement.duration) || typeof(percentageOfWaveform) === 'undefined') {
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
          seekTo = App.AudioController.audioElement.duration * percentage;
      App.AudioController.audioElement.currentTime = seekTo;
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
