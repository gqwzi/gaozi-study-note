### 【Fork/Join 框架与线程池的区别】
     采用 “工作窃取”模式（work-stealing）：
    当执行新的任务时它可以将其拆分分成更小的任务执行，并将小任务加
    到线程队列中，然后再从一个随机线程的队列中偷一个并把它放在自己的队
    列中。
     相对于一般的线程池实现，fork/join框架的优势体现在对其中包含的任务 的处理方式上.在一般的线程池中，如果一个线程正在执行的任务由于某些 原因无法继续运行，那么该线程会处于等待状态。而在fork/join框架实现中， 如果某个子问题由于等待另外一个子问题的完成而无法继续运行。那么处理
    该子问题的线程会主动寻找其他尚未运行的子问题来执行.这种方式减少了 线程的等待时间，提高了性能。
    

```java
/**
 * <p>TestForkJoin
 * </p>
 *
 * @author gaoqiangwei
 * @date 2019/5/14 18:32
 **/
public class TestForkJoin {

    public static void main(String[] args) {
        //forkJoin
        ForkJoinPool pool = new ForkJoinPool();
        ForkJoinSumCalculate task = new ForkJoinSumCalculate(1L,5000000L);
        Long start = System.currentTimeMillis();
        Long sum = pool.invoke(task);
        Long end = System.currentTimeMillis();
        System.out.println("forkJoin计算结果为：" + sum + "---耗时：" + (end-start));
        //普通for循环
        test1();
        //java8新特性
        test2();
    }

    //普通for循环
    public static Long test1(){
        Long start = System.currentTimeMillis();
        Long sum = 0L;
        for(Long i = 0L;i<=5000000L;i++){
            sum += i;
        }
        Long end = System.currentTimeMillis();
        System.out.println("test1的计算结果为：" + sum + "---耗时：" + (end-start));
        return sum;
    }

    //java8 新特性
    public static Long test2(){
        Long start = System.currentTimeMillis();
        Long sum = LongStream.rangeClosed(0L, 5000000L)
                .parallel()
                .reduce(0L,Long::sum);
        Long end = System.currentTimeMillis();
        System.out.println("test2的计算结果为：" + sum + "---耗时：" + (end-start));
        return sum;
    }
}

class ForkJoinSumCalculate extends RecursiveTask<Long>{

    private static final long serialVersionUID = -259195479995561737L;

    private Long start;
    private Long end;

    public ForkJoinSumCalculate(Long start, Long end) {
        this.start = start;
        this.end = end;
    }

    private static final Long THURSHOLD = 1000L;

    @Override
    protected Long compute() {
        long length = end - start;
        if(length <= THURSHOLD){
            long sum = 0;
            for (long i = start;i<=end;i++){
                sum += i;
            }
            return sum;
        }else{
            long middle = (start + end)/2;
            ForkJoinSumCalculate left = new ForkJoinSumCalculate(start, middle);
            left.fork();//进行拆分，同时压入线程队列
            ForkJoinSumCalculate right = new ForkJoinSumCalculate(middle + 1, end);
            right.fork();
            return left.join() + right.join();
        }
    }


}

```