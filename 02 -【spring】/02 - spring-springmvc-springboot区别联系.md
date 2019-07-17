### 0、【前言】
最重要的是Spring，Spring MVC和Spring Boot不会矛盾。他们很好的解决了不同的问题。

### 1、【一、Spring框架解决的核心问题是什么？】
好好想想，Spring Framework解决了什么问题？       
```
Spring Framework最重要的特性是依赖注入
所有Spring模块的核心是依赖注入或IOC控制反转
```
为什么这很重要？因为，当正确使用DI或IOC时，我们可以开发松耦合的应用程序。松耦合的应用程序可以很方便进行单元测试。

举个简单的例子。

### 2、【没有依赖注入的示例】
请考虑以下示例：WelcomeController依赖于WelcomeService来获取欢迎消息。它是如何获取WelcomeService实例的？      
```
WelcomeService service = new WelcomeService();
```
它正在创建它的一个实例，这意味着他们紧密相连。例如：如果我在WelcomeController的单元测试中为WelcomeService创建一个模拟器，我如何使用模mock创建WelcomeController？没那么简单！        
```
@RestController
public class WelcomeController {
    private WelcomeService service = new WelcomeService();
    @RequestMapping("/welcome")
    public String welcome() {
        return service.retrieveWelcomeMessage();
    }
}
```

### 3、【相同的示例使用依赖注入】
依赖注入使世界看起来更简单。Spring Framework为你做了很多艰难的工作。我们只使用两个简单的注解：@Component和@Autowired。
使用@Component告诉Spring Framework：这是一个你需要管理的bean。
使用@Autowired告诉Spring Framework：找到这个特定类型的正确匹配并自动装配它。
在下面的示例中，Spring框架将为WelcomeService创建一个bean，并将其自动装入WelcomeController。
在单元测试中，我可以要求Spring框架将WelcomeService的模拟自动连接到WelcomeController。（Spring Boot使用@MockBean可以很容易地做到这一点。但是，这是另外一件事了！）

```
@Component
public class WelcomeService {
    //Bla Bla Bla
}
@RestController
public class WelcomeController {
    @Autowired
    private WelcomeService service;
    @RequestMapping("/welcome")
    public String welcome() {
        return service.retrieveWelcomeMessage();
    }
}
```

### 4、【Spring Framework还能解决什么问题？】       
问题1：减少样板代码      
Spring Framework停止了依赖注入？不。许多Spring模块建立在依赖注入的核心概念之上：     
- Spring JDBC
- Spring MVC
- Spring AOP
- Spring ORM
- Spring JMS
- Spring Test

仔细想想Spring JMS和Spring JDBC。     
这些模块是否带来了任何新功能？并没有！我们可以使用J2EE或Java EE完成所有这些工作。那么，它们带来了什么？它们带来了简单的抽象。这些抽象的目的是为了：     
- 减少样版代码/减少重复
- 促进解耦/增加单元可测试性     
例如，与传统的JDBC或JMS相比，使用JDBCTemplate或JMSTemplate所需的代码要少得多。      

问题2：与其他框架的良好集成      
Spring Framework的优点在于它不会尝试解决已经解决的问题。它所做的就是提供与框架的完美集成，从而提供出色的解决方案。       
- Hibernate for ORM
- iBatis for Object Mapping
- JUnit和Mockito进行单元测试

### 5、【Spring MVC框架解决的核心问题是什么？】     
Spring MVC Framewrok提供了开发Web应用程序的分离方式。使用Dispatcher Servlet,ModelAndView,View Resolver等概念，可以轻松开发Web应用程序      


### 6、【我们为什么需要springboot？】      
基于Spring的应用程序有很多配置。当我们使用Spring MVC时，我们需要配置组件扫描(component scan)，dispatcher servlet，视图解析器(View Resolver)，Web jar（用于提供静态内容）等。      
```
<bean
        class="org.springframework.web.servlet.view.InternalResourceViewResolver">
        <property name="prefix">
            <value>/WEB-INF/views/</value>
        </property>
        <property name="suffix">
            <value>.jsp</value>
        </property>
  </bean>
  <mvc:resources mapping="/webjars/**" location="/webjars/"/>
```

下面的代码片段显示了Web应用程序中调度程序servlet的典型配置。     
```
<servlet>
        <servlet-name>dispatcher</servlet-name>
        <servlet-class>
            org.springframework.web.servlet.DispatcherServlet
        </servlet-class>
        <init-param>
            <param-name>contextConfigLocation</param-name>
            <param-value>/WEB-INF/todo-servlet.xml</param-value>
        </init-param>
        <load-on-startup>1</load-on-startup>
    </servlet>
    <servlet-mapping>
        <servlet-name>dispatcher</servlet-name>
        <url-pattern>/</url-pattern>
    </servlet-mapping>
```

当我们使用Hibernate/JPA时，我们需要配置数据源（datasource），实体管理器工厂(entity manager factory)，事务管理器(transaction manager)等众多其他事物。        

