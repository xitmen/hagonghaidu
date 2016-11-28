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
			search_info: '<div class="product"><ul><li><label>品牌</label>:@{pp}</li><li><label>型号</label>:@{xh}</li><li><label>工作空间</label>:@{gzkj}</li><li><label>有效负荷</label>:@{yxfh}</li><li><label>工作空间范围</label>:@{gzkjfw}</li><li><label>负荷范围</label>:@{fhfw}</li><li><label>系列</label>:@{xl}</li></ul></div><iframe style="width:16rem" src="http://dev.17gu.cn/html/hagonghaidu/jxsc/@{html}"></iframe>',
			school_info: '<div class="video"><video controls="controls" autoplay="autoplay"><source src="@{url}" type="video/mp4">您的浏览器不支持 video 标签。</video></div>',
			knowledge_info: '<iframe src="http://dev.17gu.cn/html/hagonghaidu/xzs/@{html}"></iframe>',
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
		var htmlData = [];
		if( data.length > 0 ){
			$.each(data, function(){
				var obj = $(htmlMode.format( this ));
				var _self = this;
				con.append( obj );
				obj.on('click',function(){
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
			obj.on('click',function(){
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
		var h = $(document).height();
		var w = $(document).width();
		var type = info.attr('type');
		if( type == 'school' ) {
			topNavList.eq(0).addClass('on');
		}else if( type == 'knowledge_info' ){
			topNavList.eq(1).addClass('on');
		}else if( type == 'search_info' ){
			topNavList.eq(2).addClass('on');
		}
		var nId = window.name;
		var htmlMode = pageMapHtml[ type ];
		var DATA = infoData[ type ];
		var con = $('.box');
		var htmlArry = [];
		if( type == 'school_info' ){
			var webPath = DATA.url;
			window.uexOnload = function() {
				uexVideo.onPlayerStatusChange = function(info){
					var data = JSON.parse(info);
					document.getElementById('info1').innerHTML  = "播放器状态:" + data.status;
				}
				uexVideo.onPlayerClose = function(info){
					var data = JSON.parse(info);
					document.getElementById('info1').innerHTML  = "播放路径:" + data.src + "\n结束时的播放时间:" + data.currentTime;
				}
				uexVideo.onRecordFinish = function(info){
					var data = JSON.parse(info);
					localPath = data.path;
					document.getElementById('info2').innerHTML  = "压缩进度:" + progress + "\n录制的视频地址:"+localPath;
				}
				uexVideo.onExportWithProgress = function(p){
					progress = p;
					document.getElementById('info2').innerHTML = "压缩进度:" + progress + "\n录制的视频地址:"+localPath;
				}
			};
			function recordVideo(){
				var params={
					maxDuration:document.getElementById('maxDuration').value,
					qualityType:document.getElementById('qualityType').value,
					bitRateType:document.getElementById('bitRateType').value,
					fileType:document.getElementById('fileType').value,
				}
				uexVideo.record(JSON.stringify(params));
			}
			function openPlayer(path){
				var param = {
					src:path,
					startTime:1,
					autoStart:true,
					forceFullScreen:false,
					showCloseButton:true,
					showScaleButton:true,
					width:320,
					height:240,
					x:10,
					y:400,
					scrollWithWeb:true,
				}
				uexVideo.openPlayer(JSON.stringify(param));
			}
			openPlayer(webPath);
		}else{
			$.each( DATA, function(){
				if( this.id == nId ){
					htmlArry.push( htmlMode.format( this ) );
				}
			});
			con.html( htmlArry.join('') );
		}

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

	$('.icon_back').on('click',function(){
		history.go(-1);
	});

})