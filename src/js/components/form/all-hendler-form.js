import { customSelect } from './select'
import { inputFile } from './input-file'
// import { validations } from './validation'
import { valid } from './validation'

inputFile()

customSelect({
    select: '.select-custom_js',
    field: '.select-custom__field',
    list: '.select-custom__list',
})

valid()
