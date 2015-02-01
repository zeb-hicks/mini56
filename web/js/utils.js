var SceneNode = function(o) {

    "use strict";

	if (o === undefined) o = {};

	GLOW.Node.call(this);

};

// Inherit from GLOW.Node
SceneNode.prototype = Object.create(GLOW.Node.prototype);
SceneNode.constructor = SceneNode;

SceneNode.prototype.update = function(dt, pgm, cim) {

    "use strict";

	GLOW.Node.prototype.update.call(this, dt, pgm, cim);

};

function async(fn, cb) {
	setTimeout(function() {
		fn();
		if (cb !== undefined && typeof cb === 'function') cb();
	}, 1);
}

function argsAre(args) {
	for (var i = 1; i < arguments.length; i++) {
		if (!(args[i-1] instanceof arguments[i])) return false;
	}
	return true;
}

// Tests Point vs Box collision
// Accepts:
// pointVsBox(Point <GLOW.Vector2>, Box <GLOW.Box2D>)
// pointVsBox(PointX <Number>, PointY <Number>, Box <GLOW.Box2D>)
// pointVsBox(Point <GLOW.Vector2>, BoxX <Number>, BoxY <Number>, BoxRadiusX <Number>, BoxRadiusY <Number>)
// pointVsBox(PointX <Number>, PointY <Number>, BoxX <Number>, BoxY <Number>, BoxRadiusX <Number>, BoxRadiusY <Number>)
function pointVsBox() {
	if (argsAre(arguments, GLOW.Vector2, GLOW.Vector2)) {

	} else if (arguments.length == 3) {

	} else if (arguments.length == 6 && allAreType('number', arguments)) {

	}
}

function allAreType(t) {
	for (var ti = 1; ti < arguments.length; ti++) {
		if (typeof arguments[ti] !== t) return false;
	}
	return true;
}

GLOW.Line2 = function(a, b, c, d) {
	if (a instanceof GLOW.Vector2 && b instanceof GLOW.Vector2) {
		this.a = a.x;
		this.b = a.y;
		this.c = b.x;
		this.d = b.y;
	} else if (typeof a == 'number' && typeof b == 'number' && typeof c == 'number' && typeof d == 'number') {
		this.a = a || 0;
		this.b = b || 0;
		this.c = c || 0;
		this.d = d || 0;
	} else {
		this.a = 0;
		this.b = 0;
		this.c = 0;
		this.d = 0;
	}
};

GLOW.Line2.prototype = {
	a: 0,
	b: 0,
	c: 0,
	d: 0,
	zero: function() {
		this.a = 0;
		this.b = 0;
		this.c = 0;
		this.d = 0;
	}
};

function isSimilar(a, b, c, d) {
	if (a instanceof GLOW.Vector2 && b instanceof GLOW.Vector2) {
		if (a.x === b.x && a.y === b.y) return true;
	} else {
		if (a === c && b === d) return true;
	}
	return false;
}

function squareDistance(a, b, c, d) {
	if (a instanceof GLOW.Vector2 && b instanceof GLOW.Vector2) {
		return Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2);
	} else {
		return Math.pow(a - x, 2) + Math.pow(b - y, 2);
	}
}





