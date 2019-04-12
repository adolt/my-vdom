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
    <li class='list--item'>item1</li>
    <li style='color: blue;'>item2</li>
    <li onClick={e => window.alert(e.target.innerHTML)}>item3(click me)</li>
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

document.getElementById('app').appendChild(createElement(List))
