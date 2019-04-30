### 【Lock】
### 【01 - 概述】
UC 锁位于java.util.concurrent.locks包下，为锁和等待条件提供一个框架，它不同于内置同步和监视器。
如图
![image](http://baidu.com)
CountDownLatch，CyclicBarrier 和 Semaphore 不在包中属于并发编程中的工具类，但也是通过 AQS（后面会讲） 来实现的。因此，我也将它们归纳到 JUC 锁中进行介绍。

### 【02 - Lock和ReentrantLock】
1、概述        
Java中的锁有两种，synchronized与Lock。       
a. 因为使用synchronized并不需要显示地加锁与解锁，所以往往称synchronized为隐式锁，而使用Lock时则相反，所以一般称Lock为显示锁        
b. synchronized修饰方法或语句块，所有锁的获取和释放都必须出现在一个块结构中。当需要灵活地获取或释放锁时，synchronized显然是不符合要求的。Lock接口的实现允许锁在不同的范围内获取和释放，并支持以任何顺序获取和释放多个锁。

```
一句话:Lock实现比synchronized更灵活！！！       
```
但凡事有利就有弊，不使用块结构锁就失去了使用synchronized修饰方法或语句时会出现的锁自动释放功能，在大多数情况下，Lock实现需要手动释放锁
除了更灵活之外，Lock还有以下优点：     
a.  Lock 实现提供了使用 synchronized 方法和语句所没有的其他功能，包括提供了一个非块结构的获取锁尝试 tryLock()、一个获取可中断锁的尝试 lockInterruptibly() 和一个获取超时失效锁的尝试 
tryLock(long, TimeUnit)。
b.  Lock 类还可以提供与隐式监视器锁完全不同的行为和语义，如保证排序、非重入用法或死锁检测。如果某个实现提供了这样特殊的语义，则该实现必须对这些语义加以记录。
c.  ReentrantLock是一个可重入的互斥锁。顾名思义，“互斥锁”表示在某一时间点只能被同一线程所拥有。“可重入”表示锁可被某一线程多次获取。当然 synchronized 也是可重入的互斥锁     
d.  当锁没有被某一线程占有时，调用 lock() 方法的线程将成功获取锁。可以使用isHeldByCurrentThread()和 getHoldCount()方法来判断当前线程是否拥有该锁     
e.  ReentrantLock既可以是公平锁又可以是非公平锁。当此类的构造方法 ReentrantLock(boolean fair) 接收true作为参数时，ReentrantLock就是公平锁，线程依次排队获取公平锁，即锁将被等待最长时间的线程占有。与默认情况（使用非公平锁）相比，使用公平锁的程序在多线程环境下效率比较低。而且公平锁不能保证线程调度的公平性，tryLock方法可在锁未被其他线程占用的情况下获得该锁。


2、API
2.1 构造方法
```
//创建一个 ReentrantLock 的实例。
ReentrantLock() 

//创建一个具有给定公平策略的 ReentrantLock。  
ReentrantLock(boolean fair) 
```
2.2 方法摘要
```
int getHoldCount() 
          //查询当前线程保持此锁的次数。
protected  Thread   getOwner() 
          //返回目前拥有此锁的线程，如果此锁不被任何线程拥有，则返回 null。
protected  Collection<Thread>   getQueuedThreads() 
          //返回一个 collection，它包含可能正等待获取此锁的线程。
 int    getQueueLength() 
          //返回正等待获取此锁的线程估计数。
protected  Collection<Thread>   getWaitingThreads(Condition condition) 
          //返回一个 collection，它包含可能正在等待与此锁相关给定条件的那些线程。
 int    getWaitQueueLength(Condition condition) 
          //返回等待与此锁相关的给定条件的线程估计数。
 boolean    hasQueuedThread(Thread thread) 
          //查询给定线程是否正在等待获取此锁。
 boolean    hasQueuedThreads() 
          //查询是否有些线程正在等待获取此锁。
 boolean    hasWaiters(Condition condition) 
          //查询是否有些线程正在等待与此锁有关的给定条件。
 boolean    isFair() 
          //如果此锁的公平设置为 true，则返回 true。
 boolean    isHeldByCurrentThread() 
          //查询当前线程是否保持此锁。
 boolean    isLocked() 
          //查询此锁是否由任意线程保持。
 void   lock() 
          //获取锁。
 void   lockInterruptibly() 
          //如果当前线程未被中断，则获取锁。
 Condition  newCondition() 
          //返回用来与此 Lock 实例一起使用的 Condition 实例。
 String toString() 
          //返回标识此锁及其锁定状态的字符串。
 boolean    tryLock() 
          //仅在调用时锁未被另一个线程保持的情况下，才获取该锁。
 boolean    tryLock(long timeout, TimeUnit unit) 
          //如果锁在给定等待时间内没有被另一个线程保持，且当前线程未被中断，则获取该锁。
 void   unlock() 
          //试图释放此锁。
```

3、代码
3.1 典型的代码
```
class X {
    private final ReentrantLock lock = new ReentrantLock();
    // ...

    public void m() { 
        lock.lock();  // block until condition holds
        try {
            // ... method body
        } finally {
            lock.unlock()
        }
    }
}
```
3.2 万年不变的买票
```java
public class SellTickets {

    public static void main(String[] args) {
        TicketsWindow tw1 = new TicketsWindow();
        Thread t1 = new Thread(tw1, "一号窗口");
        Thread t2 = new Thread(tw1, "二号窗口");
        t1.start();
        t2.start();
    }
}

class TicketsWindow implements Runnable {
    private int tickets = 1;
    private final ReentrantLock lock = new ReentrantLock();

    @Override
    public void run() {
        while (true) {
            lock.lock();
            try {
                if (tickets > 0) {
                    System.out.println(Thread.currentThread().getName() 
                                       + "还剩余票:" + tickets + "张");
                    --tickets;
                    System.out.println(Thread.currentThread().getName() 
                                       + "卖出一张火车票,还剩" + tickets + "张");
                } else {
                    System.out.println(Thread.currentThread().getName() 
                                       + "余票不足,暂停出售!");
                    try {
                        Thread.sleep(1000 * 60);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
            } finally {
                lock.unlock();
            }
        }
    }
}
```

4、总结        
```
a、与synchronized 相比ReentrantLock的使用更灵活。Lock接口的实现允许锁在不同的范围内获取和释放，并支持以任何顺序获取和释放多个锁。
b、ReentrantLock具有与使用 synchronized 相同的一些基本行为和语义，但功能更强大。包括提供了一个非块结构的获取锁尝试 tryLock()、一个获取可中断锁的尝试 lockInterruptibly() 和一个获取超时失效锁的尝试 tryLock(long, TimeUnit)。
c、ReentrantLock 具有 synchronized 所没有的许多特性，比如时间锁等候、可中断锁等候、无块结构锁、多个条件变量或者轮询锁。
d、ReentrantLock 可伸缩性强，应当在高度争用的情况下使用它。
```


【参考】<a href="https://blog.csdn.net/qq_36974281/article/details/81986973">原文</a>