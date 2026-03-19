import { Home } from './pages/Home'
import { useTheme } from './hooks/useTheme'

export default function App() {
  const { theme, toggleTheme } = useTheme()
  return <Home theme={theme} toggleTheme={toggleTheme} />
}
