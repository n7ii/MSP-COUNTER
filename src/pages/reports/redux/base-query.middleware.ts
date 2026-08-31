
import { AxiosError, AxiosRequestConfig, Method } from "axios"
import { api } from "./api.ts"
import {BaseQueryFn} from "@reduxjs/toolkit/query";

interface IAxiosParams {
  url: string
  method: AxiosRequestConfig["method"] | Method
  body?: AxiosRequestConfig["data"]
  params?: AxiosRequestConfig["params"]
}

export const baseQuery: BaseQueryFn<
  IAxiosParams | string,
  unknown,
  unknown
> = async args => {
  try {
    const type = typeof args

    switch (type) {
      case "object": {
        const { url, method, body, params } = args as IAxiosParams
        const result = await api({ url, method, data: body, params })
        return { data: result.data }
      }
      default: {
        const result = await api.get(args as string)
        return { data: result.data }
      }
    }
  } catch (axiosError) {
    let err = axiosError as AxiosError
    return {
      error: {
        status: err.response?.status,
        data: err.response?.data || err.message,
      },
    }
  }
}
