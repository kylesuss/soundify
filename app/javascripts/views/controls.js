
/////////////////////
/// Controls child view
/// - Parent is player
/////////////////////

class ControlsView extends Backbone.View {

  initialize() {
    this.el = 'controls';
    this.render();
  }

  render() {
    React.renderComponent(
      Controls({}),
      document.getElementById('controls-wrap')
    )

    return this;
  }

}