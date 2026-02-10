import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Pig, Paricion } from "../../types/pigTypes";
import { baseURL } from "../baseURL";

export const pigsApi = createApi({
  reducerPath: "pigsApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${baseURL}` }),
  tagTypes: ["Pigs"],

  endpoints: (builder) => ({
    // LISTA COMPLETA DE CERDOS
    getAllPigsArray: builder.query<Pig[], { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 }) => `pigs?page=${page}&limit=${limit}`,
      transformResponse: (response: { data: Pig[] }) => response.data,
      providesTags: ["Pigs"], // tag general para listas
    }),

    // LISTA PAGINADA
    getAllPigsPaginated: builder.query<
      { data: Pig[]; total: number; page: number; totalPages: number },
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 }) => `pigs?page=${page}&limit=${limit}`,
      providesTags: ["Pigs"],
    }),

    // Cerdas servidas o en gestación
    getServidasOGestacion: builder.query<Pig[], void>({
      query: () => `pigs/servidas-gestacion`,
      providesTags: ["Pigs"], // invalidar lista general cuando se actualice alguna cerda
    }),

    // DETALLE DE CERDA POR ID
    getPigById: builder.query<Pig, string>({
      query: (id) => `pigs/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Pigs", id }],
    }),

    // DETALLE POR NRO DE CARAVANA
    getPigByCaravana: builder.query<Pig, number>({
      query: (nroCaravana) => `pigs/caravana/${nroCaravana}`,
      providesTags: (_result, _error, nroCaravana) => [{ type: "Pigs", id: nroCaravana }],
    }),

    // CREAR CERDA
    createAPig: builder.mutation<Pig, Partial<Pig>>({
      query: (newPig) => ({
        url: `pigs`,
        method: "POST",
        body: newPig,
      }),
      invalidatesTags: ["Pigs"], // refetch de listas
    }),

    // ACTUALIZAR CERDA
    updatePigById: builder.mutation<Pig, { id: string; data: Partial<Pig> }>({
      query: ({ id, data }) => ({
        url: `pigs/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Pigs", id }, // invalidar detalle individual
        "Pigs",               // invalidar listas generales
      ],
    }),

    // ELIMINAR CERDA
    deletePigById: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `pigs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Pigs", id },
        "Pigs",
      ],
    }),

    // AGREGAR PARICIÓN
    addParicion: builder.mutation<Pig, { pigId: string; data: Paricion }>({
      query: ({ pigId, data }) => ({
        url: `pigs/${pigId}/pariciones`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (_result, _error, { pigId }) => [
        { type: "Pigs", id: pigId },
        "Pigs",
      ],
    }),

    // ACTUALIZAR PARICIÓN
    patchParicion: builder.mutation<
      Pig,
      { pigId: string; paricionId: string; data: Partial<Paricion> }
    >({
      query: ({ pigId, paricionId, data }) => ({
        url: `pigs/${pigId}/pariciones/${paricionId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { pigId }) => [
        { type: "Pigs", id: pigId },
        "Pigs",
      ],
    }),

    // ELIMINAR PARICIÓN
    deleteParicion: builder.mutation<Pig, { pigId: string; paricionId: string }>({
      query: ({ pigId, paricionId }) => ({
        url: `pigs/${pigId}/pariciones/${paricionId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { pigId }) => [
        { type: "Pigs", id: pigId },
        "Pigs",
      ],
    }),


    //VACUNAS
    vacunarPig: builder.mutation<Pig, { pigId: string; vacunaId: string, fechaVacunacion: string }>({
      query: ({ pigId, vacunaId, fechaVacunacion }) => ({
        url: `pigs/${pigId}/addvacuna/${vacunaId}`,
        method: "PATCH",
        body:
          { vacuna: vacunaId, fechaVacunacion },
      }),
      invalidatesTags: (_result, _error, { pigId }) => [
        { type: "Pigs", id: pigId }, // invalidar detalle individual
        "Pigs", // invalidar listas generales
      ],
    }),
    eliminarVacunaDePig: builder.mutation<Pig, { pigId: string; vacunaId: string }>({
      query: ({ pigId, vacunaId }) => ({
        url: `pigs/${pigId}/removevacuna/${vacunaId}`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, { pigId }) => [
        { type: "Pigs", id: pigId },
        "Pigs",
      ],
    }),
  }),
});

export const {
  useGetAllPigsArrayQuery,
  useGetAllPigsPaginatedQuery,
  useGetPigByIdQuery,
  useGetPigByCaravanaQuery,
  useCreateAPigMutation,
  useUpdatePigByIdMutation,
  useDeletePigByIdMutation,
  useAddParicionMutation,
  usePatchParicionMutation,
  useDeleteParicionMutation,
  useGetServidasOGestacionQuery,
  useVacunarPigMutation,
  useEliminarVacunaDePigMutation
} = pigsApi;
