import React from 'react'

const IncrementValue = (num) => {

    return {
        type: 'INCREMENT',
        payload: num
    }
}

export default IncrementValue