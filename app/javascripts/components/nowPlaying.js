
/////////////////////
/// Now Playing
/////////////////////

var NowPlaying = React.createClass({

  displayName: 'NowPlaying',

  render: function() {
    if (this.props.data) {
      
      var trackArtwork = artworkUrl(this.props.data.artwork_url) || artworkUrl(this.props.data.user.avatar_url),
          artworkStyle = { backgroundImage: 'url(' + trackArtwork + ')' };

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

});