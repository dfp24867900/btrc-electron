type PilotOption = {
  pilotId: number
  pilotName: string
  planeId: string
}

interface IRecord {
  id: number
  eventName: string
  eventSource: string
  eventType: string
  eventStartTime: number
  eventEndTime: number
  allIndex: { name: string; dataValue: string }[]
  flightDifficulty: string
  flightIntensity: string
}

interface KeyEventReq {
  eventName: string
  eventSource: string
  eventType: string | null
  eventStartTime: number | null
  eventEndTime: number | null
  flightIntensity: string | null
  flightDifficulty: string | null
  indexComputeId: string | null
}

export { PilotOption, IRecord, KeyEventReq }
