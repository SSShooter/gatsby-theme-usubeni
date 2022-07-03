---
path: '/networks'
date: '2022-03-29T17:11:56.575Z'
title: 'networks'
tags: ['coding', '计算机网络']
released: false
---

- 不涉及物理层
- 不涉及路由选择协议
- 仅介绍各层大体情况，缺少细节描述

1985 年成为 TCP/IP 协议突破的一年，当时它成为 UNIX 操作系统的组成部分。最终将它放进了 Sun 公司的微系统工作站。

## 总览

这个图也能粗略给大家一个全局概览的感觉。

```
 A. Transmission on connected network:
   _______________________________________________
  | LL hdr | IP hdr |         (data)              |
  |________|________|_____________________________|

   <---------- Frame ----------------------------->
            <----------Packet -------------------->

 B. Before IP fragmentation or after IP reassembly:
          ______________________________________
         | IP hdr | transport| Application Data |
         |________|____hdr___|__________________|

          <--------  Datagram ------------------>
                   <-------- Message ----------->
    or, for TCP:
          ______________________________________
         | IP hdr |  TCP hdr | Application Data |
         |________|__________|__________________|

          <--------  Datagram ------------------>
                   <-------- Segment ----------->
```

Application Data 是应用层的数据，例如 HTTP 协议。应用层的数据想要在互联网上跑，必须经过层层封装。简单来说就是加上三个“头”，也就是传输层、网络层、数据链路层的头部。

加上传输层头部的数据是**报文（Message）**

加上 IP 头的数据是**数据报（Datagram）**

整段在网线上跑的数据是**帧（Frame）**

IP 数据报需要小于 MTU

在终端接收到数据时可以理解为：

- 检查 MAC 地址，对上了，收下，拆开 LL 头传到上层
- IP 地址对了，拆开 IP 头传到上层
- 送到指定端口
- 应用层干活

TCP/IP 五层分层模型。分别是

- 应用层 http
- 传输层 tcp udp
- 网络层(互联网层) ip（已经到了软件层面）
- 数据链路层(网卡层) 以太网 mac（可以硬件转发）
- 物理层(硬件) 嘀嘀嘀

理解各层各自用途，最重要的是明确分层。既然标准是如此设计，那各层级的实现必定专注于自己的层级，层层封装，所以在研究单层功能时几乎可以完全忽略其他层级。

虽然数据封装本身是如上面例子所示地从上到下的，但是解释起来从底层到顶层或许会更好理解。

简单来说物理层大概就是网卡把上层二进制数据通过物理的方式传输到其他地方，例如电、光、电磁波等各种方法。下面说的关键就是这些上层的二进制数据到底是怎么来的。

## 数据链路层

<!-- 数据链路到底有什么用呢？既然都要用 ARP 找到 MAC 地址才传数据，为什么不直接就网络层传呢？ -->

<!-- 我猜是因为网卡要明确一段数据是否交给他还是需要 MAC，毕竟 IP 是软件层面的东西，这两个东西分层会更清晰。 -->

数据链路层专注于借助 MAC 地址在 WAN、LAN 发送信息。

可以这么理解，你不可能用 MAC 地址跟百度连接，而必须用 IP 地址，通过路由器才能到达百度服务器。

ARP 可以用网络层地址查询数据链路层地址。

### 以太网

有一个很常见的问题，以太网和互联网有什么区别，区别其实就是层级不一样。

以太网 MTU 就是 1500 字节

IEEE 802.3 是标准化的以太网，MTU 是 1492 字节

MSS 是 tcp 层面的最大分段大小

这里要记住一点：只要是在网络上跑的包，都是完整的。可以有下层没上层，绝对不可能有上层没下层。

互联网协议定义并激活了网络层，它使用一个逻辑地址系统。IP 地址并不以任何永久的方式绑定到硬件，而且事实上一个网络接口可以有许多 IP 地址。为了正确地交付一份报文，主机和路由器需要其它机制来识别设备接口和 IP 地址之间的关联。地址解析协议（ARP）为 IPv4 执行这种 IP 地址到物理地址（MAC 地址）的转换。

此外，反向操作有时候也是必须的，比如，一台主机在启动时需要知道自己的 IP 地址（除非地址已经被管理员预先设置）。目前被用于这一用途的协议有动态主机设置协议（DHCP）、引导协议（BOOTP）和比较不常用的 RARP。

