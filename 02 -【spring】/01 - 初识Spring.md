## 1、【spring是什么】
>1、轻量级：spring是非侵入性的，基于spring开发的应用中的对象可以不依赖于Spring的API
2>依赖注入（IOC/DI）
3>面向切面编程（AOP）
4>容器：spring是一个容器，因为它包含并且管理应用对象的生命周期
5>框架：spring实现了使用简单的组件配置组合成一个辅助的应用，在spring中可以使用XML和Java注解组合这些对象
6>一站式：在IOC和AOP的基础上可以整合各种企业应用的开源框架和优秀的第三方类库（实际上Spring自身也提供了展现层的SpringMVC和持久层的Spring JDBC）

## 2、【IOC和DI】
### 2.1 【IOC和DI概念】      
> IOC(Inversion of Control)：其思想是反转资源获取的方向. 传统的资源查找方式要求组件向容器发起请求查找资源. 作为回应, 容器适时的返回资源. 而应用了 IOC 之后, 则是容器主动地将资源推送给它所管理的组件, 组件所要做的仅是选择一种合适的方式来接受资源. 这种行为也被称为查找的被动形式            


> DI(Dependency Injection) — IOC 的另一种表述方式：即组件以一些预先定义好的方式(例如: setter 方法)接受来自如容器的资源注入. 相对于 IOC 而言，这种表述更直接


### 2.2 【配置bean】
#### 2.2.1 【配置形式】
1、基于XML形式的方式        
```java
<bean id = "helloWorld"  class = "com.gaoqiangwei.spring.helloWorld">
</bean>

备注：
1、id是bean的名称，在IOC容器中是唯一的     
2、若id没有指定，spring则将全限定性类名作为Bean的名字
3、id可以指定多个名字，名字之间可用逗号、分号或者空格分隔
```
2、基于注解的方式       

#### 2.2.2 【bean的配置方式】  
```
1、通过全类名（反射）     
2、通过工厂方法（静态工厂方法和实例工厂方法）
3、factoryBean      
```

#### 2.2.3 【IOC容器的两种实现】
```
1、beanFactory  
2、applicationContext  
```
> 在 Spring IOC 容器读取 Bean 配置创建 Bean 实例之前, 必须对它进行实例化. 只有在容器实例化后, 才可以从 IOC 容器里获取 Bean 实例并使用.       

1、beanFactory       
BeanFactory是IOC 容器的基本实现

2、applicationContext        
a> 面向使用 Spring 框架的开发者，提供了更多的高级特性. 是 BeanFactory 的子接口.           
b> applicationContext的主要实现类：        
ClassPathXmlApplicationContext：从类路径下加载配置文件      
FileSystemXmlApplicationContext：从文件系统中加载配置文件        

扩展1：ConfigurableApplicationContext 扩展于 ApplicationContext，新增加两个主要方法：refresh() 和 close()， 让 ApplicationContext 具有启动、刷新和关闭上下文的能力      
扩展2：ApplicationContext 在初始化上下文时就实例化所有单例的 Bean。      
扩展3：WebApplicationContext 是专门为 WEB 应用而准备的，它允许从相对于 WEB 根目录的路径中完成初始化工作



#### 2.2.4 【依赖注入的方式】
```
1、属性注入      
2、构造器注入     
3、工厂方法注入（很少使用，不推荐）
```
1、属性注入     
```java
<bean id = "helloWorld" class = "com.gaoqiangwei.spring.helloWorld">
    <property name = "userName" value = "gaozi" />
</bean>
```
a>属性注入即通过 setter 方法注入Bean 的属性值或依赖的对象        

b>属性注入使用 <property> 元素, 使用 name 属性指定 Bean 的属性名称，value 属性或 <value> 子节点指定属性值（比如使用quarz的时候）      

c>属性注入是实际应用中最常用的注入方式

2、构造器注入     
a>通过构造方法注入Bean 的属性值或依赖的对象，它保证了 Bean 实例在实例化后就可以使用。       

b>构造器注入在 <constructor-arg> 元素里声明属性, <constructor-arg> 中没有 name 属性               
```
<bean id = "car"  class="com.gaoqiangwei.spring.helloWorld.car" >
    <constructor-arg  value = "奥迪"  index = "0"/>
    <constructor-arg  value = "奔驰"  index = "1"/>
</bean>
```

3、工厂方法注入（很少使用，不推荐）

