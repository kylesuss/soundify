
/////////////////////
/// User blurb view
/////////////////////

class UserBlurbView extends Backbone.View {

  initialize() {
    this.el = 'user-blurb';
    this.render();
  }

  render() {
    React.renderComponent(
      UserBlurb({}),
      document.getElementById('user-blurb-wrap')
    )

    return this;
  }

}