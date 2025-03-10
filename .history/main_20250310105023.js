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

    requestUrl += `chat/completions`;

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
    }

    const body = {
        model: modelName,
        messages: [
            {
                "role": "system",
                "content": finalPrompt,
            },
            {
                "role": "user",
                "content": text,
            }
        ]
    };

    const res = await fetch(requestUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body)
    });

    if (res.ok) {
        let result = await res.json();
        if (result && result.choices && result.choices.length > 0 && result.choices[0].message && result.choices[0].message.content) {
            return result.choices[0].message.content;
        } else {
            throw JSON.stringify(result);
        }
    } else {
        let errorData = await res.json();
        throw `Http Request Error\nHttp Status: ${res.status}\n${JSON.stringify(errorData)}`;
    }
}
