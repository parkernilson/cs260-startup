function loadSoundboardPage() {
  renderSoundboardPage();
}

async function renderSoundboardPage() {
  const username = getCurrentUser();
  const url = new URL(window.location.href);
  const boardId = url.searchParams.get("board");
  const board = await getSoundboard(username, boardId);

  // Header
  const soundboardHeader = document.getElementById("sound-board-header");
  soundboardHeader.innerHTML = "";
  const soundBoardIcon = document.createElement("i");
  soundBoardIcon.classList.add("fa-solid", "fa-xl", "mr-2", `${board.icon}`);
  soundboardHeader.appendChild(soundBoardIcon);
  const soundBoardTitle = document.createElement("h2");
  soundBoardTitle.classList.add(
    "font-display",
    "text-3xl",
    "font-light",
    "my-8",
    "self-center"
  );
  soundBoardTitle.innerText = board.title;
  soundboardHeader.appendChild(soundBoardTitle);

  // Sound Cards
  const soundCardGrid = document.getElementById("sound-card-grid");
  soundCardGrid.innerHTML = "";
  board.sounds
    .map((s) => renderSoundCard(board, s))
    .forEach((sCard) => soundCardGrid.appendChild(sCard));
}

function renderSoundCard(board, sound) {
  const soundCard = document.createElement("div");
  soundCard.classList.add(
    "border",
    "border-black",
    "shadow-md",
    "rounded-sm",
    "flex",
    "flex-col",
    "items-center",
    "cursor-pointer",
    "w-full",
    "h-full",
    "aspect-square",
    "p-3",
    `${sound.color}`,
    `bg-[${sound.color}]`
  );

  const header = document.createElement("h2");
  header.innerText = sound.name ?? sound.filename ?? sound.url ?? "Untitled";
  header.classList.add("text-xl", "text-center");
  soundCard.appendChild(header);

  const timeDisplay = document.createElement("p");
  timeDisplay.classList.add("text-sm", "text-gray-400");
  soundCard.appendChild(timeDisplay);

  const audioElem = document.createElement("audio");
  soundCard.appendChild(audioElem);
  const audioSource = document.createElement("source");
  audioElem.appendChild(audioSource);
  audioSource.src = sound.url;

  const playContainer = document.createElement("div");
  playContainer.classList.add(
    "flex-1",
    "flex",
    "flex-col",
    "justify-center",
    "items-center"
  );
  soundCard.appendChild(playContainer);

  const playIcon = document.createElement("i");
  playIcon.classList.add("fa-solid", "fa-play");
  playContainer.appendChild(playIcon);

  const pauseIcon = document.createElement("i");
  pauseIcon.classList.add("fa-solid", "fa-pause", "hidden");
  playContainer.appendChild(pauseIcon);

  audioElem.onended = () => toggleElems(playIcon, pauseIcon);

  // play / pause on click handlers
  playIcon.onclick = () => startPlayAudio(playIcon, pauseIcon, audioElem);
  pauseIcon.onclick = () => stopPlayAudio(playIcon, pauseIcon, audioElem);

  const tapToPlay = document.createElement("p");
  tapToPlay.innerText = "Tap to play sound";
  playContainer.appendChild(tapToPlay);

  const bottomRow = document.createElement("div");
  bottomRow.classList.add("flex", "w-full", "justify-center", "items-center");
  soundCard.appendChild(bottomRow);

  const removeButton = document.createElement("button");
  removeButton.innerText = "Remove";
  removeButton.onclick = async () => {
    await removeSoundFromBoard(board.id, sound.id);
    renderSoundboardPage();
  };
  bottomRow.appendChild(removeButton);

  //   const repeatIconButton = document.createElement("button");
  //   bottomRow.appendChild(repeatIconButton);
  //   const repeatIcon = document.createElement("i");
  //   repeatIcon.classList.add("fa-solid", "fa-repeat");
  //   repeatIconButton.appendChild(repeatIcon);

  return soundCard;
}

async function inboundSoundAddEvent(sound) {
  const url = new URL(window.location.href)
  const boardId = url.searchParams.get('board')
  const username = getCurrentUser()
  await addSoundToBoard(username, boardId, sound)
  renderSoundboardPage()
}

async function addSoundFromModal() {
  const addSoundModal = document.getElementById("add-sound-modal");
  const name = document.getElementById("new-board-title").value;
  /** @type {HTMLInputElement} */
  const fileInput = document.querySelector(
    '#add-sound-modal input[type="file"]'
  );
  const file = fileInput.files[0];
  /** @type {HTMLInputElement} */
  const colorInput = document.querySelector(
    '#add-sound-modal input[type="color"]'
  );
  const color = colorInput.value;

  const username = getCurrentUser();
  const url = new URL(window.location.href);
  const boardId = url.searchParams.get("board");

  // upload the file
  try {
    const soundFileKey = `${username}-${uuid()}`
    await uploadFile(file, soundFileKey)
    // const { url } = await fetch(`/api/${username}/upload-sound`, {
    //   method: "POST",
    //   body: {
    //     soundFile: file
    //   }
    // }).then(response => response.json())

    await addSoundToBoard(username, boardId, {
      id: uuid(),
      name,
      filename: file.name,
      color,
      url: `https://storyteller-sounds.s3.us-east-1.amazonaws.com/${soundFileKey}`
    })

    renderSoundboardPage();
  } catch(error) {
    console.error(error)
  }

}

/**
 *
 * @param {HTMLElement} elem1
 * @param {HTMLElement} elem2
 */
function toggleElems(elem1, elem2) {
  if (elem1.classList.contains("hidden")) {
    elem1.classList.remove("hidden");
    elem2.classList.add("hidden");
  } else {
    elem1.classList.add("hidden");
    elem2.classList.remove("hidden");
  }
}

/**
 *
 * @param {HTMLElement} playElem
 * @param {HTMLElement} pauseElem
 * @param {HTMLAudioElement} audioElem
 */
function startPlayAudio(playElem, pauseElem, audioElem) {
  toggleElems(playElem, pauseElem);
  audioElem.play();
}

/**
 *
 * @param {HTMLElement} playElem
 * @param {HTMLElement} pauseElem
 * @param {HTMLAudioElement} audioElem
 */
function stopPlayAudio(playElem, pauseElem, audioElem) {
  toggleElems(playElem, pauseElem);
  audioElem.pause();
}
