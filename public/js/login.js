/**
 * Log in the given user
 * @param {string} username 
 * @returns 
 */
function login() {
    const username = document.getElementById('username-input').value

    const currentUser = localStorage.getItem('currentUser')
    if (currentUser !== username) localStorage.setItem('currentUser', username)

    window.location.href = 'soundboards.html'
}