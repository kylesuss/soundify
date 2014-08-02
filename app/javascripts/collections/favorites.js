class FavoritesCollection extends Backbone.Collection {
  
  constructor(models, options) {
    super(models, options);
    this.model  = TrackModel;
    this.userId = options.userId;
  }

  defaultParams() {
    return {
      path: `/users/${this.userId}/favorites`,
      params: { 
        limit: 200,
        offset: 0 
      }
    }
  }

  fetch(options) {
    var request = options.request || this.defaultParams(),
        params  = request.params,
        success = options.success;

    SC.get(request.path, {'limit': params.limit, 'offset': params.offset },
      _.bind(function(data) {
        this.add(data, _.extend({silent: true}, options));
        if (data.length === 0) {
          this.reset(this.models, options);
          success();
        } else {
          params.offset += data.length;
          this.fetch({
            request: request, 
            success: success
          });
        }
      }, this)
    );
  }

}