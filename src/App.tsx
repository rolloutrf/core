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
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/tasks/:slug" element={<CollectionDetailPage dataPath="/data/tasks.json" backPath="/tasks" backLabel="Задачи" titleFallbackKey="name" />} />
            <Route path="/specs" element={<SpecsPage />} />
            <Route path="/specs/:slug" element={<CollectionDetailPage dataPath="/data/specs.json" backPath="/specs" backLabel="Спецификации" />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/community/:slug" element={<CommunityMemberPage />} />
            <Route path="/intro" element={<IntroPage />} />
            <Route path="/video" element={<VideoPage />} />
            <Route path="/vacancies/:slug" element={<CollectionDetailPage dataPath="/data/vacancies.json" backPath="/" backLabel="Главная" />} />
            <Route path="/calls" element={<CallsPage />} />
            <Route path="/calls/:slug" element={<CallDetailPage />} />
            <Route path="/articles" element={<ArticlesPage />} />
            <Route path="/articles/:slug" element={<CollectionDetailPage dataPath="/data/articles.json" backPath="/articles" backLabel="Публикации" />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/onboarding/:slug" element={<CollectionDetailPage dataPath="/data/onboarding.json" backPath="/onboarding" backLabel="Онбординг" />} />
            <Route path="/frontend" element={<FrontendPage />} />
            <Route path="/frontend/:slug" element={<CollectionDetailPage dataPath="/data/howto.json" backPath="/frontend" backLabel="Инструкции" />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
