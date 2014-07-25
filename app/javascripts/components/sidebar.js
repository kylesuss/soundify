
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

})