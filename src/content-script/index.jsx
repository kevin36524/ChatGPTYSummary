import 'github-markdown-css'
import { render } from 'preact'
import { unmountComponentAtNode } from 'preact/compat'
//import { getUserConfig, keys } from '../config'
import ChatGPTCard from './ChatGPTCard'
// import { config } from './email-site-configs.mjs'
import './styles.scss'
// import { getPossibleElementByQuerySelector } from './utils.mjs'

const renderOrUpdateCard = (question, container) => {
  render(
    <ChatGPTCard
      question={question}
      triggerMode={'always'}
      closeCallback={() => {
        const siderbarContainer = document.querySelector('.sidebar-free')
        unmountComponentAtNode(siderbarContainer)
        siderbarContainer.parentElement.removeChild(siderbarContainer)
      }}
    />,
    container,
  )
}

async function mountChatGPT(question) {
  let container = document.createElement('div')
  container.className = 'chat-gpt-container'

  const chatGPTContainer = document.querySelector('.chat-gpt-container')
  if (chatGPTContainer) {
    renderOrUpdateCard(question, chatGPTContainer)
    return
  }

  container.classList.add('sidebar-free')
  const appendContainer = document.querySelector('aside')
  appendContainer.innerHTML = ''
  if (appendContainer) {
    appendContainer.prepend(container)
  }

  renderOrUpdateCard(question, container)
}

async function addMessageReadChatGPTContainer(evt) {
  console.log('KEVINDEBUG I am in addMessageReadChatGPTContainer ')

  // let question = await getUserConfig(keys.MESSAGE_PREPEND_QUERY)

  const contentWrapperNode = evt.target.closest('article.caas-container')
  const contentNode = contentWrapperNode.querySelector('.caas-content-wrapper')

  const question = `Provide me a summary for ${contentNode.innerText}`
  mountChatGPT(question)
}

function addButtonOnNewsTab() {
  console.log('KEVINDEBUG I am in addButtonOnNewsTab')
  const articleNodes = document.querySelectorAll('article.caas-container')
  for (let i = 0; i < articleNodes.length; i++) {
    const articleNode = articleNodes[i]
    const toolbarNode = articleNode.querySelector('.caas-share-buttons')
    if (toolbarNode.querySelector('.chatgpt-button') == null) {
      const button = document.createElement('button')
      button.className = 'chatgpt-button'
      button.innerText = 'ChatGPTSummary'
      button.onclick = addMessageReadChatGPTContainer
      toolbarNode.prepend(button)
    }
  }
}

function waitForNewsTab() {
  console.log('KEVINDEBUG I am in waitForNewsTab')
  const targetNode = document.body
  const observer = new MutationObserver(() => {
    console.log('KEVINDEBUG I am in MutationObserver')
    const nodeList = document.querySelectorAll('article.caas-container')
    if (nodeList.length > 0) {
      addButtonOnNewsTab()
    }
  })
  observer.observe(targetNode, { childList: true })
}

waitForNewsTab()
