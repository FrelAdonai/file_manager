import * as iconsFolder from './icons-folder.js'

function _iconFolder(color) {
    let tmp = `<svg class="svg-folder" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 48 48" fill="${color}">
            <path d="M7 40q-1.15 0-2.075-.925Q4 38.15 4 37V11q0-1.15.925-2.075Q5.85 8 7 8h14.05l3 3H41q1.15 0 2.075.925Q44 12.85 44 14H7v23l5.1-20H47l-5.35 20.7q-.3 1.2-1.1 1.75T38.5 40Z" />
        </svg>`

    return tmp
}

function _formatBytes(bytes, decimals = 2) {
    if (bytes == 0) {
        return '0'
    } else {
        var k = 1024
        var dm = decimals < 0 ? 0 : decimals
        var sizes = ['байт', 'КБ', 'МБ', 'ГБ', 'ТБ']
        var i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
    }
}

function _dateFormater(date) {
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()

    if (month < 10) {
        month = `0${date.getMonth() + 1}`
    }
    if (day < 10) {
        day = `0${date.getDate()}`
    }

    let result = `${month}.${day}.${year}`

    return result
}

function _colorChange(type) {
    let tmp = `
    <button class="modal-img-card__ui-btn modal-img-card-palette_js" title="Задать цвет папки">
        <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48">
            <path d="M480 976q-82 0-155-31.5t-127.5-86Q143 804 111.5 731T80 576q0-84 32-157t87.5-127q55.5-54 130-85T489 176q79 0 150 26.5T763.5 276q53.5 47 85 111.5T880 529q0 108-63 170.5T650 762h-75q-18 0-31 14t-13 31q0 20 14.5 38t14.5 43q0 26-24.5 57T480 976ZM247 602q20 0 35-15t15-35q0-20-15-35t-35-15q-20 0-35 15t-15 35q0 20 15 35t35 15Zm126-170q20 0 35-15t15-35q0-20-15-35t-35-15q-20 0-35 15t-15 35q0 20 15 35t35 15Zm214 0q20 0 35-15t15-35q0-20-15-35t-35-15q-20 0-35 15t-15 35q0 20 15 35t35 15Zm131 170q20 0 35-15t15-35q0-20-15-35t-35-15q-20 0-35 15t-15 35q0 20 15 35t35 15Z"/>
        </svg>
    </button>
    `

    if (type != 'folder') {
        return ''
    }

    return tmp
}

function _download(type, url) {
    let tmp = `<a class="modal-img-card__ui-btn" title="скачать" href="${url}" target="_blank" download>
            <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48">
                <path d="M251 896q-88 0-149.5-61.5T40 685q0-78 50-137t127-71q18-90 83-150t151-68v349l-83-83-43 43 156 156 156-156-43-43-83 83V259q101 11 169 90t68 185v24q72-2 122 46.5T920 727q0 69-50 119t-119 50H251Z" />
            </svg>
        </a>`

    if (type != 'file') {
        return ''
    }

    return tmp
}

export const tmpFolder = (obj) => {
    let id = obj.fileId ? obj.fileId : obj.path
    let type = obj.fileId ? 'file' : 'folder'
    let color = '#0097e6'

    let url = obj.original
    let urlFile = _iconFolder(color)

    if (url) {
        urlFile = `<img src="${obj.original}" alt=""></img>`

        if (url.includes('pdf')) urlFile = iconsFolder._iconPdf()
        if (url.includes('doc')) urlFile = iconsFolder._iconDoc()
        if (url.includes('mp3')) urlFile = iconsFolder._iconMp3()
        if (url.includes('mp4')) urlFile = iconsFolder._iconMp4()
        if (url.includes('txt')) urlFile = iconsFolder._iconTxt()
        if (url.includes('xlsx')) urlFile = iconsFolder._iconXlsx()
    }

    let dateObj = new Date(obj.mtime)
    let dateParseFormat = _dateFormater(dateObj)

    let tmpCard = `
    <div class="modal-img-card" data-type="${type}" data-id="${id}" data-color="${color}" data-original="${obj.original}">

        <div class="modal-img-card__content card-content_js">
            <div class="modal-img-card__img">
                ${urlFile}
            </div>

            <div class="modal-img-card__info">
                <ul>
                    <li>${obj.name}</li>
                    <li>размер: <span>${_formatBytes(obj.size)}</span></li>
                    <li>дата создание: <span>${dateParseFormat}</span></li>
                </ul>
            </div>
        </div>
        
        <div class="modal-img-card__ui-wrap"> 
            ${_colorChange(type)}
            ${_download(type, obj.original)}
            <button class="modal-img-card__ui-btn modal-img-card-delite_js" title="Удалить">
                <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 48 48">
                    <path d="M13.05 42q-1.2
                        0-2.1-.9-.9-.9-.9-2.1V10.5H8v-3h9.4V6h13.2v1.5H40v3h-2.05V39q0
                        1.2-.9 2.1-.9.9-2.1.9Zm5.3-7.3h3V14.75h-3Zm8.3 0h3V14.75h-3Z" />
                </svg>
            </button>
        </div>

    </div>
    `

    const output = document.querySelector('.content-cards_js')
    output.insertAdjacentHTML('beforeend', tmpCard)
}

export const removeFolders = () => {
    let imgCardsContainer = document.querySelector('.content-cards_js')

    Array.from(imgCardsContainer.children).forEach((element) => {
        element.remove()
    })
}

export const removeFile = () => {
    let imgCardsContainer = document.querySelector('.content-cards_js')

    Array.from(imgCardsContainer.children).forEach((element) => {
        if (element.getAttribute('data-type') != 'folder') {
            element.remove()
        }
    })
}
