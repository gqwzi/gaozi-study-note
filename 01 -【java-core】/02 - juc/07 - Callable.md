### 【Callable、Future和FutureTask】
### 【00 - 前言】
我们都知道创建线程的2种方式，一种是直接继承Thread，另外一种就是实现Runnable接口，但是这两种方式都有一个缺陷就是：
在执行完任务之后无法获取执行结果。       
如果需要获取执行结果，就必须通过共享变量或者使用线程通信的方式来达到效果，这样使用起来就比较麻烦。       
今天来讨论一下Callable、Future和FutureTask三个类的使用方法。
```
1、Callable与Runnable
2、Future
3、FutureTask
4、示例
```
### 【01 - Callable和Runnable】
1> 先说一下java.lang.Runnable吧，它是一个接口，在它里面只声明了一个run()方法：
```java
public interface Runnable {
    public abstract void run();
}
```
由于run()方法返回值为void类型，所以在执行完任务之后无法返回任何结果。     

2> Callable位于java.util.concurrent包下，它也是一个接口，在它里面也只声明了一个方法，只不过这个方法叫做call()：
```java
public interface Callable<V> {
    /**
     * Computes a result, or throws an exception if unable to do so.
     *
     * @return computed result
     * @throws Exception if unable to compute a result
     */
    V call() throws Exception;
}
```
可以看到，这是一个泛型接口，call()函数返回的类型就是传递进来的V类型。

3> 那么怎么使用Callable呢？一般情况下是配合ExecutorService来使用的，在ExecutorService接口中声明了若干个submit方法的重载版本：
```
<T> Future<T> submit(Callable<T> task);
<T> Future<T> submit(Runnable task, T result);
Future<?> submit(Runnable task);
```
a - 第一个submit方法里面的参数类型就是Callable。       
b - 暂时只需要知道Callable一般是和ExecutorService配合来使用的，具体的使用方法讲在后面讲述。     
c - 一般情况下我们使用第一个submit方法和第三个submit方法，第二个submit方法很少使用。

### 【02 - Future】
Future就是对于具体的Runnable或者Callable任务的执行结果进行取消、查询是否完成、获取结果。必要时可以通过get方法获取执行结果，该方法会阻塞直到任务返回结果。       
Future类位于java.util.concurrent包下，它是一个接口：
```java
public interface Future<V> {
    boolean cancel(boolean mayInterruptIfRunning);
    boolean isCancelled();
    boolean isDone();
    V get() throws InterruptedException, ExecutionException;
    V get(long timeout, TimeUnit unit)
        throws InterruptedException, ExecutionException, TimeoutException;
}
```
在Future接口中声明了5个方法，下面依次解释每个方法的作用：  
> cancel方法：用来取消任务，如果取消任务成功则返回true，如果取消任务失败则返回false。
    a、 参数mayInterruptIfRunning表示是否允许取消正在执行却没有执行完毕的任务，如果设置true，则表示可以取消正在执行过程中的任务。如果任务已经完成，则无论mayInterruptIfRunning为true还是false，此方法肯定返回false，即如果取消已经完成的任务会返回false；
    b、 如果任务正在执行，若mayInterruptIfRunning设置为true，则返回true，若mayInterruptIfRunning设置为false，则返回false；
    c、 如果任务还没有执行，则无论mayInterruptIfRunning为true还是false，肯定返回true。     
      
> isCancelled方法：表示任务是否被取消成功，如果在任务正常完成前被取消成功，则返回 true。

> isDone方法:表示任务是否已经完成，若任务完成，则返回true；

> get()方法:用来获取执行结果，这个方法会产生阻塞，会一直等到任务执行完毕才返回；

> get(long timeout, TimeUnit unit)用来获取执行结果，如果在指定时间内，还没获取到结果，就直接返回null。

-----也就是说Future提供了三种功能---
1） 判断任务是否完成；        
2） 能够中断任务；      
3） 能够获取任务执行结果。      
因为Future只是一个接口，所以是无法直接用来创建对象使用的，因此就有了下面的FutureTask。

