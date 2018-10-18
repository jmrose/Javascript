
# Top menu

```
<script>
    $(window).scroll(function(){
       if( $($('body').find('.top')).length < 1 ) {
           $('body').append('<div class="top" style="position:absolute;top:120px;right:5%;"><a ' +
               'class="btn btn-default" href="javascript://" onclick="$(\'html, body\').animate({scrollTop:0}, \'slow\');"><i class="fa fa-arrow-up"></i>TOP</a></div>');
       }
       $('.top').css('top', $(document).scrollTop() + $(window).height() - 100);
    });
</script>
```
