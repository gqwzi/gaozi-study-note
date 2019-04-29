### 【Lock】
### 【01 - 概述】
UC 锁位于java.util.concurrent.locks包下，为锁和等待条件提供一个框架，它不同于内置同步和监视器。
如图
![image](http://baidu.com)
CountDownLatch，CyclicBarrier 和 Semaphore 不在包中属于并发编程中的工具类，但也是通过 AQS（后面会讲） 来实现的。因此，我也将它们归纳到 JUC 锁中进行介绍。

### 【02 - Lock和ReentrantLock】
1、概述        
Java中的锁有两种，synchronized与Lock。       
因为使用synchronized并不需要显示地加锁与解锁，所以往往称synchronized为隐式锁，而使用Lock时则相反，所以一般称Lock为显示锁
