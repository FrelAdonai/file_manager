import { setLocalSelector, getLocalSelector } from '../helpers.js'
import { removeFile, removeFolders, tmpFolder } from '../cards/main-card.js'
import { removeViewCardImage } from '../cards/view-card.js'
import { isNullNumFileSelected } from '../elements/selected-file.js'

export const filterContainerShow = () => {
    const modalFilterImgJs = document.querySelector('.modal-img-filter_js')

    modalFilterImgJs.classList.add('active')
}

export const filterContainerHide = () => {
    const modalFilterImgJs = document.querySelector('.modal-img-filter_js')

    modalFilterImgJs.classList.remove('active')
}

function _sortUp(a, b) {
    a = Number(a.size.replace(/[^0-9]/g, ''))
    b = Number(b.size.replace(/[^0-9]/g, ''))

    return a < b ? -1 : b < a ? 1 : 0
}

function _sortDown(a, b) {
    a = Number(a.size.replace(/[^0-9]/g, ''))
    b = Number(b.size.replace(/[^0-9]/g, ''))

    return a > b ? -1 : b > a ? 1 : 0
}

function _sortDateUp(a, b) {
    a = a.mtime
    b = b.mtime

    return a < b ? -1 : b < a ? 1 : 0
}

function _sortDateDown(a, b) {
    a = a.mtime
    b = b.mtime

    return a > b ? -1 : b > a ? 1 : 0
}

export const objAfterFiltred = (obj) => {
    let objAfter = obj
    let objAfterCopy = obj.map((x) => x)

    let re = RegExp(`${getLocalSelector('type_file')}`)

    if (getLocalSelector('search_value') && getLocalSelector('search_value') != '') {
        objAfterCopy = objAfterCopy.filter((x) => x.name.includes(getLocalSelector('search_value')))
    }

    if (getLocalSelector('type_file')) {
        objAfterCopy = objAfterCopy.filter((x) => !x.original || x.original.match(re))
    }

    if (getLocalSelector('filter_users') && getLocalSelector('filter_users') != 1) {
        objAfterCopy = objAfterCopy.filter((x) => x.userId == getLocalSelector('filter_users'))
    }

    let re2 = RegExp(`${getLocalSelector('filter_type')}`)
    if (getLocalSelector('filter_type') && getLocalSelector('filter_type') != 1) {
        objAfterCopy = objAfterCopy.filter((x) => !x.original || x.original.match(re2))
    }

    if (getLocalSelector('delete_id') && getLocalSelector('delete_id') != '') {
        objAfterCopy = objAfterCopy.filter((e) => getLocalSelector('delete_id').findIndex((i) => i == e.fileId) == -1)
    }

    console.log(objAfterCopy, getLocalSelector('delete_id'))

    switch (getLocalSelector('filter_params')) {
        case '2':
            objAfter = objAfterCopy.sort((a, b) => _sortUp(a, b))
            break
        case '3':
            objAfter = objAfterCopy.sort((a, b) => _sortDown(a, b))
            break
        case '4':
            objAfter = objAfterCopy.sort((a, b) => _sortDateUp(a, b))
            break
        case '5':
            objAfter = objAfterCopy.sort((a, b) => _sortDateDown(a, b))
            break
        default:
            objAfter = objAfterCopy
            break
    }

    return objAfter
}

export const filterParamsHendler = (arg) => {
    function _sortHendler() {
        removeFile()
        removeViewCardImage()

        objAfterFiltred(arg.items).forEach((field) => tmpFolder(field))
    }

    if (getLocalSelector('filter_params')) {
        let paramsSelect = document.querySelector('.select-params_js')
        let paramsSelectField = paramsSelect.querySelector('.select-custom__field')
        let paramsSelectItems = paramsSelect.querySelectorAll('option')

        let filterCurrentItem = Array.from(paramsSelectItems).filter((x) => x.value == getLocalSelector('filter_params'))
        filterCurrentItem[0].selected = true
        paramsSelectField.textContent = filterCurrentItem[0].textContent
    }

    if (getLocalSelector('filter_type')) {
        let paramsSelect = document.querySelector('.select-user_js')
        let paramsSelectField = paramsSelect.querySelector('.select-custom__field')
        let paramsSelectItems = paramsSelect.querySelectorAll('option')

        let filterCurrentItem = Array.from(paramsSelectItems).filter((x) => x.value == getLocalSelector('filter_type'))
        filterCurrentItem[0].selected = true
        paramsSelectField.textContent = filterCurrentItem[0].textContent
    }

    document.addEventListener('click', (e) => {
        let targetParams = e.target.closest('.select-params_js')
        let targetType = e.target.closest('.select-user_js')

        if (targetParams) {
            let items = e.target.closest('.select-custom__list-item')

            if (items) {
                let attrItems = items.getAttribute('data-value')
                setLocalSelector('filter_params', attrItems)
                _sortHendler()

                setLocalSelector('files_arr', '')
                isNullNumFileSelected()
            }
        }

        if (targetType) {
            let items = e.target.closest('.select-custom__list-item')

            if (items) {
                let attrItems = items.getAttribute('data-value')
                setLocalSelector('filter_type', attrItems)
                _sortHendler()

                setLocalSelector('files_arr', '')
                isNullNumFileSelected()
            }
        }
    })

    const radioUserNode = document.querySelectorAll('.radio-user-selected_js')

    if (getLocalSelector('filter_users')) {
        radioUserNode.forEach((element) => {
            element.checked = false
        })

        let filterCurrentRadio = Array.from(radioUserNode).filter((x) => x.value == getLocalSelector('filter_users'))
        filterCurrentRadio[0].checked = true
    }

    radioUserNode.forEach((element) => {
        element.addEventListener('input', (e) => {
            setLocalSelector('filter_users', element.value)
            _sortHendler()

            setLocalSelector('files_arr', '')
            isNullNumFileSelected()
        })
    })
}

export const filterSearch = (arg) => {
    let field = document.querySelector(arg.input)
    let itemsObj = arg.items

    if (getLocalSelector('search_value')) {
        field.value = getLocalSelector('search_value')
    }

    field.addEventListener('input', () => {
        let fieldValue = field.value.toLowerCase().replace(/ /g, '')
        setLocalSelector('search_value', fieldValue)
        removeFolders()
        removeViewCardImage()

        objAfterFiltred(itemsObj).forEach((folder) => {
            tmpFolder(folder)
        })
    })
}
