(function ($) {

    window.dallinge_animate_animations = {
        FADE_IN: 'fadeIn',
        FADE_IN_UP: 'fadeInUp',
        FADE_IN_RIGHT: 'fadeInRight',
    };

    window.dallinge_animate_element = function (selector, animationClass, onlyOnce) {
        return {selector: selector, animationClass: animationClass, onlyOnce: onlyOnce}
    };

    /***
     * Must be called once document is ready
     * @param registeredEls
     */
    window.dallinge_animate = function (registeredEls) {

        if (!registeredEls) {
            registeredEls = [];
        }

        registeredEls.push({selector: '.fadeIn-element', animationClass: 'fadeIn', onlyOnce: false});
        registeredEls.push({selector: '.fadeInUp-element', animationClass: 'fadeInUp', onlyOnce: false});
        registeredEls.push({selector: '.fadeInRight-element', animationClass: 'fadeInRight', onlyOnce: true});

        for (var i = 0; i < registeredEls.length; i++) {
            var eldef = registeredEls[i];
            eldef['elements'] = $(eldef.selector).toArray();
        }

        var $window = $(window);
        var window_height = $window.height();
        var window_top_position = $window.scrollTop();
        var window_bottom_position = (window_top_position + window_height);

        function apply_animated_class(elements, delta, animation_classes, onlyOnce) {

            $.each(elements, function () {

                var element = $(this);

                if (element.hasClass("animation-already-done-once")) {
                    return;
                }

                var element_height = element.outerHeight();
                var element_top_position = element.offset().top;
                var element_bottom_position = (element_top_position + element_height);

                if ((element_bottom_position >= window_top_position) &&
                    (element_top_position <= window_bottom_position)) {

                    if (!element.hasClass("animation-done")) {

                        if (onlyOnce) {
                            element.addClass("animation-already-done-once")
                        }

                        element
                            .removeClass("animation-done")
                            .addClass(animation_classes)
                            .removeClass("animation-normal")
                            .removeClass("animation-reverse")
                            .addClass(delta > 0 ? "animation-reverse" : "animation-normal")
                            .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                                $(this).removeClass(animation_classes)
                                    .removeClass("animation-normal")
                                    .removeClass("animation-reverse")
                                    .addClass("animation-done");

                            });
                    }
                } else {
                    element
                        .removeClass(animation_classes)
                        .removeClass("animation-normal")
                        .removeClass("animation-reverse")
                        .removeClass("animation-done");
                }
            });
        }

        function check_if_in_view(delta) {

            window_height = $window.height();
            window_top_position = $window.scrollTop();
            window_bottom_position = (window_top_position + window_height);


            for (var i = 0; i < registeredEls.length; i++) {
                var eldef = registeredEls[i];
                apply_animated_class(eldef.elements, delta, eldef.animationClass, eldef.onlyOnce);
            }

        }
		
		
        var checking = false;
        var previousScroll = 0;

		function check_scroll_and_animations() {
            var self = $(this);


            if (!checking) {
                checking = true;
                setTimeout(function () {
                    var scroll = $(this).scrollTop();
                    var delta = previousScroll - scroll;
                    previousScroll = scroll;
                    check_if_in_view(delta);
                    checking = false;
                }, 100);
            }
        }


        $window.on('scroll resize', function (ev) {
            check_scroll_and_animations();

        });

        check_scroll_and_animations();

    }


})(jQuery);

