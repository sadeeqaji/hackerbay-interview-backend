const { generateAuthToken, downloadImage, resize } = require('./utils');
const jsonpatch = require('fast-json-patch');
const path = require('path');
const mime = require('mime');
const mkdirp = require('mkdirp');

/**
 * Creates a token for a valid user
 * @param {Object} req - Client Request
 * @param {Object} res - Server Response
 * @param {Middleware} next
 */
function login(req, res, next) {
	try {
		const token = generateAuthToken(req.body);
		return res.status(200).send({
			message: 'User login successful',
			data: {
				token
			}
		});
	} catch (error) {
		next(error);
	}
}

function patchJSON(req, res, next) {
	try {
		const { json, patch } = req.body;
		const patched = jsonpatch.applyPatch(JSON.parse(json), JSON.parse(patch))
			.newDocument;
		return res.status(200).send({
			message: 'Json was patched',
			data: {
				patched
			}
		});
	} catch (error) {
		next(error);
	}
}

async function createThumbnail(req, res, next) {
	try {
		const dest = path.resolve('public', 'images');
		await mkdirp(dest);
		const options = {
			url: req.body.imageUrl,
			dest
		};
		const { filename } = await downloadImage(options);
		const fileExtension = path.extname(filename).slice(1);
		const type = mime.getType(fileExtension);

		const resizedImageStream = resize(filename);
		res.status(200).type(type);
		resizedImageStream.pipe(res);
	} catch (error) {
		next(error);
	}
}

module.exports = {
	login,
	patchJSON,
	createThumbnail
};
