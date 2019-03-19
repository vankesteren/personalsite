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

// Class for defining the surface the particles will roll on.
class Surface {
    // a surface should have a name
    constructor(name) {
        this.name = name;
    }

    // a surface should have a height
    fun(x) {
        console.error("Implement function value method for " + this.name);
        window.stop();
    }

    // a surface should have a gradient
    grad(x) {
        console.error("Implement gradient method for " + this.name);
        window.stop();
    }
}


class Parabola extends Surface {
    // ax^2 + by^2 + cxy
    constructor(a = 2, b = 2, c = 0) {
        super("Parabola");
        this.a = a;
        this.b = b;
        this.c = c;
    }

    // Function value defining the height of the surface
    fun(x) {
        return this.a * Math.pow(x[0], 2) + 
                this.b * Math.pow(x[1], 2) + 
                this.c * x[0] * x[1];
    }
    // Vector of partial derivatives (gradient of the height)
    grad(x) {
        return [
            2 * this.a * x[0] + this.c * x[1],
            2 * this.b * x[1] + this.c * x[0]
        ];
    }
}

// Rosenbrock banana function
class Banana extends Surface {
    // (a - x)^2 + b(y - x^2)^2
    constructor(a = 1, b = 100) {
        super("Banana");
        this.a = a;
        this.b = b;
    }
    // function value
    fun(x) {
        return Math.pow(this.a - x[0], 2) +
                this.b * Math.pow(x[1] - Math.pow(x[0], 2), 2);
    }
    // gradient
    grad(x) {
        return [
            -2 * this.a + 4 * this.b * Math.pow(x[0], 3) - 
            4 * this.b * x[0] * x[1] + 2 * x[0],
            2 * this.b * (x[1] - Math.pow(x[0], 2))
        ];
    }
}

// Centered bivariate normal negative log-likelihood
class BiNormNegLogLik extends Surface {
    constructor(sdx = 0.5, sdy = 0.5, cor = 0) {
        super("Bivariate normal negative log-likelihood");
        this.sdx = sdx;
        this.sdy = sdy;
        this.cor = cor;
        this.term = - Math.log(2 * Math.PI * sdx * sdy * Math.sqrt(1 - this.cor * this.cor));
        this.fact = 1 / (2 * (1 - this.cor * this.cor));
        this.sdx2 = this.sdx * this.sdx;
        this.sdy2 = this.sdy * this.sdy;
        this.sdxy = this.sdx * this.sdy;
    }
    fun(x) {
        let term_a = (x[0] * x[0]) / this.sdx2;
        let term_b = (2 * this.cor * x[0] * x[1]) / this.sdxy;
        let term_c = (x[1] * x[1]) / this.sdy2;
        return this.term + this.fact * (term_a - term_b + term_c);
    }
    grad(x) {
        let ddx_term_a = 2 * x[0] / this.sdx2;
        let ddx_term_b = (2 * this.cor * x[1]) / this.sdxy;
        let ddy_term_c = 2 * x[1] / this.sdy2;
        let ddy_term_b = (2 * this.cor * x[0]) / this.sdxy;
        return [this.fact * (ddx_term_a - ddx_term_b), 
                this.fact * (ddy_term_c - ddy_term_b)]
    }
}