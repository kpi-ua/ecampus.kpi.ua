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
        jQuery(function ($) {
            $.datepicker.regional['ua'] = {
                clearText: 'Очистити', clearStatus: '',
                closeText: 'Закрити', closeStatus: '',
                prevText: '&lt;&lt;', prevStatus: '',
                nextText: '&gt;&gt;', nextStatus: '',
                currentText: 'Сьогодні', currentStatus: '',
                monthNames: ['Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень',
                'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'],
                monthNamesShort: ['Січ', 'Лют', 'Бер', 'Кві', 'Тра', 'Чер',
                'Лип', 'Сер', 'Вер', 'Жов', 'Лис', 'Гру'],
                monthStatus: '', yearStatus: '',
                weekHeader: 'Не', weekStatus: '',
                dayNames: ['неділя', 'понеділок', 'вівторок', 'середа', 'четвер', 'пятниця', 'суббота'],
                dayNamesShort: ['нед', 'пнд', 'вів', 'срд', 'чтв', 'птн', 'сбт'],
                dayNamesMin: ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
                dayStatus: 'DD', dateStatus: 'D, M d',
                dateFormat: 'dd.mm.yy', firstDay: 1,
                initStatus: '', isRTL: false
            };
            $.datepicker.setDefaults($.datepicker.regional['ua']);
        });

        $("#datepicker-toggle-button").on("click", function () {
            $(".right-col").toggleClass("show");
            $(".datepicker-messages").toggleClass("show");
        });

        $.ajax(ApiEndpoint + "Calendar/GetAllForUserDateCount?sessionId=" + $("#CampusSessionId").html(), {
            success: function (data) {
                var count = +data['Data'];
                if (count > 0)
                    $(".datepicker-label").html(count).show();
            },
            error: function () {

            }
        });

        $(window).on('scroll load', function (event) {
            var scrollHeight = $(this).scrollTop();
            //if (scrollHeight > 410) {
            $(".right-col").css({
                position: "fixed",
                display: "block",
                width: 220,
                top: 210,
                right: -220
            });
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

    campus.eirFormControls = function () {
        if ($('.list').find('tr').length > 0) {
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
        $('#body_griff').on('change', function () {
            console.log($(this).val());
            if ($(this).val() == 7) {
                $('#griff-7-block').slideDown('300');
            } else {
                $('#griff-7-block').slideUp('300');
            }
        });
        if ($('#body_langgrid').find('tr').length > 0) {
            $('#additional-annotations').show();
        }
        $('#body_delete_lang').on('click', function () {
            if ($('#body_langgrid').find('tr').length == 0) {
                $('#additional-annotations').hide();
            }
        });
    }
});

function AjaxLoader(id, options) {
    // Convert color Hex to RGB
    function HexToRGB(hex) {
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function (m, r, g, b) {
            return r + r + g + g + b + b;
        });
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    // Convert color RGB to Hex
    function RGBToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    // Default options use when constructor's options are ommited
    var defaultOptions = {
        size: 32,       // Width and height of the spinner
        factor: 0.25,   // Factor of thickness, density, etc.
        speed: 1,       // Number of turns per second
        color: "#000",  // Color #rgb or #rrggbb
        clockwise: true // Direction of rotation
    }

    var size, factor, color, speed, clockwise,  // local options variables
        timer, rate = 0.0, deltaRate, segments, thickness, deltaAngle,
        fps = 30        // frames per second;
    if (options != null) {
        // Verify each field of the options
        size = "size" in options ? options.size : defaultOptions.size;
        factor = "factor" in options ? options.factor : defaultOptions.factor;
        color = HexToRGB("color" in options ? options.color : defaultOptions.color);
        speed = "speed" in options ? options.speed : defaultOptions.speed;
        clockwise = "clockwise" in options ? options.clockwise : defaultOptions.clockwise;
    } else {
        // Options are ommited, take it from default
        size = defaultOptions.size;
        factor = defaultOptions.factor;
        color = HexToRGB(defaultOptions.color);
        speed = defaultOptions.speed;
        clockwise = defaultOptions.clockwise;
    }

    var canvas = id[0];
    if (canvas == null) {
        console.log("AjaxLoader Error! Cannot find canvas element by id '" + id + "'");
        return null;
    }
    var context = canvas.getContext("2d");
    Init();

    // Init all viriables
    function Init() {
        segments = (size >= 32) ? ((size >= 128) ? 72 : 36) : 18,
        thickness = 0.5 * size * factor,
        deltaAngle = 2.0 * Math.PI / segments;
        deltaRate = speed / fps;
        if (clockwise) {
            deltaRate = -deltaRate;
        }
        canvas.width = size;
        canvas.height = size;
    }

    // Draw ajaxloader
    function Draw(rate) {
        var angle = 2.0 * Math.PI * rate;
        var cosA = Math.cos(angle),
            sinA = Math.sin(angle),
            x0 = 0.5 * size * (1 + cosA),
            y0 = 0.5 * size * (1 - sinA),
            x1 = x0 - thickness * cosA,
            y1 = y0 + thickness * sinA;
        context.clearRect(0, 0, size, size);
        for (var i = 0; i < segments; i++) {
            context.beginPath();
            if (clockwise) {
                context.fillStyle = "rgba(" + color.r + "," + color.g + "," + color.b + "," + (segments - 1 - i) / (segments - 1) + ")";
            } else {
                context.fillStyle = "rgba(" + color.r + "," + color.g + "," + color.b + "," + i / (segments - 1) + ")";
            }
            context.moveTo(x0, y0);
            context.lineTo(x1, y1);
            angle += deltaAngle,
            cosA = Math.cos(angle);
            sinA = Math.sin(angle);
            x0 = 0.5 * size * (1 + cosA);
            y0 = 0.5 * size * (1 - sinA);
            x1 = x0 - thickness * cosA;
            y1 = y0 + thickness * sinA;
            context.lineTo(x1, y1);
            context.lineTo(x0, y0);
            context.closePath();
            context.fill();
        }
    }

    // Show and begin animation
    this.show = function () {
        canvas.removeAttribute("style");
        clearInterval(timer);
        timer = setInterval(function () {
            Draw(rate);
            rate += deltaRate;
            rate = rate - Math.floor(rate);
        }, 1000 / fps);
    }

    // Stop animation and hide indicator
    this.hide = function () {
        clearInterval(timer);
        canvas.style.display = "none";
    }

    this.getSize = function () {
        return size;
    }

    this.setSize = function (value) {
        size = value;
        Init();
    }

    this.getFactor = function () {
        return factor;
    }

    this.setFactor = function (value) {
        factor = value;
        Init();
    }

    this.getSpeed = function () {
        return speed;
    }

    this.setSpeed = function (value) {
        speed = value;
        Init();
    }

    this.getColor = function () {
        return RGBToHex(color.r, color.g, color.b);
    }

    this.setColor = function (value) {
        color = HexToRGB(value);
    }

    this.getClockwise = function () {
        return clockwise;
    }

    this.setClockwise = function (value) {
        clockwise = value;
        Init();
    }
}


//input = {
//  template_id: "planner-popup",
//  time_id: "tasktime",
//  task_id: "tasktext",
//  title_id: "tasktitle",
//  popover_toggle_id: "datepicker-show-events"
//}
Planner = function (session, input) {

    var constructValues = function () {
        if (input != undefined) {
            if (input.time_id != undefined)
                values.time_id = input.time_id;
            if (input.template_id != undefined)
                values.template_id = input.template_id;
            if (input.task_id != undefined)
                values.task_id = input.task_id;
            if (input.title_id != undefined)
                values.title_id = input.title_id;
            if (input.popover_toggle_id != undefined)
                values.popover_toggle_id = input.popover_toggle_id;
        }
    }

    var values = {
        template_id: "planner-popup",
        time_id: "tasktime",
        task_id: "tasktext",
        title_id: "tasktitle",
        popover_toggle_id: "datepicker-show-events",
    }

    constructValues();

    var Members = {
        SessionId: session,//$("#sssid").val(),
        Today: function () {
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth() + 1; //January is 0!
            var yyyy = today.getFullYear();

            if (dd < 10) {
                dd = '0' + dd
            }

            if (mm < 10) {
                mm = '0' + mm
            }

            return today = dd + '.' + mm + '.' + yyyy;
        },
        Date: function (date) {
            if (date == undefined || date == "" || date == null)
                date = this.Today();
            return date;
        },
        Time: function () {
            var d = new Date(Date.now());
            return ((d.getHours() < 10) ? "0" : "") + d.getHours() + ":" + ((d.getMinutes() < 10) ? "0" : "") + d.getMinutes()
        },
        Template: values.template_id,
        PopupObject: $("#" + values.template_id),
        TimeObject: $("#" + values.template_id).find("#back-popup-content").find("#" + values.time_id),
        TaskObject: $("#" + values.template_id).find("#back-popup-content").find("#" + values.task_id),
        TitleObject: $("#" + values.template_id).find("#back-popup-content").find("#" + values.title_id),
        PopoverObject: $("#" + values.popover_toggle_id),
        Update: {
            Time: false,
            Task: false,
            Title: false
        },
        ajaxLoaderBig: {
            size: 70,           // Width and height of the spinner
            factor: 0.25,       // Factor of thickness, density, etc.
            color: "#018C26",      // Color #rgb or #rrggbb
            speed: 1.0,         // Number of turns per second
            clockwise: true     // Direction of rotation
        },
        ajaxLoaderSmall: {
            size: 32,           // Width and height of the spinner
            factor: 0.25,       // Factor of thickness, density, etc.
            color: "#018C26",      // Color #rgb or #rrggbb
            speed: 1.0,         // Number of turns per second
            clockwise: true     // Direction of rotation
        },
        Messages: {
            InputForm: '<div id="planner-popup"><br /> <div id="back-popup-content"> <span class="input-group" style="width: 280px; display: inline-block;"> Заголовок: <br /> <input type="text" class="form-control" id="tasktitle3" value=""> </span> <span class="input-group clockpicker" style="width: 280px; display: inline-block;"> Час:<br /> <input type="text" class="form-control" id="tasktime3" value="" data-default="00:00"> </span> <script type="text/javascript"> $(\'#tasktime3\').clockpicker({ autoclose: true, donetext: "OK" }); </script> <br /> <br /> Подія: <br /> <textarea class="input-group" name="tasktext3" rows="5" style="color: black; width: 565px; height: 100px;" id="tasktext3"></textarea><br /> </div> </div>',
            EventList: ''
        },
        ArchiveLastState: false,
        Page: 0
    };

    var ManipulateHtml = function (string, tag) {
        var $html = string.parseHTML();

    };

    this.Today = Members.Today();
    var ajaxLoaderBig = new AjaxLoader($('#spinner-popup'), Members.ajaxLoaderBig);
    var ajaxLoaderSmall = new AjaxLoader($(".popover-content").find('#spinner-calendar'), Members.ajaxLoaderSmall);

    // Nano template engine
    var nano = function (template, data) {
        return template.replace(/\{([\w\.]*)\}/g, function (str, key) {
            var keys = key.split("."), v = data[keys.shift()];
            for (var i = 0, l = keys.length; i < l; i++) v = v[keys[i]];
            return (typeof v !== "undefined" && v !== null) ? v : "";
        });
    }

    // API calls methods
    var APICalls = {
        MakeRawAPICall: function (callString, callback, beforeCall) {
            $.ajax(callString, {
                success: function (data) {
                    if (callback != undefined)
                        callback(data);
                },
                beforeSend: function () {
                    if (beforeCall != undefined)
                        beforeCall();
                }
            });
        },

        // controller, date, time, task, callback, beforeCall, archive - show unactive events
        MakeAPICall: function (controller, date, time, task, archive, callback, beforeCall, page) {
            var result;
            var callString = ApiEndpoint + "Calendar/" + controller + "?sessionId=" + Members.SessionId;
            if (task == undefined && callback == undefined) {
                callback = time;
                time = undefined;
            }
            if (callback == undefined) {
                callback = function (data) {
                    var items = "";
                    if (data["Data"].length == 0)
                        result = [];
                    else
                        result = data["Data"];
                };
            }
            if (task != undefined) {
                callString += "&task=" + task;
                callback = function () { };
            }
            if (date != undefined)
                callString += "&date=" + date;
            if (time != undefined)
                callString += "&time=" + time;
            if (archive != undefined)
                callString += "&actuality=" + archive;
            if (page != undefined)
                callString += "&page=" + page;

            $.ajax(callString, {
                success: function (data) {
                    if (callback != undefined)
                        callback(data);
                },
                beforeSend: function () {
                    if (beforeCall != undefined)
                        beforeCall();
                }
            });
            //$(this).ajaxStop(function () { return result; });            
        }
    };

    var DateTimeOperations = {
        // return difference in int
        dateComparer: function (date1, date2) {
            date2 = Members.Date(date2);

            date1 = date1.split('/');
            if (date1.length != 3)
                date1 = date1[0].split('.');
            date2 = date2.split('/');
            if (date2.length != 3)
                date2 = date2[0].split('.');

            date1 = new Date(date1[2], +(date1[1]) - 1, date1[0]);
            date2 = new Date(date2[2], +(date2[1]) - 1, date2[0]);

            return +date1 - +date2;
        },
        timeComparar: function (time1, time2) {
            if (time2 == undefined)
                time2 = Members.Time();

            time1 = time1.split(":");
            time2 = time2.split(":");

            time1 = time1[0] + time1[1];
            time2 = time2[0] + time2[1];
            return +time1 - +time2;
        }
    }

    // Render list of events for date
    this.RenderTimeLabels = function (date, archive, page) {        
        date = Members.Date(date);
        if (page == undefined) page = 0;
        if (archive == undefined || archive == false) archive = "1";
        else if (+archive == 0 || archive == true) archive = "0";
        Members.Page = page;

        var callback = function (data) {
            var title = "";
            this.items = "<div class='popup-data'><ul><li><hr></li>";
            if (data["Data"].length == 0) {
                items += '<li>Немає запланованих подій</li><li><hr></li>'
            } else {                
                for (var i = 0; i < data["Data"].length; i++) {
                    items += nano("<li class='event'><div class='event-time' onclick='plan.ShowSelected(\"{PlannerId}\", \"{DateTask}\", \"{Actuality}\");'>{TimeTask} -- {Title}</div></li>", data["Data"][i]);
                    items += '<li><hr></li>';
                    if (title == "")
                        title = data["Data"][i].DateTask;
                }
            }
            if (DateTimeOperations.dateComparer(date, Members.Today()) >= 0) {
                if (+archive != 0) {
                    items += '<li><div class="event-time" onclick="plan.AddNew($.ddate);">Додати</div></li>';
                    items += '<li><hr></li>';
                }
                if (+archive != 0) {
                    Members.ArchiveLastState = false;
                    items += '<li><div class="event-time" onclick="plan.RenderTimeLabels($.ddate, true);">Архів</div></li>';
                }
                else {
                    Members.ArchiveLastState = true;
                    items += '<li><div class="event-time" onclick="plan.RenderTimeLabels($.ddate, false);">Актуальні</div></li>';
                    title += " (Архів)";
                }
            }
            items += '</ul></div>';
            ajaxLoaderSmall.hide();
            if (title == "")
                title = Members.Today();
            $("#" + values.popover_toggle_id).popover('destroy');
            $("#" + values.popover_toggle_id).popover({ html: true, title: 'Події - ' + title, content: items, placement: 'left' });
            $("#" + values.popover_toggle_id).popover('show');
            $('.popover-title').css('color', 'black');
            $('.popover-content').css('color', 'black');
        };

        var beforeCall = function () {
            if ($(".popover").html() != undefined)
                $("#" + values.popover_toggle_id).popover('destroy');
            $("#" + values.popover_toggle_id).popover({ html: true, title: 'Події', content: '<canvas class="div-canvas-small" id="spinner-calendar"></canvas>', placement: 'left' });
            $("#" + values.popover_toggle_id).popover('show');
            ajaxLoaderSmall = new AjaxLoader($(".popover-content").find('#spinner-calendar'), Members.ajaxLoaderSmall);
            try {
                ajaxLoaderSmall.show();
            } catch (err) {
                $(".popover-content").html('<canvas class="div-canvas-small" id="spinner-calendar"></canvas>');
                ajaxLoaderSmall = new AjaxLoader($(".popover-content").find('#spinner-calendar'), Members.ajaxLoaderSmall);
                ajaxLoaderSmall.show();
            }
        }

        GetForDate(date, archive, callback, beforeCall, page);
    };

    var _renderTimeLabels = this.RenderTimeLabels;

    var GetForDate = function (date, archive, callback, beforeCall, page) {
        return APICalls.MakeAPICall("GetAllForUserDate", date, undefined, undefined, archive, callback, beforeCall, page);
    };
    var GetTimeLabelsForDate = function (date, callback) {
        date = Members.Date(date);
        return APICalls.MakeAPICall("GetLabelsForUserDate", date, callback);
    };
    var GetSelected = function (id, callback, beforeCall) {
        return APICalls.MakeRawAPICall(ApiEndpoint + "Calendar/GetSelectedForUser?sessionId=" + Members.SessionId + "&idPlanner=" + id, callback, beforeCall);
    };

    // detect if update needed and return APICallString
    var Changes = function () {
        var callString = "";
        if (Members.Update.Time == true)
            callString = callString + "&time=" + Members.TimeObject.val();
        if (Members.Update.Task == true)
            callString = callString + "&task=" + Members.TaskObject.val();
        if (Members.Update.Title == true)
            callString = callString + "&title=" + Members.TitleObject.val();
        return callString;
    };

    var DetectChanges = function (callback) {
        Members.TaskObject.bind('input propertychange', function () { Members.Update.Task = true; callback(); });
        Members.TimeObject.bind('input propertychange', function () { Members.Update.Time = true; callback(); });
        Members.TitleObject.bind('input propertychange', function () { Members.Update.Title = true; callback(); });
    };

    var ClearInputs = function () {
        Members.Update.Task = Members.Update.Time = Members.Update.Title = false;
        $("#back-popup-content").css("visibility", "hidden");
    };

    // Display dialog message to manage selected event
    this.ShowSelected = function (id, date, archived) {
        var beforeAjaxCall = function () {
            ajaxLoaderBig.show();
            Members.PopupObject.css("display", "inline");
            var dialog = bootbox.dialog({
                closeButton: false,
                message: Members.PopupObject,
                buttons: {
                    Add: {
                        label: "OK",
                        className: "btn btn-success update-pop-button",
                        callback: function () {
                            if ($(".update-pop-button").html() != "OK") {
                                var callString = ApiEndpoint + "Calendar/UpdatePlanner?sessionId=" + Members.SessionId + "&idPlanner=" + id;
                                if (+archived != 0) callString += Changes();
                                else if (+archived == 0 && $(".update-pop-button").html() == "Відновити") callString += "&actuality=1";

                                APICalls.MakeRawAPICall(callString, function () {
                                    update(date);
                                });
                            }
                            Members.PopupObject.css("display", "none");
                            ClearInputs();
                        }
                    },
                    Delete: {
                        label: "Видалити",
                        className: "btn-danger",
                        callback: function () {
                            var callString = "";
                            if (+archived != 0) callString = ApiEndpoint + "Calendar/UpdatePlanner?sessionId=" + Members.SessionId + "&idPlanner=" + id + "&actuality=0";
                            else callString = ApiEndpoint + "Calendar/RemovePlanner?sessionId=" + Members.SessionId + "&idPlanner=" + id; // if event is already archived, we need to delete it tottaly

                            APICalls.MakeRawAPICall(callString, function () {
                                update(date);
                            });
                            Members.PopupObject.css("display", "none");
                            ClearInputs();
                        }
                    },
                    Cancel: {
                        label: "Відміна",
                        className: "btn-default",
                        callback: function () {
                            Members.PopupObject.css("display", "none");
                            ClearInputs();
                        }
                    }
                }
            });
        };

        var callback = function (jdata) {
            var data = jdata["Data"][0];
            if (+archived == 0 && DateTimeOperations.dateComparer(date, Members.Today()) >= 0 && DateTimeOperations.timeComparar(data.TimeTask, Members.Time())) {
                $(".update-pop-button").html("Відновити");
            }
            ajaxLoaderBig.hide();
            $("#back-popup-content").css("visibility", "visible");
            Members.TimeObject.val(data.TimeTask);
            Members.TaskObject.val(data.Task);
            Members.TitleObject.val(data.Title);
            DetectChanges(function () {
                if (+archived != 0)
                    $(".update-pop-button").html("Оновити");
            });
        }
        GetSelected(id, callback, beforeAjaxCall);
    };

    var update = function (date) {
        if (date == Members.Today()) {
            $.ajax(ApiEndpoint + "Calendar/GetAllForUserDateCount?sessionId=" + Members.SessionId, {
                success: function (data) {
                    var count = +data['Data'];
                    if (count > 0)
                        $(".datepicker-label").html(count).show();
                },
                error: function () {

                }
            });
        }
        _renderTimeLabels(date, false);
    };

    var _togglePopover = function (date, archive, page) {
        if (page == undefined)
            page = 0;

        if (page == Members.Page) {
            if ($('.popover').html() == undefined || $('.popover').html() == "") {
                date = Members.Date(date);
                if (archive == undefined)
                    archive = Members.ArchiveLastState;

                if (+page < 0)
                    page = 0;

                _renderTimeLabels(date, archive, page);
            }
            else {
                $("#" + values.popover_toggle_id).popover('destroy');
                if ($('.popover').html() != undefined)
                    $('.popover').html("");
            }
        } else {
            $("#" + values.popover_toggle_id).popover('destroy');
            if ($('.popover').html() != undefined)
                $('.popover').html("");

            date = Members.Date(date);
            if (archive == undefined)
                archive = Members.ArchiveLastState;

            if (+page < 0)
                page = 0;

            _renderTimeLabels(date, archive, page);
        }
    }

    this.togglePopover = _togglePopover;

    this.AddNew = function (date) {
        //debugger;     
        if (date == undefined || date == "") {
            date = Members.Today();
        }

        $(".add-pop-btn").attr("disabled", "disabled");
        bootbox.dialog({
            closeButton: false,
            message: Members.Messages.InputForm,
            title: "Додати нову подію",
            buttons: {
                Add: {
                    label: "Додати",
                    className: "btn-success add-pop-btn",
                    callback: function () {
                        if ($("#tasktitle3").val() == "" || $("#tasktime3").val() == "" || $("#tasktext3").val() == "") {
                            bootbox.alert({ message: "Ви заповнили не всі поля", title: "Помилка", callback: function () { _addNew(); } });
                        } else {
                            APICalls.MakeRawAPICall(ApiEndpoint + "Calendar/AddNewPlanner?sessionId=" + Members.SessionId + "&date=" + date + "&title=" + $("#tasktitle3").val() + "&time=" + $("#tasktime3").val() + "&task=" + $("#tasktext3").val(), function () {
                                update(date);
                            });
                        }
                        ClearInputs();
                    }
                },
                Cancel: {
                    label: "Відміна",
                    className: "btn-default",
                    callback: function () {
                        Members.PopupObject.css("display", "none");
                        ClearInputs();
                    }
                }
            }
        });
    }

    var _addNew = this.AddNew;
};
