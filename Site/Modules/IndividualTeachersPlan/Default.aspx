<%@ Page Title="Індивідуальний план викладача" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="Site.Modules.IndividualTeachersPlan.IndividualTeachersPlan" %>

<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">

   <%-- <div class="page-header">
        <h1><%=Page.Title %></h1>
    </div>--%>
    <div class="profile">
        <ul class="nav nav-tabs" id="myTab">
            <li class="active"><a href="#tab1" data-toggle="tab">Наукова діяльність </a></li>
            <li><a href="#tab2" data-toggle="tab">Редагування</a></li>
            </ul>


            <div class="tab-content" style ="width: 1000px;">
            <div class="tab-pane active" id="tab1" style ="width: 1000px;">
                     



       
    <div class="row" runat="server" style="margin-left: 1px;" >
         <ul class="list-group">
                                            
                    <li class="list-group-item_j"> <h2>Наукова  діяльність</h2> 

     
                       <li><h3><label><input type="checkbox" id="1"> Видання</label><br></h3> 
                                             
                                                
       
                            <div id="1b" class="dip_none">
                                                    
                                                             
   <label><input type="checkbox" id="1r" > монографії</label><br> <div   id="15" class="dip_none"> 
       
       <ul class="hr">
       <li><input type="checkbox" id="15r"> --------</li> 
   <li ><input type="checkbox" id="151">-------- </li> 
   <li ><input type="checkbox" id="152"> --------</li> 
   <li ><input type="checkbox" id="153"> --------</li> 
   <li ><input type="checkbox"id="154"> ----------------</li> 
       </ul>
        <ul class="hrg">
       <li >  <textarea id="155" class="dip_none" placeholder="Введите текст 1"></textarea> </li>
       <li >  <textarea id="156" class="dip_none" placeholder="Введите текст 2"></textarea> </li>
       <li >  <textarea id="157" class="dip_none" placeholder="Введите текст 3"></textarea> </li>
       <li >  <textarea id="158" class="dip_none" placeholder="Введите текст 4"></textarea> </li>
       <li >  <textarea id="159" class="dip_none" placeholder="Введите текст 5"></textarea> </li>
             </ul>
        <%--<textarea placeholder="Введите текст"></textarea><br> </div>--%>
      
    




   <label><input type="checkbox" id="11" > підручники</label><br> <div id="16"   class="dip_none"  >  <textarea placeholder="Введите текст"></textarea><br> </div>
   <label><input type="checkbox" id="12"> словники</label><br> <div id="17"  class="dip_none"  >  <textarea placeholder="Введите текст"></textarea><br> </div>
   <label><input type="checkbox" id="13"> довідники</label><br> <div id="18"  class="dip_none" >  <textarea placeholder="Введите текст"></textarea><br> </div>
   <label><input type="checkbox"id="14"> електронні наукові видання</label><br> <div id="19"  class="dip_none"  >  <textarea placeholder="Введите текст"></textarea><br> </div>
  
                                </div>
                           
                             <script>
                                 //$('#1').on('click', function () { $('#6').css('display', ''); });монографії
                                 //$('#1').on('click', function () { $('#6').css('display', 'none'); });
                                


                                
                             </script>
                    
                                
                            


<%--<div class="accordion">

    <script language="JavaScript"></script>
    <h3 id="top_div_0" onclick="upAnime(0);"></h3>
    <p id="an0" align="center" style="display:none;z-index:100;"></p>
    <p id="an_ul0" style="display:none;"></p>
    <h3 id="top_div_2" onclick="upAnime(2);"></h3>
    <p id="an2" align="center" style="display: block; z-index: 100;"></p>
    <p id="an_ul2" style="display:none;"></p>
    <h3 id="top_div_4" onclick="upAnime(4);"></h3>
    <p id="an4" align="center" style="display:none;z-index:100;"></p>
    <p id="an_ul4" style="display:none;"></p>
                            </div>--%>




 <%--<select name="name_spiska" >
       <option value="0"> монографії </option>
                                                 
  
 
       <option value="1">підручники </option>
       <option value="2"> словники </option>
       <option value="3"> довідники </option>
       <option value="4">стандарти </option>
       <option value="5">електронні наукові видання </option>
 </select>
                            

                            <select multiple><optgroup label="Группа 1">
<option value="1">Option</option>
<option value="2">Textarea</option>
</optgroup>
                                <optgroup label="Группа 2">
