## react    2019.8.13 今天必须把之前的react学习的整理完！

https://blog.csdn.net/qq_36138652/article/details/97632390

## react16的生命周期

### > 重要的周期函数

> + componentDidMount.  组件已经挂载完成，在这里可以进行与后台接口的数据交互
> + componentDidUpdate. 组件已经更新完成
> + componentWillUnMount. 组件将要卸载，可以进行清除定时器等操作

### 三个时间段

> 1. 挂载时     constructor -> render -> componentDidMount
>
> 2. 更新时     new Props setState forceUpdate -> render -> componentDidUpdate
> 3. 卸载时     componentWillUnMount

### 两个阶段

> Render阶段。纯净并且不包含副作用，可能会被React暂停，中止或重新启动
>
> Commit阶段。可以使用Dom，运行副作用，安排更新

## 延伸出的问题

1. ### 为什么在componentDidMount中与服务器数据交互，而不是选择在之前生命周期中的componentWillMount中

   componentWillMount的时候，此时页面还是处在空白期（数据并没有挂载到页面上），如果在这里选择与服务器数据交互，这样肯定页面加载的时间变长，如果发生错误可能会导致页面加载不出来，影响了用户体验

2. ### 为什么render阶段必须纯净

   render阶段表示渲染，不可以在render函数中再进行数据的改变来再次执行渲染，这样会陷入死循环。（this.setState不要在什么周期中调用） 

## React中的重要特性

### > 单向数据流

> 官方  任何state都是属于特定的组件，从该state派生的任何数据或ui只能影响低于它们的组件
>
> 我的理解。父组件的state可以让子组件获取到，但是子组件的state数据父组件不会获取到

## 延伸

1. ### 父子组件的传值

   ```js
   import React,{Component} from 'react'
   import ReactDom from 'react-dom'
   
   class Father extends Component {
     constructor(props) {
       super(props)
       this.state = {
         name: 'son'
       }
     }
     Go = () => {
       console.log(this)
       this.setState({name:'lisi'})
     }
     render() {
       return (
         <div>
           <Children name={this.state.name} go={this.Go}/> 
         </div>
       )
     }
   }
   
   class Children extends Component {
     constructor(props) {
       super(props)
     }
     fatherGo = () =>{
       this.props.go()
     }
     render() {
       let name = this.props.name 
       return (
         <div onClick={this.fatherGo}>
           {name}
         </div>
       )
     }
   }
   ```

2. ### 绑定this的三种方式

   ```js
   this.go = this.go.bind(this)
   go = () => {}
   ::this.go  // 相当于第一种方式
   ```

3. ### 为什么需要绑定this

   ```js
   // 这是js的特性决定的
   var name = 222
   var obj = {
     name: 111,
     f() {
       console.log(this.name)
     }
   }
   
   obj.f() // 111
   var b = obj.f
   b()  // 222
   ```

4. ### 为什么组件的名字需要大写

   ```为了和原生html的标签区分，如果是小写的话react会以为它是一个原生html标签，这样会因此报错```

   ```后边必须要有/> 可以写成单标签形式，但必须要有/>```

## > React中的key

> 官方  key 帮助 React 识别哪些元素改变了，比如被添加或删除。因此你应当给数组中的每一个元素赋予一个确定的标识，一个元素的 key 最好是这个元素在列表中拥有的一个独一无二的字符串。通常，我们使用来自数据 id 来作为元素的 key
>
> 我的理解。key值帮助我们确定它是唯一的，当发生改变的时候便于diff算法的对比，减少性能的消耗，并且如果它是索引来当key的时候，修改顺序可能会导致逻辑上的混乱
>
> 官方演示  https://codepen.io/pen?&editable=true&editors=0010.

## 延伸

1. ### react diff算法比较渲染

   传统的diff算法   通过循环递归对节点进行依次对比，算法复杂度达到 O(n^3) 

   **react中的diff算法**  三大策略来调和（转化为o(n)）

   + tree diff  Web UI中DOM节点跨层级的移动操作特别少，可以忽略不计
   + 拥有相同类的两个组件 生成相似的树形结构，   拥有不同类的两个组件 生成不同的树形结构。
   + 对于同一层级的一组子节点，通过唯一id区分。
   + 三大策略的比较详细的介绍       https://www.jianshu.com/p/3ba0822018cf