### IEEE 802.11

wifi

## 应用层

https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers

最常见的 http 协议对比底层协议非常简单，就是一个人类可读的文本。

http 请求和响应头有轻微不同，先看请求头：

```
GET /home.html HTTP/1.1
Host: developer.mozilla.org
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:50.0) Gecko/20100101 Firefox/50.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br
Referer: https://developer.mozilla.org/testpage.html
Connection: keep-alive
Upgrade-Insecure-Requests: 1
If-Modified-Since: Mon, 18 Jul 2016 02:36:04 GMT
If-None-Match: "c561c68d0ba92bbeb8b0fff2a9199f722e3a621a"
Cache-Control: max-age=0
```

而这是响应头：

```
200 OK
Access-Control-Allow-Origin: *
Connection: Keep-Alive
Content-Encoding: gzip
Content-Type: text/html; charset=utf-8
Date: Mon, 18 Jul 2016 16:06:00 GMT
Etag: "c561c68d0ba92bbeb8b0f612a9199f722e3a621a"
Keep-Alive: timeout=5, max=997
Last-Modified: Mon, 18 Jul 2016 02:36:04 GMT
Server: Apache
Set-Cookie: mykey=myvalue; expires=Mon, 17-Jul-2017 16:06:00 GMT; Max-Age=31449600; Path=/; secure
Transfer-Encoding: chunked
Vary: Cookie, Accept-Encoding
X-Backend-Server: developer2.webapp.scl3.mozilla.com
X-Cache-Info: not cacheable; meta data too large
X-kuma-revision: 1085259
x-frame-options: DENY
```

MDN 的 HTTP 专题基本上把 HTTP 头的作用都列出来了：

- security
- access control (CORS)
- authentication
- caching
- compression
- conditional requests
- content negotiation
- cookies
- range requests
- redirects
- specifications

http 依赖 TCP 的**可靠传输**，才能把完整数据交到浏览器手上，但 TCP 不是传输层的唯一协议，好，接着我们开始讲传输层——

才怪。

## 传输层

上面说了 HTTP 请求头是明文，但是从这层开始，协议头就不方便人类阅读了，这些协议头会规定第 x 到 x 位（bit）作何用途，然后把二进制的信息填到对应位置。

端口号在这层生效

### 端口

> TCP 使用了通信端口（Port number）的概念来标识发送方和接收方的应用层。对每个 TCP 连接的一端都有一个相关的 16 位的无符号端口号分配给它们。端口被分为三类：众所周知的、注册的和动态/私有的。众所周知的端口号是由因特网赋号管理局（IANA）来分配的，并且通常被用于系统一级或根进程。众所周知的应用程序作为服务器程序来运行，并被动地侦听经常使用这些端口的连接。例如：FTP、TELNET、SMTP、HTTP、IMAP、POP3 等。注册的端口号通常被用来作为终端用户连接服务器时短暂地使用的源端口号，但它们也可以用来标识已被第三方注册了的、被命名的服务。动态/私有的端口号在任何特定的 TCP 连接外不具有任何意义。可能的、被正式承认的端口号有 65535 个。

传输层的 TCP 和 UDP 大概是的高频面试题，需要仔细研究。

### UDP

