try{
	var xhr = new XMLHttpRequest();
	xhr.open("GET","http://api.ecampus.kpi.ua", false);
	xhr.send();
}
catch(e){
	console.log(e);
}