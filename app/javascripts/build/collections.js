"use strict";
var FavoritesCollection = function FavoritesCollection(options) {
  this.model = TrackModel;
  this.userId = options.userId;
};
($traceurRuntime.createClass)(FavoritesCollection, {
  defaultParams: function() {
    return {
      path: ("/users/" + this.userId + "/favorites"),
      params: {
        limit: 200,
        offset: 0
      }
    };
  },
  fetch: function(options) {
    var request = options.request || this.defaultParams(),
        params = request.params,
        success = options.success,
        collection = options.collection || [];
    SC.get(request.path, {
      'limit': params.limit,
      'offset': params.offset
    }, _.bind(function(data) {
      collection = collection.concat(data);
      if (data.length === 0) {
        success(collection);
        return this.parse(collection);
      } else {
        params.offset += data.length;
        this.fetch({
          request: request,
          collection: collection,
          success: success
        });
      }
    }, this));
  },
  parse: function(collection) {
    React.renderComponent(Tracks({data: collection}), document.getElementById('tracks-wrap'));
  }
}, {}, Backbone.Collection);

//# sourceMappingURL=collections.js.map
