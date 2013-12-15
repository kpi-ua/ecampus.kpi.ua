<%@ Page Language="C#" MasterPageFile="~/Inner.master" AutoEventWireup="true" CodeBehind="Profile.aspx.cs" Inherits="WebApplication.Authentication.Success" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <title>Профіль</title>
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">
    <div style="max-width: 80%; /*background-color: cadetblue; */ float: left;">
        <h3 class="text-primary">Мій профіль</h3>
        <div style="margin-left: 15px;">
            <h4 class="text-muted">Персональні дані</h4>
            <asp:Literal ID="PersData" runat="server"></asp:Literal>
            <h4 class="text-muted">Дані за місцем навчання (роботи)</h4>
            <asp:Literal ID="WorkData" runat="server"></asp:Literal>
            <h4 class="text-muted">Додаткові функції</h4>
            <asp:Literal ID="SpecFunc" runat="server"></asp:Literal>
        </div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="right_column" runat="server">
        <asp:Image ID="Photo" runat="server" />
        <nav id="right-sidebar">
            <a href="#"><img src="/Images/foto.png" />завантажити фото</a>
            <a href="#"><img src="/Images/parol.png" />змінити пароль</a>
        </nav>
    <!-- .right-sidebar -->
</asp:Content>

