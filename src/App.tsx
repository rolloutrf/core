import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Nav } from './components/Nav'
import { HeroSection } from './components/sections/HeroSection'
import { TeamSection } from './components/sections/TeamSection'
import { HowtoSection } from './components/sections/HowtoSection'
import { OfferSection } from './components/sections/OfferSection'
import { VacanciesSection } from './components/sections/VacanciesSection'
import { FaqSection } from './components/sections/FaqSection'
import { TasksPage } from './pages/TasksPage'
import { SpecsPage } from './pages/SpecsPage'
import { CommunityPage } from './pages/CommunityPage'
import { ChecklistPage } from './pages/ChecklistPage'
import { VideoPage } from './pages/VideoPage'
import { CallsPage } from './pages/CallsPage'
import { ArticlesPage } from './pages/ArticlesPage'
import { MarkdownPage } from './pages/MarkdownPage'

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
      <Nav />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/specs" element={<SpecsPage />} />
        <Route path="/specs/detail" element={<MarkdownPage />} />
        <Route path="/tasks/detail" element={<MarkdownPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/checklist" element={<ChecklistPage />} />
        <Route path="/video" element={<VideoPage />} />
        <Route path="/vacancies/detail" element={<MarkdownPage />} />
        <Route path="/calls" element={<CallsPage />} />
        <Route path="/calls/detail" element={<MarkdownPage />} />
        <Route path="/articles" element={<ArticlesPage />} />
        <Route path="/articles/detail" element={<MarkdownPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
