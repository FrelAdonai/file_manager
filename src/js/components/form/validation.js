import { inputPhoneMask } from './input-phone'

export const valid = () => {
    inputPhoneMask()

    class ValidateG {
        constructor(forms, lang) {
            this.forms = forms
            this.lang = lang

            this.formHendler()
        }

        formHendler() {
            for (let index = 0; index < this.forms.length; index++) {
                const form = this.forms[index]

                const langSite = form.getAttribute('data-lang')

                const formInputsNode = form.querySelectorAll('input')
                const inputsTxtNode = this.fieldsText(formInputsNode)
                const inputsCheckbox = this.fieldsCheckbox(formInputsNode)

                // static state fields
                inputsTxtNode.forEach((inputTxt) => this.createErrorTolltip(inputTxt, langSite))

                // all events
                form.addEventListener('submit', (e) => {
                    e.preventDefault()

                    inputsTxtNode.forEach((inputTxt) => {
                        this.addErrorTextField(inputTxt)
                    })

                    inputsCheckbox.forEach((inputCheckbox) => {
                        this.addErrorCheckbox(inputCheckbox)
                    })

                    this.succesAdd([inputsTxtNode, inputsCheckbox])
                })

                inputsTxtNode.forEach((inputTxt) => {
                    inputTxt.addEventListener('input', () => this.addErrorTextField(inputTxt))
                })

                inputsCheckbox.forEach((inputCheckbox) => {
                    inputCheckbox.addEventListener('input', () => this.addErrorCheckbox(inputCheckbox))
                })
            }
        }

        // create ansver error template
        toolltipText(tooltip, langSite, lang) {
            switch (langSite) {
                case 'ru':
                    tooltip.textContent = lang.inputAnsverRu
                    break

                case 'uz':
                    tooltip.textContent = lang.inputAnsverUz
                    break

                case 'en':
                    tooltip.textContent = lang.inputAnsverEn
                    break

                default:
                    tooltip.textContent = lang.inputAnsverRu
                    break
            }
        }

        createErrorTolltip(field, langSite) {
            let tooltip = document.createElement('div')
            tooltip.classList.add('tooltip-error')

            this.toolltipText(tooltip, langSite, this.lang)

            field.parentElement.insertAdjacentElement('beforeend', tooltip)
        }

        showTolltip(field) {
            let tooltip = field.parentElement.querySelector('.tooltip-error')
            tooltip.classList.add('show')
        }

        hideTolltip(field) {
            let tooltip = field.parentElement.querySelector('.tooltip-error')
            tooltip.classList.remove('show')
        }

        // all fields
        fieldsText(fieldsArr) {
            return Array.from(fieldsArr)
                .filter((x) => x.type === 'text')
                .filter((x) => x.value.length <= 0)
        }

        fieldsCheckbox(fieldsArr) {
            return Array.from(fieldsArr)
                .filter((x) => x.type === 'checkbox')
                .filter((x) => !x.checked)
        }

        // fields add error
        addErrorTextField(field) {
            const fieldValue = field.value
            const condition = fieldValue.length <= 0

            switch (condition) {
                case false:
                    field.parentElement.classList.remove('input-error')
                    this.hideTolltip(field)
                    break

                default:
                    if (!field.parentElement.classList.contains('input-error')) {
                        field.parentElement.classList.add('input-error')
                        this.showTolltip(field)
                    }
                    break
            }
        }

        addErrorCheckbox(filed) {
            const condition = filed.checked

            switch (condition) {
                case false:
                    if (!filed.parentElement.classList.contains('input-error')) filed.parentElement.classList.add('input-error')
                    break

                default:
                    filed.parentElement.classList.remove('input-error')
                    break
            }
        }

        // succes
        succesAdd(filedsAllArr) {
            let arr = []
            filedsAllArr.forEach((filedsArr) => filedsArr.forEach((field) => arr.push(field)))

            console.log(arr)
        }
    }

    const formNode = document.querySelectorAll('form')

    new ValidateG(formNode, {
        inputAnsverRu: 'Обязательно для заполнения',
        inputAnsverEn: 'Required to fill',
        inputAnsverUz: "To'ldirish uchun majburiy",
    })
}
