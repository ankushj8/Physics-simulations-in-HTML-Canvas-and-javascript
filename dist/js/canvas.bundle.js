/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/js/canvas.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/js/c_utils.js":
/*!***************************!*\
  !*** ./src/js/c_utils.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Rotates coordinate system for velocities
 *
 * Takes velocities and alters them as if the coordinate system they're on was rotated
 *
 * @param  Object | velocity | The velocity of an individual particle
 * @param  Float  | angle    | The angle of collision between two objects in radians
 * @return Object | The altered x and y velocities after the coordinate system has been rotated
 */
function rotate(velocity, angle) {
  var rotatedVelocities = {
    x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
    y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
  };
  return rotatedVelocities;
}
/**
 * Swaps out two colliding particles' x and y velocities after running through
 * an elastic collision reaction equation
 *
 * @param  Object | particle      | A particle object with x and y coordinates, plus velocity
 * @param  Object | otherParticle | A particle object with x and y coordinates, plus velocity
 * @return Null | Does not return a value
 */


function resolveCollision(particle, otherParticle) {
  var xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
  var yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;
  var xDist = otherParticle.x - particle.x;
  var yDist = otherParticle.y - particle.y; // Prevent accidental overlap of particles

  if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
    // Grab angle between the two colliding particles
    var angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x); // Store mass in var for better readability in collision equation

    var m1 = particle.mass;
    var m2 = otherParticle.mass; // Velocity before equation

    var u1 = rotate(particle.velocity, angle);
    var u2 = rotate(otherParticle.velocity, angle); // Velocity after 1d collision equation

    var v1 = {
      x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2),
      y: u1.y
    };
    var v2 = {
      x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2),
      y: u2.y
    }; // Final velocity after rotating axis back to original location

    var vFinal1 = rotate(v1, -angle);
    var vFinal2 = rotate(v2, -angle); // Swap particle velocities for realistic bounce effect

    particle.velocity.x = vFinal1.x;
    particle.velocity.y = vFinal1.y;
    otherParticle.velocity.x = vFinal2.x;
    otherParticle.velocity.y = vFinal2.y;
  }
}

module.exports = {
  rotate: rotate,
  resolveCollision: resolveCollision
};

/***/ }),

/***/ "./src/js/canvas.js":
/*!**************************!*\
  !*** ./src/js/canvas.js ***!
  \**************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/js/utils.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_utils__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _c_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./c_utils */ "./src/js/c_utils.js");
/* harmony import */ var _c_utils__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_c_utils__WEBPACK_IMPORTED_MODULE_1__);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }



var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;
var mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2
};
var a = 10; //gravity / acceleration

var maxRadius = 50;
var colors = ['#2185C5', '#7ECEFD', '#FFF6E5', '#FF7F66', '#000000'];
var ts = 0.1; //timestep

var s = 0; //small distance

var vy_incr = 0;
var x, y, r; // Event Listeners

addEventListener('mousemove', function (event) {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});
addEventListener('resize', function () {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  init();
});
addEventListener('click', function () {
  init();
}); // Objects

