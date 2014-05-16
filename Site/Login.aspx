<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Login.aspx.cs" Inherits="Site.Login" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <link href="/Content/MasterStyle.css" rel="stylesheet" />
    <link href='http://fonts.googleapis.com/css?family=Open+Sans:400,300,700&subset=cyrillic,latin' rel='stylesheet' type='text/css'>
    <link href="/Content/bootstrap-theme.min.css" rel="stylesheet" />
    <link href="/Content/bootstrap.min.css" rel="stylesheet" />

    <script src="/Scripts/jquery-2.1.1.min.js"></script>
    <script src="/Scripts/jquery-ui-1.10.4.custom.js"></script>
    <script src="/Scripts/bootstrap.js"></script>
    <script src="/Scripts/bootstrap.min.js"></script>
    <script src="/Scripts/script.js"></script>
    
    <title>Authentication</title>
</head>
<body>
    <form id="form" class="wrap login-wrap" runat="server">
        <div class="header">
            <div class="logo-kpi pull-right">
            </div>
            <div class="text pull-right">
                НАЦІОНАЛЬНИЙ ТЕХНІЧНИЙ УНІВЕРСИТЕТ УКРАЇНИ
                <br>
                "КИЇВСЬКИЙ ПОЛІТЕХНІЧНИЙ ІНСТИТУТ"
            </div>
        </div>
        <div class="login-box">
            <div class="login-logo"></div>
            <div class="login-form">
                <div class="row">
                    <div class="col-lg-12">
                        <div class="form-group">
                            <label>Логін</label>
                            <%--<input runat="server" ID="User" type="text" class="form-control" placeholder="Логін"/>--%>
                            <asp:TextBox runat="server" ID="txUser" CssClass="form-control" ClientIDMode="Static" placeholder="Логін"></asp:TextBox>
                        </div>
                        <div class="form-group">
                            <label>Пароль</label>
                            <asp:TextBox runat="server" ID="txPass" TextMode="Password" CssClass="form-control" ClientIDMode="Static" placeholder="Пароль"></asp:TextBox>
                            <%--<input runat="server" ID="Pass" type="password" class="form-control" placeholder="Пароль"/>--%>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-12">
                        <div class="remeber-me pull-left">
                            <asp:CheckBox runat="server" ID="remember_me" ClientIDMode="Static"/>
                            <label for="remember_me">Запам’ятати мене</label>
                        </div>
                        <div class="forgot-pass pull-right">
                            <a href="#">Забули пароль?</a>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-12">
                        <div class="form-group text-center">
                            <asp:Button  runat="server" class="btn btn-success" Text="Вхід" OnClick="Enter_Click"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="footer">
            <div class="pull-left text-left">
                Національний технічний університет України
                <br>
                “Київський політехнічний інститут”   www.kpi.ua
                <br>
                Електронний кампус
            </div>
            <div class="pull-right text-right">
                Розробник:  Конструкторське бюро
                <br>
                інформаційних систем
                <br>
                www.kbis.kpi.ua
            </div>
        </div>

    </form>
</body>
</html>












