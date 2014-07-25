
/////////////////////
/// Appliction Delegate
/////////////////////

class Application {

  constructor() {
    this.startSoundCloud();
    this.setStructure();
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
    this.favorites  = new FavoritesCollection({userId: this.SoundCloud.userId});

    this.favorites.fetch({
      success: _.bind(function(collection) {
        this.SoundCloud.favorites = collection;
        this.startBackbone();
        this.SoundCloud.setupVolume();
      }, this)
    });
  }

  startBackbone() {
    this.Router = new Router();
    Backbone.history.start();
  }

  setStructure() {
    this.Views = {};
  }

}

/////////////////////
/// Start the app
/////////////////////

$(() => {
  window.App = new Application();
});