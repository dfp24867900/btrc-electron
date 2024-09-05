import { timezoneList } from '@/common/timezone'

type Timezone = typeof timezoneList[number]

interface timezoneStore {
  timezone: Timezone
}

export { timezoneStore, Timezone }
