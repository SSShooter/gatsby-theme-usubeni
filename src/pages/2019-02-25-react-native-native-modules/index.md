---
path: '/react-native-native-modules'
date: '2019-02-24T10:24:04.286Z'
title: 'react native 原生模块桥接的简单说明'
tags: ['翻译','react native']
---

> 原文出自：https://github.com/prscX/awesome-react-native-native-modules

## Android

### 创建原生模块包

- 通过继承 ReactPackage 为你的原生模块包创建 Java 类，可以这么写：

- 覆盖 `createNativeModules` 和 `createViewManagers` 方法

```java

public class MyNativePackage implements ReactPackage {
    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
    }
}

```

- 在 `createNativeModules` 方法中添加原生模块

```java
public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
    List<NativeModule> modules = new ArrayList<>();
    modules.add(new MyNativeModule(reactContext));

    return modules;
}
```

- 在 `createViewManagers` 方法中添加原生 UI 组件

```java
public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
    List<ViewManager> components = new ArrayList<>();
    components.add(new RNNativeComponent());

    return components;
}
```

### 创建原生模块

- 先通过继承 ReactContextBaseJavaModule 创建 MyNativeModule 类。

```java
public class MyNativeModule extends ReactContextBaseJavaModule {
    public MyNativeModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }
}
```

- 为了让 React Native 在 NativeModules 中找到我们的模块，我们还需要覆盖 getName 方法。

```java
@Override
public String getName() {
    return "MyNativeModule";
}
```

- 现在我们已经拥有一个可以导入到 JavaScript 代码的原生模块，现在可以向其中加入功能。

- 暴露模块方法：定义一个接受设置参数、成功回调和失败回调的 `Show` 方法。

```java
public class MyNativeModule extends ReactContextBaseJavaModule {
    @ReactMethod
    public void Show(ReadableMap config, Callback successCallback, Callback cancelCallback) {
        Activity currentActivity = getCurrentActivity();
    
        if (currentActivity == null) {
            cancelCallback.invoke("Activity doesn't exist");
            return;
        }
    }
}
```

- 在 JavaScript 中调用模块方法

```javascript
import { NativeModules } from "react-native";

const { MyNativeModule } = NativeModules;

MyNativeModule.Show(
    {}, //Config Parameters
    () => {}, //Success Callback
    () => {} //Cancel Callback
)

```

> **注意**:
> - 模块方法只提供静态引用，不包含于 react 树中。

### 创建原生 UI 组件

- 如果你需要在 react 树中渲染一个原声 UI 组件

- 创建一个继承 ReactNative ViewGroupManager 的 Java 类

```java
public class RNNativeComponent extends ViewGroupManager<ViewGroup> {
    public static final String REACT_CLASS = "RNNativeComponent";
}
```

- 覆盖 `getName` 方法：

```java
@Override 
public String getName() {
    return REACT_CLASS;
} 
```

- 覆盖 `createViewInstance` 方法，返回你的自定义原生组件

```java
@Override 
  protected FrameLayout createViewInstance(final ThemedReactContext reactContext) {
      return //用 FrameLayout 包裹的自定义原生组件
  }
```

- 创建原生 prop 方法

```java
  @ReactProp(name = "prop_name") 
  public void setPropName(NativeComponent nativeComponent, propDataType prop) {
  }
```


- JavaScript 中使用

```javascript
import { requireNativeComponent } from "react-native"

const MyNativeComponent = requireNativeComponent("RNNativeComponent", RNNativeComponent, {
  nativeOnly: { }
})

<MyNativeComponent prop={this.props.prop}>
```

## iOS


### Macro

- **RCTBridgeModule**: RCTBridgeModule 是一个 protocol，它为注册 bridge 模块 RCTBridgeModule `@protocol RCTBridgeModule` 提供了一个接口

- **RCT_EXPORT_MODULE(js_name)**: 在 class implementation 时使用 bridge 注册你的模块。参数 js_name 是可选的，用作 JS 模块的名称，若不定义，将会默认使用 Objective-C 的 class 名

- **RCT_EXPORT_METHOD(method)\RCT_REMAP_METHOD(, method)**: bridge 模块亦可定义方法，这些方法可以作为 `NativeModules.ModuleName.methodName` 输出到 JavaScript。

```objectivec
RCT_EXPORT_METHOD(funcName:(NSString *)onlyString
                    secondName:(NSInteger)argInteger)
  { ... }
```

上面的例子暴露到 JavaScript 是 `NativeModules.ModuleName.funcName`

### 创建原生模块包

我们需要在项目中添加两个文件：头文件和源文件。



```objectivec
- MyNativePackage.h

#import "RCTBridgeModule.h"

@interface MyNativePackage : NSObject <RCTBridgeModule>
@end

- MyNativePackage.m

#import "MyNativePackage.h"

@implementation MyNativePackage

RCT_EXPORT_MODULE();

@end
```

### 创建模块方法



```objectivec
RCT_EXPORT_METHOD(Show:(RCTResponseSenderBlock)callback) {
}
```

- JavaScript 中引入模块方法

```javascript
import { NativeModules } from 'react-native'

const MyNativeModule = NativeModules.MyNativeModule;
MyNativeModule.Show(() => {})
```

### 创建原生 View 组件

- 创建 view 方法，返回你的原声组件

```objectivec
- (UIView *)view {
    //Initialize & return your native component view
}
```

- 创建原生 prop 方法

```objectivec
RCT_CUSTOM_VIEW_PROPERTY(prop, DATA_TYPE_OF_PROP, YOUR_NATIVE_COMPONENT_CLASS) {
}
```


- 在 JavaScript 中使用

```javascript
import { requireNativeComponent } from "react-native"

const MyNativeComponent = requireNativeComponent("RNNativeComponent", RNNativeComponent, {
  nativeOnly: { }
})

<MyNativeComponent prop={this.props.prop}>
```
