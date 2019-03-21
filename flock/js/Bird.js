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
class Bird {
    constructor(pos, m = 1, v, flock) {
        // Set properties
        this.pos        = pos;        // position
        this.m          = [ m, m ];   // importance
        this.v          = v;          // velocity (array of 2)
        this.neighbours = [];         // list of neighbours
        this.flock      = flock;      // reference to field
        
        // Create an svg circle element for this particle
        let ns = "http://www.w3.org/2000/svg"
        this.element = document.createElementNS(ns, "circle");
        this.element.setAttributeNS(null, "cx", this.pos[0]);
        this.element.setAttributeNS(null, "cy", -this.pos[1]);
        this.element.setAttributeNS(null, "r", "0.25%");
        this.element.setAttributeNS(null, "fill", "rgb(128, 128, 128)");
    }


    findNeighbours() {
        this.neighbours = [];
        let dists = this.flock.birds.map((b) => {
            return this.pos.dot(b.pos)
        });
        dists
            .map((val, i) => { return {value: val, index: i}; })
            .sort((a, b) => { return a.value - b.value; })
            .slice(0, this.flock.attention)
            .map((d) => { this.neighbours.push(this.flock.birds[d.index]); });
    }

    destroy() {
        this.element = null;
        delete this;
    }
    
    update(dt) { 
        // dt = time interval
        this.findNeighbours();
        // calculate the new position and velocity of the particle
        
        let vel = [ ( Math.random() - 0.5 ) * this.flock.randv * dt, 
                    ( Math.random() - 0.5 ) * this.flock.randv * dt ];
        this.neighbours.map((bird) => { 
            let step = bird.pos
                .vecmin(this.pos)
                .vecsum(bird.v.vecmin(this.v))
                .vecprod(bird.m)
                .vecprod([dt, dt])
                .vecdiv([2*this.flock.attention, 2*this.flock.attention]);
            this.v   = this.v.vecprod(this.m).vecsum(step).vecsum(vel).vecdiv(this.m);
        });
        
        this.pos = this.pos.vecsum(this.v);

        // update the position of the associated DOM element
        this.element.setAttributeNS(null, "cy", -this.pos[1]);
        this.element.setAttributeNS(null, "cx", this.pos[0]);
    }
}