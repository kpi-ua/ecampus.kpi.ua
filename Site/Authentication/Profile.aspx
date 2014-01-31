<%@ Page Language="C#" MasterPageFile="~/SitePlusNav.Master" AutoEventWireup="true" CodeBehind="Profile.aspx.cs" Inherits="Site.Authentication.Success" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <title>Профіль</title>
    <link href="../Content/Profile.css" rel="stylesheet" />
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">
    <div style="max-width: 80%; /*background-color: cadetblue; */ float: left">
        <%--<h3 class="text-primary">Мій профіль</h3>--%>
        <div style="margin-left: 15px;">
            <h4 class="text-muted">Персональні дані</h4>
            <asp:Literal ID="PersData" runat="server"></asp:Literal>
            <h4 class="text-muted">Дані за місцем навчання (роботи)</h4>
            <asp:Literal ID="WorkData" runat="server"></asp:Literal>
            <h4 class="text-muted">Додаткові функції</h4>
            <asp:Literal ID="SpecFunc" runat="server"></asp:Literal>
        </div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="right_column" runat="server">
    <%--<div id="right-sidebar">--%>
    <asp:Image ID="Photo" runat="server" />
    <%--<img src="/Images/user_pic.png" />--%>
    <ul>
        <li><a href="#">
            <img src="/Images/foto.png" />завантажити фото</a></li>
        <li><a id="ShowCPForm">
            <img src="/Images/parol.png" />змінити пароль</a></li>

        <asp:Panel ID="ChangePass" runat="server">
            <div class="input-group">
                <asp:Label ID="OldPassLabel" runat="server" Text="Старий пароль" CssClass="label label-primary"></asp:Label>
                <asp:TextBox ID="OldPass" runat="server" TextMode="Password" CssClass="form-control input-sm"></asp:TextBox>
            </div>
            <div class="input-group">
                <asp:Label ID="NewPassLabel" runat="server" Text="Новий пароль" CssClass="label label-primary"></asp:Label>
                <asp:TextBox ID="NewPass" runat="server" TextMode="Password" CssClass="form-control input-sm"></asp:TextBox>
            </div>
            <div class="input-group">
                <asp:Label ID="NewPassCheakLabel" runat="server" Text="Повторіть новий пароль" CssClass="label label-primary"></asp:Label>
                <asp:TextBox ID="NewPassCheak" runat="server" TextMode="Password" CssClass="form-control input-sm"></asp:TextBox>
            </div>
            <asp:Button ID="SavePass" runat="server" Text="Зберегти" CssClass="btn btn-success btn-sm" OnClick="SavePass_Click" />
        </asp:Panel>
    </ul>

    <script type="text/javascript">
        $(window).load(function () {
            if ($("#right_column_ChangePassLabel").css("class") == "label label-danger") {
                $("#right_column_ChangePass").css("display", "inline");
            }
        });
        $("#ShowCPForm").click(function () {
            if ($("#right_column_ChangePass").css("display") == "none") {
                $("#right_column_ChangePass").slideDown();
            } else { $("#right_column_ChangePass").slideUp(); }
        });
    </script>
    <%--</div>--%>
    <!-- .right-sidebar -->
</asp:Content>

