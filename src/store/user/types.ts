import type { UserInfoRes } from '@/service/modules/users/types';

interface UserState {
  sessionId: string;
  userInfo: UserInfoRes | {};
  userAuth: string[];
}

export type { UserState };
