import { useState, type FormEvent } from 'react'

interface Props {
  onSearch: (query: string) => void
  onHome: () => void
}

export default function Header({ onSearch, onHome }: Props) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (query.trim()) onSearch(query.trim())
  }

  return (
    <header>
      <div className="header-inner">
        <a href="/" className="logo" onClick={onHome}>
          <img src={import.meta.env.BASE_URL + "ic_launcher.png"} alt="" className="logo-icon" />
          AniWiki
        </a>
        <form className="search-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Search anime, characters..."
            autoComplete="off"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      </div>
    </header>
  )
}useState
