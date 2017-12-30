$(document).ready(function () {
    
    


    $("#loginBtn").click(function () {
        $("#form1").validate();
        
        if (!$("#form1").valid()) return;

        $.post("Home/Login",
        {
            id: $("input[name='id']").val(),
            password: $("input[name='password']").val()
        },
        function (data, status) {
            
            if (data.UserNo == 0) {
                alert("帳號或密碼錯誤，請重新輸入");
            }
            else
            {
                $.redirect('Course/CourseSelection', {});
            }
            
        });
    });


    $.extend($.validator.messages, {
        required: "这是必填字段",
        remote: "请修正此字段",
        email: "请输入有效的电子邮件地址",
        url: "请输入有效的网址",
        date: "请输入有效的日期",
        dateISO: "请输入有效的日期 (YYYY-MM-DD)",
        number: "请输入有效的数字",
        digits: "只能输入数字",
        creditcard: "请输入有效的信用卡号码",
        equalTo: "你的输入不相同",
        extension: "请输入有效的后缀",
        maxlength: $.validator.format("最多可以输入 {0} 个字符"),
        minlength: $.validator.format("最少要输入 {0} 个字符"),
        rangelength: $.validator.format("请输入长度在 {0} 到 {1} 之间的字符串"),
        range: $.validator.format("请输入范围在 {0} 到 {1} 之间的数值"),
        max: $.validator.format("请输入不大于 {0} 的数值"),
        min: $.validator.format("请输入不小于 {0} 的数值")
    });


});