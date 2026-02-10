import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Vacuna } from "../../types/vacunaType";

export const vacunasApi = createApi({
    reducerPath: "vacunasApi",
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:4000/vacunas" }),
    tagTypes: ["Vacunas"],
    endpoints: (builder) => ({
        //lista de vacunas
        getAllVacunas: builder.query<Vacuna[], void>({
            query: () => ``,
            providesTags: ['Vacunas']
        }),
        //get Vacuna by Id
        getVacunaById: builder.query<Vacuna, string>({
            query: (id) => `/${id}`
        }),
        //crear nueva vacuna
        createVacuna: builder.mutation<Vacuna, Partial<Vacuna>>({
            query: (nuevaVacuna) => ({
                url: `/create`,
                method: "POST",
                body: nuevaVacuna
            }),
            invalidatesTags: ['Vacunas']
        }),
        //Editar vacuna
        updateVacuna: builder.mutation<Vacuna, { id: string; data: Partial<Vacuna> }>({
            query: ({ id, data }) => ({
                url: `/update/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [

                { type: "Vacunas", id }, // invalidar detalle individual
                "Vacunas",               // invalidar listas generales
            ],
        }),

        //Eliminar Vacuna
        deleteVacunaById: builder.mutation<{ success: boolean; id: string }, string>({
            query: (id) => ({
                url: `/delete/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: (_result, _error, id) => [
                { type: "Vacunas", id }, // invalidar detalle individual
                "Vacunas", // invalidar listas generales
            ],

        })

    })

})

export const { useGetAllVacunasQuery, useGetVacunaByIdQuery, useCreateVacunaMutation, useUpdateVacunaMutation, useDeleteVacunaByIdMutation } = vacunasApi