### 2.3 【注入属性值的细节】      
a>字面值   
```
字面值：可用字符串表示的值，可以通过 <value> 元素标签或 value 属性进行注入。      
基本数据类型及其封装类、String 等类型都可以采取字面值注入的方式     
若字面值中包含特殊字符，可以使用 <![CDATA[]]> 把字面值包裹起来。     
```
b>引用其它 Bean     
```
1. 组成应用程序的 Bean 经常需要相互协作以完成应用程序的功能. 要使 Bean 能够相互访问, 就必须在 Bean 配置文件中指定对 Bean 的引用        
2. 在 Bean 的配置文件中, 可以通过 <ref> 元素或 ref  属性为 Bean 的属性或构造器参数指定对 Bean 的引用.       
3. 也可以在属性或构造器里包含 Bean 的声明, 这样的 Bean 称为内部 Bean      
``` 
c>内部 Bean``
```
1. 当 Bean 实例仅仅给一个特定的属性使用时, 可以将其声明为内部 Bean. 内部 Bean 声明直接包含在 <property> 或 <constructor-arg> 元素里, 不需要设置任何 id 或 name 属性      
2. 内部 Bean 不能使用在任何其他地方
````        
d>注入参数详解：null 值和级联属性        
```java
1. 可以使用专用的 <null/> 元素标签为 Bean 的字符串或其它对象类型的属性注入 null 值      
2. 和 Struts、Hiberante 等框架一样，Spring 支持级联属性的配置。      
```
e>集合属性
```java
1. 在 Spring中可以通过一组内置的 xml 标签(例如: <list>, <set> 或 <map>) 来配置集合属性.
2. 配置 java.util.List 类型的属性, 需要指定 <list>  标签, 在标签里包含一些元素. 这些标签可以通过 <value> 指定简单的常量值, 通过 <ref> 指定对其他 Bean 的引用. 通过<bean> 指定内置 Bean 定义. 通过 <null/> 指定空元素. 甚至可以内嵌其他集合.
3. 数组的定义和 List 一样, 都使用 <list>
4. 配置 java.util.Set 需要使用 <set> 标签, 定义元素的方法与 List 一样.
5. Java.util.Map 通过 <map> 标签定义, <map> 标签里可以使用多个 <entry> 作为子标签. 每个条目包含一个键和一个值. 
必须在 <key> 标签里定义键
6. 因为键和值的类型没有限制, 所以可以自由地为它们指定 <value>, <ref>, <bean> 或 <null> 元素. 
7. 可以将 Map 的键和值作为 <entry> 的属性定义: 简单常量使用 key 和 value 来定义; Bean 引用通过 key-ref 和 value-ref 属性定义
8. 使用 <props> 定义 java.util.Properties, 该标签使用多个 <prop> 作为子标签. 每个 <prop> 标签必须定义 key 属性. 
```
f>使用 utility scheme 定义集合        
```java
1.使用基本的集合标签定义集合时, 不能将集合作为独立的 Bean 定义, 导致其他 Bean 无法引用该集合, 所以无法在不同 Bean 之间共享集合.       
2.可以使用 util schema 里的集合标签定义独立的集合 Bean. 需要注意的是, 必须在 <beans> 根元素里添加 util schema 定义
```     
g>使用 p 命名空间
```java
1. 为了简化 XML 文件的配置，越来越多的 XML 文件采用属性而非子元素配置信息。     
2. Spring 从 2.5 版本开始引入了一个新的 p 命名空间，可以通过 <bean> 元素属性的方式配置 Bean 的属性。
3. 使用 p 命名空间后，基于 XML 的配置方式将进一步简化        
```     

### 2.5 【自动装配】
```java
1、byType (根据类型自动装配)
2、byName(根据名称自动装配)
3、constructor(通过构造器自动装配)（不推荐）
```
1、byType(根据类型自动装配): 若 IOC 容器中有多个与目标 Bean 类型一致的 Bean. 在这种情况下, Spring 将无法判定哪个 Bean 最合适该属性, 所以不能执行自动装配.        

2、byName(根据名称自动装配): 必须将目标 Bean 的名称和属性名设置的完全相同.      

3、constructor(通过构造器自动装配): 当 Bean 中存在多个构造器时, 此种自动装配方式将会很复杂. 不推荐使用    

[备注]  XML 配置里的 Bean 自动装配的缺点
```java
1. 在 Bean 配置文件里设置 autowire 属性进行自动装配将会装配 Bean 的所有属性. 然而, 若只希望装配个别属性时, autowire 属性就不够灵活了. 
2. autowire 属性要么根据类型自动装配, 要么根据名称自动装配, 不能两者兼而有之.
3. 一般情况下，在实际的项目中很少使用自动装配功能，因为和自动装配功能所带来的好处比起来，明确清晰的配置文档更有说服力一些

