async function translate(text, from, to, options) {
    const { config, utils } = options;
    const { tauriFetch: fetch } = utils;
    let { requestPath: url, apiKey, modelName, customPrompt } = config;

    // 使用自定义 prompt，如果未设置则使用原文
    let finalPrompt = customPrompt || text;
    let encode_text = encodeURIComponent(finalPrompt.replaceAll("/", "@@"));

    if (url === undefined || url.length === 0) {
        url = "lingva.pot-app.com"
    }
    if (!url.startsWith("http")) {
        url = `https://${url}`;
    }
    

    // 构造请求 URL，包含 apiKey 和 modelName
    const requestUrl = `${url}/api/v1/${from}/${to}/${encode_text}?apiKey=${apiKey}&modelName=${modelName}`;

    const res = await fetch(requestUrl, {
        method: 'GET',
    });

    if (res.ok) {
        let result = res.data;
        const { translation } = result;
        if (translation) {
            return translation.replaceAll("@@", "/");
        } else {
            throw JSON.stringify(result.trim());
        }
    } else {
        throw `Http Request Error\nHttp Status: ${res.status}\n${JSON.stringify(res.data)}`;
    }
}
