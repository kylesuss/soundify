
/////////////////////
/// Appliction Delegate
/////////////////////

class Application {

  constructor() {
    this.setStructure();
    this.startSoundCloud();
    this.watchKeyboardShortcuts();
  }

  setStructure() {
    this.Views = {};
    this.Collections = {};
    this.Models = {};
  }

  startSoundCloud() {
    this.SoundCloud = new SoundCloud();
    this.SoundCloud.connect({
      success: _.bind(function(userId) {
        this.getInitialCollection();
      }, this)
    });
  }

  getInitialCollection() {
    this.Collections.FavoritesCollection  = new FavoritesCollection([], {userId: this.SoundCloud.userId});

    this.Collections.FavoritesCollection.fetch({

      success: _.bind(function() {
        this.startBackbone();
        // Need elements to be created for volume to start
        this.startAudio();
      }, this)

    });
  }

  startBackbone() {
    this.Router = new Router();
    Backbone.history.start();
  }

  startAudio() {
    this.AudioController = new AudioController();
  }

  watchKeyboardShortcuts() {
    new KeyboardShortcuts();
  }

}

/////////////////////
/// Start the app
/////////////////////

$(() => {
  window.App = new Application();
});