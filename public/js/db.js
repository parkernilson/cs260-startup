function getCurrentUser() {
    const username = localStorage.getItem('currentUser')
    if (username === null) throw new Error("User was not logged in")
    else return username
}

/**
 * Get all of the sound boards that the user owns
 * @returns {Promise<Board[]>} 
 */
async function getSoundBoards(username) {
    return fetch(`/api/${username}/boards`, { method: "GET" })
        .then(response => response.json())
        .then(data => data.boards)
}

/**
 * @returns {Promise<Board[]>}
 */
async function setSoundBoards(username, boards) {
    return fetch(`/api/${username}/boards/set`, {
        method: "POST",
        body: { boards }
    })
    .then(response => response.json())
    .then(data => data.boards)
}

/**
 * @returns {Promise<void>}
 */
async function deleteSoundBoard(username, boardId) {
    return fetch(`/api/${username}/boards/${boardId}`, {
        method: "DELETE",
    })
}

/**
 * @returns {Promise<Sound[]>}
 */
async function setSoundsOnBoard(username, boardId, sounds) {
    return fetch(`/api/${username}/boards/${boardId}/sounds/set`, {
        method: "POST",
        body: { sounds }
    })
    .then(response => response.json())
    .then(data => data.sounds)
}

/**
 * @returns {Promise<Sound>}
 */
async function addSoundToBoard(username, boardId, sound) {
    return fetch(`/api/${username}/boards/${boardId}/sounds/add`, {
        method: "PUT",
        body: { sound }
    })
    .then(response => response.json())
    .then(data => data.sound)
}

/**
 * @returns {Promise<Board>}
 */
async function getSoundboard(username, boardId) {
    return fetch(`/api/${username}/boards/${boardId}`, {
        method: "GET"
    })
    .then(response => response.json())
    .then(data => data.board)
}

/**
 * @returns {Promise<void>}
 */
async function removeSoundFromBoard(boardId, soundId) {
    return fetch(`/api/${username}/boards/${boardId}`, {
        method: "DELETE"
    })
    .then(response => response.json())
}