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
class Flock {
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

        // Instantiate the array for the birds
        this.birds = [];
        this.attention = 5;
        this.randv = 0.1;

        // animation stuff
        this.anispeed  = 0.05;
    }

    // ---------------
    // Public methods
    // ---------------
    initBirds(n = 50, prange = 1.5, vrange = 0.5, mrange = 0) {
        // Empty particles and DOM elements
        this.birds = [ ];
        while (this.svg.firstChild) {
            this.svg.removeChild(this.svg.firstChild);
        }

        // Generate birds
        for (var i = 0; i < n; i++) {
            let pos = [ ( Math.random() - 0.5 ) * prange, 
                        ( Math.random() - 0.5 ) * prange ];
            let vel = [ ( Math.random() - 0.5 ) * vrange * this.anispeed, 
                        ( Math.random() - 0.5 ) * vrange * this.anispeed];
            let m   = 1 + Math.random() * mrange;
            this.birds.push(new Bird(pos, m, vel, this));
        }

        // attach new DOM elements
        this.birds.map((p) => this.svg.appendChild(p.element));

    }

    draw(dt) {
        this.birds.map((b) => b.update(dt*this.anispeed));
        this.birds.map((b, idx) => {
            if (b.pos[0] > 5 | b.pos[0] < -5 | b.pos[1] > 5 | b.pos[1] < -5) {
                this.svg.removeChild(this.svg.children[idx]);
                this.birds.splice(idx, 1);
            }
        })
    }
}

