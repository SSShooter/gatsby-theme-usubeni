---
path: '/dart-classes'
date: '2019-03-02T10:19:52.914Z'
title: 'Dart | class 详解'
tags: ['coding', 'dart']
---

dart 是 Flutter 的基础，其中类（class）更是尤为重要，可以说是 Flutter 入门必备。这篇文章会跟着官方文档整理一下类的用法与需要注意的点。（因为我的本业是前端，所以其中会经常提到 JavaScript 并与其作对比）

## 概述

Dart 也是一种面向对象的语言。每个对象都是一个类的实例，所有类都派生于 Object 类。另外 Dart 有一个特点 —— mixin，类体可以在多个类中重用。

## 类的使用

对象“成员”包括方法（函数）和实例变量（数据），你可以通过点（`.`）访问他们。

```dart
var p = Point(2, 2);

// Set the value of the instance variable y.
p.y = 3;

// Get the value of y.
assert(p.y == 3);

// Invoke distanceTo() on p.
num distance = p.distanceTo(Point(4, 4));
```

另外，使用 `?.` 代替 `.` 可以避免操作对象为 null 的情况。

```javascript
// js 也经常有这种问题
if (p) {
  p.y = 4
}
```

相比之下，dart 可以这样：

```dart
// 即使 p 是 null 也不会报错
p?.y = 4;
```

你可以使用类构造器创建对象。构造器名称可以是 class 名称本身，也可以自己取名，所以格式为 `ClassName` 或 `ClassName.identifier`。

```dart
var p1 = Point(2, 2);
var p2 = Point.fromJson({'x': 1, 'y': 2});
```

如果你奇怪为什么实例化没有 new（毕竟在 js 里 new 是必须有的实例化标志），因为 Dart 2 中 new 关键字可写可不写。你可以根据习惯加上，这并不是错误的，以下代码效果与上面相同。

```dart
var p1 = new Point(2, 2);
var p2 = new Point.fromJson({'x': 1, 'y': 2});
```

从实例获取它的类的方法：

```dart
print('The type of a is ${a.runtimeType}');
```

## 编写构造器

**与类名同名的函数即是构造器。**`this` 指向当前实例，在变量名不冲突时可以忽略。

```dart
class Point {
  num x, y;

  Point(num x, num y) {
    // There's a better way to do this, stay tuned.
    this.x = x;
    this.y = y;
  }
}
// 不写 this
class Point {
  num xx, yy;

  Point(num x, num y) {
    // There's a better way to do this, stay tuned.
    xx = x;
    yy = y;
  }
}
```

另外因为把构造器的参数传入到实例变量这个操作太常见了，所以有这么一个语法糖：

```dart
class Point {
  num x, y;
  // 设置 x 和 y 的语法糖
  // 这会在构造函数体 运行前 进行设置
  Point(this.x, this.y);
}
```

### 具名构造函数

使用方法上面已经说过了

```dart
class Point {
  num x, y;

  Point(this.x, this.y);

  // 具名构造函数
  Point.origin() {
    x = 0;
    y = 0;
  }
}
```

记住构造器是不会被继承的，具名构造器不会被子类继承。如果你需要在子类使用父类的具名构造器，你需要在子类手动执行那个构造器。

### 默认构造函数

我觉得这是一个比较难理解的点，默认构造函数当你**没有声明任何构造函数（包括具名构造函数）时**会默认添加。这个构造函数有两个特点：第一，无参数；第二，不具名。同时，它会调用父类的默认构造函数。

### 初始化列表

除了引用父类的构造器，在自身构造函数体运行前，还可以使用初始化列表。使用初始化列表用冒号分开。**另外，初始化时 rhs 不能访问 this。**

```dart
Point.fromJson(Map<String, num> json)
    : x = json['x'],
      y = json['y'] {
  print('In Point.fromJson(): ($x, $y)');
}
```

### 重定向构造器

有时候一些构造器功能与同 class 的其他构造器是一样的，这个时候可以直接把其他构造器重定向到功能一样的构造器上。重定向构造器的函数体为空，与重定向目标之间也是以冒号分隔。

```dart
class Point {
  num x, y;

  // The main constructor for this class.
  Point(this.x, this.y);

  // Delegates to the main constructor.
  Point.alongXAxis(num x) : this(x, 0);
}
```

### 定值构造器

如果你的 class 生成的是定值，可以使用这个对象编译时定值。（但这不是必定生成定值）要得到这么一个 class 需要把所有实例变量定义为 `final`。

```dart
class ImmutablePoint {
  static final ImmutablePoint origin =
      const ImmutablePoint(0, 0);

  final num x, y;

  const ImmutablePoint(this.x, this.y);
}
```

### 工厂构造器

注意：工厂方法是一种设计模式，而不是 Dart 的专有名词。

```dart
class Logger {
  final String name;
  bool mute = false;

  // _cache is library-private, thanks to
  // the _ in front of its name.
  static final Map<String, Logger> _cache =
      <String, Logger>{};

  factory Logger(String name) {
    if (_cache.containsKey(name)) {
      return _cache[name];
    } else {
      final logger = Logger._internal(name);
      _cache[name] = logger;
      return logger;
    }
  }

  Logger._internal(this.name);

  void log(String msg) {
    if (!mute) print(msg);
  }
}
```

