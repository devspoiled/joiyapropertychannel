import { StatusEnum } from '@frontend/types/api'

export const STATUS_LABELS: Record<StatusEnum, string> = {
  [StatusEnum.NEW]: 'New',
  [StatusEnum.OPEN_HOUSE]: 'Open house',
  [StatusEnum.PRICE_DROP]: 'Price drop',
  [StatusEnum.FOR_SALE]: 'For sale',
  [StatusEnum.SOLD]: 'Sold'
}

export const STATUS_COLORS: Record<StatusEnum, [string, string]> = {
  [StatusEnum.NEW]: ['#DCF2DE', '#25632F'],
  [StatusEnum.OPEN_HOUSE]: ['#1E241E', '#A8E6AE'],
  [StatusEnum.PRICE_DROP]: ['#F3EDDC', '#7A6320'],
  [StatusEnum.FOR_SALE]: ['#FFFFFF', '#3D473C'],
  [StatusEnum.SOLD]: ['#EDF1EA', '#6B756A']
}

export function money(lac: number) {
  if (lac >= 100) {
    const cr = lac / 100
    return 'Rs ' + (cr % 1 === 0 ? cr : cr.toFixed(2).replace(/0$/, '')) + ' Cr'
  }
  return 'Rs ' + lac + ' Lac'
}

// Punjab/Pakistan convention: 1 Marla = 225 sqft, 1 Kanal = 20 Marla.
const SQFT_PER_MARLA = 225

export function sqftToMarla(sqft: number) {
  const marla = sqft / SQFT_PER_MARLA
  return marla % 1 === 0 ? marla : Math.round(marla * 100) / 100
}

/** Covered area in Marla, with sqft alongside — how this market actually quotes area. */
export function formatArea(sqft: number | null | undefined) {
  if (!sqft) return null
  return `${sqftToMarla(sqft)} Marla (${sqft.toLocaleString('en-US')} sq ft)`
}
