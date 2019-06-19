## webpack学习...04

## 安装

> ```shell
> # 安装tapable
> cnpm i tapable
> ```
>
> 

## Tapable

> 介绍：本质是一种事件流的机制，核心是把各个插件串联起来，实现这一核心的就是Tapable，类似于nodejs的events库，采用的发布订阅的模式  

## PS

> forEach是并行操作
>
> 一共有三个文件夹   分别对应着同步  异步并行  异步串行的各个方法以及实现