## extends 时的默认行为

子类不继承父函数的构造函数，子类只会调用父类的无参数构造函数。

父类构造器在子构造器函数体最前面调用，如果**初始化列表**也存在，会优先运行：

1. 初始化列表
2. 父类无参数构造器
3. 自己的无参数构造器

当父类构造函数有参数时，子类 extends 直接报错。

## 调 extends 时用非默认构造器

既然默认只会调用父类的默认无参数构造函数，需要调用其他函数就需要自己动手了。

```dart
class Person {
  String firstName;

  Person.fromJson(Map data) {
    print('in Person');
  }
}

class Employee extends Person {
  // Person 因为声明了具名函数所以没有默认函数
  // 你必须手动调用 super.fromJson(data)
  Employee.fromJson(Map data) : super.fromJson(data) {
    print('in Employee');
  }
}

main() {
  var emp = new Employee.fromJson({});

  // Prints:
  // in Person
  // in Employee
  if (emp is Person) {
    // Type check
    emp.firstName = 'Bob';
  }
  (emp as Person).firstName = 'Bob';
}
```

## Getter 与 Setter

```dart
class Rectangle {
  num left, top, width, height;

  Rectangle(this.left, this.top, this.width, this.height);

  // Define two calculated properties: right and bottom.
  num get right => left + width;
  set right(num value) => left = value - width;
  num get bottom => top + height;
  set bottom(num value) => top = value - height;
}

void main() {
  var rect = Rectangle(3, 4, 20, 15);
  assert(rect.left == 3);
  rect.right = 12;
  assert(rect.left == -8);
}
```

## 抽象类

使用 `abstract` 定义一个抽象类，抽象类不能被实例化，它作为接口定义非常有用。抽象类里有抽象方法，以 `;` 代替函数体。

```dart
// This class is declared abstract and thus
// can't be instantiated.
abstract class AbstractContainer {
  // Define constructors, fields, methods...

  void updateChildren(); // Abstract method.
}
```

## 隐性接口（Implicit interfaces）

**在 Dart 中每一个 class 都是一个隐性 interface。**如果你单纯想借用 B 的 API，可以让 A implements B 接口。模拟 Java 的接口可以使用 Dart 抽象类。

```dart
// A person. The implicit interface contains greet().
class Person {
  // In the interface, but visible only in this library.
  final _name;

  // Not in the interface, since this is a constructor.
  Person(this._name);

  // In the interface.
  String greet(String who) => 'Hello, $who. I am $_name.';
}

// An implementation of the Person interface.
class Impostor implements Person {
  get _name => '';

  String greet(String who) => 'Hi $who. Do you know who I am?';
}

String greetBob(Person person) => person.greet('Bob');

void main() {
  print(greetBob(Person('Kathy')));
  print(greetBob(Impostor()));
}
```

## 枚举类

枚举是一种特殊的类，使用 `enum` 关键字声明一个枚举类型：

```dart
enum Color { red, green, blue }

// enum 的每个值都有一个 index getter 返回值（以 0 开始）的位置
assert(Color.red.index == 0);
assert(Color.green.index == 1);
assert(Color.blue.index == 2);

// 可以使用 values 访问 enum 所有值
List<Color> colors = Color.values;
assert(colors[2] == Color.blue);
```

另外，枚举有两个限制：

- 不能继承、mix in 或 implement 枚举
- 不能显式实例化枚举

## 静态变量和静态方法

使用 `static` 关键字实现静态变量和静态方法。

静态变量在使用时才会被初始化。

```dart
class Queue {
  static const initialCapacity = 16;
  // ···
}

void main() {
  assert(Queue.initialCapacity == 16);
}
```

静态变量不在实例上进行操作，所以不能访问 `this`。

```dart
import 'dart:math';

class Point {
  num x, y;
  Point(this.x, this.y);

  static num distanceBetween(Point a, Point b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return sqrt(dx * dx + dy * dy);
  }
}

void main() {
  var a = Point(2, 2);
  var b = Point(4, 4);
  var distance = Point.distanceBetween(a, b);
  assert(2.8 < distance && distance < 2.9);
  print(distance);
}
```

## 完结

篇幅不短，谢谢你耐心看完！若有其他遗漏或没讲清楚的 class 重点，请在评论区提醒一下。

## 参考文献

- [Dart 官方教程](https://www.dartlang.org/guides/language/language-tour)
- [无参数构造器与默认构造器的区别](https://stackoverflow.com/questions/27654167/difference-between-a-no-arg-constructor-and-a-default-constructor-in-java)
- [Dart 如何定义 interface](https://stackoverflow.com/questions/20791286/how-to-define-interfaces-in-dart)
- [Dart | 什么是 Mixin](https://juejin.im/post/5bb204d3e51d450e4f38e2f6)
- [mixin 与 interface](https://stackoverflow.com/questions/45901297/when-to-use-mixins-and-when-to-use-interfaces-in-dart)
