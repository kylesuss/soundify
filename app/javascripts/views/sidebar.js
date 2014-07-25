
/////////////////////
/// Sidebar parent view
/// - AlbumArtView
/////////////////////

class SidebarView extends Backbone.View {

  initialize() {
    this.el = 'sidebar';
    this.render();

    // Create child views
    // this.setsView  = new SetsView();
    App.Views.NowPlayingView = new NowPlayingView();
    App.Views.CommentsView   = new CommentsView();
  }

  render() {
    React.renderComponent(
      Sidebar({}),
      document.getElementById('sidebar-wrap')
    )

    return this;
  }

}