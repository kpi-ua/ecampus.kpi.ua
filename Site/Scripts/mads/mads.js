$(document).ready(function () {

    var apiEndpoint = $("#ApiEndpoint").text() + "MADS",
        sessionId = $("#CampusSessionId").val();

    var exerciseId;

    /**
     * Common
     */
    function shuffle(o) {
        if (!o) return null;
        for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    }

    var showError = function (message) {
        $("#pError").text(message);
        $("#modalError").modal("show");
        return false;
    };
    $("body").on("click", ".rowUp", function (e) {
        e.preventDefault();
        var typeId = $("#selectTaskType").find("option:selected").val();
        var tr = $(this).closest("tr");
        var table = tr.closest("table");
        var index = tr.index();
        if (index === 0) return;
        var newTr = $.extend({}, tr);
        if (typeId === "4") {
            newTr.find("td").eq(0).text(index);
            table.find("tr td").eq(0).text(index + 1);
        }
        tr.remove();
        table.find("tr").eq(index - 1).before(newTr);
    });

    $("body").on("click", ".rowDown", function (e) {
        e.preventDefault();
        var tr = $(this).closest("tr");
        var typeId = $("#selectTaskType").find("option:selected").val();
        var table = tr.closest("table");
        var index = tr.index();
        if (index === table.find("tr").length - 1) return;
        var newTr = $.extend({}, tr);
        if (typeId === "4") {
            newTr.find("td").eq(0).text(index + 2);
            table.find("tr td").eq(0).text(index + 1);
        }
        tr.remove();
        table.find("tr").eq(index).after(newTr);
    });

    $('body').on('click', '.rowRemove', function (e) {
        e.preventDefault();
        $(this).closest('tr').remove();
    });

    var pathTreeFolders;
    var currentFolerId;

    /**
     * Tree
     */
    function loadPathTree(selectedId) {
        $.get(apiEndpoint + "/GetFolderTree", {
            sessionId: sessionId
        }, function (res) {
            $("#pathTree").remove();
            $("#pathTreeContainer").html("<div id='pathTree'></div>");
            
            var fs = res.Data.Folders;
            var nodes = [{ id: 1, text: "root" }];
            pathTreeFolders = [];
            for (var i = 0; i < fs.length; i++) {
                var f = {};
                f.id = fs[i].Folder.Id;
                f.text = fs[i].Folder.Name;
                f.parent = fs[i].Folder.ParentId;
                f.description = fs[i].Folder.Description;
                f.type = "folder";
                pathTreeFolders[f.id] = f;
                nodes.push(f);
            }

            console.log(res.Data);
            $("#pathTree").jstree({
                core: {
                    data: nodes
                }
            }).bind("select_node.jstree", function (evt, data) {
                var i = data.selected;
                currentFolerId = i;
                $("#tdFilePath").text(pathTreeFolders[i].description);
            });
        });
    }

    loadPathTree();

    $("#btnAddDir").click(function() {
        loadPathTree();
    });

    $("#btnAddDirOk").click(function () {
        
        loadPathTree();
    });

    $("#pathTree").jstree({
        
    });
    

    var $memberTree = $("div[data-rel='memberTree']").jstree({
        core: {
            'data': [
                {
                    "text": "Root node", "children": [
                      { "text": "Child node 1" },
                      { "text": "Child node 2" }
                    ]
                }
            ]
        }
    });

    $("btn").on("select_node.jstree", function (event, node) {
        var currentNode = $(this).jstree("get_selected");
        $(this).jstree("create_node", currentNode, value, "last");
    });

    
    var editorTask = tinymce.init({ selector: "#editorTask" });
    var editorHint = tinymce.init({ selector: "#editorHint" });
    var editorExpenation = tinymce.init({ selector: "#editorExpenation" });
    var editorTest = tinymce.init({ selector: "#editorTest" });
    var editorMember = tinymce.init({ selector: "div[data-rel='editorMember']" });
    var editorAddAnswer = tinymce.init({ selector: "#editorAddAnswer" });
    var editorEditAnswer = tinymce.init({ selector: "#editorEditAnswer" });

    /**
     * Tasks
     */
    function showEditor(typeId) {
        $('table[data-rel="editor-add-asnwer"], div[data-rel="editor-add-asnwer"]').hide();
        $("#editorAddAnswerContainer").show();
        switch (typeId) {
            case "3":
                $("#editorAddAnswer3").show();
                break;
            case "6":
            case "7":
                $("#editorAddAnswerContainer").hide();
                $("#editorAddAnswer6-7").show();
        }
    }

    function checkAnswerType(typeId, editMode) {
        var editorId = editMode ? "editorEditAnswer" : "editorAddAnswer";
        
        switch (typeId) {
            case "3":
                var number = $("#editorAddAnswer3").find("input[type='number']").val();
                if (!number) return showError("Введить номер відповіді");
                break;
            case "6":
            case "7":
                var text = $("#editorAddAnswer6-7").find("textarea").val();
                if (!text) return showError("Введить регуялрний вираз");
                return true;
        }
        if (tinyMCE.get(editorId).getContent() === "") return showError("Введіть відповідь");
        return true;
    }

    $("#btnAddTask").click(function () {
        var typeId = $("#selectTaskType").find("option:selected").val();
        $("#panelTask").show(200);
        showEditor(typeId);
    });

    $("#btnCancelTask").click(function () {
        $(this).closest(".panel").hide(200);
    });

    $("#selectTaskType").change(function () {
        var typeId = $(this).find("option:selected").val();
        $("div[data-rel='answerTypes'], table[data-rel='answerTypes']").hide();
        $("#tblAddedAnswers_Type" + typeId).show(200);
        if (Number(typeId) >= 6 && Number(typeId) <=10)
            $("#tblAddedAnswers_Type6-10").find("tr").remove();
        if (Number(typeId) >= 6 && Number(typeId) <= 10)
            $("#tblAddedAnswers_Type6-10").show(200);
        showEditor(typeId);
    });

    $("#checkAdditional").click(function() {
        $(this).prop("checked") ? $("#divAdditional").show(200) : $("#divAdditional").hide(200);
    });

    function add3() {
        table = $("input[name='side-add']:checked").attr("data-side") === "right"
                   ? $("#tblAddedAnswers_Type3 table[data-rel='right']")
                   : $("#tblAddedAnswers_Type3 table[data-rel='left']");
        html = '<tr>' +
                '<td style="width: 80px">' + $("#editorAddAnswer3  input[type='number']").val() + '</td>' +
                '<td>' + tinyMCE.get("editorAddAnswer").getContent() + '</td>' +
                '<td style="width: 20px">' +
                '<a href="#" rel="up-answer" class="rowUp">' +
                '<span class="glyphicon glyphicon-chevron-up"></span></a>' +
                '</td>' +
                '<td style="width: 20px">' +
                '<a href="#" rel="down-answer" class="rowDown">' +
                '<span class="glyphicon glyphicon-chevron-down"></span></a>' +
                '</td>' +
                '<td style="width: 20px">' +
                '<a href="#" rel="edit-answer" class="rowEdit">' +
                '<span class="glyphicon glyphicon-pencil"></span></a>' +
                '</td>' +
                '<td style="width: 20px">' +
                '<a href="#" rel="remove-answer" class="rowRemove">' +
                '<span class="glyphicon glyphicon-remove-sign"></span></a>' +
                '</td>' +
                '</tr>';
        table.append(html);
    }

    function addEdit3() {
        table = $("input[name='side-edit']:checked").attr("data-side") === "right"
                   ? $("#tblAddedAnswers_Type3 table[data-rel='right']")
                   : $("#tblAddedAnswers_Type3 table[data-rel='left']");
        html = '<tr>' +
                '<td style="width: 80px">' + $("#editorEditAnswer3  input[type='number']").val() + '</td>' +
                '<td>' + tinyMCE.get("editorEditAnswer").getContent() + '</td>' +
                '<td style="width: 20px">' +
                '<a href="#" rel="up-answer" class="rowUp">' +
                '<span class="glyphicon glyphicon-chevron-up"></span></a>' +
                '</td>' +
                '<td style="width: 20px">' +
                '<a href="#" rel="down-answer" class="rowDown">' +
                '<span class="glyphicon glyphicon-chevron-down"></span></a>' +
                '</td>' +
                '<td style="width: 20px">' +
                '<a href="#" rel="edit-answer" class="rowEdit">' +
                '<span class="glyphicon glyphicon-pencil"></span></a>' +
                '</td>' +
                '<td style="width: 20px">' +
                '<a href="#" rel="remove-answer" class="rowRemove">' +
                '<span class="glyphicon glyphicon-remove-sign"></span></a>' +
                '</td>' +
                '</tr>';
        table.append(html);
    }

    $("#btnAddAnswer").click(function () {
        var typeId = $("#selectTaskType").find("option:selected").val();
        if (!checkAnswerType(typeId)) return;
//        var text = $("#textAddAnswer").val();
        var html;
        var table;
        switch (typeId) {
            case "1":
                table = $("#tblAddedAnswers_Type1");
                html =  '<tr>' +
                        '<td style="width: 20px">' +
                        '<input type="radio" checked="checked" name="type1-correct-answer">' +
                        '</td>' +
                        '<td>' + tinyMCE.get("editorAddAnswer").getContent() + '</td>' +
                        '<td style="width: 20px">' +
                        '<a href="#" rel="up-answer" class="rowUp">' +
                        '<span class="glyphicon glyphicon-chevron-up"></span></a>' +
                        '</td>' +
                        '<td style="width: 20px">' +
                        '<a href="#" rel="down-answer" class="rowDown">' +
                        '<span class="glyphicon glyphicon-chevron-down"></span></a>' +
                        '</td>' +
                        '<td style="width: 20px">' +
                        '<a href="#" rel="edit-answer" class="rowEdit">' +
                        '<span class="glyphicon glyphicon-pencil"></span></a>' +
                        '</td>' +
                        '<td style="width: 20px">' +
                        '<a href="#" rel="remove-answer" class="rowRemove">' +
                        '<span class="glyphicon glyphicon-remove-sign"></span></a>' +
                        '</td>' +
                        '</tr>';
                table.append(html);
                break;
            case "2":
                table = $("#tblAddedAnswers_Type2");
                html =  '<tr>' +
                        '<td style="width: 20px">' +
                        '<input type="checkbox">' +
                        '</td>' +
                        '<td>' + tinyMCE.get("editorAddAnswer").getContent() + '</td>' +
                        '<td style="width: 20px">' +
                        '<a href="#" rel="up-answer" class="rowUp">' +
                        '<span class="glyphicon glyphicon-chevron-up"></span></a>' +
                        '</td>' +
                        '<td style="width: 20px">' +
                        '<a href="#" rel="down-answer" class="rowDown">' +
                        '<span class="glyphicon glyphicon-chevron-down"></span></a>' +
                        '</td>' +
                        '<td style="width: 20px">' +
                        '<a href="#" rel="edit-answer" class="rowEdit">' +
                        '<span class="glyphicon glyphicon-pencil"></span></a>' +
                        '</td>' +
                        '<td style="width: 20px">' +
                        '<a href="#" rel="remove-answer" class="rowRemove">' +
                        '<span class="glyphicon glyphicon-remove-sign"></span></a>' +
                        '</td>' +
                        '</tr>';
                table.append(html);
                break;
            case "3":
                add3();
                break;
            case "4":
                table = $("#tblAddedAnswers_Type4");
                html = '<tr>' +
                        '<td style="width: 50px">' + (table.find("tr").length + 1) + '</td>' +
                        '<td>' + tinyMCE.get("editorAddAnswer").getContent() + '</td>' +
                        '<td style="width: 20px">' +
                        '<a href="#" rel="up-answer" class="rowUp">' +
                        '<span class="glyphicon glyphicon-chevron-up"></span></a>' +
                        '</td>' +
                        '<td style="width: 20px">' +
                        '<a href="#" rel="down-answer" class="rowDown">' +
                        '<span class="glyphicon glyphicon-chevron-down"></span></a>' +
                        '</td>' +
                        '<td style="width: 20px">' +
                        '<a href="#" rel="edit-answer" class="rowEdit">' +
                        '<span class="glyphicon glyphicon-pencil"></span></a>' +
                        '</td>' +
                        '<td style="width: 20px">' +
                        '<a href="#" rel="remove-answer" class="rowRemove">' +
                        '<span class="glyphicon glyphicon-remove-sign"></span></a>' +
                        '</td>' +
                        '</tr>';
                table.append(html);
                break;
            case "6":
            case "7":
                table = $("#tblAddedAnswers_Type6-10");
                html = '<tr>' +
                        '<td style="display: none"></td>' +
                        '<td>' + $("#editorAddAnswer6-7 textarea").val() + '</td>' +
                        '<td style="width: 20px">' +
                        '<a href="#" rel="up-answer" class="rowUp">' +
                        '<span class="glyphicon glyphicon-chevron-up"></span></a>' +
                        '</td>' +
                        '<td style="width: 20px">' +
                        '<a href="#" rel="down-answer" class="rowDown">' +
                        '<span class="glyphicon glyphicon-chevron-down"></span></a>' +
                        '</td>' +
                        '<td style="width: 20px">' +
                        '<a href="#" rel="edit-answer" class="rowEdit">' +
                        '<span class="glyphicon glyphicon-pencil"></span></a>' +
                        '</td>' +
                        '<td style="width: 20px">' +
                        '<a href="#" rel="remove-answer" class="rowRemove">' +
                        '<span class="glyphicon glyphicon-remove-sign"></span></a>' +
                        '</td>' +
                        '</tr>';
                table.append(html);
                break;
            case "8":
            case "9":
            case "10":
                table = $("#tblAddedAnswers_Type6-10");
                html = '<tr>' +
                        '<td style="display: none"></td>' +
                        '<td>' + tinyMCE.get("editorAddAnswer").getContent() + '</td>' +
                        '<td style="width: 20px">' +
                        '<a href="#" rel="up-answer" class="rowUp">' +
                        '<span class="glyphicon glyphicon-chevron-up"></span></a>' +
                        '</td>' +
                        '<td style="width: 20px">' +
                        '<a href="#" rel="down-answer" class="rowDown">' +
                        '<span class="glyphicon glyphicon-chevron-down"></span></a>' +
                        '</td>' +
                        '<td style="width: 20px">' +
                        '<a href="#" rel="edit-answer" class="rowEdit">' +
                        '<span class="glyphicon glyphicon-pencil"></span></a>' +
                        '</td>' +
                        '<td style="width: 20px">' +
                        '<a href="#" rel="remove-answer" class="rowRemove">' +
                        '<span class="glyphicon glyphicon-remove-sign"></span></a>' +
                        '</td>' +
                        '</tr>';
                table.append(html);
                break;
        }
        tinyMCE.get("editorAddAnswer").setContent("");
        $("#editorAddAnswer6-7 textarea").val("");
    });

    $("#btnSaveTask").click(function () {
        var typeId = $("#selectTaskType").find("option:selected").val();
        var data = {};

        data.sessionId =  sessionId;
        data.ExerciseCreateInfo = {};
        data.ExerciseCreateInfo.IsVisible = true;
        data.ExerciseCreateInfo.SimilarityNorm = $("#numSimilarityScore").val();
        data.ExerciseCreateInfo.TypeId = $("#selectTaskType option:selected").val();
        data.ExerciseCreateInfo.Name = $("#textTaskName").val();
        data.ExerciseCreateInfo.Difficulty = $("#numDifficulty").val();
        data.ExerciseCreateInfo.MarkPoints = $("#numPoints").val();
        data.ExerciseCreateInfo.Question = tinyMCE.get("editorTask").getContent();
        data.ExerciseCreateInfo.Hint = tinyMCE.get("editorHint").getContent();
        data.ExerciseCreateInfo.Explanation = tinyMCE.get("editorExpenation").getContent();
        data.ExerciseCreateInfo.IsAnswersMoving = $("checkMixAnswers").prop("checked");
        data.ExerciseCreateInfo.FolderId = currentFolerId;
//        data.ExerciseCreateInfo.Fields = {};

        data.ChoiseExercise = {};
        data.OrderExercise = {};
        data.MatchingExercise = {};
        data.CustomАnswerExercise = {};
        
        var index = 0;
        var fields = [];
        var success = true;
        switch (typeId) {
            case "1":
                $("#tblAddedAnswers_Type1 > tbody > tr").each(function () {
                    var field = {};
                    var answer = $(this).find("td").eq(1).text();
                    if (!answer) {
                        success = false;
                        return showError("В таблиці відповідей не всі поля заповнені");
                    }
                    field.Answer = answer;
                    field.CheckInfo = $(this).find("input[type='radio']").prop("checked") ? 0 : 1;
                    field.OrdinalNumber = index;
                    fields.push(field);
                    index++;
                    return true;
                });
                data.ChoiseExercise = {};
                data.ChoiseExercise.Answers = fields;
                break;
            case "2":
                $("#tblAddedAnswers_Type2 > tbody > tr").each(function () {
                    var field = {};
                    var answer = $(this).find("td").eq(1).text();
                    if (!answer) {
                        success = false;
                        return showError("В таблиці відповідей не всі поля заповнені");
                    }
                    field.Answer = answer;
                    field.CheckInfo = $(this).find("input[type='checkbox']").prop("checked") ? 0 : 1;
                    field.OrdinalNumber = index;
                    fields.push(field);
                    index++;
                    data.ChoiseExercise = {};
                    return true;
                });
                data.ChoiseExercise.Answers = fields;
                break;
            case "3":
                fields = {};
                fields.RightAnswers = [];
                fields.LeftAnswers = [];
                $("#tblAddedAnswers_Type3 table[data-rel='right'] > tbody > tr").each(function() {
                    var field = {};
                    var answer = $(this).find("td").eq(1).text();
                    if (!answer) {
                        success = false;
                        return showError("В таблиці відповідей не всі поля заповнені");
                    }
                    field.Answer = answer;
                    field.CheckInfo = $(this).find("td").eq(0).text();
                    field.OrdinalNumber = index;
                    fields.RightAnswers.push(field);
                    index++;
                });
                $("#tblAddedAnswers_Type3 table[data-rel='left'] > tbody > tr").each(function () {
                    var field = {};
                    var answer = $(this).find("td").eq(1).text();
                    if (!answer) {
                        success = false;
                        return showError("В таблиці відповідей не всі поля заповнені");
                    }
                    field.Answer = answer;
                    field.CheckInfo = $(this).find("td").eq(0).text();
                    field.OrdinalNumber = index;
                    fields.LeftAnswers.push(field);
                    index++;
                });
                data.MatchingExercise = fields;
                console.log(data);
                break;
            case "4":
                var indexes = [];
                var len = $("#tblAddedAnswers_Type4 tr").length;
                for (var i = 0; i < len; i++) indexes[i] = i;
                indexes = shuffle(indexes);
                $("#tblAddedAnswers_Type4 > tbody > tr").each(function () {
                    var field = {};
                    var answer = $(this).find("td").eq(1).text();
                    if (!answer) {
                        success = false;
                        return showError("В таблиці відповідей не всі поля заповнені");
                    }
                    field.Answer = answer;
                    field.CheckInfo = $(this).find("td").eq(0).text();;
                    field.OrdinalNumber = indexes[index];
                    fields.push(field);
                    index++;
                    return true;
                });
                data.OrderExercise.Answers = fields;
                break;
            case "6":
            case "7":
            case "8":
            case "9":
            case "10":
                for (var i = 0; i < len; i++) indexes[i] = i;
                indexes = shuffle(indexes);
                $("#tblAddedAnswers_Type4 > tbody > tr").each(function () {
                    var field = {};
                    var answer = $(this).find("td").eq(1).text();
                    if (!answer) {
                        success = false;
                        return showError("В таблиці відповідей не всі поля заповнені");
                    }
                    field.Answer = answer;
                    field.CheckInfo = $(this).find("td").eq(0).text();;
                    field.OrdinalNumber = index;
                    fields.push(field);
                    index++;
                    return true;
                });
                data.OrderExercise.Answers = fields;
                break;
        }

//        data.ExerciseCreateInfo.Fields.fields = [];
//        data.ExerciseCreateInfo.Fields.fields.Answers = fields;

        console.log("task data", data);

        if (!success) console.log("error");
        if (!success) return;

        $.post(apiEndpoint + "/CreateExercise", data, function(res) {
            console.log('res', res);
            if (!res.Data) {
                showError("Не вдалося створити завдання");
            } else {
                $("#panelTask").hide(200);
            }
        });
    });
    
    $("#btnCancelTask").click(function() {
        $("#panelTask").hide(200);
    });

    var clearTaskPanel = function() {
        
    };

    var tr;
    $("body").on("click", ".rowEdit", function (e) {
        e.preventDefault();
        var typeId = $("#selectTaskType").find("option:selected").val();
        $("#panelEditAnswer").show(200);
        tr = $(this).closest("tr");
        var text = tr.find("td").eq(1).text();
        tinyMCE.get("editorEditAnswer").setContent(text);

        switch (typeId) {
            case "3":
                $("#editorEditAnswer3 input[type='number']").val(tr.find("td").eq(0).text());
                $("#editorEditAnswer3").show();
                return;
            case "6":
            case "7":
                $("#editorEditAnswerContainer").hide();
                $("#editorEditAnswer6-7").show();
                $("#editorEditAnswer6-7 textarea").val(tr.find("td").eq(1).text());
        }

        
    });

    $("#btnEditCancelAnswer").click(function () {
        $("#panelEditAnswer").hide(200);
        $("#editorEditAnswer3").hide();
        $("#editorEditAnswerContainer").show();
        $("#editorEditAnswer6-7").hide();
    });

    $("#btnSaveEditAnswer").click(function () {
        $("#panelEditAnswer").hide(200);
        $("#editorEditAnswer3").hide();
        $("#editorEditAnswerContainer").show();
        $("#editorEditAnswer6-7").hide();
        var typeId = $("#selectTaskType").find("option:selected").val();
        switch (typeId) {
            case "3":
                tr.remove();
                addEdit3();
                $("#editorEditAnswer3").hide();
                return;
            case "6":
            case "7":
                tr.find("td").eq(1).text($("#editorEditAnswer6-7 textarea").val());
                return;
        }

        if (!tr) return;
        
        var text = tinyMCE.get("editorEditAnswer").getContent();
        tr.find("td").eq(1).html(text);
        
    });

    /**
     * Tests and members
     */
    $("#btnShowTests").click(function() {
        $("#btnShowTests").addClass("btn-success");
        $("#btnShowTests").removeClass("btn-default");
        $("#btnShowMembers").addClass("btn-default");
        $("#btnShowMembers").removeClass("btn-success");
        $("#divShowTests").show(200);
        $("#divShowMembers").hide(200);
    });

    $("#btnShowMembers").click(function () {
        $("#btnShowMembers").addClass("btn-success");
        $("#btnShowMembers").removeClass("btn-default");
        $("#btnShowTests").addClass("btn-default");
        $("#btnShowTests").removeClass("btn-success");
        $("#divShowMembers").show(200);
        $("#divShowTests").hide(200);
    });


    
    // TODO: REMOVE THIS
    /**
     * Test Method
     */
    $("#btnTest").click(function () {

        var data = {};
        data.I1 = $("#I1").val(),
        data.I2 = $("#I2").val(),
        data.I3m = $("#I3m").val(),
        data.I4 = $("#I4").val(),
        data.I5 = $("#I5").val(),
        data.S1 = $("#S1").val(),
        data.S2 = $("#S2").val(),
        data.S3 = $("#S3").val(),

        $.ajax({
            type: "POST",
            url: apiEndpoint + "/",
            data: data,
            success: function(result) {
                console.log(result);
                $("#testRes").val(result.Data);
            },
            error: function(xhr, status, p3, p4) {
                var err = "Error " + " " + status + " " + p3 + " " + p4;
                if (xhr.responseText && xhr.responseText[0] === "{") {
                    err = JSON.parse(xhr.responseText).Message;
                }
                console.log(err);
            }
        });
    });

    $("#test1").click(function() {
        $.get(apiEndpoint + "/GetExercise", {
                sessionId: sessionId,
                ExerciseId: $("#fieldId").val()
            })
        .done(function (res) {

            $("#btnSaveTask").hide();
            $("#btnSaveChanges").show();

            $("#panelTask").show(200);

            exerciseId = res.Data.Id;
            $("#panelTask").attr("data-id", res.Data.Id);
            $("#numSimilarityScore").val(res.Data.SimilarityNorm);
            $("#panelTask").attr("data-onwerId",res.Data.OwnerId);
            $("#selectTaskType").val(res.Data.TypeId);
            $("#textTaskName").val(res.Data.Name);
            $("#numDifficulty").val(res.Data.Difficulty);
            $("#numPoints").val(res.Data.MarkPoints);

            tinyMCE.get("editorTask").setContent(res.Data.Question || "");
            tinyMCE.get("editorHint").setContent(res.Data.Hint || "");
            tinyMCE.get("editorExpenation").setContent(res.Data.Explanation || "");

//            var fields = 

//            console.log('res.Data.Fields.Answers.length', res.Data.Fields.Answers.length);
//            console.log('res.Data.TypeId', res.Data.TypeId);

            $("#checkMixAnswers").prop("checked", res.Data.IsAnswersMoving);
            $('table[data-rel="answerTypes"], div[data-rel="answerTypes"]').hide();
            switch (res.Data.TypeId) {
                case 1:
                    console.log(1);

                    var table = $("#tblAddedAnswers_Type1");
                    table.show(200);
                    table.find("tr").remove();
                    for (var i = 0; i < res.Data.Fields.Answers.length; i++) {
                        html = '<tr>' +
                       '<td style="width: 20px">' +
                       '<input type="radio" checked="' + (res.Data.Fields.Answers[i].CheckInfo === 0 ? true : false) + '" name="type1-correct-answer" data-rel="right-answer">' +
                       '</td>' +
                       '<td>' + res.Data.Fields.Answers[i].Answer + '</td>' +
                       '<td style="width: 20px">' +
                       '<a href="#" rel="up-answer" class="rowUp">' +
                       '<span class="glyphicon glyphicon-chevron-up"></span></a>' +
                       '</td>' +
                       '<td style="width: 20px">' +
                       '<a href="#" rel="down-answer" class="rowDown">' +
                       '<span class="glyphicon glyphicon-chevron-down"></span></a>' +
                       '</td>' +
                       '<td style="width: 20px">' +
                       '<a href="#" rel="edit-answer" class="rowEdit">' +
                       '<span class="glyphicon glyphicon-pencil"></span></a>' +
                       '</td>' +
                       '<td style="width: 20px">' +
                       '<a href="#" rel="remove-answer" class="rowRemove">' +
                       '<span class="glyphicon glyphicon-remove-sign"></span></a>' +
                       '</td>' +
                       '</tr>';
                        $("#tblAddedAnswers_Type1").append(html);
                    }
                    break;
                case 2:
                    console.log(2);
                    var table = $("#tblAddedAnswers_Type2");
                    table.show(200);
                    table.find("tr").remove();
                    for (var i = 0; i < res.Data.Fields.Answers.length; i++) {
                        html = '<tr>' +
                       '<td style="width: 20px">' +
                       '<input type="checkbox" ' + (res.Data.Fields.Answers[i].CheckInfo === 0 ? "checked='checked'" : "") + '">' +
                       '</td>' +
                       '<td>' + res.Data.Fields.Answers[i].Answer + '</td>' +
                       '<td style="width: 20px">' +
                       '<a href="#" rel="up-answer" class="rowUp">' +
                       '<span class="glyphicon glyphicon-chevron-up"></span></a>' +
                       '</td>' +
                       '<td style="width: 20px">' +
                       '<a href="#" rel="down-answer" class="rowDown">' +
                       '<span class="glyphicon glyphicon-chevron-down"></span></a>' +
                       '</td>' +
                       '<td style="width: 20px">' +
                       '<a href="#" rel="edit-answer" class="rowEdit">' +
                       '<span class="glyphicon glyphicon-pencil"></span></a>' +
                       '</td>' +
                       '<td style="width: 20px">' +
                       '<a href="#" rel="remove-answer" class="rowRemove">' +
                       '<span class="glyphicon glyphicon-remove-sign"></span></a>' +
                       '</td>' +
                       '</tr>';
                        table.append(html);
                    }
                    break;
                case 3:
                    $("#tblAddedAnswers_Type3").show(200);
                    var tableLeft = $("#tblAddedAnswers_Type3 table[data-rel='left']");
                    var tableRight = $("#tblAddedAnswers_Type3 table[data-rel='right']");
//                    tableLeft.show(200);
                    tableLeft.find("tr").remove();
//                    tableRight.show(200);
                    tableRight.find("tr").remove();
                    for (var i = 0; i < res.Data.Fields.LeftAnswers.length; i++) {
                        html = '<tr>' +
                       '<td style="width: 20px">' + res.Data.Fields.LeftAnswers[i].CheckInfo +'</td>' +
                       '<td>' + res.Data.Fields.LeftAnswers[i].Answer + '</td>' +
                       '<td style="width: 20px">' +
                       '<a href="#" rel="up-answer" class="rowUp">' +
                       '<span class="glyphicon glyphicon-chevron-up"></span></a>' +
                       '</td>' +
                       '<td style="width: 20px">' +
                       '<a href="#" rel="down-answer" class="rowDown">' +
                       '<span class="glyphicon glyphicon-chevron-down"></span></a>' +
                       '</td>' +
                       '<td style="width: 20px">' +
                       '<a href="#" rel="edit-answer" class="rowEdit">' +
                       '<span class="glyphicon glyphicon-pencil"></span></a>' +
                       '</td>' +
                       '<td style="width: 20px">' +
                       '<a href="#" rel="remove-answer" class="rowRemove">' +
                       '<span class="glyphicon glyphicon-remove-sign"></span></a>' +
                       '</td>' +
                       '</tr>';
                        tableLeft.append(html);
                    }
                    for (var i = 0; i < res.Data.Fields.RightAnswers.length; i++) {
                        html = '<tr>' +
                       '<td style="width: 20px">' + res.Data.Fields.RightAnswers[i].CheckInfo + '">' + '</td>' +
                       '<td>' + res.Data.Fields.RightAnswers[i].Answer + '</td>' +
                       '<td style="width: 20px">' +
                       '<a href="#" rel="up-answer" class="rowUp">' +
                       '<span class="glyphicon glyphicon-chevron-up"></span></a>' +
                       '</td>' +
                       '<td style="width: 20px">' +
                       '<a href="#" rel="down-answer" class="rowDown">' +
                       '<span class="glyphicon glyphicon-chevron-down"></span></a>' +
                       '</td>' +
                       '<td style="width: 20px">' +
                       '<a href="#" rel="edit-answer" class="rowEdit">' +
                       '<span class="glyphicon glyphicon-pencil"></span></a>' +
                       '</td>' +
                       '<td style="width: 20px">' +
                       '<a href="#" rel="remove-answer" class="rowRemove">' +
                       '<span class="glyphicon glyphicon-remove-sign"></span></a>' +
                       '</td>' +
                       '</tr>';
                        tableRight.append(html);
                    }
                    break;
                case 4:
                    res.Data.Fields.Answers.sort(function(a, b) {
                        return a.OrdinalNumber - b.OrdinalNumber;
                    });

                    var table = $("#tblAddedAnswers_Type4");
                    table.show(200);
                    table.find("tr").remove();
                    for (var i = 0; i < res.Data.Fields.Answers.length; i++) {
                        html = '<tr data-OrdinalNumber="' + res.Data.Fields.Answers[i].OrdinalNumber + '">' +
                       '<td style="width: 50px">' + res.Data.Fields.Answers[i].CheckInfo + '</td>' +
                       '<td>' + res.Data.Fields.Answers[i].Answer + '</td>' +
                       '<td style="width: 20px">' +
                       '<a href="#" rel="up-answer" class="rowUp">' +
                       '<span class="glyphicon glyphicon-chevron-up"></span></a>' +
                       '</td>' +
                       '<td style="width: 20px">' +
                       '<a href="#" rel="down-answer" class="rowDown">' +
                       '<span class="glyphicon glyphicon-chevron-down"></span></a>' +
                       '</td>' +
                       '<td style="width: 20px">' +
                       '<a href="#" rel="edit-answer" class="rowEdit">' +
                       '<span class="glyphicon glyphicon-pencil"></span></a>' +
                       '</td>' +
                       '<td style="width: 20px">' +
                       '<a href="#" rel="remove-answer" class="rowRemove">' +
                       '<span class="glyphicon glyphicon-remove-sign"></span></a>' +
                       '</td>' +
                       '</tr>';
                        table.append(html);
                    }
                    break;
                case 6:
                case 7:
                case 8:
                case 9:
                case 10:
                    var table = $("#tblAddedAnswers_Type6-10");
                    table.show(200);
                    table.find("tr").remove();
                    for (var i = 0; i < res.Data.Fields.Answers.length; i++) {
                        html = '<tr data-OrdinalNumber="' + res.Data.Fields.Answers[i].OrdinalNumber + '">' +
                       '<td>' + res.Data.Fields.Answers[i].Answer + '</td>' +
                       '<td style="width: 20px">' +
                       '<a href="#" rel="up-answer" class="rowUp">' +
                       '<span class="glyphicon glyphicon-chevron-up"></span></a>' +
                       '</td>' +
                       '<td style="width: 20px">' +
                       '<a href="#" rel="down-answer" class="rowDown">' +
                       '<span class="glyphicon glyphicon-chevron-down"></span></a>' +
                       '</td>' +
                       '<td style="width: 20px">' +
                       '<a href="#" rel="edit-answer" class="rowEdit">' +
                       '<span class="glyphicon glyphicon-pencil"></span></a>' +
                       '</td>' +
                       '<td style="width: 20px">' +
                       '<a href="#" rel="remove-answer" class="rowRemove">' +
                       '<span class="glyphicon glyphicon-remove-sign"></span></a>' +
                       '</td>' +
                       '</tr>';
                        table.append(html);
                    }
                    break;
            }
        });
    });
});