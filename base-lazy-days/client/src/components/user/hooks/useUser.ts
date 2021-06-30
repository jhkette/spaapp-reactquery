import { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import type { User } from '../../../../../shared/types';
import { axiosInstance, getJWTHeader } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';
import {
  clearStoredUser,
  getStoredUser,
  setStoredUser,
} from '../../../user-storage';

// UseUsers RESPONSIBILITY IS TO MAINTAIN THE USER STATE, BOTH IN
// THE QUERY CACHE AND LOCALSTORAGE. IE WHEN USER SIGNS IN localstorage is updated ,
// data added to cache same for when user updates data. Removes data from
// local storage on sign out and removes data and disable userQuery

async function getUser(user: User | null): Promise<User | null> {
  if (!user) return null;
  const { data } = await axiosInstance.get(`/user/${user.id}`, {
    headers: getJWTHeader(user),
  });
  return data.user;
}

interface UseUser {
  user: User | null;
  updateUser: (user: User) => void;
  clearUser: () => void;
}

export function useUser(): UseUser {
  const [user, setUser] = useState<User | null>(getStoredUser());
  const queryClient  = useQueryClient()
  // rare case where we don't need dependency array.

  useQuery(queryKeys.user, () => getUser(user), {
    // only enable if user is truthy - so don't run if user is falsy. We booleanise
    // user here. user is not not falsy
    enabled: !!user,
    // setting the user state on success. Making sure user state
    // is consistent with data on the server. Here, unusually we don't care about
    // the return value. We are using data to set the local state.
    onSuccess: (data) => setUser(data),
  });

  // meant to be called from useAuth
  function updateUser(newUser: User): void {
    // set user in state
    setUser(newUser);

    // update user in localstorage
    setStoredUser(newUser);
     
    // pre-populate user profile in React Query client
    // react query is storing our user info. So we are setting query data
    // on the query client that updates cache
    queryClient.setQueryData(queryKeys.user, newUser)
  }

  // meant to be called from useAuth
  function clearUser() {
    // update state
    setUser(null);

    // remove from localstorage
    clearStoredUser();

    //  reset user to null in query client
    // again react query is storing our user info. So we are setting query data
    // on the query client that updates cache
    queryClient.setQueryData(queryKeys.user, null)
    // query for userAppointments is dependent on user state.
    // here we remove the user-appointments query from the cache
    // because the user has logged out.
    queryClient.removeQueries([queryKeys.appointments, queryKeys.user])
  }

  return { user, updateUser, clearUser };
}