<option value="3">Label</option>
<option value="4">Fieldset</option>
<option value="5">Legend</option></select>
                            </optgroup>
                            <ul>
                                 
                        <li>монографії</li>
                        <li>підручники</li>
                        <li>словники</li>
                        <li>довідники</li>
                        <li>стандарти</li> 
                        <li>електронні наукові видання</li>
                        
                            </ul>--%>

                              <li><h3><label><input type="checkbox" id="2"> Статті</label><br></h3> 
                            <ul>

                         <div id="2b" style="display:none">
                                                    
   <label><input type="checkbox" id="2r"> --------</label><br> <div id="25" class="dip_none">  <textarea placeholder="Введите текст"></textarea><br> </div>
   <label><input type="checkbox" id="21">-------- </label><br> <div id="26" class="dip_none">  <textarea placeholder="Введите текст"></textarea><br> </div>
   <label><input type="checkbox" id="22"> --------</label><br> <div id="27" class="dip_none">  <textarea placeholder="Введите текст"></textarea><br> </div>
   <label><input type="checkbox" id="23"> --------</label><br> <div id="28" class="dip_none">  <textarea placeholder="Введите текст"></textarea><br> </div>
   <label><input type="checkbox"id="24"> ----------------</label><br> <div id="29" class="dip_none">  <textarea placeholder="Введите текст"></textarea><br> </div>
   
                                </div>
                       
                            </ul>

                         <li><h3><label><input type="checkbox" id="3">Конференції/семінари/симпозіуми </label><br></h3> 
                            <ul>
                                <div id="3b" style="display:none">
                                                      
                                                             
   <label><input type="checkbox" id="3r">місце проведення</label><br> <div id="35" class="dip_none">  <textarea placeholder="Введите текст"></textarea><br> </div>
   <label><input type="checkbox" id="31">назва заходу</label><br> <div id="36" class="dip_none">  <textarea placeholder="Введите текст"></textarea><br> </div>
   <label><input type="checkbox" id="32">назва доповіді</label><br> <div id="37" class="dip_none">  <textarea placeholder="Введите текст"></textarea><br> </div>
   
  
                                </div>
                        
                            </ul>

                               <li><h3><label><input type="checkbox" id="4">Наукові виставки </label><br></h3> 
                            <ul>
                                 <div id="4b" style="display:none">
                                                    
                                                             
   <label><input type="checkbox" id="4r">місце проведення</label><br> <div id="45" class="dip_none">  <textarea placeholder="Введите текст"></textarea><br> </div>
   <label><input type="checkbox" id="41">назва виставки</label><br> <div id="46" class="dip_none">  <textarea placeholder="Введите текст"></textarea><br> </div>
   <label><input type="checkbox" id="42">назва експонату</label><br> <div id="47" class="dip_none">  <textarea placeholder="Введите текст"></textarea><br> </div>
   
   
                                </div>

                      
                            </ul>

                          <li><h3><label><input type="checkbox" id="5">Гранти/Проекти/Дослідження </label><br></h3> 
                            <ul>
 <div id="5b" style="display:none">
                                                     
                                                             
   <label><input type="checkbox" id="5r"> --------</label><br> <div id="55" class="dip_none">  <textarea placeholder="Введите текст"></textarea><br> </div>
   <label><input type="checkbox" id="51">-------- </label><br> <div id="56" class="dip_none">  <textarea placeholder="Введите текст"></textarea><br> </div>
   <label><input type="checkbox" id="52"> --------</label><br> <div id="57" class="dip_none">  <textarea placeholder="Введите текст"></textarea><br> </div>
   <label><input type="checkbox" id="53"> --------</label><br> <div id="58" class="dip_none">  <textarea placeholder="Введите текст"></textarea><br> </div>
   <label><input type="checkbox"id="54"> ----------------</label><br> <div id="59" class="dip_none">  <textarea placeholder="Введите текст"></textarea><br> </div>
   
                                </div>
                       
                            </ul>
                                    <li><h3><label><input type="checkbox" id="6">Авторське свідоцтва/патенти </label><br></h3> 
                            <ul>
 <div id="6b" style="display:none">
                                                    
                                                             
   <label><input type="checkbox" id="6r"> --------</label><br> <div id="65" class="dip_none">  <textarea placeholder="Введите текст"></textarea><br> </div>
   <label><input type="checkbox" id="61">-------- </label><br> <div id="66" class="dip_none">  <textarea placeholder="Введите текст"></textarea><br> </div>
   <label><input type="checkbox" id="62"> --------</label><br> <div id="67" class="dip_none">  <textarea placeholder="Введите текст"></textarea><br> </div>
   <label><input type="checkbox" id="63"> --------</label><br> <div id="68" class="dip_none">  <textarea placeholder="Введите текст"></textarea><br> </div>
   <label><input type="checkbox"id="64"> ----------------</label><br> <div id="29" class="dip_none">  <textarea placeholder="Введите текст"></textarea><br> </div>
  
                                </div>
                       
                            </ul>
                                                    <li><h3><label><input type="checkbox" id="7">Експертизи/відгуки/рецензування </label><br></h3> 
                            <ul>

                        <div id="7b" style="display:none">
                                             
                                                             
   <label><input type="checkbox" id="7r"> --------</label><br> <div id="75" class="dip_none">  <textarea placeholder="Введите текст"></textarea><br> </div>
   <label><input type="checkbox" id="71">-------- </label><br> <div id="76" class="dip_none">  <textarea placeholder="Введите текст"></textarea><br> </div>
   <label><input type="checkbox" id="72"> --------</label><br> <div id="77" class="dip_none">  <textarea placeholder="Введите текст"></textarea><br> </div>
   <label><input type="checkbox" id="73"> --------</label><br> <div id="78" class="dip_none">  <textarea placeholder="Введите текст"></textarea><br> </div>
   <label><input type="checkbox"id="74"> ----------------</label><br> <div id="79" class="dip_none">  <textarea placeholder="Введите текст"></textarea><br> </div>
                  </div>
                       
                            </ul>


                </ul>



         <script>
             $('#1').click(function () { $('#1b').toggle(); });

                   $('#1r').click(function () { $('#15').toggle(); });

                       $('#15r').click(function () { $('#155').toggle(); });
                       $('#151').click(function () { $('#156').toggle(); });
                       $('#152').click(function () { $('#157').toggle(); });
                       $('#153').click(function () { $('#158').toggle(); });
                       $('#154').click(function () { $('#159').toggle(); });



             $('#11').click(function () { $('#16').toggle(); });
             $('#12').click(function () { $('#17').toggle(); });
             $('#13').click(function () { $('#18').toggle(); });
             $('#14').click(function () { $('#19').toggle(); });


                                 $('#2').click(function () { $('#2b').toggle(); });

                                 $('#2r').click(function () { $('#25').toggle(); });
                                 $('#21').click(function () { $('#26').toggle(); });
                                 $('#22').click(function () { $('#27').toggle(); });
                                 $('#23').click(function () { $('#28').toggle(); });
                                 $('#24').click(function () { $('#29').toggle(); });
                               
                                 $('#3').click(function () { $('#3b').toggle(); });

                                 $('#3r').click(function () { $('#35').toggle(); });
                                 $('#31').click(function () { $('#36').toggle(); });
                                 $('#32').click(function () { $('#37').toggle(); });
                                

                                 $('#4').click(function () { $('#4b').toggle(); });

                                 $('#4r').click(function () { $('#45').toggle(); });
                                 $('#41').click(function () { $('#46').toggle(); });
                                 $('#42').click(function () { $('#47').toggle(); });
                               

                                 $('#5').click(function () { $('#5b').toggle(); });

                                 $('#5r').click(function () { $('#55').toggle(); });
                                 $('#51').click(function () { $('#16').toggle(); });
                                 $('#52').click(function () { $('#57').toggle(); });
                                 $('#53').click(function () { $('#58').toggle(); });
                                 $('#54').click(function () { $('#59').toggle(); });

                                 $('#6').click(function () { $('#6b').toggle(); });

                                 $('#6r').click(function () { $('#65').toggle(); });
                                 $('#61').click(function () { $('#66').toggle(); });
                                 $('#62').click(function () { $('#67').toggle(); });
                                 $('#63').click(function () { $('#68').toggle(); });
                                 $('#64').click(function () { $('#69').toggle(); });

                                 $('#7').click(function () { $('#7b').toggle(); });

                                 $('#7r').click(function () { $('#75').toggle(); });
                                 $('#71').click(function () { $('#76').toggle(); });
                                 $('#72').click(function () { $('#77').toggle(); });
                                 $('#73').click(function () { $('#78').toggle(); });
                                 $('#74').click(function () { $('#79').toggle(); });
             </script>


<%--            <li>Видання
                            <ul>
                                 <pre>
                        <li>монографії</li>
                        <li>підручники</li>
                        <li>словники</li>
                        <li>довідники</li>
                        <li>стандарти</li> 
                        <li>електронні наукові видання</li>
                        </pre>
                            </ul>
                                        <select name="name_spiska" >
       <option value="0">  </option>
       <option value="1"> </option>
       <option value="2">  </option>
       <option value="3">  </option>
       <option value="4"> </option>
       <option value="5">  </option>
       <option value="6"> </option>
 </select>--%>

      <%-- <iframe class="page-frame col-md-12" src="http://itp.inner.kbis.com.ua/index.php/site/viewgeneraltable"></iframe>--%>
                   </div>
    
      </div>



                <div class="tab-pane"  id="tab2" style ="height: 200px">


                    грпекаукпкпккак
                </div>
        
        </div>
             </div>
</asp:Content>

