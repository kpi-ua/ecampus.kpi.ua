<%@ Page Title="" Language="C#" MasterPageFile="~/SitePlusNav.Master" AutoEventWireup="true" CodeBehind="NewMessage.aspx.cs" Inherits="Site.Authentication.NewMessage" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <meta charset="utf-8">
    <link href="../../Content/NewMessage.css" rel="stylesheet" />
    <meta charset="utf-8" />
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">
    <asp:Panel ID="MainDiv" runat="server">
        <div id="UserListControl" class="input-prepend input-xxlarge">
            <span id="UserListControlName" class="input-group-addon text-info">Одержувачі:</span>
            <asp:ListBox ID="UserList" runat="server" CssClass="chzn-container chzn-container-multi"
                Height="20px" SelectionMode="Multiple"></asp:ListBox>
        </div>

        <div id="SubjectDiv" class="input-prepend input-xxlarge">
            <span id="SubjectName" class="input-group-addon text-info">Тема:</span>
            <asp:TextBox ID="Subject" runat="server" CssClass="form-control"></asp:TextBox>
        </div>

        <div id="TextDiv" class="input-prepend input-xxlarge">
            <span id="TextName" class="input-group-addon text-info">Текст:</span>
            <asp:TextBox ID="Text" runat="server" CssClass="form-control" TextMode="MultiLine" Rows="5"></asp:TextBox>
        </div>

    </asp:Panel>
</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="right_column" runat="server">
    <input type="button" value="Надіслати повідомлення" ID="SendMessage"  Class="btn btn-primary" />
</asp:Content>
