$(function(){
    $(document).ready(function(){

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

        $(".left-nav li").on("click", function(){
            var $this = $(this).children("a"),
                $chevron = $this.children(".chevron");
            $this.toggleClass("active");
            if ($chevron) {
                $chevron.toggleClass("down");
            }
            $(this).children(".submenu").slideToggle(300);
        })

        var carousel = function(){
            var carWidth = $(".carousel").width(),
                slideWidth = $(".slide").width(),
                slidePos = 0,
                spaceWidth,
                slideCoords = [];

            for(var i = 0; i< $(".slide").length; i++){
                $(".slide")[i].id="slide"+i;
            }
            if ($(window).width()>=1500){
                spaceWidth = (carWidth - slideWidth*5)/6;
            }
            if ($(window).width()>=1180){
                spaceWidth = (carWidth - slideWidth*4)/5;
            }
            if ($(window).width()<1180){
                spaceWidth = (carWidth - slideWidth*3)/4;
            }
            if ($(window).width()<=820){
                spaceWidth = (carWidth - slideWidth*2)/3;
            }
            if ($(window).width()<=680){
                spaceWidth = (carWidth - slideWidth)/2;
            }
            for(var i = 0; i< $(".slide").length; i++){
                slideCoords.push(40+spaceWidth*(i+1)+slideWidth*i);
                $("#slide"+i).css({left:slideCoords[i]+"px"});
            }
            console.log(slideCoords);

            $(window).on("resize", function(){
                carWidth = $(".carousel").width();
                slideWidth = $(".slide").width();
                if ($(window).width()>=1500){
                    spaceWidth = (carWidth - slideWidth*5)/6;
                }
                if ($(window).width()>=1220){
                    spaceWidth = (carWidth - slideWidth*4)/5;
                }
                if ($(window).width()<1220){
                    spaceWidth = (carWidth - slideWidth*3)/4;
                }
                if ($(window).width()<=820){
                    spaceWidth = (carWidth - slideWidth*2)/3;
                }
                if ($(window).width()<=680){
                    spaceWidth = (carWidth - slideWidth)/2;
                }

                for(var i = 0; i< $(".slide").length; i++){
                    slideCoords[i]=(40+spaceWidth*(i+1)+slideWidth*i);
                    $("#slide"+i).css({left:slideCoords[i]+"px"});
                }

            })

            $(".carousel-prev").on("click",function(){
                console.log("prev");
                var buf = slideCoords.shift();
                slideCoords.push(buf);
                for(var i = 0; i< $(".slide").length; i++){
                    $("#slide"+i).animate({left:slideCoords[i]+"px"},200)
                }
                for(var i = 0; i< $(".slide").length; i++){
                    if ($("#slide"+i).position().left == slidePos){
                        console.log(i);
                    }
                }

            });

            $(".carousel-next").on("click",function(){
                console.log("next");
                for(var i = 0; i< $(".slide").length; i++){
                    $("#slide"+i).css({left:slideCoords[i]+"px"});
                }
                var buf = slideCoords.pop();
                slideCoords.unshift(buf);

                for(var i = 0; i< $(".slide").length; i++){
                    $("#slide"+i).animate({left:slideCoords[i]+"px"},200)
                }

            });


        }

        $(".datepicker-toggle").on("click", function(){
            $(".right-col").toggleClass("show");
        });

        $(".menu-toggle").on("click", function(){
            $(".left-col").slideToggle(300);
        })
        carousel();

    })

})
