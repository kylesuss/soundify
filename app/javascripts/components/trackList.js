
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

});