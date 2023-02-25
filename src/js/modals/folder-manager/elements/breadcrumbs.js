import { setLocalSelector, getLocalSelector } from '../helpers.js'
import { filterContainerHide } from '../filter/select-params.js'
import { mainFolderRequest } from '../modal-imgs'
import { isNullNumFileSelected } from './selected-file.js'
import { removeViewCardImage } from '../cards/view-card.js'
import { deleteFoldersClear } from '../delete/delete.js'

export const createBredcrumbs = (id) => {
    const container = document.querySelector('.list-breadcrumbs_js')
    let itemsNode = container.querySelectorAll('.brend-btn_js')

    itemsNode.forEach((element) => {
        element.classList.remove('active')
    })

    let item = document.createElement('li')
    let btn = document.createElement('button')
    btn.classList.add('brend-btn_js')
    btn.classList.add('active')
    btn.textContent = id
    btn.setAttribute('data-path', id)

    item.insertAdjacentElement('beforeend', btn)
    container.insertAdjacentElement('beforeend', item)
}

export const removeBredcrumbs = (target) => {
    const container = document.querySelector('.list-breadcrumbs_js')
    let bredItems = container.querySelectorAll('li')

    if (target) {
        let numIndex
        bredItems.forEach((element, index) => {
            if (element.firstElementChild.dataset.path == target.dataset.path) {
                numIndex = index
            }

            if (index > numIndex) {
                element.remove()
            }
        })
    } else {
        bredItems.forEach((element) => element.remove())
    }
}

export const breadCrumbsHendler = (event) => {
    let targetBredBtn = event.target.closest('.brend-btn_js')

    if (targetBredBtn) {
        if (!targetBredBtn.classList.contains('active')) {
            setLocalSelector('folder_id', targetBredBtn.dataset.path)
            mainFolderRequest()

            targetBredBtn.classList.add('active')
            removeBredcrumbs(targetBredBtn)
            removeViewCardImage()
            setLocalSelector('files_arr', '')
            isNullNumFileSelected()
            deleteFoldersClear()
        }
    }
}
