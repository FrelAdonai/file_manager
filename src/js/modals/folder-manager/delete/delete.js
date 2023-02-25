import { removeViewCardImage } from '../cards/view-card.js'
import { setLocalSelector, getLocalSelector } from '../helpers.js'

export const deleteFolders = () => {
    let arr = []

    document.addEventListener('click', (e) => {
        let target = e.target.closest('.modal-img-card-delite_js')
        let targetOptionItem = e.target.closest('.modal-img__field')
        let targetRadio = e.target.closest('.radio__label')

        if (target) {
            let card = target.closest('.modal-img-card')

            arr.push(card.getAttribute('data-id'))
            setLocalSelector('delete_id', arr)

            card.remove()
            removeViewCardImage()

            console.log(arr, getLocalSelector('delete_id'))
        }

        // if (!target && !targetOptionItem && !targetRadio) {
        //     arr = []

        //     console.log(arr)
        // }
    })
}

export const deleteFoldersClear = () => {
    setLocalSelector('delete_id', '')
}
