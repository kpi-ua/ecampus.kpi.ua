<%@ Page Title="Підсистеми" Language="C#" AutoEventWireup="true" MasterPageFile="~/Site.Master" CodeBehind="Default.aspx.cs" Inherits="Site.Modules.SubSystems.Default" %>

<asp:Content ID="breadcrumbs_content" ContentPlaceHolderID="breadcrumbs" runat="server">
    <li><a href="/Default.aspx">Домашня</a></li>
    <li class="active">Вибір підсистеми</li>
</asp:Content>

<asp:Content ID="body_content" ContentPlaceHolderID="body" runat="server">
    
    <div class="page-header">
        <h1><%=Page.Title %></h1>
    </div>

    <section class="text-center">
        <asp:Panel ID="MySubsystemsContainer" runat="server"></asp:Panel>
    </section>
  
</asp:Content>
