

const _testRegex = () => {
	// Run manually to verify that the regex works on all these types of URLS.
	
	const idList = [
		'yTalKpnoyrM',
		'0zM3nApSvMg',
		'-wtIMTCHWuI',
		'_t5cbJYPziA',
		'M9bq_alk-sw'
	];

	for (const id of idList) {
		var test_urls = [
			`https://youtube.com/shorts/${id}?feature=share`,
			`https://www.youtube.com/embed/${id}?playlist=q9se5C9fX-Y&loop=1`,
			`http://youtube.com/watch?vi=${id}&feature=youtube_gdata_player`,
			`http://youtube.com/watch?v=${id}&feature=youtube_gdata_player`,
			`http://youtube.com/vi/${id}?feature=youtube_gdata_player`,
			`http://youtube.com/v/${id}?feature=youtube_gdata_player`,
			`http://youtube.com/?vi=${id}&feature=youtube_gdata_player`,
			`http://youtube.com/?v=${id}&feature=youtube_gdata_player`,
			`http://youtu.be/${id}?feature=youtube_gdata_player`,
			`http://youtu.be/${id}`,
			`http://www.youtube.com/ytscreeningroom?v=${id}`,
			`http://www.youtube.com/watch?v=${id}&playnext_from=TL&videos=osPknwzXEas&feature=sub`,
			`http://www.youtube.com/watch?v=${id}&feature=youtube_gdata_player`,
			`http://www.youtube.com/watch?v=${id}&feature=channel`,
			`http://www.youtube.com/watch?v=${id}`,
			`http://www.youtube.com/watch?v=${id}&feature=youtu.be`,
			`http://www.youtube.com/user/SilkRoadTheatre#p/a/u/2/${id}`,
			`http://www.youtube.com/user/Scobleizer#p/u/1/${id}?rel=0`,
			`http://www.youtube.com/user/Scobleizer#p/u/1/${id}`,
			`http://www.youtube.com/embed/${id}?rel=0`,
			`//www.youtube-nocookie.com/embed/${id}?rel=0`,
		];

		var regex = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
		
		for (var i = 0; i < test_urls.length; ++i) {
			var results = test_urls[i].match(regex);
			console.log(results[1]);
			if (results[1] != id) {
				throw new Error("Regex failed to retrieve correct ID!");
			}
		}
	}
}