<%@ Page Title="" Language="C#" MasterPageFile="~/SitePlusNav.Master" AutoEventWireup="true" CodeBehind="Messages.aspx.cs" Inherits="campus_new_age.Authentication.Messages.Messages" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <title>Діалог</title>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">
    <asp:Panel ID="DialogContainer" runat="server">

    </asp:Panel>
    <asp:TextBox ID="AnswerText" runat="server"></asp:TextBox>
    <asp:Button ID="AnswerBtn" runat="server" Text="Відіслати" CssClass="btn-primary"  OnClick="AnswerBtn_Click"/>
    <asp:Button ID="Button1" runat="server" Text="Оновити" CssClass="btn-warning"  OnClick="AnswerBtn_Click"/>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="right_column" runat="server">
</asp:Content>
