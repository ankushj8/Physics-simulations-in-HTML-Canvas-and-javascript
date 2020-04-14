import utils from './utils'
import c_utils from './c_utils'

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

const mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2
}

const a = 10  //gravity / acceleration
const maxRadius = 50
const colors = ['#2185C5', '#7ECEFD', '#FFF6E5', '#FF7F66', '#000000']
const ts = 0.1 //timestep
var s = 0 //small distance
var vy_incr = 0
let x, y, r

// Event Listeners
addEventListener('mousemove', (event) => {
  mouse.x = event.clientX
  mouse.y = event.clientY
})

addEventListener('resize', () => {
  canvas.width = innerWidth
  canvas.height = innerHeight

  init()
})
addEventListener('click', function(){
  init()
})



// Objects
class Object {
  constructor(x, y, radius, color) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.velocity = {
      y: 0,
      x: (Math.random() - 0.5)*100
    }
    this.fricy = 0*Math.random()/10
    this.fricx = 0*Math.random()/10
    this.mass = radius
  }

  draw() {
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = this.color
    c.fill()
    // c.stroke()
    c.closePath()
  }

  update(objects) {
    if (this.y + this.radius + this.velocity.y*ts + 0.5*a*ts*ts> innerHeight || this.y + this.radius> innerHeight){
      this.velocity.y = -1*Math.abs(this.velocity.y) 
      this.velocity.y -= Math.sqrt(this.fricy)*this.velocity.y
    }
    else if(this.y - this.radius + this.velocity.y*ts + 0.5*a*ts*ts< 0 || this.y - this.radius < 0){
      this.velocity.y = Math.abs(this.velocity.y)
      this.velocity.y -= Math.sqrt(this.fricy)*this.velocity.y
    }
    if (this.x + this.radius + this.velocity.x*ts> innerWidth || this.x + this.radius> innerWidth){
      this.velocity.x = -1*Math.abs(this.velocity.x) 
      this.velocity.x -= Math.sqrt(this.fricx)*this.velocity.x
    }
    else if(this.x - this.radius + this.velocity.x*ts< 0 || this.x - this.radius < 0){
      this.velocity.x = Math.abs(this.velocity.x)
      this.velocity.x -= Math.sqrt(this.fricx)*this.velocity.x
    }

    for (let i = 0; i < objects.length; i++) {
      // console.log('Im inside')
      if (this == objects[i]) continue;
      if (utils.distance(this.x, this.y, objects[i].x, objects[i].y) < this.radius + objects[i].radius){
        c_utils.resolveCollision(this, objects[i])
      }  
      
    }
    s = this.velocity.y*ts + 0.5*a*ts*ts
    vy_incr = this.velocity.y + a*ts
    this.velocity.y = vy_incr
    this.y += s
    this.x += this.velocity.x*ts
    this.draw()
  }
}

// Implementation
let objects
function init() {
  objects = []

  for (let i = 0; i < 10; i++) {
    x = utils.randomIntFromRange(maxRadius, innerWidth-maxRadius)
    y = utils.randomIntFromRange(maxRadius, innerHeight-maxRadius)
    r = utils.randomIntFromRange(10, 30)
      for (let j = 0; j < objects.length; j++){
        if (utils.distance(x, y, objects[j].x, objects[j].y) < objects[j].radius + r){
          x = utils.randomIntFromRange(maxRadius, innerWidth-maxRadius)
          y = utils.randomIntFromRange(maxRadius, innerHeight-maxRadius)
          r = utils.randomIntFromRange(10, 30)
          j = -1
        }
      }
    objects.push(new Object(x, y, r, utils.randomColor(colors)))
  }
}

// Animation Loop
function animate() {
  requestAnimationFrame(animate)
  c.clearRect(0, 0, canvas.width, canvas.height)
  var kinetic = 0, potential = 0;
  objects.forEach(object => {
    kinetic += 0.5*object.mass*(object.velocity.x**2 + object.velocity.y**2)
    // momx += object.mass*Math.abs(object.velocity.x)
    // momy += object.mass*Math.abs(object.velocity.y)
    //It's useless to talk about momentum because the wall is also involved which reflects the balls
    potential += object.mass*a*(innerHeight- object.x)
   })

  console.log(kinetic + potential)
   // c.fillText(energy, mouse.x, mouse.y)
  objects.forEach(object => {
   object.update(objects)
  })
}

init()
animate()

console.log('Lets do this')