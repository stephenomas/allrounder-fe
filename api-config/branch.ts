import { HttpClient } from "api-config"
import { Branch } from "types"

export const getBranches = (page : number) =>  HttpClient.get('/branch', {page})

export const addBranch = (params : Branch) => HttpClient.post('/branch', params)

export const updateBranch = (params : Branch) => HttpClient.put(`/branch/${params.id}`, params)

export const toggleBranch = (params: Branch) => HttpClient.post(`/branch/${params.id}/toggle`,{});