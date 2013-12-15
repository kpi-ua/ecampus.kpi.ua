<%@ Page Title="" Language="C#" MasterPageFile="~/Inner.master" AutoEventWireup="true" CodeBehind="TimeTableMain.aspx.cs" Inherits="WebApplication.TimeTable.TimeTableMain" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">
    <div class="navbar navbar-default" style="position: relative;" role="navigation">
         <div class="navbar-header">
            <p class="navbar-text" >Розклад</p>
        </div>
        <label style="width: 10px" class="navbar-right"></label>
            <asp:Label ID="edit_button" Visible="true" runat="server">
                    <a href="../TimeTable/TimeTableMain.aspx?edit=true" class="navbar-text navbar-right navbar-link glyphicon glyphicon-pencil"></a>
            </asp:Label>
    </div>
    <div class="panel panel-default">
      <div class="panel-heading">
          <asp:Label ID="TBName" runat="server" Text="TableName"></asp:Label>
          <label style="width: 40%"></label>
            <asp:Button ID="week1" CssClass="btn btn-default" runat="server" Text="I тиждень"/>
            <asp:Button ID="week2" CssClass="btn btn-default" runat="server" Text="II тиждень"/>
      </div>
        <style type="text/css">
            tr.grey { background-color: #F5F5F5; }
            table.fon { background-color: #FFFFFF; }
        </style>
        <asp:Panel ID="tableread" runat="server">
      <table class="table table-bordered fon" style="text-align: center">
        <tr>
            <td style="width: 5%">Дні</td>
            <td style="width: 40%">Предмет</td>
            <td style="width: 10%">Години</td>
            <td style="width: 40%">Предмет</td>
            <td style="width: 5%">Дні</td>
        </tr>
        <tr>
            <td rowspan="7"><img src="../Images/Monday.PNG" class="img-rounded"></td>
            <td><asp:Label ID="mon1" runat="server"></asp:Label></td>
            <td>8<sup>30</sup>-10<sup>05</sup></td>
            <td><asp:Label ID="thur1" runat="server"></asp:Label></td>
            <td rowspan="7"><img src="../Images/Thursday.PNG" class="img-rounded" /></td>
        </tr>
          <tr>
             <td><asp:Label ID="mon2" runat="server"></asp:Label></td>
            <td>10<sup>25</sup>-12<sup>00</sup></td>
            <td><asp:Label ID="thur2" runat="server"></asp:Label></td> 
          </tr>
          <tr>
             <td><asp:Label ID="mon3" runat="server"></asp:Label></td>
            <td>12<sup>20</sup>-13<sup>55</sup></td>
            <td><asp:Label ID="thur3" runat="server"></asp:Label></td> 
          </tr>
          <tr>
             <td><asp:Label ID="mon4" runat="server"></asp:Label></td>
            <td>14<sup>15</sup>-15<sup>50</sup></td>
            <td><asp:Label ID="thur4" runat="server"></asp:Label></td> 
          </tr>
          <tr>
             <td><asp:Label ID="mon5" runat="server"></asp:Label></td>
            <td>16<sup>10</sup>-17<sup>45</sup></td>
            <td><asp:Label ID="thur5" runat="server"></asp:Label></td> 
          </tr>
          <tr>
             <td><asp:Label ID="mon6" runat="server"></asp:Label></td>
            <td>18<sup>30</sup>-20<sup>05</sup></td>
            <td><asp:Label ID="thur6" runat="server"></asp:Label></td> 
          </tr>
          <tr>
             <td><asp:Label ID="mon7" runat="server"></asp:Label></td>
            <td>20<sup>20</sup>-21<sup>55</sup></td>
            <td><asp:Label ID="thur7" runat="server"></asp:Label></td> 
          </tr>
          <tr class="grey">
            <td rowspan="7"><img src="../Images/Tuesday.PNG" class="img-rounded"></td>
            <td><asp:Label ID="tue1" runat="server"></asp:Label></td>
            <td>8<sup>30</sup>-10<sup>05</sup></td>
            <td><asp:Label ID="fri1" runat="server"></asp:Label></td>
            <td rowspan="7"><img src="../Images/Friday.PNG" class="img-rounded" /></td>
        </tr>
          <tr class="grey">
             <td><asp:Label ID="tue2" runat="server"></asp:Label></td>
            <td>10<sup>25</sup>-12<sup>00</sup></td>
            <td><asp:Label ID="fri2" runat="server"></asp:Label></td> 
          </tr>
          <tr class="grey">
             <td><asp:Label ID="tue3" runat="server"></asp:Label></td>
            <td>12<sup>20</sup>-13<sup>55</sup></td>
            <td><asp:Label ID="fri3" runat="server"></asp:Label></td> 
          </tr>
          <tr class="grey">
             <td><asp:Label ID="tue4" runat="server"></asp:Label></td>
            <td>14<sup>15</sup>-15<sup>50</sup></td>
            <td><asp:Label ID="fri4" runat="server"></asp:Label></td> 
          </tr>
          <tr class="grey">
             <td><asp:Label ID="tue5" runat="server"></asp:Label></td>
            <td>16<sup>10</sup>-17<sup>45</sup></td>
            <td><asp:Label ID="fri5" runat="server"></asp:Label></td> 
          </tr>
          <tr class="grey">
             <td><asp:Label ID="tue6" runat="server"></asp:Label></td>
            <td>18<sup>30</sup>-20<sup>05</sup></td>
            <td><asp:Label ID="fri6" runat="server"></asp:Label></td> 
          </tr>
          <tr class="grey">
             <td><asp:Label ID="tue7" runat="server"></asp:Label></td>
            <td>20<sup>20</sup>-21<sup>55</sup></td>
            <td><asp:Label ID="fri7" runat="server"></asp:Label></td> 
          </tr>
          <tr>
            <td rowspan="7"><img src="../Images/Wednesday.PNG" class="img-rounded"></td>
            <td><asp:Label ID="wed1" runat="server"></asp:Label></td>
            <td>8<sup>30</sup>-10<sup>05</sup></td>
            <td><asp:Label ID="sat1" runat="server"></asp:Label></td>
            <td rowspan="7"><img src="../Images/Saturday.PNG" class="img-rounded" /></td>
        </tr>
          <tr>
             <td><asp:Label ID="wed2" runat="server"></asp:Label></td>
            <td>10<sup>25</sup>-12<sup>00</sup></td>
            <td><asp:Label ID="sat2" runat="server"></asp:Label></td> 
          </tr>
          <tr>
             <td><asp:Label ID="wed3" runat="server"></asp:Label></td>
            <td>12<sup>20</sup>-13<sup>55</sup></td>
            <td><asp:Label ID="sat3" runat="server"></asp:Label></td> 
          </tr>
          <tr>
             <td><asp:Label ID="wed4" runat="server"></asp:Label></td>
            <td>14<sup>15</sup>-15<sup>50</sup></td>
            <td><asp:Label ID="sat4" runat="server"></asp:Label></td> 
          </tr>
          <tr>
             <td><asp:Label ID="wed5" runat="server"></asp:Label></td>
            <td>16<sup>10</sup>-17<sup>45</sup></td>
            <td><asp:Label ID="sat5" runat="server"></asp:Label></td> 
          </tr>
          <tr>
             <td><asp:Label ID="wed6" runat="server"></asp:Label></td>
            <td>18<sup>30</sup>-20<sup>05</sup></td>
            <td><asp:Label ID="sat6" runat="server"></asp:Label></td> 
          </tr>
          <tr>
             <td><asp:Label ID="wed7" runat="server"></asp:Label></td>
            <td>20<sup>20</sup>-21<sup>55</sup></td>
            <td><asp:Label ID="sat7" runat="server"></asp:Label></td> 
          </tr>
        </table>
        </asp:Panel>
        <asp:Panel ID="tableedit" runat="server">
            <asp:DataList ID="dataList" runat="server"></asp:DataList>
        <table class="table table-bordered fon" style="text-align: center">
        <tr>
            <td style="width: 5%">Дні</td>
            <td style="width: 40%">Предмет</td>
            <td style="width: 10%">Години</td>
            <td style="width: 40%">Предмет</td>
            <td style="width: 5%">Дні</td>
        </tr>
        <tr>
            <td rowspan="7"><img src="../Images/Monday.PNG" class="img-rounded"></td>
            <td><asp:DropDownList ID="emon1" runat="server"/></td>
            <td>8<sup>30</sup>-10<sup>05</sup></td>
            <td><asp:DropDownList ID="ethur1" runat="server"/></td>
            <td rowspan="7"><img src="../Images/Thursday.PNG" class="img-rounded" /></td>
        </tr>
          <tr>
             <td><asp:Label ID="Label3" runat="server"></asp:Label></td>
            <td>10<sup>25</sup>-12<sup>00</sup></td>
            <td><asp:Label ID="Label4" runat="server"></asp:Label></td> 
          </tr>
          <tr>
             <td><asp:Label ID="Label5" runat="server"></asp:Label></td>
            <td>12<sup>20</sup>-13<sup>55</sup></td>
            <td><asp:Label ID="Label6" runat="server"></asp:Label></td> 
          </tr>
          <tr>
             <td><asp:Label ID="Label7" runat="server"></asp:Label></td>
            <td>14<sup>15</sup>-15<sup>50</sup></td>
            <td><asp:Label ID="Label8" runat="server"></asp:Label></td> 
          </tr>
          <tr>
             <td><asp:Label ID="Label9" runat="server"></asp:Label></td>
            <td>16<sup>10</sup>-17<sup>45</sup></td>
            <td><asp:Label ID="Label10" runat="server"></asp:Label></td> 
          </tr>
          <tr>
             <td><asp:Label ID="Label11" runat="server"></asp:Label></td>
            <td>18<sup>30</sup>-20<sup>05</sup></td>
            <td><asp:Label ID="Label12" runat="server"></asp:Label></td> 
          </tr>
          <tr>
             <td><asp:Label ID="Label13" runat="server"></asp:Label></td>
            <td>20<sup>20</sup>-21<sup>55</sup></td>
            <td><asp:Label ID="Label14" runat="server"></asp:Label></td> 
          </tr>
          <tr class="grey">
            <td rowspan="7"><img src="../Images/Tuesday.PNG" class="img-rounded"></td>
            <td><asp:Label ID="Label15" runat="server"></asp:Label></td>
            <td>8<sup>30</sup>-10<sup>05</sup></td>
            <td><asp:Label ID="Label16" runat="server"></asp:Label></td>
            <td rowspan="7"><img src="../Images/Friday.PNG" class="img-rounded" /></td>
        </tr>
          <tr class="grey">
             <td><asp:Label ID="Label17" runat="server"></asp:Label></td>
            <td>10<sup>25</sup>-12<sup>00</sup></td>
            <td><asp:Label ID="Label18" runat="server"></asp:Label></td> 
          </tr>
          <tr class="grey">
             <td><asp:Label ID="Label19" runat="server"></asp:Label></td>
            <td>12<sup>20</sup>-13<sup>55</sup></td>
            <td><asp:Label ID="Label20" runat="server"></asp:Label></td> 
          </tr>
          <tr class="grey">
             <td><asp:Label ID="Label21" runat="server"></asp:Label></td>
            <td>14<sup>15</sup>-15<sup>50</sup></td>
            <td><asp:Label ID="Label22" runat="server"></asp:Label></td> 
          </tr>
          <tr class="grey">
             <td><asp:Label ID="Label23" runat="server"></asp:Label></td>
            <td>16<sup>10</sup>-17<sup>45</sup></td>
            <td><asp:Label ID="Label24" runat="server"></asp:Label></td> 
          </tr>
          <tr class="grey">
             <td><asp:Label ID="Label25" runat="server"></asp:Label></td>
            <td>18<sup>30</sup>-20<sup>05</sup></td>
            <td><asp:Label ID="Label26" runat="server"></asp:Label></td> 
          </tr>
          <tr class="grey">
             <td><asp:Label ID="Label27" runat="server"></asp:Label></td>
            <td>20<sup>20</sup>-21<sup>55</sup></td>
            <td><asp:Label ID="Label28" runat="server"></asp:Label></td> 
          </tr>
          <tr>
            <td rowspan="7"><img src="../Images/Wednesday.PNG" class="img-rounded"></td>
            <td><asp:Label ID="Label29" runat="server"></asp:Label></td>
            <td>8<sup>30</sup>-10<sup>05</sup></td>
            <td><asp:Label ID="Label30" runat="server"></asp:Label></td>
            <td rowspan="7"><img src="../Images/Saturday.PNG" class="img-rounded" /></td>
        </tr>
          <tr>
             <td><asp:Label ID="Label31" runat="server"></asp:Label></td>
            <td>10<sup>25</sup>-12<sup>00</sup></td>
            <td><asp:Label ID="Label32" runat="server"></asp:Label></td> 
          </tr>
          <tr>
             <td><asp:Label ID="Label33" runat="server"></asp:Label></td>
            <td>12<sup>20</sup>-13<sup>55</sup></td>
            <td><asp:Label ID="Label34" runat="server"></asp:Label></td> 
          </tr>
          <tr>
             <td><asp:Label ID="Label35" runat="server"></asp:Label></td>
            <td>14<sup>15</sup>-15<sup>50</sup></td>
            <td><asp:Label ID="Label36" runat="server"></asp:Label></td> 
          </tr>
          <tr>
             <td><asp:Label ID="Label37" runat="server"></asp:Label></td>
            <td>16<sup>10</sup>-17<sup>45</sup></td>
            <td><asp:Label ID="Label38" runat="server"></asp:Label></td> 
          </tr>
          <tr>
             <td><asp:Label ID="Label39" runat="server"></asp:Label></td>
            <td>18<sup>30</sup>-20<sup>05</sup></td>
            <td><asp:Label ID="Label40" runat="server"></asp:Label></td> 
          </tr>
          <tr>
             <td><asp:Label ID="Label41" runat="server"></asp:Label></td>
            <td>20<sup>20</sup>-21<sup>55</sup></td>
            <td><asp:Label ID="Label42" runat="server"></asp:Label></td> 
          </tr>
        </table>
        </asp:Panel>
    </div>
    
</asp:Content>