
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
          ),
          React.DOM.div({id: 'powered-by-sc'})
        )

      )
    } else {

      return (
        React.DOM.div({id: 'powered-by-sc'})
      )

    }
  }

});