/*



	function Vec2(x,y) {
		this.x = x || 0;
		this.y = y || 0;
	}
	Vec2.prototype = {
		x: 0,
		y: 0,
		tag: null,
		zero: function() {
			this.x = 0;
			this.y = 0;
			this.tag = null;
		}
	};
	function Line(a,b,c,d) {
		if (a instanceof GLOW.Vector2 && b instanceof GLOW.Vector2) {
			this.a = a.x;
			this.b = a.y;
			this.c = b.x;
			this.d = b.y;
		} else if (typeof a == 'number' && typeof b == 'number' && typeof c == 'number' && typeof d == 'number') {
			this.a = a || 0;
			this.b = b || 0;
			this.c = c || 0;
			this.d = d || 0;
		} else {
			this.a = 0;
			this.b = 0;
			this.c = 0;
			this.d = 0;
		}
	}
	Line.prototype = {
		a: 0,
		b: 0,
		c: 0,
		d: 0,
		zero: function() {
			this.a = 0;
			this.b = 0;
			this.c = 0;
			this.d = 0;
		}
	};

	var Geom;
	Geom = {
		Vec2: Vec2,
		Line: Line,

		cross: function(x1,y1,x2,y2) { return x1 * y2 - y1 * x2; },
		dot: function(a,b,x,y) {
			if (typeof x !== 'undefined') {
				return a * x + b * y;
			} else {
				return a.x * b.x + a.y * b.y;
			}
		},
		same: function(a,b,x,y) {
			if (typeof x !== 'undefined') {
				return a == x && b == y;
				// return  (Math.floor(a) == Math.floor(x) && Math.floor(b) == Math.floor(y)) ||
						// (Math.round(a) == Math.round(x) && Math.round(b) == Math.round(y)) ||
						// (Math.ceil(a) == Math.ceil(x) && Math.ceil(b) == Math.ceil(y));
			} else {
				return a.x == b.x && a.y == b.y;
				// return  (Math.floor(a.x) == Math.floor(b.x) && Math.floor(a.y) == Math.floor(b.y)) ||
						// (Math.round(a.x) == Math.round(b.x) && Math.round(a.y) == Math.round(b.y)) ||
						// (Math.ceil(a.x) == Math.ceil(b.x) && Math.ceil(a.y) == Math.ceil(b.y));
			}
		},
		pointOnLine: function(p,l) {
			if (isSimilar(p.x, p.y, l.a, l.b) || isSimilar(p.x, p.y, l.c, l.d)) {
				return true;
			}
			return false;
		},
		inbox: function(x,y,bx,by,bw,bh) {
			if (typeof bh == 'undefined') bh = bw;
			if (x > bx - bw)
				if (x < bx + bw)
					if (y > by - bh)
						if (y < by + bh)
							return true;
			return false;
		},
		mandist: function(a,b,x,y) {
			if (typeof x !== 'undefined') {
				return a - x + b - y;
			} else {
				return a.x - b.x + a.y - b.y;
			}
		},
		sqdist: function(a,b,x,y) {
			if (typeof x !== 'undefined') {
				return Math.pow(a - x, 2) + Math.pow(b - y, 2);
			} else {
				return Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2);
			}
		},
		normalize: function(v) {
			var l = Math.sqrt(v.x * v.x + v.y * v.y);
			v.x /= l;
			v.y /= l;
		},
		lineVsLine: function(x1,y1,x2,y2,x3,y3,x4,y4,pt,ray) {
			var ua, ub, ud, sa, sb;
			// Identical denominator for each equation, calculate once and store.
			ud = (y4-y3)*(x2-x1)-(x4-x3)*(y2-y1);
			if (Math.abs(ud) === 0) {
				return false;
			}
			// Point on 1->2 where 3->4 projects.
			ua = (x4-x3)*(y1-y3)-(y4-y3)*(x1-x3);
			sa = ua / ud;
			// Not colliding if point is outside of line.
			// For ray checks, ignore the upper bound check.
			if ((sa < 0 || (sa > 1 && !ray))) {
				return false;
			}
			// Point on 3->4 where 1->2 projects.
			ub = (x2-x1)*(y1-y3)-(y2-y1)*(x1-x3);
			sb = ub / ud;
			// Not colliding if point is outside of line.
			if ((sb < 0 || sb > 1)) {
				return false;
			}
			// If a return vector is specified, set it's position to the collision point.
			if (pt instanceof GLOW.Vector2) {
				pt.x = x1 + sa * (x2-x1);
				pt.y = y1 + sa * (y2-y1);
			}
			return sa;
		},
		circleVsLineBox: function(x,y,r,la,lb,lc,ld) {
			if (x > ((la < lc) ? la : lc) - r)
				if (x < ((la < lc) ? lc : la) + r)
					if (y > ((lb < ld) ? lb : ld) - r)
						if (y < ((lb < ld) ? ld : lb) + r)
							return true;
			return false;
		},
		circleVsLineSq: function(x,y,r,la,lb,lc,ld,pt) {
			var l2 = Geom.sqdist(la,lb,lc,ld);
			if (l2 === 0) return Geom.sqdist(x,y,la,lb);
			var t = ((x - la) * (lc - la) + (y - lb) * (ld - lb)) / l2;
			if (t < 0) {
				if (typeof pt !== 'undefined') {
					pt.x = la;
					pt.y = lb;
				}
				return Geom.sqdist(x,y,la,lb);
			}
			if (t > 1) {
				if (typeof pt !== 'undefined') {
					pt.x = lc;
					pt.y = ld;
				}
				return Geom.sqdist(x,y,lc,ld);
			}
			if (typeof pt !== 'undefined') {
				pt.x = la + t * (lc - la);
				pt.y = lb + t * (ld - lb);
				return Geom.sqdist(x, y, pt.x, pt.y);
			} else {
				return Geom.sqdist(x, y, la + t * (lc - la), lb + t * (ld - lb));
			}
		}
	};

	*/