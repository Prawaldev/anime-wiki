import { useState, useEffect } from 'react'
import { getProvider, getProviderVersion, onProviderChange, onProviderVersionChange } from './providers'

export function useProviderId() {
  const [id, setId] = useState(getProvider)
  useEffect(() => onProviderChange(id => setId(id)), [])
  return id
}

export function useProviderVersion() {
  const [version, setVersion] = useState(getProviderVersion)
  useEffect(() => onProviderVersionChange(v => setVersion(v)), [])
  return version
}