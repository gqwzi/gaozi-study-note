```
连接：mysql -h主机地址 -u用户名 －p用户密码 （注:u与root可以不用加空格，其它也一样）
断开：exit （回车）

创建授权：grant select on 数据库.* to 用户名@登录主机 identified by \"密码\"
修改密码：mysqladmin -u用户名 -p旧密码 password 新密码
删除授权: revoke select,insert,update,delete om *.* fromtest2@localhost;

显示数据库：show databases;
显示数据表：show tables;
显示表结构：describe 表名;

创建库：create database 库名;
删除库：drop database 库名;
使用库：use 库名;

创建表：create table 表名 (字段设定列表);
删除表：drop table 表名;
修改表：alter table t1 rename t2
查询表：select * from 表名;
清空表：delete from 表名;
备份表: mysqlbinmysqldump -h(ip) -uroot -p(password) databasenametablename > tablename.sql
恢复表: mysqlbinmysql -h(ip) -uroot -p(password) databasenametablename < tablename.sql（操作前先把原来表删除）

增加列：ALTER TABLE t2 ADD c INT UNSIGNED NOT NULL AUTO_INCREMENT,ADDINDEX (c);
修改列：ALTER TABLE t2 MODIFY a TINYINT NOT NULL, CHANGE b cCHAR(20);
删除列：ALTER TABLE t2 DROP COLUMN c;

备份数据库：mysql\bin\mysqldump -h(ip) -uroot -p(password) databasename> database.sql
恢复数据库：mysql\bin\mysql -h(ip) -uroot -p(password) databasename< database.sql
复制数据库：mysql\bin\mysqldump --all-databases >all-databases.sql
修复数据库：mysqlcheck -A -o -uroot -p54safer

文本数据导入：load data local infile \"文件名\" into table 表名;
数据导入导出：mysql\bin\mysqlimport database tables.txt

第一招、mysql服务的启动和停止
net stop mysql
net start mysql

第二招、登陆mysql
语法如下：mysql -u用户名-p用户密码
键入命令mysql -uroot -p，回车后提示你输入密码，输入12345，然后回车即可进入到mysql中了，mysql的提示符是：
mysql>
注意，如果是连接到另外的机器上，则需要加入一个参数-h机器IP

第三招、增加新用户
格式：grant 权限 on 数据库.* to 用户名@登录主机 identified by "密码"
如，增加一个用户user1密码为password1，让其可以在本机上登录，并对所有数据库有查询、插入、修改、删除的权限。首先用以root用户连入mysql，然后键入以下命令：
grant select,insert,update,delete on *.* touser1@localhost Identified by "password1";
如果希望该用户能够在任何机器上登陆mysql，则将localhost改为"%"。
如果你不想user1有密码，可以再打一个命令将密码去掉。
grant select,insert,update,delete on mydb.* touser1@localhost identified by"";

第四招：操作数据库
登录到mysql中，然后在mysql的提示符下运行下列命令，每个命令以分号结束。
1、 显示数据库列表。
show databases;
缺省有两个数据库：mysql和test。mysql库存放着mysql的系统和用户权限信息，我们改密码和新增用户，实际上就是对这个库进行操作。
2、 显示库中的数据表：
use mysql;
show tables;
3、 显示数据表的结构：
describe 表名;
4、 建库与删库：
create database 库名;
drop database 库名;
5、 建表：
use 库名;
create table 表名(字段列表);
drop table 表名;
6、 清空表中记录：
delete from 表名;
7、 显示表中的记录：
select * from 表名;

第五招、导出和导入数据
1. 导出数据：
mysqldump --opt test > mysql.test
即将数据库test数据库导出到mysql.test文件，后者是一个文本文件
如：mysqldump -u root -p123456 --databases dbname >mysql.dbname
就是把数据库dbname导出到文件mysql.dbname中。
2. 导入数据:
mysqlimport -u root -p123456 < mysql.dbname。
不用解释了吧。
3. 将文本数据导入数据库:
文本数据的字段数据之间用tab键隔开。
use test;
load data local infile "文件名" into table 表名;
1:使用SHOW语句找出在服务器上当前存在什么数据库：
mysql> SHOW DATABASES;
2:2、创建一个数据库MYSQLDATA
mysql> CREATE DATABASE MYSQLDATA;
3:选择你所创建的数据库
mysql> USE MYSQLDATA; (按回车键出现Database changed时说明操作成功！)
4:查看现在的数据库中存在什么表
mysql> SHOW TABLES;
5:创建一个数据库表
mysql> CREATE TABLE MYTABLE (name VARCHAR(20), sexCHAR(1));
6:显示表的结构：
mysql> DESCRIBE MYTABLE;
7:往表中加入记录
mysql> insert into MYTABLE values ("hyq","M");
8:用文本方式将数据装入数据库表中（例如D:/mysql.txt）
mysql> LOAD DATA LOCAL INFILE "D:/mysql.txt" INTOTABLE MYTABLE;
9:导入.sql文件命令（例如D:/mysql.sql）
mysql>use database;
mysql>source d:/mysql.sql;
10:删除表
mysql>drop TABLE MYTABLE;
11:清空表
mysql>delete from MYTABLE;
12:更新表中数据
mysql>update MYTABLE set sex="f" where name=\'hyq\';13：备份数据库mysqldump -u root库名>xxx.data14：

例2：连接到远程主机上的MYSQL
　　假设远程主机的IP为：110.110.110.110，用户名为root,密码为abcd123。则键入以下命令：　　　

　　mysql-h110.110.110.110 -uroot -pabcd123 　　

　　（注:u与root可以不用加空格，其它也一样） 　　

　　3、退出MYSQL命令：exit

(一) 连接MYSQL：
   格式：mysql -h主机地址 -u用户名－p用户密码

1、例1：连接到本机上的MYSQL
  首先在打开DOS窗口，然后进入mysql安装目录下的bin目录下，例如：D:\mysql\bin，再键入命令mysql -uroot-p，回车后提示你输密码，如果刚安装好MYSQL，超级用户root是没有密码的，故直接回车即可进入到MYSQL中了，MYSQL的提示符是：mysql>
2、例2：连接到远程主机上的MYSQL
  假设远程主机的IP为：10.0.0.1，用户名为root,密码为123。则键入以下命令：
   mysql -h10.0.0.1 -uroot-p123
（注：u与root可以不用加空格，其它也一样）
3、退出MYSQL命令
   exit （回车）

(二) 修改密码：
   格式：mysqladmin -u用户名 -p旧密码password 新密码
1、例1：给root加个密码123。首先在DOS下进入目录C:\mysql\bin，然后键入以下命令：
   mysqladmin -uroot -password123
  注：因为开始时root没有密码，所以-p旧密码一项就可以省略了。
2、例2：再将root的密码改为456
   mysqladmin -uroot -pab12password 456

(三) 增加新用户：（注意：和上面不同，下面的因为是MYSQL环境中的命令，所以后面都带一个分号作为命令结束符）
   格式：grant select on 数据库.* to用户名@登录主机 identified by "密码"
  例1、增加一个用户test1密码为abc，让他可以在任何主机上登录，并对所有数据库有查询、插入、修改、删除的权限。首先用以root用户连入MYSQL，然后键入以下命令：
   grantselect,insert,update,delete on *.* to test1@"%" Identified by"abc";

  但例1增加的用户是十分危险的，你想如某个人知道test1的密码，那么他就可以在internet上的任何一台电脑上登录你的mysql数据库并对你的数据可以为所欲为了，解决办法见例2。
  例2、增加一个用户test2密码为abc,让他只可以在localhost上登录，并可以对数据库mydb进行查询、插入、修改、删除的操作（localhost指本地主机，即MYSQL数据库所在的那台主机），这样用户即使用知道test2的密码，他也无法从internet上直接访问数据库，只能通过MYSQL主机上的web页来访问了。
   grantselect,insert,update,delete on mydb.* to test2@localhost identifiedby "abc";
  如果你不想test2有密码，可以再打一个命令将密码消掉。
   grantselect,insert,update,delete on mydb.* to test2@localhost identifiedby ""

(四) 显示命令
1、显示数据库列表：
   show databases;
  刚开始时才两个数据库：mysql和test。mysql库很重要它里面有MYSQL的系统信息，我们改密码和新增用户，实际上就是用这个库进行操作。
2、显示库中的数据表：
   use mysql；//打开库
   show tables;
3、显示数据表的结构：
   describe 表名;
4、建库：
   create database 库名;
5、建表：
   use 库名；
   create table 表名(字段设定列表)；
6、删库和删表:
   drop database 库名;
   drop table 表名；
7、将表中记录清空：
   delete from 表名;
8、显示表中的记录：
   select * from 表名;

MySQL导入导出命令
1.导出整个数据库
　　mysqldump -u 用户名 -p 数据库名 > 导出的文件名
　　mysqldump -u wcnc -p smgp_apps_wcnc >wcnc.sql

2.导出一个表
　　mysqldump -u 用户名 -p 数据库名 表名> 导出的文件名
　　mysqldump -u wcnc -p smgp_apps_wcnc users>wcnc_users.sql

3.导出一个数据库结构
　　mysqldump -u wcnc -p -d --add-drop-table smgp_apps_wcnc>d:wcnc_db.sql
　　-d 没有数据 --add-drop-table 在每个create语句之前增加一个drop table

4.导入数据库
　　常用source 命令
　　进入mysql数据库控制台，
　　如mysql -u root -p
　　mysql>use 数据库
　　然后使用source命令，后面参数为脚本文件(如这里用到的.sql)
　　mysql>source d:wcnc_db.sql （注：如果写成sourced:\wcnc_db.sql，就会报语法使用load data 批量导入数据,这种做法可以瞬间导入数据,用处非常大!

复制代码 代码如下:


LOAD DATA [LOW_PRIORITY | CONCURRENT] [LOCAL] INFILE \'file_name.txt\'
    [REPLACE | IGNORE]
    INTO TABLE tbl_name
    [FIELDS                               字段操作,设置每个字段的分隔符

 

        [TERMINATED BY \'string\']
        [[OPTIONALLY] ENCLOSED BY \'char\']
        [ESCAPED BY \'char\' ]
    ]
    [LINES                                行操作,从某一个字符开始,到某个字符

        [STARTING BY \'string\']
        [TERMINATED BY \'string\']
    ]
    [IGNORE number LINES]               行操作,忽略某行

    [(col_name_or_user_var,...)]        字段操作,写入的字段与数据对应

    [SET col_name = expr,...)]

示例:load data infile \'/test/test.file\' intotable \'test\' fields terminated by "\t" (fieldsOne,fieldsTwo);
意思是, 载入/test/test.file到表test中,使用\t分割字段,写入fieldsOne和fieldsTwo中,默认以换行符作为一个行分割!
```