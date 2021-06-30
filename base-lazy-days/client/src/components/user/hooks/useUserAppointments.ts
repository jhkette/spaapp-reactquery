import dayjs from 'dayjs';
import { useQuery } from 'react-query';
import type { Appointment, User } from '../../../../../shared/types';
import { axiosInstance, getJWTHeader } from '../../../axiosInstance';
import { mockUserAppointments } from '../../../mocks/mockData';
import { queryKeys } from '../../../react-query/constants';
import { UserAppointments } from '../UserAppointments';
import { useUser } from './useUser';

// for when we need a query function for useQuery
async function getUserAppointments(
  user: User | null,
): Promise<Appointment[] | null> {
  if (!user) return null;
  const { data } = await axiosInstance.get(`/user/${user.id}/appointments`, {
    headers: getJWTHeader(user),
  });
  return data.appointments;
}

export function useUserAppointments(): Appointment[] {
  const { user } = useUser();
  const fallback: Appointment[] = [];
  const { data: userAppointments = fallback } = useQuery(
    // these are the querykeys, so anytimes these changes
    [queryKeys.appointments , queryKeys.user, user?.id],
    () => getUserAppointments(user),
    {
      // if user is truthy enabled will be true if falsy enable will
      enabled: !!user,
    },
  );
  return userAppointments;
}
