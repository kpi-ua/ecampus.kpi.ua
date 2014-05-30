<%@ Page Title="Профіль" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="Site.Default" %>

<asp:Content ID="carousel_content" ContentPlaceHolderID="carousel_container" runat="server">
    <div class="carousel">
        <div runat="server" id="carousel_wrap" class="carousel-wrap">
        </div>
    </div>
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">
    <div class="form-group" runat="server" id="error_message" Visible="False">
        <div class="alert alert-danger alert-dismissable">
            <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
            <div id="error_message_text" runat="server"></div>
        </div>
    </div>

    <div class="profile">
        <ul class="nav nav-tabs" id="myTab">
            <li class="active"><a href="#inbox" data-toggle="tab"><i class="fa fa-user"></i>&nbsp;Персональні дані</a></li>
            <li><a href="#assignment" data-toggle="tab"><i class="fa fa-list"></i>&nbsp;Додаткові функції</a></li>
            <li><a href="#event" data-toggle="tab"><i class="fa fa-cogs"></i>&nbsp;Редагування профайлу</a></li>
        </ul>

        <div class="tab-content">
            <div class="tab-pane active" id="inbox">
                <h4><%=CurrentUser.FullName %></h4>

                <div class="col-lg-3">
                    <asp:Image CssClass="pic img-circle" ID="profile_photo" runat="server" />
                </div>

                <div class="col-lg-9">
                    <h5 class="text-muted">Дані за місцем навчання/роботи</h5>
                    <asp:Literal ID="WorkData" runat="server"></asp:Literal>
                </div>

            </div>

            <div class="tab-pane" id="assignment">
                <h4>Додаткові функції</h4>
                <asp:Literal ID="SpecFunc" runat="server"></asp:Literal>
            </div>

            <div class="tab-pane" id="event">
                <div class="input-group">
                    <label class="control-label" for="File">Обрати файл</label>
                    <asp:FileUpload ClientIDMode="Static" ID="file_upload" runat="server" />
                    <asp:Button runat="server" ID="UploadBtn" OnClick="btnUpload_Click" Text="Завантажити" CssClass="btn btn-success btn-sm"></asp:Button>
                </div>
                <br />
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
            </div>
        </div>
    </div>
</asp:Content>
