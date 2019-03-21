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
        this.neighbours = { // list of neighbours
            separation : [],
            alignment  : [],
            cohesion   : []
        };         
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
        this.neighbours = { // list of neighbours
            separation : [],
            alignment  : [],
            cohesion   : []
        };   
        let dists = this.flock.birds.map((b) => {
            return this.pos.dot(b.pos)
        });
        let dists_sorted = dists
            .map((val, i) => { return {value: val, index: i}; })
            .sort((a, b) => { return a.value - b.value; })
        
        // separation
        dists_sorted
            .slice(0, this.flock.params.separation.k)
            .map((d) => { this.neighbours.separation.push(this.flock.birds[d.index]); });
        
        // alignment
        dists_sorted
            .slice(0, this.flock.params.alignment.k)
            .map((d) => { this.neighbours.alignment.push(this.flock.birds[d.index]); });
        
        // cohesion
        dists_sorted
            .slice(0, this.flock.params.cohesion.k)
            .map((d) => { this.neighbours.cohesion.push(this.flock.birds[d.index]); });
    }

    destroy() {
        this.element = null;
        delete this;
    }
    
    update(dt) { 
        // dt = time interval

        // find the neighbours
        this.findNeighbours();
        // calculate the new position and velocity of the particle
        

        // separation velocity
        let v_sep = [ 0, 0 ];
        this.neighbours.separation.map((bird) => { 
            v_sep = v_sep.vecsum(this.pos.vecmin(bird.pos));
        });
        v_sep = v_sep.vecdiv([ this.flock.params.separation.k, 
                               this.flock.params.separation.k ]);

        // alignment velocity
        let v_ali = [ 0, 0 ];
        this.neighbours.alignment.map((bird) => {
            v_ali = v_ali.vecsum(bird.v);
        })
        v_ali = v_ali.vecdiv([ this.flock.params.alignment.k, 
                               this.flock.params.alignment.k ]);
        
        // cohesion velocity
        let v_coh = [ 0, 0 ];
        this.neighbours.cohesion.map((bird) => {
            v_coh = v_coh.vecsum(bird.pos.vecmin(this.pos));
        })
        v_ali = v_ali.vecdiv([ this.flock.params.cohesion.k, 
                               this.flock.params.cohesion.k ]);

        // center component
        let v_ctr = [ 0, 0 ].vecmin(this.pos);
        
        // random component
        let v_rand = [ ( Math.random() - 0.5 ) * this.flock.params.randv * dt, 
                       ( Math.random() - 0.5 ) * this.flock.params.randv * dt ];

        
        
        this.v   = this.v
            .vecprod(this.m)
            .vecsum(v_sep.vecprod([ this.flock.params.separation.weight,
                                    this.flock.params.separation.weight ]))
            .vecsum(v_ali.vecprod([ this.flock.params.alignment.weight,
                                    this.flock.params.alignment.weight ]))
            .vecsum(v_coh.vecprod([ this.flock.params.cohesion.weight,
                                    this.flock.params.cohesion.weight ]))
            .vecsum(v_ctr.vecprod([ this.flock.params.center.weight,
                                    this.flock.params.center.weight ]))
            .vecsum(v_rand)
            .vecdiv(this.m);
        
        this.pos = this.pos.vecsum(this.v.vecprod([ dt * this.flock.anispeed, 
                                                    dt * this.flock.anispeed]));

        // update the position of the associated DOM element
        this.element.setAttributeNS(null, "cy", -(this.pos[1] % 5));
        this.element.setAttributeNS(null, "cx", this.pos[0] % 5);
    }
}