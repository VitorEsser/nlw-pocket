const STORAGE_KEY = 'prompts_storage'

const state = {
  prompts: [],
  selectedId: null,
}

const elements = {
  promptTitle: document.getElementById('prompt-title'),
  promptContent: document.getElementById('prompt-content'),
  titleWrapper: document.getElementById('title-wrapper'),
  contentWrapper: document.getElementById('content-wrapper'),
  btnOpen: document.getElementById('btn-open'),
  btnCollapse: document.getElementById('btn-collapse'),
  sidebar: document.querySelector('.sidebar'),
  btnSave: document.getElementById('btn-save'),
  list: document.getElementById('prompt-list'),
  search: document.getElementById('search-input'),
}

function openSidebar() {
  elements.sidebar.style.display = 'flex'
  elements.btnOpen.style.display = 'none'
}

function closeSidebar() {
  elements.sidebar.style.display = 'none'
  elements.btnOpen.style.display = 'block'
}

function updateEditableWrapperState(element, wrapper) {
  const hasText = element.textContent.trim().length > 0
  wrapper.classList.toggle('is-empty', !hasText)
}

function updateAllEditableStates() {
  updateEditableWrapperState(elements.promptTitle, elements.titleWrapper)
  updateEditableWrapperState(elements.promptContent, elements.contentWrapper)
}

function attachAllEditableHandlers() {
  elements.promptTitle.addEventListener('input', () => {
    updateEditableWrapperState(elements.promptTitle, elements.titleWrapper)
  })
  elements.promptContent.addEventListener('input', () => {
    updateEditableWrapperState(elements.promptContent, elements.contentWrapper)
  })
}

function save() {
  const title = elements.promptTitle.textContent.trim()
  const content = elements.promptContent.innerHTML.trim()
  const hasContent = elements.promptContent.textContent.trim()

  if (!title || !hasContent) {
    alert('Title and Content cannot be empty.')
    return
  }

  if (state.selectedId) {
    // Update existing prompt
  } else {
    const newPrompt = {
      id: Date.now().toString(36),
      title,
      content,
    }

    state.prompts.unshift(newPrompt)
    state.selectedId = newPrompt.id
  }

  renderPromptList(elements.search.value)
  persist()
  alert('Prompt saved successfully!')
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.prompts))
  } catch (error) {
    console.error('Error saving prompts to localStorage:', error)
  }
}

function load() {
  try {
    const storage = localStorage.getItem(STORAGE_KEY)
    state.prompts = storage ? JSON.parse(storage) : []
    state.selectedId = null
  } catch (error) {
    console.error('Error loading prompts from localStorage:', error)
  }
}

function createPromptItem(prompt) {
  return `
    <li class="prompt-item" data-id="${prompt.id}" data-action="select">
      <div class="prompt-item-content">
        <span class="prompt-item-title">${prompt.title}</span>
        <span class="prompt-item-description">${prompt.content}</span>
      </div>

      <button class="btn-icon" title="Remove" data-action="remove">
        <img src="assets/remove.svg" alt="Remove" class="icon icon-trash" />
      </button>
    </li>
  `
}

function renderPromptList(filterText = '') {
  const filteredPrompts = state.prompts
    .filter((prompt) => prompt.title.toLowerCase().includes(filterText.toLowerCase().trim()))
    .map((prompt) => createPromptItem(prompt))
    .join('')

  elements.list.innerHTML = filteredPrompts
}

// Events
elements.btnSave.addEventListener('click', save)

elements.search.addEventListener('input', (event) => {
  renderPromptList(event.target.value)
})

elements.list.addEventListener('click', (event) => {
  const removeBtn = event.target.closest('[data-action="remove"]')
  const item = event.target.closest('[data-id]')

  if (!item) return
  const id = item.getAttribute('data-id')

  if (removeBtn) {
    state.prompts = state.prompts.filter((prompt) => prompt.id !== id)
    renderPromptList(elements.search.value)
    persist()
    return
  }

  if (event.target.closest('[data-action="select"]')) {
    const prompt = state.prompts.find((p) => p.id === id)

    if (prompt) {
      elements.promptTitle.textContent = prompt.title
      elements.promptContent.innerHTML = prompt.content
      updateAllEditableStates()
    }
  }
})

function init() {
  alert('1:21:00')
  load()
  renderPromptList()
  attachAllEditableHandlers()
  updateAllEditableStates()

  elements.sidebar.style.display = ''
  elements.btnOpen.style.display = 'none'

  elements.btnOpen.addEventListener('click', openSidebar)
  elements.btnCollapse.addEventListener('click', closeSidebar)
}

init()
