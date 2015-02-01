var Scene = {};

var GX = Scene.GX = new GLOW.Context({
	clear: { red: 0, green: 0, blue: 0, alpha: 0 },
	antialias: true
});

GX.setupCulling({frontFace: GL.CCW});

// GX.enableExtension('OES_standard_derivatives');
// GX.enableExtension('OES_texture_float');
// GX.enableExtension('OES_texture_float_linear');

Scene.particles = [];

Scene.textureList = {};
Scene.textureResList = {};
Scene.getTexture = function(img, filter) {
	if (Scene.textureList[img] === undefined) {
		Game.loadList.add(img, 'texture');
		Scene.textureList[img] = new GLOW.Texture({url: img, filter: filter, onLoadComplete: function(){
			Game.loadList.done(img);
			// console.log(Scene.textureList[img].data.width);
			Scene.textureResList[img].set(Scene.textureList[img].data.width, Scene.textureList[img].data.height);
			Scene.GX.cache.clear();
		}});
		Scene.textureResList[img] = new GLOW.Vector2(0, 0);
	}
	if (Scene.textureList[img].texture === undefined && typeof Scene.textureList[img].data === 'string') {
		setTimeout(function(){Scene.textureList[img].init();}, 16);
		// setTimeout(function(){Scene.textureList[img].init();}, 1000);
	}
	return Scene.textureList[img];
};

Scene.getTextureRes = function(img) {
	if (Scene.textureResList[img] === undefined) {
		Scene.getTexture(img);
	};
	return Scene.textureResList[img];
};