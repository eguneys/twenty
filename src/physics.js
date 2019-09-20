import * as v from './vector3';

const { vec3 } = v;

export default function Physics(opts) {
  
   opts = { pos: vec3(0),
            vel: vec3(0),
            acc: vec3(0),
            theta: vec3(0),
            vTh: vec3(0),
            friction: vec3(-0.2),
            gravity: vec3(0, -80, 0),
            ...opts };

  let { pos, vel, acc, theta, vTh, friction, gravity } = opts;

  this.pos = ({ x = pos[0], y = pos[1], z = pos[2] }) => {
    pos[0] = x;
    pos[1] = y;
    pos[2] = z;
  };

  this.force = ({ x = acc[0], y = acc[1], z = acc[2] }) => {
    acc[0] = x;
    acc[1] = y;
    acc[2] = z;
  };

  this.forceY = () => acc[1];
  this.forceX = () => acc[0];

  this.gravityY = () => gravity[1];

  this.values = (_pos = pos, _theta = theta) => {

    return {
      x: _pos[0],
      y: _pos[1],
      z: _pos[2],
      theta: [_theta[0],
              _theta[1],
              _theta[2]]
    };
  };

  this.calculateUpdate = (delta, collisions = {}) => {
    const dt = delta * 0.01;

    let newTheta = v.addScale(theta, vTh, dt);

    let newVel = vel;

    newVel = v.add(newVel, v.mul(newVel, friction));
    newVel = v.addScale(newVel, acc, dt);
    newVel = v.addScale(newVel, gravity, dt);

    if ((collisions.top && newVel[1] < 0) ||
        (collisions.bottom && newVel[1] > 0)) {
      newVel[1] = 0;
    }
    if ((collisions.left && newVel[0] < 0) ||
        (collisions.right && newVel[0] > 0)) {
      newVel[0] = 0;
    }

    let newPos = v.addScale(pos, newVel, dt);

    return {
      theta: newTheta,
      vel: newVel,
      pos: newPos
    };
  };

  this.applyUpdate = update => {
    theta = update.theta;
    vel = update.vel;
    pos = update.pos;
  };

  this.update = delta => {
    this.applyUpdate(this.calculateUpdate(delta));
  };
}
