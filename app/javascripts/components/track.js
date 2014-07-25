
/////////////////////
/// Track
/// - Track user
/// - Track title
/// - Track time
/////////////////////

var Track = React.createClass({

  displayName: 'Track',

  getInitialState: function() {
    return {
      status: 'stopped'
    }
  },

  render: function() {
    return (
      React.DOM.div({className: 'track large-12 columns no-gutter ' + this.state.status, onDoubleClick: this.playTrack},
        React.DOM.h4({className: 'track-user large-3 columns fa fa-volume-up'},
          this.props.data.user.username
        ),
        React.DOM.h4({className: 'track-title large-8 columns'},
          this.props.data.title
        ),
        React.DOM.h4({className: 'track-time large-1 columns'},
          formatTime(this.props.data.duration)
        )
      )
    );
  },

  playTrack: function() {
    var sc = App.SoundCloud;
    // Remove the playing state of the old track if it exists
    sc.currentTrackComponent && sc.currentTrackComponent.setState({status: 'stopped'});

    // Play the new song, adjust its state, and cache it
    sc.playTrack(this.props.data);
    sc.currentTrackComponent = this;
    this.setState({status: 'playing'});

    sc.fetchComments(this.props.data.id);

    // Update the controls
    React.renderComponent(
      Controls({nextAction: 'pause'}),
      document.getElementById('controls-wrap')
    )

    React.renderComponent(
      UserBlurb({data: this.props.data}),
      document.getElementById('user-blurb-wrap')
    )
  }

});