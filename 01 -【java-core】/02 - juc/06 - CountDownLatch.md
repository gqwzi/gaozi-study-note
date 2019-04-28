### 【CountDownLatch】
```
01 - CountDownLatch是什么？
02 - CountDownLatch如何工作？
03 - 在实时系统中的应用场景
04 - 应用范例
05 - 常见的面试题
```
### 【01 - CountDownLatch是什么】
>CountDownLatch是在java1.5被引入的，跟它一起被引入的并发工具类还有CyclicBarrier、Semaphore、ConcurrentHashMap和BlockingQueue，它们都存在于java.util
.concurrent包下。

>CountDownLatch这个类能够使一个线程等待其他线程完成各自的工作后再执行。例如，应用程序的主线程希望在负责启动框架服务的线程已经启动所有的框架服务之后再执行。

>CountDownLatch是通过一个计数器来实现的，计数器的初始值为线程的数量。每当一个线程完成了自己的任务后，计数器的值就会减1。当计数器值到达0时，它表示所有的线程已经完成了任务，然后在闭锁上等待的线程就可以恢复执行任务。


### 【02 - CountDownLatch如何工作】
CountDownLatch.java类中定义的构造函数：
```
//Constructs a CountDownLatch initialized with the given count.
public void CountDownLatch(int count) {...}
```
1>构造器中的计数值（count）实际上就是闭锁需要等待的线程数量。              
2>这个值只能被设置一次，而且CountDownLatch没有提供任何机制去重新设置这个计数值。        
3>与CountDownLatch的第一次交互是主线程等待其他线程。主线程必须在启动其他线程后立即调用CountDownLatch.await()方法。这样主线程的操作就会在这个方法上阻塞，直到其他线程完成各自的任务。       
4>其他N 个线程必须引用闭锁对象，因为他们需要通知CountDownLatch对象，他们已经完成了各自的任务。这种通知机制是通过 CountDownLatch.countDown()方法来完成的；每调用一次这个方法，在构造函数中初始化的count值就减1。
所以当N个线程都调 用了这个方法，count的值等于0，然后主线程就能通过await()方法，恢复执行自己的任务。

### 【03 - 在实时系统中的使用场景】
让我们尝试罗列出在java实时系统中CountDownLatch都有哪些使用场景。我所罗列的都是我所能想到的。如果你有别的可能的使用方法，请在留言里列出来，这样会帮助到大家。     
1.实现最大的并行性：有时我们想同时启动多个线程，实现最大程度的并行性。例如，我们想测试一个单例类。如果我们创建一个初始计数为1的CountDownLatch，
并让所有线程都在这个锁上等待，那么我们可以很轻松地完成测试。我们只需调用 一次countDown()方法就可以让所有的等待线程同时恢复执行。
2.开始执行前等待n个线程完成各自任务：例如应用程序启动类要确保在处理用户请求前，所有N个外部系统已经启动和运行了。      
3.死锁检测：一个非常方便的使用场景是，你可以使用n个线程访问共享资源，在每次测试阶段的线程数目是不同的，并尝试产生死锁。       

### 【04 - 应用范例】
在这个例子中，我模拟了一个应用程序启动类，它开始时启动了n个线程类，这些线程将检查外部系统并通知闭锁，并且启动类一直在闭锁上等待着。
一旦验证和检查了所有外部服务，那么启动类恢复执行。

