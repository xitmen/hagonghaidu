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

String.prototype.format = function(O){
	var s = this.replace(/\@\{(\w+)\}/g, function(t, _o){
		return O[_o];
	});
	return s;
};

$(function(){
	var topMenu = $('.icon_menu');
	var navLeft = $('.lef_nav');
	var oBody = $('body');
	var type = getUrlParam('type');
	var topNavList = $('.top_nav a');
	$.DATA = $.DATA || [];
	$.DATA = $.DATA.concat( window.knowledge, window.model , window.video );
	if( type == 'school' ) {
		topNavList.eq(0).addClass('on');
	}else if( type == 'knowledge' ){
		topNavList.eq(1).addClass('on');
	}else if( type == 'search' ){
		topNavList.eq(2).addClass('on');
	}
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

	var pageMapHtml = {
			search: '<div class="top_title"><h2><i class="icon_back"></i>@{xh}</h2></div><div class="product"><ul><li><label>品牌</label>:@{pp}</li><li><label>型号</label>:@{xh}</li><li><label>工作空间</label>:@{gzkj}</li><li><label>有效负荷</label>:@{yxfh}</li><li><label>工作空间范围</label>:@{gzkjfw}</li><li><label>负荷范围</label>:@{fhfw}</li><li><label>系列</label>:@{xl}</li></ul><a href="data/html/jxsc/@{html}">查看具体详情</a> </div>',
			school: '<div class="top_title"><h2><i class="icon_back"></i>@{title}</h2></div><div class="box"><video controls><source src="@{url}" type="video/mp4">您的浏览器不支持 video 标签。</video></div>',
			knowledge: '<div class="top_title"><h2><i class="icon_back"></i>@{title}</h2></div><iframe src="data/html/xzs/@{html}"></iframe></div>',
		},
		pageIndexType = {
			school: '<dl class="school"><dt>@{title}</dt><dd><a href="info.html?type=@{type}&id=@{id}&vdieo-url=@{url}"><img src="data/img/@{img}" /></a></dd></dl>',
			knowledge: '<li><a href="info.html?type=@{type}&id=@{id}">@{title}</a></li>',
			search: '<li><a href="info.html?type=@{type}&id=@{id}">@{xh}</a></li>'
		};
	var home = $('#home').get(0);
	var info = $('#info').get(0);
	var search = $('#search').get(0);
	var nId = getUrlParam('id');
	var pageType = getUrlParam( 'type' );

	if( home ){
		var htmlMode = pageIndexType[ pageType ];
		var htmlArry = [];
		var con = $('.item_list');
		$.each( $.DATA, function(){
			if( this.type == pageType ){
				htmlArry.push( htmlMode.format( this ) );
			}
		});
		con.html( htmlArry.join('') );
	}

	if( info ){
		var htmlMode = pageMapHtml[ pageType ];
		var htmlArry = [];
		var con = $('.box');
		$.each($.DATA, function(){
			if( this.id == nId ){
				htmlArry.push( htmlMode.format( this ) );
			}
		});
		con.html( htmlArry.join('') );
	}

	if( search ){
		var oInput = $('.search_input input');
		var htmlMode = pageIndexType[ pageType ];

		$('.search_input button').on('click',function(){
			var str = oInput.val();
			var reg = new RegExp( str, 'ig' );
			var data = [];
			var htmlData = [];
			var con = $('.item_list');
			$.each( window.model, function(){
				for( var n in this ){
					if( n != 'id' ){
						if( reg.test( String( this[n] ).toLowerCase() ) ){
							data.push( this );
							break;
						}
					}
				}
			});
			if( data.length > 0 ){
				$.each(data, function(){
					htmlData.push( htmlMode.format( this ) );
				});
			}else{
				htmlData.push( '<li>未查到相关信息</li>' );
			}
			con.html( htmlData.join('')).show();
		});
	}

	$('.icon_back').on('click',function(){
		history.go(-1);
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