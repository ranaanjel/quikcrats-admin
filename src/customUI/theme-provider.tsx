
import { set } from "mongoose";
import { createContext, useContext, useState, useEffect } from "react";

type Theme = "light" | "dark";
type ThemeProviderProps = {
    children : React.ReactElement, 
    defaultTheme?:Theme,
    storageKey?:string

}

type ThemeProviderState = {
    theme:Theme, 
    setTheme:(them:Theme)=> void,
}

const intialState:ThemeProviderState ={
    theme:"dark",
    setTheme : () => null
}

const ThemeContext = createContext<ThemeProviderState>(intialState)

export function ThemeProvider({
    children, defaultTheme = "dark", storageKey = "ui-theme", ...props
}:ThemeProviderProps) {
    const [theme, setTheme] = useState<Theme>( ()  => {
        return localStorage.getItem(storageKey) as Theme || defaultTheme
    })

    useEffect(() => {

        const root = window.document.documentElement;

        root.classList.remove("light", "dark");

        root.classList.add(theme);
    },[theme])

    const value = {
        theme,
        setTheme : (theme:Theme) => {
            localStorage.setItem(storageKey, theme)
            setTheme(theme);
        }
    }


    return <ThemeContext.Provider value={value} {...props}>{children}</ThemeContext.Provider>

}

export function useTheme() {
    const currContext = useContext(ThemeContext);
    if (currContext == undefined) {
        throw new Error("useTheme must be used within a ThemeProvider")
    }

    return currContext;
}