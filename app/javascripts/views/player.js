
/////////////////////
/// App parent view
/// - TopbarView
/// - SidebarView
/// - TracksView
/// - CommentsView
/// - ControlsView
/////////////////////

class PlayerView extends Backbone.View {

  initialize() {
    this.el = 'player';
    this.render();

    // Create the high level parent views
    // These views will create and populate their own children
    // Which is exactly what this view is doing
    App.Views.TopbarView    = new TopbarView();
    App.Views.SidebarView   = new SidebarView();
    App.Views.TracksView    = new TracksView({collection: App.Collections.FavoritesCollection});
    App.Views.UserBlurbView = new UserBlurbView();
    App.Views.ControlsView  = new ControlsView();
  }

  render() {
    React.renderComponent(
      Player({}),
      document.getElementById('app')
    )

    return this;
  }

}