
/////////////////////
/// Comments child view
/// - Parent is player
/////////////////////

class CommentsView extends Backbone.View {

  initialize() {
    this.el = 'comments';
    this.render();
  }

  render() {
    React.renderComponent(
      Comments({}),
      document.getElementById('comments-wrap')
    )

    return this;
  }

}