1.引子        
近期遇到一个需求场景，微服务场景中无侵入的采集java程序的各种运行信息(方法调用流量信息、异常栈信息等)，spring系程序员的我自然想到了spring aop在方法前、中、抛异常时采集相关信息。用Spring AOP的方法确实可以采集信息，但是无法做到无侵入，必须预先写好代码-编译-发布后才能正常运行与采集。

而且现有微服务们正在运行，不可能大批量的修改代码再进行重启发布。我们的需求呼之欲出：无侵入+运行时仍能生效。好在Java语言强大而饱满，早在JDK5和JDK6时已经提供了解决此问题的技术手段：Javaagent技术。(相见恨晚啊)。本文初次窥探下Javaagent技术并使用Javaagent(agentmain方式)、VirtualMachine、Javaassist实现在某个方法前后进行打印输出。

2.简介
demo涉及Javaagent、VirtualMachine、Javaassist技术，简单总结下用到的内容。(如有理解不到位的，望不吝赐教）

Javaagent：javaagent通常可理解为一个“插件”，本质是一个精心提供的jar文件，我们精心的编码在其中描写需要进行的操作，这些操作通过java.lang.Instrument包提供的API进行Java应用程序的Instrument(这里我理解为用Java代码装备，用于装备的Java代码可以进行任何和规矩的操作)

java.lang.instrument：JDK1.5之后提供的用于装备Java应用程序的工具API，允许JavaAgent程序Instrument(装备)在JVM上运行的应用程序，通常的做法是提供方法用于在字节码中插入要执行的附加代码。JDK1.6后提供两种实现：命令行(-javaagent)形式在应用程序启动前处理(premain方式)；在应用程序启动后的某个时机处理(agentmain方式)。

Instrumentation：此类提供能够Instrument(装备)Java代码的服务方法。启动Agent机制时，Instrumentation对象会被传递给premain或者agentmain方法。

ClassFileTransformer：JavaAgent的代码中需要提供一个它的实现类，以进行自定义的字节码转换。

VirtualMachine：com.sun.tools.VirtualMachine代表一个已经附加(attach)到别的VM(目标JVM)上的VM。在本文章中我们使用attach(pid)的方法获得VirtualMachine。此后调用loadagent方法将javaagent的jar加载到目标JVM中。此类是实现运行时仍能生效的关键。

Javaassist：它是一个处理Java字节码类库。能允许在Java程序运行时定义类，并能在JVM加载类时修改类文件。重要的是其提供两种级别的API：源代码级别和字节码级别。使用源代码级别的API可以向编写Java源码一样修改类文件，Javaassist会进行即时编译。

3.demo编写
这里我采用agentmain方式编写demo，即上文中说明的在应用程序启动后的某个时机进行代码的instrument。demo的整体架构图如下：

demo架构图
我们需要准备一个应用程序运行在目标虚拟机中(demo-spring)、需要一个javaagent.jar作为要instrument的代码、最后需要一个进程在demo-spring启动后将javaagent.jar装载到目标虚拟机(JavaDetect)。

3.1 Javaagent

在代码启动后进行agent的织入与instrument，我们需要进行如下步骤

(1) 编写一个包含一个agentmain方法的类，javaagent.jar包被加载到目标JVM后，JVM会invoke这个agentmain方法传入Instrumentation对象，Instrumentation提供字节码修改的机制。

agentmain方法
instrumentation.addTransformer()第一个参数要求传入一个ClassFileTransformer的实现类。ClassFileTransformer的transform方法在类被加载、redefine或者指定canRetransform参数为true类被retransform时会被调用。第二个参数指定是否可以retransform类。

下面的处理，我要对指定的类进行代码的织入，因此调用getAllLoadedClasses()获取所有加载的类，之后进行过滤

（2）接着实现ClassFileTransformer的实现类，在这个类中进行字节码的转换织入代码

ClassFileTransformer实现类
在本段代码中引入了Javaassist技术，引入其Jar包即可使用。简单介绍下其重要的类：

CtClass: compile-time class，一个实例可以用来操作一个class文件

ClassPool：ClassPool是缓存CtClass对象的容器，所有的CtClass对象都在ClassPool中。所以，CtClass对象很多时，ClassPool会消耗很大的内存，为了避免内存的消耗，创建ClassPool对象时可以使用单例模式，或者对于CtClass对象，调用detach方法将其从ClassPool中移除。

CtBehavior：代表一个方法、构造器或者一个静态构造器

因此使用Javaassist进行字节码的改变与织入，可以遵循以下的步骤

A.创建ClassPool，ClassPool.getDefault()

B.获取CtClass，ClassPool.makeClass()

C.获取要操作的方法CtBehavior，CtClass.getDeclaredBehaviors()

D.进行方法字节码修改：CtBehavior.insertBefore()

E.从ClassPool中移除CtClass，防止内存溢出：CtClass.detach()

（3）上述两步骤即可完成Javaagent代码的编写，但是要进行能够正常运行，需要在META-INF/MANIFREST.MF文件中配置Agent-Class。采用Maven构建项目可通过Maven打包生成，如下：

maven构建MANIFEST.MF
或者手动添加MANIFEST.MF文件

MANIFEST.MF
3.2 JavaDetect(AttachAgent）

JavaDetect进程通过PID找到要注入代码的进程，将Javaagent.jar织入目标进程的JVM中

AgentAttach代码
这里会用到VirtualMachine，其使用方法如下

A.VirtualMachine.attach()方法，传入目标进程的PID，得到一个代表目标进程的VM对象

B.VirtualMachine.loadAgent()方法，传入jar包的路径，将jar织入到目标进程的VM中

C.VirtualMachine.detach()方法，从目标Vm上移除，之后对于目标VM的操作将无效

上面两步我们完成了一个javaagent以及一个织入javaagent到目标进程的方法AgentDetach，之后编写了一个简单的spring-boot项目用于看到效果。

运行效果图
4.问题与优化

4.1 优化

本demo中存在着许多可以优化的点，在这里列出，以后慢慢优化处理

(1) AgentAttach启动是需要手动指定目标进程的PID，这里可以考虑方案优化下

(2) 如何做到多次加载AgentAttach，仍然能保持正常的代码织入，目前AgentAttach启动-停止-再启动，会织入两次代码，造成访问出现如下结果

异常出现
4.2 问题

(1) java类的redefine和retransform的区别和什么场景下触发？

(2) Javaassist与VirtualMachine的详细学习




【原文】
https://www.jianshu.com/p/b2d09a78678d