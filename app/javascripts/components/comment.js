
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

})