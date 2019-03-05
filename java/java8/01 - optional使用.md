### 【参考文章】 <https://lw900925.github.io/java/java8-optional.html>
## 【00 - 主角】 Optional
## 【01 - 目的】 解决常见的NPE异常问题        
## 【02 - 举例】 
> 以前1
```
public void bindUserToRole(User user) {
    if (user != null) {
        String roleId = user.getRoleId();
        if (roleId != null) {
            Role role = roleDao.findOne(roleId);
            if (role != null) {
                role.setUserId(user.getUserId());
                roleDao.save(role);
            }
        }
    }
}
```       
> 以前2
```
public String bindUserToRole(User user) {
    if (user == null) {
        return;
    }

    String roleId = user.getRoleId();
    if (roleId == null) {
        return;
    }

    Role = roleDao.findOne(roleId);
    if (role != null) {
        role.setUserId(user.getUserId());
        roleDao.save(role);
    }
}
```

## 【简介】        
java.util.Optional<T>类是一个封装了Optional值的容器对象，Optional值可以为null，如果值存在，调用isPresent()方法返回true，调用get()方法可以获取值。

## 【创建】        
Optional类提供类三个方法用于实例化一个Optional对象，它们分别为empty()、of()、ofNullable()，这三个方法都是静态方法，可以直接调用。           
第1种：empty()—该方法用于创建一个没有值的Optional对象：
```
Optional<String> emptyOpt = Optional.empty();
```     
备注：empty()方法创建的对象没有值，如果对emptyOpt变量调用isPresent()方法会返回false，调用get()方法抛出NullPointerException异常。   
第2种：of()—该方法使用一个非空的值创建Optional对象：
```
String str = "Hello World";
Optional<String> notNullOpt = Optional.of(str);
```
第3种：ofNullable()—该方法接收一个可以为null的值
```
Optional<String> nullableOpt = Optional.ofNullable(str);
```
备注：如果str的值为null，得到的nullableOpt是一个没有值的Optional对象 

##【使用】        
【1 - 提取Optional对象中的值】       
>以前
```
String roleId = null;
if (user != null) {
    roleId = user.getRoleId();
}
```
>现在
```
Optional<User> userOpt = Optional.ofNullable(user);
Optional<String> roleIdOpt = userOpt.map(User::getRoleId);
```
【2 - 其它方法获取值】       
```
orElse()：如果有值就返回，否则返回一个给定的值作为默认值；
orElseGet()：与orElse()方法作用类似，区别在于生成默认值的方式不同。该方法接受一个Supplier<? extends T>函数式接口参数，用于生成默认值； 
orElseThrow()：与前面介绍的get()方法类似，当值为null时调用这两个方法都会抛出NullPointerException异常，区别在于该方法可以指定抛出的异常类型。
---具体用法---
String str = "Hello World";
Optional<String> strOpt = Optional.of(str);
String orElseResult = strOpt.orElse("Hello Shanghai");
String orElseGet = strOpt.orElseGet(() -> "Hello Shanghai");
String orElseThrow = strOpt.orElseThrow(
        () -> new IllegalArgumentException("Argument 'str' cannot be null or blank."));
```
备注：此外，Optional类还提供了一个ifPresent()方法，该方法接收一个Consumer<? super T>函数式接口，一般用于将信息打印到控制台：
```
Optional<String> strOpt = Optional.of("Hello World");
strOpt.ifPresent(System.out::println);
```
【3 - 使用filter()方法过滤】
filter()方法可用于判断Optional对象是否满足给定条件，一般用于条件过滤：
```
Optional<String> optional = Optional.of("lw900925@163.com");
optional = optional.filter(str -> str.contains("164"));
```
备注：在上面的代码中，如果filter()方法中的Lambda表达式成立，filter()方法会返回当前Optional对象值，否则，返回一个值为空的Optional对象。      
## 【正确使用Optional】
示例：
坦白说，下面的代码与我们之前的使用if语句判断空值没有任何区别，没有起到Optional的正真作用
```
Optional<User> userOpt = Optional.ofNullable(user);
if (userOpt.isPresent()) {
    User user = userOpt.get();
    // do something...
} else {
    // do something...
}
```
当我们从之前版本切换到Java 8的时候，不应该还按照之前的思维方式处理null值，Java 8提倡函数式编程，新增的许多API都可以用函数式编程表示，Optional类也是其中之一。这里有几条关于Optional使用的建议：       
> 1、尽量避免在程序中直接调用Optional对象的get()和isPresent()方法；
```
第一条建议中直接调用get()方法是很危险的做法，如果Optional的值为空，那么毫无疑问会抛出NullPointerException异常，而为了调用get()方法而使用isPresent()方法作为空值检查，这种做法与传统的用if语句块做空值检查没有任何区别。
```
> 2、避免使用Optional类型声明实体类的属性；
```
第二条建议避免使用Optional作为实体类的属性，它在设计的时候就没有考虑过用来作为类的属性，如果你查看Optional的源代码，你会发现它没有实现java.io.Serializable接口，这在某些情况下是很重要的（比如你的项目中使用了某些序列化框架），使用了Optional作为实体类的属性，意味着他们不能被序列化。
```
## 【正确创建Optional】
上面提到创建Optional对象有三个方法，empty()方法比较简单，没什么特别要说明的。主要是of()和ofNullable()方法。当你很确定一个对象不可能为null的时候，应该使用of()方法，否则，尽可能使用ofNullable()方法，比如：
```
public static void method(Role role) {
    // 当Optional的值通过常量获得或者通过关键字new初始化，可以直接使用of()方法
    Optional<String> strOpt = Optional.of("Hello World");
    Optional<User> userOpt = Optional.of(new User());

    // 方法参数中role值不确定是否为null，使用ofNullable()方法创建
    Optional<Role> roleOpt = Optional.ofNullable(role);
}
```
orElse()方法的使用       
以前
```
return str != null ? str : "Hello World"
```
现在
```
return strOpt.orElse("Hello World")
```
简化if-else
以前
```
User user = ...
if (user != null) {
    String userName = user.getUserName();
    if (userName != null) {
        return userName.toUpperCase();
    } else {
        return null;
    }
} else {
    return null;
}
```
现在
```
User user = ...
Optional<User> userOpt = Optional.ofNullable(user);

return user.map(User::getUserName)
            .map(String::toUpperCase)
            .orElse(null);
```
## 【总结】
新的Optional类让我们可以以函数式编程的方式处理null值，抛弃了Java 8之前需要嵌套大量if-else代码块，使代码可读性有了很大的提高