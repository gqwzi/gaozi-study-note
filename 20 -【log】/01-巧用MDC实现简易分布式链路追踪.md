### 背景
在目前的Java web应用或者RPC应用中，当应用发生异常时，我们很难知道这些异常信息到底是从哪发生(起点)，到哪结束(终点)，在一个日志文件中，哪条日志信息是发生异常的用户产生的？在什么时候发生的异常？我们想要定位这些的时候，发现并不是很容易，因为没有一个唯一的标识符，能从用户的请求到响应这一个完整的过程给串联起来。那么鉴于这种情况，我们就需要一个能够记录用户请求一进来就产生的id，当用户请求完成之后，将这个id移除。这个id下文统称reqId。

本文将简述怎么利用logback或者log4j实现请求id的埋点和基于http协议不同系统之间请求id的传递，以及最后的小实战展示一下效果。

```text
针对主流的APM软件，大多数会存在traceId和spanId这种概念，这里的reqId类似traceId
```

目前主流APM监控软件
在有现成的轮子的情况下，其实我一般是不会重新造轮子，除非这个轮子不好用，一个半挂车的轮子安装在自行车上很显然是不合适的，不过，还是介绍下一些开源的轮子。

市面上大多数轮子都是基于谷歌的Dapper论文而实现的，而且还有不少是基于OpenTracing规范实现的，例如

- Zipkin
- Skywalking
- Cat
- Pinpoint
等等，其实还有其他的，这里就不一一列举了。这些软件都很优秀，只是个人觉得，目前的应用场景还不是很适合使用这些这么大的轮子，要不然我这破自行车装这么些个轮子，会显得很突兀的。那么针对自行车，要怎么造一个比较合适自行车的轮子呢？

### MDC介绍
在网上一搜MDC会出现很多相关的介绍，这里只是简单介绍一下，如果有需要，请自行百度吧。

MDC据我了解，在Log4j/slf4j都有支持，其底层实际上是使用了ThreadLocal，保证同一个线程内，这个reqId都是唯一的。只要是在同一个线程内打的日志，其reqId都会被打印出来(通过配置logger patten %X{reqId})。

### 如何进行埋点和分布式支持？
上面简单介绍了一下MDC，那么在何时埋点才比较合适呢？接下来简单说下SpringMVC和Servlet的埋点。然后再谈一谈怎么在分布式中实现！

##如何埋点
##SpringMVC中的埋点
不管是SpringMVC应用还是SpringBoot应用，这里都是一样的，就一般情况而言，埋点都会在请求进来的时候埋下，请求结束的时候移除(避免内存泄漏)，在SpringMVC系的应用里面，可以使用Interceptor拦截器来实现这个功能，主要代码如下所示
```text
public class LogInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String reqId = IdUtil.objectId();
        MDC.put(Constants.REQ_ID_KEY, reqId);
        return true;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {

    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        // 从MDC移除请求id
        MDC.remove(Constants.REQ_ID_KEY);
    }
}
```
值得注意的是，这个拦截器的执行顺序应该尽量靠前，这样在其他拦截器里面发生的异常信息也可以通过这个埋点进行追踪。

###Servlet中的埋点
在Servlet应用中，或者基于Servelt的应用中，都可以通过Filter来实现埋点这个操作，原理也是请求进来的时候将请求id进行埋点，请求结束的时候，从MDC移除这个请求id。下面看下在过滤器里头如何实现。
```text

public class LogFilter implements Filter {
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
         // 请求前，设置reqId到MDC
         String reqId = IdUtil.objectId();
         MDC.put(Constants.REQ_ID_KEY, reqId);
         chain.doFilter(request, response);
         // 从MDC移除reqId
         MDC.remove(Constants.REQ_ID_KEY);
    }
}
```
可以看到，其实不管是SpringMVC还是原生的Servlet Filter，都很简单就实现了埋点这个动作。而且原理都是一样的。

```text
其实在SpringMVC内，如果是5以前，用的是webmvc的包，底层也是走Servlet，所有请求都是经过DispatchServlet这个Servlet进入，那么一样可以使用Filter来埋点！如果用的是webflux那就不能直接用Filter来埋点了。
```

如何在不同系统之间传递reqId?
现在假定这么一种情况，如果同一家公司的不同系统之间，都采用统一的通信协议以及序列化协议来实现，例如统一采用dubbo的rpc实现，或者统一基于http+json的形式。下面以比较简单的http+json+springmvc来举例子，如果采用其他mvc框架也是大同小异的。

在上述的埋点例子中，我们是在基于拦截器进行埋点进去，那么当前请求是否是整个分布式请求链中的第一环呢？为了区分到底是不是第一个环(也就是最先接收到请求的那个环节)，我们约定，如果请求头中，带有x-forward-reqId的都不是第一环。那么埋点的代码可以改写成如下的样子
```text

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // 针对分布式情况，先从header尝试获取reqId，如果获取不到，则有可能是从当前服务开始发起调用的
        String reqId = request.getHeader(Constants.X_FORWARD_REQ_ID);
        if (StrUtil.isBlank(reqId)) {
            // 生成请求id并加入MDC
            reqId = IdUtil.objectId();
        }
        MDC.put(Constants.REQ_ID_KEY, reqId);
        return true;
    }
```
埋点的时候，先获取请求头是否有x-forward-reqId，如果有，则不再重新生成reqId，继续沿用传递过来的reqId。那么现在问题来了，怎么将这个请求头传递过去其他系统呢？下面举例说明一下。

