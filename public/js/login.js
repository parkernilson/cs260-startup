/**
 * Log in the given user
 * @param {string} username 
 * @returns {Promise<void>}
 */
async function login() {
    const username = document.getElementById('username-input').value
    const password = document.getElementById('password-input').value

    const response = await fetch('/api/auth/login', {
        method: "post",
        body: JSON.stringify({ username, password }),
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        }
    })

    if (response.ok) {
        localStorage.setItem('currentUser', username)
        window.location.href = 'soundboards.html'
    }
}

async function createUser() {
    const username = document.getElementById('username-input').value
    const password = document.getElementById('password-input').value

    const response = await fetch('/api/auth/create', {
        method: "post",
        body: JSON.stringify({ username, password }),
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        }
    })

    if (response.ok) {
        localStorage.setItem('currentUser', username)
        window.location.href = 'soundboards.html'
    }
}

const displayUserInfo = () => {
    const currentUser = localStorage.getItem('currentUser')
    if (currentUser) {
        const userDisplayInfoElem = document.getElementById('user-info-display')
        userDisplayInfoElem.classList.remove("hidden")

        const usernameInfoSlot = document.getElementById('username-info-slot')
        usernameInfoSlot.innerText = `You are logged in as: ${currentUser}`
    } else {
        hideUserInfo()
    }
}

const hideUserInfo = () => {
    const userDisplayInfoElem = document.getElementById('user-info-display')
    userDisplayInfoElem.classList.add("hidden")

    const usernameInfoSlot = document.getElementById('username-info-slot')
    usernameInfoSlot.innerText = ''
}

const logout = async () => {
    localStorage.removeItem('currentUser')
    hideUserInfo()
    await fetch(`/api/auth/logout`, {
        method: "delete"
    }).then(() => (window.location.href = '/'))
}

const getUser = async (username) => {
    const response = await fetch(`/api/user/${username}`)
    if (response.status === 200) {
        return response.json()
    }

    return null
}