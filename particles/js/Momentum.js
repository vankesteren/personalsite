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

// Main class defining a momentum animation in an svg object on a webpage
class Momentum {
    constructor(parent) {
        // The momentum object should be associated with a parent element
        if (typeof parent === "string") {
            this.parent = document.getElementById(parent);
        } else if (typeof parent === "object") {
            this.parent = parent;
        } 
        if (typeof this.parent != "object") {
            throw Error("Input parent id or DOM object.")
        }

        // Create an svg element to interact with
        let ns = "http://www.w3.org/2000/svg";
        let vb = "-5 -5 10 10"; // viewBox: range of plotting
        this.svg = document.createElementNS(ns, "svg");
        this.svg.setAttributeNS(null, "class", "mm-svg");
        this.svg.setAttribute("viewBox", vb);
        this.svg.setAttribute("xmlns", ns);
        this.parent.appendChild(this.svg);

        // Instantiate the surface for the particles
        this.surface = new Surface(2, 2, 0);

        // animation stuff
        this.anispeed  = 0.05;
        this.sizerange = 10;
    }

    // ---------------
    // Public methods
    // ---------------
    initParticles(n, prange = 0, vrange = 0, mrange = 0) {
        // Empty particles and DOM elements
        this.particles = [ ];
        while (this.svg.firstChild) {
            this.svg.removeChild(this.svg.firstChild);
        }

        // Generate particles
        for (var i = 0; i < n; i++) {
            let pos = [ ( Math.random() - 0.5 ) * prange, 
                        ( Math.random() - 0.5 ) * prange ];
            let vel = [ ( Math.random() - 0.5 ) * vrange * this.anispeed, 
                        ( Math.random() - 0.5 ) * vrange * this.anispeed];
            let m   = 1 + Math.random() * mrange;
            this.particles.push(new Particle(pos, m, vel, 
                                             this.surface, this.sizerange));
        }

        // attach new DOM elements
        this.particles.map((p) => this.svg.appendChild(p.element));

    }

    addParticle(prange = 0, vrange = 0, mrange = 0) {
        // generate particle parameters
        let pos = [ ( Math.random() - 0.5 ) * prange, 
                    ( Math.random() - 0.5 ) * prange ];
        let vel = [ ( Math.random() - 0.5 ) * vrange * this.anispeed, 
                    ( Math.random() - 0.5 ) * vrange * this.anispeed];
        let m   = 1 + Math.random() * mrange;

        // instantiate particle
        this.particles.push(new Particle(pos, m, vel, 
                                         this.surface, this.sizerange));

        // attach the DOM element
        this.svg.appendChild(this.particles[this.particles.length - 1].element);
    }

    draw(dt) {
        this.particles.map((p) => p.update(dt*this.anispeed));
    }
}

