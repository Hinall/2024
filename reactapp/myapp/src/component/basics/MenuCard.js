import React from 'react'

const MenuCard = ({ MenuData }) => {

    return (
        <>
        <section className='main-card--cointainer'>
            {
                MenuData.map((currentElement) => {
                    return (

                        <div className='card-container' key={currentElement.id}>
                            <div className='card'>
                                <div className='card-body'>
                                    <span className='card-number card-cirle subtle'>{currentElement.id}</span>
                                    <span className='card-author subtle'>{currentElement.category}</span>
                                    <h1>{currentElement.name}</h1>
                                    <span>{currentElement.description}</span>
                                    <div className='card-read'>
                                        READ
                                    </div>
                                    <img src={currentElement.image}alt="images" className='card-media' />
                                    <span className='card-tag'>order now</span>
                                </div>
                            </div>
                        </div>
                    );
                })
            }
           </section>  
        </>
    )
}

export default MenuCard
