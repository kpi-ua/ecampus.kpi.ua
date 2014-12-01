<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="SVO.aspx.cs" Inherits="WebApplication1.GSVO" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">.
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title></title>
    <script src="js/JavaScript1.js"></script>
    <link href="CSS/main.css" rel="stylesheet" />
    <link rel="Stylesheet" href="CSS/style.css" type="text/css"/>
    <%--<link rel="stylesheet" href="CSS/default.css" type="text/css"/>--%>

    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.4.3/jquery.min.js"></script>
   <%-- <script src="js/jquery.scrollToTop.min.js"></script>--%>

    <script type="text/javascript" src="js/vk_up_back.js"></script>
    <style>
       
</style>



      
          
</head>
<body>
   
   
    <form id="form1" runat="server">
    <div class="main">
        <div class="header">
            <div class="caption">
                <img class="emblem" src="Images/-КПИ.png" alt="Герб НТУУ КПІ"/>
                <h1 align="center">Конструкторське Бюро Інформаційних Систем НТУУ "КПІ"</h1>
                <h2 align="center">Адміністрування системи КБ ІС</h2>
            </div>    
        </div>
        
        <article >
        
        <div class="contentsvo">
            <asp:Label ID="Label1" runat="server">ОСВІТНЬО ПРОФЕСІЙНА ПРОГРАМА</asp:Label>
            <br />
            <asp:Label ID="Subdivision_lbl" runat="server"></asp:Label>
            <br />
            <asp:Label ID="OKR_lbl" runat="server"></asp:Label>
            <br />
            
            <%--<h3><font face="Verdana">Вывод данных с помощью DataGrid</font></h3>--%>
            
            <%--<ASP:DataGrid id="MyDataGrid" runat="server" BorderColor="black" BorderWidth="1" GridLines="Both" CellPadding="3" CellSpacing="0" Font-Name="Verdana" Font-Size="8pt" HeaderStyle-BackColor="#336600" HeaderStyle-ForeColor="#ffcc00" />--%>
      
            
           
    <div>
    <ul id="Tabs">
	<li id="TwoTab" class="Tab"><a href="#Two" onclick="Two(); return false;">Перелік варіативних дисциплін</a></li>
	<li id="OneTab" class="SelectedTab"><a href="#One" onclick="One(); return false;">Перелік нормативних дисциплін</a></li>
</ul>
 
<!-- Содержимое вкладок -->
<div id="Content">
	<!-- Первая -->
	<div id="One">
		<p></p>
        <asp:GridView ID="GridView1" runat="server" BorderColor="black" BorderWidth="1" GridLines="Both" CellPadding="3" CellSpacing="0" Font-Name="Verdana" Font-Size="8pt" HeaderStyle-BackColor="#336600" HeaderStyle-ForeColor="#ffcc00">
                <columns>
          <%--<asp:boundfield datafield="Name" headertext="Цикл"/>
          <asp:boundfield datafield="Name1" headertext="Компонент"/>
          <asp:boundfield datafield="Name2" headertext="Нормативна дисципліна"/>
          <asp:boundfield datafield="Shifr" headertext="Шифр"/>
          <asp:boundfield datafield="CountHour" headertext="Кіл-сть годин"/>
          <asp:boundfield datafield="CreditNational" headertext="Нац. кредити"/>--%>
        </columns>
            </asp:GridView>
	</div>
 
	<!-- Вторая -->
	<div id="Two" style="display: none;">
		<asp:GridView ID="GridView2" runat="server" BorderColor="black" BorderWidth="1" GridLines="Both" CellPadding="3" CellSpacing="0" Font-Name="Verdana" Font-Size="8pt" HeaderStyle-BackColor="#336600" HeaderStyle-ForeColor="#ffcc00">
               </asp:GridView>
	</div>
</div>
    </div>
   
        </div>
        </article>
            
    </div>

    <div>
        <asp:Label runat="server" ID="lbel1"></asp:Label>
        <br />
        <asp:Label runat="server" ID="lbl2"> </asp:Label>
    </div>
    </form>
</body>
