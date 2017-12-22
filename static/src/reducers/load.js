const load = (state = [], action) => {
  switch (action.type) {
    case 'LOAD_DATA':
      return [
        ...state,
        {
          date: action.date,
          completed: false
        }
      ]
    default:
      return state
  }
}

export default load 