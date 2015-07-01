$(document).ready(function () {

    var apiEndpoint = $("#ApiEndpoint").text() + "/AntiPlagiarism",
        sessionId = $("#CampusSessionId").val();

    var names = [];

    // -----------------------------------------------------------
    // Helpers
    // -----------------------------------------------------------

    function showBySelector(selector) {
        $(selector).removeClass("hide");
    }

    function hideBySelector(selector) {
        $(selector).addClass("hide");
    }

    // -----------------------------------------------------------
    // Events
    // -----------------------------------------------------------

    /*
     * Upload files on server, when input file list changed.
     */
    $("#uploadFiles").change(function(event) {
        var files = event.target.files;

        if (files.length === 0) return;
        if (window.FormData === undefined) return showBySelector("#blockBrowserError");

        var data = new FormData();
        for (var i = 0, len = files.length; i < len; i++) {
            data.append("file" + i, files[i]);
            names.push(files[i].name);
        }


        $.ajax({
            type: "POST",
            url: apiEndpoint + "/UploadFiles?sessionId=" + sessionId,
            contentType: false,
//            contentData: false,
            processData: false,
            data: data,
            success: function(result) {
//                console.log(result);
                //                $("#testTextBox").val(result.Data);
                $.get(apiEndpoint + "/GetFilesList?sessionId=" + sessionId, function (res) {
                    //            console.log("GetFilesLists result", res);
                    for (var i = 0; i < result.Data.length; i++) {
                        var html = "<tr data-id='" + result.Data[i].Id + "'><td style='width: 20px'><input type='checkbox' class='_files' /></td><td>" + result.Data[i].Name + "</td></tr>";
                        $("#tblFiles").append(html);
                    }
                });
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

    /*
     * User closed alert.
     */
    $("a[rel='hide']").on("click", function(event) {
        event.preventDefault();
        $(this).parent().addClass("hide");
    });


    $("#testRemove").click(function () {
        var ids = [];

        $("input:checkbox._files").each(function() {
            if (this.checked) ids.push($(this).closest("tr").attr("data-id"));
        });

        var remove = function(id) {
            $.get(apiEndpoint + "/RemoveFile?sessionId=" + sessionId + "&FileId=" + $("#testRemoveIn").val(), function (res) {
                if (res.Data) $("#tblFiles tr[data-id='" + id + "']").remove();
            });
        }

        for (var i = 0; i < ids.length; i++) {
            remove(ids[i]);
        }
    });

    $("#testCompareFiles").click(function () {
        var results = $("#results");
        results.find("div").remove();

        var compare = function(id1, id2) {
            $.get(apiEndpoint + "/CompareFiles?sessionId=" + sessionId + "&FirstFileId=" + id1 + "&SecondFileId=" + id2, function(res) {
                //            console.log("CompareFiles result", res);
                var html = '<div class="panel panel-default">' +
                    '<div class="panel-heading" role="tab" id="headingOne">' +
                    '<h4 class="panel-title">' +
                    '<a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse' + id1 + id2 + '" aria-expanded="true" aria-controls="collapse"' + id1 + id2 + '">' +
                    'Collapsible Group Item #1' +
                    '</a>' +
                    '</h4>' +
                    '</div>' +
                    '<div id="collapse' + id1 + id2 + '" class="panel-collapse collapse in" role="tabpanel">' +
                    '<div class="panel-body">' +
                    '</div>' +
                    '</div>' +
                    '</div>';
                results.append(html);
            });
            
        }

        var ids = [];
        var cids = [];
        $("input:checkbox._files").each(function () {
            var id = $(this).closest("tr").attr("data-id");
            if (this.checked) cids.push(id);
            ids.push(id);
        });

        for (var i = 0; i < cids.length; i++) {
            for (var j = 0; j < ids.length; k++) {
                compare(cids[i], ids[j]);
            }
        }
    });

//    $("#testGetFilesList").click(function () {
//        $.get(apiEndpoint + "/GetFilesList?sessionId=" + sessionId, function (res) {
//            //            console.log("GetFilesLists result", res);
//            for (var i = 0; i < result.Data.length; i++) {
//                var html = "<tr data-id='" + result.Data[i].Id + "'><td style='width: 20px'><input type='checkbox' class='_files' /></td><td>" + result.Data[i].Name + "</td></tr>";
//                $("#tblFiles").append(html);
//            }
//        });
//    });
});