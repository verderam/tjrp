exports.install = function() {
	ROUTE('GET /');
	ROUTE('GET /posts', posts);
	ROUTE('GET /categories', categories);
//	ROUTE('GET /posts/{id}/', post);	
//	ROUTE('GET /pages', pages);
//	ROUTE('GET /pages/{id}/', page);
	ROUTE('+POST /up/', up, ['upload'], 1024);

	ROUTE('FILE /*.txt', staticTxt);
	ROUTE('FILE /*.jpg', staticJpg);
};

const posts = function(req,res){
	console.log(CONF.api)
	const u=CONF.api+'/posts?_embed'
	const me = this; 
	let model = {};
	RESTBuilder.GET(u).callback(
		function(err,resp){
			for (i=0;i<resp.length;i++){
				resp[i].img=resp[i]["_embedded"]["wp:featuredmedia"][0]["media_details"]["sizes"]["thumbnail"]["source_url"]
			}
			if (err) console.log('error: ',err);	
			model.data=resp;
			console.log('model: ',model);
			me.view('posts', model);
		}
		);
	//self.success();
}
const categories = function(){
	console.log(CONF.api)
	const u=CONF.api+'/categories'
	//const u='https://www.pianetagenoa1893.net/wp-json/wp/v2/categories'
	const me = this
	let model = {}
	RESTBuilder.GET(u).callback(
		function(err,resp){
			model.data=resp;
			me.view('categories', model);
		}
		);
	//self.success();
}


const up = function(){
	const me = this; 
	let model = {info:'...'};
	console.info(me.files);
	if (me.files.length > 0)
		model.info = me.files[0].filename + ' ({0} kB - {1}x{2})'.format(Math.floor(me.files[0].length / 1024, 2), me.files[0].width, me.files[0].height);
		me.view('up', model);
	//self.success();
}
const staticTxt = function(req, res) {
	res.content(200, 'Server time: ' + new Date().toString(), 'text/plain');
}

const staticJpg = function(req, res) {
	res.image(PATH.public(req.url), function (image) {
		// image === FrameworkImage
		image.resize('50%');
		image.quality(80);
		image.minify();
	});
}

