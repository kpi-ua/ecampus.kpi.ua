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

     
                     >  <li><h3><label><input type="checkbox" id="1"> Видання</label><br></h3> 
                                             
                                                
       
                            <div id="1b" style="display:none">
                                                      <form >
                                                             
   <label><input type="checkbox" id="1r"> монографії</label><br> <form id="16" style="display:none","margin-left: 1000px;">  <textarea placeholder="Введите текст"></textarea><br> </form>
   <label><input type="checkbox" id="11"> підручники</label><br> <form id="16" style="display:none","margin-left: 1000px;">  <textarea placeholder="Введите текст"></textarea><br> </form>
   <label><input type="checkbox" id="12"> словники</label><br> <form id="17" style="display:none","margin-left: 1000px;">  <textarea placeholder="Введите текст"></textarea><br> </form>
   <label><input type="checkbox" id="13"> довідники</label><br> <form id="18" style="display:none","margin-left: 1000px;">  <textarea placeholder="Введите текст"></textarea><br> </form>
   <label><input type="checkbox"id="14"> електронні наукові видання</label><br> <form id="19" style="display:none","margin-left: 1000px;">  <textarea placeholder="Введите текст"></textarea><br> </form>
   </form>
                                </div>
                           
                             <script>
                                 //$('#1').on('click', function () { $('#6').css('display', ''); });монографії
                                 //$('#1').on('click', function () { $('#6').css('display', 'none'); });
                                 $('#1').click(function () { $('#1b').toggle(); });
                                 
                                 $('#1r').click(function () { $('#15').toggle(); });
                                 $('#11').click(function () { $('#16').toggle(); });
                                 $('#12').click(function () { $('#17').toggle(); });
                                 $('#13').click(function () { $('#18').toggle(); });
                                 $('#14').click(function () { $('#19').toggle(); });
                               
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

                              <li>Статті
                            <ul>

                        <li> </li>
                        <li> </li>
                        <li> </li>
                        <li> </li>
                        <li> </li> 
                        <li> </li>
                       
                            </ul>

                         <li>Конференції/семінари/симпозіуми
                            <ul>

                        <li>місце проведення</li>
                        <li>назва заходу</li>
                        <li>назва доповіді</li>
                  
                            </ul>

                               <li>Наукові виставки
                            <ul>

                        <li>місце проведення</li>
                        <li>назва виставки</li>
                        <li>назва експонату</li>
                      
                            </ul>

                          <li>Гранти/Проекти/Дослідження
                            <ul>

                        <li> </li>
                        <li> </li>
                        <li> </li>
                        <li> </li>
                        <li> </li> 
                        <li> </li>
                       
                            </ul>
                                    <li>Авторське свідоцтва/патенти
                            <ul>

                        <li> </li>
                        <li> </li>
                        <li> </li>
                        <li> </li>
                        <li> </li> 
                        <li> </li>
                       
                            </ul>
                                                    <li>Експертизи/відгуки/рецензування
                            <ul>

                        <li> </li>
                        <li> </li>
                        <li> </li>
                        <li> </li>
                        <li> </li> 
                        <li> </li>
                       
                            </ul>


                </ul>
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

