import axios from "axios";

import { getURL } from "@/lib/url";

export const http = axios.create({
	baseURL: getURL(),
	withCredentials: true,
});