对于一般的http请求而言，大多数使用的客户端都是httpclient、okhttp、httpurlconnection等，然而不同的情况配置不大相同，这里也没有办法一一列举出来。下面对笔者遇到过的几种情况做出简要分析，仅供参考：

- 如果采取的是使用zuul等作为网关的话，基本不用怎么设置，请求经过网关之后，就生成reqId，从网关传递下去即可，因为其他系统的请求也会经过网关。
- 如果直接使用http客户端对其他系统做调用，不管采用的是httpclient还是okhttp，皆可做全局全局配置，即构造一个HttpReqProxy的对象，在Proxy对象里面将获取到的请求头设置进去，方便传递。
- 采用Spring的RestTemplate，这种时候可以编写一个工具类，在工具类内注入RestTemplate或者new一个RestTemplate，然后通过 HttpServletRequest request =((ServletRequestAttributes)RequestContextHolder.getRequestAttributes()).getRequest(); 获取到request对象，从而获取请求头设置到RestTemplate中。
到此，就介绍完如何埋点到MDC，又如何利用请求头进行传递reqId到其他系统中去。这里只是给出一种思路，是一种很轻量级的解决方案，如果是比较大型的系统，还是建议使用类似zipkin这样的完备的产品做追踪。
```text
Skywalking和zipkin目前都比较成熟，可以使用在大型项目中，只是说一些较为简单的单体应用或者并不希望引入如此庞大的依赖的分布式应用可以考虑此种思路。该思路较为简单，功能上也较为单一
```

