
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

});