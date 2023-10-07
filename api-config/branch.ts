import { HttpClient } from "api-config"


export const getBranches = () =>  HttpClient.get('/branch')

