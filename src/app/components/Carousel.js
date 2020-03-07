import React from 'react'
import canyionImg from './assets/canyon.jpg'

const Carousel = () => {
    return (
        <div>
            <div>
                <img src={canyionImg} />
            </div>
            <style jsx>{`
                img {
                    width: 100%;
                }
            `}</style>
        </div>
    )
}

export default Carousel