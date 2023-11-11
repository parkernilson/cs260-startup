/**
 * Log in the given user
 * @param {string} username 
 * @returns {Promise<void>}
 */
async function login() {
    const username = document.getElementById('username-input').value

    const currentUser = localStorage.getItem('currentUser')
    if (currentUser !== username) localStorage.setItem('currentUser', username)

    try {
        await fetch(`/api/${username}/login`, {
            method: "POST"
        })

        window.location.href = 'soundboards.html'
    } catch(error) {
        console.error(error)
    }

}