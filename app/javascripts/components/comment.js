
/////////////////////
/// Comment
/////////////////////

var Comment = React.createClass({

  displayName: 'Comment',

  render: function() {
    return (
      React.DOM.div({className: 'comment'}, 
        React.DOM.p({className: 'comment-username'}, this.props.data.user.username),
        React.DOM.p({className: 'comment-timestamp'},
          React.DOM.i({className: 'fa fa-clock-o'}),
          formatTime(this.props.data.timestamp)
        ),
        React.DOM.p({className: 'comment-body'}, this.props.data.body),
        React.DOM.img({src: this.props.data.user.avatar_url})
      )
    )
  }

})