<%@ Page Title="Пошук" Language="C#" MasterPageFile="~/Modules/EIR/Menu.master" AutoEventWireup="true" CodeBehind="View.aspx.cs" Inherits="Site.Modules.EIR.View" %>


<asp:Content ID="Content1" ContentPlaceHolderID="breadcrumbs_new" runat="server">
    <li class="active">Пошук</li>
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="newhead" runat="server">
    
</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="newbody" runat="server">
    <script src="/Scripts/APIlib.js"></script>
    <script src="/Scripts/EIRView.js"></script>
    <div class="page-header">
        <h1><%=Page.Title %></h1>
    </div>

    <table>
        <tr>
            <td>
                <b>Учасники</b>
                <div class="persons-block"></div>
                <br />
                <b>Інформація</b>
                <div class="info-block"></div>
                <br />
                <b>Мови вмісту</b>
                <div class="language-block"></div>
                <div class="editing-blocks"></div>
            </td>
            <td>
                <div class="right-block">
                    <div class="files-block">
                        <input type="text" placeholder="какой-то текст" />
                        <br />
                        <input type="button" value='кнопка1' />
                        <input type="button" value='кнопка2' />
                    </div>
                    <br />
                    <hr />
                    <div class="control-block">
                        <input type="button" value='прикрепление к дисциплине ' />
                        <input type="button" value='редактирование' />
                    </div>
                </div>
            </td>
        </tr>
    </table>
</asp:Content>
