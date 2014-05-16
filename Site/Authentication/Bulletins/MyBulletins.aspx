<%@ Page Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="MyBulletins.aspx.cs" Inherits="Site.Authentication.Bulletins.MyBulletins" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <title>Мої оголошення</title>
    <link href="/Content/Bulletins.css" rel="stylesheet" />
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">
    <asp:Button ID="CreateNewBulletin" runat="server" Text="Створити оголошення" CssClass="btn btn-warning" />


    <asp:Panel ID="MyBulletinsContainer" runat="server">
    </asp:Panel>
    <script type="text/javascript">
        $(".showText").mouseover(function () { $(this).css("cursor", "pointer") });
        $(".showText").mouseout(function () { $(this).css("cursor", "default") });
        $(".showText").click(function () {
            if ($(this).parent().find(".set_des").css("display") == "none") {
                $(this).parent().find(".set_des").slideDown();
            } else { $(this).parent().find(".set_des").slideUp(); }
        });
    </script>
</asp:Content>

