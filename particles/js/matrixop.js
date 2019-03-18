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

// Extending the array class with matrix / vector notation operations.

// basic matrix stuff
Array.prototype.dot      = function(b) { return this.map((x, i) => this[i] * b[i]).reduce((m, n) => m + n); }
Array.prototype.t        = function()  { return this[0].map((x, i) => this.map(y => y[i])); }
Array.prototype.multiply = function(b) { return this.map(x => b.t().map(y => x.dot(y))); }

// Elementwise operations
Array.prototype.vecprod  = function(b) { return this.map((x, i) => this[i] * b[i]); }
Array.prototype.vecdiv   = function(b) { return this.map((x, i) => this[i] / b[i]); }
Array.prototype.vecsum   = function(b) { return this.map((x, i) => this[i] + b[i]); }