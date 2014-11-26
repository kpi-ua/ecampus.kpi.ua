<%@ Page Title="Дошка оголошень" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="Site.Modules.Bulletins.Default" %>

<asp:Content ID="breadcrumbs_content" ContentPlaceHolderID="breadcrumbs" runat="server">
    <li><a href="/Default.aspx">Домашня</a></li>
    <li class="active">Дошка оголошень</li>
</asp:Content>

<asp:Content ID="body_content" ContentPlaceHolderID="body" runat="server">
    <div class="profile">
        <ul class="nav nav-tabs" id="myTab">
            <li class="active"><a href="#tab1" data-toggle="tab">Актуальні оголошення</a></li>
            <li><a href="#tab2" data-toggle="tab">Додати оголошення</a></li>
        </ul>

        <div class="tab-content">
            <div class="tab-pane active" id="tab1">
                <!--#region content  -->
                <div runat="server" id="ActualBulletinDiv"></div>
                <!--#endregion -->
            </div>

            <div class="tab-pane"  id="tab2" >
                <!--#region content  -->
                <table class ="bulletin-add-table">
                   <tr>
                       <td style="width: 200px">
                           Профіль
                       </td>
                       <td>
                           <asp:DropDownList Width="700" runat="server" ID ="profileList"></asp:DropDownList>
                           <asp:Button ID="lnkSaveAs" Text="Вибрати" OnClick="postRes" runat="server"></asp:Button>
                       </td>
                   </tr> 
                    <tr>
                       <td>
                           Отримувачі: 
                       </td>
                       <td>
                           <div runat="server" id="selectedVals"></div>
                       </td>
                   </tr> 
                    <tr>
                       <td>
                           Тема
                       </td>
                       <td>
                           <asp:TextBox ID="sub_text" runat="server" Width="700"></asp:TextBox>
                       </td>
                   </tr>
                     <tr>
                       <td>
                           Період показу
                       </td>
                       <td>
                           Початок: <asp:TextBox ID="dateStart_d" runat="server" Width="20" MaxLength="2" Text="11"></asp:TextBox>
                           -<asp:TextBox ID="dateStart_m" runat="server" Width="20" MaxLength="2" Text="11"></asp:TextBox>
                           -<asp:TextBox ID="dateStart_y" runat="server" Width="40" MaxLength="4" Text="1111"></asp:TextBox>
                           Завершення: <asp:TextBox ID="dateEnd_d" runat="server" Width="20" MaxLength="2" Text="11"></asp:TextBox>
                           -<asp:TextBox ID="dateEnd_m" runat="server" Width="20" MaxLength="2" Text="11"></asp:TextBox>
                           -<asp:TextBox ID="dateEnd_y" runat="server" Width="40" MaxLength="4" Text="1111"></asp:TextBox>
                       </td>
                   </tr> 
                    <tr>
                       <td>
                           Текст
                       </td>
                       <td>
                           <asp:TextBox ID="text_text" runat="server" Width="700" Height="300" TextMode="MultiLine"></asp:TextBox>
                       </td>
                   </tr> 
                    <tr>
                       <td>
                           <asp:Button runat="server" Text="Додати" OnClick="add_buletin"></asp:Button>
                       </td>
                       <td>
                       </td>
                   </tr>
                </table>
                <!--#endregion -->
            </div>
        </div>
    </div>
    <script type="text/javascript">
        function ShowPanel() {
            var d = $('[id*=profileList] option:selected').text();
            document.getElementById('<%=selectedVals.ClientID%>').innerText += " | " + d;
            return false;
        }
    </script>
    <div class="table-responsive" runat="server" id="bulletins"></div>
</asp:Content>
