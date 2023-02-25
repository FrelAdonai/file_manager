import { setLocalSelector, getLocalSelector } from './helpers.js'
import { addNumFileHendler, addNumFileSelected, isNullNumFileSelected } from './elements/selected-file.js'
import { removeViewCardImage, viewCardImage, showInnerModal, removeInnerModal } from './cards/view-card.js'
import { removeFolders, tmpFolder } from './cards/main-card.js'
import { filterContainerHide, filterContainerShow, filterParamsHendler, filterSearch, objAfterFiltred } from './filter/select-params.js'
import { breadCrumbsHendler, createBredcrumbs, removeBredcrumbs } from './elements/breadcrumbs.js'
import { deleteFolders, deleteFoldersClear } from './delete/delete.js'

// fetch
async function sendRequest(method, url) {
    const headers = {
        'Content-Type': 'application/json',
    }

    return await fetch(url, {
        method: method,
        headers: headers,
    }).then((response) => {
        if (response.ok) {
            return response.json()
        }
    })
}

export const objFetch = (url) => {
    let requestURL = url

    sendRequest('GET', requestURL)
        .then((data) => {
            let dateAfterId = data.filter((x) => x.id === getLocalSelector('folder_id'))

            if (dateAfterId.length > 0) {
                let dirs = dateAfterId[0].dirs
                let files = dateAfterId[0].files

                filterParamsHendler({
                    items: files,
                })

                filterSearch({
                    input: '.modal-img-search_js',
                    items: files,
                })

                dirs.forEach((folder) => tmpFolder(folder))
                objAfterFiltred(files).forEach((folder) => tmpFolder(folder))
            }
        })
        .catch((err) => console.log(err))
}

export const mainFolderRequest = () => {
    removeFolders()
    removeViewCardImage()
    filterContainerShow()

    objFetch('./test_json/dirs_first.json')
}

// folder ui
/* ПРОТОТИП ВЫБОРА ЦВЕТОМ, НЕ ДОДЕЛАННО */
function _colorPaletteRemove() {
    let palletForRemove = document.querySelectorAll('.modal-img-card__palette')

    palletForRemove.forEach((element) => {
        element.remove()
    })
}

function _colorPaletteTmp(parent) {
    _colorPaletteRemove(parent)

    let colorsArr = ['#27ae60', '#eb4d4b', '#f1c40f', '#8e44ad', '#2c3e50']

    let createPalette = document.createElement('div')
    createPalette.classList.add('modal-img-card__palette')

    for (let index = 0; index < colorsArr.length; index++) {
        const color = colorsArr[index]

        let createPaletteBtn = document.createElement('button')
        createPaletteBtn.classList.add('modal-img-card__palette-btn')
        createPaletteBtn.style.background = color
        createPaletteBtn.setAttribute('data-color', color)

        createPalette.insertAdjacentElement('beforeend', createPaletteBtn)
    }

    parent.insertAdjacentElement('beforeend', createPalette)
}

function _removeActivePalette() {
    const cardPaletteBtnNode = document.querySelectorAll('.modal-img-card-palette_js')
    cardPaletteBtnNode.forEach((element) => {
        element.classList.remove('active')
    })
}

function _removeActivePaletteBtn(target) {
    let parent = target.closest('.modal-img-card__palette')
    let btnsNode = parent.querySelectorAll('.modal-img-card__palette-btn')

    btnsNode.forEach((element) => {
        element.classList.remove('active')
    })
}

function _colorFolderChange() {
    document.addEventListener('click', (e) => {
        let target = e.target.closest('.modal-img-card-palette_js')

        if (target) {
            if (!target.classList.contains('active')) {
                _removeActivePalette()
                target.classList.add('active')
            } else {
                _removeActivePalette()

                _colorPaletteRemove(target.parentElement)
            }

            if (target.classList.contains('active')) {
                _colorPaletteTmp(target.parentElement)
            } else {
                _colorPaletteRemove(target.parentElement)
            }
        }

        let targetColorBtn = e.target.closest('.modal-img-card__palette-btn')

        if (targetColorBtn) {
            let color = targetColorBtn.getAttribute('data-color')
            let perentCard = targetColorBtn.closest('.modal-img-card')
            let svgFolder = perentCard.querySelector('.svg-folder')

            if (!targetColorBtn.classList.contains('active')) {
                _removeActivePaletteBtn(targetColorBtn)
                targetColorBtn.classList.add('active')

                perentCard.setAttribute('data-color', color)
                svgFolder.style.fill = color
            } else {
                _removeActivePaletteBtn(targetColorBtn)

                perentCard.setAttribute('data-color', '#0097e6')
                svgFolder.style.fill = '#0097e6'
            }

            let cardId = perentCard.getAttribute('data-id')
            let cardColor = perentCard.getAttribute('data-color')
        }

        let targetPalette = e.target.closest('.modal-img-card__palette')

        if (!target && !targetColorBtn && !targetPalette) {
            _removeActivePalette()
            _colorPaletteRemove(parent)
        }
    })
}

