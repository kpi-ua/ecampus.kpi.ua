<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="AddRtDiscipline.aspx.cs" Inherits="WebApplication1.AddRtDiscipline" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title></title>
    
    <link rel="Stylesheet" href="CSS/style.css" type="text/css"/>
    <link rel="stylesheet" href="CSS/Menu.css" type="text/css"/>

    <style type="text/css">
        .auto-style1 {
            width: 191px;
        }
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
            
            <br/>
            
            <div class="conteiner">
                <asp:Label CssClass="text" runat="server" ID="head1">Створення навчальної дисципліни нормативної складової ОПП</asp:Label>
                
                <table class="logintable">
                    <tr>
                        <td colspan="3">Нова нормативна навчальна дисципліна</td>
                    </tr>
                    <tr>
                        <td>
                            <asp:Label runat="server" ID="Label3">Дисципліна: </asp:Label>
                        </td>
                        <td colspan="2">
                            <asp:TextBox CssClass="addDisctext" runat="server" ID="NormativeDisc" Width="300px"></asp:TextBox>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <asp:Label runat="server" ID="Komponents">Компоненти: </asp:Label>
                        </td>
                        <td colspan="2">
                            <asp:DropDownList runat="server" ID="KomponentsDropList" Width="300px"/>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <asp:Label runat="server" ID="Label4">Цикли: </asp:Label>
                        </td>
                        <td colspan="2">
                            <asp:DropDownList runat="server" ID="CyclesDropList" Width="300px"></asp:DropDownList>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <asp:Label runat="server" ID="Label5">Шифр дисципліни: </asp:Label>
                        </td>
                        <td colspan="2">
                            <asp:TextBox runat="server" id="ShifrDisc" Width="300px"></asp:TextBox>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <asp:Label runat="server" ID="Label6">Кількість годин: </asp:Label>
                        </td>
                        <td colspan="2">
                            <asp:TextBox runat="server" id="HoursCount" Width="300px"></asp:TextBox>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <asp:Label runat="server" ID="Label7">Національні кредити:</asp:Label>
                        </td>
                        <td colspan="2">
                            <asp:TextBox runat="server" id="NationCred" Width="300px"></asp:TextBox>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <asp:Label runat="server" ID="Label8">Кредити ECTS: </asp:Label>
                        </td>
                        <td colspan="2">
                            <asp:TextBox runat="server" id="CreditECTS" Width="300px"></asp:TextBox>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <asp:Label runat="server" ID="Label9">Позакредитні: </asp:Label>
                        </td>
                        <td colspan="2">
                            <asp:TextBox runat="server" id="OurCredit" Width="300px"></asp:TextBox>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <asp:Label runat="server" ID="Label10">Статус: </asp:Label>
                        </td>
                        <td colspan="2">
                            <asp:DropDownList runat="server" ID="StatusDropList" Width="300px"/>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <asp:Label runat="server" ID="Label13">Дата зміни статусу: </asp:Label>
                        </td>
                        <td colspan="2">
                            <asp:Label runat="server" ID="actualityDate"></asp:Label>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <asp:Label runat="server" ID="Label12">Актуальність: </asp:Label>
                        </td>
                        <td colspan="2">
                            <asp:DropDownList runat="server" ID="ActivityDownList" Width="300px"/>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <asp:Label runat="server" ID="Label14">Дата зміни актуальності: </asp:Label>
                        </td>
                        <td colspan="2">
                            <asp:Label runat="server" ID="StatusDate"></asp:Label>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <asp:Label runat="server" ID="Label15">Публікатор: </asp:Label>
                        </td>
                        <td colspan="2">
                            <asp:Label runat="server" ID="Publish"></asp:Label>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                           <asp:Button CssClass="AddBtn" runat="server" ID="ClearDisc" Text="Очистити" OnClick="ClearDisc_Click"></asp:Button>
                           <span> </span>
                           <asp:Button CssClass="AddBtn" runat="server" ID="CancelDisc" Text="Скасувати" OnClick="CancelDisc_Click"></asp:Button>
                        </td>
                        <td>
                            <asp:Button CssClass="AddBtn" runat="server" ID="SaveDisc_btn" Text="Зберегти" OnClick="SaveDisc_btn_Click"></asp:Button>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="3">
                            <center>
                                <a href="#top">Вгору</a>
                            </center>
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
