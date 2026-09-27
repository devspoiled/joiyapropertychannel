'use client'

import type { PropertyCard } from '@frontend/types/api'
import { formatArea, money } from '@/lib/property'
import { Map, MapControls, MapMarker, MarkerContent, MarkerTooltip, type MapRef, type MapStyleOption } from '@frontend/ui/map/map'
import { useEffect, useRef, useState } from 'react'

// See property-map.tsx for the same Road/Satellite/3D basemap notes.
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

function pinStyle(active: boolean): React.CSSProperties {
  return {
    padding: '5px 10px',
    borderRadius: 999,
    font: '700 12.5px sans-serif',
    background: active ? '#2F6B3A' : '#1E241E',
    color: '#F3F6F1',
    boxShadow: '0 4px 10px -3px rgba(0,0,0,.5)',
    cursor: 'pointer',
    border: active ? '2px solid #A8E6AE' : '2px solid transparent',
    whiteSpace: 'nowrap',
    transition: 'background .15s ease',
    zIndex: active ? 10 : 1
  }
}

function PopupCard({ p }: { p: PropertyCard }) {
  const isPlot = p.beds == null || p.baths == null
  const facts = isPlot
    ? p.plot_size ?? formatArea(p.sqft)
    : `${p.beds} bd · ${p.baths} ba · ${formatArea(p.sqft)}`

  return (
    <div style={{ width: 220, fontFamily: 'sans-serif', cursor: 'pointer' }}>
      {p.cover_image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={p.cover_image_url}
          alt={p.address}
          style={{ width: '100%', height: 110, objectFit: 'cover', display: 'block' }}
        />
      ) : (
        <div style={{ width: '100%', height: 110, background: '#E4EBE1' }} />
      )}
      <div style={{ padding: '10px 12px' }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#1E241E' }}>{money(p.price_lac)}</div>
        <div style={{ marginTop: 4, fontSize: 12.5, color: '#3D473C' }}>{facts}</div>
        <div style={{ marginTop: 5, fontSize: 12, color: '#6B756A', lineHeight: 1.3 }}>{p.address}</div>
      </div>
    </div>
  )
}

export function ListingsMap({
  properties,
  hoveredId,
  onHover,
  onSelect
}: {
  properties: PropertyCard[]
  hoveredId: string | null
  onHover: (id: string | null) => void
  onSelect: (id: string) => void
}) {
  const withCoords = properties.filter((p) => p.latitude != null && p.longitude != null) as Array<
    PropertyCard & { latitude: string; longitude: string }
  >
  const mapRef = useRef<MapRef>(null)
  const [view, setView] = useState<View>('road')

  // 3D uses mapcn's default CARTO style (no `styles` prop); Road/Satellite override it.
  const styles = view === '3d' ? undefined : { light: view === 'road' ? ROAD_STYLE : SATELLITE_STYLE }

  useEffect(() => {
    mapRef.current?.easeTo({ pitch: view === '3d' ? 60 : 0, duration: 500 })
  }, [view])

  if (withCoords.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#EDF1EA] text-[14px] text-[#6B756A]">
        No mapped listings on this page
      </div>
    )
  }

  const lats = withCoords.map((p) => Number(p.latitude))
  const lngs = withCoords.map((p) => Number(p.longitude))
  const center: [number, number] = [
    (Math.min(...lngs) + Math.max(...lngs)) / 2,
    (Math.min(...lats) + Math.max(...lats)) / 2
  ]

  return (
    <div className="relative h-full w-full">
      <style>{`
        .mapcn-popup { z-index: 20; }
      `}</style>
      <Map
        ref={mapRef}
        center={center}
        zoom={12}
        theme="dark"
        styles={styles}
        className="h-full w-full bg-black"
      >
        <MapControls showCompass />
        {withCoords.map((p) => {
          const active = p.id === hoveredId
          return (
            <MapMarker
              key={p.id}
              longitude={Number(p.longitude)}
              latitude={Number(p.latitude)}
              onClick={() => onSelect(p.id)}
              onMouseEnter={() => onHover(p.id)}
              onMouseLeave={() => onHover(null)}
            >
              <MarkerContent>
                <div style={pinStyle(active)}>{money(p.price_lac)}</div>
              </MarkerContent>
              <MarkerTooltip className="mapcn-popup rounded-xl bg-transparent p-0 shadow-[0_14px_30px_-12px_rgba(0,0,0,.4)]">
                <PopupCard p={p} />
              </MarkerTooltip>
            </MapMarker>
          )
        })}
      </Map>
      <div className="absolute right-3 top-3 z-10 flex gap-1 rounded-full bg-white/95 p-1 shadow-[0_4px_12px_-4px_rgba(30,36,30,.4)]">
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
  )
}
