// importScripts('../lib/glowcore.js', '../lib/glowexts.js');
importScripts('../random.js', '../noise.js');

this.addEventListener('message', function(e) {

	var o = e.data;

	var randoma = new SeedableRandom(o.seed);
	var randomb = new SeedableRandom(o.seed + 250);
	var randomc = new SeedableRandom(o.seed + 500);
	var simplexa = new noise.SimplexNoise(randoma);
	var simplexb = new noise.SimplexNoise(randomb);
	var simplexc = new noise.SimplexNoise(randomc);

	var blocks = new Uint8Array(e.data.blocks);

	var dataa = new Uint8Array(e.data.dataa);
	var datab = new Uint8Array(e.data.datab);
	var datac = new Uint8Array(e.data.datac);
	var datal = new Uint8Array(e.data.datal);

	var entities = [];

	var x, y;
	var cx = o.x;
	var cy = o.y;
	var wt = {
		humidity: 0,
		foliage: 0,
		mountain: 0,
		ore: 0,
		water: 0
	};

	var ChunkSize = 16;
	var ChunkStride = ChunkSize + 1;

	for (y=0;y<ChunkStride;y++) {
		for (x=0;x<ChunkStride;x++) {

			var wx = cx * 16 + x;
			var wy = cy * 16 + y;

			// Generate all of our noise.
			var sx0a = (simplexa.noise((wx) / ChunkStride * 6.00, (wy) / ChunkStride * 6.00, 0) * 0.5 + 0.5); // Pixel Simplex
			var sx0b = (simplexb.noise((wx) / ChunkStride * 6.00, (wy) / ChunkStride * 6.00, 0) * 0.5 + 0.5); // Pixel Simplex

			var sx1a = (simplexa.noise((wx) / ChunkStride * 2.00, (wy) / ChunkStride * 2.00, 0) * 0.5 + 0.5); // Detail Simplex
			var sx1b = (simplexb.noise((wx) / ChunkStride * 2.00, (wy) / ChunkStride * 2.00, 0) * 0.5 + 0.5); // Detail Simplex
			var sx1c = (simplexc.noise((wx) / ChunkStride * 2.00, (wy) / ChunkStride * 2.00, 0) * 0.5 + 0.5); // Detail Simplex

			var sx2a = (simplexa.noise((wx) / ChunkStride * 1.00, (wy) / ChunkStride * 1.00, 0) * 0.5 + 0.5); // Fine Simplex A  //<\
			var sx2b = (simplexb.noise((wx) / ChunkStride * 1.00, (wy) / ChunkStride * 1.00, 0) * 0.5 + 0.5); // Fine Simplex B  // <- Most useful for ore placement.
			var sx2c = (simplexc.noise((wx) / ChunkStride * 1.00, (wy) / ChunkStride * 1.00, 0) * 0.5 + 0.5); // Fine Simplex C  //</

			var sx3a = (simplexa.noise((wx) / ChunkStride * 0.40, (wy) / ChunkStride * 0.40, 0) * 0.5 + 0.5); // Coarse Simplex
			var sx3b = (simplexb.noise((wx) / ChunkStride * 0.40, (wy) / ChunkStride * 0.40, 0) * 0.5 + 0.5); // Coarse Simplex
			var sx3c = (simplexc.noise((wx) / ChunkStride * 0.40, (wy) / ChunkStride * 0.40, 0) * 0.5 + 0.5); // Coarse Simplex

			var sx4a = (simplexa.noise((wx) / ChunkStride * 0.05, (wy) / ChunkStride * 0.05, 0) * 0.5 + 0.5); // Broad Simplex
			var sx4b = (simplexb.noise((wx) / ChunkStride * 0.05, (wy) / ChunkStride * 0.05, 0) * 0.5 + 0.5); // Broad Simplex
			var sx4c = (simplexc.noise((wx) / ChunkStride * 0.05, (wy) / ChunkStride * 0.02, 0) * 0.5 + 0.5); // Broad Simplex

			var bt = 0;
			var st = 0;
			var ft = 0;

			wt.mountain = sx4a * (0.92 + sx3a * 0.05 + sx2a * 0.03) + Math.pow(sx1a * 0.5, 4.0);
			wt.humidity = sx4c * sx4c;
			wt.foliage = wt.mountain <= 0.6 ? wt.humidity * (0.7 + 0.3 * sx3a * sx2b) * 1.4 : 0;
			if (wt.foliage > 0.06 && ((0.3 + 0.7 * wt.foliage) * sx0a) > 0.47 && wt.humidity * (0.85 + 0.15 * sx3a * sx2b) * 1.4 < 0.925) {
				if (wt.foliage > 0.2 || wx)
				wt.foliage = 5; // Tree
			} else if (wt.foliage > 0.04 && ((0.3 + 0.7 * wt.foliage) * sx0a) > 0.4 && wt.humidity * (0.85 + 0.15 * sx3a * sx2b) * 1.4 < 0.925) {
				wt.foliage = 4; // Bush
			} else {
				wt.foliage = wt.foliage > 0.04 ? wt.foliage > 0.05 ? wt.foliage > 0.72 ? 3 : 2 : 1 : 0;
			}
			wt.ore = 0;


			if (wt.mountain > 0.6) {
				bt = 8; // Rock

				if (wt.mountain > 0.66) {
					var pn = (1 - Math.pow(sx1a, 5));
					if (pn * sx4a * sx2a * sx3a > 0.2) bt = 8 + 1;
					if (pn * sx3c * sx3b > 0.33) bt = 8 + 2;
					if (pn * sx4b * sx2b * sx3a > 0.37) bt = 8 + 3;
					if (pn * sx4c * sx3b * sx3c > 0.41) bt = 8 + 4;
					if (pn * sx4c * sx3a * sx3c > 0.58) bt = 8 + 5;

					// if (wt.ore >= 1) {
					// 	bt += wt.ore; // Ore types
				}
			} else if (wt.mountain < 0.66 && wt.humidity * (0.85 + 0.15 * sx3a * sx2b) * 1.4 > 0.95) {
				bt = 1; // Water
			} else if (wt.foliage >= 1) {
				bt = 4;
				if (wt.foliage == 2) {
					bt = 5;
				} 
				if (wt.foliage == 3) {
					bt = 6;
				}
				if (wt.foliage == 4) {
					bt = 5;
					// Place bush.
					if (x !== 0 && y !== 0)
					entities.push({
						x: wx + sx0a * 0.75,
						y: wy + sx0b * 0.75,
						z: 0.3,
						rot: Math.floor((sx1c * sx1b) * 6) * Math.PI / 2,
						type: 'bush'
					});
				}
				if (wt.foliage == 5) {
					bt = 5;
					// Place tree.
					if (x !== 0 && y !== 0)
					entities.push({
						x: wx + sx0a * 0.75,
						y: wy + sx0b * 0.75,
						z: 5,
						rot: Math.floor((sx1c * sx1b) * 6) * Math.PI / 2,
						type: 'tree'
					});
				}
			}

			blocks[(x + y * ChunkStride) * 4 + 0] = bt; // Block type.
			blocks[(x + y * ChunkStride) * 4 + 1] = bt == 8 ? st : (bt >= 4 && bt <= 7) ? ft : 0; // Stone: Stone type / Foliage: Evergreen value / Water: Water turbulence
			blocks[(x + y * ChunkStride) * 4 + 2] = 0; // Insets. (Pipes/circuits/axels/etc).
			blocks[(x + y * ChunkStride) * 4 + 3] = wt.mountain <= 0.6 ? 128 : 96 - (wt.mountain - 0.6) / 0.4 * 96 + 32; // Evergreen value.
		}
	}





	var x, y, sx0a, sx0b, sx4c;
	var bid = 0, sid = 0, tbid = 0, lid = 0;
	var ba, bb, bc, bd, bl, bi, tbi;
	var ta, tb, tc, td;
	var oa, ob, oc, od;
	for (y=0;y<ChunkSize;y++) {
		for (x=0;x<ChunkSize;x++) {
			sx0a = (simplexa.noise((cx * 16 + x) / ChunkStride * 6.00, (cy * 16 + y) / ChunkStride * 6.00, 0) * 0.5 + 0.5); // Pixel Simplex
			sx0b = (simplexb.noise((cx * 16 + x) / ChunkStride * 6.00, (cy * 16 + y) / ChunkStride * 6.00, 0) * 0.5 + 0.5); // Pixel Simplex
			sx4c = (simplexc.noise((cx * 16 + x) / ChunkStride * 0.05, (cy * 16 + y) / ChunkStride * 0.02, 0) * 0.5 + 0.5); // Broad Simplex
			bid = (x + y * ChunkSize) * 4;
			sid = (x + y * ChunkStride) * 4;

			// Block IDs
			ba = blocks[sid+0];
			bb = blocks[sid+4];
			bc = blocks[sid+ChunkStride*4+0];
			bd = blocks[sid+ChunkStride*4+4];

			// Subtypes
			ta = blocks[sid+1];
			tb = blocks[sid+5];
			tc = blocks[sid+ChunkStride*4+1];
			td = blocks[sid+ChunkStride*4+5];

			// Oretypes
			oa = blocks[sid+2];
			ob = blocks[sid+6];
			oc = blocks[sid+ChunkStride*4+2];
			od = blocks[sid+ChunkStride*4+6];

			bl = 4; // Blocks left.
			bi = 0; // Block ID iterator.
			tbid = 0; // March type ID.
			lid = 0; // Layer ID

			while (bl > 0 && bi < 32) {
				tbid = 0;
				tbi = bi;

				// Find the marching squares value for this block/layer.
				if (tbi == ba) { tbid += 1; bl--; }
				if (tbi == bb) { tbid += 2; bl--; }
				if (tbi == bc) { tbid += 4; bl--; }
				if (tbi == bd) { tbid += 8; bl--; }

				if (tbid > 0) {
					// this.datal[bid+lid] = 0;
					if (lid == 0) {
						dataa[bid+lid] = 15;
						datab[bid+lid] = tbi;
						if (bi == 0) {
							dataa[bid+lid] = tbid;
						}
					} else {
						dataa[bid+lid] = tbid;
						datab[bid+lid] = tbi;
					}
					if (dataa[bid+lid] == 15) { // If this is a solid block then we'll sample a random texture where they are available.
						if (bi == 0 && sx0a > 0.88) { // Dirt
							dataa[bid+lid] += Math.floor(sx0b * 4.99) + 1;
						}
						// 1 Water
						// 2 Sand
						// 3 Tilled Soil
						if (bi == 4) { // Grassy Dirt
							dataa[bid+lid] += Math.floor(sx0b * 5.99);
						}
						if (bi == 5) { // Grass
							dataa[bid+lid] += Math.floor(sx0b * 3.99) + Math.floor(Math.pow(Math.sin(sx4c * sx4c * 3.1), 6.0) * 2.4);
						}
						// 6 Tall/Dense Grass
						// 7 Unused
						if (bi >= 8 && bi <= 15) { // Stone
							dataa[bid+lid] += Math.floor(sx0b * 4.4) + 1;
						}
					}
					lid++;
				}
				bi++;
			}

			datac[bid+0] = 255;
			datac[bid+1] = 255;
			datac[bid+2] = 255;
			datac[bid+3] = 255;
		}
	}

	self.postMessage({dataa: dataa.buffer,
					  datab: datab.buffer,
					  datac: datac.buffer,
					  datal: datal.buffer,
					  entities: entities},
					 [dataa.buffer,
					  datab.buffer,
					  datac.buffer,
					  datal.buffer]);

});