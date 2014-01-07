var TimeTable ={
	showlesson: function(lesson_number,day){
		var needlesson = TimeTable.lessons[lesson_number];
		var lesson_number_true = (lesson_number == 0) ? '<td rowspan="'+this.lessons.length+'" class="vertical" id="dayname">'+ this.dayweek[day] +'</td><td>#</td>' : '<td>' +lesson_number+ '</td>';
		var inputstream = "<tr>"+lesson_number_true;
		// gogo
		for (cell in needlesson){
			var islessonname = '';
			// subjectName vsegda s clasom :D
			if ((cell === 'SubjectName') || (cell === 'SubjectName2') ) islessonname = ' id="lesson_name"';
			
		// ebashim stroku esli net nulla
		if (needlesson[cell] !== null)
			inputstream += '<td'+ islessonname +'>' + needlesson[cell] + '</td>';
		else
		// if stroka - null => pishem 'gg' :D
		inputstream += '<td colspan="3" class="no_lesson">&nbsp</td>';
		return inputstream + '</tr>';
		},
		
	showalllessons: function(day){
		var lessons = '';
		for (var i=0; i < this.lessons.length; i++)
			lessons += this.showlesson(i,day);

		$('#schedule').append(lessons);
		}
		
		};