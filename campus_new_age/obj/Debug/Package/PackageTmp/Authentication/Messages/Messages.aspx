<%@ Page Title="" Language="C#" MasterPageFile="~/SitePlusNav.Master" AutoEventWireup="true" CodeBehind="Messages.aspx.cs" Inherits="campus_new_age.Authentication.Messages.Messages" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <title>Діалог</title>
    <link href="../../Content/Messages.css" rel="stylesheet" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">
    <asp:Panel ID="DialogContainer" runat="server"></asp:Panel>
    <asp:TextBox ID="AnswerText" runat="server"></asp:TextBox>
    <asp:Button ID="AnswerBtn" runat="server" Text="Відіслати" CssClass=" btn btn-primary"  OnClick="AnswerBtn_Click"/>
    
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="right_column" runat="server">
    <asp:Button ID="Reload" runat="server" Text="Оновити"  CssClass=" btn btn-warning"  OnClick="AnswerBtn_Click"/>
</asp:Content>
