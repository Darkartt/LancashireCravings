// This script helps to handle direct navigation to routes in GitHub Pages
// It stores the URL before GitHub Pages redirects to 404.html
// It should be placed at the root of the 'public' folder
(function(l) {
  if (l.search[1] === '/') {
    var decoded = l.search.slice(1).split('&').map(function(s) { 
      return s.replace(/~and~/g, '&')
    }).join('?');
    window.history.replaceState(null, null,
      l.pathname.slice(0, -1) + decoded + l.hash
    );
  }
}(window.location));
