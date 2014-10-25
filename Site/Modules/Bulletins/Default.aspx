<%@ Page Title="Дошка оголошень" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="Site.Modules.Bulletins.Default" %>

<asp:Content ID="breadcrumbs_content" ContentPlaceHolderID="breadcrumbs" runat="server">
    <li><a href="/Default.aspx">Домашня</a></li>
    <li class="active">Дошка оголошень</li>
</asp:Content>

<asp:Content ID="body_content" ContentPlaceHolderID="body" runat="server">
    <div class="profile">
        <ul class="nav nav-tabs" id="myTab">
            <li class="active"><a href="#tab1" data-toggle="tab">Актуальні оголошення</a></li>
            <li><a href="#tab2" data-toggle="tab">Типи профайлів</a></li>
            <li><a href="#tab3" data-toggle="tab">Факультети</a></li>
            <li><a href="#tab4" data-toggle="tab">Групи</a></li>
            <li><a href="#tab5" data-toggle="tab">Додати оголошення</a></li>
            <li><a href="#tab6" data-toggle="tab">Модератор</a></li>
        </ul>

        <div class="tab-content">
            <div class="tab-pane active" id="tab1">
                <!--#region content  -->
                <asp:TextBox ID="output_box1" runat="server" CssClass="form-control" Rows="15" TextMode="multiline">Output results</asp:TextBox> 
                <asp:Button ID="get_actual" runat="server" Text="Актуальные объявления" CssClass="btn btn-warning" ClientIDMode="Static" OnClick="get_actual_click" />
                <!--#endregion -->
            </div>

            <div class="tab-pane"  id="tab2" >
                <!--#region content  -->
                <asp:TextBox ID="output_box2" runat="server" CssClass="form-control" Rows="15" TextMode="multiline">Output results</asp:TextBox>
                <asp:Button ID="get_group_list" runat="server" Text="Типы профайлов" CssClass="btn btn-warning" ClientIDMode="Static" OnClick="get_profile_type" />
                <!--#endregion -->
            </div>

            <div class="tab-pane" id="tab3">
                <!--#region content  -->
                <asp:TextBox ID="output_box3" runat="server" CssClass="form-control" Rows="15" TextMode="multiline">Output results</asp:TextBox>
                <asp:Button ID="get_faculty_list" runat="server" Text="Факультеты" CssClass="btn btn-warning" ClientIDMode="Static" OnClick="get_faculty_list_click" />
                <!--#endregion -->
            </div>
            
            <div class="tab-pane" id="tab4">
                <!--#region content  -->
                <asp:TextBox ID="output_box4" runat="server" CssClass="form-control" Rows="15" TextMode="multiline">Output results</asp:TextBox>
                <asp:Button ID="Button1" runat="server" Text="Группы" CssClass="btn btn-warning" ClientIDMode="Static" OnClick="get_group_list_click" />
                <!--#endregion -->
            </div>
            
            <div class="tab-pane" id="tab5">
                <!--#region content  -->
                <asp:TextBox ID="input_box" runat="server" CssClass="form-control" Rows="10" TextMode="multiline">Text input</asp:TextBox>
                <asp:Button ID="add_buletin" runat="server" Text="Добавить объявление" CssClass="btn btn-warning" ClientIDMode="Static" OnClick="add_buletin_click" />
                <!--#endregion -->
            </div>
            
            <div class="tab-pane" id="tab6">
                <!--#region content  -->
                <asp:TextBox ID="output_box6" runat="server" CssClass="form-control" Rows="10" TextMode="multiline">Text input</asp:TextBox>
                <asp:Button ID="Button2" runat="server" Text="Модератор" CssClass="btn btn-warning" ClientIDMode="Static" OnClick="get_moderator" />
                <!--#endregion -->
            </div>
        </div>
    </div>
    <a runat="server" id="moderator" href="/Modules/Bulletins/MyBulletins.aspx" class="btn btn-warning" ClientIDMode="Static">Режим Модератора</a>
    <div class="table-responsive" runat="server" id="bulletins"></div>
</asp:Content>
