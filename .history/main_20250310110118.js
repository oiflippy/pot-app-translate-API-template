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

