import { useState, useEffect } from 'react'
import { API_PROVIDERS, getProvider, setProvider, onApiError, getProviderMeta, type ApiProviderId, type ApiErrorInfo } from '../utils/providers'

interface Props {
  onRetry?: () => void
}

export default function ErrorPopup({ onRetry }: Props) {
  const [info, setInfo] = useState<ApiErrorInfo | null>(null)
  const [open, setOpen] = useState(false)
  const [lastShown, setLastShown] = useState<string>('')

  useEffect(() => {
    return onApiError((i) => {
      const key = `${i.provider}:${i.message}`
      if (key === lastShown) return
      setLastShown(key)
      setInfo(i)
      setOpen(true)
    })
  }, [lastShown])

  if (!open || !info) return null

  const alternatives = API_PROVIDERS.filter(p => p.id !== info.provider)

  const switchTo = (id: ApiProviderId) => {
    setProvider(id)
    setOpen(false)
    onRetry?.()
    window.location.reload()
  }

  return (
    <div className="error-popup-overlay">
      <div className={`error-popup${info.retry ? ' retry' : ''}`} role="alertdialog" aria-modal="true">
        <div className="error-popup-header">
          <span className="error-popup-icon">&#9888;</span>
          <h3>API Error Detected</h3>
        </div>
        <div className="error-popup-provider">
          Provider: <strong>{getProviderMeta(info.provider).label}</strong>
        </div>
        <p className="error-popup-msg">The {getProviderMeta(info.provider).label} API responded with an error.</p>
        <pre className="error-popup-code">{info.message}</pre>
        {info.retry ? (
          <p className="error-popup-hint">
            It looks like this data source is currently unavailable. You can try again or switch to another API below.
          </p>
        ) : (
          <p className="error-popup-hint">{info.message}</p>
        )}

        <div className="error-popup-actions">
          <button className="popup-btn primary" onClick={switchTo.bind(null, alternatives[0]?.id ?? getProvider())}>
            Switch to {getProviderMeta(alternatives[0]?.id ?? getProvider()).label.split(' (')[0]}
          </button>
          <button className="popup-btn" onClick={() => setOpen(false)}>Dismiss</button>
        </div>

        {alternatives.length > 0 && (
          <div className="error-popup-alt">
            <span>Or switch to:</span>
            <div className="error-popup-alt-btns">
              {alternatives.map(p => (
                <button
                  key={p.id}
                  className="popup-btn ghost"
                  onClick={switchTo.bind(null, p.id)}
                >
                  {p.label.split(' (')[0]}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
