<%@ Page Title="" Language="C#" MasterPageFile="~/SitePlusNav.Master" AutoEventWireup="true" CodeBehind="Messages.aspx.cs" Inherits="Site.Authentication.Messages" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <title>Діалог</title>
    <link href="../../Content/Messages.css" rel="stylesheet" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">
    <asp:Panel ID="DialogContainer" runat="server"></asp:Panel>
    <asp:TextBox ID="AnswerText" runat="server" Columns="30" CssClass="form-control input-sm" TextMode="MultiLine" Rows="3"></asp:TextBox>
    <asp:Button ID="AnswerBtn" runat="server" Text="Відіслати" CssClass=" btn btn-primary"  OnClick="AnswerBtn_Click"/>
    
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="right_column" runat="server">
</asp:Content>