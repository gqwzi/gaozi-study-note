### 【ReadWriteLock】

### 【0 - 理论】
```
1.Java并发库中ReetrantReadWriteLock实现了ReadWriteLock接口并添加了可重入的特性
2.ReetrantReadWriteLock读写锁的效率明显高于synchronized关键字
3.ReetrantReadWriteLock读写锁的实现中，读锁使用共享模式；写锁使用独占模式，换句话说，读锁可以在没有写锁的时候被多个线程同时持有，写锁是独占的
4.ReetrantReadWriteLock读写锁的实现中，需要注意的，当有读锁时，写锁就不能获得；而当有写锁时，除了获得写锁的这个线程可以获得读锁外，其他线程不能获得读锁
```

### 【1 - ReadWriteLock简介】
ReadWriteLock同Lock一样也是一个接口，提供了readLock和writeLock两种锁的操作机制，一个是只读的锁，一个是写锁。             
读锁可以在没有写锁的时候被多个线程同时持有，写锁是独占的(排他的)。每次只能有一个写线程，但是可以有多个线程并发地读数据。       
所有读写锁的实现必须确保写操作对读操作的内存影响。换句话说，一个获得了读锁的线程必须能看到前一个释放的写锁所更新的内容。        
理论上，读写锁比互斥锁允许对于共享数据更大程度的并发。与互斥锁相比，读写锁是否能够提高性能取决于读写数据的频率、读取和写入操作的持续时间、以及读线程和写线程之间的竞争。

### 【2 - 使用场景】
假设你的程序中涉及到对一些共享资源的读和写操作，且写操作没有读操作那么频繁。
```
例如，最初填充有数据，然后很少修改的集合，同时频繁搜索（例如某种目录）是使用读写锁的理想候选项。
```
在没有写操作的时候，两个线程同时读一个资源没有任何问题，所以应该允许多个线程能在同时读取共享资源。但是如果有一个线程想去写这些共享资源，就不应该再有其它线程对该资源进行读或写。这就需要一个读/写锁来解决这个问题。

### 【3 - 互斥原则】
读-读能共存，     
读-写不能共存，        
写-写不能共存。        

### 【4 - ReadWriteLock 接口源码示例】
```
public interface ReadWriteLock {
    /**
     * Returns the lock used for reading.
     */
    Lock readLock();

    /**
     * Returns the lock used for writing.
     */
    Lock writeLock();
}
```

### 【5 - 使用示例】
```java
public class TestReadWriteLock {
    public static void main(String[] args) {
        ReadWriteLockDemo rw = new ReadWriteLockDemo();
        //写
        new Thread(new Runnable(){
            public void run(){
                rw.set((int)(Math.random()*101));
            }
        },"write thread").start();

        //读
        for (int i =0;i<20;i++){
            new Thread(new Runnable() {
                @Override
                public void run() {
                    rw.get();
                }
            },"read thread").start();
        }
    }

}

class ReadWriteLockDemo{

    private int number = 0;

    ReadWriteLock lock = new ReentrantReadWriteLock();

    public  void get(){
        try {
            lock.readLock().lock();
            System.out.println("current thread name " + Thread.currentThread().getName() + "【number】" + number);
        }finally {
            lock.readLock().unlock();
        }
    }
    public void set(int number){
        try {
            lock.writeLock().lock();
            System.out.println("current thread name:" + Thread.currentThread().getName());
            this.number = number;
        }finally {
            lock.writeLock().unlock();
        }
    }
}
```