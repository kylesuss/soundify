
/////////////////////
/// Tracks parent view
/////////////////////

class TracksView extends Backbone.View {

  initialize() {
    this.el = 'tracks';
    this.render();
    this.listenTo(this.collection, 'reset', this.render);
  }

  render() {
    var data = this.collection.toJSON() || [];

    React.renderComponent(
      Tracks(data.length ? {data: data} : {}),
      document.getElementById('tracks-wrap')
    )

    return this;
  }

}