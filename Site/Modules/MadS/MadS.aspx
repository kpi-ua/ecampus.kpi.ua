<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="MadS.aspx.cs" Inherits="Site.Modules.MadS.MadS" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link rel="stylesheet" type="text/css" href="../../Content/tree/style.css">
    <style>
        .margin-bottom-20 {
            margin-bottom: 20px;
        }
        .font-12 {
            font-size: 12px;
        }
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="breadcrumbs" runat="server">
    <li><a href="/Default.aspx">Домашня</a></li>
    <li class="active">MADS</li>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="body" runat="server">
    
    <!-- TODO: REMOVE THIS -->
    <div class="col-xs-12" style="display: none">
        <input type="text" id="I1" placeholder="I1" /><br />
        <input type="text" id="I2" placeholder="I2" /><br />
        <input type="text" id="I3m" placeholder="I3m" /><br />
        <input type="text" id="I4" placeholder="I4" /><br />
        <input type="text" id="I5" placeholder="I5" /><br />
        <input type="text" id="S1" placeholder="S1" /><br />
        <input type="text" id="S2" placeholder="S2" /><br />
        <input type="text" id="S3" placeholder="S3" /><br />
        <input type="text" id="fieldId" placeholder="field id" /><br />
        <textarea name cols="100" rows="5" id="testRes">
