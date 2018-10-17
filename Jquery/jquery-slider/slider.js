/**
 * Created by infose on 2018-10-17.
 */
/**
 * Created by infose on 2018-10-17.
 */
function onSlide(objName, direct) {
    var obj = $(objName+' ul li');
    var nextObj;
    $.each(obj, function(key, value){
        if( $(this).css('display') == 'block' || $(this).css('display') == 'list-item' || $(this).css('display') == 'inline-block' ) {
            var p = $(this).offset();
            $(this).hide("slide", {direction: direct}, "slow");
            if (direct == 'left') nextObj = obj.get(key + 1) ? obj.get(key + 1) : obj.get(0);
            else nextObj = obj.get(key - 1) ? obj.get(key - 1) : obj.get(obj.length);

            $(nextObj).show("slide", { direction: direct == 'left' ? 'right' : 'left' }, "slow");

            return false;
        }
    });
}