```

### 2.6 【bean之间的关系】
```java
1、继承 Bean 配置
2、依赖 Bean 配置
```
1、继承 Bean 配置        
```java
1. Spring 允许继承 bean 的配置, 被继承的 bean 称为父 bean. 继承这个父 Bean 的 Bean 称为子 Bean
2. 子 Bean 从父 Bean 中继承配置, 包括 Bean 的属性配置
3. 子 Bean 也可以覆盖从父 Bean 继承过来的配置
4. 父 Bean 可以作为配置模板, 也可以作为 Bean 实例. 若只想把父 Bean 作为模板, 可以设置 <bean> 的abstract 属性为 true, 这样 Spring 将不会实例化这个 Bean
5. 并不是 <bean> 元素里的所有属性都会被继承. 比如: autowire, abstract 等.
6. 也可以忽略父 Bean 的 class 属性, 让子 Bean 指定自己的类, 而共享相同的属性配置. 但此时 abstract 必须设为 true
```
2、依赖 Bean 配置
```java
1. Spring 允许用户通过 depends-on 属性设定 Bean 前置依赖的Bean，前置依赖的 Bean 会在本 Bean 实例化之前创建好
2. 如果前置依赖于多个 Bean，则可以通过逗号，空格或的方式配置 Bean 的名称
```

### 2.7 【bean的作用域】
> （a）在 Spring 中, 可以在 <bean> 元素的 scope 属性里设置 Bean 的作用域.              
（b）默认情况下, Spring 只为每个在 IOC 容器里声明的 Bean 创建唯一一个实例, 整个 IOC 容器范围内都能共享该实例：所有后续的 getBean() 调用和 Bean 引用都将返回这个唯一的 Bean 实例.该作用域被称为 singleton, 它是所有 Bean 的默认作用域.

类别                                         说明      
------图链接-----
                  
### 2.8 【使用外部属性文件】
1. 在配置文件里配置 Bean 时, 有时需要在 Bean 的配置里混入系统部署的细节信息(例如: 文件路径,
   数据源配置信息等). 而这些部署细节实际上需要和 Bean 配置相分离        

2. Spring 提供了一个 PropertyPlaceholderConfigurer 的 BeanFactory 后置处理器, 
   这个处理器允许用户将 Bean 配置的部分内容外移到属性文件中. 可以在 Bean 配置文件里使用形式为 ${var} 的变量, PropertyPlaceholderConfigurer 从属性文件里加载属性, 并使用这些属性来替换变量.     

3. Spring 还允许在属性文件中使用 ${propName}，以实现属性之间的相互引用。
```java
<context:porperty-placeholder 
   location = "classpath:db.properties"/>
