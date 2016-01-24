<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, height=device-height, minimum-scale=1.0, initial-scale=1.0, user-scalable=0">
  <title>Addi | ALPHA</title>
  <link rel="shortcut icon" href="img/logo.png">
  <link rel="icon" type="image/png" href="img/logo.png"/>
  <meta name="description" content="A binary based tetris game.">

  <meta itemprop="name" content="Team Nipple">
  <meta itemprop="description" content="A binary based tetris game.">
  <meta itemprop="image" content="img/logo.png">

  <meta property="og:type" content="Addi Game">
  <meta property="og:title" content="A binary based tetris game.">
  <meta property="og:image" content="img/logo.png">
  <meta property="og:description" content="A binary based tetris game, written and maintained by Team Nipple.">
  <meta property="og:site_name" content="Team Nipple">
  <meta property="og:url" content="http://www.nipple.team/" />

  <link rel="stylesheet" href="css/normalize.css" type="text/css" />
  <link rel="stylesheet" href="css/app.css" type="text/css" />
</head>
<body>
  <div id="rendered-game">
    <div class="side_bar" style="left:0;">
    </div>
    <!-- Addi is rendered into this container -->
    <div class="side_bar" style="right:0;">
    </div>
  </div>
  <script data-main="js/config" src="js/libs/require.js"></script>
  <script>
    require(['config'], function(){
      require(['jquery', 'pulse', 'game'], function($, Pulse, Addi){
        $(function(){
          // Disable native key events
          window.onkeydown = function(e) { 
              return !(e.keyCode == 32 || e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40);
          }
        });
      });
    });
  </script>
</body>
</html>