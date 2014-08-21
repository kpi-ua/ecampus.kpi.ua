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
        campus.eirFormControls(jQuery);
    });


    campus.datepickerHandler = function () {
        jQuery(function($){
        $.datepicker.regional['ua'] = {clearText: 'Очистити', clearStatus: '',
            closeText: 'Закрити', closeStatus: '',
            prevText: '&lt;&lt;',  prevStatus: '',
            nextText: '&gt;&gt;', nextStatus: '',
            currentText: 'Сьогодні', currentStatus: '',
            monthNames: ['Січень','Лютий','Березень','Квітень','Травень','Червень',
            'Липень','Серпень','Вересень','Жовтень','Листопад','Грудень'],
            monthNamesShort: ['Січ','Лют','Бер','Кві','Тра','Чер',
            'Лип','Сер','Вер','Жов','Лис','Гру'],
            monthStatus: '', yearStatus: '',
            weekHeader: 'Не', weekStatus: '',
            dayNames: ['неділя','понеділок','вівторок','середа','четвер','пятниця','суббота'],
            dayNamesShort: ['нед','пнд','вів','срд','чтв','птн','сбт'],
            dayNamesMin: ['Нд','Пн','Вт','Ср','Чт','Пт','Сб'],
            dayStatus: 'DD', dateStatus: 'D, M d',
            dateFormat: 'dd.mm.yy', firstDay: 1, 
            initStatus: '', isRTL: false};
            $.datepicker.setDefaults($.datepicker.regional['ua']);
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

    campus.eirFormControls = function(){
        if($('.list').find('tr').length>0){
            $('.list').closest('.row').before('<hr>');
        }
        console.log($('.list').find('tr').length);
        //$('#body_person_accessory_1').on('change', function() {
        //    $('#non-kpi-person').slideDown(300);
        //    $('#person_name_div').slideUp(300);
        //});
        //$('#body_person_accessory_0').on('change', function() {
        //    $('#non-kpi-person').slideUp(300);
        //});
        $('#body_griff').on('change', function() {
            console.log($(this).val());
            if ($(this).val()==7){
                $('#griff-7-block').slideDown('300');
            } else {
                $('#griff-7-block').slideUp('300');
            }
        });
        if ($('#body_langgrid').find('tr').length>0) {
            $('#additional-annotations').show();
        }
        $('#body_delete_lang').on('click', function() {
            if ($('#body_langgrid').find('tr').length==0) {
                $('#additional-annotations').hide();
            } 
        });
    }

})
