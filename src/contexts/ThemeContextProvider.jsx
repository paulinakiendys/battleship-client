import { createContext, useContext } from 'react'
import classNames from 'classnames'
import useLocalStorage from '../hooks/useLocalStorage'

export const ThemeContext = createContext()

export const useThemeContext = () => {
	return useContext(ThemeContext)
}

const ThemeContextProvider = ({ children }) => {
	const [theme, setTheme] = useLocalStorage('hn_theme', 'light')

	const getStyle = () => {
		return classNames({
			'bg-dark': isSpaceTheme(),
			'text-light': isSpaceTheme(),
      'space' : isSpaceTheme()
		})
	}

	const isSpaceTheme = () => theme === 'dark'

	const toggleTheme = () => {
		setTheme(theme === 'light' ? 'dark' : 'light')
	}

	const values = {
		theme,
		getStyle,
		isSpaceTheme,
		toggleTheme,
	}

	return (
		<ThemeContext.Provider value={values}>
			{children}
		</ThemeContext.Provider>
	)
}

export default ThemeContextProvider