### 【强大的Stream Api】
##【简介】
>Java8中有两大最为重要的改变。第一个是 Lambda 表达式；另外一 个则是 Stream API(java.util.stream.*)。
Stream 是 Java8 中处理集合的关键抽象概念，它可以指定你希望对集合进行的操作，可以执行非常复杂的查找、过滤和映射数据等操作。
使用Stream API 对集合数据进行操作，就类似于使用 SQL 执行的数据库查询。也可以使用 Stream API 来并行执行操作。简而言之，
Stream API 提供了一种高效且易于使用的处理数据的方式。

## 【1 - 什么是stream？】
流(Stream) 到底是什么呢？是数据渠道，用于操作数据源（集合、数组等）所生成的元素序列。
“集合讲的是数据，流讲的是计算！”       
注意：
①Stream 自己不会存储元素        
②Stream 不会改变源对象。相反，他们会返回一个持有结果的新Stream。
③Stream 操作是延迟执行的。这意味着他们会等到需要结果的时候才执行。

## 【2 - stream操作的三个步骤】
1、创建 Stream     
一个数据源（如：集合、数组），获取一个

2、中间操作      
一个中间操作链，对数据源的数据进行处理 

3、终止操作(终端操作)        
一个终止操作，执行中间操作链，并产生结果
        
数据源 --》 filter ---》map ---》。。。---》终止操作

## 【2.1 - 创建stream】
Java8 中的 Collection 接口被扩展，提供了 两个获取流的方法：
```
default Stream<E> stream() : 返回一个顺序流 

default Stream<E> parallelStream() : 返回一个并行流
```

【数组创建流】
```
Java8 中的 Arrays 的静态方法 stream() 可 以获取数组流：
static <T> Stream<T> stream(T[] array): 返回一个流
重载形式，能够处理对应基本类型的数组： 
public static IntStream stream(int[] array)         
public static LongStream stream(long[] array)         
public static DoubleStream stream(double[] array)
```

【由值创建流】
```
可以使用静态方法 Stream.of(), 通过显示值 创建一个流。它可以接收任意数量的参数。
public static<T> Stream<T> of(T... values) : 返回一个流
```
【由函数创建流：创建无限流】
```
可以使用静态方法 Stream.iterate() 和 Stream.generate(), 创建无限流。

迭代
public static<T> Stream<T> iterate(final T seed, final UnaryOperator<T> f) 

生成
public static<T> Stream<T> generate(Supplier<T> s) : 
```

## 【2.2 - stream的中间操作】
> 多个中间操作可以连接起来形成一个流水线，除非流水 线上触发终止操作，否则中间操作不会执行任何的处理！ 而在终止操作时一次性全部处理，称为“惰性求值”。

【2.2.1 筛选与切片】

方法     | 描述
-------- | ---
filter(Predicate p) | 接收 Lambda ， 从流中排除某些元素
distinct()    | 筛选，通过流所生成元素的 hashCode() 和 equals() 去 除重复元素
limit(long maxSize)    | 截断流，使其元素不超过给定数量。
skip(long n)     | 跳过元素，返回一个扔掉了前 n 个元素的流。若流中元素 不足 n 个，则返回一个空流。与 limit(n) 互补       

【2.2.2 映射】
方法     | 描述
-------- | ---
map(Function f)  | 接收一个函数作为参数，该函数会被应用到每个元 素上，并将其映射成一个新的元素。
mapToDouble(ToDoubleFunction f)    | 接收一个函数作为参数，该函数会被应用到每个元 素上，产生一个新的 DoubleStream。 
mapToInt(ToIntFunction f)    | 接收一个函数作为参数，该函数会被应用到每个元 素上，产生一个新的 IntStream
mapToLong(ToLongFunction f)    | 接收一个函数作为参数，该函数会被应用到每个元 素上，产生一个新的 LongStream
flatMap(Function f)      |  接收一个函数作为参数，将流中的每个值都换成另 一个流，然后把所有流连接成一个流

【2.2.3 排序】

方法     | 描述 
-------- | ---  
sorted()  | 产生一个新流，其中按自然顺序排序  
sorted(Comparator comp)   |  产生一个新流，其中按比较器顺序排序


## 【2.3 - Stream的终止操作】