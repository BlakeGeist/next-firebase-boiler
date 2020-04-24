import React, { useState } from 'react'

const CategoriesList = ({ categories }) => {
    const [list, setList] = useState(categories);
    return list.map((category, i) => {
        return (
            <div key={`blog-cat-${i}`}>{category[Object.keys(category)[0]].name}</div>
        )                            
    })
}

export default CategoriesList