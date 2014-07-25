
/////////////////////
/// Now playing child view
/// - Parent is sidebar
/////////////////////

class NowPlayingView extends Backbone.View {

  initialize() {
    this.el = 'album-art';
    this.render();
  }

  render(props) {
    props = props || null;
    React.renderComponent(
      NowPlaying({data: props}),
      document.getElementById('now-playing-wrap')
    )

    return this;
  }

}