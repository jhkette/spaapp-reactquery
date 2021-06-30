import { useMutation, UseMutateFunction, useQueryClient } from 'react-query';
import { Appointment } from '../../../../../shared/types';
import { axiosInstance } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';
import { useCustomToast } from '../../app/hooks/useCustomToast';
import { useUser } from '../../user/hooks/useUser';


// for when we need functions for useMutation
async function setAppointmentUser(
  appointment: Appointment,
  userId: number | undefined,
): Promise<void> {
  if (!userId) return;
  const patchOp = appointment.userId ? 'replace' : 'add';
  const patchData = [{ op: patchOp, path: '/userId', value: userId }];
  await axiosInstance.patch(`/appointment/${appointment.id}`, {
    data: patchData,
  });
}

// // TODO: update type for React Query mutate function
// type AppointmentMutationFunction = (appointment: Appointment) => void;

// mutation function returned has a UseMutateFunction type
// takes ----- - Tdata, Terror, Tvariables, Tcontext as params
// this is for us data, unknown, Appointment, unknown
export function useReserveAppointment(): UseMutateFunction<void, unknown, Appointment, unknown> {
  const { user } = useUser();
  const toast = useCustomToast();
  const queryClient = useQueryClient()

  const {mutate} =useMutation((appointment: Appointment) => setAppointmentUser(appointment, user?.id), {
    onSuccess: () => {
       // invalidate query
      // marks query as stale
      // triggers reftech if query currently being rendered
      // appointments is the query key. it takes a query key prefix
      queryClient.invalidateQueries([queryKeys.appointments])
      // toast success message
      toast({
        title: 'You have reserved the appointment',
        status: 'success'
      })
    }
  })
  

  return mutate
}
