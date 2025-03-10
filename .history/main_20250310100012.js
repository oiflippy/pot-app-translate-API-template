async function translate(text, from, to, options) {
    const { config, utils } = options;
    const { tauriFetch: fetch } = utils;
    let { requestPath: url, apiKey, modelName, customPrompt } = config;

    // 使用自定义 prompt，如果未设置则使用原文
    let finalPrompt = customPrompt || text;

    let requestUrl = url;

    // 处理 URL，兼容多种情况
    if (!requestUrl.startsWith("http")) {
        requestUrl = `https://${requestUrl}`;
    }
    if (!requestUrl.endsWith("/")) {
        requestUrl += "/";
    }
    if (!requestUrl.includes("/v1/")) {
        requestUrl += "v1/";
    }

    requestUrl += `chat/completions?apiKey=${apiKey}&model=${modelName}`;

    // 构建 OpenAI 请求体
    const requestBody = {
        model: modelName,
        messages: [{ role: "user", content: finalPrompt }],
    };

    const res = await fetch(requestUrl, {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (res.ok) {
        let result = await res.json();
        if (result &amp;&amp; result.choices &amp;&amp; result.choices.length > 0 &amp;&amp; result.choices[0].message &amp;&amp; result.choices[0].message.content) {
            return result.choices[0].message.content;
        } else {
            throw JSON.stringify(result);
        }
    } else {
        let errorData = await res.json();
        throw `Http Request Error\nHttp Status: ${res.status}\n${JSON.stringify(errorData)}`;
    }
}