</textarea>
        <button id="test1" type="button">test load</button>
    </div>
    
    <a href="Page3.aspx">Страница 3</a>
    <a href="Page4.aspx">Страница 4</a>

    <ul class="nav nav-tabs" role="tablist">
        <li role="presentation" class="active"><a href="#tab1" aria-controls="home" role="tab" data-toggle="tab">Завдання</a></li>
        <li role="presentation"><a href="#tab2" aria-controls="profile" role="tab" data-toggle="tab">Тести</a></li>
    </ul>
    
    
    <!-- Tab panes -->
    <div class="tab-content">
        <div role="tabpanel" class="tab-pane active" id="tab1">

            <div class="margin-bottom-20">
                <button id="btnAddDir" data-tree="#pathTree" class="btn btn-primary" type="button">Створити директорію</button>
                <button id="btnAddTask" class="btn btn-primary" type="button" data-toggle="modal" data-target="#modalTestTask">Створити завдання</button>
            </div>

            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th class="col-md-4">Назва</th>
                        <th>Опис</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td id="pathTreeContainer">
                            <div id="pathTree"></div>
                        </td>
                        <td>
                            <div id="tdFilePath"></div>
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- Створення завдання -->
            <div class="panel panel-default" id="panelTask" style="display: none;">
                <div class="panel-heading" role="tab">
                    <h4 class="panel-title">
                        <a role="button" data-toggle="collapse" href="#collapseTask" aria-expanded="true" aria-controls="collapseTask">
                            Завдання
                        </a>
                    </h4>
                </div>
                <div id="collapseTask" class="panel-collapse collapse in" role="tabpanel">
                    <div class="panel-body">
                        
                        <div class="form-horizontal">
                            <div class="form-group">
                                <label for="selectTaskType" class="col-sm-4 control-label">Тип</label>
                                <div class="col-sm-8">
                                    <select class="form-control" id="selectTaskType">
                                        <option value="1">Вибір однієї відповіді</option>
                                        <option value="2">Вибір кількох відповідей</option>
                                        <option value="3">Встановлення відповідностей</option>
                                        <option value="4">Встановлення порядку</option>
                                        <!--<option value="5">Числовий формат</option>-->
                                        <option value="6">Словесний формат (з перевіркою за маскою - співпадання з декількома відповідями)</option>
                                        <option value="7">Cловесний формат (з перевіркою за маскою - відповідь в декілька строк)</option>
                                        <option value="8">Словесинй формат (порівняння з оригіналом)</option>
                                        <option value="9">Словесний формат (порівняння з оригіанлом) - відповідь в кілька строк</option>
                                        <option value="10">Довільний формат</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="textTaskName" class="col-sm-4 control-label">Назва</label>
                                <div class="col-sm-8">
                                    <input type="text" class="form-control" id="textTaskName" placeholder="Назва завдання">
                                </div>
                            </div>
                        </div>

                        <div class="col-xs-12">
                            <h3>Текст завдання</h3>
                            <div id="editorTask"></div>
                            <hr/>


                            <div class="form-horizontal">
                                <div class="form-group">
                                    <label for="numPoints" class="col-sm-4 control-label">Кількість балів за вірну відповідь</label>
                                    <div class="col-sm-8">
                                        <input type="number" class="form-control" id="numPoints" value="1" placeholder="Кількість балів за вірну відповідь">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="numDifficulty" class="col-sm-4 control-label">Складність завдання</label>
                                    <div class="col-sm-8">
                                        <input type="number" class="form-control" id="numDifficulty" value="1" placeholder="Складність завдання">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="numSimilarityScore" class="col-sm-4 control-label">Норма відповідності</label>
                                    <div class="col-sm-8">
                                        <input type="number" class="form-control" id="numSimilarityScore" min="1" max="100" value="100" placeholder="Норма відповідності">
                                    </div>
                                </div>
                                <div class="checkbox">
                                    <label>
                                        <input type="checkbox" id="checkMixAnswers"> Перемішати відповіді
                                    </label>
                                </div>
                            </div>


                            <hr/> 
                            <div class="panel panel-default" id="panelAddAnswer">
                                <div class="panel-heading" role="tab">
                                    <h4 class="panel-title">
                                        <a role="button" data-toggle="collapse" href="#collapseAnswer" aria-expanded="true" aria-controls="collapseAnswer">
                                            Додати відповідь
                                        </a>
                                    </h4>
                                </div>
                                <div id="collapseAnswer" class="panel-collapse collapse" role="tabpanel">
                                    <div class="panel-body">
                                        <div data-rel="editor-add-asnwer" id="editorAddAnswerContainer"><div id="editorAddAnswer" class="margin-bottom-20"></div></div>
                                        <div id="editorAddAnswer3" style="display: none; padding-top: 20px;" class="margin-bottom-20" data-rel="editor-add-asnwer">
                                            <div class="form-inline">
                                                <div class="form-group">
                                                    <label>Номер відповіді</label>
                                                    <input type="number" min="0" class="form-control">
                                                </div>
                                                <div class="checkbox">
                                                    <label>
                                                        <input type="radio" checked="checked" name="side-add" data-side="left"> Зліва
                                                    </label>
                                                </div>
                                                <div class="checkbox">
                                                    <label>
                                                        <input type="radio" name="side-add" data-side="right"> Зправа
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div id="editorAddAnswer6-7" style="display: none; padding-top: 20px;" class="margin-bottom-20" data-rel="editor-add-asnwer">
                                            <textarea style="min-width: 100%; max-width: 100%;" class="form-control"></textarea>
                                            <a href="http://sharpdev.ru/Regex/Sharp" target="_blank">Онлайн тестер регулярних виразів</a>
                                        </div>
                                        <div></div>
                                        <button type="button" id="btnAddAnswer" class="btn btn-primary">Додати відповідь</button>
                                    </div>
                                </div>
                            </div>
                            <hr/>
                            
                            <div style="display: none" class="panel panel-default" id="panelEditAnswer">
                                <div class="panel-heading" role="tab">
                                    <h4 class="panel-title">
                                        <a role="button" data-toggle="collapse" href="#collapseEditAnswer" aria-expanded="true" aria-controls="collapseEditAnswer">
                                            Редагувати відповідь
                                        </a>
                                    </h4>
                                </div>
                                <div id="collapseEditAnswer" class="panel-collapse collapse in" role="tabpanel">
                                    <div class="panel-body">
                                        <div id="editorEditAnswerContainer">
                                            <div id="editorEditAnswer" class="margin-bottom-20"></div>
                                        </div>
                                        <div id="editorEditAnswer3" style="display: none; padding-top: 20px;" class="margin-bottom-20" data-rel="editor-add-asnwer">
                                            <div class="form-inline">
                                                <div class="form-group">
                                                    <label>Номер відповіді</label>
                                                    <input type="number" min="0" class="form-control">
                                                </div>
                                                <div class="checkbox">
                                                    <label>
                                                        <input type="radio" checked="checked" name="side-edit" data-side="left"> Зліва
                                                    </label>
                                                </div>
                                                <div class="checkbox">
                                                    <label>
                                                        <input type="radio" name="side-edit" data-side="right"> Зправа
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div id="editorEditAnswer6-7" style="display: none; padding-top: 20px;" class="margin-bottom-20">
                                            <textarea style="min-width: 100%; max-width: 100%;" class="form-control"></textarea>
                                            <a href="http://sharpdev.ru/Regex/Sharp" target="_blank">Онлайн тестер регулярних виразів</a>
                                        </div>
                                        <button type="button" id="btnEditCancelAnswer" class="btn btn-default">Відміна</button>
                                        <button type="button" id="btnSaveEditAnswer" class="btn btn-primary">Редагувати відповідь</button>
                                    </div>
                                </div>
                            </div>
                            
                            <table id="tblAddedAnswers_Type1" data-rel="answerTypes" class="table table-bordered">

                            </table>

                            <table id="tblAddedAnswers_Type2" data-rel="answerTypes" class="table table-bordered" style="display: none;">
