<%@ Page Title="" Language="C#" MasterPageFile="~/SitePlusNav.Master" AutoEventWireup="true" CodeBehind="NewMessage.aspx.cs" Inherits="Site.Authentication.NewMessage" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link href="../../Content/NewMessage.css" rel="stylesheet" />
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">
    <asp:Panel ID="MainDiv" runat="server">
        <div ID="UserListControl" class="input-prepend input-xxlarge">
            <span ID="UserListControlName" class="input-group-addon text-info">Одержувачі:</span>
            <asp:ListBox ID="UserList" runat="server" CssClass="chzn-container chzn-container-multi"
                Height="20px" SelectionMode="Multiple">
            </asp:ListBox>
        </div>
    </asp:Panel>
</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="right_column" runat="server">
    <asp:Button ID="SendMessage" runat="server" Text="Надіслати повідомлення" CssClass="btn btn-warning" OnClick="SendMessage_Click" />
</asp:Content>