[RFC 768 UDP 标准](https://datatracker.ietf.org/doc/html/rfc768)

```
   0      7 8     15 16    23 24    31
  +--------+--------+--------+--------+
  |     Source      |   Destination   |
  |      Port       |      Port       |
  +--------+--------+--------+--------+
  |                 |                 |
  |     Length      |    Checksum     |
  +--------+--------+--------+--------+
  |
  |          data octets ...
  +---------------- ...
```

先看比较简单的 UDP，他的协议头就是指定了来源和目标端口、数据长度、校验和，剩下的就是数据内容，然后这块数据就可以交到网络层了。

其中比较难理解的是校验和，你需要先假装装上一个 ip 头计算校验和，不过 ipv4 可以不计算校验和，但 ipv6 必须。

可以看到这个头部**没有带状态信息**，这就意味着每个发出去的报文都是独立的，总之尽力送到就是了，没办法展现前后报文的关系，不保证收到的顺序，丢了也不负责重发。

但是正因为他负责的内容很少，所以传输速度和处理速度都非常快，常用于实时视频、语音。

那么，有没有一种能够保证传输数据顺序的协议呢？就是接下来要说的 TCP。

### TCP

[RFC 793 TCP 标准](https://datatracker.ietf.org/doc/html/rfc793)

```
    0                   1                   2                   3
    0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
   |          Source Port          |       Destination Port        |
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
   |                        Sequence Number                        |
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
   |                    Acknowledgment Number                      |
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
   |  Data |           |U|A|P|R|S|F|                               |
   | Offset| Reserved  |R|C|S|S|Y|I|            Window             |
   |       |           |G|K|H|T|N|N|                               |
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
   |           Checksum            |         Urgent Pointer        |
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
   |                    Options                    |    Padding    |
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
   |                             data                              |
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
```

可以看到 TCP 的协议头信息量很大（当然这个信息量也让传输时间变长了，后来的优化也会从减少头部内容入手）。

通过协议头的各种信息，TCP 可以提供带以下特点的服务：

- 可靠传输
- 丢包重传
- 流量控制
- 拥塞控制

TCP 是很重要的一层抽象，虽然微观上他还是封在网络层包里，但是对用户来说他是一个**流（stream）**（划重点啊，这就是抽象的重要性）。

stream 是一个比较重要的计算机领域概念

在传输流之前，还有“连接”这一步骤。

也就是服务器和客户端都建一个 socket（中文意思就是插口），然后两头接上。

http://c.biancheng.net/view/2131.html

要做到可靠传输，三次握手是关键

#### 三次握手

分别是指下面这三步：

- SYN: 客户端激活连接，向服务器发送 SYN flag，其序列号（sequence number）为随机数 A
- SYN-ACK: 服务器响应 SYN-ACK flag，响应确认号（acknowledgment number）是收到的序列号+1（例子里就是 A+1），响应的序列号是另一个随机数 B.
- ACK: 最后客户端发送 ACK 到服务器，序列号就是得到的响应号（A+1），而响应号收到的序列号+1（B+1）

关键是确认号是对另一边序列号的确认。之后发送数据也是用响应号告诉对方数据已经收到，长期没有收到 ACK 就会重发数据。对于接收方，序列号代表着数据顺序，即使收到包的顺序错乱也可以根据序列号纠正后再传到上层应用。

#### 四次挥手

#### “粘包”

既然他是一个“流”，那他就具有无边界的特点

<!-- ### RTP -->

## 网络层

As we have seen, there are many technologies that can be used to build last-mile links or to connect a modest number of nodes together, but how do we build networks of global scale? A single Ethernet can interconnect no more than 1024 hosts; a point-to-point link connects only two. Wireless networks are limited by the range of their radios. To build a global network, we need a way to interconnect these different types of links and multi-access networks. The concept of interconnecting different types of networks to build a large, global network is the core idea of the Internet and is often referred to as internetworking.

### IP

[RFC 791 IP 标准](https://datatracker.ietf.org/doc/html/rfc791)

```
    0                   1                   2                   3
    0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
   |Version|  IHL  |Type of Service|          Total Length         |
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
   |         Identification        |Flags|      Fragment Offset    |
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
   |  Time to Live |    Protocol   |         Header Checksum       |
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
   |                       Source Address                          |
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
   |                    Destination Address                        |
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
   |                    Options                    |    Padding    |
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
```

A 知道自己的下一个中转站是 B，那从 A 发出来的包，应该把 B 的 IP 地址放在哪里呢？B 知道自己的下一个中转站是 C，从 B 发出来的包，应该把 C 的 IP 地址放在哪里呢？如果放在 IP 协议中的目标地址，那包到了中转站，怎么知道最终的目的地址是 D 呢？

在 IP 头里面有 8 位存放协议信息，标明上层协议是 TCP 还是 UDP

IP 号发挥作用的协议，也是让互联网之所以为互联网的协议

Network layer protocols (like IP) also have to deal with the fact that different networks have different transmission properties. In particular, different physical layers can have different maximum transmission units (MTUs): the maximium size of a single packet. This may mean that the IP layer needs to split large packets into smaller packets so that they can be sent along the next hop. Splitting packets is referred to as fragmentation.

IP 是可以做数据分块的，但是可以通过 Path MTU Discovery (PMTUD)避免。尤其是对于 TCP 协议需要靠协议头验证数据顺序的情况，如果被 IP 拆包了就非常麻烦了，所以在 TCP 协议中控制 MSS 也是一个重点。

### ICMP

ping ICMP

ICMP 报文是封装在 IP 包里面的。因为传输指令的时候，肯定需要源地址和目标地址。它本身非常简单。因为作为侦查兵，要轻装上阵，不能携带大量的包袱。

### 路由器

路由器就是一台网络设备，它有多张网卡。当一个入口的网络包送到路由器时，它会根据一个本地的转发信息库，来决定如何正确地转发流量。这个转发信息库通常被称为路由表。

**IP 怎么来的？**

IANA => RIR => LIR => ISP

刚开始用 ABC 类 IP 时根本没预料到互联网发展如此迅速，大量企业需要申请 B 类 IP，根本不够分，分到的公司拿着 65534 个 IP 也是在太多了，造成大量浪费

第二，路由表太多超越当时路由器处理能力

所以后来使用 CIDR

abc 类 ip 和 cidr 的关系

CIDR 可以用来判断是不是本地人；

IP 分公有的 IP 和私有的 IP。后面的章节中我会谈到“出国门”，就与这个有关。

ICMP 是网络控制消息协议，主要用于传递查询报文与差错报文。ARP 是地址解析协议，它的作用是在以太网环境下，通过 3 层的 IP 地址来找寻 2 层的 MAC 地址，得到一张 ARP 缓存表。转发数据的时候根据 ARP 缓存表来进行传输。

Network masks or prefix
lengths must be explicitly carried in routing protocols.

DHCP

为何电脑配置 IP，还要配置网络掩码？
那是因为互联网设计之初，是以网段为最小单元来管理互联网的，换句话说，互联网是由一个个网段组成的，对于一台计算机来说，差不多有三种场合的通信。

1）自己与自己通信

2）与本网段其它主机通信

3）与别的网段主机的通信

ARP 探索网络拓扑结构

在任何一台机器上，当要访问另一个 IP 地址的时候，都会先判断，这个目标 IP 地址，和当前机器的 IP 地址，是否在同一个网段。怎么判断同一个网段呢？需要 CIDR 和子网掩码，这个在第三节的时候也讲过了。

路由如何连接 OSPF

咱们在大学里面学习计算机网络与数据结构的时候，知道求最短路径常用的有两种方法，一种是 Bellman-Ford 算法，一种是 Dijkstra 算法。在计算机网络中基本也是用这两种方法计算的。

**路由表如何运作？例如我知道了百度 ip 怎么算出路线？**

数据中心的入口和出口也是路由器，由于在数据中心的边界，就像在一个国家的边境，称为边界路由器（Border Router）。为了高可用，边界路由器会有多个。

### 网关

### NAT

IP 号不够怎么办

另外开坑

## HTTPS

## QUIC

队头阻塞

## 后话

## 参考

- https://www.iana.org/numbers
- https://www.rfc-editor.org/rfc/rfc4632.html
- http://www.cs.cornell.edu/courses/cs4410/2015su/lectures/lec23-routing.html#:~:text=To%20determine%20the%20next%20hop,first%20next%2Dhop%20that%20matches.
- https://zhuanlan.zhihu.com/p/147370653

理解计算机网络中的概念，一个很好的角度是，想象网络包就是一段 Buffer，或者一块内存，是有格式的。同时，想象自己是一个处理网络包的程序，而且这个程序可以跑在电脑上，可以跑在服务器上，可以跑在交换机上，也可以跑在路由器上。你想象自己有很多的网口，从某个口拿进一个网络包来，用自己的程序处理一下，再从另一个网口发送出去。

有了这个目标 MAC 地址，数据包在链路上广播，MAC 的网卡才能发现，这个包是给它的。MAC 的网卡把包收进来，然后打开 IP 包，发现 IP 地址也是自己的，再打开 TCP 包，发现端口是自己，也就是 80，而 nginx 就是监听 80。

于是将请求提交给 nginx，nginx 返回一个网页。然后将网页需要发回请求的机器。然后层层封装，最后到 MAC 层。因为来的时候有源 MAC 地址，返回的时候，源 MAC 就变成了目标 MAC，再返给请求的机器。
