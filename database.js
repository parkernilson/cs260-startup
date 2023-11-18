const { MongoClient, ServerApiVersion } = require('mongodb');
const path = require('path')
const bcrypt = require('bcrypt')
const { v4: uuid } = require('uuid')
const { getDefaultUserInfo } = require('./public/backend/utils')

const credentials = path.resolve(__dirname, 'keys/mongodb-key.pem')
const client = new MongoClient('mongodb+srv://cs260-startup.v7mhvyu.mongodb.net/?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority', {
    tlsCertificateKeyFile: credentials,
    serverApi: ServerApiVersion.v1
});
const db = client.db('storyteller')

const testConnection = async () => {
    await client.connect();
    await db.command({ ping: 1 });
}

const getDB = async () => {
    try {
        await testConnection()
    } catch(error) {
        throw new Error(`Unable to connect to database with message: ${error.message}`)
    }
    return db
}

const getUser = async (username) => await db.collection('users').findOne({ username })

const getUserByToken = async (token) => await db.collection('users').findOne({ token })

const createUser = async (username, password) => {
    const passwordHash = await bcrypt.hash(password, 10);

    const user = {
        username,
        password: passwordHash,
        token: uuid(),
        ...getDefaultUserInfo()
    }

    await db.collection('users').insertOne(user)

    return user
}

module.exports = {
    getDB,
    getUser,
    getUserByToken,
    createUser
}