<%--                                <tr>--%>
<%--                                    <td style="width: 20px">--%>
<%--                                        <input type="checkbox" data-rel="right-answer">--%>
<%--                                    </td>--%>
<%--                                    <td><input style="border: none;" type="text"/></td>--%>
<%--                                    <td style="width: 20px">--%>
<%--                                        <a href="#" rel="up-answer">--%>
<%--                                            <span class="glyphicon glyphicon-chevron-up"></span></a>--%>
<%--                                    </td>--%>
<%--                                    <td style="width: 20px">--%>
<%--                                        <a href="#" rel="down-answer">--%>
<%--                                            <span class="glyphicon glyphicon-chevron-down"></span></a>--%>
<%--                                    </td>--%>
<%--                                    <td style="width: 20px">--%>
<%--                                        <a href="#" rel="edit-answer">--%>
<%--                                            <span class="glyphicon glyphicon-pencil"></span></a>--%>
<%--                                    </td>--%>
<%--                                    <td style="width: 20px">--%>
<%--                                        <a href="#" rel="remove-answer">--%>
<%--                                            <span class="glyphicon glyphicon-remove-sign"></span></a>--%>
<%--                                    </td>--%>
<%--                                </tr>--%>
                            </table>
                            
                            <div id="tblAddedAnswers_Type3" data-rel="answerTypes" class="row" style="display: none;">
                                <div class="col-xs-6">
                                    <table class="table table-bordered" data-rel="left">
<%--                                        <tr>--%>
<%--                                            <td style="width: 80px">--%>
<%--                                                <input style="border: none; width: 100%" type="number">--%>
<%--                                            </td>--%>
<%--                                            <td></td>--%>
<%--                                            <td style="width: 20px">--%>
<%--                                                <a href="#" rel="up-answer">--%>
<%--                                                    <span class="glyphicon glyphicon-chevron-up"></span></a>--%>
<%--                                            </td>--%>
<%--                                            <td style="width: 20px">--%>
<%--                                                <a href="#" rel="down-answer">--%>
<%--                                                    <span class="glyphicon glyphicon-chevron-down"></span></a>--%>
<%--                                            </td>--%>
<%--                                            <td style="width: 20px">--%>
<%--                                                <a href="#" rel="edit-answer">--%>
<%--                                                    <span class="glyphicon glyphicon-pencil"></span></a>--%>
<%--                                            </td>--%>
<%--                                            <td style="width: 20px">--%>
<%--                                                <a href="#" rel="remove-answer">--%>
<%--                                                    <span class="glyphicon glyphicon-remove-sign"></span></a>--%>
<%--                                            </td>--%>
<%--                                        </tr>--%>
                                    </table>
                                </div>
                                <div class="col-xs-6">
                                    <table class="table table-bordered col-xs-6" data-rel="right">
