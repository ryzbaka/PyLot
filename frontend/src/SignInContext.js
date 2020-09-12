import {createContext} from "react";

const SignInContext = createContext(["Signed Out",()=>{}]);

export default SignInContext;