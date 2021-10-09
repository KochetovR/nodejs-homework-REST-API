// const mongoose = require('mongoose')
const mongoose = require('mongoose')
require('dotenv').config()
 

const uri = process.env.URI_DB

const db = mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

mongoose.connection.on('connected', () => {
    console.log('Database connection successful');
})

mongoose.connection.on('error', (err) => {
    console.log(`mongose connection error ${err.message}`);
})

// disconnected


process.on('SIGINT', async () => {
    await mongoose.connection.close()
    console.log('Connection to DB closed');
    process.exit(1)
})

module.exports = db

// class FileAdapter {
//     constructor(file) {
//         this.file = path.join(__dirname,file)
//     }

//     async read() {
//         const res = await fs.readFile(this.file, 'utf8')
//         const data = JSON.parse(res)
//         return data
//     }

//     async write(data) {
//         await fs.writeFile(this.file, JSON.stringify(data))
//     }
// }

// module.exports = FileAdapter