# PASS.Web
PASS.Web

1.先設定trunk底下Web.config中DbPath的value為實際存在電腦中的絕對路徑(你放網站的路徑\trunk\DB\PASS.db)

![image](https://github.com/JunKaiJuang/PASS.Web/blob/master/ReadmeImg/webconfig.JPG)


2.安裝IIS，下面有勾的都要勾

![image](https://github.com/JunKaiJuang/PASS.Web/blob/master/ReadmeImg/WindowsFunction.jpg)

3.打開IIS，新增網站

![image](https://github.com/JunKaiJuang/PASS.Web/blob/master/ReadmeImg/NewWebSite.jpg)

4.設定以32位元啟動

![image](https://github.com/JunKaiJuang/PASS.Web/blob/master/ReadmeImg/32bitStart.jpg)

5.打開瀏覽器，網址輸入http://localhost/

ID 0001
PW p@ssw0rd
TYPE 學生

ID 0002
PW p@ssw0rd
TYPE 教授

ID 0003
PW p@ssw0rd
TYPE 學生
