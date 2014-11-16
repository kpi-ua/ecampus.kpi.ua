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
                           <asp:DropDownList id="drop1" runat="server"></asp:DropDownList>
                       </td>
                   </tr> 
                    <tr>
                       <td>
                           Підрозділ
                       </td>
                       <td>
                           <asp:DropDownList id="drop2" runat="server"></asp:DropDownList>
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
    <div class="table-responsive" runat="server" id="bulletins"></div>
</asp:Content>
