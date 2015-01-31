$(document).ready(function () {
    if (!("campus" in window)) {
        window.campus = {};
    }

    jQuery(function () {        
        campus.menuHandler(jQuery);
        campus.calendarToggler(jQuery);
        campus.carousel(jQuery);
        campus.scrollTop(jQuery);
        campus.eirFormControls(jQuery);       
    });    

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
        //console.log("AjaxLoader Error! Cannot find canvas element by id '" + id + "'");
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
    
    $.SessionID = session;
    var ApiEndpoint = $.ApiPath;

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
            if (input.spinner_id != undefined)
                values.spinner_id = input.spinner_id;
        }
    }

    var values = {
        template_id: "planner-popup",
        time_id: "tasktime",
        task_id: "tasktext",
        title_id: "tasktitle",
        spinner_id: "spinner_target",
        events_target_id: "datepicker-events",
        thisObject: "$.planner"
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
        SpinnerObject: $("#" + values.spinner_id),
        Update: {
            Time: false,
            Task: false,
            Title: false
        },
        ajaxLoaderBig: {
            size: 100,           // Width and height of the spinner
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
            InputForm: '<div id="planner-popup"><br /><canvas class="div-canvas-small" id="spinner-calendar-data" style="display:none"></canvas> <div id="back-popup-content"> <span class="input-group" style="width: 280px; display: inline-block;"> Заголовок: <br /> <input type="text" class="form-control" id="tasktitle3" value=""> </span> <span class="input-group clockpicker" style="width: 280px; display: inline-block;"> Час:<br /> <input type="text" class="form-control" id="tasktime3" value="" data-default="00:00"> </span> <script type="text/javascript"> $(\'#tasktime3\').clockpicker({ autoclose: true, donetext: "OK" }); </script> <br /> <br /> Подія: <br /> <textarea class="form-control input-group" name="tasktext3" rows="5" style="color: black; width: 565px; height: 100px;" id="tasktext3"></textarea><br /> </div> </div>',
            EventList: '<div id="datepicker_data"><br /> <div class="input-group input-group-lg"> <span id="left_date_button" class="input-group-addon btn btn-default glyphicon glyphicon-chevron-left"style="top:0px"></span> <input id="input_01" class="datepicker form-control" name="date" type="text" style="width: 290px; text-align:center; cursor: pointer"> <span id="right_date_button" class="input-group-addon btn btn-default glyphicon glyphicon-chevron-right" style="top:0px"></span> <span id="add_button" class="input-group-addon btn btn-success">Додати</span> <span id="archive_button" class="input-group-addon btn btn-info" style="">Архів</span> </div><div id="datepicker-events" style="overflow-y: auto; overflow-x: hidden; width: 560px; min-height: 300px"></div> </div>'
        },
        ArchiveLastState: false,
        Page: 1
    };

    var ManipulateHtml = function (string, tag) {
        var $html = string.parseHTML();

    };

    this.Today = Members.Today();
    var ajaxLoaderBig = new AjaxLoader($('#' + values.spinner_id), Members.ajaxLoaderBig);    

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
        },
        nextDay: function (date) {
            date = date.split('.');
            var tommorow = new Date(+date[2], +date[1]-1, +date[0] + 1, 0, 0, 0, 0);
            var dd = tommorow.getDate();
            var mm = tommorow.getMonth() + 1; //January is 0!
            var yyyy = tommorow.getFullYear();
            return dd + '.' + mm + '.' + yyyy;
        },
        prevDay: function (date) {
            date = date.split('.');
            var tommorow = new Date(+date[2], +date[1] - 1, +date[0] - 1, 0, 0, 0, 0);
            var dd = tommorow.getDate();
            var mm = tommorow.getMonth() + 1; //January is 0!
            var yyyy = tommorow.getFullYear();
            return dd + '.' + mm + '.' + yyyy;
        },
        dateConverter: function (date) {
            var today = date;
            var dd = today.getDate();
            var mm = today.getMonth() + 1; //January is 0!
            var yyyy = today.getFullYear();

            if (dd < 10) {
                dd = "0" + dd;
            }

            if (mm < 10) {
                mm = "0" + mm;
            }

            return today = dd + "." + mm + "." + yyyy;
        },
        isDateString: function(string) {
            return +((string + "").split(".").length) == 3;
        }
    }
    this.dateTimeOperations = DateTimeOperations;

    this.UpdateCounter = function () {
        APICalls.MakeAPICall("GetAllForUserDateCount", undefined, undefined, undefined, undefined, function (data) {
            if (+data["Data"] > 0) {
                $(".calendar-button-counter").show();
                $(".counter-placeholder").html(data["Data"]);
            }
            else {
                $(".calendar-button-counter").hide();
            }
        }, undefined);
    };
    var _updateCounter = this.UpdateCounter;

    var _d;
    this.Show = function (container, archive, page) {
        if (archive != undefined) Members.ArchiveLastState = archive;
        if (page != undefined) Members.Page = page; else page = Members.Page;

        _d = bootbox.dialog({
            closeButton: true,
            message: Members.Messages.EventList,
            buttons: {                                
                Close: {
                    label: "Приховати",
                    className: "btn btn-default",
                    callback: function () {
                        _d.modal('hide');
                    }
                }                
            }
        });

        var input = $('.datepicker').pickadate({
            today: 'Сьогодні',
            clear: '',
            close: 'Приховати',
            format: 'dd.mm.yyyy',
            onStart: function () {
                $('.datepicker').val($.ddate);
                $.planner.RenderTimeLabels($.ddate, Members.ArchiveLastState, page);
            },
            onSet: function (date) {
                if (!DateTimeOperations.isDateString(date.select)) {
                    $.ddate = DateTimeOperations.dateConverter(new Date(date.select));
                } else {
                    $.ddate = date.select;
                }
                $('.datepicker').val($.ddate);
                $.planner.RenderTimeLabels($.ddate, Members.ArchiveLastState, page);
            },
            monthsFull: ['Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень', 'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'],
            monthShort: ['Січ', 'Лют', 'Бер', 'Кві', 'Тра', 'Чер', 'Лип', 'Сер', 'Вер', 'Жов', 'Лис', 'Гру'],
            weekdaysFull: ['неділя', 'понеділок', 'вівторок', 'середа', 'четвер', 'пятниця', 'суббота'],
            weekdaysShort: ['нед', 'пнд', 'вів', 'срд', 'чтв', 'птн', 'сбт'],
            firstDay: 1
        });
        $(document).on('click', function () {
            $.picker.close();
        });
        
        $.picker = input.pickadate('picker');
        $.picker.set('select', $.planner.Today);       

        return false;
    }

    var _show = this.Show;

    this.Hide = function () {
        _d.modal('hide');
    }

    var _hide = this.Hide;    

    // Render list of events for date
    this.RenderTimeLabels = function (date, archive, page) {        
        date = Members.Date(date);
        if (page == undefined) page = 1;
        if (archive == undefined || archive == false) archive = "1";
        else if (+archive == 0 || archive == true) archive = "0";
        Members.Page = page;

        var callback = function (data) {
            var title = "";
            this.items = "<div class='popup-data'><ul><li><hr></li>";
            if (data["Data"].length == 0) {
                items += "<li><div class='btn input-group input-group-lg');'><span class='input-group-addon'>Oops</span><input type='text' class='form-control' style='cursor:default;' placeholder='Заплановані події відсутні' disabled></div></li><li><hr></li>";
            } else {                
                for (var i = 0; i < data["Data"].length; i++) {
                    if (+data["Data"]["PlannerId"] === 0)
                        items += nano("<li class='event'><div class='btn input-group input-group-lg' style='width: 530px;'><span class='input-group-addon'>{TimeTask}</span><input type='text' class='form-control' style='cursor:default;' placeholder='{Title}' disabled></div></li>", data["Data"][i]);
                    else
                        items += nano("<li class='event'><div class='btn input-group input-group-lg' style='width: 530px;' onclick='" + values.thisObject + ".ShowSelected(\"{PlannerId}\", \"{DateTask}\", \"{Actuality}\");'><span class='input-group-addon'>{TimeTask}</span><input type='text' class='form-control' style='cursor:default;' placeholder='{Title}' disabled></div></li>", data["Data"][i]);
                    if (title === "")
                        title = data["Data"][i].DateTask;
                }
                items += "<li><hr></li>";
            }
            if (DateTimeOperations.dateComparer(date, Members.Today()) >= 0) {
                if (+archive !== 0) {
                    Members.ArchiveLastState = false;                    
                }
                else {
                    Members.ArchiveLastState = true;                    
                }
            }
            items += "</ul></div>";
            ajaxLoaderBig.hide();
            if (title === "")
                title = Members.Today();            

            $("#datepicker-events").html(items);           
        };

        var beforeCall = function () {            
            $("#" + values.events_target_id).html('<canvas class="div-canvas-small" id="spinner-calendar"></canvas>');            
            ajaxLoaderBig = new AjaxLoader($("#" + values.events_target_id).find('#spinner-calendar'), Members.ajaxLoaderBig);
            try {
                ajaxLoaderBig.show();
            } catch (err) {
                $("#" + values.events_target_id).html('<canvas class="div-canvas-small" id="spinner-calendar"></canvas>');
                ajaxLoaderBig = new AjaxLoader($("#" + values.events_target_id).find('#spinner-calendar'), Members.ajaxLoaderBig);
                ajaxLoaderBig.show();
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
            callString = callString + "&time=" + $("#tasktime3").val();
        if (Members.Update.Task == true)
            callString = callString + "&task=" + $("#tasktext3").val();
        if (Members.Update.Title == true)
            callString = callString + "&title=" + $("#tasktitle3").val();
        return callString;
    };

    var DetectChanges = function (callback) {        
        $("#tasktext3").bind('input propertychange', function () { Members.Update.Task = true; callback(); });
        $("#tasktime3").bind('input propertychange', function () { Members.Update.Time = true; callback(); });
        $("#tasktime3").on("change", function () { Members.Update.Time = true; callback(); });
        $("#tasktitle3").bind('input propertychange', function () { Members.Update.Title = true; callback(); });
    };

    var ClearInputs = function () {
        Members.Update.Task = Members.Update.Time = Members.Update.Title = false;
        //$("#back-popup-content").css("visibility", "hidden");
    };

    // Display dialog message to manage selected event
    this.ShowSelected = function (id, date, archived) {
        var beforeAjaxCall = function () {            
            $("#" + values.template_id).css("display", "inline");
            var dialog = bootbox.dialog({
                closeButton: true,
                message: Members.Messages.InputForm,
                buttons: {
                    Add: {
                        label: "OK",
                        className: "btn btn-success update-pop-button",
                        callback: function () {
                            if (+id != 0) {
                                if ($(".update-pop-button").html() != "OK") {
                                    var callString = ApiEndpoint + "Calendar/UpdatePlanner?sessionId=" + Members.SessionId + "&idPlanner=" + id;
                                    if (+archived != 0) callString += Changes();
                                    else if (+archived == 0 && $(".update-pop-button").html() == "Відновити") callString += "&actuality=1";

                                    APICalls.MakeRawAPICall(callString, function () {
                                        update(date);
                                    });
                                }
                            }
                            Members.PopupObject.css("display", "none");
                            ClearInputs();
                        }
                    },
                    Delete: {
                        label: "Видалити",
                        className: "btn-danger",
                        callback: function () {
                            if (+id != 0) {
                                var callString = "";
                                if (+archived != 0) callString = ApiEndpoint + "Calendar/UpdatePlanner?sessionId=" + Members.SessionId + "&idPlanner=" + id + "&actuality=0";
                                else callString = ApiEndpoint + "Calendar/RemovePlanner?sessionId=" + Members.SessionId + "&idPlanner=" + id; // if event is already archived, we need to delete it tottaly

                                APICalls.MakeRawAPICall(callString, function () {
                                    update(date);
                                });
                            }
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
            $("#spinner-calendar-data").css("display", "inline-block");
            $("#back-popup-content").css("display", "none");
            ajaxLoaderBig = new AjaxLoader($('#spinner-calendar-data'), Members.ajaxLoaderBig);
            try {
                ajaxLoaderBig.show();
            } catch (err) {
                ajaxLoaderBig = new AjaxLoader($('#spinner-calendar-data'), Members.ajaxLoaderBig);
                ajaxLoaderBig.show();
            }
        };

        var callback = function (jdata) {
            var data = jdata["Data"][0];
            if (+archived == 0 && DateTimeOperations.dateComparer(date, Members.Today()) >= 0 && DateTimeOperations.timeComparar(data.TimeTask, Members.Time())) {
                $(".update-pop-button").html("Відновити");
            }
            ajaxLoaderBig.hide();
            $("#spinner-calendar-data").css("display", "none");
            $("#back-popup-content").css("display", "inline-block");

            $("#back-popup-content").css("visibility", "visible");            
            $("#tasktime3").val(data.TimeTask);
            $("#tasktitle3").val(data.Task);
            $("#tasktext3").val(data.Title);

            $("#tasktime3").text(data.TimeTask);
            $("#tasktext3").text(data.Task);
            $("#tasktitle3").text(data.Title);
            DetectChanges(function () {
                if (+archived != 0)
                    $(".update-pop-button").html("Оновити");
            });
        }
        GetSelected(id, callback, beforeAjaxCall);
    };

    var update = function (date) {
        _updateCounter();
        _renderTimeLabels(date, false);
    };    

    this.AddNew = function (date) {         
        if (date == undefined || date == "") {
            date = Members.Today();
        }

        $(".add-pop-btn").attr("disabled", "disabled");
        bootbox.dialog({
            closeButton: true,
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

    // run on-initialization events
    $(function () {
        _updateCounter();
    });    
};

// Nano template engine
Nano = function (template, data) {
    return template.replace(/\{([\w\.]*)\}/g, function (str, key) {
        var keys = key.split("."), v = data[keys.shift()];
        for (var i = 0, l = keys.length; i < l; i++) v = v[keys[i]];
        return (typeof v !== "undefined" && v !== null) ? v : "";
    });
}

ServerNotifications = function () {

    var _subscriptions = new Object();

    // Name, URL, assosiatedNames, onMessage 
    //if onMessage is undefined -> new simple notification will be added
    // use onMessage to provide custom on message action
    this.Subscribe = function (name, url, assosiatedNames, onMessage) { _add(name, url, onMessage); }
    var _add = function (name, url, assosiatedNames, onMessage) {
        if (name == undefined || url == undefined)
            throw new ExceptionInformation();

        if (onMessage == undefined)
            onMessage = simpleNotification;

        $.eventsource({
            label: name,
            url: url,
            dataType: "text",
            open: function (data) {
                if (_subscriptions != undefined)
                    if (_subscriptions[name] != undefined)
                        return;

                _subscriptions[name] = {
                    Name: name,
                    Url: url,
                    AssosiatedNames: assosiatedNames,
                    onMessage: onMessage
                }
            },
            message: onMessage
        });
    }

    // Remove subscription
    this.Remove = function (name) { _remove(name); }
    var _remove = function (name) {
        _subscriptions[name] = undefined;
    }

    // 
    this.Change = function (name, url) { _change(name, url); }
    var _change = function (name, url) {
        if (_subscriptions == undefined || _subscriptions == null || _subscriptions[name] == undefined || name == undefined || url == undefined)
            throw new ExceptionInformation();

        _remove(name);
    }

    var simpleNotificationDefaultMessageBuilder = function (e, assosiatedNames) {
        var message = "";

        if (assosiatedNames != undefined) {
            if (assosiatedNames.keys(obj).length == e.keys(obj).length)
                for (var propertyName in e) {
                    if (e[propertyName] != "null")
                        message += assosiatedNames[propertyName] + ": " + e[propertyName] + "<br />";
                }
        } else {
            for (var propertyName in e) {
                if (e[propertyName] != null)
                    message += e[propertyName] + "<br />";
            }
        }

        return message;
    }

    // Use to change default message build function
    // Action should accept as first argument EventMessage and as optional  associated array of labels
    //
    // return string message
    this.SimpleNotificationMessageBuilder = function (action) {
        if (action == undefined) throw new ExceptionInformation();
        simpleNotificationDefaultMessageBuilder = action;
    }

    var simpleNotification = function (e) {
        var message = simpleNotificationDefaultMessageBuilder(e);
        if (e["Title"] != null) {
            $.ambiance({
                type: "success",
                title: e["Title"],
                message: message,
                fade: true,
                timeout: 5
            });
        }
        else {
            $.ambiance({
                type: "success",
                message: message,
                fade: true,
                timeout: 5
            });
        }

    }
}