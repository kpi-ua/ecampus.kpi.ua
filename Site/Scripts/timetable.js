var ApiEndpoint = "http://api.ecampus.kpi.ua/";

// indentificaniya
function profile(sessionId) {
    var con = new XMLHttpRequest();
    con.open('POST', ApiEndpoint + "user/GetCurrentUser?sessionid=" + sessionId, false);
    con.send();
    var obj = JSON.parse(con.responseText);
    return obj;
}

function gettime(number) {
    var les = ["08:30<br/>10:15", "10:25<br/>12:05", "12:20<br/>14:00", "14:15<br/>15:55", "16:10<br/>17:45", "18:30<br/>20:05", "20:20<br/>21:55"];
    return les[number];
}

function Timetable(day) {
    this.dayweek = day;
    this.obj = [];
    this.obj2 = [];
    this.tablehtml = function () {
        var output = "<table>";
        var tablesize = 7;
        for (var i = 0; i < tablesize; i++) {
            if (this.obj[i]) {
                var timetable = {
                    dayname: this.obj[i].DayName,
                    subject: this.obj[i].Subject,
                    employee: this.obj[i].Employee,
                    building: this.obj[i].Building,
                    photo: this.obj[i].EmployeePhotoPath
                }
            } else
                var timetable = false;
            output += "<tr>";
            //lessonname.length <= 35
            if (i == 0) {
                output += "<td rowspan='" + tablesize + "' id='timetable_dayname'><p class='vertical'>" + this.dayweek + "</p></td>";
            }

            output += "<td class='timetable_number'>" + gettime(i) + "</td>";
            // I
            if (timetable) {
                output += "<td id='lesson'>";
                output += "<a class='tt_lesson_name' href='#test'>" + timetable.subject + "</a>";
                output += "<p title='" + timetable.photo + "' class='tt_teacher_name'>" + timetable.employee + "</p>";
                output += "<p class='tt_build_name'>" + timetable.building + "</p></td>";
            } else
                output += "<td id='lesson'><p class='tt_noinfo'>&#8212;&#8212;&#8212;&#8212;</p></td>";
            if (this.obj2[i]) {
                var timetable = {
                    dayname: this.obj2[i].DayName,
                    subject: this.obj2[i].Subject,
                    employee: this.obj2[i].Employee,
                    building: this.obj2[i].Building,
                    photo: this.obj2[i].EmployeePhotoPath
                };
            } else
                var timetable = false;
            if (timetable) {
                output += "<td id='lesson'>";
                output += "<a class='tt_lesson_name' href='#test'>" + timetable.subject + "</a>";
                output += "<p title='" + timetable.photo + "' class='tt_teacher_name'>" + timetable.employee + "</p>";
                output += "<p class='tt_build_name'>" + timetable.building + "</p></td>";
            } else
                output += "<td id='lesson'><p class='tt_noinfo'>&#8212;&#8212;&#8212;&#8212;</p></td>";
            output += "</tr>";

        }
        output += "</table>";
        return output;
    };
};

Timetable.prototype.load = function (getx) {
    var get = new Object();
    get = getx;
    var number = get.LessonId - 1;
    var weeknum = get.WeekNum;
    if (weeknum == 0) {
        this.obj[number] = get;
        this.obj2[number] = get;
    }
    if (weeknum == 1)
        this.obj[number] = get;
    else this.obj2[number] = get;
};

Timetable.prototype.draw = function (i) {
    if ((i % 2) === 0)
        $('#tableinput').append('<tr class="timetableline_' + i + '"><td>' + this.tablehtml() + '</td></tr>');
    else
        $('.timetableline_' + (i - 1)).append('<td>' + this.tablehtml() + '</td>');
};

var student = 'student';
$(document).ready(function () {
    // inicializasiya
    var profiledata = profile(sessionId);
    if (profiledata.Data.Employees.length > 0) student = 'employee';

    var Mondaytimetable = new Timetable("Monday");
    var Thursdaytimetable = new Timetable("Thursday");
    var Tuesdaytimetable = new Timetable("Tuesday");
    var Fridaytimetable = new Timetable("Friday");
    var Wednesdaytimetable = new Timetable("Wednesday");
    var Saturdaytimetable = new Timetable("Saturday");
    var tables = [Mondaytimetable, Thursdaytimetable, Tuesdaytimetable, Fridaytimetable, Wednesdaytimetable, Saturdaytimetable];
    var tableinit = [Mondaytimetable, Tuesdaytimetable, Wednesdaytimetable, Thursdaytimetable, Fridaytimetable, Saturdaytimetable];


    var con = new XMLHttpRequest();
    con.open('POST', ApiEndpoint + "timetable/GetTimeTable?sessionId=" + sessionId + "&profile=" + student, true);
    con.onreadystatechange = function () {
        if (con.readyState == 4) {
            if (con.status == 200) {
                var obj = JSON.parse(con.responseText);
                var timetabledata = obj.Data;
                console.log(timetabledata.length);
                for (var j = 0; j < timetabledata.length; j++) {
                    var daytb = timetabledata[j].DayId;
                    var needtabl = tableinit[daytb - 1];
                    needtabl.load(timetabledata[j]);
                }

                $('#tableinput').html('');
                $('#loading').addClass('invisible');
                $('#tableinput').addClass('invisible');
                var i = 0;
                tables.forEach(function (value) {
                    value.draw(i);
                    i++;
                });
                $('#tableinput').slideToggle('slow');
                $('#tableinput').removeClass('invisible');

            }
        }
        // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        var photohref;
        $('.tt_teacher_name').hover(function (event) {
            // hover
            var teachername = $(this).html();
            var lessonname = $('.tt_lesson_name').html();
            photohref = $(this).attr('title');
            var titleText = "<p><b>Teacher</b>: " + teachername + "<br/><b>Lesson</b>: " + lessonname + "</p><img src='" + photohref + "'>";


            $('.tooltip')
                .css('top', (event.pageY - 10) + 'px')
                .css('left', (event.pageX + 20) + 'px');
            $(this)
                .data('tipText', titleText)
                .removeAttr('title');
            $('<p class="tooltip"></p>')
                .html(titleText)
                .appendTo('body')
                .css('top', (event.pageY - 10) + 'px')
                .css('left', (event.pageX + 20) + 'px')
            //.fadeIn('slow');
        }, function () {
            // hover out
            $(this).attr('title', photohref);
            $('.tooltip').remove();
        }).mousemove(function (event) {
            // move
        });


    };
    con.send();


});
// });