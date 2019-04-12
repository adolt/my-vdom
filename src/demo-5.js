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

const List = props => (
  <ul class='list'>
    <li class='list--item'>item1</li>
    <li style='color: blue;'>item2</li>
    <li onClick={e => window.alert(e.target.innerHTML)}>item3(click me)</li>
    {props.items.map(index => (
      <li>item{index}</li>
    ))}
  </ul>
)

function createElement(vnode) {
  if (!(vnode instanceof VNode)) {
    return document.createTextNode(vnode)
  }
  const el = document.createElement(vnode.type)
  // 设置属性
  setProps(el, vnode.props)
  // 添加子节点
  const fragment = document.createDocumentFragment()
  flatten(vnode.children).forEach(child => {
    fragment.appendChild(createElement(child))
  })
  el.appendChild(fragment)
  // 返回真实 dom 元素
  return el
}

function setProp(el, propName, propValue) {
  const lower = str => str.toLowerCase()
  const isEventProp = p => p.slice(0, 2) === 'on'

  if (isEventProp(propName)) {
    el.addEventListener(lower(propName.slice(2)), propValue)
  } else {
    typeof propValue !== 'undefined' && el.setAttribute(propName, propValue)
  }
}

function setProps(el, props) {
  Object.keys(props).forEach(propName => setProp(el, propName, props[propName]))
}

function updateDom(el, newVNode, oldVNode, index = 0) {
  if (!oldVNode) {
    el.appendChild(createElement(newVNode))
  } else if (!newVNode) {
    el.removeChild(el.childNodes[index])
  } else if (isDifferent(newVNode, oldVNode)) {
    el.replaceChild(createElement(newVNode), el.childNodes[index])
  } else if (newVNode instanceof VNode) {
    // 两个节点都是类型相同的 VNode
    // 对比、更新属性值

    // 递归对比他们的子节点
    const newVNodeChildren = flatten(newVNode.children)
    const oldVNodeChildren = flatten(oldVNode.children)
    const newLength = newVNodeChildren.length
    const oldLength = oldVNodeChildren.length

    let i = Math.max(newLength, oldLength) - 1
    while (i >= 0) {
      updateDom(
        el.childNodes[index],
        newVNodeChildren[i],
        oldVNodeChildren[i],
        i
      )
      i--
    }
  }
}

function isDifferent(newVNode, oldVNode) {
  return (
    // 节点类型不同
    typeof newVNode !== typeof oldVNode ||
    // 节点类型相同，且都不是 VNode（是 number 和 string），且值不相同
    (!(newVNode instanceof VNode) && newVNode !== oldVNode) ||
    // 两个节点标签类型不同
    newVNode.type !== oldVNode.type
  )
}

// 渲染
const appEl = document.getElementById('app')
updateDom(appEl, List({ items: [4, 5] }))

// 更新
setTimeout(() => {
  // updateDom(appEl, null, List({ items: [4, 5] }))
  // updateDom(appEl, 'hello world', List({ items: [4, 5] }))
  updateDom(appEl, List({ items: [5] }), List({ items: [4, 5] }))
}, 5000)