<%--                                        <tr>--%>
<%--                                            <td style="width: 80px">--%>
<%--                                                <input style="border: none; width: 100%" type="number">--%>
<%--                                            </td>--%>
<%--                                            <td><input style="border: none; width: 100%" type="text"/></td>--%>
<%--                                            <td style="width: 20px">--%>
<%--                                                <a href="#" rel="up-answer">--%>
<%--                                                    <span class="glyphicon glyphicon-chevron-up"></span></a>--%>
<%--                                            </td>--%>
<%--                                            <td style="width: 20px">--%>
<%--                                                <a href="#" rel="down-answer">--%>
<%--                                                    <span class="glyphicon glyphicon-chevron-down"></span></a>--%>
<%--                                            </td>--%>
<%--                                            <td style="width: 20px">--%>
<%--                                                <a href="#" rel="edit-answer">--%>
<%--                                                    <span class="glyphicon glyphicon-pencil"></span></a>--%>
<%--                                            </td>--%>
<%--                                            <td style="width: 20px">--%>
<%--                                                <a href="#" rel="remove-answer">--%>
<%--                                                    <span class="glyphicon glyphicon-remove-sign"></span></a>--%>
<%--                                            </td>--%>
<%--                                        </tr>--%>
                                    </table>
                                </div>
                            </div>
                            
                            <table id="tblAddedAnswers_Type4" data-rel="answerTypes" class="table table-bordered" style="display: none;">
<%--                                <tr>--%>
<%--                                    <td style="width: 50px"></td>--%>
<%--                                    <td></td>--%>
<%--                                    <td style="width: 20px">--%>
<%--                                        <a href="#" rel="up-answer">--%>
<%--                                            <span class="glyphicon glyphicon-chevron-up"></span></a>--%>
<%--                                    </td>--%>
<%--                                    <td style="width: 20px">--%>
<%--                                        <a href="#" rel="down-answer">--%>
<%--                                            <span class="glyphicon glyphicon-chevron-down"></span></a>--%>
<%--                                    </td>--%>
<%--                                    <td style="width: 20px">--%>
<%--                                        <a href="#" rel="edit-answer">--%>
<%--                                            <span class="glyphicon glyphicon-pencil"></span></a>--%>
<%--                                    </td>--%>
<%--                                    <td style="width: 20px">--%>
<%--                                        <a href="#" rel="remove-answer">--%>
<%--                                            <span class="glyphicon glyphicon-remove-sign"></span></a>--%>
<%--                                    </td>--%>
<%--                                </tr>--%>
                            </table>
                            
                            <table id="tblAddedAnswers_Type6-10" data-rel="answerTypes" class="table table-bordered" style="display: none;">
<%--                                <tr>--%>
<%--                                    <td></td>--%>
<%--                                    <td style="width: 20px">--%>
<%--                                        <a href="#" rel="up-answer">--%>
<%--                                            <span class="glyphicon glyphicon-chevron-up"></span></a>--%>
<%--                                    </td>--%>
<%--                                    <td style="width: 20px">--%>
<%--                                        <a href="#" rel="down-answer">--%>
<%--                                            <span class="glyphicon glyphicon-chevron-down"></span></a>--%>
<%--                                    </td>--%>
<%--                                    <td style="width: 20px">--%>
<%--                                        <a href="#" rel="edit-answer">--%>
<%--                                            <span class="glyphicon glyphicon-pencil"></span></a>--%>
<%--                                    </td>--%>
<%--                                    <td style="width: 20px">--%>
<%--                                        <a href="#" rel="remove-answer">--%>
<%--                                            <span class="glyphicon glyphicon-remove-sign"></span></a>--%>
<%--                                    </td>--%>
<%--                                </tr>--%>
                            </table>
                            
<%--                            <div id="tblAddedAnswers_Type5" data-rel="answerTypes" class="margin-bottom-20" style="display: none;">--%>
<%--                                <input class="form-control" style="width: 100%" type="text" data-rel="right-answer">--%>
<%--                            </div>--%>
                           
