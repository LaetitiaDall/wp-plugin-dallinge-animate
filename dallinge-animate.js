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

        for (let i = 0; i < registeredEls.length; i++) {
            let eldef = registeredEls[i];
            eldef['elements'] = $(eldef.selector).toArray();
        }

        let $window = $(window);
        let window_height = $window.height();
        let window_top_position = $window.scrollTop();
        let window_bottom_position = (window_top_position + window_height);

        function apply_animated_class(elements, delta, animation_classes, onlyOnce) {

            let elementsCopy = elements.slice();

            $.each(elementsCopy, function () {
                let element = $(this);
                let element_height = element.outerHeight();
                let element_top_position = element.offset().top;
                let element_bottom_position = (element_top_position + element_height);

                if ((element_bottom_position >= window_top_position) &&
                    (element_top_position <= window_bottom_position)) {
                    if (!element.hasClass("animation-done")) {

                        if (onlyOnce) {
                            elements.splice(elements.indexOf(element), 1);
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

            for (let eldef of registeredEls) {
                apply_animated_class(eldef.elements, delta, eldef.animationClass, eldef.onlyOnce);
            }

        }


        let checking = false;
        let previousScroll = 0;

        function check_scroll_and_animations() {
            var scroll = $(this).scrollTop();
            var delta = previousScroll - scroll;
            previousScroll = scroll;

            if (!checking) {
                checking = true;
                setTimeout(function () {
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