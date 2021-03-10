const INITIAL_STATE = {
    buttonChange: false
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'BUTTA':
            return { ...state, buttonChange: true }
        case 'BUTTB':
            return { ...state, buttonChange: false }
        default:
            return state
    }
}