```

### 2.8 【IOC容器中bean的生命周期】       
1、 Spring IOC 容器可以管理 Bean 的生命周期, Spring 允许在 Bean 生命周期的特定点执行定制的任务.       
2、Spring IOC 容器对 Bean 的生命周期进行管理的过程:
```java
1. 通过构造器或工厂方法创建 Bean 实例
2. 为 Bean 的属性设置值和对其他 Bean 的引用
3. 调用 Bean 的初始化方法
4. Bean 可以使用了
5. 当容器关闭时, 调用 Bean 的销毁方法   
```
3、在 Bean 的声明里设置 init-method 和 destroy-method 属性, 为 Bean 指定初始化和销毁方法.     

【扩展】   
a>创建 Bean 后置处理器       
1、Bean 后置处理器允许在调用初始化方法前后对 Bean 进行额外的处理.     
2、Bean 后置处理器对 IOC 容器里的所有 Bean 实例逐一处理, 而非单一实例. 其典型应用是: 检查 Bean 属性的正确性或根据特定的标准更改 Bean 的属性.        
3、对Bean 后置处理器而言, 需要实现BeanPostProcesser接口. 在初始化方法被调用前后, Spring 将把每个 Bean 实例分别传递给上述接口的以下两个方法:

b>添加 Bean 后置处理器后 Bean 的生命周期 
```java
1.通过构造器或工厂方法创建 Bean 实例
2.为 Bean 的属性设置值和对其他 Bean 的引用
3.将 Bean 实例传递给 Bean 后置处理器的 postProcessBeforeInitialization 方法
4.调用 Bean 的初始化方法
5.将 Bean 实例传递给 Bean 后置处理器的 postProcessAfterInitialization方法
6.Bean 可以使用了
7.当容器关闭时, 调用 Bean 的销毁方法
```


## 3、【AOP】
### 3.1 【AOP前奏】
需求1-日志：在程序执行期间追踪正在发生的活动     
需求2-验证：希望计算器只能处理正数的运算       

存在问题：   
1、代码混乱：越来越多的非业务需求(日志和验证等)加入后, 原有的业务方法急剧膨胀.  每个方法在处理核心逻辑的同时还必须兼顾其他多个关注点.         
2、代码分散: 以日志需求为例, 只是为了满足这个单一需求, 就不得不在多个模块（方法）里多次重复相同的日志代码. 如果日志需求发生变化, 必须修改所有模块.


### 3.2 【AOP简介】
> AOP(Aspect-Oriented Programming, 面向切面编程): 是一种新的方法论, 是对传统 OOP(Object-Oriented Programming, 面向对象编程) 的补充      
> AOP 的主要编程对象是切面(aspect), 而切面模块化横切关注点.
> 在应用 AOP 编程时, 仍然需要定义公共功能, 但可以明确的定义这个功能在哪里, 以什么方式应用, 并且不必修改受影响的类. 这样一来横切关注点就被模块化到特殊的对象(切面)里              
> AOP 的好处:  1、每个事物逻辑位于一个位置, 代码不分散, 便于维护和升级
2、业务模块更简洁, 只包含核心业务代码.   

### 3.3 【术语】
    切面(Aspect):  横切关注点(跨越应用程序多个模块的功能)被模块化的特殊对象
    通知(Advice):  切面必须要完成的工作
    目标(Target): 被通知的对象
    代理(Proxy): 向目标对象应用通知之后创建的对象
    连接点（Joinpoint）：程序执行的某个特定位置：如类某个方法调用前、调用后、方法抛出异常后等。连接点由两个信息确定：方法表示的程序执行点；相对点表示的方位。例如 ArithmethicCalculator#add() 方法执行前的连接点，执行点为 ArithmethicCalculator#add()； 方位为该方法执行前的位置
    切点（pointcut）：每个类都拥有多个连接点：例如 ArithmethicCalculator 的所有方法实际上都是连接点，即连接点是程序类中客观存在的事务。AOP 通过切点定位到特定的连接点。类比：连接点相当于数据库中的记录，切点相当于查询条件。切点和连接点不是一对一的关系，一个切点匹配多个连接点，切点通过 org.springframework.aop.Pointcut 接口进行描述，它使用类和方法作为连接点的查询条件。

### 3.4 【在spring中启用aspectJ注解支持】
    1、要在 Spring 应用中使用 AspectJ 注解, 必须在 classpath 下包含 AspectJ 类库: aopalliance.jar、aspectj.weaver.jar 和 spring-aspects.jar
    2、将 aop Schema 添加到 <beans> 根元素中.
    3、要在 Spring IOC 容器中启用 AspectJ 注解支持, 只要在 Bean 配置文件中定义一个空的 XML 元素 <aop:aspectj-autoproxy>
    4、当 Spring IOC 容器侦测到 Bean 配置文件中的 <aop:aspectj-autoproxy> 元素时, 会自动为与 AspectJ 切面匹配的 Bean 创建代理.

### 3.5 【用 AspectJ 注解声明切面】
    1、要在 Spring 中声明 AspectJ 切面, 只需要在 IOC 容器中将切面声明为 Bean 实例. 当在 Spring IOC 容器中初始化 AspectJ 切面之后, Spring IOC 容器就会为那些与 AspectJ 切面相匹配的 Bean 创建代理.
    2、在 AspectJ 注解中, 切面只是一个带有 @Aspect 注解的 Java 类. 
    3、通知是标注有某种注解的简单的 Java 方法.
    4、AspectJ 支持 5 种类型的通知注解: 
      @Before: 前置通知, 在方法执行之前执行
      @After: 后置通知, 在方法执行之后执行 
      @AfterRunning: 返回通知, 在方法返回结果之后执行
      @AfterThrowing: 异常通知, 在方法抛出异常之后
      @Around: 环绕通知, 围绕着方法执行


### 3.6 【特殊说明~环绕通知】
    1、环绕通知是所有通知类型中功能最为强大的, 能够全面地控制连接点. 甚至可以控制是否执行连接点.
    2、对于环绕通知来说, 连接点的参数类型必须是 ProceedingJoinPoint . 它是 JoinPoint 的子接口, 允许控制何时执行, 是否执行连接点.
    3、在环绕通知中需要明确调用 ProceedingJoinPoint 的 proceed() 方法来执行被代理的方法. 如果忘记这样做就会导致通知被执行了, 但目标方法没有被执行.
    4、注意: 环绕通知的方法需要返回目标方法执行之后的结果, 即调用 joinPoint.proceed(); 的返回值, 否则会出现空指针异常


### 3.7【指定切面优先级】
    1、在同一个连接点上应用不止一个切面时, 除非明确指定, 否则它们的优先级是不确定的.
    2、切面的优先级可以通过实现 Ordered 接口或利用 @Order 注解指定.
    3、实现 Ordered 接口, getOrder() 方法的返回值越小, 优先级越高.
    4、若使用 @Order 注解, 序号出现在注解中


### 3.8 【重用切入点】
    1、在编写 AspectJ 切面时, 可以直接在通知注解中书写切入点表达式. 但同一个切点表达式可能会在多个通知中重复出现.
    2、在 AspectJ 切面中, 可以通过 @Pointcut 注解将一个切入点声明成简单的方法. 切入点的方法体通常是空的, 因为将切入点定义与应用程序逻辑混在一起是不合理的. 
    3、切入点方法的访问控制符同时也控制着这个切入点的可见性. 如果切入点要在多个切面中共用, 最好将它们集中在一个公共的类中. 在这种情况下, 它们必须被声明为 public. 在引入这个切入点时, 必须将类名也包括在内. 如果类没有与这个切面放在同一个包中, 还必须包含包名.
    4、其他通知可以通过方法名称引入该切入点.
    
示例代码
```java
@Pointout("execution(* *.*(..))")
private void loggingOperate();

