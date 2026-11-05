import { BackToTop } from './components/common/BackToTop'
import { Footer } from './components/layout/Footer'
import { Header } from './components/layout/Header'
import { useLanguage } from './context/LanguageContext'
import { HomePage } from './pages/HomePage'

function App() {
  const { t } = useLanguage()
  return (
    <>
      <a className="skip-link" href="#main-content">{t('a11y.skip')}</a>
      <Header />
      <HomePage />
      <Footer />
      <BackToTop />
    </>
  )
}

export default App

