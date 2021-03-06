import keyMirror from 'keymirror'

export const STATUS = keyMirror({
    PENDING: null,
    COMPLETED: null,
    PAGINATING: null,
    COMPILING: null,
    SUCCESS: null,
    FAILURE: null,
    UNKNOWN: null,
    ERROR: null,
    ABORT: null
})