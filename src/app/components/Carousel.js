import React from 'react'
import canyionImg from './assets/canyon.jpg'
import canyionImg2 from './assets/canyon-2.jpg'
import canyionImg3 from './assets/canyon-3.jpg'
import canyionImg4 from './assets/canyon-4.jpg'

const Carousel = () => {
    return (
        <div className="carousel">
            <div className="carousel-slide">
                <img src={canyionImg} />
            </div>
            <div className="carousel-slide">
                <img src={canyionImg2} />
            </div>
            <div className="carousel-slide">
                <img src={canyionImg3} />
            </div>
            <div className="carousel-slide">
                <img src={canyionImg4} />
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