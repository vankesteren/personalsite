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
    constructor(a, b, c) {
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