@Before("loggingOperate()")
private void before(Jointpoint joinPoint){
    xxx
}

@AfterReturning(pointCut = "loggingOperate()",return = "result")
private void after(Jointpoint joinPoint,Object result){
    xxx
}
```

### 3.9 【基于XML的配置声明切面】
1、除了使用 AspectJ 注解声明切面, Spring 也支持在 Bean 配置文件中声明切面. 这种声明是通过 aop schema 中的 XML 元素完成的.     
2、正常情况下, 基于注解的声明要优先于基于 XML 的声明. 通过 AspectJ 注解, 切面可以与 AspectJ 兼容, 而基于 XML 的配置则是 Spring 专有的. 由于 AspectJ 得到越来越多的 AOP 框架支持, 所以以注解风格编写的切面将会有更多重用的机会.

基于XML声明切面

    1、当使用 XML 声明切面时, 需要在 <beans> 根元素中导入 aop Schema
    2、在 Bean 配置文件中, 所有的 Spring AOP 配置都必须定义在 <aop:config> 元素内部. 对于每个切面而言, 都要创建一个 <aop:aspect> 元素来为具体的切面实现引用后端 Bean 实例. 
    3、切面 Bean 必须有一个标示符, 供 <aop:aspect> 元素引用

基于XML声明切入点

    1、切入点使用 <aop:pointcut> 元素声明
    2、切入点必须定义在 <aop:aspect> 元素下, 或者直接定义在 <aop:config> 元素下.
    3、定义在 <aop:aspect> 元素下: 只对当前切面有效
    4、定义在 <aop:config> 元素下: 对所有切面都有效
    5、基于 XML 的 AOP 配置不允许在切入点表达式中用名称引用其他切入点. 

基于XML声明通知

    在 aop Schema 中, 每种通知类型都对应一个特定的 XML 元素. 
    通知元素需要使用 <pointcut-ref> 来引用切入点, 或用 <pointcut> 直接嵌入切入点表达式.  method 属性指定切面类中通知方法的名称.

## 4、【spring中的事务管理】     
### 4.1、【事务简介】      
事务用来确保数据的完整性和一致性。事务就是一些列的动作，它们被当做一个单独的工作单元，这些动作要么全部完成，要么全部不起作用。
### 4.2、【事务的4个属性】
>1、原子性（atomicity）：事务是一个原子操作，由一系列动作组成. 事务的原子性确保动作要么全部完成要么完全不起作用  .

>2、一致性(consistency)：一旦所有事务动作完成, 事务就被提交. 数据和资源就处于一种满足业务规则的一致性状态中

>3、隔离性(isolation)：可能有许多事务会同时处理相同的数据, 因此每个事物都应该与其他事务隔离开来, 防止数据损坏.

>4、持久性(durability)：一旦事务完成, 无论发生什么系统错误, 它的结果都不应该受到影响. 通常情况下, 事务的结果被写到持久化存储器中.
### 4.3、【spring中的事务管理】
    1、编程式事务管理
    将事务管理代码嵌入到业务方法中来控制事务的提交和回滚. 在编程式管理事务时, 
    必须在每个事务操作中包含额外的事务管理代码. 
    
    2、声明式事务管理
    大多数情况下比编程式事务管理更好用. 
    它将事务管理代码从业务方法中分离出来, 以声明的方式来实现事务管理. 
    事务管理作为一种横切关注点, 可以通过 AOP 方法模块化. Spring 通过 Spring AOP 框架支持声明式事务管理.
    
### 4.4、【用事务通知声明式地管理事务】
1、事务管理是一种横切关注点  
2、为了在 Spring 2.x 中启用声明式事务管理, 可以通过 tx Schema 中定义的 <tx:advice> 元素声明事务通知, 为此必须事先将这个 Schema 定义添加到 <beans> 根元素中去.    
3、声明了事务通知后, 就需要将它与切入点关联起来. 由于事务通知是在 <aop:config> 元素外部声明的, 所以它无法直接与切入点产生关联. 所以必须在 <aop:config> 元素中声明一个增强器通知与切入点关联起来              
4、【注意】由于 Spring AOP 是基于代理的方法, 所以只能增强公共方法. 因此, 只有公有方法才能通过 Spring AOP 进行事务管理.

### 4.5、【用@Transactional注解声明式的声明事务】
1、除了在带有切入点, 通知和增强器的 Bean 配置文件中声明事务外, Spring 还允许简单地用 @Transactional 注解来标注事务方法.       
2、为了将方法定义为支持事务处理的, 可以为方法添加 @Transactional 注解. 根据 Spring AOP 基于代理机制, 只能标注公有方法.   
3、可以在方法或者类级别上添加 @Transactional 注解. 当把这个注解应用到类上时, 这个类中的所有公共方法都会被定义成支持事务处理的.  
4、在 Bean 配置文件中只需要启用 <tx:annotation-driven> 元素, 并为之指定事务管理器就可以了.  
5、如果事务处理器的名称是 transactionManager, 就可以在<tx:annotation-driven> 元素中省略 transaction-manager 属性. 这个元素会自动检测该名称的事务处理器.      

### 4.6、【事务的传播属性】
1、简介：当事务方法被另一个事务方法调用时, 必须指定事务应该如何传播. 例如: 方法可能继续在现有事务中运行, 也可能开启一个新事务, 并在自己的事务中运行.    
2、sping支持的7种事务传播行为
传播属性                    描述
REQUIRED                    如果存在一个事务，则支持当前事务。如果没有事务则开启一个新的事务。 
REQUIRES_NEW                如果一个事务已经存在，则先将这个存在的事务挂起。 它会开启一个新的事务  
SUPPORTS                    如果存在一个事务，支持当前事务。如果没有事务，则非事务的执行。但是对于事务同步的事务管理器，PROPAGATION_SUPPORTS与不使用事务有少许不同。 
NOT_SUPPORTED               当前的方法不应该运行在事务中。如果有运行的事务，则将它挂起
MANDATORY                   当前的方法必须运行在事务内部，如果没有正在运行的事务，则跑出异常
NEVER                       当前的方法不应该运行在事务中，如果有运行的事务，则抛出异常
NESTED                      如果有事务在运行，当前的方法就应该在这个事务的嵌套事务内运行，否则，就启动一个新事务，并在它自己的事务内运行。

### 4.7、【事务的隔离级别】
1、简介    
1>从理论上来说, 事务应该彼此完全隔离, 以避免并发事务所导致的问题. 然而, 那样会对性能产生极大的影响, 因为事务必须按顺序运行。    
2>在实际开发中, 为了提升性能, 事务会以较低的隔离级别运行.    
3>事务的隔离级别可以通过隔离事务属性指定

2、spring支持的事务隔离级别
隔离级别            描述
DEFAULT             
READ_UNCOMMITED
READ_COMMITED
REPEATABLE_READ 
SERIALIZABLE
额外
1>事务的隔离级别要得到底层数据库引擎的支持, 而不是应用程序或者框架的支持. 
2>Oracle 支持的 2 种事务隔离级别：READ_COMMITED , SERIALIZABLE
  Mysql 支持 4 中事务隔离级别.


    