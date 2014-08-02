function artworkUrl(oldUrl) {
  var newUrl = '';

  if (oldUrl) {
    newUrl = oldUrl.replace('large', 'crop');
  }

  return newUrl;
}