````
<bean id="dataSource" class="com.mchange.v2.c3p0.ComboPooledDataSource"
        destroy-method="close">
        <property name="driverClass" value="${db.driver}" />
        <property name="jdbcUrl" value="${db.url}" />
        <property name="user" value="${db.username}" />
        <property name="password" value="${db.password}" />
    </bean>
    <jdbc:initialize-database data-source="dataSource">
        <jdbc:script location="classpath:config/schema.sql" />
        <jdbc:script location="classpath:config/data.sql" />
    </jdbc:initialize-database>
    <bean
        class="org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean"
        id="entityManagerFactory">
        <property name="persistenceUnitName" value="hsql_pu" />
        <property name="dataSource" ref="dataSource" />
    </bean>
    <bean id="transactionManager" class="org.springframework.orm.jpa.JpaTransactionManager">
        <property name="entityManagerFactory" ref="entityManagerFactory" />
        <property name="dataSource" ref="dataSource" />
    </bean>
    <tx:annotation-driven transaction-manager="transactionManager"/>
````

问题1：Spring Boot自动配置：我们能有不同的想法吗？     
Spring Boot带来了一个全新的思维过程:        
```
我们能在这方面思考更深入吗?
当spring mvc jar被添加到应用程序中时，我们可以自动配置一些bean吗?
```
- 如果Hibernate jar在classpath上，自动配置数据源怎么样？      
- 如果Spring MVC jar在classpath上，那么自动配置Dispatcher Servlet怎么样?

这将有规定会覆盖默认的自动配置。        
```
Spring Boot查看应用的CLASSPATH已存在的配置，基于这些，SpringBoot提供应用程序中框架所需要的这些基本配置。这被称为自动装配（Auto Configuration）
```

问题2：Spring Boot Starter项目：围绕众所周知的模式构建       

假设我们想开发一个Web应用程序。       

首先，我们需要确定我们想要使用的框架，使用哪些框架版本以及如何将它们连接在一起。所有Web应用程序都有类似的需求。下面列出了我们在Spring MVC课程中使用的一些依赖项。这些包括Spring MVC，Jackson Databind（用于数据绑定），Hibernate-Validator（用于使用Java Validation API的服务器端验证）和Log4j（用于日志记录）。在创建此课程时，我们必须选择所有这些框架的兼容版本。
```
<dependency>
   <groupId>org.springframework</groupId>
   <artifactId>spring-webmvc</artifactId>
   <version>4.2.2.RELEASE</version>
</dependency>
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
    <version>2.5.3</version>
</dependency>
<dependency>
    <groupId>org.hibernate</groupId>
    <artifactId>hibernate-validator</artifactId>
    <version>5.0.2.Final</version>
</dependency>
<dependency>
    <groupId>log4j</groupId>
    <artifactId>log4j</artifactId>
    <version>1.2.17</version>
</dependency>
```
以下是Spring Boot文档中关于starter的内容.
如果您想开发Web应用程序或应用程序来公开restful服务，Spring Boot Start Web是首选。使用Spring Initializr创建一个使用Spring Boot Starter Web的快速项目。
Spring Boot Starter Web的依赖关系

```
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```
依赖关系可分为：        
- Spring：核心，bean，context，aop
- Web MVC :( Spring MVC）
- JackSon：用于JSON绑定
- Validation：Hibernate验证器，验证API
- 嵌入式Servlet容器：Tomcat
- Logging：logback，slf4j


任何典型的Web应用程序都将使用所有这些依赖项。Spring Boot Starter Web预装了这些。作为开发人员，我不需要担心这些依赖项或它们的兼容版本。        

### 7、【Spring Boot Starter项目选项】     
正如我们从Spring Boot Starter Web中看到的那样，入门项目帮助我们快速开始开发特定类型的应用程序。     
- spring-boot-starter-web-services：SOAP Web服务
- spring-boot-starter-web：Web和RESTful应用程序
- spring-boot-starter-test：单元测试和集成测试
- spring-boot-starter-jdbc：传统的JDBC
- spring-boot-starter-hateoas：为您的服务添加HATEOAS功能
- spring-boot-starter-security：使用Spring Security进行身份验证和授权
- spring-boot-starter-data-jpa：带有Hibernate的Spring Data JPA
- spring-boot-starter-cache：启用Spring Framework的缓存支持
- spring-boot-starter-data-rest：使用Spring Data REST公开简单REST服务

### 8、【Spring Boot的其他目标】        
一些技术性的starter:      
- spring-boot-starter-actuator：使用开箱即用的监控和跟踪等高级功能
- spring-boot-starter-undertow，spring-boot-starter-jetty，spring-boot- starter-tomcat：选择特定的嵌入式Servlet容器
- spring-boot-starter-logging：用于使用logback进行日志记录
- spring-boot-starter-log4j2：使用Log4j2进行日志记录

Spring Boot旨在快速实现生产就绪应用程序。      
- Actuator：启用高级监控和跟踪应用程序。
- 嵌入式服务器集成：由于服务器已集成到应用程序中，因此我需要在服务器上安装单独的应用程序服务器。
- 默认错误处理

【参考】https://www.jianshu.com/p/3fdb6a9dd7bc