<%--                            <div id="tblAddedAnswers_Type6" data-rel="answerTypes" class="margin-bottom-20" style="display: none;">--%>
<%--                                <input class="form-control" style="width: 100%" type="text" data-rel="right-answer">--%>
<%--                                <a href="http://sharpdev.ru/Regex/Sharp" target="_blank">Онлайн тестер регулярних виразів</a>--%>
<%--                            </div>--%>
                           
<%--                            <div id="tblAddedAnswers_Type7-10" data-rel="answerTypes" class="margin-bottom-20" style="display: none;">--%>
<%--                                <textarea class="form-control" style="min-width: 100%; max-width: 100%"></textarea>--%>
<%--                            </div>--%>
                            
                            <div style="display: none">
                                <div class="row">
                                    <div class="col-md-3">
                                        Формат відповіді
                                    </div>
                                    <div class="col-xs-3">
                                        <label>
                                            <input type="radio" name="format" id="checkTextFormat"> Текстовий формат
                                        </label>
                                    </div>
                                    <div class="col-xs-3">
                                        <label>
                                            <input type="radio" name="format" id="checkNumFormat"> Числовий формат
                                        </label>
                                    </div>
                                </div>
                                <div id="divAdditionalRadio">
                                    <div class="row">
                                        <div class="col-xs-3">
                                            Об’єм відповіді
                                        </div>
                                        <div class="col-xs-3">
                                            <label>
                                                <input type="radio" name="line-count" id="checkOneLine"> Одна строка
                                            </label>
                                        </div>
                                        <div class="col-xs-3">
                                            <label>
                                                <input type="radio" name="line-count" id="checkMultipleLines"> Декілька строк
                                            </label>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-xs-3">
                                            Метод перевірки
                                        </div>
                                        <div class="col-xs-3">
                                            <label>
                                                <input type="radio" name="method" id="checkByMask"> За маскою
                                            </label>
                                        </div>
                                        <div class="col-xs-3">
                                            <label>
                                                <input type="radio" name="method" id="checkByEditDistance"> За редакційною відстанню
                                            </label>
                                        </div>
                                        <div class="col-xs-3">
                                            <label>
                                                <input type="radio" name="method" id="checkWithoutCheck"> Без перевірки
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <hr />
                            <div class="margin-bottom-20">
                                <label>
                                    <input type="checkbox" id="checkAdditional"> Додатково
                                </label>
                                <div id="divAdditional" style="display: none" class="margin-bottom-20">
                                    <hr/>
                                    <h3>Підказка</h3>
                                    <div id="editorHint"></div>
                                    <hr/>
                                    <h3>Пояснення</h3>
                                    <div id="editorExpenation"></div>
                                </div>
                            </div>
                            
                            <button type="button" class="btn btn-default" id="btnCancelTask">Відміна</button>
                            <button type="button" class="btn btn-primary" id="btnSaveTask">Додати</button>
                            <button type="button" class="btn btn-primary" id="btnSaveChanges" style="display: none">Зберегти зміни</button>

                        </div>
                        
                    </div>
                </div>
            </div>


        </div>

        <div role="tabpanel" class="tab-pane" id="tab2">
            <button id="btnShowTests" type="button" class="btn btn-success">Тести</button>
            <button id="btnShowMembers" type="button" class="btn btn-default">Учасники</button>
            <hr />
            
            <!-- Тести -->
            <div id="divShowTests">
                <div class="margin-bottom-20">
                    <button class="btn btn-primary" type="button" id="btnAddTest">Додати тест</button>
                </div>

                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th class="col-md-4">Назва</th>
                            <th>Опис</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <div id="testTree"></div>
                            </td>
                            <td>
                                <div id="tdTestSummery"></div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                
                <!-- Створення тесту -->
                <div class="panel panel-default" id="panelTest">
                    <div class="panel-heading" role="tab">
                        <h4 class="panel-title">
                            <a role="button" data-toggle="collapse" href="#collapseTest" aria-expanded="true" aria-controls="collapseTest">
                                Тест
                            </a>
                        </h4>
                    </div>
                    <div id="collapseTest" class="panel-collapse collapse in" role="tabpanel">
                        <div class="panel-body">
                            
                            <h4>Загальне</h4>
                            <div class="form-horizontal">
                                <div class="form-group">
                                    <label for="selectTestType" class="col-sm-4 control-label">Тип Тесту</label>
                                    <div class="col-sm-8">
                                        <select id="selectTestType" class="form-control">
                                            <option value="">test</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="textTestName" class="col-sm-4 control-label">Назва</label>
                                    <div class="col-sm-8">
                                        <input type="text" class="form-control" id="textTestName">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="textTestDescr" class="col-sm-4 control-label">Опис</label>
                                    <div class="col-sm-8">
                                        <input type="text" class="form-control" id="textTestDescr">
                                    </div>
                                </div>
                            </div>
                            
                            <h3>Повідомлення учаснику</h3>
                            <div id="editorTest"></div>
                            <hr/>
                            
                            <!-- Список питань -->
                            <div class="panel panel-default">
                                <div class="panel-heading" role="tab">
                                    <h4 class="panel-title">
                                        <a role="button" data-toggle="collapse" href="#collapseMemberList" aria-expanded="true" aria-controls="collapseMemberList">
                                            Список питань
                                        </a>
                                    </h4>
                                </div>
                                <div id="collapseMemberList" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingOne">
                                    <div class="panel-body">
                                        
                                        <div id="questionTree" class="margin-bottom-20"></div>

                                        <div class="form-horizontal">
                                            <div class="form-group">
                                                <label for="numTaskCount" class="col-sm-4 control-label">Максимальна кількість питань у тесті</label>
                                                <div class="col-sm-8">
                                                    <input id="numTaskCount" class="form-control" type="number" min="1" max="150" value="1" />
                                                </div>
                                            </div>
                                            <div class="checkbox">
                                                <label>
                                                    <input id="checkMixAnswersInTest" type="checkbox"> Check me out
                                                </label>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            
                            <!-- TODO: додати випдаюче вікно -->
                            <!-- Список учасників -->
                            <div class="margin-bottom-20">
                                <button class="btn btn-primary" type="button" id="btnAddMemebersToTest">Додати список учасників</button>
                            </div>

                            <table class="table table-bordered">
                                <thead>
                                <tr>
                                    <th class="col-md-4">Назва</th>
                                    <th>Опис</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>
                                        <div data-rel="memberTree"></div>
                                    </td>
                                    <td>
                                        <div data-rel="tdMemberSummery"></div>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                            
                            <!-- Режим тестування -->
                            <h3>Режим тестування</h3>
                            <div class="form-inline">
                                <div class="form-group">
                                    <label>Час тестування</label>
                                </div>
                                <div class="checkbox">
                                    <label>
                                        <input type="radio" name="testTime" value="false"> Фіксований
                                    </label>
                                </div>
                                <div class="checkbox">
                                    <label>
                                        <input type="radio" name="testTime" value="true"> За складністтю питань
                                    </label>
                                </div>
                            </div>

                            <div class="form-horizontal">
                                <div class="form-group">
                                    <label for="numMaxTime" class="col-sm-4 control-label">Максимальний час тестування</label>
                                    <div class="col-sm-8">
                                        <input id="numMaxTime" class="form-control" type="number" min="1" max="300" value="1" />
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="selectInterestPoints" class="col-sm-4 control-label">Нарахування балів</label>
                                    <div class="col-sm-8">
                                        <select class="form-control" id="selectInterestPoints">
                                            <option value="0">Строге</option>
                                            <option value="1">Нестроге</option>
                                            <option value="2">Строге (для невірних відповідей)</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="selectShowPoints" class="col-sm-4 control-label">Відображати кількість балів за завдання</label>
                                    <div class="col-sm-8">
                                        <select class="form-control" id="selectShowPoints">
                                            <option value="0">Відображати</option>
                                            <option value="1">Не відображати</option>
                                            <option value="2">Відображати після вірної відповіді</option>
                                            <option value="3">Відображати після невірної відповіді</option>
                                            <option value="4">Відображати після відповіді</option>
                                            <option value="5">Відображати після завершення тестування для вірних відповідей</option>
                                            <option value="6">Відображати після завершення тестування для невірних відповідей</option>
                                            <option value="7">Відображати після завершення тестування</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="selectShowAnswerStatus" class="col-sm-4 control-label">Відображати вірну відповідь</label>
                                    <div class="col-sm-8">
                                        <select class="form-control" id="selectShowAnswerStatus">
                                            <option value="0">Відображати</option>
                                            <option value="1">Не відображати</option>
                                            <option value="2">Відображати після вірної відповіді</option>
                                            <option value="3">Відображати після невірної відповіді</option>
                                            <option value="4">Відображати після відповіді</option>
                                            <option value="5">Відображати після завершення тестування для вірних відповідей</option>
                                            <option value="6">Відображати після завершення тестування для невірних відповідей</option>
                                            <option value="7">Відображати після завершення тестування</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="selectShowHint" class="col-sm-4 control-label">Відображати підказки</label>
                                    <div class="col-sm-8">
                                        <select class="form-control" id="selectShowHint">
                                            <option value="0">Відображати</option>
                                            <option value="1">Не відображати</option>
                                            <option value="2">Відображати після вірної відповіді</option>
                                            <option value="3">Відображати після невірної відповіді</option>
                                            <option value="4">Відображати після відповіді</option>
                                            <option value="5">Відображати після завершення тестування для вірних відповідей</option>
                                            <option value="6">Відображати після завершення тестування для невірних відповідей</option>
                                            <option value="7">Відображати після завершення тестування</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="selectShowExplanation" class="col-sm-4 control-label">Відображати пояснення</label>
                                    <div class="col-sm-8">
                                        <select class="form-control" id="selectShowExplanation">
                                            <option value="0">Відображати</option>
                                            <option value="1">Не відображати</option>
                                            <option value="2">Відображати після вірної відповіді</option>
                                            <option value="3">Відображати після невірної відповіді</option>
                                            <option value="4">Відображати після відповіді</option>
                                            <option value="5">Відображати після завершення тестування для вірних відповідей</option>
                                            <option value="6">Відображати після завершення тестування для невірних відповідей</option>
                                            <option value="7">Відображати після завершення тестування</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            
                            <h3>Результат тестування</h3>
                            <div class="form-horizontal">
                                <div class="form-group">
                                    <label for="numMaxMark" class="col-sm-4 control-label">Оцінка за тест</label>
                                    <div class="col-sm-8">
                                        <input id="numMaxMark" class="form-control" type="number" min="1" max="300" value="1" />
                                    </div>
                                </div>
                            </div>
                            
                            <div class="checkbox">
                                <label>
                                    <input id="checkShowMarkForTest" type="checkbox"> Відображати оцінку за тест
                                </label>
                            </div>
                            <div class="checkbox">
                                <label>
                                    <input id="showPointSum" type="checkbox"> Відображати сумму балів
                                </label>
                            </div>
                            <div class="checkbox">
                                <label>
                                    <input id="checkShowCountOfRightAnswers" type="checkbox"> Відображати кількість вірних відповідей
                                </label>
                            </div>
                            <div class="checkbox">
                                <label>
                                    <input id="checkAllowWatchTestBlank" type="checkbox"> Дозволити перегляд тестового бланку
                                </label>
                            </div>
                            
                            <h3>Доступність тесту</h3>
                            <div class="form-horizontal">
                                <div class="form-group">
                                    <label for="textAccessDateBegin" class="col-sm-4 control-label">Доступно з</label>
                                    <div class="col-sm-8">
                                        <input id="textAccessDateBegin" class="form-control" type="text" placeholder="дд-мм-рррр гг-хх" />
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="textAccessDateEnd" class="col-sm-4 control-label">Доступно до</label>
                                    <div class="col-sm-8">
                                        <input id="textAccessDateEnd" class="form-control" type="text" placeholder="дд-мм-рррр гг-хх" />
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="textAttemptsCount" class="col-sm-4 control-label">Кількість спроб</label>
                                    <div class="col-sm-8">
                                        <input id="textAttemptsCount" value="3" class="form-control" type="number" min="1" max="100" />
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="textAttemptsMinPeriod" class="col-sm-4 control-label">Мінімальний час між спробами</label>
                                    <div class="col-sm-8">
                                        <input id="textAttemptsMinPeriod" value="1" class="form-control" type="number" min="1" max="100" />
                                    </div>
                                </div>
                            </div>
                            
                            <div class="checkbox">
                                <label>
                                    <input id="checkBlockTest" type="checkbox"> Дозволити перегляд тестового бланку
                                </label>
                            </div>
                            
                            <button type="button" class="btn btn-default" data-dismiss="modal">Відміна</button>
                            <button data-rel="save" type="button" class="btn btn-primary">Зберегти</button>

                        </div>
                    </div>
                </div>
                
            </div>
            
            <!-- Учасники -->
            <div id="divShowMembers" style="display: none;">
                <div class="margin-bottom-20">
                    <button id="btnCreateMemberList" class="btn btn-primary">Створити список учасників</button>
                </div>
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th class="col-md-4">Назва</th>
                            <th>Опис</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <div id="memberTree"></div>
                            </td>
                            <td>
                                <div id="tdMemberSummery"></div>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div class="panel panel-default">
                    <div class="panel-heading" role="tab">
                        <h4 class="panel-title">
                            <a role="button" data-toggle="collapse" href="#collapseMemeberList" aria-expanded="true" aria-controls="collapseMemeberList">
                                Список учасників
                            </a>
                        </h4>
                    </div>
                    <div id="collapseMemeberList" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingOne">
                        <div class="panel-body">
                            <div class="form-horizontal">
                                <div class="form-group">
                                    <label for="textTaskName" class="col-sm-4 control-label">Назва</label>
                                    <div class="col-sm-8">
                                        <input type="text" class="form-control" data-rel="textMemeberListName" placeholder="Назва завдання">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="textTaskName" class="col-sm-4 control-label">Опис</label>
                                    <div class="col-sm-8">
                                        <input type="text" class="form-control" data-rel="textMemberListSummery" placeholder="Назва завдання">
                                    </div>
                                </div>
                            </div>
                            
                            <div class="row">
                                <div class="col-xs-6">
                                    <table data-rel="tblStudents" class="table table-bordered">
                                        <tr>
                                            <td>test student</td>
                                        </tr>
                                        <tr>
                                            <td><span class="glyphicon glyphicon-plus"></span></td>
                                        </tr>
                                    </table>
                                </div>
                                <div class="col-xs-6">
                                    <table data-rel="tblGroups" class="table table-bordered">
                                        <tr>
                                            <td>test group</td>
                                        </tr>
                                        <tr>
                                            <td><a href><span class="glyphicon glyphicon-plus"></span></a></td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                            
                            <button type="button" class="btn btn-default" data-dismiss="modal">Відміна</button>
                            <button type="button" class="btn btn-primary">Зберегти</button>

                        </div>
                    </div>
                </div>

            </div>

        </div>
    </div>

<div class="modal fade" id="modalError">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Modal title</h4>
            </div>
            <div class="modal-body">
                <span class="label label-danger" id="pError"></span>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">OK</button>
            </div>
        </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
</div><!-- /.modal -->

<div class="modal fade">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Modal title</h4>
            </div>
            <div class="modal-body">
                <input type="text" placeholder="Назва папки" class="form-control" value="" />
                <input type="text" placeholder="Опис" class="form-control" value="" />
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Відміна</button>
                <button type="button" class="btn btn-primary" id="btnAddDirOk">Додати</button>
            </div>
        </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
</div><!-- /.modal -->
    
    <script>
        function SetContent(tinyMCEId) {
            
        }
    </script>

    <script src="../../Scripts/mads/mads.js"></script>
    <script src="../../Scripts/jstree.js"></script>
<%--    <script src="../../Scripts/jquery.jstree.js"></script>--%>
    <script src="../../Scripts/tinymce/tinymce.min.js"></script>
    <script src="../../Scripts/tinymce/jquery.tinymce.min.js"></script>
</asp:Content>
