---
path: '/networks'
date: '2021-11-12T17:11:56.575Z'
title: 'networks'
tags: ['tag']
released: false
---

数据帧、数据包、数据报

TCP/IP 五层分层模型。分别是

- 应用层 http
- 传输层 tcp udp
- 网络层(互联网层) ip
- 数据链路层(网卡层) 以太网 mac
- 物理层(硬件) 嘀嘀嘀

A 知道自己的下一个中转站是 B，那从 A 发出来的包，应该把 B 的 IP 地址放在哪里呢？B 知道自己的下一个中转站是 C，从 B 发出来的包，应该把 C 的 IP 地址放在哪里呢？如果放在 IP 协议中的目标地址，那包到了中转站，怎么知道最终的目的地址是 D 呢？

理解计算机网络中的概念，一个很好的角度是，想象网络包就是一段 Buffer，或者一块内存，是有格式的。同时，想象自己是一个处理网络包的程序，而且这个程序可以跑在电脑上，可以跑在服务器上，可以跑在交换机上，也可以跑在路由器上。你想象自己有很多的网口，从某个口拿进一个网络包来，用自己的程序处理一下，再从另一个网口发送出去。

所有不能表示出层层封装含义的比喻，都是不恰当的

这里要记住一点：只要是在网络上跑的包，都是完整的。可以有下层没上层，绝对不可能有上层没下层。

一个网络包要从一个地方传到另一个地方，除了要有确定的地址，还需要有定位功能。 而有门牌号码属性的 IP 地址，才是有远程定位功能的。

MTU MSS

Network layer protocols (like IP) also have to deal with the fact that different networks have different transmission properties. In particular, different physical layers can have different maximum transmission units (MTUs): the maximium size of a single packet. This may mean that the IP layer needs to split large packets into smaller packets so that they can be sent along the next hop. Splitting packets is referred to as fragmentation.

**IP 怎么来的？**

IANA => RIR => LIR => ISP

     When CIDR was originally deployed, the central assignment authority

continued to exist but changed its procedures to assign large blocks
of "Class C" network numbers to each service provider. Each service
provider, in turn, assigned bitmask-oriented subsets of the
provider's address space to each customer. This worked reasonably
well, as long as the number of service providers was relatively small
and relatively constant, but it did not scale well, as the number of
service providers grew at a rapid rate.

试想一下运营商怎么给你分配 IP？

运营商有那么多公网ip来分配吗？ - 杂学实验室的回答 - 知乎
https://www.zhihu.com/question/301577391/answer/1223822999

IP 是地址，有定位功能；MAC 是身份证，无定位功能；

IP+端口

刚开始用 ABC 类 IP 时根本没预料到互联网发展如此迅速，大量企业需要申请 B 类 IP，根本不够分，分到的公司拿着 65534 和 IP 也是在太多了，造成大量浪费

第二，路由表太多超越当时路由器处理能力

所以后来使用 CIDR

abc 类 ip 和 cidr 的关系

CIDR 可以用来判断是不是本地人；

IP 分公有的 IP 和私有的 IP。后面的章节中我会谈到“出国门”，就与这个有关。

ICMP 是网络控制消息协议，主要用于传递查询报文与差错报文。ARP 是地址解析协议，它的作用是在以太网环境下，通过 3 层的 IP 地址来找寻 2 层的 MAC 地址，得到一张 ARP 缓存表。转发数据的时候根据 ARP 缓存表来进行传输。

ARP

Network masks or prefix
lengths must be explicitly carried in routing protocols.

DHCP

为什么学校、网吧机房基本都不使用DHCP？ - 百哥的回答 - 知乎
https://www.zhihu.com/question/20971480/answer/1243424388

有了这个目标 MAC 地址，数据包在链路上广播，MAC 的网卡才能发现，这个包是给它的。MAC 的网卡把包收进来，然后打开 IP 包，发现 IP 地址也是自己的，再打开 TCP 包，发现端口是自己，也就是 80，而 nginx 就是监听 80。

于是将请求提交给 nginx，nginx 返回一个网页。然后将网页需要发回请求的机器。然后层层封装，最后到 MAC 层。因为来的时候有源 MAC 地址，返回的时候，源 MAC 就变成了目标 MAC，再返给请求的机器。

集线器 -> 交换机

为何电脑配置 IP，还要配置网络掩码？
那是因为互联网设计之初，是以网段为最小单元来管理互联网的，换句话说，互联网是由一个个网段组成的，对于一台计算机来说，差不多有三种场合的通信。

1）自己与自己通信

2）与本网段其它主机通信

3）与别的网段主机的通信

