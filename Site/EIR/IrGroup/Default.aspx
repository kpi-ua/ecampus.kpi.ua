<%@ Page Title="Групи ЕІР" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="Site.EIR.IrGroup.Default" %>
<asp:Content ID="Content1" ContentPlaceHolderID="body" runat="server">
    <h1>Hello world!</h1>
    <asp:Button ID="new_group" runat="server" Text="Нова група" CssClass="btn btn-warning" ClientIDMode="Static" />
    <asp:Panel ID="LinkContainer" runat="server">
        <div id="out_json" runat="server"></div>
    </asp:Panel>
</asp:Content>
