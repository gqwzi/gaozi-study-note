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