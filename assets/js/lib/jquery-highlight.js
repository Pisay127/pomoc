jQuery.fn.highlight = function(new_color) {
    $(this).each(function() {
        var original_bg_color = $(this).css('background-color');
        console.log(original_bg_color);
        $(this).animate({
            backgroundColor: new_color
        }, 250
        ).animate({
            backgroundColor: original_bg_color
        }, 250)
    });
};