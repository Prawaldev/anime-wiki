import { useState, useEffect } from 'react'
import { API_PROVIDERS, getProvider, setProvider, onProviderChange, type ApiProviderId } from '../utils/providers'

export default function ApiSwitcher() {
  const [provider, setProviderState] = useState<ApiProviderId>(getProvider)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    return onProviderChange(id => setProviderState(id))
  }, [])

  const current = API_PROVIDERS.find(p => p.id === provider) ?? API_PROVIDERS[0]

  return (
    <div className="api-switcher">
      <button
        className={`api-switcher-toggle${open ? ' open' : ''}`}
        onClick={() => setOpen(o => !o)}
        title="Switch API provider"
      >
        <span className="api-badge">API</span>
        <span className="api-current">{current.label}</span>
        <span className="api-caret">&#9662;</span>
      </button>
      {open && (
        <div className="api-menu" onMouseLeave={() => setOpen(false)}>
          {API_PROVIDERS.map(p => (
            <button
              key={p.id}
              className={`api-menu-item${p.id === provider ? ' active' : ''}`}
              onClick={() => {
                setProvider(p.id)
                setOpen(false)
              }}
            >
              <span className="api-menu-label">{p.label}</span>
              <span className="api-menu-desc">{p.description}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
