
/////////////////////
/// Comment
/////////////////////

var Comment = React.createClass({

  displayName: 'Comment',

  render: function() {
    return (
      React.DOM.div({className: 'comment'}, 
        React.DOM.p({}, this.props.data.body),
        React.DOM.img({src: this.props.data.user.avatar_url})
      )
    )
  }

});
/////////////////////
/// Comments
/////////////////////

var Comments = React.createClass({

  displayName: 'Comments',

  render: function() {

    if (this.props.data) {
      
      // If a collection was passed, create lots of tracks
      var commentNodes = this.props.data.map(function(comment) {
        return (
          Comment({data: comment, key: Math.random()})
        );
      });

      return (
        React.DOM.div({id: 'comments'},
          commentNodes
        )
      );

    } else {

      // Otherwise just build an empty section
      return (
        React.DOM.div({id: 'comments'})
      );

    }

  }

});;
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

});;
/////////////////////
/// Album art
/////////////////////

var NowPlaying = React.createClass({

  displayName: 'NowPlaying',

  render: function() {
    if (this.props.data) {
      var artworkStyle = { backgroundImage: 'url(' + artworkUrl(this.props.data.artwork_url) + ')' };
      return (
        React.DOM.div({id: 'now-playing'},
          React.DOM.div({id: 'artwork', style: artworkStyle}),
          React.DOM.p({id: 'now-playing-title'}, this.props.data.title),
          React.DOM.p({id: 'now-playing-playback'}, 
            React.DOM.i({className: 'fa fa-play'}),
            formatNumber(this.props.data.playback_count),
            React.DOM.span({className: 'separator'}, '|'),
            React.DOM.i({className: 'fa fa-heart'}),
            formatNumber(this.props.data.favoritings_count)
          )
        )
      )  
    } else {
      return null;
    }
  }

});;
/////////////////////
/// Player
/// - Top bar wrap
/// - Sidebar wrap
/// - Tracks wrap
/// - Comments wrap
/// - Controls wrap
/////////////////////

var Player = React.createClass({

  displayName: 'Player',
  
  render: function() {
    return (

      React.DOM.div({id: 'player'}, 

        /////////////////////
        /// Topbar Structure
        /////////////////////

        React.DOM.div({className: 'large-12 columns no-gutter row'},
          React.DOM.div({id: 'topbar-wrap'})
        ),

        /////////////////////
        /// Sidebar Structure
        /////////////////////

        React.DOM.div({id: 'sidebar-wrap', className: 'no-gutter row full-height'}),

        /////////////////////
        /// Content Structure
        /////////////////////

        React.DOM.div({id: 'tracks-wrap', className: 'no-gutter row scrollable'}),

        /////////////////////
        /// User Blurb Structure
        /////////////////////

        React.DOM.div({id: 'user-blurb-wrap', className: 'no-gutter row full-height'}),

        /////////////////////
        /// Controls Structure
        /////////////////////

        React.DOM.div({className: 'large-12 columns no-gutter row'},
          React.DOM.div({id: 'controls-wrap'})
        )
      )

    );
  }

});;
/////////////////////
/// Sidebar
/// - Album art wrap
/////////////////////

var Sidebar = React.createClass({

  displayName: 'Sidebar',

  render: function() {

    return (
      React.DOM.div({id: 'sidebar', className: 'full-height'},
        React.DOM.div({id: 'now-playing-wrap'}),
        React.DOM.div({id: 'comments-wrap', className: 'no-gutter row scrollable'})
      )

    );
  }

});
/////////////////////
/// Topbar
/////////////////////

var Topbar = React.createClass({

  displayName: 'Topbar',

  render: function() {
    return (
      React.DOM.div({id: 'topbar'},
        React.DOM.div({id: 'logo-wrap'},
          React.DOM.a({id: 'logo', href: '/'}, 'Soundify')
        ),
        React.DOM.div({id: 'profile'},
          React.DOM.img({src: this.props.avatarUrl}),
          React.DOM.span({}, this.props.username)
        )
      )
    )
  }

});;
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
          this.formattedTime(this.props.data.duration)
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
  },

  formattedTime: function(milli) {
    var milliseconds = milli % 1000,
        seconds = Math.floor((milli / 1000) % 60),
        minutes = Math.floor((milli / (60 * 1000)) % 60);

    if (seconds < 10) { seconds = '0' + seconds; }

    return minutes + ":" + seconds;
  }

});;
/////////////////////
/// Track List
/// - Track
/////////////////////

var TrackList = React.createClass({

  displayName: 'TrackList',
  
  render: function() {
    if (this.props.data) {
      
      // If a collection was passed, create lots of tracks
      var trackNodes = this.props.data.map(function(track) {
        return (
          Track({data: track, key: Math.random()})
        );
      });

      return (
        React.DOM.div({className: 'track-list'},
          trackNodes
        )
      );

    } else {

      // Otherwise just build an empty section
      return (
        React.DOM.div({className: 'track-list'})
      );

    }

  }

});;
/////////////////////
/// Tracks
/// - TrackList
/////////////////////

var Tracks = React.createClass({

  displayName: 'Tracks',
  
  render: function() {
    return (
      React.DOM.div({className: 'tracks'},
        React.DOM.div({id: 'tracks-topbar'},
          React.DOM.div({className: 'large-12 columns no-gutter'},
            React.DOM.div({className: 'large-3 columns'},
              React.DOM.h4({className: 'no-margin'}, 'User')
            ),
            React.DOM.div({className: 'large-8 columns'},
              React.DOM.h4({className: 'no-margin'}, 'Title')
            ),
            React.DOM.div({className: 'large-1 columns'},
              React.DOM.h4({className: 'no-margin'}, 'Time')
            )
          )
        ),
        TrackList({data: this.props.data})
      )
    );
  }

});;
/////////////////////
/// UserBlurb
/////////////////////

var UserBlurb = React.createClass({

  displayName: 'UserBlurb',

  render: function() {
    if (this.props.data) {
      var avatarStyle = { backgroundImage: 'url(' + artworkUrl(this.props.data.user.avatar_url) + ')' };

      return (
        React.DOM.div({id: 'user-blurb'},
          React.DOM.div({id: 'user-blurb-avatar', style: avatarStyle}),
          React.DOM.div({id: 'user-blurb-content'},
            React.DOM.p({id: 'user-blurb-name'}, this.props.data.user.username)
          )
        )

      )
    } else {

      return null;

    }
  }

});