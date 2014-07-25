
/////////////////////
/// Tracks parent view
/////////////////////

class TracksView extends Backbone.View {

  initialize() {
    this.el = 'tracks';
    this.render();
  }

  render() {
    React.renderComponent(
      Tracks({}),
      document.getElementById('tracks-wrap')
    )

    return this;
  }

}