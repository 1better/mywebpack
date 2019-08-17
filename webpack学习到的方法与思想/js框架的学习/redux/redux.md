## redux    2019.8.14 今天必须把之前的redux学习的整理完！

## 为什么需要redux

> redux可以看作前端的数据库，来存取数据
>
> react有props和state:props意味着父级分发下来的属性，state意味着组件内部可以自行管理的状态，并且整个React没有数据向上回溯的能力，也就是说数据只能单向向下分发，或者自行内部消化。
>
> 如果一个项目很庞大，如果只是利用react的单向数据流（如父组件的父组件向父组件的子组件这样传递数据），就需要一层一层地来处理，会让项目难以维护，显得很臃肿
>
> 而当我们使用redux的时候，把数据统一的交给它，用的时候就使用，更改的时候就更改，只需要它一个就足够了，相当于所有的组件都共用了一个父组件

## redux并不是和react有关系

> redux不像vue和vuex那样的依赖关系，redux就是一个状态管理库，可以不依赖react而使用，而在react中选择使用redux是因为它的实用性以及操作的方便性

## redux的重要概念

> createStore.  公共库，类似于数据库，存储所有状态。
>
> action。行为，必须要有一个type字段，没有逻辑的处理。
>
> reducer   处理action行为，判断action的type，如果没有就原样返回，如果有就返回新的状态
>
> combineReducers。将reducer组合
>
> state  状态

## redux的原则

> 1. 单一数据源   **整个应用的 state 被储存在一棵 object tree 中，并且这个 object tree 只存在于唯一一个 store 中**
> 2. state是只读的  **唯一改变 state 的方法就是触发 action，action 是一个用于描述已发生事件的普通对象**（这样确保了视图和网络请求都不能直接修改state）
> 3. 使用纯函数来进行修改。为了描述action如何改变state tree ，需要编写reducer  reducer是纯函数，接受先前的state和action，返回新的state

## 延伸

### 1. 什么叫纯函数

> 即相同的输入，永远会得到相同的输出，而且没有任何可观察的副作用。
>
> 通俗来讲，就两个要素
>
> 1. 相同的输入，一定会得到相同的输出
> 2. 不会有 “触发事件”，更改输入参数，依赖外部参数，打印 log 等等副作用

### 2. redux的方法

> - createStore
>
> 创建 store 对象，包含 getState, dispatch, subscribe, replaceReducer
>
> - reducer
>
> reducer 是一个计划函数，接收旧的 state 和 action，生成新的 state
>
> - action
>
> action 是一个对象，必须包含 type 字段
>
> - dispatch
>
> `dispatch( action )` 触发 action，生成新的 state
>
> - subscribe
>
> 实现订阅功能，每次触发 dispatch 的时候，会执行订阅函数
>
> - combineReducers
>
> 多 reducer 合并成一个 reducer
>
> - replaceReducer
>
> 替换 reducer 函数
>
> - middleware (中间件)
>
> 扩展 dispatch 函数！ 

## react中使用redux

## React-redux

1. Provide方法

> 可以将store中的数据传给包裹的组件

2. connect方法

> connect(mapStateToProps,mapDispatchToProps)(App)
>
> 第一个参数是将store中的状态传给app组件
>
> 第二个参数可以让app组件操作方法，更改状态

## react和redux以及react-redux的具体使用