### 【03 - FutureTask】
我们先来看一下FutureTask的实现：
```
public class FutureTask<V> implements RunnableFuture<V>;
```
FutureTask类实现了RunnableFuture接口，我们看一下RunnableFuture接口的实现：
```
public interface RunnableFuture<V> extends Runnable, Future<V> {
    void run();
}
```
 ![image](https://github.com/gqwzi/gaozi-study-note/blob/master/99%20-%20%E3%80%90img%E3%80%91/callable/01-callable-20190429.png)       
可以看出RunnableFuture继承了Runnable接口和Future接口，而FutureTask实现了RunnableFuture接口。所以它既可以作为Runnable被线程执行，又可以作为Future得到Callable的返回值。        
FutureTask提供了2个构造器：
```
public FutureTask(Callable<V> callable) {
}
public FutureTask(Runnable runnable, V result) {
}
```
事实上，FutureTask是Future接口的一个唯一实现类。

### 【04 - 使用示例】
1.使用Callable+Future获取执行结果
```java
/**
 * <p>TestFuture
 * </p>
 *
 * @author gaoqiangwei
 * @date 2019/4/29 13:32
 **/
public class TestFuture {
    public static void main(String[] args)throws Exception {
        ExecutorService executorService = Executors.newCachedThreadPool();
        Student student = new Student();
        Future<Integer> result = executorService.submit(student);
        executorService.shutdown();
        System.out.println("主线程获取到的结果："+result.get());
    }
}

class Student implements Callable<Integer> {

    public Integer call()throws Exception {
        System.out.println("子线程开始计算");
        Thread.sleep(5000);
        Integer count = 0;
        for (int i =0;i<5000;i++){
            count += i;
        }
        System.out.println("子线程计算结果："+count);
        return count;
    }
}
```
执行结果：
```
子线程开始计算
子线程计算结果：12497500
主线程获取到的结果：12497500
```
【疑问】假设一个任务有2步，那第2步的时候用另一个线程来计算，而这时如果用future和callable来获取返回结果的话又变成同步了，
那这个第2步重启一个线程的意义在哪里？比原来这个线程执行的快？
【解答】看了另一篇文章知道答案了~       
>Future的核心思想是：一个方法，计算过程可能非常耗时，等待方法返回，显然不明智。可以在调用方法的时候，立马返回一个Future，可以通过Future这个数据结构去控制方法f的计算过程。
这里的控制包括：        
get方法：获取计算结果（如果还没计算完，也是必须等待的）
cancel方法：还没计算完，可以取消计算过程
isDone方法：判断是否计算完
isCancelled方法：判断计算是否被取消

2.使用Callable+FutureTask获取执行结果       
问题来了，如何获取Callable的返回结果呢？一般是通过FutureTask这个中间媒介来实现的。整体的流程是这样的：
把Callable实例当作参数，生成一个FutureTask的对象，然后把这个对象当作一个Runnable，作为参数另起线程。
```java
class TestFutureTask{
    public static void main(String[] args)throws Exception {
        Student student = new Student();
        FutureTask<Integer> futureTask = new FutureTask<Integer>(student);
        //第一种
        ExecutorService executorService = Executors.newCachedThreadPool();
        executorService.submit(futureTask);
        executorService.shutdown();
        System.out.println("第一种~执行结果："+futureTask.get());

        //第二种
        FutureTask<Integer> ft = new FutureTask<Integer>(student);
        new Thread(ft).start();
         System.out.println("第二种~执行结果："+ft.get());
    }
}

class Student implements Callable<Integer> {

    public Integer call()throws Exception {
        System.out.println("子线程开始计算");
        Thread.sleep(5000);
        Integer count = 0;
        for (int i =0;i<5000;i++){
            count += i;
        }
        System.out.println("子线程计算结果："+count);
        return count;
    }
}
```
执行结果：
```
子线程开始计算
子线程计算结果：12497500
第一种~执行结果：12497500
子线程开始计算
子线程计算结果：12497500
第二种~执行结果：12497500
```
