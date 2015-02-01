precision mediump float;

uniform sampler2D mapa;
uniform sampler2D mapb;
uniform sampler2D mapc;
uniform sampler2D mapl;
uniform sampler2D tiles;
uniform sampler2D tilesh;
uniform sampler2D mods;
uniform sampler2D modsh;
uniform vec4 mult;

uniform int pass;

uniform bool debug;

// uniform float layer;
// uniform vec3 camera;
varying float zoom;

varying vec2 uv;

vec4 blend(vec4 a, vec4 b) {
	float factor = b.a + a.a * (1.0 - b.a);
	vec3 orgb = vec3(b.rgb * b.a + a.rgb * a.a * (1.0 - b.a)) / factor;
	return vec4(orgb, min(1.0, factor));
}

vec4 layer(vec4 a, vec4 b) {
	if (b.a > 0.5) {
		return b;
	} else {
		return a;
	}
}

vec4 texelAt(vec2 uv) {
	vec4 texel;

	vec4 ma = texture2D(mapa, uv) * 255.0;
	vec4 mb = texture2D(mapb, uv) * 255.0;
	vec4 mc = texture2D(mapc, uv);
	vec4 ml = texture2D(mapl, uv) * 255.0;

	float ca = ma.x;
	float ba = mb.x;
	float cb = ma.y;
	float bb = mb.y;
	float cc = ma.z;
	float bc = mb.z;
	float cd = ma.w;
	float bd = mb.w;

	// Sub-tile UV offset.
	vec2 tuv = uv;

	// if (int(ml.x) == 1) {
	// 	tuv.x = 1.0 - tuv.x;
	// }
	// if (int(ml.x) == 2) {
	// 	tuv.y = 1.0 - tuv.y;
	// }
	// if (int(ml.x) == 3) {
	// 	tuv.x = 1.0 - tuv.x;
	// 	tuv.y = 1.0 - tuv.y;
	// }

	vec2 suv = mod(tuv * 16.0, 1.0) / 32.0;

	vec4 tca;
	vec4 tcb;
	vec4 tcc;
	vec4 tcd;
	vec4 tia;
	vec4 tib;
	vec4 tic;
	vec4 tid;

	tca = texture2D(tiles, suv + vec2(ca, ba) / 32.0);
	tcb = texture2D(tiles, suv + vec2(cb, bb) / 32.0);
	tcc = texture2D(tiles, suv + vec2(cc, bc) / 32.0);
	tcd = texture2D(tiles, suv + vec2(cd, bd) / 32.0);
	
	tia = texture2D(tilesh, suv + vec2(ca, ba) / 32.0);
	tib = texture2D(tilesh, suv + vec2(cb, bb) / 32.0);
	tic = texture2D(tilesh, suv + vec2(cc, bc) / 32.0);
	tid = texture2D(tilesh, suv + vec2(cd, bd) / 32.0);

	// gl_FragColor = bgc * mult;
	// if (bgc.a < 0.1) gl_FragColor *= 0.0;
	texel = tca;
	if (tcb.a > 0.05) {
		texel = blend(texel, tcb);
	}
	if (tcc.a > 0.05) {
		texel = blend(texel, tcc);
	}
	if (tcd.a > 0.05) {
		texel = blend(texel, tcd);
	}

	if (debug == true) {
		vec4 ggrid = vec4(0.3, 0.9, 0.4, 0.25 * smoothstep(30.0 / 32.0, 1.0, max(fract(suv.x * 32.0), fract(suv.y * 32.0))));
		vec4 tgrid = vec4(0.0, 0.0, 0.0, 0.4 * smoothstep(30.0 / 32.0, 1.0, max(fract(0.5 + suv.x * 32.0), fract(0.5 + suv.y * 32.0))));
		// texel = blend(texel, vec4(1.0, 0.0, 0.0, ma.r > 0.0 ? 0.2 : 0.0));
		// texel = blend(texel, vec4(0.0, 1.0, 0.0, ma.g > 0.0 ? 0.2 : 0.0));
		// texel = blend(texel, vec4(0.0, 0.0, 1.0, ma.b > 0.0 ? 0.2 : 0.0));
		// texel = blend(texel, vec4(0.0, 1.0, 1.0, ma.a > 0.0 ? 0.2 : 0.0));
		return blend(blend(texel * mult * mc, ggrid), tgrid);
	}

	return texel * mult * mc;
}

// const float pxl = 1.0 / 1024.0;

void main() {

	gl_FragColor = texelAt(uv);

}
