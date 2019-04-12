/** @jsx h */

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

console.log(List)
