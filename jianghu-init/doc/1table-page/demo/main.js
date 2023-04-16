const nunjucks = require('nunjucks');
const _ = require('lodash');
const path = require('path');
const fs = require("fs");
const fse = require('fs-extra');

const configJson = require("./config.json");

(async(config) => {
	console.log('start >>>>')
	const {id: pageId, table, targetPageFile, basicConfig, featureList} = config;

	let templateString = fs.readFileSync('basic.html').toString();
	templateString = templateString.replace(/\/\/===\/\//g, '');

	nunjucks.configure(`./basic.html`, {
		tags: {
			blockStart: '<=%',
			blockEnd: '%=>',
			variableStart: '<=$',
			variableEnd: '$=>',
		},
	});
	const fields = ['id', 'name', 'desc'];
	const result = nunjucks.renderString(templateString, {
		table,
		pageId,
		fields,
	});

	fs.writeFileSync(`./${targetPageFile}`, result);
	console.log('<<<< end')
})(configJson)