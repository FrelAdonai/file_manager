import { setLocalSelector, getLocalSelector } from '../helpers.js'
import { removeViewCardImage } from '../cards/view-card.js'

export const addNumFileSelected = (num) => {
    let addNumNod = document.querySelector('.modal-img-add-num_js')
    addNumNod.textContent = num
}

export const isNullNumFileSelected = () => {
    let addNumNod = document.querySelector('.modal-img-add-num_js')
    addNumNod.textContent = 0
}

export const addNumFileHendler = () => {
    let addNumNod = document.querySelector('.modal-img__add-files')

    let arr = []

    addNumNod.addEventListener('click', (e) => {
        let targetAdd = e.target.closest('.modal-btn-add_js')
        let targetRemove = e.target.closest('.modal-btn-remove_js')

        if (targetAdd) {
            const files = document.querySelectorAll('[data-type=file]')

            arr = []

            files.forEach((element) => {
                element.classList.add('active')

                if (element.classList.contains('active')) {
                    arr.push(element.getAttribute('data-id'))
                }
            })

            removeViewCardImage()
            setLocalSelector('files_arr', arr)
            addNumFileSelected(files.length)
        }

        if (targetRemove) {
            const files = document.querySelectorAll('[data-type=file]')
            files.forEach((element) => {
                element.classList.remove('active')

                if (!element.classList.contains('active')) {
                    setLocalSelector('files_arr', '')
                }

                isNullNumFileSelected()
            })
        }
    })
}
