import React from "react";
const Something = ({status,username,password})=>{
    return (
        <div>
            <h1>{status}</h1>
            <h2>{username}</h2>
            <h3>{password}</h3>
        </div>
    )
}
export default Something;