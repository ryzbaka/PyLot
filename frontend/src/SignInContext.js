import { createContext } from "react";

const SignInContext = createContext([["Signed Out", "None", "None"], () => {}]);

export default SignInContext;
