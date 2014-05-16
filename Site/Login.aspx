<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Login.aspx.cs" Inherits="Site.Login" %>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <link href="/Content/MasterStyle.css" rel="stylesheet" />
    <link href='http://fonts.googleapis.com/css?family=Open+Sans:400,300,700&subset=cyrillic,latin' rel='stylesheet' type='text/css' />
    <link href="/Content/bootstrap-theme.min.css" rel="stylesheet" />
    <link href="/Content/bootstrap.min.css" rel="stylesheet" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Авторизація</title>
</head>
<body>
    <div class="wrap login-wrap">
        <header>
            <div class="logo-kpi pull-right">
            </div>
            <div class="text pull-right">
                НАЦІОНАЛЬНИЙ ТЕХНІЧНИЙ УНІВЕРСИТЕТ УКРАЇНИ
                <br>
                "КИЇВСЬКИЙ ПОЛІТЕХНІЧНИЙ ІНСТИТУТ"
            </div>
        </header>
        <div class="login-box">
            <div class="login-logo"></div>

            <form runat="server" id="form" class="login-form">

                <asp:ScriptManager EnableCdn="true" ID="script_manager" runat="server">
                    <Scripts>
                        <asp:ScriptReference Path="~/Scripts/jquery-2.1.1.min.js" />
                        <asp:ScriptReference Path="~/Scripts/jquery-ui-1.10.4.custom.js" />
                        <asp:ScriptReference Path="~/Scripts/bootstrap.min.js" />
                        <asp:ScriptReference Path="~/Scripts/chosen.jquery.min.js" />
                        <asp:ScriptReference Path="~/Scripts/core.js" />
                        <asp:ScriptReference Path="~/Scripts/script.js" />
                    </Scripts>
                </asp:ScriptManager>

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
                            <asp:CheckBox runat="server" ID="remember_me" ClientIDMode="Static" />
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
                            <asp:Button runat="server" class="btn btn-success" Text="Вхід" OnClick="Enter_Click" />
                        </div>
                    </div>
                </div>
            </form>
        </div>
        <footer>
            <div class="container">
                <div class="text-left pull-left">
                    Національний технічний університет України
                    <br />
                    “Київський політехнічний інститут” <a href="http://kpi.ua">www.kpi.ua</a>
                    <br />
                    Електронний кампус
                </div>
                <div class="text-right pull-right">
                    Розробник:  Конструкторське бюро
                    <br />
                    інформаційних систем
                    <br />
                    <a href="http://kbis.kpi.ua">www.kbis.kpi.ua</a>
                </div>
            </div>
        </footer>
    </div>

    <!-- Yandex.Metrika counter -->
    <script type="text/javascript">(function (d, w, c) { (w[c] = w[c] || []).push(function () { try { w.yaCounter20363149 = new Ya.Metrika({ id: 20363149, webvisor: true, clickmap: true, trackLinks: true, accurateTrackBounce: true, trackHash: true, ut: "noindex" }); } catch (e) { } }); var n = d.getElementsByTagName("script")[0], s = d.createElement("script"), f = function () { n.parentNode.insertBefore(s, n); }; s.type = "text/javascript"; s.async = true; s.src = (d.location.protocol == "https:" ? "https:" : "http:") + "//mc.yandex.ru/metrika/watch.js"; if (w.opera == "[object Opera]") { d.addEventListener("DOMContentLoaded", f, false); } else { f(); } })(document, window, "yandex_metrika_callbacks");</script>
    <noscript><div><img src="//mc.yandex.ru/watch/20363149?ut=noindex" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
    <!-- /Yandex.Metrika counter -->

</body>
</html>