## > React表单

> ```js
> // 对select的使用
> class App extends Component {
>   constructor(props) {
>     super(props)
>     this.state = {value:1}
>   }
>   changeValue = (e)=>{
>     let value = e.target.value
>     this.setState({value})
>   }
>   render() {
>     console.log(this.state.value)
>     return (
>       <select value={this.state.value} onChange={this.changeValue}>
>         <option value='1'>苹果</option>
>         <option value='2'>香蕉</option>
>         <option value='3'>草莓</option>
>         <option value='4'>葡萄</option>
>         <option value='5'>梨</option>
>       </select>
>     )
>   }
> }
> 
> ReactDom.render(
>   <App />,
>   document.getElementById("app")
> );
> ```
>
>  

## > React的合成事件

## 为什么要有合成事件机制

```如果DOM上绑定了过多的事件处理函数，整个页面响应以及内存占用可能都会受到影响。React为了避免这类DOM事件滥用，同时屏蔽底层不同浏览器之间的事件系统差异，实现了一个中间层——SyntheticEvent。```

```这个中间层是池化的,就是对象池的设计模式，可以实现对象的复用，减少内存的消耗```

## 原理

> React并不是将click事件绑在该div的真实DOM上，而是在document处监听所有支持的事件，当事件发生并冒泡至document处时，React将事件内容封装并交由真正的处理函数运行。
>
> 利用了事件委托

## React的合成事件和原生事件的不同

> +  原生事件会先于react的事件执行
> + react合成事件的类型是一个原生事件的一个子类型

## 需求示例

> ```js
> // 摘抄的网上的一段代码
> // 代码来源于《深入React技术栈》2.1.4节
> // 需求 当点击button时二维码显示  点击除二维码之外的区域二维码消失
> // 当如下设置的时候 点击二维码区域也会消失
> class QrCode extends Component {
>   constructor(props) {
>     super(props);
>     this.handleClick = this.handleClick.bind(this);
>     this.handleClickQr = this.handleClickQr.bind(this);
>     this.state = {
>       active: false,
>     };
>   }
>   
>   componentDidMount() {
>     document.body.addEventListener('click', e => {
>       // 第二种解决方法 加一个这样的判断 不会有显示的问题
>       //var ifShow = e.target.className.search('code')
>       //if(ifShow!=-1) {
>         //this.setState({
>           //active: false,
>         //});
>       //}
>     });
>     
>   }
> 
>   componentWillUnmount() {
>     document.body.removeEventListener('click');
>   }
>   
>   handleClick() {
>     console.log(1)
>     this.setState({
>       active: !this.state.active,
>     });
>   }
>   
>   handleClickQr(e) {
>     e.stopPropagation();
>   }
> 
>   render() {
>     return (
>       <div className="qr-wrapper">
>         <button className="qr" onClick={this.handleClick}>二维码</button>
>         <div
>           className="code"
>           style={{ display: this.state.active ? 'block' : 'none' }}
>           onClick={this.handleClickQr}
>         >
>           <div className="qrCode"style={{width:'200px',height:'200px',backgroundColor:'red'}}></div>
>         </div>
>       </div>
>     );
>   }
> }
> 
> ReactDom.render(
>   <QrCode />,
>   document.getElementById("app")
> ); 
> ```
>
>   解决方式
>
> 1. 原生事件和react事件不能混用 用原生事件来取消冒泡
>
> 2. 加一个判断
>
>    ```js
>    document.body.addEventListener('click', e => {
>          // 2. 加一个这样的判断 不会有显示的问题
>          /* let ifShow = e.target.className.search('code')
>          if(ifShow!=-1) {
>            this.setState({
>              active: false,
>            });
>          } */
>          this.setState({
>            active: false
>          })
>        // 1.  对原生dom阻止冒泡
>      document.querySelector('.qrCode').addEventListener('click',e=>e.stopPropagation())
>        });
>    ```
>
> 3. 利用react合成事件的nativeEvent ，在document.body里边绑定改成document绑定（react合成事件就是冒泡至document统一处理）
>
>    ```js
>    componentDidMount() {
>        document.addEventListener('click', e => {
>          this.setState({
>            active: false
>          })
>        });
>      }
>    
>    handleClick(e) {
>        e.nativeEvent.stopImmediatePropagation()
>        this.setState({
>          active: !this.state.active,
>        });
>      }
>     handleClickQr(e) {
>        e.nativeEvent.stopImmediatePropagation()
>      }
>    
>    <div className="qrCode" style={{width:'200px',height:'200px',backgroundColor:'red'}} onClick={this.handleClickQr}></div>
>    ```
>
>     
>
>    ### 延伸
>
>    > 1. onClick react事件点击出的e和原生dom点击出的e不同。用react事件的时候e.nativeEvent.stopImmediatePropagation() 用这个方法可以阻止冒泡
>    >
>    > 2. document.removeEventListener('click',()=>console.log(1)) 这样是不会移除掉document.addEventListener('click',()=>console.log(1)) 的方法的 想要移除就不能使用匿名函数
>    >
>    >    本质的原因
>    >
>    >    ```js
>    >    var a = function() {
>    >      console.log(1)
>    >    }
>    >    
>    >    var b = function() {
>    >      console.log(1)
>    >    }
>    >    
>    >    console.log(a==b) // false
>    >    console.log(a===b) // false
>    >    
>    >    // 实际上在内存中生成了两个这样的函数，它们是不一样的
>    >    ```
>    >
>    >     

