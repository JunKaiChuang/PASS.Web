$(document).ready(function () {
    LoadAssignmentList();
    //upload dialog---------------------------------
    
    var dialog, form, file, assignmentNo, assignment, action
        , allFields = $([]).add(file);

    function updateTips(t) {
        $(".validateTips")
          .text(t)
          .addClass("ui-state-highlight");
        setTimeout(function () {
            $(".validateTips").removeClass("ui-state-highlight", 1500);
        }, 500);
    }

    function checkLength(o, n, min, max) {
        if (o.val().length > max || o.val().length < min) {
            o.addClass("ui-state-error");
            updateTips("Length of " + n + " must be between " +
              min + " and " + max + ".");
            return false;
        } else {
            return true;
        }
    }

    function checkRegexp(o, regexp, n) {
        if ((regexp.test(o.val()))) {
            o.addClass("ui-state-error");
            updateTips(n);
            return false;
        } else {
            return true;
        }
    }

    dialog = $("#dialog-form").dialog({
        autoOpen: false,
        height: 600,
        width: 350,
        modal: true,
        show: {
            effect: "fade",
            duration: 1000
        },
        hide: {
            effect: "fade",
            duration: 1000
        },
        buttons: {
            Ok: submit,
            Cancel: function () {
                dialog.dialog("close");
            }
        },
        close: function () {
            form[0].reset();
            $('#name').removeClass("ui-state-error");
        }
    });

    scoreForm = $("#score-form").dialog({
        autoOpen: false,
        height: 600,
        width: 1200,
        modal: true,
        show: {
            effect: "fade",
            duration: 1000
        },
        hide: {
            effect: "fade",
            duration: 1000
        },
        buttons: {
            Ok: editScore,
            Cancel: function () {
                scoreForm.dialog("close");
            }
        },
        close: function () {
            form[0].reset();
        }
    });

    form = dialog.find("form").on("submit", function (event) {
        event.preventDefault();
        LoadAssignmentList();
    });

    function submit()
    {
        var valid = true;
        $('#name').removeClass("ui-state-error");

        valid = valid && checkRegexp($('#name'), /^$/, "課程名稱未輸入");
        if (valid)
        {
            assignment.AssignmentTitle = $('#name').val();
            assignment.EndDate = $('#endDate').val();
            assignment.AssignmentDescription = $('textarea#descript').val();

            $.post("CreateOrModifyAssignment",
                {
                    assignment: assignment
                },
            function (data, status) {
                alert(action + '成功');                
                LoadAssignmentList();
                dialog.dialog("close");
            });
        }        
        
    }

    function editScore()
    {
        var MyRows = $('div#score_table').find('tbody').find('tr');
        var assignmentScores = [];

        for (var i = 1; i < MyRows.length; i++) {
            var userNo = $(MyRows[i]).find('td:eq(4)').html();
            var score = $(MyRows[i]).find('input').val();
            var obj = { UserNo: userNo, AssignmentNo: assignmentNo, Score: score };

            assignmentScores.push(obj);
            console.log(userNo + ":" + score);
        }
        
        $.post("LogScore",
                {
                    assignmentScores: assignmentScores
                },
            function (data, status) {
                alert('成績登錄成功');
                LoadAssignmentList();
                scoreForm.dialog("close");
            });
        
    }
    //----------------------------------------------------

    //ConfirmDialog---------------------------------------
    function ConfirmDialog(message) {
        $.post("GetAssignment",
            {
                assignmentNo: assignmentNo
            },
        function (data, status) {
            assignment = data;

            $('<div></div>').appendTo('body')
                        .html('<div><h6>' + message + " : " + assignment.AssignmentTitle + '?</h6></div>')
                        .dialog({
                            modal: true, title: '確認', zIndex: 10000, autoOpen: true,
                            width: 'auto', resizable: false,
                            buttons: {
                                Yes: function () {
                                    $.post("DeleteAssignment",
                                        {
                                            assignment: assignment
                                         },
                                            function (data, status) {
                                                alert("刪除成功");
                                                LoadAssignmentList();
                                            });
                                    $(this).dialog("close");
                                },
                                No: function () {

                                    $(this).dialog("close");
                                }
                            },
                            close: function (event, ui) {
                                $(this).remove();
                            }
                        });
        });             
    };

    //----------------------------------------------------
    function Clear()
    {        
        $(".validateTips").text("");
        assignment = {};
    }

    function GetNewAssignment()
    {
        $.post("GetNewAssignment", {},
        function (data, status) {
            assignment = data;
            assignment = data;
            var milli = data.EndDate.replace(/\/Date\((-?\d+)\)\//, '$1');
            var endTime = $.format.date(new Date(parseInt(milli)), "yyyy-MM-dd");
            
            $('#courseNo').val(data.CourseNo);
            $('#name').val(data.AssignmentTitle);
            $('#endDate').val(endTime);
            $('textarea#descript').val(data.AssignmentDescription);
        });
    }

    function GetAssignment(assignmentNo)
    {
        $.post("GetAssignment",
            {
                assignmentNo: assignmentNo
            },
        function (data, status) {
            assignment = data;
            var milli = data.EndDate.replace(/\/Date\((-?\d+)\)\//, '$1');
            var endTime = $.format.date(new Date(parseInt(milli)), "yyyy-MM-dd");

            $('#courseNo').val(data.CourseNo);
            $('#name').val(data.AssignmentTitle);
            $('#endDate').val(endTime);
            $('textarea#descript').val(data.AssignmentDescription);
        });
    }

    function LoadAssignmentList() {
        $.post("GetAssignmentList", {},
        function (data, status) {
            $('#here_table tr').remove();
            $('#here_table table').remove();
            var amounts = data.length;

            var table = $('<table border="1" style="width:600px;height:auto;"></table>');
            var firstRow = $('<tr><th>選擇</th><th>作業名稱</th><th>結束時間</th><th>成績分布</th></tr>');
            table.append(firstRow);
            for (var i = 0; i < amounts; i++) {
                var milli = data[i].EndDate.replace(/\/Date\((-?\d+)\)\//, '$1');
                var endTime = $.format.date(new Date(parseInt(milli)), "yyyy/MM/dd");

                var row = $('<tr>' + '<td align="center"><input type="radio" name="select1" value="' + data[i].AssignmentNo + '" /></td>' + '<td align="center"><button id="score" value = "' + data[i].AssignmentNo + '">' + data[i].AssignmentTitle + '</button></td>' + '<td>' + endTime + '</td>' + '<td align="center"><button id="chart" value = "' + data[i].AssignmentNo + '">查看</button></td>' + '</tr>');
                table.append(row);
            }
            $('#here_table').append(table);
        });
    }

    function LoadScoreList() {
        $.post("GetScoreListByAssignmentNo",
            {
                assignmentNo : assignmentNo
            },
        function (data, status) {
            $('#score_table tr').remove();
            $('#score_table table').remove();
            var amounts = data.length;

            var table = $('<table border="1" style="width:600px;height:auto;"></table>');
            var firstRow = $('<tr><th>學號</th><th>姓名</th><th>檔案</th><th>成績</th><th style="display:none;">UserNo</th></tr>');
            table.append(firstRow);
            for (var i = 0; i < amounts; i++) {
                var fileTd = "<td></td>";
                if (data[i].FileNo != null) fileTd = '<td align="center"><button type="button" id="downLoad" value = "' + data[i].FileNo + '">下載</button></td>';
                var row = $('<tr>' + '<td>' + data[i].UserID + '</td>' + '<td>' + data[i].UserName + '</td>' + fileTd + '<td><input type="number" min="0" max="100" placeholder="成績輸入0~100" value="'+ data[i].Score + '"></td>' + '<td style="display:none;">' + data[i].UserNo + '</td>' + '</tr>');
                table.append(row);
            }
            $('#score_table').append(table);
        });
    }

    function LoadScoreChart()
    {
        $.post("GetScoreListByAssignmentNo",
            {
                assignmentNo: assignmentNo
            },
        function (data, status) {
            ShowChart(data);
        });
    }

    function ShowChart(data)
    {
        var MyRows = $('div#here_table').find('tbody').find('tr');
        var title = "";

        for (var i = 1; i < MyRows.length; i++) {
            title = $(MyRows[i]).find('button:eq(0)').text();
            var dest = $(MyRows[i]).find('input').val();
            if (dest == assignmentNo) break;
        }

        var scoreRangeCount = [0, 0, 0, 0, 0, 0];

        for (var i = 0; i < data.length; i++)
        {
            var score = data[i].Score;
            if (score <= 19) scoreRangeCount[0]++;
            else if (score <= 39) scoreRangeCount[1]++;
            else if (score <= 59) scoreRangeCount[2]++;
            else if (score <= 79) scoreRangeCount[3]++;
            else if (score <= 99) scoreRangeCount[4]++;
            else scoreRangeCount[5]++;
        }

        var options = {
            animationEnabled: true,
            title: {
                text: title
            },
            axisY: {
                title: "人數",
                includeZero: true
            },
            axisX: {
                title: "成績"
            },
            data: [{
                type: "column",
                dataPoints: [
                    { label: "0~19", y: scoreRangeCount[0] },
                    { label: "20~39", y: scoreRangeCount[1] },
                    { label: "40~59", y: scoreRangeCount[2] },
                    { label: "60~79", y: scoreRangeCount[3] },
                    { label: "80~99", y: scoreRangeCount[4] },
                    { label: "100", y: scoreRangeCount[5] }
                ]
            }]
        };

        $("#dialogBox").dialog({
            open: function (event, ui) {
                $(".ui-widget-overlay").bind("click", function (event, ui) {
                    $("#dialogBox").dialog("close");
                });
            },
            closeOnEscape: true,
            draggable: false,
            resizable: false,
            title: "成績分布",
            width: 700,
            modal: true,
            show: 500
        });
        $(".ui-widget-overlay").css({ "background-color": "#111111" });
        $("#chartContainer").CanvasJSChart(options);
    }

    $('#here_table').on('click', '#chart', function () {
        assignmentNo = this.value;

        LoadScoreChart();
    });

    $('#score_table').on('click', '#downLoad', function () {
        fileNo = this.value;
        
        window.location = "Download?fileNo=" + fileNo + '&assignmentNo=' + assignmentNo;
    });

    $('#here_table').on('click', '#score', function () {
        assignmentNo = this.value;
        var title = this.innerText;

        LoadScoreList();

        $('#title').text(title);
        scoreForm.dialog("open");
    });

    $('#addBtn').click(function () {
        action = "新增";
        Clear();
        GetNewAssignment();
        $('#actionTitle').text("新增作業");
        dialog.dialog("open");
    });

    $('#editBtn').click(function () {
        action = "修改";
        Clear();
        assignmentNo = $('input[name="select1"]:checked').val()
        if (assignmentNo == undefined)
        {
            alert("請先選擇作業");
            return;
        }
        GetAssignment(assignmentNo);
        $('#actionTitle').text("修改作業");
        dialog.dialog("open");
    });

    $('#deleteBtn').click(function () {
        Clear();
        assignmentNo = $('input[name="select1"]:checked').val()
        if (assignmentNo == undefined) {
            alert("請先選擇作業");
            return;
        }
        ConfirmDialog('是否刪除');
    });
});