var ApiEndpoint = "http://api.ecampus.kpi.ua/";

$(document).ready(function () {
    var sessionId = $("#hidden").val();
    var user_id = $("#uhidden").val();

    $("select").chosen();

    $body = $("body");

    $(document).on({
        ajaxStart: function () { $body.addClass("loading"); },
        ajaxStop: function () { $body.removeClass("loading"); }
    });

    $(document).on("click", ".chosen-choices", function (e) {
        if ($(".search-field").length < 1) {
            $(".chosen-choices").append("<li class=\"search-field\"><input type=\"text\" value=\"\" class=\"default\" autocomplete=\"off\" style=\"width: 100%;\"></li>");
        }
        $(".search-field .default").focus();
    });

    $(document).on("click", ".result-selected", function (e) {
        $(".chosen-results").empty();
        $(".chosen-choices").append("<li class=\"search-choice\"" + " uid=" + $(this).attr("uid") + "><span>" + $(this).text() + "</span><a class=\"search-choice-close\" data-option-array-index=" + $(this).attr("data-option-array-index") + "></a></li>");
        $(".search-field").remove();
        //$(".chosen-drop").remove();
    });

    $(document).on("focus", ".search-field .default", function () {
        //if ($(".chosen-drop").length == 0) {
        //    $("#body_UserList_chosen").append("<div class=\"chosen-drop\"><ul class=\"chosen-results\"></ul></div>");
        //}
        $(".no-results").remove();
        $(".chosen-results").append("<li class=\"no-results\">Почніть вводити одержувача...</li>");
    });

    $(document).on("focusout", ".search-field .default", function () {
        //$(".chosen-drop").remove();
    });

    $(document).on("keyup", ".search-field .default", function () {
        if (!$(this).val()) {
            $(".chosen-results").empty();
            $(".chosen-results").append("<li class=\"no-results\">Почніть вводити одержувача...</li>");
        }
        if ($(this).val().length >= 2) {
            $(".chosen-results").empty();
            var text = $(this).val();
            var url = ApiEndpoint + "User/GetAllUsers?name=" + text + "&sessionId=" + sessionId;
            $.getJSON(url, function (data, status) {
                if (data.Data.length > 0) {
                    $.each(data.Data, function (key, value) {
                        var newItem = "" + value.UserAccountId;
                        var same = "false";
                        var sameCh = "false";
                        $.each($(".chosen-results").children(), function () {
                            if ($(this).attr("uid") === newItem) {
                                same = "true";
                                return (same != "false");
                            }
                        });
                        $.each($(".search-choice"), function () {
                            if ($(this).attr("uid") === newItem) {
                                sameCh = "true";
                                return (sameCh != "false");
                            }
                        });

                        if (same === "false" && sameCh === "false") {
                            $(".chosen-results").append("<li class=\"active-result\" data-option-array-index=" + key + " uid=" + value.UserAccountId + ">" + value.FullName + "</li>");
                        } else if (same === "false" && sameCh === "true" && $(".chosen-results").length < 1) {
                            $(".no-results").remove();
                            $(".chosen-results").append("<li class=\"no-results\">Немає співпадінь \"<span>" + $(".search-field input").val() + "</span>\"</li>");
                        }
                    });
                } else {
                    $(".no-results").remove();
                    $(".chosen-results").append("<li class=\"no-results\">Немає співпадінь \"<span>" + $(".search-field input").val() + "</span>\"</li>");
                };

            }).fail(function (error, text, status) {
                alert(text + "," + status);
            });

        } else if ($(this).val().length == 1) {
            $(".no-results").remove();
            $(".active-result").remove();
            $(".chosen-results").append("<li class=\"no-results\">Однієї літери замало \"<span>" + $(".search-field input").val() + "</span>\"</li>");
        }
    });

    $(document).on("click", ".search-choice-close", function (e) {
        $(this).parent().remove();
    });

    $(document).on("focusout", ".search-field", function (e) {
        if ($(".search-choice").length > 0) $(".search-field").remove();
    });

    function addNewDialog(dialog) {
        var messageLink = $("<a/>");
        var mainDiv = $("<div/>");
        var imgDiv = $("<div/>");
        var infoDiv = $("<div/>");
        var subject = $("<h5/>");
        var last = $("<p/>");
        var lastPhoto = $("<img/>");
        var lastSender = $("<h6/>");
        var lastText = $("<p/>");
        var date = $("<p/>");

        var users = [];
        for (var j = 0; j < dialog.length; j++) {
            var message = dialog[j];
            var senderId = message.SenderUserAccountId;
            if (users.indexOf(senderId) == -1) {
                users.push(senderId);
                $('<img />', { src: message.SenderUserAccountPhoto }).appendTo(imgDiv);
                if (j == 0) {
                    // last message
                    lastSender.text(message.SenderUserAccountFullName);
                    lastPhoto.attr("src", message.SenderUserAccountPhoto);
                    lastText.text(message.Text);
                }
            }
        }

        var lastMsg = dialog[0];
        messageLink.attr({ "class": "messageLink", "cId": lastMsg.MassageGroupId, "subj": lastMsg.Subject, "href": "" });
        mainDiv.attr({ "id": "mainBlock", "class": ".form-inline" });
        imgDiv.attr({ "id": "imgBlock", "class": "imgBlock" });
        infoDiv.attr("id", "infoBlock");
        subject.attr({ "id": "subject", "class": "text-primary" });
        last.attr({ "id": "last", "class": "text-success" });
        lastPhoto.attr("class", "lastPhoto");
        lastSender.attr("class", "lastSender text-warning");
        lastText.attr("class", " lastText text-success");
        date.attr({ "id": "date", "class": "text-warning" });

        subject.text(lastMsg.Subject);
        date.text(dialog.LastMessageDate);

        lastPhoto.appendTo(last);
        lastSender.appendTo(last);
        lastText.appendTo(last);
        subject.appendTo(infoDiv);
        last.appendTo(infoDiv);
        date.appendTo(infoDiv);
        imgDiv.appendTo(mainDiv);
        infoDiv.appendTo(mainDiv);
        mainDiv.appendTo(messageLink);
        messageLink.prependTo($("#body_LinkContainer"));
    };

    $(document).on("click", "#SendMessage", function (e) {
        if ($("#body_Text").val() != "" && $(".search-choice").length > 0) {
            var userList = "";
            $.each($(".search-choice"), function (index, value) {
                if (index != $(".search-choice").length - 1) userList += $(this).attr("uid") + ",";
                else userList += $(this).attr("uid");
            });
            var url = ApiEndpoint + "Message/CreateGroup?sessionId=" + sessionId + "&userIdList=" + userList + "&name=" + $("#body_Subject").val();
            $.getJSON(url, function (data, status) {
                var groupId = data.Data;
                url = ApiEndpoint + "message/SendMessage?sessionId=" + sessionId + "&groupId=" + groupId + "&text=" + $("#body_Text").val() + "&subject=" + $("#body_Subject").val();
                $.getJSON(url, function (data, status) {
                    console.log(status);
                    alert("Діалог створено, повідомлення розіслано!");
                    $(".chosen-choices").empty();
                    $(".chosen-choices").append("<li class=\"search-field\"><input type=\"text\" value=\"Оберіть одержувачів\" class=\"default\" autocomplete=\"off\" style=\"width: 100%;\"></li>");
                    $("#body_Subject").val("");
                    $("#body_Text").val("");
                    var getDialogUrl = ApiEndpoint + "message/GetUserConversation?sessionId=" + sessionId + "&groupId=" + groupId;
                    $.getJSON(getDialogUrl, function (data, status) {
                        addNewDialog(data.Data);
                    });
                });
            });

        } else alert("Заповніть отримувачів та текст повідомлення!");
    });

    $("#user_block p a").mouseover(function (e) {
        e = e || window.event;
        var offset = $(this).offset();
        var x = (e.pageX - offset.left - 35);
        var y = (e.pageY - offset.top + 35);
        $("#block_user_name").text($(this).text());
        $(".ajax_block_img").attr("src", ApiEndpoint + "Storage/GetUserProfileImage?userId=" + user_id);
        $("#ajax_block_profile").css({ "left": x, "top": y, "z-index": 1 }).fadeIn(300);
    });

    $("#user_block p a").mouseout(function () {
        $("#ajax_block_profile").fadeOut(200);
    });

});
