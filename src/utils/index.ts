import axios from "axios";
import * as crypto from "crypto";
import appConfig from "config";
import _ from "lodash";
export const pkg = require("../../package.json");
const notifyPrefix = pkg.name;

export function getIp(ctx) {
  try {
    if (ctx.realIp) return ctx.realIp;
    // console.log('headers', ctx.request.headers);
    const forwarded = ctx.request.headers["x-forwarded-for"];
    const ip = (forwarded?.replace(/\[ '|' \]/g, "")?.split(",") || [])[0];
    const res = ip || ctx.ip || ctx.ips[0];
    // console.log('forwarded:', forwarded, 'ip:', res);
    return res;
  } catch (error) {
    console.error("getIp error", error);
  }
}

export function md5(data: string, encoding: "hex" | "base64" = "hex") {
  const hash = crypto.createHash("md5");
  return hash.update(data).digest(encoding);
}

export function sleep(mSeconds = 1000) {
  return new Promise((reslove) => {
    setTimeout(() => {
      reslove(true);
    }, mSeconds);
  });
}

const defalutHeaders = {
  "Content-Type": "application/json",
  "user-agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.54 Safari/537.36",
};
let queryErrorCount = 0;
let queryErrorMap = {};

export async function post(
  url: string,
  body = {},
  retryCount = 3,
  options: {
    headers?: any;
    logger?: any;
    isJson?: boolean;
    timeout?: number;
    useProxy?: boolean;
  } = {}
) {
  //TODO 全局代理影响
  // process.env.HTTPS_PROXY = '';
  // process.env.HTTP_PROXY = '';

  const headers = Object.assign({}, defalutHeaders, options.headers);
  options = Object.assign(
    { timeout: 10000, isJson: true, useProxy: false },
    options,
    { headers }
  );
  let res;
  try {
    const reqConfig: any = {
      headers: options.headers,
      timeout: options.timeout,
    };
    res = await axios.post(url, body, reqConfig);
    if (options.isJson) {
      return res.data;
    } else {
      return _.isString(res.data) ? res.data : JSON.stringify(res.data);
    }
  } catch (error) {
    const text = JSON.stringify(error.response?.data || error.message);
    queryErrorCount++;
    if (!queryErrorMap[url]) queryErrorMap[url] = 0;
    queryErrorMap[url]++;
    if (queryErrorCount > 200) {
      queryErrorCount = 0;
      notify(
        `queryErrorCount greater than 200, queryErrorMap: ${JSON.stringify(
          queryErrorMap
        )} ${text}`
      );
      queryErrorMap = {};
    }
    if (options.logger && options.logger.warn)
      options.logger.warn(
        "post error:" + url + text + " retryCount " + retryCount
      );
    if (retryCount === 0) {
      throw new Error(text);
    }
    await sleep((6 - retryCount) * 1000);
    return await post(url, body, --retryCount, options);
  }
}

export async function get(
  url: string,
  query = {},
  retryCount = 3,
  options: {
    headers?: any;
    logger?: any;
    isJson?: boolean;
    timeout?: number;
    useProxy?: boolean;
  } = {}
) {
  const headers = Object.assign({}, defalutHeaders, options.headers);
  options = Object.assign(
    { timeout: 10000, isJson: true, useProxy: false },
    options,
    { headers }
  );
  let res;
  try {
    const reqConfig: any = {
      headers: options.headers,
      timeout: options.timeout,
      params: query,
    };
    res = await axios.get(url, reqConfig);
    if (options.isJson) {
      return res.data;
    } else {
      return _.isString(res.data) ? res.data : JSON.stringify(res.data);
    }
  } catch (error) {
    const text = JSON.stringify(error.response?.data || error.message);
    if (options.logger && options.logger.warn)
      options.logger.warn("get error:" + text + " retryCount " + retryCount);
    if (retryCount === 0) {
      throw new Error(text);
    }
    await sleep();
    return await get(url, query, --retryCount, options);
  }
}

export async function notify(text) {
  const url = appConfig?.notify?.url || appConfig?.notification?.url;
  if (url) {
    if (text?.length > 1000) text = text.slice(0, 1000) + " ...";
    const blocks = [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: notifyPrefix + " error:" + text,
        },
      },
    ];
    notifyByBlocks(url, blocks);
  }
}

export async function notifyByBlocks(url, blocks, errorName = "") {
  post(url, { blocks }, 1, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    isJson: false,
  }).catch((error) =>
    console.log(url, errorName || "notifyByBlocks error", error)
  );
}
