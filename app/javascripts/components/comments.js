
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

});