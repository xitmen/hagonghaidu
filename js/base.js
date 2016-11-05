var setRem = function( doc, win ){
	var docEl = doc.documentElement,
		resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
		recalc = function () {
			var clientWidth = docEl.clientWidth;
			if (!clientWidth) return;
			docEl.style.fontSize = 20 * (clientWidth / 320) + 'px';
		};

	if (!doc.addEventListener) return;
	win.addEventListener(resizeEvt, recalc, false);
	doc.addEventListener('DOMContentLoaded', recalc, false);
}

setRem( document, window );

window.onresize = (function( doc, win ){
	setRem( doc, win );
})( document, window );

var getUrlParam = function(name, url) {
	var str = url || window.location.search || window.location.hash,
		result = null;
	if (!name || str === '') {
		return result
	}
	result = str.match(new RegExp('(^|&|[\?#])' + name + '=([^&]*)(&|$)'));
	return result === null ? result: decodeURIComponent(result[2])
};

$(function(){
	var topMenu = $('.icon_menu');
	var navLeft = $('.lef_nav');
	var oBack = $('.icon_back');
	var oBody = $('body');
	var type = getUrlParam('type');
	var topNavList = $('.top_nav a');
	if( type == 'school' ) {
		topNavList.eq(0).addClass('on');
	}else if( type == 'knowledge' ){
		topNavList.eq(1).addClass('on');
	}else if( type == 'search' ){
		topNavList.eq(2).addClass('on');
	}
	oBack.on('click',function(){
		history.go(-1);
	});
	topMenu.on('click',function(){
		var _me = $(this);
		if( navLeft.hasClass('close') ){
			navLeft.removeClass('close').addClass('open');
		}else{
			navLeft.removeClass('open').addClass('close');
		}
		return false;
	});
	oBody.on('click',function(){
		navLeft.removeClass('open').addClass('close');
	});

	(function(){
		var w = document.body.clientWidth;
		$('.banner').each(function(){
			var _this = $(this),
				listBox = _this.find('.banner_img'),
				pageInfo = _this.find('.banner_dis'),
				imgList = listBox.find('img'),
				len = imgList.length;
			_this.attr('w',w).attr('num',0).attr('max',len);
			listBox.css({width: w* len});
			if( pageInfo.get(0) ){
				var iList = [];
				$.each( imgList, function( n ){
					if( !n ){
						iList.push('<i class="on"></i>');
					}else{
						iList.push('<i></i>');
					}
				});
				pageInfo.html( iList.join('') );
			}
		});
		loop();
	})();

	function loop(){
		var loopBox = $(".banner");
		var proBox = loopBox.find('.banner_img');
		var loading = true;
		var _startY = 0;
		var _startX = 0;
		var _moveX = 0;
		var _moveY = 0;
		var _absMoveX = 0;
		var _absMoveY = 0;
		var distance = 90;
		var __isScr = true;
		var thisLoopBox;
		var _move = Number( loopBox.attr('w') );
		var _index = Number( loopBox.attr('num') );
		var _max = Number( loopBox.attr('max') );
		var pageInfo;
		var _pageInfo;
		var _this;
		var getPageInfo = function(){
			var pageMapHtml = {
				base: '<p>@{content}</p>',
				video: '<div class="video"><video width="320" height="240" controls><source src="@{video_url}" type="video/mp4">您的浏览器不支持 video 标签。</video></div>',
				product: '<div class="product"></div>'
			}
		};
		// 绑定菜品区域
		proBox.on('touchstart',function( e ){
			if( loading ){
				fnTouches( e );
				fnTouchstart( e );
			}
		});
		proBox.on('touchmove',function( e ){
			if( loading){
				fnTouches( e );
				fnTouchmove( e );
			}
		});
		proBox.on('touchend',function(  ){
			_this = $(this);
			if( loading ){
				fnTouchend( $( this ) );
			}
		});
		// touches
		function fnTouches( e ){
			if(!e.touches){
				e.touches = e.originalEvent.touches;
			}
		}
		// touchstart
		function fnTouchstart( e ){
			_startX = e.touches[0].pageX;
			_startY = e.touches[0].pageY;
		}
		// touchmove
		function fnTouchmove( e ){
			_curX = e.touches[0].pageX;
			_curY = e.touches[0].pageY;
			_moveX = _curX - _startX;
			_moveY = _curY - _startY;
		}
		// touchend
		function fnTouchend( _this ){
			_absMoveX = Math.abs( _moveX );
			thisLoopBox = _this.parent('.banner');
			_move = Number( thisLoopBox.attr('w') );
			_index = Number( thisLoopBox.attr('num') );
			_max = Number( thisLoopBox.attr('max') );
			_pageInfo = thisLoopBox.find('.banner_dis i');
			pageInfo = thisLoopBox.find('.banner_dis');
			if( __isScr && _absMoveX > distance ){
				if( _moveX < 0 ){
					move( 'l', _this );
				}else{
					move( 'r', _this );
				}
				loading = false;
			}
			_startY = 0;
			_startX = 0;
			_moveX = 0;
			_moveY = 0;
			_absMoveX = 0;
			_absMoveY = 0;
		}
		function move( type, _this ){
			if( type === 'l' ){
				if( _index > _max-2 ){
					_index = _max-1;
				}else{
					_index++;
				}
				moveValue = -( _index *_move );
			}else{
				if( _index < 1 ){
					_index = 0;
				}else{
					_index--;
				}
				moveValue = -(_index * _move);
			}
			_this.animate({
				left: moveValue
			}, 500,function(){
				loading = true;
				if( pageInfo.get(0) ){
					_pageInfo.removeClass('on');
					_pageInfo.eq(_index).addClass('on');
				}
				thisLoopBox.attr( 'num' , _index );
			} );
		}
	}
})