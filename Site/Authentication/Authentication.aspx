<%@ Page Language="C#" AutoEventWireup="true" MasterPageFile="~/Site.Master" CodeBehind="Authentication.aspx.cs" Inherits="Site.Authentication.WebForm1" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <title>Authentication</title>
    <link href="../Content/Authentication.css" rel="stylesheet" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">

    <%--<div id="div_body" style="width: 100%-35px; margin-left: 35px; margin-right: 35px;">--%>
        <%--<div id="main" class="container">--%>
            <div id="form" class="form-horizontal">
                <div class="control-groups">
                    <asp:TextBox ID="User" runat="server" AutoCompleteType="Disabled" CssClass="form-control input-sm" Text="Логін"></asp:TextBox>
                    <asp:TextBox ID="Pass" runat="server" CssClass="form-control input-sm" Text="Пароль"></asp:TextBox>
                </div>
                <div id="divSaveIn" class="control-groups">
                    <asp:CheckBox ID="SaveIn" runat="server" CssClass="css-checkbox" />
                    <asp:Label ID="SaveInLabel" runat="server" CssClass="text-muted input-sm" Text="Запам'ятати мене"></asp:Label>
                </div>
                <div id="divLink" class="control-groups">
                    <asp:LinkButton ID="RePassLink" runat="server" CssClass="input-m">Забули пароль?</asp:LinkButton>

                </div>
                <div id="divBtn" class="control-groups">
                    <asp:Button ID="Enter" runat="server" CssClass="btn btn-m btn-primary" Text="Вхід" OnClick="Enter_Click" />
                    <asp:Button ID="Cancel" runat="server" CssClass="btn btn-m btn-primary" Text="Відміна" OnClick="Cancel_Click" />
                </div>
            </div>
        <%--</div>--%>
    <%--</div>--%>


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
