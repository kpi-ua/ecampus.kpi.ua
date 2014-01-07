<%@ Page Title="" Language="C#" MasterPageFile="~/SitePlusNav.Master" AutoEventWireup="true" CodeBehind="NewMessage.aspx.cs" Inherits="campus_new_age.Authentication.Messages.NewMessage" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">
    <asp:Panel ID="MainDiv" runat="server">
        <asp:ListBox ID="UsersList" runat="server" CssClass=".chzn-select"></asp:ListBox>
    </asp:Panel>
</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="right_column" runat="server">
    <asp:Button ID="SendMessage" runat="server" Text="Надіслати повідомлення" CssClass="btn btn-warning" OnClick="SendMessage_Click" />
</asp:Content>
