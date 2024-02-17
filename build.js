#!/usr/bin/env js

const fs = require('fs');
const pug = require('pug');
const stylus = require('stylus');

fs.writeFileSync('popup.html',
                 pug.renderFile('popup.pug', { cache: true, pretty: true }));
stylus.render(fs.readFileSync('popup.styl', { encoding: 'utf8', flag: 'r' }),
              { filename: 'popup.css' }, (err, css) => {
                fs.writeFileSync('popup.css', css);
                if (err) throw err; });

