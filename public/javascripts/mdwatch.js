var MdWatch = (function() {
  var socket
    , config
    , $container;

  function init(container) {
    // set main document container
    $container = $(container);

    // configure socket.io 
    socket = io.connect();
    socket.on('connect', function() {
      console.log('connected');
    });
    socket.on('config', function(_config) {
      config = _config;
    });
    socket.on('update', function(html) {
      console.log('update');
      // set document content
      $container.html(html);

      // colorize code blocks
      if (config.colorize) {
        colorize();
      }
    });
  }

  function colorize() {
    // for each `code` node, check if it has the language class,
    // if so, then issue an AJAX request for colorization.
    // the server will respond with the colorized html,
    // then replace the parent(a `pre` node) of current node with the colorized one.
    $('code').each(function(idx, ele) {
      if (ele.className) {
        $.ajax({
            url     : '/colorize'
          , type    : 'post'
          , data    : {
              html  : $(ele).text()
            , lang  : ele.className
          }
          , success : function(data) {
            $(ele).parent().replaceWith($(data));
          }
        });
      }
    });
  }

  return {
    init: init
  };

})();

$(document).ready(function() {
  MdWatch.init('#main');
});
