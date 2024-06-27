import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const userApi = createApi({
    reducerPath: 'registeruser',
    baseQuery: fetchBaseQuery(),
    endpoints: (builder) => ({
        allUser: builder.query({
            query: (search) => {
                return {
                    url: `/alluser?searchTerm=${search}`,
                    
                }
            },
        }),
        singleUser: builder.query({
            query: (id) => {
                return {
                    url: `/singleuser/${id}`,
                    method:'Get'
                    
                }
            },
        }),
        updateSingleUser: builder.mutation({
            query: (data) => {
                return {
                    url: '/updateuser',
                    method:'POST',
                    body:data
                    
                }
            },
        }),
        deleteUser: builder.mutation({
            
            query: (id) => {
              
                return {
                    url: `/deleteuser/${id}`,
                    method:'delete'
                }
            },
        }),
        deletemultipleUser: builder.mutation({
            
            query: (data) => {
              
                return {
                    url: '/deletemultipleuser',
                    method:'post',
                    body:data
                }
            },
        }),
        SearchUser: builder.query({

           
            query: (query) => {
                console.log(query)
                return {
                    url: `/searchuser?query=${query}`,
                    
                    
                }
            },
        }),
        newsLetter: builder.mutation({
            
            query: (data) => {
             
                return {
                    url: '/newsletter',
                    method:'post',
                    body:data
                }
            },
        }),
    })

})

export const {
  useAllUserQuery,
  useSingleUserQuery,
  useUpdateSingleUserMutation,
  useDeleteUserMutation,
  useDeletemultipleUserMutation,
  useSearchUserQuery,
  useNewsLetterMutation

} = userApi;

export default userApi;