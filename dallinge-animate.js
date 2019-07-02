(function ($) {

    window.dallinge_animate_animations = {
        FADE_IN: 'fadeIn',
        FADE_IN_UP: 'fadeInUp',
        FADE_IN_RIGHT: 'fadeInRight',
        FADE_IN_LEFT: 'fadeInLeft',

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

        console.log("Animating!", registeredEls);

        var $window = $(window);
        var window_height = $window.height();
        var window_top_position = $window.scrollTop();
        var window_bottom_position = (window_top_position + window_height);

        var timeout = 0;

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
                    // It's in view

                    if (!element.hasClass("animation-done") && !element.hasClass("animating")) {

                        if (onlyOnce) {
                            element.addClass("animation-already-done-once")
                        }

                        element.addClass("animating");

                        console.log(timeout);
                        setTimeout(function () {
                            element.removeClass("animation-done")
                                .addClass(animation_classes)

                                .removeClass("animation-normal")
                                .removeClass("animation-reverse")
                                .addClass(delta > 0 ? "animation-reverse" : "animation-normal")
                                .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                                    $(this).removeClass(animation_classes)
                                        .removeClass("animation-normal")
                                        .removeClass("animation-reverse")
                                        .removeClass("animating")
                                        .addClass("animation-done");
                                });
                        }, timeout);
                        timeout += 80;

                    }

                } else {

                    // it's not in view
                    element
                        .removeClass(animation_classes)
                        .removeClass("animation-normal")
                        .removeClass("animation-reverse")
                        .removeClass("animating")
                        .removeClass("animation-done");

                    if (!onlyOnce && !element.hasClass("animation-already-done-once")) {
                        element.css("opacity", 0);
                    }

                    if (delta <= 0){
                        // It's going down
                        if (element_bottom_position <= window_top_position){
                            // it's above
                            element.addClass("animation-done");
                        }
                    }


                }

            });
        }

        function check_if_in_view(delta) {

            window_height = $window.height();
            window_top_position = $window.scrollTop();
            window_bottom_position = (window_top_position + window_height);


            for (var i = 0; i < registeredEls.length; i++) {
                var eldef = registeredEls[i];
                timeout = 0;
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

