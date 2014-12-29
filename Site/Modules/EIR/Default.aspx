<%@ Page Title="Пошук" Language="C#" MasterPageFile="~/Modules/EIR/Menu.master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="Site.Modules.EIR.Default" %>

<asp:Content ID="Content3" ContentPlaceHolderID="breadcrumbs_new" runat="server">
    <li class="active">Пошук</li>
</asp:Content>
<asp:Content ID="Content1" ContentPlaceHolderID="newhead" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="newbody" runat="server">
    <link rel="stylesheet" href="//code.jquery.com/ui/1.11.2/themes/smoothness/jquery-ui.css">
    <script src="//code.jquery.com/jquery-1.10.2.js"></script>
    <script src="//code.jquery.com/ui/1.11.2/jquery-ui.js"></script>
    <script src="/Scripts/APIlib.js"></script>

    <link href="/Content/simplePagination.css" rel="stylesheet" />
    <script type="text/javascript" src="/Scripts/jquery.simplePagination.js"></script>
    <script>
        $("#search_tab").addClass("active");
                
        var ctt;
        $(function () {
              
            var rawData = <%=new System.Web.Script.Serialization.JavaScriptSerializer().Serialize(this.arr) %>
            $("#avt").autocomplete({
                source: rawData,
                minLength: 3,
                delay:500
            });
            //avtocom
            addoption_autor();
            addoption_day("number");
            addoption_month("month");
          

            API.getData(["Ir", "GetIrKinds"], {}, function (data) {
                var html = "";
                $.each(data, function (key, value) {
                    if (value.kinds.length > 0) {
                        html += "<optgroup label='" + value.name + "' value='" + value.id + "'>";
                        for (var item in value.kinds) {
                            html += "<option value='" + value.kinds[item].id + "'>" + value.kinds[item].name + "</option>";
                        }
                        html += "</optgroup>";
                    }
                });
                $("#vid").append(html);
                //  $("#vid").chosen();
            });
            /*---------------------------------------------------------------------------------------------------------------*/
            //при 3агру3ке пейджинг - всех ЕИР     
            API.getData(["Ir", "GetAllIrs"], {sessionId:ssid, pageNumber:1, pageSize:31},
               
            function (data) {
                var html = "";
                var PageCountt;
                html += "<tr>";
                html += "<td>" + "УСІ ЕІР" + "</td>"; 
                html += "</tr>";
                $.each(data, function (key, value) {
               
                    
                    html += "<tr>";
                    html += "<td width=70%>" + value.NameShort + "</td>";     
                    html += "<td>" + "Null" + "</td>"; 
                    html += "</tr>"; 
                      
                    
                })
               
                $("#last").append(html);
              
            });
            $("#pg").pagination({
                pages:<%=new System.Web.Script.Serialization.JavaScriptSerializer().Serialize(this.pgg) %>,//Получение о6щего числа страниц
                cssStyle: 'light-theme',
                onPageClick: agenumber   //Данные страницы по нажатию страницы
             
            });            
            ///*********************************************************
            //при 3агру3ке пейджинг - ЕИР по дисциплине  
            $("#pg1").pagination({
                pages:<%=new System.Web.Script.Serialization.JavaScriptSerializer().Serialize(this.pgs) %>,//Получение о6щего числа страниц
                cssStyle: 'light-theme',
                onPageClick: ddsc   //Данные страницы по нажатию страницы
             
            });          
            
            var s=<%=new System.Web.Script.Serialization.JavaScriptSerializer().Serialize(this.pgsstring)%>;
            //alert(s);
            API.getData(["Ir", "GetIrbyDcDisc"], {sessionId:ssid, dsc:s, pageNumber:1, pageSize:31},
              function (data) {
                  var html = "";

                  $("#last1").empty();
                  html += "<tr>";
                  html += "<td>" + "ЕІР по дисципліні" + "</td>"; 
                  html += "</tr>";
                  html += "<tr>";
                  html += "<td>" + "Назва ЕІР" + "</td>"; 
                  html += "</tr>";
                  $.each(data, function (key, value) {
                                       
                      html += "<tr>";
                      html += "<td>" + value.NameShort + "</td>"; 
                      html += "</tr>"; 
                   
                  })

                  $("#last1").append(html);
              });   
            //************************************************************************
            //при 3агру3ке пейджинг - ЕИР по модулю 
            $("#pg2").pagination({
                pages:<%=new System.Web.Script.Serialization.JavaScriptSerializer().Serialize(this.pcm) %>,//Получение о6щего числа страниц
                cssStyle: 'light-theme',
                onPageClick: ccred   //Данные страницы по нажатию страницы
             
            });          
            
            var s=<%=new System.Web.Script.Serialization.JavaScriptSerializer().Serialize(this.pcmstring)%>;
            //alert(s);
            API.getData(["Ir", "GetIrbyCredMod"], {sessionId:ssid, dsc:s, pageNumber:1, pageSize:31},
              function (data) {
                  var html = "";

                  $("#last2").empty();
                  html += "<tr>";
                  html += "<td>" + "ЕІР по кредитному модулю" + "</td>"; 
                  html += "</tr>";
                  html += "<tr>";
                  html += "<td>" + "Назва ЕІР" + "</td>"; 
                  html += "</tr>";
                  $.each(data, function (key, value) {
                                       
                      html += "<tr>";
                      html += "<td>" + value.NameShort + "</td>"; 
                      html += "</tr>"; 
                   
                  })

                  $("#last2").append(html);
                  
              });   
            //----------------------------------------------------------
            //при 3агру3ке пейджинг - ЕИР по метаданным
            $("#pg3").pagination({
                pages:500,              //Получение о6щего числа страниц
                cssStyle: 'light-theme',
                onPageClick: avtvid ,   //Данные страницы по нажатию страницы
                currentPage:2
            });    
                       
            API.getData(["Ir", "GetIrResourses"], {sessionId:ssid, author:tt, type:$("#vns option:selected").text(), irview:$("#vid option:selected").text(), pageNumber:1, pageSize:31},
              function (data) {
                  var html = "";

                  $("#last3").empty();
                  html += "<tr>";
                  html += "<td>" + "ЕІР по метаданним" + "</td>"; 
                  html += "</tr>";
                  html += "<tr>";
                  html += "<td>" + "Назва ЕІР" + "</td>"; 
                  html += "</tr>";
                  $.each(data, function (key, value) {
                                       
                      html += "<tr>";
                      html += "<td>" + value.NameShort + "</td>"; 
                      html += "</tr>"; 
                   
                  })

                  $("#last3").append(html);
             
              });  
           

        });
        
        function addoption_autor() {
            var options = <%=new System.Web.Script.Serialization.JavaScriptSerializer().Serialize(this.arrc) %>
             $.each(options, function(key, value) {
                 $('#vns')
                 .append($('<option>', {
                     value : key
                 })
                 .text(value));
             });
        }
                

        function addoption_day(id) {
            var objSel = document.getElementById(id);
            var options = <%=new System.Web.Script.Serialization.JavaScriptSerializer().Serialize(this.days) %>
            for(var h=0; h<<%=d%>; h++){ objSel.options[objSel.options.length]= new Option(options[h], ""); }
        }

        function addoption_month(id) {
            var objSel = document.getElementById(id);
            var options = <%=new System.Web.Script.Serialization.JavaScriptSerializer().Serialize(this.months) %>
            for(var h=0; h<<%=mon%>; h++){ objSel.options[objSel.options.length]= new Option(options[h], ""); }
        }
            
        //Данные страницы по нажатию страницы
        function agenumber() 
        {
            //Определение нажатой кнопки(страницы) 
            var t=$("#pg").pagination('getCurrentPage');
          
            API.getData(["Ir", "GetAllIrs"], {sessionId:ssid, pageNumber:t, pageSize:31},
              function (data) {
                  var html = "";

                  $("#last").empty();
                  html += "<tr>";
                  html += "<td>" + "УСІ ЕІР" + "</td>"; 
                  html += "</tr>";
                  html += "<tr>";
                  html += "<td>" + "Назва ЕІР" + "</td>"; 
                  html += "<td>" + "Автор" + "</td>"; 
                  html += "</tr>";
                  $.each(data, function (key, value) {
                                       
                      html += "<tr>";
                      html += "<td width=70%>" + value.NameShort + "</td>"; 
                      html += "<td>" + "Null" + "</td>"; 
                      html += "</tr>"; 
                   
                  })

                  $("#last").append(html);
                  // $("#last").chosen();
              });                      
        }

        //Данные страницы по нажатию страницы
        function ddsc() 
        {
            
            var t=$("#pg1").pagination('getCurrentPage');
            var s=<%=new System.Web.Script.Serialization.JavaScriptSerializer().Serialize(this.pgsstring)%>;
            // alert(s);
            API.getData(["Ir", "GetIrbyDcDisc"], {sessionId:ssid, dsc:s, pageNumber:t, pageSize:31},
              function (data) {
                  var html = "";

                  $("#last1").empty();
                  html += "<tr>";
                  html += "<td>" + "ЕІР по дисципліні" + "</td>"; 
                  html += "</tr>";
                  html += "<tr>";
                  html += "<td>" + "Назва ЕІР" + "</td>"; 
                  html += "</tr>";
                  $.each(data, function (key, value) {
                                       
                      html += "<tr>";
                      html += "<td>" + value.NameShort + "</td>"; 
                      html += "</tr>"; 
                   
                  })

                  $("#last1").append(html);
                 
              });          
        }
        //Данные страницы по нажатию страницы
        function ccred() 
        {
            
            var t=$("#pg2").pagination('getCurrentPage');
            var s=<%=new System.Web.Script.Serialization.JavaScriptSerializer().Serialize(this.pcmstring)%>;
            //alert(s);
            API.getData(["Ir", "GetIrbyCredMod"], {sessionId:ssid, dsc:s, pageNumber:t, pageSize:31},
              function (data) {
                  var html = "";

                  $("#last2").empty();
                  html += "<tr>";
                  html += "<td>" + "ЕІР по кредитному модулю" + "</td>"; 
                  html += "</tr>";
                  html += "<tr>";
                  html += "<td>" + "Назва ЕІР" + "</td>"; 
                  html += "</tr>";
                  $.each(data, function (key, value) {
                                       
                      html += "<tr>";
                      html += "<td>" + value.NameShort + "</td>"; 
                      html += "</tr>"; 
                   
                  })

                  $("#last2").append(html);
                 
              });          
        }
        
        
        function avtvid() 
        {
            var t=$("#pg3").pagination('getCurrentPage');
                                                  
            var irvieww=document.getElementById('vid');
            var txt2 = irvieww.options[irvieww.selectedIndex].text;
                                  
            API.getData(["Ir", "GetIrResourses"], {sessionId:ssid, author:tt, type:$("#vns option:selected").text(), irview:$("#vid option:selected").text(), pageNumber:t, pageSize:31},
              function (data) {
                  var html = "";

                  $("#last3").empty();
                  html += "<tr>";
                  html += "<td>" + "ЕІР по метаданними" + "</td>"; 
                  html += "</tr>";
                  html += "<tr>";
                  html += "<tr>";
                  html += "<td>" + "Назва ЕІР" + "</td>"; 
                  html += "</tr>";
                  $.each(data, function (key, value) {
                                       
                      html += "<tr>";
                      html += "<td>" + value.NameShort + "</td>"; 
                      html += "</tr>"; 
                   
                  })

                  $("#last3").append(html);
                 
              });  
        }
        var tt;
        function av(g) 
        {
            //  alert(g);
            tt=g;
            // alert(tt);
        }

    </script>

    <!--  -------------- -->
    <section class="eirsearch form-horizontal">
        <h4>Способи пошуку</h4>
        
        <div class="panel panel-default">
            <div class="panel-heading">
                <h3 class="panel-title">За метаданними</h3>
            </div>
            <div class="panel-body">
                <div class="form-group">
                    <label for="eirname" class="col-sm-2 control-label">Назва ЕІР</label>
                    <div class="col-sm-10">
                        <input class="form-control"  name="eirname" type="text" id="nam" placeholder="Назва ЕІР" />
                    </div>
                </div>

                <div class="form-group">
                    <label for="avt" class="col-sm-2 control-label">Автор</label>
                    <div class="col-sm-10">
                        <input class="form-control"  name="eirauthor" type="text" id="avt" placeholder="Автор" value="" onchange="var c = this.value; av(c);"/>
                    </div>
                </div>

                <div class="form-group">
                    <label for="eirauthorcontrib" class="col-sm-2 control-label">Тип внеску</label>
                    <div class="col-sm-10">
                        <select class="form-control"  name="eirauthorcontrib" id="vns" onselect="">
                           <option disabled selected value="--">Тип внеску</option>
                        </select>
                      
                    </div>
                </div>
             
                <div class="form-group">
                    <label for="eirview" class="col-sm-2 control-label">Вид ЕІР</label>
                    <div class="col-sm-10">
                        <select class="form-control"  name="eirview" id="vid">
                            <option disabled selected value="--">Вид ЕІР</option>
                        </select>
                    </div>
                </div>

                <div class="form-group form-inline">
                    <label class="col-sm-2 control-label">Дата</label>
                    <div class="col-sm-10">
                        <label for="year">Рік</label>
                        <select  class="form-control" name="daty" id="year">
                            <option>2014</option>
                            <option>2013</option>
                        </select>
                        <label for="month" >Місяць</label>
                        <select class="form-control"  name="datm" id="month">
                          
                        </select>
                        <label for="number">Число</label>
                        <select class="form-control"  name="datn" id="number">
                           
                        </select>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="panel panel-default">
            <div class="panel-heading">
                <h3 class="panel-title">За дисципліною</h3>
            </div>
            <div class="panel-body">
                <div class="form-group">
                    <label for="eirname" class="col-sm-2 control-label">Дисципліни</label>
                    <div class="col-sm-10">
                        <input class="form-control" name="disciplines" type="text" id="dssc" placeholder="Дисципліни"  runat="server"/>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="panel panel-default">
            <div class="panel-heading">
                <h3 class="panel-title">За кредитним модулем</h3>
            </div>
            <div class="panel-body">
                <div class="form-group">
                    <label for="eirname" class="col-sm-2 control-label">Кредитні модулі</label>
                    <div class="col-sm-10">
                        <input class="form-control"  name="credmod" type="text" id="crdd" placeholder="Кредитні модулі"  runat="server"/>
                    </div>
                </div>
            </div>
        </div>
        <div class="panel panel-default" ID="rez" runat="server">
            <div class="panel-heading">
                <h3 class="panel-title">Результат:</h3>
            </div>
            <div class="panel-body" > 
               
                <div ID="pg" ></div>  <!--все ЕИР-->
                <div ID="pg1"></div> <!--дисцип ЕИР-->
                <div ID="pg2"></div> <!--кремод ЕИР-->
                <div ID="pg3"></div> <!--по по1ям ЕИР-->
                <table class="table table-bordered table-hover" id="last" ><!--все ЕИР-->
                 <tr>
                   <td>Назва ЕІР</td>
                   <td>Автор</td>
                 </tr>
                </table>
                <table class="table table-bordered table-hover" id="last1" ><!--дисцип ЕИР-->
                 <tr>
                   <td>Назва ЕІР</td>
                 </tr>
                </table>
                 <table class="table table-bordered table-hover" id="last2" ><!--кремод ЕИР-->
                 <tr>
                   <td>Назва ЕІР</td>
                 </tr>
                </table>
                <table class="table table-bordered table-hover" id="last3" ><!--по по1ям ЕИР-->
                 <tr>
                   <td>Назва ЕІР</td>
                 </tr>
                </table>
                <!-- -->
            </div>
        </div>
        <div class="text-right">
            <input class="btn btn-default" type="button" id="clearr" value="Очистити"  onclick="$('#avt').val(''); $('#nam').val(''); $('#dsc').val(''); $('#crd').val(''); $('#last').empty();$('#pg').hide();$('#last1').empty();$('#pg1').hide();$('#last2').empty();$('#pg2').hide(); $('#last3').empty();$('#pg3').hide();" />
         <!--     <input class="btn btn-primary" type="button" id="searchh" value="Пошук" />-------------- -->
            
            <asp:Button class="btn btn-primary" ID="autnam" runat="server" Text="Пошук за метаданними" OnClick="aut" />
            <asp:Button class="btn btn-primary" ID="searchh" runat="server" Text="Усі ЕІР" OnClick="search" />
            <asp:Button class="btn btn-primary" ID="ds" runat="server" Text="Пошук по дисципліні" OnClick="dsc" />
            <asp:Button class="btn btn-primary" ID="cs" runat="server" Text="Пошук по модулю" OnClick="crd" />
        </div>
    </section>


</asp:Content>
