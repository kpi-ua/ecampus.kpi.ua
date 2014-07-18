<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="GSVO.aspx.cs" Inherits="WebApplication1.GSVO" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title></title>
    
    <link rel="Stylesheet" href="CSS/style.css" type="text/css"/>
    <link rel="stylesheet" href="CSS/Menu.css" type="text/css"/>
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
            <div class="blockMenu">
                <ul class="menu">
                <li><a href="#">Конвертація</a>
                    <ul>
                        <li><a href="#">XML-файлу РНП</a></li>
                        <li><a href="#">Студентського контенту</a></li>
                        <li><a href="#">Навчальних груп (РНП + Деканат)</a></li>
                        <li><a href="#">Співробітників</a></li>                
                    </ul>
                </li>
                <li><a href="#">Генерація логінів і паролів</a>
                    <ul>
                        <li><a href="#">Для співробітників</a></li>
                        <li><a href="#">Для студентів</a></li>
                    </ul>
                </li>
                <li><a href="#">Ведення</a>
                    <ul>
                        <li><a href="SpecialityTree.aspx">Дисциплін ГСВО</a></li>
                        <li><a href="#">Дисциплін СВО</a></li>
                        <li><a href="#">Ліцензій</a></li>
                        <li><a href="#">Прав користувачів</a></li>
                        <li><a href="#">Відповідальних</a></li>
                        <li><a href="#">Доступу РНП</a></li>
                        <li><a href="#">Профілів</a></li>
                    </ul>
                </li>
        
                <li><a href="#">Довідники</a>
                    <ul>
                        <li><a href="#">Спеціальність / направлення підготовки</a></li>
                        <li><a href="#">Види ЕІР</a></li>
                    </ul>
                </li>
            </ul>
        </div>
        
        <div class="content">
            <asp:Label ID="Label1" runat="server">ОСВІТНЬО ПРОФЕСІЙНА ПРОГРАМА "ГСВО"</asp:Label>
            <br />
            <asp:Label ID="Subdivision_lbl" runat="server"></asp:Label>
            <br />
            <asp:Label ID="OKR_lbl" runat="server"></asp:Label>
            <br />
            
            <%--<h3><font face="Verdana">Вывод данных с помощью DataGrid</font></h3>--%>
            
            <ASP:DataGrid id="MyDataGrid" runat="server" BorderColor="black" BorderWidth="1" GridLines="Both" CellPadding="3" CellSpacing="0" Font-Name="Verdana" Font-Size="8pt" ShowHeader="False" HeaderStyle-BackColor="#336600" HeaderStyle-ForeColor="#ffcc00" />
        </div>
        </article>
            
    </div>
    </form>
</body>
