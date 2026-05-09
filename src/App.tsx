import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Nav } from './components/Nav'
import { FaqSection } from './components/sections/FaqSection'
import { HeroSection } from './components/sections/HeroSection'
import { HowtoSection } from './components/sections/HowtoSection'
import { OfferSection } from './components/sections/OfferSection'
import { TeamSection } from './components/sections/TeamSection'
import { VacanciesSection } from './components/sections/VacanciesSection'
import { ArticlesPage } from './pages/ArticlesPage'
import { CallDetailPage } from './pages/CallDetailPage'
import { CallsPage } from './pages/CallsPage'
import { CollectionDetailPage } from './pages/CollectionDetailPage'
import { CommunityMemberPage } from './pages/CommunityMemberPage'
import { CommunityPage } from './pages/CommunityPage'
import { IntroPage } from './pages/IntroPage'
import { FrontendPage } from './pages/FrontendPage'
import { StrategyPage } from './pages/StrategyPage'
import { OnboardingPage } from './pages/OnboardingPage'
import { SpecsPage } from './pages/SpecsPage'
import { TasksPage } from './pages/TasksPage'
import { VideoPage } from './pages/VideoPage'

function HomePage() {
  return (
    <main>
      <HeroSection />
      <TeamSection />
      <HowtoSection />
      <OfferSection />
      <VacanciesSection />
      <FaqSection />
    </main>
  )
}

function Footer() {
  return (
    <footer className="py-8 md:py-12 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <img src="https://static.tildacdn.com/tild3466-6438-4330-b739-303166383362/favi.png" alt="Rollout" className="h-18 w-18" />
        <span className="text-sm text-muted-foreground">Rollout</span>
      </div>
    </footer>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Nav />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/задачи" element={<TasksPage />} />
            <Route path="/задачи/:slug" element={<CollectionDetailPage dataPath="/data/tasks.json" backPath="/задачи" backLabel="Задачи" titleFallbackKey="name" />} />
            <Route path="/спецификации" element={<SpecsPage />} />
            <Route path="/спецификации/:slug" element={<CollectionDetailPage dataPath="/data/specs.json" backPath="/спецификации" backLabel="Спецификации" />} />
            <Route path="/сообщество" element={<CommunityPage />} />
            <Route path="/сообщество/:slug" element={<CommunityMemberPage />} />
            <Route path="/интро" element={<IntroPage />} />
            <Route path="/видео" element={<VideoPage />} />
            <Route path="/вакансии/:slug" element={<CollectionDetailPage dataPath="/data/vacancies.json" backPath="/" backLabel="Главная" />} />
            <Route path="/созвоны" element={<CallsPage />} />
            <Route path="/созвоны/:slug" element={<CallDetailPage />} />
            <Route path="/публикации" element={<ArticlesPage />} />
            <Route path="/публикации/:slug" element={<CollectionDetailPage dataPath="/data/articles.json" backPath="/публикации" backLabel="Публикации" />} />
            <Route path="/онбординг" element={<OnboardingPage />} />
            <Route path="/онбординг/:slug" element={<CollectionDetailPage dataPath="/data/onboarding.json" backPath="/онбординг" backLabel="Онбординг" />} />
            <Route path="/стратегия" element={<StrategyPage />} />
            <Route path="/стратегия/:slug" element={<CollectionDetailPage dataPath="/data/strategy.json" backPath="/стратегия" backLabel="Стратегия" />} />
            <Route path="/инструкции" element={<FrontendPage />} />
            <Route path="/инструкции/:slug" element={<CollectionDetailPage dataPath="/data/howto.json" backPath="/инструкции" backLabel="Инструкции" />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
