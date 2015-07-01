<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="Site.Modules.AntiPlagiarism.WebForm1" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="breadcrumbs" runat="server">
    <li><a href="/Default.aspx">Домашня</a></li>
    <li class="active">Антиплагіат</li>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="body" runat="server">
    <div class="page-header">
        <h1><%=Page.Title %></h1>
    </div>
    
<%--    <input type="text" id="testRemoveIn" value="" placeholder="FileId" />--%>
<%--    <button type="button" id="testRemove">RemoveFile</button>--%>
<%--    <hr />--%>
<%--    <input type="text" id="testCompareFiles1" value="" placeholder="FirstFileId" />--%>
<%--    <input type="text" id="testCompareFiles2" placeholder="SecondFileId" />--%>
<%--    <button type="button" id="testCompareFiles">CompareFiles</button>--%>
<%--    <hr />--%>
<%--    <button type="button" id="testGetFilesList">GetFilesList</button>--%>

    <div role="tabpanel">
        <ul class="nav nav-tabs">
            <li class="active"><a href="#files" data-toggle="tab">Файли</a></li>
            <li><a href="#results" data-toggle="tab">Результати</a></li>
        </ul>
        
        <div class="tab-content">
            <div role="tabpanel" class="tab-pane fade active in" id="files">
                <table id="tblFiles" class="table table-striped">
                    <thead>
                    <tr>
                        <th style="width: 20px"><input type="checkbox" id="checkAllFiles"/></th>
                        <th>Файли</th>
                    </tr>
                    </thead>
                </table>
                <div class="file-upload btn btn-primary">
                    Завантажити файли
                    <input id="uploadFiles" type="file" name="documents" multiple/>
                </div>
                <div id="blockBrowserError" class="alert alert-danger hide">
                    <a href="#" class="close" rel="hide">&times;</a>
                    <strong>Помилка!</strong> Цей браузер не підтримує функцію завантаження файлів HTML5.
                </div>
                <div class="form-group">
                    <label for="percent">Відсоток збігу, за якого файли вважаються схожими:</label>
                    <input type="number" min="1" max="100" class="form-control" id="percent" value="50" placeholder="">
                </div>
                <button type="button" class="btn btn-primary" id="testCompareFiles">Порівняти файли</button>
            </div>
            <div role="tabpanel" class="tab-pane fade" id="results">
                <h2>Результати</h2>
            </div>
        </div>
    </div>
    <script src="../../Scripts/antiplagiarism.js"></script>
</asp:Content>
