<%@ Page Title="" Language="C#" MasterPageFile="~/Modules/EIR/Menu.master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="Site.Modules.EIR.Default" %>
<asp:Content ID="Content3" ContentPlaceHolderID="breadcrumbs_new" runat="server">
    <li class="active">Пошук</li>     
</asp:Content>
<asp:Content ID="Content1" ContentPlaceHolderID="newhead" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="newbody" runat="server">
    <script>
        $("#search_tab").addClass("active");
    </script>
 <!--   <h3> Пошук ЕІР</h3> -->
    <div class="eirsearch">
      <h4>&nbsp Способи пошуку</h4>
      <!--  <div style="font-weight:bold">&nbsp&nbsp&nbsp&nbsp Способи пошуку</div> -->
        <div style="font-weight:bold">&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp за метаданними</div>
         <div class="names">
           <ul>
            <li><label for="nam">Назва ЕІР</label></li>
            <li><label for="avt">Автор</label></li> 
            <li><label for="vns">Тип внеску</label></li> 
            <li><label for="vid">Вид ЕІР</label></li> 
            <li><label>Дата</label></li> 
           </ul> 
            <div style="font-weight:bold">&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp за дисципліною</div>
             <ul>
              <li><label for="dsc">Дисципліни</label></li>
             </ul>   
            <div style="font-weight:bold">&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp за кредитним модулем</div>
             <ul>
              <li><label for="crd">Кредитні модулі</label></li>
             </ul>    
         </div>
         <div class="fields">
            <ul>
             <li><input name="eirname" type="text" id="nam"></li>
             <li><input name="eirauthor" type="text" id="avt" ></li>
             <li><select name="eirauthorcontrib" id="vns" style="margin-top:6px;">
                       <option>Автор</option>
                       <option>Співавтор</option>
                 </select>
             </li>
             <li><select name="eirview" id="vid">
                       <option>Конспект</option>
                       <option>Підручник</option>
                       <option>Посібник</option>
                 </select>
             </li>
             <li><label for="year">Рік</label>
                 <select name="daty" id="year" style="height:32px; width:70px; margin-left:10px;">
                       <option>2014</option>
                       <option>2013</option>
                 </select>
                 <label for="month" style="margin-left:32px;">Місяць</label>
                 <select name="datm" id="month" style="height:32px; width:50px; margin-left:10px;">
                       <option>01</option>
                       <option>02</option>
                       <option>03</option>
                       <option>04</option>
                 </select>
                 <label for="number" style="margin-left:32px;">Число</label>
                 <select name="datn" id="number" style="height:32px; width:50px; margin-left:10px;">
                       <option>01</option>
                       <option>02</option>
                       <option>03</option>
                       <option>04</option>
                 </select>   
             </li>   
            </ul>
            <ul>
              <li><input name="disciplines" type="text" id="dsc" style="margin-top:18px;"></li>
            </ul> 
            <ul>
              <li><input name="credmod" type="text" id="crd" style="margin-top:38px;"></li>
              <li><input class="btn btn-default" type="button" id="clearr" value="Очистити" style="width:89px; margin-top:41px; margin-left:225px; background-color:#f0a433;"></li>
              <li><input class="btn btn-default" type="button" id="searchh" value="Пошук" style="width:71px; margin-top:3px; margin-left:328px; background-color:#f0a433;"></li>
            </ul>   
         </div>
         <div class="down">div3</div>
     </div>
</asp:Content>
