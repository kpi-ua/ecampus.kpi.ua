<%@ Page Title="Підсистеми" Language="C#" AutoEventWireup="true" MasterPageFile="~/Site.Master" CodeBehind="Default.aspx.cs" Inherits="Site.Modules.SubSystems.Default" %>



<asp:Content ID="breadcrumbs_content" ContentPlaceHolderID="breadcrumbs" runat="server">
    <li><a href="/Default.aspx">Домашня</a></li>
    <li class="active">Вибір підсистеми</li>
</asp:Content>

<asp:Content ID="body_content" ContentPlaceHolderID="body" runat="server">
    <center>
        <asp:Panel ID="MySubsystemsContainer" runat="server">
    </asp:Panel>
    </center>
    

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