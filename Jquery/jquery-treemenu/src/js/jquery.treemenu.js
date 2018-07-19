(function($){
  $.fn.treemenu = function(options){
    /*
     options
        header : 메뉴 상단에 내용 추가하기
        header_content : 메뉴 상단에 내용 추가하기
        header_open : 오픈에 사용될 단어
        header_close : 메뉴 상단에 내용 추가하기
   */
    var defaults = {
      self:'',
      header:false,
      header_content:'',
      header_open:'',
      header_close:''
    };

    options.obj = this;
    var _options = $.extend({}, defaults, options);

    if( _options.header ){
        if( _options.header_content != '' ){
          var header_wrap = $('<div />');
          header_wrap.append( _options.header_content );
          if( _options.header_open != '' ) header_wrap.append( '<span class="btn btn-default tree-open">'+_options.header_open+"</span>" );
          if( _options.header_close != '' ) header_wrap.append( '<span class="btn btn-default tree-close">'+_options.header_close+"</span>" );
          $(this).before(header_wrap);
        }else{
           $(this).before('<div style="padding:3px;">키워드:<input type="text" id="tree-word" /> <span class="btn btn-default tree-close">전체보기</span> <span class="btn btn-default tree-open">열기</span></div>');
        }
    }

    this.children('ul').children('li').each(function(){  // 첫 아이템 폴더 or 파일
      if( $(this).has('ul').length > 0 ){
        $(this).addClass('folder');
        $(this).prepend('<i class="icon-folder-close"></i>');
        $(this).children('ul').each(function(){ // 서브메뉴
         $(this).addClass('sub-menus');
        });
      }
      $(this).children('ul').hide();

      $(this).on('click', 'label', function(){
        if( $(this).parent().children('ul').css('display') == 'none' ){
          $(this).parent().children('i').removeClass('icon-folder-close');
          $(this).parent().children('i').addClass('icon-folder-open');
          $(this).parent().children('ul').show();
        }else{
          $(this).parent().children('i').removeClass('icon-folder-open');
          $(this).parent().children('i').addClass('icon-folder-close');
          $(this).parent().children('ul').hide();
        }
      });

    })

    $(".tree-open").click(function(e){
      onTreeMenuEvent.open( _options.self );
    });

    $(".tree-close").click(function(){
      onTreeMenuEvent.close( _options.self );
    });

    $('#tree-word').keyup(function(){
      var str = $(this).val();
      if( str.length > 1 || str.length < 1 ){
        onTreeMenuEvent.search( _options.self, str );
      }
    });

    var onTreeMenuEvent = {
      'search':function(obj, word){
        $(obj).children('ul').children('li').each(function(){
          var is_word = false;
          $(this).children('ul').children('li').each(function(){
            if(  ($(this).text()).indexOf(word) != -1 ) is_word = true;
          });

          if(is_word){
            $(this).children('i').removeClass('icon-folder-close');
            $(this).children('i').addClass('icon-folder-open');
            $(this).children('ul').show();
          }else{
            $(this).children('i').removeClass('icon-folder-open');
            $(this).children('i').addClass('icon-folder-close');
            $(this).children('ul').hide();
          }
        });
      },
      'open':function(obj){
        $(obj).children('ul').children('li').each(function(){
          $(this).children('i').removeClass('icon-folder-close');
          $(this).children('i').addClass('icon-folder-open');
          $(this).children('ul').show();
        });
      },
      'close':function(obj){
        $(obj).children('ul').children('li').each(function(){
          $(this).children('i').removeClass('icon-folder-open');
          $(this).children('i').addClass('icon-folder-close');
          $(this).children('ul').hide();
        });
      }
    };

    return onTreeMenuEvent;
  };

})(jQuery);
