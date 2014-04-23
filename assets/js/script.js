$(document).ready(function(){

    if (!("campus" in window)) {
        window.campus = {};
    }

    jQuery(function () {
        campus.datepickerHandler(jQuery);
        campus.menuHandler(jQuery);
        campus.calendarToggler(jQuery);
        // campus.carousel(jQuery);
        campus.carousel(jQuery);
        campus.scrollTop(jQuery);
    });


    campus.datepickerHandler = function(){
        $('.datepicker').datepicker({
            altFormat: 'dd-mm-yy',  // Date Format used
            closeText: "Готово", // Display text for close link
            prevText: "Попередній", // Display text for previous month link
            nextText: "Наступний", // Display text for next month link
            currentText: "Сьогодні", // Display text for current month link
            monthNames: ["Січень","Лютий","Березень","Квітень","Травень","Червень",
                "Липень","Серпень","Вересень","Жовтень","Листопад","Грудень"], // Names of months for drop-down and formatting
            monthNamesShort: ["Січ", "Лют", "Бер", "Кві", "Тра", "Чер", "Лип", "Сер", "Вер", "Жов", "Лис", "Гру"], // For formatting
            dayNames: ["Неділя", "Понеділок", "Вівторок", "Середа", "Четвер", "П'ятниця", "Субота"], // For formatting
            dayNamesShort: ["Нед", "Пон", "Ввт", "Срд", "Чтв", "Птн", "Сбт"], // For formatting
            dayNamesMin: ["Нд","Пн","Вт","Ср","Чт","Пт","Сб"], // Column headings for days starting at Sunday
            firstDay: 1 // Start with Monday
        })

        $(".datepicker-toggle").on("click", function(){
            $(".right-col").toggleClass("show");
            $(".datepicker-messages").toggleClass("show");
        });

        var eventCount = $(".event").length;
        if (eventCount>0) {
            $(".datepicker-label").html(eventCount).show();
        }

    }

    campus.menuHandler = function(){
        $(".left-nav li").on("click", function(){
            var $this = $(this).children("a"),
                $chevron = $this.children(".chevron");
            $this.toggleClass("active");
            if ($chevron) {
                $chevron.toggleClass("down");
            }
            $(this).children(".submenu").slideToggle(300);
        })

        $(".menu-toggle").on("click", function(){
            $(".left-col").slideToggle(300);
        })
    }

    campus.carousel = function(){
        var visibleSlideCount;

        $(document).on("ready", function(){
            carouselBuild();
        })

        $(window).on('resize', function() {
            carouselBuild();
        });

        function carouselBuild () {

            var carWidth = $(".carousel").width(),
                slideWidth = $(".slide").width(),
                slideCount = $(".slide").length,
                position = 0;

            $(".carousel-wrap").css({
                left: 0
            });

            visibleSlideCount = parseInt(carWidth/slideWidth);

            if (visibleSlideCount > slideCount){
                visibleSlideCount = slideCount;
            }

            var space = (carWidth - slideWidth*visibleSlideCount)/(visibleSlideCount+1);

            if (space<14) {
                visibleSlideCount-=1;
                space = (carWidth - slideWidth*visibleSlideCount)/(visibleSlideCount+1);
            }

            $(".carousel-progress").css({
                paddingRight: space+"px"
            })
            
            $(".carousel-wrap").css({
                width: slideWidth*slideCount+space*(slideCount+1)
            });
            $(".slide").css({
                marginRight: space
            });
            $(".slide:first-child").css({
                marginLeft: space
            });

             //place points
            $(".carousel-progress").empty();

            for(var i = $(".slide").length - visibleSlideCount; i>=0;  i--){
                $(".carousel-progress").prepend("<div class='circle' id='circle"+i+"'></div>");
            }

            for(var i = 1; i< $(".circle").length; i++){
                $("#circle"+i).removeClass("active");
            }

            $("#circle0").addClass("active");

            var flagCircle = true;

            $(".circle").on("click", function(event) {
                console.log($(this).attr("id"));
                if (flagCircle) {
                    flagCircle = false;
                    // position = $(this).attr("id");
                    console.log(position);
                    // var wrapLeft = parseFloat($(".carousel-wrap").css("left"));
                    // $(".carousel-wrap").css({left:wrapLeft - slideWidth - space+"px"});
                    $(".circle").removeClass('active');
                    $(this).addClass('active');
                    setTimeout(function(){flagCircle = true},1100);
                }
            });

            var flagPrev = true,
                flagNext = true;

            $(".carousel-prev").on("click",function(){
                if (flagPrev) {
                    if (position<slideCount - visibleSlideCount){
                        flagPrev = false;
                        position+=1;
                        console.log(position);
                        var wrapLeft = parseFloat($(".carousel-wrap").css("left"));
                        $(".carousel-wrap").css({left:wrapLeft - slideWidth - space+"px"});
                        $(".circle").removeClass('active');
                        $("#circle"+position).addClass('active');
                        setTimeout(function(){flagPrev = true},1100);
                    }
                }
                
            });

            $(".carousel-next").on("click",function(){
                if (flagNext) {
                    if (position>0){
                        flagNext = false;
                        position-=1;
                        console.log(position);
                        var wrapLeft = parseFloat($(".carousel-wrap").css("left"));
                        $(".carousel-wrap").css({left:wrapLeft + slideWidth + space+"px"});
                        $(".circle").removeClass('active');
                        $("#circle"+position).addClass('active');
                        setTimeout(function(){flagNext = true},1100);
                    }
                }
            });          
        }
    }

    campus.scrollTop = function(){
        $(window).on("scroll load", function(){
            var $scrollTop = $(".scroll-top");
            var scrollHeight = $(this).scrollTop();
            if (scrollHeight>=($(document).height()/4)){
                if (!($scrollTop.hasClass("show"))){
                    $scrollTop.show();
                    setTimeout(function(){
                        $scrollTop.addClass("show")
                    },200)
                }
            } else {
                if ($scrollTop.hasClass("show")){
                    $scrollTop.removeClass("show");
                    setTimeout(function(){
                        $scrollTop.hide();
                    },200)
                }
            }
        });

        $(".scroll-top").on("click",function(){
            $('html, body').animate({scrollTop: 0}, 500);
        });
    }

    campus.calendarToggler = function(){
         $(window).on("scroll load", function(){
            var scrollHeight = $(this).scrollTop(),
                rightCol = $(".right-col");

        });
    }

})