## React合成事件不能异步 

> `SyntheticEvent` 是在事件池中的，这意味着将重用 `SynctheticEvent` 对象，并且在调用事件回调后，所有的实行都将无效。这是处于性能考虑而实现的一种方式，所以，事件是不能以异步方式访问的

## 如何异步 （摘抄自网上）

> 因为这种事件池的特性， 也不能直接使用 `this.setState({event:event})` 来保存 event 对象，因为 `setState` 是异步的，没办法直接保存 event 对象。但是直接保存 `event.type` 是可行的。
>
> 如果需要异步访问事件属性，应在事件上调用 `event.persist()`，这种操作将从事件池中删除 `SyncthesicEvent`，并允许用户代码保留对事件的引用。
>
> 下面代码中直接调用 `e.persist()`，这在某些有网络请求的事件中可能是有帮助的 

## > setState

## this.setState在什么周期函数中尽量不要调用

> 1. render函数不可以调用，会造成死循环，每次调用又要执行render
> 2. ComponentDidUpdate中可以调用，但要注意约束条件，没有也会陷入死循环
> 3. ComponetWIllUnMount 组件将要卸载，再调用又出触发re-render

## 为什么this.setState是异步的

> 1. 保证内部数据的统一，re-render是一个很差的机制，如果是同步的话获取子组件无法同步刷新this.props会造成子组件和父组件的值不一致
>
> 2. setState异步更新状态会让并发组件成为可能
>
>    例子 : 打字过程中 TextBox需要实时的刷新，当输入的时候来了一个信息，这个时候可能让信息延后刷新更符合交互
>
>    
>
>    异步rendering不仅仅是性能上的优化，而且这可能是react组件模型在发生的根本性的改变
>
> 

## setState总结

> setState只在合成事件和钩子函数中是'异步'的，在原生事件和setTimeout都是同步的
>
> setState的‘异步’并不是内部由异步代码实现，本身执行的过程和代码都是同步的，但是合成事件和钩子函数的调用顺序再更新之前，所以不能马上拿到更新的，形成了所谓的异步，可以用第二个参数callback来拿到
>
> setState的批量更新也是建立在异步之上的，原生事件和setTimeout中不会批量更新，在‘异步’中如果对一个值多次setState,批量更新策略会对其覆盖，取最后一次的执行，如果是同时setState多个不同的值，更新时会进行批量合并更新





 