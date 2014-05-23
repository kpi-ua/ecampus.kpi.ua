<%@ Page Title="Дошка оголошень" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="Site.Bulletins.Default" %>

<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">
    <h1>Дошка оголошень</h1>
    <a runat="server" id="moderator" href="/Bulletins/MyBulletins.aspx" class="btn btn-warning" ClientIDMode="Static">Режим Модератора</a>
    <div class="table-responsive" runat="server" id="bulletins"></div>
    
</asp:Content>
