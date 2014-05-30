<%@ Page Title="Перегляд групи ЕІР" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="IrGroupView.aspx.cs" Inherits="Site.EIR.IrGroup.IrGroupView" %>

<asp:Content ID="GroupViewContent" ContentPlaceHolderID="body" runat="server">
    <asp:Button ID="add_ir" runat="server" Text="Додати ЕІР" CssClass="btn btn-warning" ClientIDMode="Static" />
    <asp:Panel ID="LinkContainer" runat="server">
        <div id="out_json" runat="server"></div>
    </asp:Panel>
</asp:Content>
