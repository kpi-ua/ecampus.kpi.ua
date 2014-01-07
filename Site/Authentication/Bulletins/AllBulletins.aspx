<%@ Page Title="" Language="C#" MasterPageFile="~/SitePlusNav.Master" AutoEventWireup="true" CodeBehind="AllBulletins.aspx.cs" Inherits="Site.Authentication.Bulletins.AllBulletins" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <title>Всі оголошення</title>
    <link href="../../Content/Bulletins.css" rel="stylesheet" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">
    <asp:Panel ID="BulletinsContainer" runat="server"></asp:Panel>
    <script type="text/javascript">
        $(".showText").click(function () {
            if ($(this).parent().find("p").css("display") == "none") {
                $(this).parent().find("p").slideDown();
            } else { $(this).parent().find("p").slideUp(); }
        });
    </script>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="right_column" runat="server">
    <asp:Button ID="ModeratorMode" runat="server" Text="Режим Модератора" CssClass="btn btn-warning" OnClick="ModearatorMode_Click"/>
</asp:Content>
