self.Physics = self.Physics || {};

Physics.NO_COLLISION = 0;
Physics.OVERLAP = 1;
Physics.INSIDE = 2;

Physics.PointVsBox = function(x, y, bx, by, bw, bh) {
	if (Math.abs(x - bx) < bw && Math.abs(y - by) < bh) {
		return Physics.OVERLAP;
	}
	return Physics.NO_COLLISION;
};

Physics.BoxVsBox = function(ax, ay, aw, ah, bx, by, bw, bh) {
	if (Physics.PointVsBox(ax, ay, bx, by, bw, bh)) return Physics.OVERLAP;
	if (Physics.PointVsBox(ax + aw, ay, bx, by, bw, bh)) return Physics.OVERLAP;
	if (Physics.PointVsBox(ax, ay + ah, bx, by, bw, bh)) return Physics.OVERLAP;
	if (Physics.PointVsBox(ax + aw, ay + ah, bx, by, bw, bh)) return Physics.OVERLAP;
	return Physics.NO_COLLISION;
};