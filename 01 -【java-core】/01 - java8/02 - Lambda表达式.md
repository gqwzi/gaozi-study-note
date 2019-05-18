### 【Lambda表达式】

01 - 为什么使用Lambda表达式?
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