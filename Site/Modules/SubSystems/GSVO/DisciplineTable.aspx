<%@ Page Title="Нормативні дисципліни" Language="C#" AutoEventWireup="true" MasterPageFile="~/Site.Master"  CodeBehind="DisciplineTable.aspx.cs" Inherits="Site.Modules.SubSystems.GSVO.DisciplineTable" %>

<asp:Content ID="breadcrumbs_content" ContentPlaceHolderID="breadcrumbs" runat="server">
    <li><a href="/Default.aspx">Домашня</a></li>
    <li><a href="../Default.aspx">Вибір підсистеми</a></li>
    <li><a href="Default.aspx">ОПП ГСВО</a></li>
    <li class="active">Нормативні дисципліни</li>
</asp:Content>
    

<asp:Content ID="body_content" ContentPlaceHolderID="body" runat="server">
    
  <div class="page-header">
        <h1><%=Page.Title %></h1>
        <h3>Освітньо-професійна програма - Галузевий стандарт вищої освіти</h3>
    </div>
    <div class="input-group col-md-9">
        <asp:Literal ID="CathName" runat="server"></asp:Literal>   
        <asp:Literal ID="SpecName" runat="server"></asp:Literal>  
    </div>

    <%--<asp:Button BackColor=""/>--%>

    <div class="main-block">
        <asp:Literal ID="RtDisciplineTable" runat="server"></asp:Literal>
    </div>
    
    <!-- Modal 5-->
            <div class="modal" id="EditDisc-modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                            <h4 class="modal-title" id="myModalLabel">Редагування дисципліни</h4>
                        </div>
                        <div class="modal-body">
                            
                              <select id ="dcComponentId" class="form-control">
                                  <option>Виберіть компонент</option>
                                  <option value="1">Нормативні навчальні дисципліни</option>
                                  <option value="2">Дисципліни за вибором ВНЗ</option>
                                  <option value="3">Дисципліни вільного вибору студента</option>
                              </select>
                            <br/>
                            <select id ="dcCycleId" class="form-control">
                                <option>Виберіть цикл</option>
                                <option value="1">Цикл гуманітарної та соціально-економічної підготовки</option>
                                <option value="2">Цикл математичної природничо-наукової підготовки</option>
                                  <option value="3">Цикл професійної та практичної підготовки</option>
                            </select>
                            <br/>
                            <input type="text" class="form-control" id ="shifr" placeholder="Шифр"/><br/>
                            <input type="text" class="form-control" id ="countHour" placeholder="Кількість годин"/><br/>
                            <input type="text" class="form-control" id ="creditNational" placeholder="Національні кредити"/><br/>
                            <input type="text" class="form-control" id ="creditECTS" placeholder="Кредити ECTS"/><br/>
                            <input type="text" class="form-control" id ="ourCredit" placeholder="Позакредитні "/><br/>
                            
                            <select id ="vcStatus" class="form-control">
                                  <option>Виберіть статус</option>
                                  <option value="0">Затверджено ОПП ГСВО</option>
                                  <option value="1">Не затверджено ОПП ГСВО</option>
                              </select><br/>
                            <select id ="vcActuality" class="form-control">
                                  <option>Виберіть актуальність</option>
                                  <option value="0">Затверджено ОПП ГСВО</option>
                                  <option value="1">Не затверджено ОПП ГСВО</option>
                              </select><br/>
                            <input type="text" class="form-control" id ="fullName" placeholder="Ім'я публікатора"/><br/>
                        </div>
                        <div class="modal-footer">
                                    <button type="button" class="btn btn-default" id="SaveEditDiscipline" data-dismiss="modal">OK</button>
                                    <button type="button" class="btn btn-default" data-dismiss="modal">Закрити</button>
                        </div>
                    </div>
                </div>

            </div>
</asp:Content>

