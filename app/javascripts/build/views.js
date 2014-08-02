"use strict";
var CommentsView = function CommentsView() {
  $traceurRuntime.defaultSuperCall(this, $CommentsView.prototype, arguments);
};
var $CommentsView = CommentsView;
($traceurRuntime.createClass)(CommentsView, {
  initialize: function() {
    this.el = 'comments';
    this.render();
  },
  render: function() {
    React.renderComponent(Comments({}), document.getElementById('comments-wrap'));
    return this;
  }
}, {}, Backbone.View);
;
var ControlsView = function ControlsView() {
  $traceurRuntime.defaultSuperCall(this, $ControlsView.prototype, arguments);
};
var $ControlsView = ControlsView;
($traceurRuntime.createClass)(ControlsView, {
  initialize: function() {
    this.el = 'controls';
    this.render();
  },
  render: function() {
    React.renderComponent(Controls({}), document.getElementById('controls-wrap'));
    return this;
  }
}, {}, Backbone.View);
;
var NowPlayingView = function NowPlayingView() {
  $traceurRuntime.defaultSuperCall(this, $NowPlayingView.prototype, arguments);
};
var $NowPlayingView = NowPlayingView;
($traceurRuntime.createClass)(NowPlayingView, {
  initialize: function() {
    this.el = 'album-art';
    this.render();
  },
  render: function(props) {
    props = props || null;
    React.renderComponent(NowPlaying({data: props}), document.getElementById('now-playing-wrap'));
    return this;
  }
}, {}, Backbone.View);
;
var PlayerView = function PlayerView() {
  $traceurRuntime.defaultSuperCall(this, $PlayerView.prototype, arguments);
};
var $PlayerView = PlayerView;
($traceurRuntime.createClass)(PlayerView, {
  initialize: function() {
    this.el = 'player';
    this.render();
    App.Views.TopbarView = new TopbarView();
    App.Views.SidebarView = new SidebarView();
    App.Views.TracksView = new TracksView({collection: App.Collections.FavoritesCollection});
    App.Views.UserBlurbView = new UserBlurbView();
    App.Views.ControlsView = new ControlsView();
  },
  render: function() {
    React.renderComponent(Player({}), document.getElementById('app'));
    return this;
  }
}, {}, Backbone.View);
;
var SidebarView = function SidebarView() {
  $traceurRuntime.defaultSuperCall(this, $SidebarView.prototype, arguments);
};
var $SidebarView = SidebarView;
($traceurRuntime.createClass)(SidebarView, {
  initialize: function() {
    this.el = 'sidebar';
    this.render();
    App.Views.NowPlayingView = new NowPlayingView();
    App.Views.CommentsView = new CommentsView();
  },
  render: function() {
    React.renderComponent(Sidebar({}), document.getElementById('sidebar-wrap'));
    return this;
  }
}, {}, Backbone.View);
;
var TopbarView = function TopbarView() {
  $traceurRuntime.defaultSuperCall(this, $TopbarView.prototype, arguments);
};
var $TopbarView = TopbarView;
($traceurRuntime.createClass)(TopbarView, {
  initialize: function() {
    this.el = 'topbar';
    this.render();
  },
  render: function() {
    React.renderComponent(Topbar({
      username: readCookie('username'),
      avatarUrl: readCookie('avatarUrl')
    }), document.getElementById('topbar-wrap'));
    return this;
  }
}, {}, Backbone.View);
;
var TracksView = function TracksView() {
  $traceurRuntime.defaultSuperCall(this, $TracksView.prototype, arguments);
};
var $TracksView = TracksView;
($traceurRuntime.createClass)(TracksView, {
  initialize: function() {
    this.el = 'tracks';
    this.render();
    this.listenTo(this.collection, 'reset', this.render);
  },
  render: function() {
    var data = this.collection.toJSON() || [];
    React.renderComponent(Tracks(data.length ? {data: data} : {}), document.getElementById('tracks-wrap'));
    return this;
  }
}, {}, Backbone.View);
;
var UserBlurbView = function UserBlurbView() {
  $traceurRuntime.defaultSuperCall(this, $UserBlurbView.prototype, arguments);
};
var $UserBlurbView = UserBlurbView;
($traceurRuntime.createClass)(UserBlurbView, {
  initialize: function() {
    this.el = 'user-blurb';
    this.render();
  },
  render: function() {
    React.renderComponent(UserBlurb({}), document.getElementById('user-blurb-wrap'));
    return this;
  }
}, {}, Backbone.View);

//# sourceMappingURL=views.js.map
