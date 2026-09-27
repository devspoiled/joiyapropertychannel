'use client'

import { Map, MapControls, MapMarker, MarkerContent, MarkerPopup, type MapRef, type MapStyleOption } from '@frontend/ui/map/map'
import { useEffect, useRef, useState } from 'react'

// Free raster basemaps that need no API key. "Road" hits raw OSM tiles —
// ponytail: OSM's tile usage policy disallows this for real production
// traffic; swap for MapTiler/Stadia (free tier, one API key) before deploying.
// "Satellite" uses Esri's free World Imagery tiles. "3D" uses mapcn's
// built-in CARTO dark-matter style, tilted.
// Mapbox note: if/when a Directions API feature is added, Mapbox needs its
// own API key/account — separate from this basemap choice.
const ROAD_STYLE: MapStyleOption = {
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '© OpenStreetMap contributors'
    }
  },
  layers: [{ id: 'osm', type: 'raster', source: 'osm' }]
}

const SATELLITE_STYLE: MapStyleOption = {
  version: 8,
  sources: {
    esri: {
      type: 'raster',
      tiles: [
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      ],
      tileSize: 256,
      attribution: '© Esri'
    }
  },
  layers: [{ id: 'esri', type: 'raster', source: 'esri' }]
}

type View = 'road' | 'satellite' | '3d'

export function PropertyMap({
  latitude,
  longitude,
  label,
  className
}: {
  latitude: number
  longitude: number
  label?: string
  className?: string
}) {
  const [view, setView] = useState<View>('road')
  const mapRef = useRef<MapRef>(null)

  // 3D uses mapcn's default CARTO style (no `styles` prop); Road/Satellite override it.
  const styles = view === '3d' ? undefined : { light: view === 'road' ? ROAD_STYLE : SATELLITE_STYLE }

  useEffect(() => {
    mapRef.current?.easeTo({ pitch: view === '3d' ? 60 : 0, duration: 500 })
  }, [view])

  return (
    <div className={className}>
      <div className="relative h-full w-full">
        <Map
          ref={mapRef}
          center={[longitude, latitude]}
          zoom={15}
          theme="dark"
          styles={styles}
          className="h-full w-full bg-black"
        >
          <MapControls showCompass />
          <MapMarker longitude={longitude} latitude={latitude}>
            <MarkerContent>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: '#1E241E',
                  border: '3px solid #F3F6F1',
                  boxShadow: '0 4px 12px -4px rgba(0,0,0,.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 11.5 12 4l8 7.5"
                    stroke="#A8E6AE"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6 10v9h12v-9"
                    stroke="#A8E6AE"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </MarkerContent>
            {label && <MarkerPopup>{label}</MarkerPopup>}
          </MapMarker>
        </Map>
        <div className="absolute left-3 top-3 z-10 flex gap-1 rounded-full bg-white/95 p-1 shadow-[0_4px_12px_-4px_rgba(30,36,30,.4)]">
          {(['road', 'satellite', '3d'] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              className="rounded-full px-3 py-1.5 text-[12.5px] font-semibold uppercase"
              style={{
                background: view === v ? '#1E241E' : 'transparent',
                color: view === v ? '#F3F6F1' : '#3D473C'
              }}
            >
              {v === 'road' ? 'Road' : v === 'satellite' ? 'Satellite' : '3D'}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
