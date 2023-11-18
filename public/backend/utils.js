const { v4: uuid } = require('uuid')

function getDefaultUserInfo(username) {
    return {
        username,
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

module.exports = {
    getDefaultUserInfo
}