1-AbstractBaseHealthChecker.java：这个类是一个Runnable，负责所有特定的外部服务健康的检测。
```java
/**
 * <p>健康检查
 * </p>
 *
 * @author gaoqiangwei
 * @date 2019/4/28 17:27
 **/
public abstract class AbstractBaseHealthChecker implements Runnable{
    private CountDownLatch countDownLatch;
    private String serviceName;
    private Boolean serviceUp;
    public AbstractBaseHealthChecker(){}

    public AbstractBaseHealthChecker( String serviceName, CountDownLatch countDownLatch) {
        this.countDownLatch = countDownLatch;
        this.serviceName = serviceName;
        this.serviceUp = false;
    }

    public String getServiceName(){
        return serviceName;
    }
    public Boolean isServiceUp(){
        return serviceUp;
    }
    public void setServiceUp(Boolean serviceUp){
        this.serviceUp = serviceUp;
    }
    public void run() {
        System.out.println("===服务："+ serviceName + "开始启动");
        try {
            verifyService();
        }catch (Throwable t){
            t.printStackTrace(System.err);
            serviceUp = false;
        }finally {
            if(countDownLatch != null){
                countDownLatch.countDown();
            }
        }
    }

    public abstract  void verifyService();
}
```

2 - NetworkHealthChecker.java：这个类继承了BaseHealthChecker，实现了verifyService()方法。     
DatabaseHealthChecker.java和CacheHealthChecker.java除了服务名和休眠时间外，与NetworkHealthChecker.java是一样的。
```java
/**
 * <p>NetworkHealthChecker
 * </p>
 *
 * @author gaoqiangwei
 * @date 2019/4/28 17:43
 **/
public class NetworkHealthChecker extends AbstractBaseHealthChecker{

    public NetworkHealthChecker(CountDownLatch countDownLatch){
        super("newWork", countDownLatch);
    }

    @Override
    public void verifyService() {
        try {
            System.out.println("checking 服务："+this.getServiceName()+"---start");
            Thread.sleep(7000);
            setServiceUp(true);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println("服务:"+this.getServiceName() + "is Up");
    }
}
```

3 - ApplicationStartupUtil.java：这个类是一个主启动类，它负责初始化闭锁，然后等待，直到所有服务都被检测完。       
```java
/**
 * <p>ApplicationStartupUtil
 * </p>
 *
 * @author gaoqiangwei
 * @date 2019/4/28 17:51
 **/
public class ApplicationStartupUtil {

    private static ApplicationStartupUtil INSTANCE = new ApplicationStartupUtil();

    public static ApplicationStartupUtil getInstance(){
        return INSTANCE;
    }

    private static List<AbstractBaseHealthChecker> services;

    public static boolean checkExternalServices()throws Exception{
        CountDownLatch countDownLatch = new CountDownLatch(2);
        services = new ArrayList<AbstractBaseHealthChecker>();
        services.add(new NetworkHealthChecker(countDownLatch));
        services.add(new DatabaseHealthChecker(countDownLatch));
        Executor executor = Executors.newFixedThreadPool(services.size());
        for (AbstractBaseHealthChecker service : services) {
            executor.execute(service);
        }
        ((ExecutorService) executor).shutdown();
        countDownLatch.await();
        for (AbstractBaseHealthChecker service : services) {
            if(!service.isServiceUp()){
                return false;
            }
        }
        return true;
    }
}
```

4 - 现在你可以写测试代码去检测一下闭锁的功能了。
```java
/**
 * <p>TestCountDownLatch
 * </p>
 *
 * @author gaoqiangwei
 * @date 2019/4/28 18:02
 **/
public class TestCountDownLatch {
    public static void main(String[] args){
        boolean result = false;
        try {
            result = ApplicationStartupUtil.checkExternalServices();
        } catch (Exception e) {
            e.printStackTrace();
        }
        System.out.println("服务检查结果:" + result);
    }
}
```    
输出：
```
===服务：dataBase开始启动
===服务：newWork开始启动
checking 服务：dataBase---start
checking 服务：newWork---start
服务:dataBaseis Up
服务:newWorkis Up
服务检查结果:true
```

### 【05 - 常见面试题】
1、解释一下CountDownLatch概念？     
2、CountDownLatch 和CyclicBarrier的不同之处?       
3、给出一些CountDownLatch使用的例子?      
4、 CountDownLatch 类中主要的方法?