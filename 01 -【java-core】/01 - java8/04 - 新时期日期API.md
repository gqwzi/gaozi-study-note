### 【新日期API】
### 【1-简介】
使用 LocalDate、LocalTime、LocalDateTime
> LocalDate、LocalTime、LocalDateTime 类的实 例是不可变的对象，分别表示使用 ISO-8601日 历系统的日期、时间、日期和时间。它们提供 了简单的日期或时间，并不包含当前的时间信 
息。也不包含与时区相关的信息。

Item     | Value     | Value
-------- | --- | ---
now() | 静态方法，根据当前时间创建对象 | LocalDate localDate = LocalDate.now(); LocalTime localTime = LocalTime.now(); LocalDateTime localDateTime = LocalDateTime.now();
of()    | 静态方法，根据指定日期/时间创建 对象   | LocalDate localDate = LocalDate.of(2016, 10, 26); LocalTime localTime = LocalTime.of(02, 22, 56); LocalDateTime localDateTime = LocalDateTime.of(2016, 10, 26, 12, 10, 55);
plusDays, plusWeeks, plusMonths, plusYears     | 向当前 LocalDate 对象添加几天、 几周、几个月、几年     | 
minusDays, minusWeeks, minusMonths, minusYears     |  minusMonths, minusYears从当前 LocalDate 对象减去几天、 几周、几个月、几年      | 
plusDays, plusWeeks, plusMonths, plusYears     | 向当前 LocalDate 对象添加几天、 几周、几个月、几年     | 
withDayOfMonth, withDayOfYear, withMonth, withYear      |  将月份天数、年份天数、月份、年 份修改为指定的值并返回新的 LocalDate对象 | 
getDayOfMonth     | 获得月份天数(1-31)     | 
getDayOfYear       |  获得年份天数(1-366)      | 
plus, minus      | 添加或减少一个 Duration或 Period     | 