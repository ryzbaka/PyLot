import React from 'react';

const Sidebar = ({options})=>{
    return(
        <div className="side-container">
            {options.map(item=><p>{item}</p>)}
        </div>
    )
}
export default Sidebar;