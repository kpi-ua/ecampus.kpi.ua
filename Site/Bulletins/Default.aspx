<%@ Page Title="Дошка оголошень" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="Site.Bulletins.Default" %>

<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">
    
    <div class="page-header">
        <h1><%=this.Title %></h1>
    </div>
    <asp:TextBox ID="output_box" runat="server" CssClass="form-control" Rows="15" TextMode="multiline">Output results</asp:TextBox>
    <asp:Button ID="get_group_list" runat="server" Text="Типы профайлов" CssClass="btn btn-warning" ClientIDMode="Static" OnClick="get_group_list_click" />
    <asp:Button ID="get_faculty_list" runat="server" Text="Факультеты" CssClass="btn btn-warning" ClientIDMode="Static" OnClick="get_faculty_list_click" />
    <asp:Button ID="get_actual" runat="server" Text="Актуальные объявления" CssClass="btn btn-warning" ClientIDMode="Static" OnClick="get_actual_click" />
    
    <asp:TextBox ID="input_box" runat="server" CssClass="form-control" Rows="10" TextMode="multiline">Text input</asp:TextBox>
    <asp:Button ID="add_buletin" runat="server" Text="Добавить объявление" CssClass="btn btn-warning" ClientIDMode="Static" OnClick="add_buletin_click" />
    <a runat="server" id="moderator" href="/Bulletins/MyBulletins.aspx" class="btn btn-warning" ClientIDMode="Static">Режим Модератора</a>
    <div class="table-responsive" runat="server" id="bulletins"></div>
    
</asp:Content>
