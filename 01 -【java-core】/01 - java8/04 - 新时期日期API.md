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
withDayOfMonth, withDayOfYear, withMonth, withYear       |  withDayOfYear, withMonth, withYear
                                                           将月份天数、年份天数、月份、年 份修改为指定的值并返回新的 LocalDate对象     |
getDayOfMonth       |  获得月份天数(1-31)     |  
getDayOfYear       |  获得年份天数(1-366)     |  
getDayOfWeek       |  获得星期几(返回一个 DayOfWeek 枚举值)     |  
getMonth        |  获得月份, 返回一个 Month枚举值     |  
getMonthValue        |  获得月份(1-12)      |  
getYear        |  获得年份     |  
until       |  获得两个日期之间的 Period 对象， 或者指定 ChronoUnits的数字      |  
isBefore, isAfter        |  比较两个 LocalDate      |  
isLeapYear        |  判断是否是闰年     |  

### 【2 - Instant 时间】
简介：
> 用于“时间戳”的运算。它是以Unix元年(传统 的设定为UTC时区1970年1月1日午夜时分)开始 所经历的描述进行运算

### 【3 - Duration 和 Period】
简介：
>Duration:用于计算两个“时间”间隔

>Period:用于计算两个“日期”间隔


### 【4 - 日期的操纵】

- TemporalAdjuster : 时间校正器。有时我们可能需要获 取例如：将日期调整到“下个周日”等操作。
- TemporalAdjusters : 该类通过静态方法提供了大量的常 用 TemporalAdjuster 的实现。
```
例如获取下个周日：
LocalDate localDate = LocalDate.now().with(
TemporalAdjusters.next(DayOfWeek.SUNDAY);
);
```

### 【5 - 解析与格式化】
java.time.format.DateTimeFormatter 类：该类提供了三种 格式化方法：
- 预定义的标准格式
- 语言环境相关的格式
- 自定义的格式

### 【6 - 时区的处理】
- Java8 中加入了对时区的支持，带时区的时间为分别为：
ZonedDate、ZonedTime、ZonedDateTime
其中每个时区都对应着 ID，地区ID都为 “{区域}/{城市}”的格式
例如 ：Asia/Shanghai 等
ZoneId：该类中包含了所有的时区信息        
getAvailableZoneIds() : 可以获取所有时区时区信息
of(id) : 用指定的时区信息获取 ZoneId 对象

与传统日期的转换

类     | to 遗留类     | from 遗留类
-------- | --- | ---
java.time.Instant java.util.Date | Date.from(instant) | date.toInstant()
java.time.Instant java.sql.Timestamp | Timestamp.from(instant)  | timestamp.toInstant()
java.time.ZonedDateTime java.util.GregorianCalendar |  java.util.GregorianCalendar
                                                      GregorianCalendar.from(zonedDateTim e) | cal.toZonedDateTime()
java.time.LocalDate java.sql.Time | Date.valueOf(localDate)  | date.toLocalDate()
java.time.LocalTime java.sql.Time |  java.sql.Time Date.valueOf(localDate)  | date.toLocalTime()
java.time.LocalDateTime java.sql.Timestamp |  java.sql.Timestamp Timestamp.valueOf(localDateTime)  |  timestamp.toLocalDateTime()
java.time.ZoneId java.util.TimeZone | Timezone.getTimeZone(id) | timeZone.toZoneId()
java.time.format.DateTimeFormatter java.text.DateFormat | formatter.toFormat()  | 无
