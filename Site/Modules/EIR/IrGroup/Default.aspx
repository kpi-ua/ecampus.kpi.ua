<%@ Page Title="Групи ЕІР" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="Site.Modules.EIR.IrGroup.Default" %>

<asp:Content ID="breadcrumbs_content" ContentPlaceHolderID="breadcrumbs" runat="server">
    <li><a href="/Default.aspx">Домашня</a></li>
    <li class="active">ЕIR</li>
</asp:Content>

<asp:Content ID="Content1" ContentPlaceHolderID="body" runat="server">
    
    <div class="page-header">
        <h1><%=Page.Title %></h1>
    </div>

    <asp:Button ID="new_group" runat="server" Text="Нова група" CssClass="btn btn-warning" ClientIDMode="Static" OnClick="NewGroup_Click" />
    <asp:Panel ID="SubdivisionIrContainer" runat="server">
        <div id="out_json" runat="server"></div>
    </asp:Panel>

    <script type="text/javascript">

        function SetSessionValue(inKey, inValue) {
            $.ajax({
                type: "POST",
                url: "/SessionManager.asmx/SetSessionValue",
                data: { key: inKey, value: inValue },
                async: false,
            });
        };


        $(document).ready(function () {


            $(document).on("click", ".irGroupLink", function (e) {
                var irGroupId = $(this).attr("subdivisionIrId");
                e.preventDefault();
                window.open("IrGroupSetView.aspx?subdivisionId=" + irGroupId, "_self");
            });

        });
    </script>
</asp:Content>
