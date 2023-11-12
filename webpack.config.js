const path = require('path')

module.exports = {
    entry: './public/js/file-upload.js',
    output: {
        path: path.resolve(__dirname, 'public/dist'),
        filename: 'file-upload-bundled.js'
    }
}