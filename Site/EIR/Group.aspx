<%@ Page Title="Групи ЕІР" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Group.aspx.cs" Inherits="Site.EIR.GroupPage" %>

<asp:Content ID="Content1" ContentPlaceHolderID="body" runat="server">

    <div class="page-header">
        <h1><%=Page.Title %></h1>
    </div>

    <asp:Button ID="new_group" runat="server" Text="Нова група" CssClass="btn btn-warning" ClientIDMode="Static" />
    <asp:Panel ID="LinkContainer" runat="server">
        <div id="out_json" runat="server"></div>
    </asp:Panel>
</asp:Content>
