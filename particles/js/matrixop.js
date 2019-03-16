// basic matrix stuff
Array.prototype.dot      = function(b) { return this.map((x, i) => this[i] * b[i]).reduce((m, n) => m + n); }
Array.prototype.t        = function()  { return this[0].map((x, i) => this.map(y => y[i])); }
Array.prototype.multiply = function(b) { return this.map(x => b.t().map(y => x.dot(y))); }

// Elementwise operations
Array.prototype.vecprod  = function(b) { return this.map((x, i) => this[i] * b[i]); }
Array.prototype.vecdiv   = function(b) { return this.map((x, i) => this[i] / b[i]); }
Array.prototype.vecsum   = function(b) { return this.map((x, i) => this[i] + b[i]); }