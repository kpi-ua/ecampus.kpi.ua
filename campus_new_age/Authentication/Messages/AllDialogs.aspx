<%@ Page Title="" Language="C#" MasterPageFile="~/SitePlusNav.Master" AutoEventWireup="true" CodeBehind="AllDialogs.aspx.cs" Inherits="campus_new_age.Authentication.AllDialogs" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <title>Повідомлення</title>
    <link href="../../Content/AllDialogs.css" rel="stylesheet" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">
    <asp:Literal ID="Result" runat="server"></asp:Literal>
    <asp:Panel ID="LinkContainer" runat="server">
        
    </asp:Panel>
    
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="right_column" runat="server">
</asp:Content>
