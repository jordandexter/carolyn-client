
const BASE_URL = "http://localhost:8000"

export const api_get = async (endpoint: string, payload?: any) => {
    try {
        console.log("GET", endpoint)
        console.log("Payload: ", payload)

        const queryParams = new URLSearchParams(payload).toString()
        let url = `${BASE_URL}${endpoint}`
        if (queryParams)
            url += `?${queryParams}`

        const response = await fetch(url, {
            method: "GET"
        })

        const contentType = response.headers.get('content-type')
        if (contentType?.startsWith('image/')) {
            return response.blob()
        }
        if (contentType?.startsWith('applications/')) {
            return response.blob()
        }

        return await response.json()
    } catch (error) {
        console.error("An error has occured: ", error)
    }
}

export const api_post = async (endpoint: string, payload?: any, isFormData?: boolean) => {

    const headers: Record<string, string> = {}

    if (!isFormData) {
        headers["Content-Type"] = "application/json"
    }

    try {
        console.log("POST", endpoint)
        console.log("Payload: ", payload)

        const queryParams = new URLSearchParams(isFormData ? payload.data : payload).toString()
        let url = `${BASE_URL}${endpoint}`
        if (queryParams)
            url += `?${queryParams}`

        const response = await fetch(url, {
            method: "POST",
            headers: headers,
            body: isFormData ? payload.formData : JSON.stringify(payload)
        })

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("An error has occured: ", error)
    }
}
