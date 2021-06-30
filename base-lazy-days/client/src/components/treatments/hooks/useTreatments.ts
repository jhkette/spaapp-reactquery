import type { Treatment } from '../../../../../shared/types';
import { axiosInstance } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';

import { useQuery, useQueryClient } from 'react-query';
// for when we need a query function for useQuery
async function getTreatments(): Promise<Treatment[]> {
  const { data } = await axiosInstance.get('/treatments');
  return data;
}
// we are storing are query keys in a  sperate file
// as an object- in this case we are using treatments
export function useTreatments(): Treatment[] {
 
  const fallBack = [];
  const { data = fallBack } = useQuery(queryKeys.treatments, getTreatments, {
    staleTime: 60000,
    cacheTime: 90000,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false
  });
  return data;
}

export function usePrefetchTreatment():void{
  const queryClient = useQueryClient();
  queryClient.prefetchQuery(queryKeys.treatments, getTreatments)
}