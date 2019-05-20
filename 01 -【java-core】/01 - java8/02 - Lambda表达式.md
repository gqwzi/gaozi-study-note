### 【Lambda表达式】

【01 - 为什么使用Lambda表达式?】
```
Lambda 是一个匿名函数，我们可以把 Lambda
表达式理解为是一段可以传递的代码（将代码
像数据一样进行传递）。可以写出更简洁、更
灵活的代码。作为一种更紧凑的代码风格，使
Java的语言表达能力得到了提升。
```
例1 从匿名类到lambda的转换
```
---以前
Runnable run = new Runnable(){
            @Override
            public void run() {
                System.out.println("hello world");
            }
        };
----现在---
Runnable r = () -> System.out.println("hello world");        
```


-----
【02 - 基础语法】       
一、Lambda 表达式的基础语法：
```
Java8中引入了一个新的操作符 "->" 该操作符称为箭头操作符或 Lambda 操作符
箭头操作符将 Lambda 表达式拆分成两部分：
左侧：Lambda表达式的参数列表
右侧：Lambda表达式中所需要实现的功能，即Lambda体
```
语法格式一
```
无参数，无返回值
() -> System.out.println("hello world");
```
语法格式二
```
有一个参数，并且无返回值
(x) -> System.out.println("hello:" + x);
```
语法格式三
```
若只有一个参数，小括号可以省略不写
x -> System.out.println("hello:" + x);
例如：供给型
Consumer<String> con = x -> System.out.println(x);
		con.accept("abc！");
```
语法格式四
```
有两个以上的参数，有返回值，并且 Lambda 体中有多条语句
Compator<Integer> com = (x,y) -> {
System.out.println("函数式接口");
return Integer.compare(x,y);
}
```
语法格式六
```
Lambda 表达式的参数列表的数据类型可以省略不写，因为JVM编译器通过上下文可以推断出数据类型，即“类型推断”
(Integer x,Integer y) -> Integer.compare(x,y);
```

二、Lambda表达式需要函数式接口的支持       
>函数式接口：接口中只有1个抽象方法的接口，成为函数式接口。可以使用@FunctionalInterface修饰，可以检查是否是函数式接口

--- 
【03 - java8内置的4大核心函数式接口】
```
1、Comsumer<T> 消费型接口
void accept(T t);
例子：
    happy(10, x -> {
        System.out.println("媳妇每周只给我" + x +"元钱！哼~~~");
    });
    
    public void happy(Integer num ,Consumer<Integer> con){
            con.accept(num);
        }



2、Supplier<T> 供给型接口
T get();
例子：
    List numList = getNumList(10, () -> (int)(Math.random()*100));
    
    numList.forEach(x -> System.out.println("numList:"+x));
            
    public List<Integer> getNumList(int num, Supplier<Integer> sup){
        List<Integer> list = new ArrayList<>();
        for (int i = 0;i<num;i++){
            list.add(sup.get());
        }
        return list;
    }
    
    
    
    
3、Function<T,R> 函数式接口
R apply<T t>;
例子：
    String str = dealStr("helloWorld", x -> x.toUpperCase());
    System.out.println(str);

    public String dealStr(String str, Function<String,String> fun){
        return fun.apply(str);
    }




4、Predicate<T>  断言型接口
boolean test<T t>
例子：
    List<String> list = Arrays.asList("java","helloWorld","gaozi","good");
    List<String> result = assertStr(list,x -> x.length() > 4);
    result.forEach(x -> System.out.println(x));
        
    public static List<String> assertStr(List<String> list, Predicate<String> pre){
        List<String> newList = new ArrayList<>();
        list.forEach(x -> {
            if(pre.test(x)){
                newList.add(x);
            }
        });
        return newList;
    }
```
【04 - 方法引用和构造器引用】
```
一、方法引用      
若Lambda体中的功能，已经有方法提供了实现，可以使用方法引用（可以将方法引用理解为Lambda表达式的另外一种表现形式）
1、对象的引用::实例方法名
2、类名::静态方法名
3、类名::实例方法名
【注意】
1、方法引用所引用的方法的参数与列表与返回值类型，需要与函数式接口中抽象方法的参数列表和返回值类型一致！
2、若Lambda的参数列表的第一个参数，是实例方法的调用者，第二个参数（无参）是实例方法的参数时，格式：ClassName::MethodName

二、构造器引用
构造器的参数列表，需要与函数式接口中的参数列表保持一致！
1、类名::new

三、数组引用
类型[]::new;
```


例子：
```
1、数组的引用
        Function<Integer,String[]> fun = x -> new String[x];
        String[] arr1 = fun.apply(10);
        System.out.println("arr:" + arr1.length);
        //-------------------------------
        Function<Integer,People[]> fun2 = People[]::new;
        People[] arr2 = fun2.apply(20);
        System.out.println("arr2:" + arr2.length);
        
2、构造器引用
        Supplier<People> sup = () -> new People();
        People p = sup.get();
        //------
        Supplier<People> sup2 = People::new;
        People p2 = sup2.get();        
```