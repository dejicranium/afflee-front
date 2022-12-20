export default function({ $axios, store, redirect, $cookies }, inject) {
    const api = $axios.create();
    api.setBaseURL(process.env.baseURL || "//localhost:9000/api/v1");
    let obj = {}
    if ($cookies.get('aff-token')) {
        obj = { 'Authorization': `Bearer ${$cookies.get('aff-token')}` }
    }
    api.onRequest((config) => {
        config.headers.common = {...config.headers.common, ...obj }
        config.headers.common["Content-Type"] = "application/json";
    });
    inject("api", api);
}