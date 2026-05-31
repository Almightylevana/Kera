import { useState } from "react"
import { Hero } from "@/components/Hero"
import { Wizard } from "@/components/Wizard"
import { Results } from "@/components/Results"
import { type FormData, emptyFormData } from "@/lib/data"

type View = "hero" | "wizard" | "results"

function App() {
  const [view, setView] = useState<View>("hero")
  const [data, setData] = useState<FormData>(emptyFormData)

  return (
    <div className="min-h-screen bg-paper">
      {view === "hero" && <Hero onStart={() => setView("wizard")} />}
      {view === "wizard" && (
        <Wizard
          onComplete={(d) => {
            setData(d)
            setView("results")
          }}
        />
      )}
      {view === "results" && (
        <Results
          data={data}
          onRestart={() => {
            setData(emptyFormData)
            setView("hero")
          }}
        />
      )}

      <footer className="text-center py-8 px-6 border-t border-cream-200 bg-cream-50">
        <p className="text-xs text-clay-600 font-medium tracking-wider uppercase">
          Kera · Made in Georgia · For the diaspora
        </p>
      </footer>
    </div>
  )
}

export default App
