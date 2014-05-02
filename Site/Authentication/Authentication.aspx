<%@ Page Language="C#" AutoEventWireup="true" MasterPageFile="~/Site.Master" CodeBehind="Authentication.aspx.cs" Inherits="Site.Authentication.WebForm1" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <title>Authentication</title>
    <link href="../Content/Authentication.css" rel="stylesheet" />
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">
    
    <div class="auth-container form-horizontal" role="form">
            
                <div class="form-group">
                    <asp:TextBox ID="User" runat="server" AutoCompleteType="Disabled" CssClass="form-control input-sm" Text="Логін"></asp:TextBox>
                    <asp:TextBox ID="Pass" runat="server" CssClass="form-control input-sm" Text="Пароль"></asp:TextBox>
                </div>
                <div class="form-group">
                    <asp:CheckBox ID="SaveIn" runat="server" CssClass="css-checkbox" />
                    <asp:Label ID="SaveInLabel" runat="server" CssClass="text-muted input-sm" Text="Запам'ятати мене"></asp:Label>
                </div>
                <%--<div class="form-group">
                    <asp:LinkButton ID="RePassLink" runat="server" CssClass="input-m">Забули пароль?</asp:LinkButton>

                </div>--%>
                <div class="form-group">
                    <asp:Button ID="Enter" runat="server" CssClass="btn btn-m btn-primary" Text="Вхід" OnClick="Enter_Click" />
                    <asp:Button ID="Cancel" runat="server" CssClass="btn btn-m btn-primary" Text="Відміна" OnClick="Cancel_Click" />
                </div>
    </div>

    <script type="text/javascript">
        $(function () {
            $('input[type=text]').focus(function () {
                $(this).val('');
            });
            $('input[type=password]').focus(function () {
                $(this).val('');
            });
        });
    </script>
</asp:Content>
