divert(-1)
changequote({{,}})dnl
define({{_KEYWORDS}},{{Volleyball, Familienfotos, Zensur}})dnl
define({{_PROSA}}, {{.}})dnl
define({{_HEAD}}, {{<head>
        <meta charset="utf-8">
        <link href="spielsys.css" rel="stylesheet" type="text/css" />
        <title>$1</title>
        <script src="fabric.js"></script>
        <script src="myinit.js"></script>
        <script src="setpos.js"></script>
    </head>}})dnl

define({{_TITLE}}, {{<div class="header">
            <h1 id="title">patsubst(_SPSYS,_,:), Rotation _ROTA</h1>
        </div>}})dnl
define({{_NAVILEFT}}, {{<div class="col-3 col-s-2 menu">
                <ul>
                    <li id="mp-1" onclick="reset()">  <center>Reset     </center></li>
                    <li id="mp-2" onclick="setK1_0('_SPSYS', _ROTA-1)"><center>3er-Riegel</center></li>
                    <li id="mp-3" onclick="setK1_1('_SPSYS', _ROTA-1)"><center>Annahme   </center></li>
                    <li id="mp-4" onclick="pass()">   <center>Pass      </center></li>
                    <li id="mp-5" onclick="selAtk()"> <center>Links     </center></li>
                    <li id="mp-6" onclick="attack()"> <center>Angriff   </center></li>
                    <li id="mp-7" onclick="K2()">     <center>K2        </center></li>
                </ul>
            </div>}})dnl
# Transitions during receive
define({{_BSETTINGPOS}}, {{xF(230, 20)}})dnl
define({{_SETTINGPOS}},{{xF(225,35)}})dnl
define({{_LFHSTARTATK}},{{xF(  5, 100)}})dnl
define({{_CFHSTARTATK}},{{xF(175, 100)}})dnl
define({{_RFHSTARTATK}},{{xF(300, 100)}})dnl
define({{_RBHSTARTATK}},{{xF(300, 185)}})dnl
# Transitions during Attack
# Left Front Attack,
#   Left Hitter
define({{_LFATKB}},  {{xF( 55,35)}})dnl
define({{_LFATKLH}}, {{xF( 25, 45)}})dnl
define({{_LFATKCH}}, {{xF(120, 65)}})dnl
define({{_LFATKRH}}, {{xF(255, 70)}})dnl
# 
# Center Front attack
define({{_CFATKB}},  {{xF(180, 35)}})dnl
define({{_CFATKLH}}, {{xF( 80, 60)}})dnl
define({{_CFATKCH}}, {{xF(160, 45)}})dnl
define({{_CFATKRH}}, {{xF(255, 65)}})dnl
#
# Right Front attack
define({{_RFATKB}},  {{xF(295, 35)}})dnl
define({{_RFATKLH}}, {{xF( 85, 45)}})dnl
define({{_RFATKCH}}, {{xF(160, 75)}})dnl
define({{_RFATKRH}}, {{xF(275, 45)}})dnl
# Right Back attack
define({{_RBATKB}},  {{xF(295,120)}})dnl
define({{_RBATKLH}}, {{xF( 85, 45)}})dnl
define({{_RBATKCH}}, {{xF(160, 75)}})dnl
define({{_RBATKRH}}, {{xF(285,140)}})dnl
define({{_CANVAS_HTML}}, {{<div class="col-6 col-s-9" id="fabric-canvas-wrapper"><!-- center -->
                <canvas id="c" style="border: 3px solid black;"  width="400" height="400">
	                <img src="ball_t.png"  width="10%" height="10%" id="my-ball" >
     	            This text is displayed if your browser does not support HTML5 Canvas.
                </canvas><!-- /center -->
            </div>
}})dnl
define({{_CANVAS_JS}},{{var canvas = new fabric.Canvas('c');
         canvas.add( createCourt() );
         var msg = new fabric.Text('/', {
           fontFamily: 'Arial',
           fontSize: 12,
           fill: 'black',
           fontWeight: 'bold',
           left: 50,
           top: 35,
           selectable: false
         });
         canvas.add(msg);
         canvas.on({'object:moved': function(e){
         msg.set('text', 'P:' + (e.target.get('left')-34).toFixed(2) + '/'
                              + (e.target.get('top')-34).toFixed(2)); } });
         var B = new fabric.Image(document.getElementById('my-ball'), {
           left: 150,
           top:  0
         });
         B.scale(0.5);
         B.set('lockScalingX', true);
         B.set('lockScalingY', true);
         B.hasControls = B.hasBorders = false;
         canvas.add(B);
         let riegel = 0;}})dnl
