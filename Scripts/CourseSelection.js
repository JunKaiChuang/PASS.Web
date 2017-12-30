$(document).ready(function () {

    $.post("GetCourseList", {},
        function (data, status) {
            
            var amounts = data.length;

            var table = $('<table border="1" style="width:600px;height:auto;"></table>');
            var firstRow = $('<tr><th>課號</th><th width="300px">課程名稱</th><th>教師</th><th>進入</th></tr>');
            table.append(firstRow);
            for (var i = 0; i < amounts; i++)
            {                
                var row = $('<tr>' + '<td>' + data[i].CourseNo + '</td>' + '<td>' + data[i].CourseName + '</td>' + '<td>' + data[i].LecturerName + '</td>' + '<td align="center"><button id="enterCourse" value = "' + data[i].CourseNo + '">進入</button></td>' + '</tr>');
                table.append(row);                
            }
            $('#here_table').append(table);
        });


    $('#here_table').on('click', '#enterCourse', function () {
        var courseNo = this.value;

        $.post("SelectCourse",
        {
            courseNo: courseNo
        },
        function (data, status) {

            if (data) {
                $.redirect(data, {});
            }

        });

    });
});