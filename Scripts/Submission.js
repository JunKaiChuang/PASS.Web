$(document).ready(function () {
    LoadAssignmentList();
    //upload dialog---------------------------------
    
    var dialog, form, file, assignmentNo
        , allFields = $([]).add(file);

    function updateTips(t) {
        tips
          .text(t)
          .addClass("ui-state-highlight");
        setTimeout(function () {
            tips.removeClass("ui-state-highlight", 1500);
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

    function checkFile()
    {
        var input = $('input[name=file]');
        file = input[0].files[0];        
        if (file.size > 1024) {
            alert('max upload size is 1k')
            return false;
        }
        if (file.type != 'c' && false) //暫時沒做判斷
        {
            alert('請繳交.c檔')
            return false;
        }

        return true;
    }

    function upload() {
        var valid = true;
        allFields.removeClass("ui-state-error");
        
        if (checkFile()) {
            var blah = new FormData();
            blah.append("file", $("#file")[0].files[0]);

            $.ajax({
                // Your server script to process the upload
                url: 'UploadFile/?assignmentNo=' + assignmentNo,
                type: 'POST',

                // Form data
                data: blah,
                // Tell jQuery not to process data or worry about content-type
                // You *must* include these options!
                cache: false,
                contentType: false,
                processData: false,
                success: function (data) {
                    // The file was uploaded successfully...  
                    alert('File was uploaded.');
                    dialog.dialog("close");
                    LoadAssignmentList();
                },
                // Custom XMLHttpRequest
                xhr: function () {
                    var myXhr = $.ajaxSettings.xhr();
                    if (myXhr.upload) {
                        // For handling the progress of the upload
                        myXhr.upload.addEventListener('progress', function (e) {
                            if (e.lengthComputable) {
                                $('progress').attr({
                                    value: e.loaded,
                                    max: e.total,
                                });
                            }
                        }, false);
                    }
                    return myXhr;
                },
            });
        }
        return valid;
    }

    dialog = $("#dialog-form").dialog({
        autoOpen: false,
        height: 400,
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
            "Upload": upload,
            Cancel: function () {
                dialog.dialog("close");
            }
        },
        close: function () {
            form[0].reset();
            allFields.removeClass("ui-state-error");
        }
    });

    form = dialog.find("form").on("submit", function (event) {
        event.preventDefault();
        upload();
    });

    //----------------------------------------------------
        

    function LoadAssignmentList()
    {
        $.post("GetSubmissionList", {},
        function (data, status) {
            $('#here_table tr').remove();
            $('#here_table table').remove();
            var amounts = data.length;

            var table = $('<table border="1" style="width:600px;height:auto;"></table>');
            var firstRow = $('<tr><th>作業名稱</th><th>上傳情形</th><th>繳交期限</th><th>作業成績</th><th>上傳</th></tr>');
            table.append(firstRow);
            for (var i = 0; i < amounts; i++) {
                var milli = data[i].EndDate.replace(/\/Date\((-?\d+)\)\//, '$1');
                var endTime = $.format.date(new Date(parseInt(milli)), "yyyy/MM/dd");
                var isUpload = "未上傳";
                var uploadBtn = "<td>截止</td>";
                var now = new Date($.now());
                
                if (now <= new Date(parseInt(milli))) uploadBtn = '<td align="center"><button id="enterCourse" value = "' + data[i].AssignmentNo + '">選擇檔案</button></td>';
                if (data[i].Score == null) data[i].Score = '';
                if (data[i].IsUploaded) isUpload = "已上傳";


                var row = $('<tr>' + '<td>' + data[i].AssignmentTitle + '</td>' + '<td>' + isUpload + '</td>' + '<td>' + endTime + '</td>' + '<td>' + data[i].Score + '</td>' + uploadBtn + '</tr>');
                table.append(row);
            }
            $('#here_table').append(table);
        });
    }


    $('#here_table').on('click', '#enterCourse', function () {
        assignmentNo = this.value;
        $.post("GetAssignmentInfo",
        {
            assignmentNo: assignmentNo
        },
        function (data, status) {

            if (data) {
                $('#assignment').text(data.AssignmentTitle);
                $('#description').text(data.AssignmentDescription);
                
                dialog.dialog("open");
            }

        });
    });



});