// cards hendlers
function _cardFolderFileHendler() {
    let arrFileId = []

    document.addEventListener('click', (e) => {
        let targetCard = e.target.closest('.card-content_js')
        let targetWhithId = e.target.closest('[data-id]')
        let targetWhithId2 = e.target.closest('.modal-img-card__ui-wrap')

        if (targetWhithId && !targetWhithId2) {
            let id = targetWhithId.getAttribute('data-id')
            let cardType = targetWhithId.getAttribute('data-type')

            if (!cardType || cardType != 'file') {
                if (getLocalSelector('files_arr').length <= 0) {
                    arrFileId = []
                }

                setLocalSelector('folder_id', id)
                mainFolderRequest()
                createBredcrumbs(id)
                setLocalSelector('files_arr', '')
                isNullNumFileSelected()
                deleteFoldersClear()
            }
        }

        if (targetCard) {
            let cardType = targetCard.parentElement.getAttribute('data-type')

            if (cardType == 'file') {
                let localQuantity = getLocalSelector('quantity_file')
                let fileNode = document.querySelectorAll('.modal-img-card')

                if (localQuantity.includes('once')) {
                    fileNode.forEach((element) => element.classList.remove('active'))
                    targetCard.parentElement.classList.toggle('active')
                }

                if (localQuantity.includes('many')) {
                    targetCard.parentElement.classList.toggle('active')
                }

                let filterActiveFile = Array.from(fileNode).filter((x) => x.classList.contains('active'))

                arrFileId = []
                filterActiveFile.forEach((element) => arrFileId.push(element.getAttribute('data-id')))

                setLocalSelector('files_arr', arrFileId)
                addNumFileSelected(getLocalSelector('files_arr').length)
                removeViewCardImage()

                let currentCard = Array.from(fileNode).filter((x) => x.getAttribute('data-id') == getLocalSelector('files_arr').pop())[0]

                if (currentCard) {
                    let cardImgUrl = currentCard.querySelector('img')
                    let imgSrc

                    if (cardImgUrl) {
                        imgSrc = cardImgUrl.src
                    }

                    let iconCard = currentCard.querySelector('svg')
                    let cardItem = currentCard.querySelectorAll('li')
                    let urlPath = currentCard.getAttribute('data-original')

                    let arrTxt = []

                    cardItem.forEach((element) => arrTxt.push(element.textContent))

                    viewCardImage({
                        original: urlPath,
                        url: imgSrc,
                        icon: iconCard,
                        name: arrTxt[0],
                        size: arrTxt[1],
                    })
                }
            }
        }
    })
}

// copy link
function _copyImgPathClipboard(event) {
    let target = event.target.closest('.btn-copy-path_js')

    if (target) {
        let card = target.closest('.modal-img-view-card')

        navigator.clipboard
            .writeText(card.getAttribute('data-url'))
            .then(() => {
                target.textContent = 'Сохранено'
            })
            .catch((err) => {
                target.textContent = 'Ошибка копирования'
            })
    }
}

// main
const body = document.querySelector('body')
const modalImgJs = document.querySelector('.modal-imgs_js')

document.addEventListener('click', (e) => {
    let target = e.target.closest('.btn-modal-imgs_js')
    let targetClose = e.target.closest('.modal-img-btn-close_js')

    if (target) {
        let quantityFiles = target.getAttribute('data-choice')
        let typeFiles = target.getAttribute('data-type-file')

        modalImgJs.classList.add('active')
        body.style.overflow = 'hidden'

        if (quantityFiles.includes('once')) {
            setLocalSelector('quantity_file', quantityFiles)
            setLocalSelector('type_file', typeFiles)
        }

        if (quantityFiles.includes('many')) {
            setLocalSelector('quantity_file', quantityFiles)
            setLocalSelector('type_file', typeFiles)
        }

        setLocalSelector('files_arr', '')
        isNullNumFileSelected()
        deleteFoldersClear()
    }

    if (targetClose) {
        modalImgJs.classList.toggle('active')

        if (!modalImgJs.classList.contains('active')) {
            body.style.overflow = 'auto'
            removeBredcrumbs()
            removeViewCardImage()
            filterContainerHide()

            setLocalSelector('files_arr', '')
            isNullNumFileSelected()
            deleteFoldersClear()
        }
    }

    breadCrumbsHendler(e)
    // second fnc
    _copyImgPathClipboard(e)
    showInnerModal(e)
    removeInnerModal(e)
})

_cardFolderFileHendler()
_colorFolderChange()
addNumFileHendler()
deleteFolders()
