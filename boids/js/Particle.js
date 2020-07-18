// Copyright (C) 2019  Erik-Jan van Kesteren
// 
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// 
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License
// along with this program. If not, see <https://www.gnu.org/licenses/>.

// Class defining a particle, its DOM element, and its physical properties
class Particle {
    constructor(pos, m, v, surface, sizerange) {
        // Set properties
        this.pos     = pos;        // position
        this.m       = [ m, m ];   // mass
        this.v       = v;          // velocity (array of 2)
        this.surface = surface;    // reference to a surface
        this.sizerng = sizerange;  // determine min/max sizerange

        // flocking properties
        this.neighbours = [];      // reference to neighbours

        // weights (surface should have the same weight as all the flocking behaviour)
        this.w_surface    = [1.0, 1.0];
        this.w_separation = [.33, .33];
        this.w_alignment  = [.33, .33];
        this.w_cohesion   = [.33, .33];
        
        // Create an svg circle element for this particle
        let ns = "http://www.w3.org/2000/svg";
        this.element = document.createElementNS(ns, "circle");
        this.element.setAttributeNS(null, "cx", this.pos[0]);
        this.element.setAttributeNS(null, "cy", -this.pos[1]);
        this.element.setAttributeNS(null, "r", "0.5%");
        this.element.setAttributeNS(null, "fill", "rgb(128, 128, 128)");
    }

    update(dt) { 
        // dt = time interval

        // Surface vector
        let surface_delta = this.surface.grad(this.pos).vecprod([-dt, -dt]);
        

        // flock behaviour
        // separation
        let separation_delta = [0.0, 0.0];
        // alignment
        let alignment_delta = [0.0, 0.0];
        // cohesion
        let cohesion_center = [0.0, 0.0];

        // iterate over neighbours
        for (let i = 0; i < this.neighbours.length; i++) {
            let neighbour = this.neighbours[i];

            // separation: steer away from neighbours
            separation_delta = separation_delta.vecsum(this.pos.vecsum([-neighbour.pos[0], -neighbour.pos[1]]));

            // alignment: align with velocities of neighbours
            alignment_delta = alignment_delta.vecsum(neighbour.v);

            // cohesion: go towards center position of neighbours
            cohesion_center = cohesion_center.vecsum(neighbour.pos);
        }

        cohesion_center = cohesion_center.vecdiv([this.neighbours.length, this.neighbours.length]);
        let cohesion_delta = cohesion_center.vecsum(-this.pos);
        alignment_delta = alignment_delta.vecdiv([this.neighbours.length, this.neighbours.length]);

        console.log(cohesion_delta)
        let step = surface_delta.vecprod(this.w_surface)
            .vecsum(separation_delta.vecprod(this.w_separation).vecprod([dt, dt]))
            .vecsum(alignment_delta.vecprod(this.w_alignment).vecprod([dt, dt]))
            //.vecsum(cohesion_delta.vecprod(this.w_cohesion).vecprod([dt, dt]));

        
        // calculate the new position and velocity of the particle
        this.v   = this.v.vecprod(this.m).vecsum(step).vecdiv(this.m);
        this.pos = this.pos.vecsum(this.v);

        // update the position of the associated DOM element
        this.element.setAttributeNS(null, "cy", -this.pos[1]);
        this.element.setAttributeNS(null, "cx", this.pos[0]);
        
        // update the size of the associated DOM element
        let val = this.surface.fun(this.pos) * this.sizerng;
        let rad = (100 - this.sizerng + val) * 0.005;
        this.element.setAttributeNS(null, "r", rad + "%");
    }
}