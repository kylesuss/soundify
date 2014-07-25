
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

});