/*jslint browser: true */ /*global window, $ */
(function(){
var page, pageID = 'app';
var A = window.A = window.A || {};
A.page = A.page || {};

page = A.page[pageID] = {
	'shuffle': function(a){
		var i, o, t, a;

    	for (i = a.length - 1; i > 0; i--){
			o = Math.floor(Math.random() * (i + 1));
			t = a[i];
			a[i] = a[o];
			a[o] = t;
    	}

		return a;

	},
	'startTimer': function(){
		var i=o=59, a = [0, 0];

		/*

		12: First thing to do is make sure the timer is cleared by calling "clearTimer".

		*/

		page.clearTimer();

		/*

		14: Start timing the game with a function called by a js setInterval function every 1000 miliseconds.

		*/

		page.items.timer = function(){

			i=2;

			while(i--){

				page.items.sectionTimer.find('label').eq(i).html((a[i] < 9 ? '0' + a[i] : a[i]));

			}

			/*

			17: Adjust the array values accordingly.

			*/

			a = [
				(a[1] >= o ? (+a[0]+1) : a[0]),
				(a[1] >= o ? 0 : (+a[1]+1)),
			];

			return false;

		};

		/*

		15: Set the interval as a varible so it can be cleared if needs be.

		*/

		page.items.timerIntv = setInterval(page.items.timer, 1000);

		/*

		16: Call the timer immediately so there isn;t a 1000 milisecond delay.

		*/

		return page.items.timer();

	},
	'clearTimer': function(){
		var i=2;

		/*

		13: Clear the interval if set & set the timer to '00:00'.

		*/

		clearInterval(page.items.timerIntv);

		while(i--){

			page.items.sectionTimer.find('label').eq(i).html('00');

		}

		return false;

	},
	'gameComence': function(){
		var i, c, d, m, r, u=2, a=400, h='', s=[];

		/*

		9: Make sure all moves are reset to "0".

		*/

		page.items.body.find('span.moves').html(page.items.moves=0);

		/*

		10: Make sure all stars are displayed.

		*/

		page.items.body.find('ul.stars li').show();

		/*

		11: Start the game timer.

		*/

		page.startTimer();

		/*

		18: We need two of each symbol so we loop over the "page.items.symbols" twice.

		*/

		while(u--){

			/*

			19: Shuffle the symbols.

			*/

			r = page.shuffle(page.items.symbols);

			/*

			20: We want to then shuffle the two shuffled arrays, so push them all into one array and shuffle this array too.

			*/

			for(i=0; i < r.length; i++){

				s.push(r[i]);

			}

		}

		s = page.shuffle(s), i = s.length;

		/*

		21: Loop over every item in the array and create the html markup.

		*/

		while(i--){

			h += '<li class="card"><i class="fa ' + s[i] + '"><input type="hidden" value="' + s[i] + '" /></i></li>';

		}

		/*

		22: Append html markup and set up a click function.

		*/

		page.items.deck.html(h).find('li').on('click', function(){

			if(!page.items.active){

				++page.items.active;

				var e=$(this), v=e.find('input').val();

				e.addClass('show open');

				/*

				23: "c" will be the previous card slected so if "c" = "v" its a match and "m" will be true.

				*/

				m = c === v;
				c = v;

				if(page.items.deck.find('li.open').not('li.match').length > 1){

					if(m){

						/*

						24: "m" is true... so it's a match.

						*/

						page.items.deck.find('li.open').addClass('match');


						/*

						25: Set "c" to null.

						*/

						c=null;

						/*

						26: Check if the game is over by comparing the amount of cards with a class to the symbol array length.

						*/

						if(page.items.deck.find('li.match').length >= page.items.symbols.length*2){

							alert('CONGRATULATIONS, YOU HAVE WON!! It took you ' + page.items.moves + ' moves... ' + 'Well done!');


							/*

							27: Set "c" to null.

							*/

							page.clearTimer();

						}

					}
					else{

						/*

						24: "m" is false... so it's not a match.

						*/

						/*

						25: Add/remove class in a set time to show the user is was a false match.

						*/

						page.items.deck.find('li.open').not('li.match').addClass('noMatch');

						setTimeout(function(){

							page.items.deck.find('li.open').not('li.match').removeClass('noMatch show open');

						}, a);
					}

					/*

					26: Increase the moves count.

					*/

					page.items.body.find('span.moves').html(++page.items.moves);

					/*

					27: Use a switch statment to remove stars as the users moves increase.

					*/

					switch(page.items.moves){

						case 22:
							page.items.body.find('ul.stars li').eq(1).hide();
						break;

						case 12:
							page.items.body.find('ul.stars li').eq(2).hide();
						break;

					};

				}

				setTimeout(function(){

					page.items.active = 0;

				}, a);

			}

		});

		return false;

	},
	'initSetup': function(){

		/*

		3: First function called from init on page load.

		*/

		/*

		4: Call "initCreateData" first, so the symbol array is pressent.

		*/

		page.items.symbols = page.initCreateData();

		/*

		6: Set up an on click function to start/restart the game.

		*/

		page.items.body.find('i.fa-play').on('click', function(){

			/*

			7: Add/remove classes and alter text when user starts.

			*/

			$(this).removeClass('fa-play').addClass('fa-repeat').prev('span').html('Click to restart');

			/*

			8: Set up the game or restart the game by calling "gameComence".

			*/

			page.gameComence();

		});

		return false;

	},
	'initCreateData': function(){

		/*

		5: Load up the symbols into a global var called "page.items.symbols".

		*/

		return [
			'fa-diamond',
			'fa-paper-plane-o',
			'fa-anchor',
			'fa-bolt',
			'fa-cube',
			'fa-leaf',
			'fa-bicycle',
			'fa-bomb',
		];

	},
	'init': function(){

		/*
		1: Set up the basic varibles & elements.

		*/

		page.items.moves		= 0;
		page.items.active		= 0;
		page.items.timerIntv	= 0;

		page.items.body			= $('body');
		page.items.deck			= page.items.body.find('ul.deck');
		page.items.sectionTimer = page.items.body.find('section.timer');

		/*

		2: Start by calling the "initSetup" function.

		*/

		return page.initSetup();

	},
	'items': {}
}

$(page.init);

})();
//# sourceURL=/js/app.js*/
