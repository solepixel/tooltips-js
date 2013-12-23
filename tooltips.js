/***
 * Project: Tooltips
 * Author: Brian DiChiara
 * Website: http://www.briandichiara.com/
 * Version: 1.2
 * Description: Displays a tooltip bubble near a link referencing a hidden div.
 */

var Tooltips = {

	hide_speed : 1000,
	fade_speed : 'fast',
	additional : 10,
	close_button : false,
	close_button_html : 'x',

	init : function(){

		var $els = $('a.tooltip');

		$.each($els, function(i, el){
			var $el = $(el);
			//$el.click(function(e){ return false; });

			if($el.attr('rel')){
				var use_rel = true;
				var href = $el.attr('rel');
			} else {
				var use_rel = false;
				var href = $el.attr('href');
			}

			var timeout;
			var index = href.indexOf('#');

			if(index > -1 || use_rel){
				if(use_rel && index < 0){
					href = '#'+href;
				} else if(index > 0){
					href = href.substring(index, href.length);
				}
				var $tip = $(href);
				if($tip.length > 0){
					$tip.removeClass('hidden'); // we only needed this if JS is off
					$tip.hide();
					// let's make sure it's just inside the body tag
					$('body').append($tip);
				}
			} else {
				var $tip = $('<div class="tooltip-content" />');
				var id = 'ajax-tooltip-'+i;
				$tip.attr('id', id);
				$tip.hide();
				var response = $.ajax({
					type: 'get',
					url: href,
					async: false
                }).responseText;

                $tip.html(response);
				$('body').append($tip);
				href = '#'+id;
			}

			if($tip.length > 0){
				// strip out the hash from the href
				/*if(href != $el.attr('href') && !use_rel){
					$el.attr('href', $el.attr('href').replace(href, '') );
				}*/

				if(Tooltips.close_button){
					var $close = $('<a href="#close" class="close" />');
					$close.html(Tooltips.close_button_html);
					$tip.prepend($close);
					$close.click(function(e){
						$tip.fadeOut(Tooltips.fade_speed);
						return false;
					});
				}

				var width = $tip.outerWidth();
				var height = $tip.outerHeight();

				$tip.hover(function(over){
					clearTimeout(timeout);
				}, function(out){
					timeout = setTimeout(function(t){
						$tip.fadeOut(Tooltips.fade_speed);
					}, Tooltips.hide_speed);
				});

				$el.hover(function(over){
					var window_width = $(window).width();
					$tip.fadeIn(Tooltips.fade_speed);
					$('.tooltip-content:visible').not($tip).fadeOut(Tooltips.fade_speed); // hide any other open tooltips

					/* get some details about the link */
					var link_top = $el.offset().top;
					var link_left = $el.offset().left;
					var link_width = $el.outerWidth();
					var link_height = $el.outerHeight();

					//var tip_x = link_left - Math.round(width/2) + Tooltips.additional; // centered over link
					var tip_x = link_left + link_width + Tooltips.additional; // position to the right of the link w/a little space
					var tip_y = link_top - Math.floor(height/2); // vertical center

					if(tip_y < 0){ // make sure it doesn't hit the top of the window
						$tip.addClass('inverted');
						//tip_y = tip_y + height + $el.outerHeight(); // move below link
						tip_y = 0; // put at the top of the window
					}

					var screencheck = tip_x + width;

					if(tip_x < 0){ // make sure it doesn't hit the left side of the window
						tip_x = 0; // put at the left of the window
					} else if(screencheck > window_width){  // make sure it doesn't hit the right side of the window
						//tip_x = window_width - width; // put on right edge of screen
						tip_x = link_left - width - Tooltips.additional; // move to left of link
						$tip.addClass('reversed');
					}

					$tip.css('left', tip_x);
					$tip.css('top', tip_y);

					clearTimeout(timeout);
				}, function(out){
					timeout = setTimeout(function(t){
						$tip.fadeOut(Tooltips.fade_speed);
					}, Tooltips.hide_speed);
				});
			}
		});
	}
}