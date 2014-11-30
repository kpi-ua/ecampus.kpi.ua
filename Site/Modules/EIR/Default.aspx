<%@ Page Title="Пошук" Language="C#" MasterPageFile="~/Modules/EIR/Menu.master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="Site.Modules.EIR.Default" %>

<asp:Content ID="Content3" ContentPlaceHolderID="breadcrumbs_new" runat="server">
    <li class="active">Пошук</li>
</asp:Content>
<asp:Content ID="Content1" ContentPlaceHolderID="newhead" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="newbody" runat="server">
    <script>
        $("#search_tab").addClass("active");
    </script>
    <!--   <h3> Пошук ЕІР</h3> -->
    <section class="eirsearch form-horizontal">
        <h4>Способи пошуку</h4>
        
        <div class="panel panel-default">
            <div class="panel-heading">
                <h3 class="panel-title">За метаданними</h3>
            </div>
            <div class="panel-body">
                <div class="form-group">
                    <label for="eirname" class="col-sm-2 control-label">Назва ЕІР</label>
                    <div class="col-sm-10">
                        <input class="form-control"  name="eirname" type="text" id="nam" placeholder="Назва ЕІР" />
                    </div>
                </div>

                <div class="form-group">
                    <label for="avt" class="col-sm-2 control-label">Автор</label>
                    <div class="col-sm-10">
                        <input class="form-control"  name="eirauthor" type="text" id="avt" placeholder="Автор" />
                    </div>
                </div>

                <div class="form-group">
                    <label for="eirauthorcontrib" class="col-sm-2 control-label">Тип внеску</label>
                    <div class="col-sm-10">
                        <select class="form-control"  name="eirauthorcontrib" id="vns" style="margin-top: 6px;">
                            <option>Автор</option>
                            <option>Співавтор</option>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label for="eirview" class="col-sm-2 control-label">Вид ЕІР</label>
                    <div class="col-sm-10">
                        <select class="form-control"  name="eirview" id="vid">
                            <option>Конспект</option>
                            <option>Підручник</option>
                            <option>Посібник</option>
                        </select>
                    </div>
                </div>

                <div class="form-group form-inline">
                    <label class="col-sm-2 control-label">Дата</label>
                    <div class="col-sm-10">
                        <label for="year">Рік</label>
                        <select  class="form-control" name="daty" id="year">
                            <option>2014</option>
                            <option>2013</option>
                        </select>
                        <label for="month" style="margin-left: 32px;">Місяць</label>
                        <select class="form-control"  name="datm" id="month">
                            <option>01</option>
                            <option>02</option>
                            <option>03</option>
                            <option>04</option>
                        </select>
                        <label for="number" style="margin-left: 32px;">Число</label>
                        <select class="form-control"  name="datn" id="number">
                            <option>01</option>
                            <option>02</option>
                            <option>03</option>
                            <option>04</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="panel panel-default">
            <div class="panel-heading">
                <h3 class="panel-title">За дисципліною</h3>
            </div>
            <div class="panel-body">
                <div class="form-group">
                    <label for="eirname" class="col-sm-2 control-label">Дисципліни</label>
                    <div class="col-sm-10">
                        <input class="form-control" name="disciplines" type="text" id="dsc" placeholder="Дисципліни" />
                    </div>
                </div>
            </div>
        </div>
        
        <div class="panel panel-default">
            <div class="panel-heading">
                <h3 class="panel-title">За кредитним модулем</h3>
            </div>
            <div class="panel-body">
                <div class="form-group">
                    <label for="eirname" class="col-sm-2 control-label">Кредитні модулі</label>
                    <div class="col-sm-10">
                        <input class="form-control"  name="credmod" type="text" id="crd" placeholder="Кредитні модулі" />
                    </div>
                </div>
            </div>
        </div>

        <div class="text-right">
            <input class="btn btn-default" type="button" id="clearr" value="Очистити" />
            <input class="btn btn-primary" type="button" id="searchh" value="Пошук" />
        </div>
    </section>


</asp:Content>
