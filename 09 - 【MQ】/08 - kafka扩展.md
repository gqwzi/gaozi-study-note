### 【kafka扩展】
### 【7.1 Kafka与Flume比较】
在企业中必须要清楚流式数据采集框架flume和kafka的定位是什么：     
> flume：cloudera公司研发:       
- 适合多个生产者；        
- 适合下游数据消费者不多的情况；       
- 适合数据安全性要求不高的操作；       
- 适合与Hadoop生态圈对接的操作。        

> kafka：linkedin公司研发:
- 适合数据下游消费众多的情况；
- 适合数据安全性要求较高的操作，支持replication。

因此我们常用的一种模型是：
线上数据-->flume -->kafka -->flume(根据情景增删该流程) --> HDFS

### 【7.2 flume与kafka集成】
1）配置flume(flume-kafka.conf)     
```
# define
a1.sources = r1
a1.sinks = k1
a1.channels = c1

# source
a1.sources.r1.type = exec
a1.sources.r1.command = tail -F -c +0 /opt/module/datas/flume.log
a1.sources.r1.shell = /bin/bash -c

# sink
a1.sinks.k1.type = org.apache.flume.sink.kafka.KafkaSink
a1.sinks.k1.kafka.bootstrap.servers = hadoop102:9092,hadoop103:9092,hadoop104:9092
a1.sinks.k1.kafka.topic = first
a1.sinks.k1.kafka.flumeBatchSize = 20
a1.sinks.k1.kafka.producer.acks = 1
a1.sinks.k1.kafka.producer.linger.ms = 1

# channel
a1.channels.c1.type = memory
a1.channels.c1.capacity = 1000
a1.channels.c1.transactionCapacity = 100

# bind
a1.sources.r1.channels = c1
a1.sinks.k1.channel = c1
```

2）启动kafkaIDEA消费者        
3）进入flume根目录下，启动flume       
```
$ bin/flume-ng agent -c conf/ -n a1 -f jobs/flume-kafka.conf
```
4）向/opt/module/datas/flume.log里追加数据，查看kafka消费者消费情况
```
$ echo hello > /opt/module/datas/flume.log
```

### 【7.3 kafka配置信息】
### 【7.3.1 Broker配置信息】
属性    | 默认值 | 描述
-------- | ---  | ---
broker.id |  | 必填参数，broker的唯一标识
log.dirs    | /tmp/kafka-logs | Kafka数据存放的目录。可以指定多个目录，中间用逗号分隔，当新partition被创建的时会被存放到当前存放partition最少的目录。
port        | 9092 | BrokerServer接受客户端连接的端口号
zookeeper.connect        | null | Zookeeper的连接串，格式为：hostname1:port1,hostname2:port2,hostname3:port3。可以填一个或多个，为了提高可靠性，建议都填上。注意，此配置允许我们指定一个zookeeper路径来存放此kafka集群的所有数据，为了与其他应用集群区分开，建议在此配置中指定本集群存放目录，格式为：hostname1:port1,hostname2:port2,hostname3:port3/chroot/path 。需要注意的是，消费者的参数要和此参数一致。
delete.topic.enable      | false  | 启用deletetopic参数，建议设置为true。