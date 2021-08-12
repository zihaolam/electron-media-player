import VTTConverter from 'srt-webvtt';

const convertSrtToVtt = async (inputFile) => {
	const vttConverter = new VTTConverter(inputFile); // the constructor accepts a parameer of SRT subtitle blob/file object

	return await new Promise((resolve, reject) => {
		vttConverter
			.getURL()
			.then(function (url) { // Its a valid url that can be used further
				resolve(url);
			})
			.catch(function (err) {
				reject(err);
			})
	})
}

export default convertSrtToVtt;