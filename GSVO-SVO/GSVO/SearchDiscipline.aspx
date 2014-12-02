<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="SearchDiscipline.aspx.cs" Inherits="WebApplication1.SearchDiscipline" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    
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
            <asp:Label ID="Label1" runat="server">ОСВІТНЬО-ПРОФЕСІЙНА ПРОГРАМА</asp:Label>
            <br />
            <asp:Label ID="cath" runat="server" />
            <br />
            <asp:Label ID="Okr_lbl" runat="server" />
            
            <asp:Label CssClass="text" runat="server" ID="head">Створення навчальної дисципліни нормативної складової ОПП</asp:Label>
            <br/>
            <div class="conteiner">
                <table class="logintable">
                    <tr>
                        <td colspan="3">Створення дисципліни в <i>довіднику</i></td>
                    </tr>
                    <tr>
                        <td>
                            <asp:Label runat="server" ID="Disc">Дисципліна: </asp:Label>
                        </td>
                        <td>
                            <asp:TextBox CssClass="addDisctext" runat="server" ID="discName" Width="300px"></asp:TextBox>
                        </td>
                        <td>
                            <asp:Button CssClass="AddBtn" Width="45px" runat="server" ID="Help_btn" Text=". . ." OnClick="Help_btn_Click"/>
                        </td>
                    </tr>
                    <tr >
                        <td colspan="2">
                            
                        </td>
                        
                        <td>
                            <asp:Button CssClass="AddBtn" runat="server" ID="Check" Text="Перевірити" OnClick="Check_Click"/>
                        </td>
                    </tr>
                    <tr >
                        <td colspan="3">
                            <center>
                                <span class="text">Результат пошуку</span><br/>
                                <asp:ListBox runat="server" Width="523px" Height="200px" ID="SearchResult"/>
                            </center>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                           <asp:Button CssClass="AddBtn" runat="server" ID="ClearAll" Text="Очистити" OnClick="ClearAll_Click"></asp:Button>
                           <span> </span>
                           <asp:Button CssClass="AddBtn" runat="server" ID="Cancel" Text="Скасувати" OnClick="Cancel_Click"></asp:Button>
                        </td>
                        <td>
                            <asp:Button CssClass="AddBtn" runat="server" ID="Save_btn" Text="Зберегти"></asp:Button>
                        </td>
                    </tr>
                </table>
                
            </div>
            
        </div>
        </article>
            
    </div>
    </form>
</body>
</html>