#【实战】
```java
/**
 * 在logback日志输出中增加MDC参数选项
 * 注意，此Filter尽可能的放在其他Filter之前
 *
 * 默认情况下，将会把“requestId”、“requestSeq”、“localIp”、“timestamp”、“uri”添加到MDC上下文中。
 * 1）其中requestId，requestSeq为调用链跟踪使用，开发者不需要手动修改他们。
 * 2）localIp为当前web容器的宿主机器的本地IP，为内网IP。
 * 3）timestamp为请求开始被servlet处理的时间戳，设计上为被此Filter执行的开始时间，可以使用此值来判断内部程序执行的效率。
 * 4）uri为当前request的uri参数值。
 *
 * 我们可以在logback.xml文件的layout部分，通过%X{key}的方式使用MDC中的变量
 */
@Configuration
@WebFilter(filterName = "HttpRequestMDCFilter", urlPatterns = "/*",
		initParams = {
			@WebInitParam(name = "mappedCookies", value = "false"),
			@WebInitParam(name = "mappedHeaders", value = "true"),
			@WebInitParam(name = "mappedParameters", value = "false")
})
@Order(1)
public class HttpRequestMDCFilter implements Filter {

	/**
	 *  是否开启cookies映射，如果开启，那么将可以在logback中使用
	 *  %X{_C_:<name>}来打印此cookie，比如：%X{_C_:user};
	 *  如果开启此选项，还可以使用如下格式打印所有cookies列表:
	 *  格式为：key:value,key:value
	 *  %X{requestCookies}
	 */

	private boolean mappedCookies;
	/**
	 * 是否开启headers映射，如果开启，将可以在logback中使用
	 * %X{_H_:<header>}来打印此header,比如：%X{_H_:X-Forwarded-For}
	 * 如果开启此参数，还可以使用如下格式打印所有的headers列表:
	 * 格式为：key:value,key:value
	 * %X{requestHeaders}
	 */
	private boolean mappedHeaders;

	/**
	 * 是否开启parameters映射，此parameters可以为Get的查询字符串，可以为post的Form Entries
	 * %X{_P_:<parameter>}来答应此参数值，比如：%X{_P_:page}
	 * 如果开启此参数，还可以使用如下格式打印所有的headers列表:
	 * 格式为：key:value,key:value
	 * %X{requestParameters}
	 */
	private boolean mappedParameters;

	private String localIp;//本机IP


	//all headers,content as key:value,key:value
	private static final String HEADERS_CONTENT = "requestHeaders";

	//all cookies
	private static final String COOKIES_CONTENT = "requestCookies";

	//all parameters
	private static final String PARAMETERS_CONTENT = "requestParameters";

	@Override
	public void init(FilterConfig filterConfig) throws ServletException {
		mappedCookies = Boolean.valueOf(filterConfig.getInitParameter("mappedCookies"));
		mappedHeaders = Boolean.valueOf(filterConfig.getInitParameter("mappedHeaders"));
		mappedParameters = Boolean.valueOf(filterConfig.getInitParameter("mappedParameters"));
		//getLocalIp
		localIp = getLocalIp();
	}

	private String getLocalIp() {
		try {
			//一个主机有多个网络接口
			Enumeration<NetworkInterface> netInterfaces = NetworkInterface.getNetworkInterfaces();
			while (netInterfaces.hasMoreElements()) {
				NetworkInterface netInterface = netInterfaces.nextElement();
				//每个网络接口,都会有多个"网络地址",比如一定会有loopback地址,会有siteLocal地址等.以及IPV4或者IPV6    .
				Enumeration<InetAddress> addresses = netInterface.getInetAddresses();
				while (addresses.hasMoreElements()) {
					InetAddress address = addresses.nextElement();
					//get only :172.*,192.*,10.*
					if (address.isSiteLocalAddress() && !address.isLoopbackAddress()) {
						return address.getHostAddress();
					}
				}
			}
		} catch (Exception e) {
			//
		}
		return null;
	}

	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException,
			ServletException {
		HttpServletRequest hsr = (HttpServletRequest) request;
		try {
			mdc(hsr);
		} catch (Exception e) {
			//
		}

		try {
			chain.doFilter(request, response);
		} finally {
			MDC.clear();//must be,threadLocal
		}

	}

	private void mdc(HttpServletRequest hsr) {
		MDC.put(MDCConstants.LOCAL_IP_MDC_KEY, localIp);
		MDC.put(MDCConstants.REQUEST_ID_MDC_KEY, hsr.getHeader(MDCConstants.REQUEST_ID_HEADER));
		String requestSeq = hsr.getHeader(MDCConstants.REQUEST_SEQ_HEADER);
		if (requestSeq != null) {
			String nextSeq = requestSeq + MDCConstants.REQUEST_SEQ_TAG;
			MDC.put(MDCConstants.NEXT_REQUEST_SEQ_MDC_KEY, nextSeq);
		} else {
			MDC.put(MDCConstants.NEXT_REQUEST_SEQ_MDC_KEY, MDCConstants.REQUEST_SEQ_TAG);
		}
		MDC.put(MDCConstants.REQUEST_SEQ_MDC_KEY, requestSeq);
		MDC.put(MDCConstants.TIMESTAMP, "" + System.currentTimeMillis());
		MDC.put(MDCConstants.URI_MDC_KEY, hsr.getRequestURI());

		if (mappedHeaders) {
			Enumeration<String> e = hsr.getHeaderNames();
			if (e != null) {
				StringBuilder sb = new StringBuilder();
				while (e.hasMoreElements()) {
					String header = e.nextElement();
					String value = hsr.getHeader(header);
					MDC.put(MDCConstants.HEADER_KEY_PREFIX + header, value);
					sb.append(header).append(":").append(value).append(",");
				}
				int length = sb.length();
				if (length > 0) {
					MDC.put(HEADERS_CONTENT, sb.deleteCharAt(length - 1).toString());
				}
			}
		}

		if (mappedCookies) {
			Cookie[] cookies = hsr.getCookies();
			if (cookies != null && cookies.length > 0) {
				StringBuilder sb = new StringBuilder();
				for (Cookie cookie : cookies) {
					String name = cookie.getName();
					String value = cookie.getValue();
					MDC.put(MDCConstants.COOKIE_KEY_PREFIX + name, value);
					sb.append(name).append(":").append(value).append(",");
				}
				int length = sb.length();
				if (length > 0) {
					MDC.put(COOKIES_CONTENT, sb.deleteCharAt(length - 1).toString());
				}
			}
		}

		if (mappedParameters) {
			Enumeration<String> e = hsr.getParameterNames();
			if (e != null) {
				StringBuilder sb = new StringBuilder();
				while (e.hasMoreElements()) {
					String key = e.nextElement();
					String value = hsr.getParameter(key);
					MDC.put(MDCConstants.PARAMETER_KEY_PREFIX + key, value);
					sb.append(key).append(":").append(value).append(",");
				}
				int length = sb.length();
				if (length > 0) {
					MDC.put(PARAMETERS_CONTENT, sb.deleteCharAt(length - 1).toString());
				}
			}
		}
	}

	@Override
	public void destroy() {

	}
}

```

log-back.xml 配置
```text
    <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
        <encoder class="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
            <!--格式化输出：%d表示日期，%thread表示线程名，%-5level：级别从左显示5个字符宽度%msg：日志消息，%n是换行符-->
            <pattern>
                %d{yyyy-MM-dd/HH:mm:ss.SSS}|%X{localIp}|%X{requestId}|%X{requestSeq}|^_^|[%t] %-5level %logger{50} %line - %m%n
            </pattern>
            <!--<pattern>%d{yyyy/MM/dd-HH:mm:ss.SSS} %level [%thread] %class:%line>>%msg%n</pattern>-->
        </encoder>
    </appender>
```

【备注】        
如果用feign调用第三方，可以配置feign的header拦截器，里面把traceId添加到header里
如果用httpclient调用，同样在header里添加一下traceId


【原文】
https://my.oschina.net/succy/blog/3077832