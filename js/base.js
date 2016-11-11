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
	var home = $('#home');
	var info = $('#info');
	var search = $('#search');
	var infoData = {
		'knowledge_info': window.knowledge,
		'school_info': window.video,
		'search_info': window.model
	};
	var homeData = {
		'knowledge': window.knowledge,
		'school': window.video,
		'search': window.model
	};
	var locationHref = {
		'knowledge': 'knowledge_info.html',
		'school': 'school_info.html',
		'search': 'search_info.html'
	};
	var pageMapHtml = {
			search_info: '<div class="top_title"><h2><i class="icon_back"></i>@{xh}</h2></div><div class="box"><div class="product"><ul><li><label>品牌</label>:@{pp}</li><li><label>型号</label>:@{xh}</li><li><label>工作空间</label>:@{gzkj}</li><li><label>有效负荷</label>:@{yxfh}</li><li><label>工作空间范围</label>:@{gzkjfw}</li><li><label>负荷范围</label>:@{fhfw}</li><li><label>系列</label>:@{xl}</li></ul></div></div><div></div>',
			school_info: '<div class="top_title"><h2><i class="icon_back"></i>@{title}</h2></div><div class="box"><video controls preload><source src="@{url}" type="video/mp4">您的浏览器不支持 video 标签。</video></div>',
			knowledge_info: '<div class="top_title"><h2><i class="icon_back"></i>@{title}</h2></div><div class="box"></div>',
		};
	var pageIndexType = {
			school: '<dl class="school"><dt>@{title}</dt><dd><img src="data/img/@{img}" /></dd></dl>',
			knowledge: '<li>@{title}</li>',
			search: '<li>@{xh}</li>'
		};

	function setNid( id, url ){
		window.name = id;
		location.href = url;
	}

	function searchHandle( data ){
		var con = $('.item_list');
		con.empty();
		if( data.length > 0 ){
			$.each(data, function(){
				var obj = $(htmlMode.format( this ));
				var _self = this;
				con.append( obj );
				obj.off().on('click',function(){
					setNid( _self.id, url );
				})
			});
		}else{
			con.append( $('<li>未查到相关信息</li>') );
		}
		con.show();
	}

	var topNavList = $('.top_nav a');
	if( home.get(0) ){
		var type = home.attr('type');
		var url = locationHref[ type ];
		if( type == 'school' ) {
			topNavList.eq(0).addClass('on');
		}else if( type == 'knowledge' ){
			topNavList.eq(1).addClass('on');
		}else if( type == 'search' ){
			topNavList.eq(2).addClass('on');
		}
		var htmlMode = pageIndexType[ type ];
		var DATA = homeData[ type ];
		var con = $('.item_list');
		$.each( DATA, function(){
			var obj = $(htmlMode.format( this ));
			var _self = this;
			con.append( obj );
			obj.off().on('click',function(){
				setNid( _self.id, url );
			})
		});
		if( type == 'search' ){
			$('.search_input button').on('click',function(){
				var oInput = $('.search_input input');
				var str = oInput.val();
				var reg = new RegExp( str, 'ig' );
				var data = [];
				$.each( DATA, function(){
					for( var n in this ){
						if( n != 'id' ){
							if( reg.test( String( this[n] ).toLowerCase() ) ){
								data.push( this );
								break;
							}
						}
					}
				});
				searchHandle( data );
			});
		}
	}
	if( info.get(0) ){
		var type = info.attr('type');
		var nId = window.name;
		var htmlMode = pageMapHtml[ type ];
		var DATA = infoData[ type ];
		var con = $('.box');
		var htmlArry = [];
		$.each( DATA, function(){
			if( this.id == nId ){
				htmlArry.push( htmlMode.format( this ) );
			}
		});
		con.html( htmlArry.join('') );
	}

	topMenu.off().on('click',function(){
		if( navLeft.hasClass('close') ){
			navLeft.removeClass('close').addClass('open');
		}else{
			navLeft.removeClass('open').addClass('close');
		}
		return false;
	});

	oBody.off().on('click',function(){
		navLeft.removeClass('open').addClass('close');
	});

	$('.icon_back').off().on('click',function(){
		history.go(-1);
	});

})