<%@ Page Title="Студенти групи" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="StudentsOfGroup.aspx.cs" Inherits="Site.Modules.EIR.StudentsOfGroup" %>

<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">

        <asp:Panel ID="LinkContainer" runat="server">
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
    </script>
</asp:Content>
