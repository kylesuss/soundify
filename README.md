# Soundify

![Soundify Screenshot](http://i.imgur.com/xAcJNa8.png)

A client side SoundCloud player that focuses on the concept of a 'libary', similar to the way that Spotify works. Get it: SoundCloud + Spotify = Soundify.

**This app is currently in an 'alpha' state. You can currently connect your SoundCloud account, retrieve your full list of favorites, and play songs. You may encouunter some bugs along the way.**

The app makes heavy use of the following:

1. Grunt
2. React.js
3. ES6 Classes
4. Backbone.js
5. Jade
6. Sass

To get started, clone the repo and run `npm install` to retrieve the dev dependencies.

Once you have the dependencies installed, you can run `grunt connect` to start the server.

## Config

In order to connect with SoundCloud, you'll need to register your application to retrieve the client ID and to set your redirect URI. For the purposes of development, the redirect URI can be set to:

`http://localhost:8000/callback.html`

The callback.html file sits in the repo and `grunt connect` will start your app on port 8000.

Once you have your app registered, create the file `app/javascripts/config.js`:

```
var Config = {
  clientId: '12345', // Your actual clientId
  redirectUri: 'http://localhost:8000/callback.html' // Or whatever page you need
}
```
This config file is in the `.gitignore` file, so no need to worry about adding it to source control.