> ```js
> // action
> export const addTodo = value => ({
> type: 'ADD_TODO',
> id: id++,
> value,
> checked:false
> })
> ```
>
> ```js
> // reducer
> // state 有一个默认值
> const todos = (state = [], action) => {
> switch (action.type) {
>  case "ADD_TODO":
>    return [...state, { id: action.id, value: action.value, checked: false }];
>  case "TOGGLE_ONETODO":
>    // let newState = JSON.parse(JSON.stringify(state))
>    /* let newState = state;
>    
>    newState[action.id].checked = !newState[action.id].checked
>    console.log(newState)
>    return newState */
>    return state.map(item =>
>      item.id === action.id ? { ...item, checked: !item.checked } : item
>    );
> 
>  // 注意。state必须要深克隆修改，如果在原来状态下修改或者浅拷贝的话新旧的state都会变成一样的，这样就无法触发render函数，和之前的this.setState以及this.state = 一样，触发render函数必须要遵循规则
> export default todos;
> ```
>
> ```js
> // reducers的合并
> import { combineReducers } from 'redux';
> 
> const rootReducer =  combineReducers({
> todos:todos,
> completed:completed
> })
> 
> export default rootReducer
> ```
>
> ```js
> //store中
> import {createStore} from 'redux'
> import rootReducer from '../reducers/rootReducer'
> 
> let initState = {
> todos:  [{id:0,value:'222',checked:false}],
> completed: 0,
> }
> 
> export default function Store(){
> const store = createStore(rootReducer,initState)
> return store
> }
> ```
>
> ```js
> //组件使用redux的方法
> import React, { Component } from "react";
> import {connect} from 'react-redux'
> import {toggleOneTodo,toggleAllTodo,completed, deleteOneTodo,updateOneTodo} from '../../actions'
> 
> import './main.css' 
> 
> class Main extends Component {
> constructor(props) {
>  super(props);
> }
> 
> handleAll = (allCompleted,length) => {
>  let {handleAllChange,setCompleted} = this.props
>  if(allCompleted) {
>    setCompleted(length)
>  }else {
>    setCompleted(0)
>  }
>  handleAllChange(allCompleted)
> }
> 
> handleOne = (completed,id,number) => {
>  let {handleOneChange,setCompleted} = this.props
>  
>  // *  换一种写法   
>  if(completed) {
>    setCompleted(++number)
>  }else {
>    setCompleted(--number)
>  }
> 
>  handleOneChange(id)
> }
> 
> handleDel = (id) => {
>  let {onDel,setCompleted,completed} = this.props
>  onDel(id)
>  setCompleted(--completed)
> }
> 
> handleUpdate = (id) => {
>  let {onUpdate,todos} = this.props
>  let oldValue
>  todos.forEach(item => {
>    if(item.id==id){
>      oldValue = item.value
>  }})
>  const value = window.prompt(`原先为${oldValue}`)
>  onUpdate(id,value)
> }
> render() {
>  // 接受store传过来的item数据 
>  let {todos,completed} = this.props
>  let list = todos.map(item => {
>    let display = item.checked ? 'block':'none'
>    return (
>      <li key={item.id} className={item.checked ? "done" : ""}>
>        <div className="view">
>          <input
>            className="toggle"
>            type="checkbox"
>            checked={item.checked}
>            // 当checked发生改变，传递给父组件来处理这个状态
>            onChange={(e)=>{this.hanleOne(e.target.checked,item.id,completed)}}
>          />
>          <label> {item.value} </label>
>          {/* 删除操作 onClick={this.props.onDel(index)}*/}
>          <a className="destroy" style={{display}} onClick={() => this.handleDel(item.id) }>删除</a>
>          <a className="update"  onClick={() => this.handleUpdate(item.id)}>更新</a>
>        </div>
>      </li>
>    );
>  });
>  
>  return (
>    <div>
>      <div className="main">
>      <input
>        id="toggle-all"
>        type="checkbox"
>        checked={completed==list.length}
>        onChange={(e)=>this.handleAll(e.target.checked,list.length)}
>      />
>      <label htmlFor="toggle-all">Mark all as complete</label>
>      <ul className="todo-list">{list}</ul>
>    </div>
>    </div>
>  );
> }
> }
> 
> 
> // connect方法的两个参数
> 
> function mapTostate(state) {
> 	return {...state}
> }
> 
> function mapDispatchProps(dispatch) {
> return {
>  // handleAllChange: dispatch()
>  	handleOneChange: (id) => {
>    	dispatch(toggleOneTodo(id))
>  	},
>  	handleAllChange: (checked) => {
>    	dispatch(toggleAllTodo(checked))
>  	},
>  setCompleted:(number) => {
>    dispatch(completed(number))
>  },
>  onDel:(id) => {
>    dispatch(deleteOneTodo(id))
>  },
>  onUpdate: (id,msg) => {
>    dispatch(updateOneTodo(id,msg))
>  }
> }
> }
> export default connect(mapTostate,mapDispatchProps)(Main)
> ```
>
>   

## 报过的错误

报错```Reducer "todos" returned undefined during initialization. If the state passed to the reducer is undefined, you must explicitly return the initial state. The initial state may not be undefined. If you don't want to set a value for this reducer, you can use null instead of undefined```

> 每个传入 combineReducers 的 reducer 都需满足以下规则：
>
> - 所有未匹配到的 action，必须把它接收到的第一个参数也就是那个 state 原封不动返回。
> - 永远不能返回 undefined。当过早 return 时非常容易犯这个错误，为了避免错误扩散，遇到这种情况时 combineReducers 会抛异常。
> - 如果传入的 state 就是 undefined，一定要返回对应 reducer 的初始 state。根据上一条规则，初始 state 禁止使用 undefined。使用 ES6 的默认参数值语法来设置初始 state 很容易，但你也可以手动检查第一个参数是否为 undefined。
>
> 虽然 combineReducers 自动帮你检查 reducer 是否符合以上规则，但你也应该牢记，并尽量遵守

### 延伸

## 为什么redux需要给state一个默认值

> ```js
> // 下方的代码在页面渲染的时候就会调用，会打印判断。
> // 这个代码在store中创建初始状态的时候之前就会调用
> const completed = (state = 1,action) => {
> console.log(action)
> switch(action.type){
>  case 'COMPLETED':
>    return action.number
>  default: {
>    
>    console.log(state)
>    return state
>  }
>    
> }
> }
> export default completed
> ```
>
> ```js
> // 一开始页面还没有加载的时候会运行前两遍的打印1。
> 
> {type: "@@redux/INIT8.y.j.q.5.e"}
> 1
> {type: "@@redux/PROBE_UNKNOWN_ACTIONu.o.7.r.r.h"}
> 1
> {type: "@@redux/INIT8.y.j.q.5.e"}
> 0
> 
> // 在creatStore之前需要导入组合reducer 而组合的也要导入compelet和todo的reducer import的时候会调用判断它的初始状态，此时的initState还没有派上用场，所以不传入初始值的时候这时会返回undefined 从而报错，所以state必须要有一个初始值
> ```
>
> 

## 为什么直接修改redux中state的值不发生变化

> #### **Store 会把两个参数传入 reducer： 当前的 state 和 action**，所以不能直接修改state，redux会比较新旧state的值，直接修改state会导致store内部的也发生改变，那么新旧state也就没有发生变化。页面就不会重新渲染
>
> ### 同理。react中也不能修改this.state的值
>
> ```js
> case 'TOGGLE_ONETODO':
>    // let newState = JSON.parse(JSON.stringify(state))
>    let newState = state;
>    
>    newState[action.id].checked = !newState[action.id].checked
>    debugger
>    console.log(newState)
>    return newState
> // 这样就不会触发render
> ```
>
> 



