<%@ Page Language="C#" AutoEventWireup="true" MasterPageFile="~/Site.Master" CodeBehind="Authentication.aspx.cs" Inherits="Site.Authentication.WebForm1" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <title>Authentication</title>
    <%--<link href="../Content/Authentication.css" rel="stylesheet" />--%>
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">
    
    <div class="login-logo"></div>
            <form class="login-form">
                <div class="row">
                    <div class="col-lg-12">
                        <div class="form-group">
                            <label>Логін</label>
                            <input runat="server" ID="User" type="text" class="form-control" placeholder="Логін"/>
                        </div>
                        <div class="form-group">
                            <label>Пароль</label>
                            <input runat="server" ID="Pass" type="password" class="form-control" placeholder="Пароль"/>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-12">
                        <div class="remeber-me pull-left">
                            <input runat="server" id="remember_me_chkbx" type="checkbox"/>
                            <%--<label for="remember-me-chkbx" class="checkbox"></label>--%>
                            <label for="remember-me-chkbx">Запам’ятати мене</label>
                        </div>
                        <div class="forgot-pass pull-right">
                            <a href="#">Забули пароль?</a>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-12">
                        <div class="form-group text-center">
                            <asp:Button  runat="server" class="btn btn-success" Text="Вхід" OnClick="Enter_Click"/>
                        </div>
                    </div>
                </div>
            </form>

   <%-- <script type="text/javascript">
        $(function () {
            $('input[type=text]').focus(function () {
                $(this).val('');
            });
            $('input[type=password]').focus(function () {
                $(this).val('');
            });
        });
    </script>--%>
</asp:Content>
