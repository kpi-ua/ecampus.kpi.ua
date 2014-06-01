$(document).ready(function () {

    if (!("campus" in window)) {
        window.campus = {};
    }

    jQuery(function () {
        campus.datepickerHandler(jQuery);
        campus.menuHandler(jQuery);
        campus.calendarToggler(jQuery);
        campus.carousel(jQuery);
        campus.scrollTop(jQuery);
    });


    campus.datepickerHandler = function () {
        $('.datepicker').datepicker({
            altFormat: 'dd-mm-yy', // Date Format used
            closeText: "Готово", // Display text for close link
            prevText: "Попередній", // Display text for previous month link
            nextText: "Наступний", // Display text for next month link
            currentText: "Сьогодні", // Display text for current month link
            monthNames: ["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"], // Names of months for drop-down and formatting
            monthNamesShort: ["Січ", "Лют", "Бер", "Кві", "Тра", "Чер", "Лип", "Сер", "Вер", "Жов", "Лис", "Гру"], // For formatting
            dayNames: ["Неділя", "Понеділок", "Вівторок", "Середа", "Четвер", "П'ятниця", "Субота"], // For formatting
            dayNamesShort: ["Нед", "Пон", "Ввт", "Срд", "Чтв", "Птн", "Сбт"], // For formatting
            dayNamesMin: ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"], // Column headings for days starting at Sunday
            firstDay: 1 // Start with Monday
        });

        $(".datepicker-toggle").on("click", function () {
            $(".right-col").toggleClass("show");
            $(".datepicker-messages").toggleClass("show");
        });

        var eventCount = $(".event").length;

        if (eventCount > 0) {
            $(".datepicker-label").html(eventCount).show();
        }

        $(window).on('scroll load', function (event) {
            var scrollHeight = $(this).scrollTop();
            if (scrollHeight > 410) {
                $(".right-col").css({
                    position: "fixed",
                    display: "block",
                    width: 220,
                    top: 10,
                    right: -220
                });
            } else {
                $(".right-col").css({
                    position: "absolute",
                    display: "none",
                    right: 0,
                    top: 410,
                    width: 0
                });
            }
        });

    }

    campus.menuHandler = function () {
        $(".left-nav li").on("click", function () {
            var $this = $(this).children("a"),
                $chevron = $this.children(".chevron");
            $this.toggleClass("active");
            if ($chevron) {
                $chevron.toggleClass("down");
            }
            $(this).children(".submenu").slideToggle(300);
        });
        
        $(".menu-toggle").on("click", function () {
            $(".left-col").slideToggle(300);
        });
    }

    campus.carousel = function () {
        var visibleSlideCount;
        var autoSlide;

        $(document).on("ready", function () {
            carouselBuild();
        });

        $(window).on('resize', function () {
            carouselBuild();
        });

        function carouselBuild() {
            var carouselWidth = $(".carousel").width(),
                slideWidth = $(".slide").width(),
                slideCount = $(".slide").length,
                position = 0;

            $(".carousel-wrap").css({
                left: 0
            });

            visibleSlideCount = parseInt(carouselWidth / slideWidth);

            if (visibleSlideCount > slideCount) {
                visibleSlideCount = slideCount;
            }

            var space = (carouselWidth - (slideWidth * visibleSlideCount)) / (visibleSlideCount - 1);


            $(".carousel-wrap").css({
                width: slideWidth * slideCount + space * (slideCount + 1)
            });
            $(".slide").css({
                marginRight: space
            });

            //place points
            $(".carousel-progress").empty();

            for (var i = $(".slide").length - visibleSlideCount; i >= 0; i--) {
                $(".carousel-progress").prepend("<div class='circle' id='circle" + i + "'></div>");
            }

            for (var i = 1; i < $(".circle").length; i++) {
                $("#circle" + i).removeClass("active");
            }

            $("#circle0").addClass("active");

            clearInterval(autoSlide);

            var flagCircle = true;

            $(".circle").on("click", function (event) {
                if (flagCircle) {
                    flagCircle = false;
                    position = $(this).attr("id").replace(/^\D+/g, '');
                    $(".circle").removeClass('active');
                    $(this).addClass('active');
                    $(".carousel-wrap").css({ left: -(slideWidth + space) * position + "px" });
                    setTimeout(function () { flagCircle = true }, 1100);
                }
            });

            var flagPrev = true,
                flagNext = true;

            $(".carousel-prev").on("click", function () {
                if (flagPrev) {
                    if (position < slideCount - visibleSlideCount) {
                        flagPrev = false;
                        position += 1;
                        $(".carousel-wrap").css({ left: -(slideWidth + space) * position + "px" });
                        $(".circle").removeClass('active');
                        $("#circle" + position).addClass('active');
                        setTimeout(function () { flagPrev = true; }, 1100);
                    }
                }

            });

            $(".carousel-next").on("click", function () {
                if (flagNext) {
                    if (position > 0) {
                        flagNext = false;
                        position -= 1;
                        $(".carousel-wrap").css({ left: -(slideWidth + space) * position + "px" });
                        $(".circle").removeClass('active');
                        $("#circle" + position).addClass('active');
                        setTimeout(function () { flagNext = true }, 1100);
                    }
                }
            });

            var flagSliding = false;

            function startAutoSlide() {
                autoSlide = setInterval(function () {
                    if (!flagSliding) {
                        position += 1;
                        if (position > (slideCount - visibleSlideCount)) {
                            position = 0;
                        }
                        $(".carousel-wrap").css({ left: -(slideWidth + space) * position + "px" });
                        $(".circle").removeClass('active');
                        $("#circle" + position).addClass('active');
                    }
                }, 5000);
            }

            startAutoSlide();

            $(".carousel").on("mouseenter", function () {
                clearInterval(autoSlide);
                flagSliding = false;
            });

            $(".carousel").on("mouseleave", function () {
                startAutoSlide();
            });
        }
    }

    campus.scrollTop = function () {
        $(".scroll-top").on("click", function () {
            $('html, body').animate({ scrollTop: 0 }, 500);
        });
    }

    campus.calendarToggler = function () {
        $(window).on("scroll load", function () {
            var scrollHeight = $(this).scrollTop(),
                rightCol = $(".right-col");

        });
    }

})
