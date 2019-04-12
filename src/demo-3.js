/** @jsx h */
import flatten from 'flatten'

function VNode(type, props, children) {
  this.type = type
  this.props = props
  this.children = children
}

function h(type, props, ...children) {
  return new VNode(type, props || {}, children)
}

const List = (
  <ul class='list'>
    <li>item1</li>
    <li>item2</li>
    <li>item3</li>
    {[4, 5].map(index => (
      <li>item{index}</li>
    ))}
  </ul>
)

function createElement(vnode) {
  if (!(vnode instanceof VNode)) {
    return document.createTextNode(vnode)
  }
  const el = document.createElement(vnode.type)

  // 设置属性，待补充

  // 添加子节点
  const fragment = document.createDocumentFragment()
  flatten(vnode.children).forEach(child => {
    fragment.appendChild(createElement(child))
  })
  el.appendChild(fragment)
  // 返回真实 dom 元素
  return el
}

document.getElementById('app').appendChild(createElement(List))
