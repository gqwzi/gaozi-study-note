### 1、4种线程池
通过Executors工具类可以创建各种类型的线程池，如下为常见的四种：        
1) newCachedThreadPool ：大小受限，当线程释放时，可重用该线程
2) newFixedThreadPool ：大小固定，无可用线程时，任务需等待，直到有可用线程；
3) newSingleThreadExecutor ：创建一个单线程，任务会按顺序依次执行；
4) newScheduledThreadPool ：创建一个定长线程池，支持定时及周期性任务执行       

举个例子：
    
    ExecutorService executor = Executors.newCachedThreadPool();//创建线程池
    Task task = new Task(); //创建Callable任务
    Future<Integer> result = executor.submit(task);//提交任务给线程池执行
    result.get()；//等待执行结果; 可以传入等待时间参数，指定时间内没返回的话，直接结束