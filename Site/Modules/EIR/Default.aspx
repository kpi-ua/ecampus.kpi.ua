<%@ Page Title="" Language="C#" MasterPageFile="~/Modules/EIR/Menu.master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="Site.Modules.EIR.Default" %>
<asp:Content ID="Content3" ContentPlaceHolderID="breadcrumbs_new" runat="server">
    <li class="active">Пошук</li>     
</asp:Content>
<asp:Content ID="Content1" ContentPlaceHolderID="newhead" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="newbody" runat="server">
    <script>
        $("#search_tab").addClass("active");
    </script>
    <h3> Пошук ЕІР</h3>
</asp:Content>
