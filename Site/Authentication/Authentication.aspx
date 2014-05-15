<%@ Page Language="C#" AutoEventWireup="true" MasterPageFile="~/Site.Master" CodeBehind="Authentication.aspx.cs" Inherits="Site.Authentication.WebForm1" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <title>Authentication</title>
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">
    
    <div class="login-logo"></div>
            <div class="login-form">
                <div class="row">
                    <div class="col-lg-12">
                        <div class="form-group">
                            <label>Логін</label>
                            <%--<input runat="server" ID="User" type="text" class="form-control" placeholder="Логін"/>--%>
                            <asp:TextBox runat="server" ID="txUser" CssClass="form-control" ClientIDMode="Static" placeholder="Логін"></asp:TextBox>
                        </div>
                        <div class="form-group">
                            <label>Пароль</label>
                            <asp:TextBox runat="server" ID="txPass" TextMode="Password" CssClass="form-control" ClientIDMode="Static" placeholder="Пароль"></asp:TextBox>
                            <%--<input runat="server" ID="Pass" type="password" class="form-control" placeholder="Пароль"/>--%>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-12">
                        <div class="remeber-me pull-left">
                            <asp:CheckBox runat="server" ID="remember_me" ClientIDMode="Static"/>
                            <label for="remember_me">Запам’ятати мене</label>
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
            </div>
</asp:Content>
