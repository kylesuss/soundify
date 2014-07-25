
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

});