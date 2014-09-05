<%@ Page Title="Навчальний процес" Language="C#" AutoEventWireup="true" MasterPageFile="~/Site.Master" CodeBehind="Default.aspx.cs" Inherits="Site.RNP.Default" %>

<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">
    
    <div class="page-header">
        <h1><%=Page.Title %></h1>
    </div>

    <div style="height:100%;">
        <div class="btn-group-vertical">
            <div id="HeadContainer" class="btn-group">
                <div id="divDdlContainer" class="btn-group-vertical">
                    <div id="divStudyYear" class="input-group">
                        <span class="input-group-addon input-sm">Навчальний рік</span>
                        <asp:DropDownList ID="StudyYear" CssClass="form-control input-sm" runat="server"></asp:DropDownList>
                    </div>
                    <div id="divOutCaf" class="input-group">
                        <span class="input-group-addon input-sm">Випускова кафедра</span>
                        <asp:DropDownList ID="OutCaf" CssClass="form-control input-sm" runat="server"></asp:DropDownList>
                    </div>
                    <div id="divOR" class="input-group">
                        <span class="input-group-addon input-sm">Освітньо-кваліфікаційний рівень</span>
                        <asp:DropDownList ID="OR" CssClass="form-control input-sm" runat="server"></asp:DropDownList>
                    </div>
                    <div id="divNP" class="input-group">
                        <span class="input-group-addon input-sm">Напрям підготовки</span>
                        <asp:Label ID="NP" CssClass="form-control" runat="server">Какой-то текст</asp:Label>
                    </div>
                    <div id="divSpec" class="input-group">
                        <span class="input-group-addon input-sm">Спеціальність</span>
                        <asp:DropDownList ID="Spec" CssClass="form-control input-sm" runat="server"></asp:DropDownList>
                    </div>
                    <%--<div id="divProfS" class="input-group">
                        <span class="input-group-addon input-sm">Проф. спрямування</span>
                        <asp:DropDownList ID="ProfS" CssClass="form-control input-sm" runat="server"></asp:DropDownList>
                    </div>--%>
                    <div id="divStudyForm" class="input-group">
                        <span class="input-group-addon input-sm">Форма навчання</span>
                        <asp:DropDownList ID="StudyForm" CssClass="form-control input-sm" runat="server"></asp:DropDownList>
                    </div>
                    <div id="divCourse" class="input-group">
                        <span class="input-group-addon input-sm">Курс навчання</span>
                        <asp:DropDownList ID="Course" CssClass="form-control input-sm" runat="server"></asp:DropDownList>
                    </div> 
                </div>

                <div class="btn-group-vertical">
                    <div id="divGroups">
                        <span class="text-primary">Навчальні групи:</span>
                        <div id="GroupContainer">
                            <p>IK-01</p>
                            <p>IK-01</p>
                            <p>IK-01</p>
                            <p>IK-01</p>
                            <p>IK-01</p>
                            <p>IK-01</p>
                        </div>
                    </div>
                    <div id="divFilterButtons" class="btn-group-vertical">
                        <asp:Button ID="btnAudHour" CssClass="btn btn-sm btn-success" runat="server" Text="Аудиторні години" OnClick="btnAudHour_Click" />
                        <asp:Button ID="btnContEventSemestr" CssClass="btn btn-sm btn-default" runat="server" Text="Контрольні заходи та їх розподіл за семестрами" OnClick="btnContEventSemestr_Click" />
                    </div>
                </div>
            </div>

            <div id="BodyContainer" style="clear:none">
                <asp:Table ID="Head1" runat="server" class="table table-bordered">
                    <asp:TableRow HorizontalAlign="Center">
                        <asp:TableCell RowSpan="3" Width="30px"><div>№</div></asp:TableCell>
                        <asp:TableCell RowSpan="3" Width="250px">Найменування дисципліни</asp:TableCell>
                        <asp:TableCell RowSpan="3" Width="90px">Код дисципліни</asp:TableCell>
                        <asp:TableCell ColumnSpan="2" Width="120px">Обсяг дисципліни</asp:TableCell>
                        <asp:TableCell ColumnSpan="4" Width="240px">Аудиторних годин</asp:TableCell>
                        <asp:TableCell RowSpan="3" Width="60px"><img src="../Images/samost.png" /></asp:TableCell>
                    </asp:TableRow>
                    <asp:TableRow HorizontalAlign="Center">
                        <asp:TableCell RowSpan="2" Width="60px"><img src="../Images/kred_ects.png" /></asp:TableCell>
                        <asp:TableCell RowSpan="2" Width="60px"><img src="../Images/godin.png" /></asp:TableCell>
                        <asp:TableCell RowSpan="2" Width="60px"><img src="../Images/vsogo.png" /></asp:TableCell>
                        <asp:TableCell ColumnSpan="3">у тому числі</asp:TableCell>
                    </asp:TableRow>
                    <asp:TableRow HorizontalAlign="Center">
                        <asp:TableCell Width="60px"><img src="../Images/lect.png" /></asp:TableCell>
                        <asp:TableCell Width="60px"><img src="../Images/pract.png" /></asp:TableCell>
                        <asp:TableCell Width="60px"><img src="../Images/lab.png" /></asp:TableCell>
                    </asp:TableRow>
                    <asp:TableRow HorizontalAlign="Center">
                            <asp:TableCell Width="30px">1</asp:TableCell>
                            <asp:TableCell Width="250px">2</asp:TableCell>
                            <asp:TableCell Width="90px">3</asp:TableCell>
                            <asp:TableCell Width="60px">4</asp:TableCell>
                            <asp:TableCell Width="60px">5</asp:TableCell>
                            <asp:TableCell Width="60px">6</asp:TableCell>
                            <asp:TableCell Width="60px">7</asp:TableCell>
                            <asp:TableCell Width="60px">8</asp:TableCell>
                            <asp:TableCell Width="60px">9</asp:TableCell>
                            <asp:TableCell Width="60px">10</asp:TableCell>
                        </asp:TableRow>
                </asp:Table>

            </div>

        </div>
        </div>
</asp:Content>

