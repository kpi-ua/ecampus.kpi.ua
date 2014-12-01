<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Login.aspx.cs" Inherits="WebApplication1.Login" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>КБ ІС Адміністрування</title>
    <link rel="Stylesheet" href="CSS/style.css" type="text/css"/>
</head>
<body>
    <form id="form1" runat="server">
    <div>
        <div class="header">
            <div class="caption">
                <img class="emblem" src="Images/-КПИ.png" alt="Герб НТУУ КПІ"/>
                <h1 align="center">Конструкторське Бюро Інформаційних Систем НТУУ "КПІ"</h1>
                <h2 align="center">Адміністрування системи КБ ІС</h2>
            </div>    
        </div>
        <center>
            <div class="login">
               <table class="logintable">
				 <tr>
				   <td> <asp:Label ID="Login_lbl" runat="server" Text="Логін: "></asp:Label> </td>
				   <td> <asp:TextBox runat="server" ID="Login_tb" Width="200px"></asp:TextBox> </td>
				 </tr>
				 <tr>
				   <td><asp:Label ID="Pass_lbl" runat="server" Text="Пароль: "></asp:Label></td>
				   <td> <asp:TextBox runat="server" ID="Pass_tb" Width="200px"></asp:TextBox> </td>
				 </tr>
                   <tr>
                       <td colspan="2" align="center">
                           <asp:Label runat="server" ID="ErrorMess_lbl" ForeColor="Red"></asp:Label>
                       </td>                       
                   </tr>
			   </table>

                <center>
                    <asp:Button runat="server" ID="logIn_btn" Text="Вхід" CssClass="loginBtn" OnClick="logIn_btn_Click" />
                </center>
        </div>
        </center>        
    </div>
    </form>
</body>
</html>
