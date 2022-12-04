!(function (e) {
    var l = new ScrollMagic.Controller(),
        i = ["#slide01 header", "#slide02 header", "#slide03 header", "#slide04 header"];
    if (!Modernizr.touch) {
        i.forEach(function (e, i) {
            {
                var r = i + 1;
                new ScrollMagic.Scene({ triggerElement: e, offset: -95 })
                    .setClassToggle("#slide0" + r, "is-active")
                    .addTo(l);
            }
        });
        {
            new ScrollMagic.Scene({ triggerElement: ".slide.is-light" })
                .setClassToggle("nav", "is-dark")
                .addTo(l);
        }
    }
})(jQuery);
