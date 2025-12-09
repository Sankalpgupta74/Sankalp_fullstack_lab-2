const q = s => document.querySelector(s)
const qAll = s => Array.from(document.querySelectorAll(s))

class VisualList {
  constructor(container, mode='array') {
    this.container = container
    this.mode = mode
    this.data = []
  }
  push(v) {
    this.data.push(v)
    const el = this.createEl(v)
    this.container.appendChild(el)
    requestAnimationFrame(()=>el.classList.add('animate'))
    return v
  }
  pop() {
    if (!this.data.length) return null
    const v = this.data.pop()
    const el = this.container.lastElementChild
    if (el) this.animateRemove(el)
    return v
  }
  unshift(v) {
    this.data.unshift(v)
    const el = this.createEl(v)
    this.container.insertBefore(el, this.container.firstElementChild)
    requestAnimationFrame(()=>el.classList.add('animate'))
    return v
  }
  shift() {
    if (!this.data.length) return null
    const v = this.data.shift()
    const el = this.container.firstElementChild
    if (el) this.animateRemove(el)
    return v
  }
  clear() {
    while (this.container.firstChild) {
      this.animateRemove(this.container.firstChild)
    }
    this.data = []
  }
  createEl(value) {
    const el = document.createElement('div')
    el.className = 'element adding'
    el.textContent = String(value)
    setTimeout(()=>{el.classList.remove('adding');el.classList.add('animate')},20)
    return el
  }
  animateRemove(el) {
    el.classList.add('removing')
    el.classList.remove('animate')
    el.addEventListener('transitionend',()=>el.remove(),{once:true})
  }
}

function log(msg) {
  const list = q('#log')
  const li = document.createElement('li')
  li.textContent = `${new Date().toLocaleTimeString()}: ${msg}`
  list.prepend(li)
}

const arrayVis = new VisualList(q('#arrayVis'),'array')
const stackVis = new VisualList(q('#stackVis'),'stack')
const queueVis = new VisualList(q('#queueVis'),'queue')

q('#arrPush').addEventListener('click',()=>{
  const v = q('#arrayValue').value.trim()
  if(!v) return
  arrayVis.push(v)
  log(`array.push(${v})`)
  q('#arrayValue').value=''
})
q('#arrPop').addEventListener('click',()=>{
  const v = arrayVis.pop()
  log(v===null?`array.pop() -> empty`:`array.pop() -> ${v}`)
})
q('#arrUnshift').addEventListener('click',()=>{
  const v = q('#arrayValue').value.trim()
  if(!v) return
  arrayVis.unshift(v)
  log(`array.unshift(${v})`)
  q('#arrayValue').value=''
})
q('#arrShift').addEventListener('click',()=>{
  const v = arrayVis.shift()
  log(v===null?`array.shift() -> empty`:`array.shift() -> ${v}`)
})
q('#arrClear').addEventListener('click',()=>{
  arrayVis.clear()
  log('array cleared')
})

q('#stackPush').addEventListener('click',()=>{
  const v = q('#stackValue').value.trim()
  if(!v) return
  stackVis.push(v)
  log(`stack.push(${v})`)
  q('#stackValue').value=''
})
q('#stackPop').addEventListener('click',()=>{
  const v = stackVis.pop()
  log(v===null?`stack.pop() -> empty`:`stack.pop() -> ${v}`)
})
q('#stackClear').addEventListener('click',()=>{
  stackVis.clear()
  log('stack cleared')
})

q('#queueEnq').addEventListener('click',()=>{
  const v = q('#queueValue').value.trim()
  if(!v) return
  queueVis.push(v)
  log(`queue.enqueue(${v})`)
  q('#queueValue').value=''
})
q('#queueDeq').addEventListener('click',()=>{
  const v = queueVis.shift()
  log(v===null?`queue.dequeue() -> empty`:`queue.dequeue() -> ${v}`)
})
q('#queueClear').addEventListener('click',()=>{
  queueVis.clear()
  log('queue cleared')
})

document.addEventListener('keydown',e=>{
  if(e.key==='Enter'){
    const focused = document.activeElement
    if(focused && focused.tagName==='INPUT'){
      focused.nextElementSibling?.click?.()
    }
  }
})
