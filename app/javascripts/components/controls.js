
/////////////////////
/// Controls
/////////////////////

var Controls = React.createClass({

  displayName: 'Controls',

  render: function() {
    var state = this.props.nextAction || 'play';

    return (
      React.DOM.div({id: 'controls'},
        React.DOM.div({id: 'play-state'},
          React.DOM.i({className: 'fa fa-step-backward'}),
          React.DOM.i({className: 'fa fa-' + state, onClick: this.togglePlayState}),
          React.DOM.i({className: 'fa fa-step-forward'})
        ),
        React.DOM.div({id: 'volume-slider', className: 'dragdealer'},
          React.DOM.div({className: 'handle red-bar'}),
          React.DOM.div({id: 'volume-track'})
        ),
        React.DOM.div({id: 'waveform', className: 'no-gutter'})
      )
    )
  },

  togglePlayState: function() {
    if (this.props.nextAction === 'pause') {
      App.SoundCloud.currentTrack.pause();
      // Cleaner way to do this?
      React.renderComponent(
        Controls({nextAction: 'play'}),
        document.getElementById('controls-wrap')
      )
    } else {
      // Cleaner way to do this?
      App.SoundCloud.currentTrack.play();
      React.renderComponent(
        Controls({nextAction: 'pause'}),
        document.getElementById('controls-wrap')
      )
    }
  }

});