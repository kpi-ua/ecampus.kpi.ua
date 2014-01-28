function login(){
    var con = new XMLHttpRequest();

    con.open('POST',"http://api.ecampus.kpi.ua/user/Auth?login=1&password=1",false);
    con.send();
    var obj = JSON.parse(con.responseText);
    return obj.Data;
    }
function gettimetabledata(sesid,student){
    var con = new XMLHttpRequest();
    var isstudent = (student = false) ? "student" : "employee";
    con.open('POST',"http://api.ecampus.kpi.ua/timetable/GetTimeTable?sessionId="+sesid+"&profile="+isstudent,false);
    con.send();
    var obj = JSON.parse(con.responseText);
    console.log('Timetable succesfull loaded!:');
    console.log(obj.Data);
    return obj.Data;
    }
function gettime(number){
	var les = ["08:30<br/>10:15","08:30<br/>10:15","08:30<br/>10:15","08:30<br/>10:15","08:30<br/>10:15"];
	return les[number];
}
function profile(sesid){
    var con = new XMLHttpRequest();
    con.open('POST',"http://api.ecampus.kpi.ua/user/GetCurrentUser?sessionid="+sesid,false);
    con.send();
    var obj = JSON.parse(con.responseText);
    return obj;
}
function Timetable(day){
    this.dayweek = day;
    this.obj = [];
    this.obj2 = [];
    this.tablehtml = function(){
        var output = "<table>";
        for (var i = 0; i < 5; i++){
            if (this.obj[i]){
                    var timetable = {
                        dayname:  this.obj[i].DayName,
                        subject: this.obj[i].Subject,
                        employee: this.obj[i].Employee,
                        building: this.obj[i].Building
                                    }
                                   }else
                    var timetable = false;
        output += "<tr>";
        //lessonname.length <= 35
        if (i===0) output += "<td rowspan='5' id='timetable_dayname'><p class='vertical dayname"+ this.dayweek+"'>" + this.dayweek + "</p></td>";
       output += "<td class='timetable_number'>" + gettime(i) + "</td>";
       // I
       if (timetable){ 
        output += "<td id='lesson'>";
        output += "<a class='tt_lesson_name' href='#test'>"+timetable.subject+"</a>";
        output += "<p title='bio' class='tt_teacher_name'>"+timetable.employee+"</p>";
        output += "<p class='tt_build_name'>"+timetable.building+"</p></td>";
        } else
        output += "<td id='lesson'><p class='tt_noinfo'>------</p></td>";
            if (this.obj2[i]){
                    var timetable = {
                        dayname:  this.obj2[i].DayName,
                        subject: this.obj2[i].Subject,
                        employee: this.obj2[i].Employee,
                        building: this.obj2[i].Building
                                    }
                                   }else
                    var timetable = false;
        if (timetable){ 
            output += "<td id='lesson'>";
            output += "<a class='tt_lesson_name' href='#test'>"+timetable.subject+"</a>";
            output += "<p title='bio' class='tt_teacher_name'>"+timetable.employee+"</p>";
            output += "<p class='tt_build_name'>"+timetable.building+"</p></td>";
            } else
            output += "<td id='lesson'><p class='tt_noinfo'>------</p></td>";
       // ...

        // output += "<td id='lesson'><p class='tt_noinfo'>------</p></td>";
        output += "</tr>";
    
            }
        output += "</table>";
        return output ;
                          }      };

Timetable.prototype.load = function(getx){
    var get = new Object();
    get = getx;
    var number = get.LessonId;
    var weeknum = get.WeekNum;
    if (weeknum == 0){
        this.obj[number] = get;
        this.obj2[number] = get;
    }
    if (weeknum == 1)
    this.obj[number] = get;
    else this.obj2[number] = get;
}
Timetable.prototype.draw = function(){
    $('#tableinput').append(this.tablehtml());
    }



var student = true;
$(document).ready(function(){
    // inicializasiya
    var sessionid = login();
    var profiledata = profile(sessionid);
    if (profiledata.employees) student = false;

    var Mondaytimetable = new Timetable("Monday");
    var Thursdaytimetable = new Timetable("Thursday");
    var Tuesdaytimetable = new Timetable("Thuesday");
    var Fridaytimetable = new Timetable("Friday");
    var Wednesdaytimetable = new Timetable("Wednesday");
    var Saturdaytimetable = new Timetable("Saturday");
    var tables = [Mondaytimetable,Thursdaytimetable,Tuesdaytimetable,Fridaytimetable,Wednesdaytimetable,Saturdaytimetable];
    
    // for (var i=0; i < 4; i++){
    //     var needtabl = tables[1];
    //     needtabl.load(timetabledata[i]);
    // }
    var con = new XMLHttpRequest();
    con.open('POST',"http://api.ecampus.kpi.ua/timetable/GetTimeTable?sessionId="+sessionid+"&profile=employee",true);
    con.onreadystatechange = function() {
    if (con.readyState == 4) {
     if(con.status == 200) {
       var obj = JSON.parse(con.responseText);  
       var timetabledata = obj.Data;
       console.log(obj.Data);

       for(var j = 0 ; j < timetabledata.length; j++){
    var daytb = timetabledata[j].DayId;
    var needtabl = tables[daytb];
    needtabl.load(timetabledata[j]);
    console.log('check!');
    }

       $('#tableinput').html('');
        $('#tableinput').addClass('invisible');
        tables.forEach(function(value){ 
            value.draw();
            });
        $('#tableinput').slideToggle('slow');

        }
    }

    $('.tt_teacher_name').hover(function(event) {
    // hover
        var teachername = $(this).html();
        var lessonname = $('.tt_lesson_name').html();
        var titleText = "<p>Greetings: "+teachername+"<br/>Studing:"+ lessonname+"</p><img src='bin/profile.png'>"
        $(this)
          .data('tipText', titleText)
          .removeAttr('title');
        $('<p class="tooltip"></p>')
          .html(titleText)
          .appendTo('body')
          .css('top', (event.pageY - 10) + 'px')
          .css('left', (event.pageX + 20) + 'px')
        .fadeIn('slow');
    }, function() {
    // hover out
    $(this).attr('title', $(this).data('tipText'));
    $('.tooltip').remove();
    }).mousemove(function(event) {
    // move
    });
    $('.tooltip')
    .css('top', (event.pageY - 10) + 'px')
    .css('left', (event.pageX + 20) + 'px');
    
};
    con.send();

    
    });
        // });