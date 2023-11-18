async function loadDashboardPage() {
  const username = getCurrentUser();
  try {
    const boards = await getSoundBoards(username);
    renderBoards(boards)
  } catch(error) {
    console.error(error)
  }
}

function renderBoard(board) {
    const boardElem = document.createElement("div")
    boardElem.classList
        .add("border", "border-black", "shadow-md", "rounded-sm",
        "flex", "cursor-pointer");

    const leftSection = document.createElement("div")
    leftSection.classList.add("flex-1", "flex", "items-center", "h-full", "p-5")
    leftSection.onclick = () => window.location.href = `soundboard.html?board=${board.id}`
    boardElem.appendChild(leftSection)

    const icon = document.createElement("i")
    icon.classList.add(board.icon, "fa-solid", "fa-2xl", "mr-3")
    leftSection.appendChild(icon)

    const titleContainer = document.createElement("div")
    titleContainer.classList.add("flex", "flex-col", "items-start")
    leftSection.appendChild(titleContainer)

    const title = document.createElement("h2")
    title.classList.add("font-display", "text-xl")
    title.innerText = board.title
    titleContainer.appendChild(title)

    const soundCount = document.createElement("p")
    soundCount.innerText = `${board?.sounds.length} sounds`
    titleContainer.appendChild(soundCount)

    const rightSection = document.createElement("div")
    rightSection.classList.add("flex", "items-end", "pr-3", "pb-3")
    boardElem.appendChild(rightSection)

    const deleteButton = document.createElement("button")
    deleteButton.classList.add("hover:text-blue-400")
    deleteButton.innerText = "Delete"
    deleteButton.onclick = () => removeBoard(board.id)
    rightSection.appendChild(deleteButton)

    return boardElem
}

function renderBoards(boards) {
  const boardContainer = document.getElementById("board-container");
  boardContainer.innerHTML = '' // clear the content before re-rendering
  for (let board of boards) {
    const boardElem = renderBoard(board)
    boardContainer.appendChild(boardElem);
  }
}

async function createBoardFromModal() {
    // Title
    const newTitle = document.getElementById('new-board-title').value
    // Icon
    const iconRadioElements = Array.from(document.querySelectorAll('#create-soundboard-modal input[type="radio"]'))
    const selectedIcon = iconRadioElements.filter(elem => elem.checked)[0]

    if (!newTitle) throw new Error('A title is required to create a new sound board')
    if (!selectedIcon) throw new Error('An icon must be selected to create a new soundboard')

    const username = getCurrentUser()
    const newBoard = await addSoundBoard(username, {
      title: newTitle,
      icon: selectedIcon.value,
      sounds: []
    })
    
    const boards = await getSoundBoards(username)

    renderBoards(boards)
}

async function removeBoard(boardId) {
  const username = getCurrentUser()
  await deleteSoundBoard(username, boardId)
  await loadDashboardPage()
}