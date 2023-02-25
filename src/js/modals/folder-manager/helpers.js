export const getLocalSelector = (name) => {
    return JSON.parse(localStorage.getItem(name))
}
export const setLocalSelector = (name, arg) => {
    localStorage.setItem(name, JSON.stringify(arg))
}
