<%@ Page Title="Профіль" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="Site.Default" %>

<asp:Content ID="breadcrumbs_content" ContentPlaceHolderID="breadcrumbs" runat="server">
    <li><a href="/Default.aspx">Домашня</a></li>
    <li class="active">Персональні данні</li>
</asp:Content>

<asp:Content ID="body_content" ContentPlaceHolderID="body" runat="server">
    <div class="profile">
        <ul class="nav nav-tabs" id="myTab">
            <li class="active"><a href="#tab1" data-toggle="tab">Персональні дані</a></li>
            <li><a href="#tab2" data-toggle="tab">Додаткові функції</a></li>
            <li><a href="#tab3" data-toggle="tab">Редагування профайлу</a></li>
        </ul>

        <div class="tab-content">
            <div class="tab-pane active" id="tab1" style ="height: 200px">
                <!--#region content  -->              
                    <h4><%=this.CurrentUser.FullName %></h4>

                    <div class="col-lg-3">
                        
                        <a data-toggle="popover" class="btn btn-success" data-trigger="hover" data-placement="bottom" title="Dismissible popover" data-content="And here's some amazing content. It's very engaging. Right?">
                               
                            <asp:Image CssClass="pic img-circle" ID="profile_photo" runat="server" />

                        </a>

                    </div>

                    <div class="col-lg-9">
                        <h5 class="text-muted">Дані за місцем навчання/роботи</h5>
                        <asp:Literal ID="WorkData" runat="server"></asp:Literal>
                    </div>
                <!--#endregion -->
            </div>

            <div class="tab-pane"  id="tab2" style ="height: 200px">
                <!--#region content  -->
                    <h4>Додаткові функції</h4>
                    <asp:Literal ID="SpecFunc" runat="server"></asp:Literal>
                <!--#endregion -->
            </div>

            <div class="tab-pane" id="tab3" style ="height: 300px">
                <!--#region content  -->
                    <div class="input-group">
                        <label class="control-label" for="File">Обрати файл</label>
                        <asp:FileUpload ClientIDMode="Static" ID="file_upload" runat="server" />
                        <asp:Button runat="server" ID="UploadBtn" OnClick="btnUpload_Click" Text="Завантажити" CssClass="btn btn-success btn-sm"></asp:Button>
                    </div>
                    <br/>
                    <div class="input-group">
                        <label class="control-label" for="OldPass">Старий пароль</label>
                        <asp:TextBox ClientIDMode="Static" ID="OldPass" runat="server" TextMode="Password" CssClass="form-control input-sm"></asp:TextBox>
                    </div>
                    <div class="input-group">
                        <label class="control-label" for="NewPassLabel">Старий пароль</label>
                        <asp:TextBox ClientIDMode="Static" ID="NewPass" runat="server" TextMode="Password" CssClass="form-control input-sm"></asp:TextBox>
                    </div>
                    <div class="input-group">
                        <label class="control-label" for="NewPassCheak">Повторіть новий пароль</label>
                        <asp:TextBox ClientIDMode="Static" ID="NewPassCheak" runat="server" TextMode="Password" CssClass="form-control input-sm"></asp:TextBox>
                    </div>
                    <br />
                    <asp:Button ID="SavePass" runat="server" Text="Зберегти" CssClass="btn btn-success btn-sm" OnClick="SavePass_Click" />
                <!--#endregion -->
            </div>
        </div>
    </div>
</asp:Content>
