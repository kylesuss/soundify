
/////////////////////
/// Backbone Router
/////////////////////

class Router extends Backbone.Router {

  constructor() {
    this.routes = {
      ''    : 'player'
    }
    super();
  }

  player() {
    new PlayerView();
  }

}