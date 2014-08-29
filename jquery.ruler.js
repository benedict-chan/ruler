/**
 * jQuery.Ruler v1.1
 * Add Photoshop-like rulers and mouse position to a container element using jQuery.
 * http://ruler.hilliuse.com
 *
 * Dual licensed under the MIT and GPL licenses.
 * Copyright 2013 Hillius Ettinoffe http://hilliuse.com
 */
;(function( $ ){

	$.fn.ruler = function(options) {

		var defaults = {
			vRuleSize: 18,
			hRuleSize: 18,
			showCrosshair : true,
			showMousePos: true
		};//defaults
		var settings = $.extend({},defaults,options);

		var hRule = '<div class="ruler hRule"></div>',
				vRule = '<div class="ruler vRule"></div>',
				corner = '<div class="ruler corner"></div>',
				vMouse = '<div class="vMouse"></div>',
				hMouse = '<div class="hMouse"></div>',
				mousePosBox = '<div class="mousePosBox">x: 50%, y: 50%</div>';

		var init = $('.hRule').length;

		if (!Modernizr.touch) {
			// Mouse crosshair
			if (settings.showCrosshair ) {
				if(!($('.vMouse').length)){
					$('body').append(vMouse, hMouse);
				}
			}
			else{
				$('.vMouse').remove();
				$('.hMouse').remove();
			}
			// Mouse position
			if (settings.showMousePos) {
				if(!($('.mousePosBox').length)){
					$('body').append(mousePosBox);
				}
			}
			else{
				$('.mousePosBox').remove();
			}
			// If either, then track mouse position
			if (settings.showCrosshair || settings.showMousePos) {
				$(window).mousemove(function(e) {
					if (settings.showCrosshair) {
						$('.vMouse').css("top",e.pageY-($(document).scrollTop())+1);
						$('.hMouse').css("left",e.pageX+1);
						//-($(window).scrollTop())
					}
					if (settings.showMousePos) {
						$('.mousePosBox').html("x:" + (e.pageX-settings.vRuleSize) + ", y:" + (e.pageY-settings.hRuleSize) ).css({
							top: e.pageY-($(document).scrollTop()) + 16,
							left: e.pageX + 12
						});
					}
				});
			}
		}

		//resize
		if(!init){
			$(window).resize(function(e){
				var $hRule = $('.hRule');
				var $vRule = $('.vRule');
				$hRule.empty();
				$vRule.empty().height(0).outerHeight($vRule.parent().outerHeight());

				redrawRuler($hRule, $vRule);
			});
		}//resize

		var redrawRuler = function($hRule, $vRule){

			// Horizontal ruler ticks
			var tickLabelPos = settings.vRuleSize;
			var newTickLabel = "";
			while ( tickLabelPos <= $hRule.width() ) {
				if ((( tickLabelPos - settings.vRuleSize ) %50 ) == 0 ) {
					newTickLabel = "<div class='tickLabel'>" + ( tickLabelPos - settings.vRuleSize ) + "</div>";
					$(newTickLabel).css( "left", tickLabelPos+"px" ).appendTo($hRule);
				} else if ((( tickLabelPos - settings.vRuleSize ) %10 ) == 0 ) {
					newTickLabel = "<div class='tickMajor'></div>";
					$(newTickLabel).css("left",tickLabelPos+"px").appendTo($hRule);
				} else if ((( tickLabelPos - settings.vRuleSize ) %5 ) == 0 ) {
					newTickLabel = "<div class='tickMinor'></div>";
					$(newTickLabel).css( "left", tickLabelPos+"px" ).appendTo($hRule);
				}
				tickLabelPos = (tickLabelPos + 5);
			}//hz ticks

			// Vertical ruler ticks
			tickLabelPos = settings.hRuleSize;
			newTickLabel = "";
			while (tickLabelPos <= $vRule.height()) {
				if ((( tickLabelPos - settings.hRuleSize ) %50 ) == 0) {
					newTickLabel = "<div class='tickLabel'><span>" + ( tickLabelPos - settings.hRuleSize ) + "</span></div>";
					$(newTickLabel).css( "top", tickLabelPos+"px" ).appendTo($vRule);
				} else if (((tickLabelPos - settings.hRuleSize)%10) == 0) {
					newTickLabel = "<div class='tickMajor'></div>";
					$(newTickLabel).css( "top", tickLabelPos+"px" ).appendTo($vRule);
				} else if (((tickLabelPos - settings.hRuleSize)%5) == 0) {
					newTickLabel = "<div class='tickMinor'></div>";
					$(newTickLabel).css( "top", tickLabelPos+"px" ).appendTo($vRule);
				}
				tickLabelPos = ( tickLabelPos + 5 );
			}//vert ticks
		};

		var drawGrid = function(top, left, width, height, background, color){
			var rGrid = $('<div></div>')
			.addClass('rGrid')
			.width(width)
			.height(height)
			.css('left', left + settings.hRuleSize)
			.css('top', top + settings.vRuleSize);

			if(background){
				rGrid.css('background', background);
			}
			if(color){
				rGrid.css('color', color);
			}

			$('<div></div>').addClass('rGridPos rGridText').text(' (' + left + ', '  + top + ')').appendTo(rGrid);
			$('<div></div>').addClass('rGridWidth rGridText').text('W:' + width ).width(width).appendTo(rGrid);
			$('<div></div>').addClass('rGridHeight rGridText').text('H:' + height ).height(20)
			.css('top', ((height/2) - 10)).appendTo(rGrid);

			$('<div></div>').addClass('rGridClose rGridText').text('X')
			.on('click', function(){ $(this).closest('.rGrid').remove(); })
			.appendTo(rGrid);

			rGrid.appendTo('body');
		};


		if(settings.drawGrid){
				drawGrid(settings.drawGrid.top, settings.drawGrid.left, settings.drawGrid.width, settings.drawGrid.height
				,settings.drawGrid.background, settings.drawGrid.color);
		}



		return this.each(function() {
			var $this = $(this);

			// Attach rulers

			if(!init){
						// Should not need 1 min padding-top of 1px but it does
						// will figure it out some other time
						$this.css("padding-top", settings.hRuleSize + 1 + "px");
						if (settings.hRuleSize > 0) {
							$(hRule).height(settings.hRuleSize).prependTo($this);
						}

						if (settings.vRuleSize > 0) {
							var oldWidth = $this.outerWidth();
							$this.css("padding-left", settings.vRuleSize + 1 + "px").outerWidth(oldWidth);
							$(vRule).width(settings.vRuleSize).height($this.outerHeight()).prependTo($this);
						}

						if ( (settings.vRuleSize > 0) && (settings.hRuleSize > 0) ) {
							$(corner).css({
								width: settings.vRuleSize,
								height: settings.hRuleSize
							}).prependTo($this);
						}


						var $hRule = $this.children('.hRule');
						var $vRule = $this.children('.vRule');

						redrawRuler($hRule, $vRule);
			}
		});//each

	};//ruler
})( jQuery );
