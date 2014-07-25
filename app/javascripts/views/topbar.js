
/////////////////////
/// Topbar child view
/// - Parent is player
/////////////////////

class TopbarView extends Backbone.View {

  initialize() {
    this.el = 'topbar';
    this.render();
  }

  render() {
    React.renderComponent(
      Topbar({username: readCookie('username'), avatarUrl: readCookie('avatarUrl')}),
      document.getElementById('topbar-wrap')
    )

    return this;
  }

}