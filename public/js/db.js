function getDb() {
    const dbraw = localStorage.getItem('db')
    if (dbraw === null) localStorage.setItem('db', JSON.stringify({}))
    const db = JSON.parse(localStorage.getItem('db'))
    return db
}

function getCurrentUser() {
    const username = localStorage.getItem('currentUser')
    if (username === null) throw new Error("User was not logged in")
    else return username
}

function getDefaultUserInfo() {
    return {
        boards: [
            {
                id: uuid(),
                title: "Nature Sounds",
                icon: "fa-dove",
                sounds: [
                    {
                        id: uuid(),
                        name: "Ambient Piano",
                        filename: "ambient-piano.mp3",
                        url: "sounds/ambient-piano.mp3",
                        color: "bg-red-300"
                    },
                    {
                        id: uuid(),
                        name: "Fire Winds",
                        filename: "fire-winds-swoosh.mp3",
                        url: "sounds/fire-winds-swoosh.mp3",
                        color: "bg-blue-300"
                    },
                    {
                        id: uuid(),
                        name: "Tropical Sounds",
                        filename: "nature-sounds-tropical.mp3",
                        url: "sounds/nature-sounds-tropical.mp3",
                        color: "bg-yellow-300"
                    },
                    {
                        id: uuid(),
                        name: "Beach",
                        filename: "sandy-beach-calm.mp3",
                        url: "sounds/sandy-beach-calm.mp3",
                        color: "bg-teal-300"
                    }
                ],
            },
            {
                id: uuid(),
                title: "Battle Noises",
                icon: "fa-shield",
                sounds: [
                    {
                        id: uuid(),
                        name: "Ambient Piano",
                        filename: "ambient-piano.mp3",
                        url: "sounds/ambient-piano.mp3",
                        color: "bg-red-300"
                    },
                    {
                        id: uuid(),
                        name: "Fire Winds",
                        filename: "fire-winds-swoosh.mp3",
                        url: "sounds/fire-winds-swoosh.mp3",
                        color: "bg-blue-300"
                    },
                    {
                        id: uuid(),
                        name: "Tropical Sounds",
                        filename: "nature-sounds-tropical.mp3",
                        url: "sounds/nature-sounds-tropical.mp3",
                        color: "bg-yellow-300"
                    },
                    {
                        id: uuid(),
                        name: "Beach",
                        filename: "sandy-beach-calm.mp3",
                        url: "sounds/sandy-beach-calm.mp3",
                        color: "bg-teal-300"
                    }
                ],
            },
            {
                id: uuid(),
                title: "Magic",
                icon: "fa-wand-sparkles",
                sounds: [
                    {
                        id: uuid(),
                        name: "Ambient Piano",
                        filename: "ambient-piano.mp3",
                        url: "sounds/ambient-piano.mp3",
                        color: "bg-red-300"
                    },
                    {
                        id: uuid(),
                        name: "Fire Winds",
                        filename: "fire-winds-swoosh.mp3",
                        url: "sounds/fire-winds-swoosh.mp3",
                        color: "bg-blue-300"
                    },
                    {
                        id: uuid(),
                        name: "Tropical Sounds",
                        filename: "nature-sounds-tropical.mp3",
                        url: "sounds/nature-sounds-tropical.mp3",
                        color: "bg-yellow-300"
                    },
                    {
                        id: uuid(),
                        name: "Beach",
                        filename: "sandy-beach-calm.mp3",
                        url: "sounds/sandy-beach-calm.mp3",
                        color: "bg-teal-300"
                    }
                ],
            }
        ]
    }
}

/**
 * Get all of the sound boards that the user owns
 * @returns {Promise<Board[]>} 
 */
function getSoundBoards(username) {
    const db = getDb()
    if (typeof db[username]?.boards === 'object') return Promise.resolve(db[username].boards)
    else {
        db[username] = getDefaultUserInfo() 
        localStorage.setItem('db', JSON.stringify(db))
        return Promise.resolve(db[username].boards)
    }
}

async function setSoundBoards(username, boards) {
    const db = getDb()
    if (!db[username]) throw new Error("The user does not exist")
    db[username].boards = boards
    localStorage.setItem('db', JSON.stringify(db))
    return Promise.resolve(db[username.boards])
}

function setSoundsOnBoard(username, boardId, sounds) {
    const db = getDb()
    db[username].boards.filter(b => b.id === boardId)[0].sounds = sounds
    localStorage.setItem('db', JSON.stringify(db))
    return Promise.resolve(sounds)
}

async function addSoundToBoard(username, boardId, sound) {
    const db = getDb()
    const sounds = db[username]?.boards?.filter(b => b.id === boardId)[0]?.sounds
    const newSounds = [
        ...sounds,
        sound
    ]
    await setSoundsOnBoard(username, boardId, newSounds)
}

async function getSoundboard(username, boardId) {
    const db = getDb()
    if(!db[username]) throw new Error("The user does not exist")
    const board = db[username]?.boards.filter(b => b.id === boardId)[0]
    if (!board) throw new Error("That board could not be found")
    return Promise.resolve(board)
}

async function removeSoundFromBoard(boardId, soundId) {
    const db = getDb()
    const username = getCurrentUser()
    if (!db[username]) throw new Error("The user does not exist")
    const board = db[username]?.boards.filter(b => b.id === boardId)[0]
    if (!board) throw new Error("That board could not be found")
    const newSounds = board.sounds.filter(s => s.id !== soundId)
    await setSoundsOnBoard(username, boardId, newSounds)
}