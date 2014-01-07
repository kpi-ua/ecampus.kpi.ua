<%@ Page Title="" Language="C#" MasterPageFile="~/SitePlusNav.Master" AutoEventWireup="true" CodeBehind="Messages.aspx.cs" Inherits="Site.Authentication.Messages" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <title>Повідомлення</title>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">
    <asp:Literal ID="Result" runat="server"></asp:Literal>
    <asp:Panel ID="LinkContainer" runat="server">
        
    </asp:Panel>
    
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="right_column" runat="server">
</asp:Content>