define({{_PLAYERS_JS}},{{let plys = findGetParameter("p");
         if (plys) {
             let players = plys.split(";");
             Q1 = makeAllPlayersExt(_ROTA, "_SPSYS", players);
             var param="";
             for(x of players){
                 param += ";" + x;
             }
             for(i=0; i<7; i++){
                 if(i != _ROTA){
                     var lnk = document.getElementById("nav"+i);
                     lnk.href = lnk.href + "?p=" + param.slice(1);
                 }
             }
         }else{
             Q1 = makeAllPlayers(_ROTA, "_SPSYS");
         }
         Q1.forEach(function(item){canvas.add(item);});}})dnl
define({{BULLSHIT}},{{
        <script>
	  var m42_lcr = [
            [2, 1, 3, 5, 4, 0],
            [1, 3, 2, 4, 0, 5],
            [3, 2, 1, 0, 5, 4],
            [2, 1, 3, 5, 4, 0],
            [1, 3, 2, 4, 0, 5],
            [3, 2, 1, 0, 5, 4]
	    ];
	  var m42_3a = [
	    [4,5,1], [3,4,0], [4,5,0],
	    [4,5,1], [3,4,0], [2,5,0]
	  ];
	  var m42_4a = [
	    [3,4,5,1], [3,4,0,1], [3,4,5,0],
            [3,4,5,1], [3,4,0,1], [2,5,0,1]
	  ];
	  var m51_3a = [
	    [4,5,1], [3,4,0], [2,5,0],
	    [4,5,1], [3,4,0], [2,5,0]
	  ];
	  var m51_4a = [
	    [3,4,5,1], [3,4,0,1], [2,5,0,1],
            [4,5,0,1], [4,5,0,1], [4,5,0,2]
	  ];
 
	  // {Left/Center/Right}-{Back/Front}
          var LB, CB, RB, LF, CF, RF;
	  var Phase = 0;
	  var Q1;
        </script>
      </div>
}})dnl
define({{_FOOTER}}, {{<p>
                syscmd({{date --rfc-2822}})<br>(C)THD
            </p>}})dnl

define({{_SPNAV}}, {{<p>ifelse($1,5_1,,<a href="5_1_rot$2.html" id="nav0">)5-1 ifelse($1,5_1,,</a>)</p>
                    <p>ifelse($1,4_2,,<a href="4_2_rot$2.html" id="nav0">)4-2 ifelse($1,4_2,,</a>)</p>}})dnl

define({{_ROTANAV}}, {{<p>ifelse($2,1,, <a href="$1_rot1.html" id="nav1">)Rotation 1ifelse($2,1,,</a>)</p>
                    <p>ifelse($2,2,, <a href="$1_rot2.html" id="nav2">)Rotation 2ifelse($2,2,,</a>)</p>
                    <p>ifelse($2,3,, <a href="$1_rot3.html" id="nav3">)Rotation 3ifelse($2,3,,</a>)</p>
                    <p>ifelse($2,4,, <a href="$1_rot4.html" id="nav4">)Rotation 4ifelse($2,4,,</a>)</p>
                    <p>ifelse($2,5,, <a href="$1_rot5.html" id="nav5">)Rotation 5ifelse($2,5,,</a>)</p>
                    <p>ifelse($2,6,, <a href="$1_rot6.html" id="nav6">)Rotation 6ifelse($2,6,,</a>)</p>
                    <h2><a href="index.html">Übersicht</a></h2>
                    <h2><a href="spielsys.zip">Download</a></h2>}})dnl

define(_AN51_3_1,{{xF( 65,210)}})dnl
define(_AN51_3_2,{{xF(150,240)}})dnl
define(_AN51_3_3,{{xF(235,210)}})dnl

define(_AN51_4_1,{{xF( 37.5, 210)}})dnl
define(_AN51_4_2,{{xF(112.5, 240)}})dnl
define(_AN51_4_3,{{xF(187.5, 240)}})dnl
define(_AN51_4_4,{{xF(262.5, 210)}})dnl

divert(0)