var _Object = /*#__PURE__*/function () {
  function Object(x, y, radius, color) {
    _classCallCheck(this, Object);

    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = {
      y: 0,
      x: (Math.random() - 0.5) * 100
    };
    this.fricy = 0 * Math.random() / 10;
    this.fricx = 0 * Math.random() / 10;
    this.mass = radius;
  }

  _createClass(Object, [{
    key: "draw",
    value: function draw() {
      c.beginPath();
      c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      c.fillStyle = this.color;
      c.fill(); // c.stroke()

      c.closePath();
    }
  }, {
    key: "update",
    value: function update(objects) {
      if (this.y + this.radius + this.velocity.y * ts + 0.5 * a * ts * ts > innerHeight || this.y + this.radius > innerHeight) {
        this.velocity.y = -1 * Math.abs(this.velocity.y);
        this.velocity.y -= Math.sqrt(this.fricy) * this.velocity.y;
      } else if (this.y - this.radius + this.velocity.y * ts + 0.5 * a * ts * ts < 0 || this.y - this.radius < 0) {
        this.velocity.y = Math.abs(this.velocity.y);
        this.velocity.y -= Math.sqrt(this.fricy) * this.velocity.y;
      }

      if (this.x + this.radius + this.velocity.x * ts > innerWidth || this.x + this.radius > innerWidth) {
        this.velocity.x = -1 * Math.abs(this.velocity.x);
        this.velocity.x -= Math.sqrt(this.fricx) * this.velocity.x;
      } else if (this.x - this.radius + this.velocity.x * ts < 0 || this.x - this.radius < 0) {
        this.velocity.x = Math.abs(this.velocity.x);
        this.velocity.x -= Math.sqrt(this.fricx) * this.velocity.x;
      }

      for (var i = 0; i < objects.length; i++) {
        // console.log('Im inside')
        if (this == objects[i]) continue;

        if (_utils__WEBPACK_IMPORTED_MODULE_0___default.a.distance(this.x, this.y, objects[i].x, objects[i].y) < this.radius + objects[i].radius) {
          _c_utils__WEBPACK_IMPORTED_MODULE_1___default.a.resolveCollision(this, objects[i]);
        }
      }

      s = this.velocity.y * ts + 0.5 * a * ts * ts;
      vy_incr = this.velocity.y + a * ts;
      this.velocity.y = vy_incr;
      this.y += s;
      this.x += this.velocity.x * ts;
      this.draw();
    }
  }]);

  return Object;
}(); // Implementation


var objects;

function init() {
  objects = [];

  for (var i = 0; i < 10; i++) {
    x = _utils__WEBPACK_IMPORTED_MODULE_0___default.a.randomIntFromRange(maxRadius, innerWidth - maxRadius);
    y = _utils__WEBPACK_IMPORTED_MODULE_0___default.a.randomIntFromRange(maxRadius, innerHeight - maxRadius);
    r = _utils__WEBPACK_IMPORTED_MODULE_0___default.a.randomIntFromRange(10, 30);

    for (var j = 0; j < objects.length; j++) {
      if (_utils__WEBPACK_IMPORTED_MODULE_0___default.a.distance(x, y, objects[j].x, objects[j].y) < objects[j].radius + r) {
        x = _utils__WEBPACK_IMPORTED_MODULE_0___default.a.randomIntFromRange(maxRadius, innerWidth - maxRadius);
        y = _utils__WEBPACK_IMPORTED_MODULE_0___default.a.randomIntFromRange(maxRadius, innerHeight - maxRadius);
        r = _utils__WEBPACK_IMPORTED_MODULE_0___default.a.randomIntFromRange(10, 30);
        j = -1;
      }
    }

    objects.push(new _Object(x, y, r, _utils__WEBPACK_IMPORTED_MODULE_0___default.a.randomColor(colors)));
  }
} // Animation Loop


function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);
  var kinetic = 0,
      potential = 0;
  objects.forEach(function (object) {
    kinetic += 0.5 * object.mass * (Math.pow(object.velocity.x, 2) + Math.pow(object.velocity.y, 2)); // momx += object.mass*Math.abs(object.velocity.x)
    // momy += object.mass*Math.abs(object.velocity.y)
    //It's useless to talk about momentum because the wall is also involved which reflects the balls

    potential += object.mass * a * (innerHeight - object.x);
  });
  console.log(kinetic + potential); // c.fillText(energy, mouse.x, mouse.y)

  objects.forEach(function (object) {
    object.update(objects);
  });
}

init();
animate();
console.log('Lets do this');

/***/ }),

/***/ "./src/js/utils.js":
/*!*************************!*\
  !*** ./src/js/utils.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomColor(colors) {
  return colors[Math.floor(Math.random() * colors.length)];
}

function distance(x1, y1, x2, y2) {
  var xDist = x2 - x1;
  var yDist = y2 - y1;
  return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
}

module.exports = {
  randomIntFromRange: randomIntFromRange,
  randomColor: randomColor,
  distance: distance
};

/***/ })

/******/ });
//# sourceMappingURL=canvas.bundle.js.map