<%@ Page Title="Профіль" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="Site.Default" %>

<asp:Content ID="carousel_content" ContentPlaceHolderID="carousel_container" runat="server">
    <div class="carousel">
        <div runat="server" id="carousel_wrap" class="carousel-wrap">
        </div>
    </div>
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">

    <div class="col-md-8">
        <h4 class="text-muted">Персональні дані</h4>
        <asp:Literal ID="PersData" runat="server"></asp:Literal>
        <h4 class="text-muted">Дані за місцем навчання (роботи)</h4>
        <asp:Literal ID="WorkData" runat="server"></asp:Literal>
        <h4 class="text-muted">Додаткові функції</h4>
        <asp:Literal ID="SpecFunc" runat="server"></asp:Literal>
    </div>

    <div class="col-md-4" id="right-sidebar">
        <asp:Image ID="profile_photo" runat="server" ClientIDMode="Static" />
        <div class="clear"></div>
        <ul>
            <li><a id="ShowImgLoadForm">
                <img src="/Images/foto.png" />завантажити фото</a></li>

            <asp:Panel ID="LoadPhoto" runat="server" ClientIDMode="Static">
                <div class="input-group">
                    <asp:TextBox ID="File" runat="server" CssClass="form-control input-sm" ReadOnly="True"></asp:TextBox>
                    <div class="btn btn-primary btn-sm  upload">
                        Обрати файл
                    <input type="file" runat="server" id="InputFile" name="myFile" class="chose-file" />
                    </div>
                    <asp:Button runat="server" ID="UploadBtn" OnClick="btnUpload_Click" Text="Завантажити" CssClass="btn btn-success btn-sm"></asp:Button>
                </div>
            </asp:Panel>

            <li><a id="ShowCPForm">
                <img src="/Images/parol.png" />змінити пароль</a></li>

            <asp:Panel ID="ChangePass" runat="server" ClientIDMode="Static">
                <div class="input-group">
                    <asp:Label ID="OldPassLabel" runat="server" Text="Старий пароль" CssClass="label label-primary"></asp:Label>
                    <asp:TextBox ID="OldPass" runat="server" TextMode="Password" CssClass="form-control input-sm"></asp:TextBox>
                </div>
                <div class="input-group">
                    <asp:Label ID="NewPassLabel" runat="server" Text="Новий пароль" CssClass="label label-primary"></asp:Label>
                    <asp:TextBox ID="NewPass" runat="server" TextMode="Password" CssClass="form-control input-sm"></asp:TextBox>
                </div>
                <div class="input-group">
                    <asp:Label ID="NewPassCheakLabel" runat="server" Text="Повторіть новий пароль" CssClass="label label-primary"></asp:Label>
                    <asp:TextBox ID="NewPassCheak" runat="server" TextMode="Password" CssClass="form-control input-sm"></asp:TextBox>
                </div>
                <asp:Button ID="SavePass" runat="server" Text="Зберегти" CssClass="btn btn-success btn-sm" OnClick="SavePass_Click" />
            </asp:Panel>
        </ul>

        <script type="text/javascript">
            $(window).load(function () {
                if ($("#ChangePassLabel").css("class") == "label label-danger") {
                    $("#ChangePass").css("display", "inline");
                }
            });
            $("#ShowCPForm").click(function () {
                if ($("#ChangePass").css("display") == "none") {
                    $("#ChangePass").slideDown();
                } else { $("#ChangePass").slideUp(); }
            });

            $("#ShowImgLoadForm").click(function () {
                if ($("#LoadPhoto").css("display") == "none") {
                    $("#right_column_File").val("Файл не обрано");
                    $("#right_column_UploadBtn").css("display", "none");
                    $("#LoadPhoto").slideDown();
                } else { $("#LoadPhoto").slideUp(); }
            });

            $("#right_column_InputFile").change(function () {
                $("#right_column_File").val($(this).val());
                $("#right_column_UploadBtn").css("display", "block");
            });
        </script>
    </div>
</asp:Content>