ARP 探索网络拓扑结构

ping ICMP

ICMP 报文是封装在 IP 包里面的。因为传输指令的时候，肯定需要源地址和目标地址。它本身非常简单。因为作为侦查兵，要轻装上阵，不能携带大量的包袱。

在任何一台机器上，当要访问另一个 IP 地址的时候，都会先判断，这个目标 IP 地址，和当前机器的 IP 地址，是否在同一个网段。怎么判断同一个网段呢？需要 CIDR 和子网掩码，这个在第三节的时候也讲过了。

路由如何连接 OSPF

路由器

路由器就是一台网络设备，它有多张网卡。当一个入口的网络包送到路由器时，它会根据一个本地的转发信息库，来决定如何正确地转发流量。这个转发信息库通常被称为路由表。

NAT

咱们在大学里面学习计算机网络与数据结构的时候，知道求最短路径常用的有两种方法，一种是 Bellman-Ford 算法，一种是 Dijkstra 算法。在计算机网络中基本也是用这两种方法计算的。

**路由表如何运作？例如我知道了百度 ip 怎么算出路线？**

TCP 提供可靠交付。通过 TCP 连接传输的数据，无差错、不丢失、不重复、并且按序到达。我们都知道 IP 包是没有任何可靠性保证的，一旦发出去，就像西天取经，走丢了、被妖怪吃了，都只能随它去。但是 TCP 号称能做到那个连接维护的程序做的事情，这个下两节我会详细描述。而 UDP 继承了 IP 包的特性，不保证不丢失，不保证按顺序到达。

再如，TCP 是面向字节流的。发送的时候发的是一个流，没头没尾。IP 包可不是一个流，而是一个个的 IP 包。之所以变成了流，这也是 TCP 自己的状态维护做的事情。而 UDP 继承了 IP 的特性，基于数据报的，一个一个地发，一个一个地收。

还有 TCP 是可以有拥塞控制的。它意识到包丢弃了或者网络的环境不好了，就会根据情况调整自己的行为，看看是不是发快了，要不要发慢点。UDP 就不会，应用让我发，我就发，管它洪水滔天。

因而 TCP 其实是一个有状态服务，通俗地讲就是有脑子的，里面精确地记着发送了没有，接收到没有，发送到哪个了，应该接收哪个了，错一点儿都不行。而 **UDP 则是无状态服务。** 通俗地说是没脑子的，天真无邪的，发出去就发出去了。

在 IP 头里面有个 8 位协议，这里会存放，数据里面到底是 TCP 还是 UDP

首先，为什么要三次，而不是两次？按说两个人打招呼，一来一回就可以了啊？为了可靠，为什么不是四次？

TCP 包头很复杂，但是主要关注五个问题，顺序问题，丢包问题，连接维护，流量控制，拥塞控制；

Socket 这个名字很有意思，可以作插口或者插槽讲。虽然我们是写软件程序，但是你可以想象为弄一根网线，一头插在客户端，一头插在服务端，然后进行通信。所以在通信之前，双方都要建立一个 Socket。

在建立 Socket 的时候，应该设置什么参数呢？Socket 编程进行的是端到端的通信，往往意识不到中间经过多少局域网，多少路由器，因而能够设置的参数，也只能是端到端协议之上网络层和传输层的。

在网络层，Socket 函数需要指定到底是 IPv4 还是 IPv6，分别对应设置为 AF_INET 和 AF_INET6。另外，还要指定到底是 TCP 还是 UDP。还记得咱们前面讲过的，TCP 协议是基于数据流的，所以设置为 SOCK_STREAM，而 UDP 是基于数据报的，因而设置为 SOCK_DGRAM。

说 TCP 的 Socket 就是一个文件流，是非常准确的。因为，Socket 在 Linux 中就是以文件的形式存在的。除此之外，还存在文件描述符。写入和读出，也是通过文件描述符。

数据中心里面也有一大堆的电脑，但是它和咱们办公室里面的笔记本或者台式机不一样。数据中心里面是服务器。服务器被放在一个个叫作机架（Rack）的架子上面。

数据中心的入口和出口也是路由器，由于在数据中心的边界，就像在一个国家的边境，称为边界路由器（Border Router）。为了高可用，边界路由器会有多个。

- https://www.iana.org/numbers
- https://www.rfc-editor.org/rfc/rfc4632.html
- http://www.cs.cornell.edu/courses/cs4410/2015su/lectures/lec23-routing.html#:~:text=To%20determine%20the%20next%20hop,first%20next%2Dhop%20that%20matches.
- https://zhuanlan.zhihu.com/p/147370653
