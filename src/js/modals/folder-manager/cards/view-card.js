import { setLocalSelector, getLocalSelector } from '../helpers.js'

function _imageBtnSize() {
    let tmp = `
    <button class="modal-img-view-card__size-btn">
        <span><span>
    </button>
    `
    return tmp
}

export const viewCardImage = (arg) => {
    let filseArrLocal = getLocalSelector('files_arr')
    let name = arg.name
    let size = arg.size
    let imgPath = arg.original

    if (arg.original.length > 50) {
        imgPath = `${Array.from(imgPath).splice(0, 50).join('')}...`
    }

    let imgUrl = ''
    let sizeImg = ''

    if (arg.url && filseArrLocal.length <= 1) {
        imgUrl = `<img src="${arg.url}" alt="">`
        sizeImg = _imageBtnSize()
    }

    removeViewCardImage()

    let tmp = `<div class="modal-img-view-card" data-url="${arg.url}">
            <div class="modal-img-view-card__img">
                ${imgUrl}
            </div>
            <div class="modal-img-view-card__info">
                <ul>
                    <li>${name}</li>
                    <li>${size}</li>
                    <li class="path-img_js">${imgPath}</li>
                </ul>

                <button class="btn-accent-3 btn-copy-path_js">Копировать путь</button>
            </div>
            ${sizeImg}
        </div>`

    let output = document.querySelector('.cards-view_js')
    output.insertAdjacentHTML('beforeend', tmp)

    // icons and type file
    if (!arg.url) {
        let icon = arg.icon.cloneNode(true)
        let imageNode = document.querySelector('.modal-img-view-card__img')
        imageNode.classList.add('modal-img-view-card__img-small')

        imageNode.insertAdjacentElement('beforeend', icon)

        if (imgPath.includes('mp4')) {
            let videoPlaer = document.createElement('video')
            Object.assign(videoPlaer, {
                src: imgPath,
                controls: true,
            })

            imageNode.insertAdjacentElement('afterend', videoPlaer)
        }

        if (imgPath.includes('mp3')) {
            let audioPlaer = document.createElement('audio')
            Object.assign(audioPlaer, {
                src: imgPath,
                controls: true,
            })

            imageNode.insertAdjacentElement('afterend', audioPlaer)
        }
    }

    if (arg.url && filseArrLocal.length <= 1) {
        let imageWrapNode = document.querySelector('.modal-img-view-card__img')
        let imageNode = imageWrapNode.querySelector('img')
        let imgesSize = document.createElement('div')

        imgesSize.className = 'modal-img-view-card__size'

        imageNode.onload = () => {
            let imgesWidth = imageNode.naturalWidth
            let imgesHeight = imageNode.naturalHeight

            imgesSize.textContent = `${imgesWidth}px на ${imgesHeight}px`

            imageWrapNode.insertAdjacentElement('beforeend', imgesSize)
        }
    }

    if (filseArrLocal.length > 1) {
        removeViewCardImage()
    }
}

export const removeViewCardImage = () => {
    const output = document.querySelector('.cards-view_js')

    Array.from(output.children).forEach((element) => {
        element.remove()
    })
}

export const copyImgPathClipboard = (event) => {
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

function _innerModalTmp(url) {
    let body = document.querySelector('body')

    let modal = document.createElement('div')
    modal.classList.add('inner-modal')

    let modalInner = document.createElement('div')
    modalInner.classList.add('inner-modal__inner')

    let modalImg = document.createElement('img')
    modalImg.classList.add('inner-modal__image')
    modalImg.src = url

    let modalBtnClose = document.createElement('button')
    modalBtnClose.classList.add('inner-modal__btn-close')

    modalInner.insertAdjacentElement('beforeend', modalBtnClose)
    modalInner.insertAdjacentElement('beforeend', modalImg)
    modal.insertAdjacentElement('beforeend', modalInner)
    body.insertAdjacentElement('beforeend', modal)
}

export const showInnerModal = (event) => {
    let target = event.target.closest('.modal-img-view-card__size-btn')

    if (target) {
        let imgUrl = target.closest('.modal-img-view-card').getAttribute('data-url')

        _innerModalTmp(imgUrl)
    }
}

export const removeInnerModal = (event) => {
    let innerModal = document.querySelector('.inner-modal')
    let target = event.target.closest('.inner-modal__btn-close')
    let targetClose = event.target.closest('.modal-img-view-card__size-btn')

    if (target) {
        innerModal.remove()
    }

    if (innerModal) {
        if (!target && !targetClose) {
            innerModal.remove()
        }
    }
}
